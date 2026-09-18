import { useEditor, EditorContent, type Editor } from '@tiptap/react';
import StarterKit from '@tiptap/starter-kit';
import { Table, TableRow, TableCell, TableHeader } from '@tiptap/extension-table';
import { Link } from '@tiptap/extension-link';
import { TextStyle, FontSize } from '@tiptap/extension-text-style';
import { Color } from '@tiptap/extension-color';
import { Highlight } from '@tiptap/extension-highlight';
import { useEffect, useRef } from 'react';
import {
  Bold, Italic, Strikethrough, List, ListOrdered, Table as TableIcon, Undo2, Redo2,
  Baseline, Highlighter, Type,
} from 'lucide-react';

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
 * Pasted IMAGES are deliberately not supported yet (phase 2) — that needs upload
 * + storage rather than inlining base64 blobs into a comment.
 *
 * #194 — adds text COLOUR (red for urgent, amber for important), HIGHLIGHT, three
 * text SIZES, and a 1,000-word limit. The limit is advisory here and enforced on
 * the server (see the security note above): this component can be bypassed by
 * posting straight to the API, so the editor shows the count and stops typing,
 * while the API is what actually rejects an oversized comment.
 */

/** #194: maximum words per comment. Shared with the server rule. */
export const COMMENT_WORD_LIMIT = 1000;

/** Words in a rich-text value, counted on the PLAIN text (markup isn't content). */
export function countWords(text: string) {
  const t = text.replace(/\s+/g, ' ').trim();
  return t ? t.split(' ').length : 0;
}
export default function RichTextEditor({ value, onChange, placeholder, disabled, ariaLabel, rows = 3 }: {
  value: string;
  onChange: (html: string) => void;
  placeholder?: string;
  disabled?: boolean;
  ariaLabel?: string;
  /** Approximate minimum height, in text rows. */
  rows?: number;
}) {
  // #194: handleKeyDown needs the editor instance, which doesn't exist yet inside
  // its own config — a ref breaks that cycle.
  const editorRef = useRef<Editor | null>(null);
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
    ],
    content: value || '',
    editable: !disabled,
    onUpdate: ({ editor: e }) => {
      const html = e.getHTML();
      // TipTap represents "empty" as <p></p>; normalise so callers can test truthiness.
      onChange(e.getText().trim() ? html : '');
    },
    editorProps: {
      // #194: stop ADDING text once the cap is hit. Deletion, arrows, copy and
      // shortcuts still work — only a keystroke that would insert a character is
      // blocked, so the editor never traps someone in an over-long comment.
      handleKeyDown: (_view, event) => {
        if (event.ctrlKey || event.metaKey || event.altKey) return false;
        if (event.key.length !== 1) return false; // Backspace, arrows, Tab, Enter…
        const ed = editorRef.current;
        if (!ed) return false;
        const { from, to } = ed.state.selection;
        if (from !== to) return false; // replacing a selection can't grow the count
        return countWords(ed.getText()) >= COMMENT_WORD_LIMIT;
      },
      attributes: {
        class: 'prose-sm max-w-none focus:outline-none px-3 py-2',
        style: `min-height:${Math.max(2, rows) * 1.5}rem`,
        ...(ariaLabel ? { 'aria-label': ariaLabel } : {}),
        role: 'textbox',
        'aria-multiline': 'true',
      },
    },
  });

  // Keep the editor in sync when the value is reset externally (e.g. after send,
  // or when a saved draft is restored).
  useEffect(() => {
    if (!editor) return;
    const current = editor.getHTML();
    const next = value || '';
    // Compare rendered HTML to avoid clobbering the caret on every keystroke.
    if (next !== current && !(next === '' && editor.getText().trim() === '')) {
      editor.commands.setContent(next, { emitUpdate: false });
    }
  }, [value, editor]);

  useEffect(() => { editor?.setEditable(!disabled); }, [disabled, editor]);
  useEffect(() => { editorRef.current = editor ?? null; }, [editor]);

  if (!editor) return null;

  return (
    <div className={`rounded-lg border border-gray-300 bg-white focus-within:ring-2 focus-within:ring-brand-400 ${disabled ? 'opacity-60' : ''}`}>
      <Toolbar editor={editor} disabled={disabled} />
      <EditorContent editor={editor} />
      {/* Placeholder — TipTap has an extension for this, but a CSS-free fallback
          keeps the dependency surface small. */}
      {placeholder && !editor.getText().trim() && (
        <p className="px-3 pb-2 -mt-6 text-sm text-ink-faint pointer-events-none">{placeholder}</p>
      )}
      {/* #194: the word count appears only near the cap — a permanent counter on
          every comment box would be noise for the short comments that are the norm. */}
      {(() => {
        const words = countWords(editor.getText());
        if (words < COMMENT_WORD_LIMIT * 0.8) return null;
        const atLimit = words >= COMMENT_WORD_LIMIT;
        return (
          <p className={`px-3 pb-1.5 text-[11px] text-right ${atLimit ? 'text-red-600 font-medium' : 'text-ink-faint'}`}>
            {words} / {COMMENT_WORD_LIMIT} words{atLimit ? ' — limit reached' : ''}
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

function Toolbar({ editor, disabled }: { editor: Editor; disabled?: boolean }) {
  const Btn = ({ on, active, title, children }: {
    on: () => void; active?: boolean; title: string; children: React.ReactNode;
  }) => (
    <button
      type="button"
      onClick={on}
      disabled={disabled}
      title={title}
      aria-label={title}
      aria-pressed={!!active}
      className={`p-1.5 rounded hover:bg-surface-soft disabled:opacity-40 ${active ? 'bg-surface-soft text-brand-700' : 'text-ink-muted'}`}
    >
      {children}
    </button>
  );

  return (
    <div className="flex flex-wrap items-center gap-0.5 border-b border-hairline px-1.5 py-1">
      <Btn on={() => editor.chain().focus().toggleBold().run()} active={editor.isActive('bold')} title="Bold">
        <Bold className="w-3.5 h-3.5" />
      </Btn>
      <Btn on={() => editor.chain().focus().toggleItalic().run()} active={editor.isActive('italic')} title="Italic">
        <Italic className="w-3.5 h-3.5" />
      </Btn>
      <Btn on={() => editor.chain().focus().toggleStrike().run()} active={editor.isActive('strike')} title="Strikethrough">
        <Strikethrough className="w-3.5 h-3.5" />
      </Btn>
      <span className="w-px h-4 bg-hairline mx-1" />
      <Btn on={() => editor.chain().focus().toggleBulletList().run()} active={editor.isActive('bulletList')} title="Bullet list">
        <List className="w-3.5 h-3.5" />
      </Btn>
      <Btn on={() => editor.chain().focus().toggleOrderedList().run()} active={editor.isActive('orderedList')} title="Numbered list">
        <ListOrdered className="w-3.5 h-3.5" />
      </Btn>
      <span className="w-px h-4 bg-hairline mx-1" />
      {/* #194: text COLOUR — red for urgent/critical, amber for important. Kept to
          a short fixed set rather than a full picker: these are semantic emphasis
          choices for instructions, not free-form design, and a fixed set stays
          legible against the comment background and survives server sanitising. */}
      {TEXT_COLORS.map((c) => (
        <Btn
          key={c.value}
          on={() => editor.chain().focus().setColor(c.value).run()}
          active={editor.isActive('textStyle', { color: c.value })}
          title={`Text colour: ${c.label}`}
        >
          <Baseline className="w-3.5 h-3.5" style={{ color: c.value }} />
        </Btn>
      ))}
      <Btn
        on={() => editor.chain().focus().unsetColor().run()}
        title="Text colour: default"
      >
        <Baseline className="w-3.5 h-3.5" />
      </Btn>
      {/* Highlight — the "marker pen" for drawing the eye to a line. */}
      {HIGHLIGHTS.map((h) => (
        <Btn
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
          className="text-[11px] rounded border border-hairline bg-white py-0.5 px-1 text-ink-muted disabled:opacity-40"
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
      <Btn
        on={() => editor.chain().focus().insertTable({ rows: 3, cols: 3, withHeaderRow: true }).run()}
        active={editor.isActive('table')}
        title="Insert table"
      >
        <TableIcon className="w-3.5 h-3.5" />
      </Btn>
      <span className="ml-auto inline-flex items-center gap-0.5">
        <Btn on={() => editor.chain().focus().undo().run()} title="Undo"><Undo2 className="w-3.5 h-3.5" /></Btn>
        <Btn on={() => editor.chain().focus().redo().run()} title="Redo"><Redo2 className="w-3.5 h-3.5" /></Btn>
      </span>
    </div>
  );
}
