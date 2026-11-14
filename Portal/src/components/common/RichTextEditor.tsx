import { useEditor, EditorContent, type Editor } from '@tiptap/react';
import StarterKit from '@tiptap/starter-kit';
import { Table, TableRow, TableCell, TableHeader } from '@tiptap/extension-table';
import { Link } from '@tiptap/extension-link';
import { TextStyle, FontSize } from '@tiptap/extension-text-style';
import { Color } from '@tiptap/extension-color';
import { Highlight } from '@tiptap/extension-highlight';
import { useEffect, useRef, useState, useLayoutEffect } from 'react';
import {
  Bold, Italic, Strikethrough, List, ListOrdered, Table as TableIcon, Undo2, Redo2,
  Baseline, Highlighter, Type, ImagePlus, Loader2,
} from 'lucide-react';
import { LtImage } from './ltImageExtension';
import { useCommentImageTaskId } from './commentImageContext';
import { uploadCommentImage, commentImageProblem, COMMENT_IMAGE_TYPES } from '../../api/commentImages';
// #194/#295: the word limits — one copy in shared/, read by the server too.
import { COMMENT_WORD_LIMIT } from '@shared/richText/limits.js';

/**
 * #122 — rich-text editor for workflow comments and discussion messages.
 *
 * Supports the formatting the team actually pastes from Word / Excel / email:
 * bold, italic, strike, lists, headings and TABLES. Pasting formatted content
 * keeps its structure instead of collapsing to plain text.
 *
 * SECURITY: this editor is a convenience, NOT a control. All content is
 * sanitised on the SERVER on write (see richText.service.js) — a client could
 * bypass this component entirely by posting to the API.
 *
 * #122 follow-up — IMAGES. Pasting a screenshot, dropping an image file, or the
 * "Upload image" button uploads the file to the matter and inserts a REFERENCE
 * (`<img data-lt-image>`, no src). Nothing is ever inlined as base64. Images are
 * offered only when the editor knows its matter (prop or CommentImageTaskContext).
 *
 * #194 — adds text COLOUR (red for urgent, amber for important), HIGHLIGHT, three
 * text SIZES, and a word limit (1,000 for a comment; #295: 5,000 for a Chat
 * message, via `wordLimit`). The limit is advisory here and enforced on the
 * server (see the security note above): this component can be bypassed by
 * posting straight to the API, so the editor shows the count and stops typing,
 * while the API is what actually rejects an oversized comment.
 */

/** Words in a rich-text value, counted on the PLAIN text (markup isn't content). */
function countWords(text: string) {
  const t = text.replace(/\s+/g, ' ').trim();
  return t ? t.split(' ').length : 0;
}
/** True when the editor holds nothing worth sending — no text and no image. */
function isBlank(ed: Editor) {
  if (ed.getText().trim()) return false;
  let hasImage = false;
  ed.state.doc.descendants((n) => { if (n.type.name === 'ltImage') hasImage = true; return !hasImage; });
  return !hasImage;
}

/**
 * The files a paste/drop should treat as IMAGES TO UPLOAD. Copying cells from
 * Excel or a passage from Word also puts a picture of the selection on the
 * clipboard; when the clipboard carries real text as HTML, the paste is that
 * content (a table, formatting) and the picture is ignored.
 */
function pastedImageFiles(data: DataTransfer | null): File[] {
  if (!data) return [];
  const files = Array.from(data.files ?? []).filter((f) => f.type.startsWith('image/'));
  if (!files.length) return [];
  const html = data.getData('text/html');
  if (html) {
    const text = html.replace(/<[^>]*>/g, ' ').replace(/&nbsp;/g, ' ').trim();
    if (text) return [];
  }
  return files;
}

/** #200: someone the author can @mention. */
export interface MentionCandidate { name: string; email: string }

export default function RichTextEditor({ value, onChange, placeholder, disabled, ariaLabel, rows = 3, mentions, imageTaskId, wordLimit = COMMENT_WORD_LIMIT, maxHeight }: {
  value: string;
  onChange: (html: string) => void;
  placeholder?: string;
  disabled?: boolean;
  ariaLabel?: string;
  /** Approximate minimum height, in text rows. */
  rows?: number;
  /** #200: when given, typing "@" suggests these people; picking one inserts "@email". */
  mentions?: MentionCandidate[];
  /** #122 follow-up: the matter images are uploaded to. Defaults to CommentImageTaskContext; none → no images. */
  imageTaskId?: string | null;
  /** #295: words allowed (default: a comment's 1,000; a Chat message passes MESSAGE_WORD_LIMIT). */
  wordLimit?: number;
  /**
   * #295: tallest the text area may grow (any CSS length) before it scrolls
   * inside itself. Without it a long message pushed whatever sits below the
   * editor — the Chat's Send button — off a phone screen.
   */
  maxHeight?: string;
}) {
  // #122 follow-up: images need a matter to upload to. The paste/drop handlers
  // are bound once at editor creation, so they read the live values via refs.
  const taskIdForImages = useCommentImageTaskId(imageTaskId);
  const taskIdRef = useRef<string | null>(taskIdForImages);
  const [uploading, setUploading] = useState(0);
  const [imageError, setImageError] = useState<string | null>(null);
  const addImagesRef = useRef<(files: File[]) => void>(() => {});
  // #194: handleKeyDown needs the editor instance, which doesn't exist yet inside
  // its own config — a ref breaks that cycle.
  const editorRef = useRef<Editor | null>(null);
  // #295: read by handleKeyDown, which is bound once at editor creation.
  const wordLimitRef = useRef(wordLimit);
  useEffect(() => { wordLimitRef.current = wordLimit; }, [wordLimit]);

  // #200: the "@query" being typed right before the caret, if any. Refs mirror
  // the state for handleKeyDown, which is bound once at editor creation.
  const [mention, setMention] = useState<{ query: string; from: number } | null>(null);
  const [active, setActive] = useState(0);
  const mentionRef = useRef<typeof mention>(null);
  const matchesRef = useRef<MentionCandidate[]>([]);
  const activeRef = useRef(0);
  const pickRef = useRef<(c: MentionCandidate) => void>(() => {});
  // Records the "@query" under the caret whether or not there is anyone to
  // suggest yet. The colleague list usually arrives AFTER the editor mounts;
  // because the query is already in state, the suggestions appear the moment
  // the list does (`matches` below is derived from both) with nothing to re-run.
  const detectMention = (ed: Editor) => {
    const { $from, from, to } = ed.state.selection;
    if (from !== to) return setMention(null);
    const before = $from.parent.textBetween(Math.max(0, $from.parentOffset - 60), $from.parentOffset, undefined, ' ');
    // Names have spaces ("Asha Rao"), so the query may too — up to 30 chars.
    // When nothing matches the list simply hides, so "@asha please" is safe.
    const m = before.match(/(?:^|\s)@([^\s@][^@\n]{0,29}|)$/);
    if (!m) return setMention(null);
    setMention({ query: m[1], from: from - m[1].length - 1 });
    setActive(0);
  };
  const editor = useEditor({
    extensions: [
      StarterKit.configure({ heading: { levels: [2, 3] } }),
      Table.configure({ resizable: false }),
      TableRow, TableHeader, TableCell,
      Link.configure({ openOnClick: false, autolink: true }),
      // #194: TextStyle carries the colour/size marks; Color and Highlight are the
      // two the team asked for (red/amber emphasis on urgent instructions).
      TextStyle,
      FontSize,
      Color,
      Highlight.configure({ multicolor: true }),
      // The editor is rebuilt if the matter changes (deps below), so node views
      // always resolve images against the matter they were uploaded to.
      LtImage.configure({ taskId: taskIdForImages }),
    ],
    content: value || '',
    editable: !disabled,
    onSelectionUpdate: ({ editor: e }) => detectMention(e),
    onUpdate: ({ editor: e }) => {
      detectMention(e);
      const html = e.getHTML();
      // TipTap represents "empty" as <p></p>; normalise so callers can test truthiness.
      // An image on its own is content (a screenshot needs no caption).
      onChange(isBlank(e) ? '' : html);
    },
    editorProps: {
      // #122 follow-up: a pasted screenshot / dropped image file is uploaded.
      handlePaste: (_view, event) => {
        const files = pastedImageFiles(event.clipboardData);
        if (!files.length || !taskIdRef.current) return false;
        event.preventDefault();
        addImagesRef.current(files);
        return true;
      },
      handleDrop: (_view, event, _slice, moved) => {
        if (moved) return false;
        const files = pastedImageFiles((event as DragEvent).dataTransfer);
        if (!files.length || !taskIdRef.current) return false;
        event.preventDefault();
        addImagesRef.current(files);
        return true;
      },
      // #194: stop ADDING text once the cap is hit. Deletion, arrows, copy and
      // shortcuts still work — only a keystroke that would insert a character is
      // blocked, so the editor never traps someone in an over-long comment.
      handleKeyDown: (_view, event) => {
        // #200: the suggestion list owns ↑/↓/Enter/Tab/Escape while it is open.
        const list = matchesRef.current;
        if (mentionRef.current && list.length) {
          if (event.key === 'ArrowDown') { setActive((activeRef.current + 1) % list.length); return true; }
          if (event.key === 'ArrowUp') { setActive((activeRef.current - 1 + list.length) % list.length); return true; }
          if (event.key === 'Enter' || event.key === 'Tab') { pickRef.current(list[activeRef.current] ?? list[0]); return true; }
          if (event.key === 'Escape') { setMention(null); return true; }
        }
        if (event.ctrlKey || event.metaKey || event.altKey) return false;
        if (event.key.length !== 1) return false; // Backspace, arrows, Tab, Enter…
        const ed = editorRef.current;
        if (!ed) return false;
        const { from, to } = ed.state.selection;
        if (from !== to) return false; // replacing a selection can't grow the count
        return countWords(ed.getText()) >= wordLimitRef.current;
      },
      attributes: {
        class: 'prose-sm max-w-none focus:outline-hidden px-3 py-2',
        style: `min-height:${Math.max(2, rows) * 1.5}rem`,
        ...(ariaLabel ? { 'aria-label': ariaLabel } : {}),
        role: 'textbox',
        'aria-multiline': 'true',
      },
    },
  }, [taskIdForImages]);

  // Keep the editor in sync when the value is reset externally (e.g. after send,
  // or when a saved draft is restored).
  useEffect(() => {
    if (!editor) return;
    const current = editor.getHTML();
    const next = value || '';
    // Compare rendered HTML to avoid clobbering the caret on every keystroke.
    if (next !== current && !(next === '' && isBlank(editor))) {
      editor.commands.setContent(next, { emitUpdate: false });
    }
  }, [value, editor]);

  useEffect(() => { editor?.setEditable(!disabled); }, [disabled, editor]);
  useEffect(() => { editorRef.current = editor ?? null; }, [editor]);
  useEffect(() => { taskIdRef.current = taskIdForImages; }, [taskIdForImages]);

  // #122 follow-up: upload each image, then insert its reference at the caret.
  // Checked here first so a too-big or wrong-type file is refused instantly
  // with a reason; the server enforces the same rules regardless.
  const addImages = async (files: File[]) => {
    const taskId = taskIdRef.current;
    if (!taskId || disabled) return;
    setImageError(null);
    for (const file of files) {
      const problem = commentImageProblem(file);
      if (problem) { setImageError(problem); continue; }
      setUploading((n) => n + 1);
      try {
        const { imageId } = await uploadCommentImage(taskId, file);
        const alt = (file.name && !/^image\.(png|jpe?g|webp)$/i.test(file.name)) ? file.name.slice(0, 120) : 'Pasted image';
        editorRef.current?.chain().focus().insertContent({ type: 'ltImage', attrs: { imageId, alt } }).run();
      } catch (e) {
        setImageError((e as Error)?.message || 'The image could not be uploaded. Please try again.');
      } finally {
        setUploading((n) => n - 1);
      }
    }
  };
  useLayoutEffect(() => { addImagesRef.current = (files) => { void addImages(files); }; });
  const fileInputRef = useRef<HTMLInputElement | null>(null);
  const q = mention?.query.toLowerCase() ?? '';
  const matches = mention && mentions
    ? mentions.filter((c) => c.name.toLowerCase().includes(q) || c.email.includes(q))
    : [];
  const pick = (c: MentionCandidate) => {
    const ed = editorRef.current;
    if (!ed || !mention) return;
    ed.chain().focus().deleteRange({ from: mention.from, to: ed.state.selection.from }).insertContent(`@${c.email} `).run();
    setMention(null);
  };
  const activeIndex = Math.min(active, Math.max(0, matches.length - 1));
  // The editor binds handleKeyDown ONCE, so it reads the live values through
  // refs. They are written after each render commits — a key press can only
  // arrive after that — never during the render itself.
  useLayoutEffect(() => {
    mentionRef.current = mention;
    matchesRef.current = matches;
    activeRef.current = activeIndex;
    pickRef.current = pick;
  });
  // The list shows the WHOLE team and scrolls (it used to stop at six names, so
  // anyone later in the alphabet could not be found without typing). Keep the
  // keyboard-highlighted row in view as ↑/↓ moves through it.
  const listRef = useRef<HTMLUListElement | null>(null);
  useEffect(() => {
    listRef.current?.querySelector('[aria-selected="true"]')?.scrollIntoView({ block: 'nearest' });
  }, [activeIndex, matches.length]);

  if (!editor) return null;

  return (
    <div className={`rounded-lg border border-gray-300 bg-white focus-within:ring-2 focus-within:ring-brand-400 ${disabled ? 'opacity-60' : ''}`}>
      <Toolbar
        editor={editor}
        disabled={disabled}
        onAddImage={taskIdForImages ? () => fileInputRef.current?.click() : undefined}
        uploading={uploading > 0}
      />
      {taskIdForImages && (
        <input
          ref={fileInputRef}
          type="file"
          accept={COMMENT_IMAGE_TYPES.join(',')}
          multiple
          hidden
          data-testid="comment-image-input"
          aria-label="Upload image"
          onChange={(e) => {
            const files = Array.from(e.target.files ?? []);
            e.target.value = ''; // the same file can be chosen again
            if (files.length) void addImages(files);
          }}
        />
      )}
      {uploading > 0 && (
        <p className="px-3 pt-1.5 text-[11px] text-ink-muted inline-flex items-center gap-1" role="status">
          <Loader2 className="w-3 h-3 animate-spin" /> Uploading image…
        </p>
      )}
      {imageError && (
        <p className="px-3 pt-1.5 text-[11px] text-red-600" role="alert">
          {imageError}{' '}
          <button type="button" className="underline" onClick={() => setImageError(null)}>Dismiss</button>
        </p>
      )}
      {maxHeight
        ? <div className="overflow-y-auto overscroll-contain" style={{ maxHeight }} data-testid="rich-text-scroll"><EditorContent editor={editor} /></div>
        : <EditorContent editor={editor} />}
      {/* #200: @mention suggestions, under the box (tap or ↑/↓ + Enter). */}
      {matches.length > 0 && (
        <ul ref={listRef} role="listbox" aria-label="Mention a colleague" className="mx-2 mb-2 max-h-60 overflow-y-auto rounded-lg border border-hairline bg-white shadow-card">
          {matches.map((c, i) => (
            <li key={c.email} role="option" aria-selected={i === activeIndex}>
              <button type="button"
                onMouseDown={(e) => { e.preventDefault(); pick(c); }}
                className={`w-full text-left px-3 py-2.5 text-sm flex flex-col ${i === activeIndex ? 'bg-surface-soft' : 'hover:bg-surface-soft'}`}>
                <span className="font-medium text-ink">{c.name}</span>
                <span className="text-xs text-ink-muted">{c.email}</span>
              </button>
            </li>
          ))}
        </ul>
      )}
      {/* Placeholder — TipTap has an extension for this, but a CSS-free fallback
          keeps the dependency surface small. */}
      {placeholder && isBlank(editor) && (
        <p className="px-3 pb-2 -mt-6 text-sm text-ink-faint pointer-events-none">{placeholder}</p>
      )}
      {/* #194: the word count appears only near the cap — a permanent counter on
          every comment box would be noise for the short comments that are the norm. */}
      {(() => {
        const words = countWords(editor.getText());
        if (words < wordLimit * 0.8) return null;
        const atLimit = words >= wordLimit;
        // #194: exactly at the limit is fine to send; a paste can go OVER it (typing
        // cannot), and then the server will refuse — so say how many to remove
        // rather than leaving the person to find out from an error.
        const over = words - wordLimit;
        return (
          <p className={`px-3 pb-1.5 text-[11px] text-right ${atLimit ? 'text-red-600 font-medium' : 'text-ink-faint'}`}>
            {words.toLocaleString('en-IN')} / {wordLimit.toLocaleString('en-IN')} words
            {over > 0
              ? ` — ${over} over the limit; shorten it before sending`
              : atLimit ? ' — limit reached' : ''}
          </p>
        );
      })()}
    </div>
  );
}

/** #194: fixed, semantic emphasis colours (see the toolbar comment). */
const TEXT_COLORS = [
  { label: 'Red (urgent)', value: '#dc2626' },
  { label: 'Amber (important)', value: '#b45309' },
] as const;

const HIGHLIGHTS = [
  { label: 'Yellow', value: '#fef08a', icon: '#ca8a04' },
  { label: 'Red', value: '#fecaca', icon: '#dc2626' },
] as const;

const TEXT_SIZES = [
  { label: 'Small', value: '0.875rem' },
  { label: 'Normal', value: 'normal' },
  { label: 'Large', value: '1.25rem' },
] as const;

/** Which size the caret is currently in, for the select's value. */
function currentSize(editor: Editor) {
  const size = editor.getAttributes('textStyle')?.fontSize;
  return TEXT_SIZES.some((t) => t.value === size) ? size : 'normal';
}

/**
 * A single toolbar button (E23-S02).
 *
 * Defined at module scope, NOT inside Toolbar: a component declared during
 * render is a brand-new type on every render, so React unmounts and remounts
 * the whole subtree instead of updating it — losing focus and DOM state, and
 * defeating memoisation. `disabled` is therefore passed as a prop rather than
 * captured from the enclosing closure.
 */
function Btn({ on, active, title, disabled, children }: {
  on: () => void; active?: boolean; title: string; disabled?: boolean; children: React.ReactNode;
}) {
  return (
    <button
      type="button"
      onClick={on}
      disabled={disabled}
      title={title}
      aria-label={title}
      aria-pressed={!!active}
      className={`p-1.5 rounded-sm hover:bg-surface-soft disabled:opacity-40 ${active ? 'bg-surface-soft text-brand-700' : 'text-ink-muted'}`}
    >
      {children}
    </button>
  );
}

function Toolbar({ editor, disabled, onAddImage, uploading }: {
  editor: Editor; disabled?: boolean;
  /** #122 follow-up: opens the file picker; absent when images aren't available here. */
  onAddImage?: () => void;
  uploading?: boolean;
}) {
  return (
    <div className="flex flex-wrap items-center gap-0.5 border-b border-hairline px-1.5 py-1">
      <Btn disabled={disabled} on={() => editor.chain().focus().toggleBold().run()} active={editor.isActive('bold')} title="Bold">
        <Bold className="w-3.5 h-3.5" />
      </Btn>
      <Btn disabled={disabled} on={() => editor.chain().focus().toggleItalic().run()} active={editor.isActive('italic')} title="Italic">
        <Italic className="w-3.5 h-3.5" />
      </Btn>
      <Btn disabled={disabled} on={() => editor.chain().focus().toggleStrike().run()} active={editor.isActive('strike')} title="Strikethrough">
        <Strikethrough className="w-3.5 h-3.5" />
      </Btn>
      <span className="w-px h-4 bg-hairline mx-1" />
      <Btn disabled={disabled} on={() => editor.chain().focus().toggleBulletList().run()} active={editor.isActive('bulletList')} title="Bullet list">
        <List className="w-3.5 h-3.5" />
      </Btn>
      <Btn disabled={disabled} on={() => editor.chain().focus().toggleOrderedList().run()} active={editor.isActive('orderedList')} title="Numbered list">
        <ListOrdered className="w-3.5 h-3.5" />
      </Btn>
      <span className="w-px h-4 bg-hairline mx-1" />
      {/* #194: text COLOUR — red for urgent/critical, amber for important. Kept to
          a short fixed set rather than a full picker: these are semantic emphasis
          choices for instructions, not free-form design, and a fixed set stays
          legible against the comment background and survives server sanitising. */}
      {TEXT_COLORS.map((c) => (
        <Btn disabled={disabled}
          key={c.value}
          on={() => editor.chain().focus().setColor(c.value).run()}
          active={editor.isActive('textStyle', { color: c.value })}
          title={`Text colour: ${c.label}`}
        >
          <Baseline className="w-3.5 h-3.5" style={{ color: c.value }} />
        </Btn>
      ))}
      <Btn disabled={disabled}
        on={() => editor.chain().focus().unsetColor().run()}
        title="Text colour: default"
      >
        <Baseline className="w-3.5 h-3.5" />
      </Btn>
      {/* Highlight — the "marker pen" for drawing the eye to a line. */}
      {HIGHLIGHTS.map((h) => (
        <Btn disabled={disabled}
          key={h.value}
          on={() => editor.chain().focus().toggleHighlight({ color: h.value }).run()}
          active={editor.isActive('highlight', { color: h.value })}
          title={`Highlight: ${h.label}`}
        >
          <Highlighter className="w-3.5 h-3.5" style={{ color: h.icon }} />
        </Btn>
      ))}
      <span className="w-px h-4 bg-hairline mx-1" />
      {/* #194: three text SIZES. Applied as a font-size text style (not headings)
          so it composes with bold/colour and doesn't change document structure. */}
      <label className="inline-flex items-center gap-1" title="Text size">
        <Type className="w-3.5 h-3.5 text-ink-muted" />
        <select
          disabled={disabled}
          aria-label="Text size"
          className="text-[11px] rounded-sm border border-hairline bg-white py-0.5 px-1 text-ink-muted disabled:opacity-40"
          value={currentSize(editor)}
          onChange={(e) => {
            const v = e.target.value;
            if (v === 'normal') editor.chain().focus().unsetFontSize().run();
            else editor.chain().focus().setFontSize(v).run();
          }}
        >
          {TEXT_SIZES.map((t) => <option key={t.value} value={t.value}>{t.label}</option>)}
        </select>
      </label>
      <span className="w-px h-4 bg-hairline mx-1" />
      <Btn disabled={disabled}
        on={() => editor.chain().focus().insertTable({ rows: 3, cols: 3, withHeaderRow: true }).run()}
        active={editor.isActive('table')}
        title="Insert table"
      >
        <TableIcon className="w-3.5 h-3.5" />
      </Btn>
      {onAddImage && (
        <Btn disabled={disabled || uploading} on={onAddImage} title="Upload image">
          {uploading ? <Loader2 className="w-3.5 h-3.5 animate-spin" /> : <ImagePlus className="w-3.5 h-3.5" />}
        </Btn>
      )}
      <span className="ml-auto inline-flex items-center gap-0.5">
        <Btn disabled={disabled} on={() => editor.chain().focus().undo().run()} title="Undo"><Undo2 className="w-3.5 h-3.5" /></Btn>
        <Btn disabled={disabled} on={() => editor.chain().focus().redo().run()} title="Redo"><Redo2 className="w-3.5 h-3.5" /></Btn>
      </span>
    </div>
  );
}
