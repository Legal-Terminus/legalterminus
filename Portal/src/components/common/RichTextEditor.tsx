import { useEditor, EditorContent, type Editor } from '@tiptap/react';
import StarterKit from '@tiptap/starter-kit';
import { Table, TableRow, TableCell, TableHeader } from '@tiptap/extension-table';
import { Link } from '@tiptap/extension-link';
import { useEffect } from 'react';
import {
  Bold, Italic, Strikethrough, List, ListOrdered, Table as TableIcon, Undo2, Redo2,
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
 */
export default function RichTextEditor({ value, onChange, placeholder, disabled, ariaLabel, rows = 3 }: {
  value: string;
  onChange: (html: string) => void;
  placeholder?: string;
  disabled?: boolean;
  ariaLabel?: string;
  /** Approximate minimum height, in text rows. */
  rows?: number;
}) {
  const editor = useEditor({
    extensions: [
      StarterKit.configure({ heading: { levels: [2, 3] } }),
      Table.configure({ resizable: false }),
      TableRow, TableHeader, TableCell,
      Link.configure({ openOnClick: false, autolink: true }),
    ],
    content: value || '',
    editable: !disabled,
    onUpdate: ({ editor: e }) => {
      const html = e.getHTML();
      // TipTap represents "empty" as <p></p>; normalise so callers can test truthiness.
      onChange(e.getText().trim() ? html : '');
    },
    editorProps: {
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
    </div>
  );
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
