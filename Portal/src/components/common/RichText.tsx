/**
 * #122 — render user-authored rich text (comments / discussion messages).
 *
 * SAFETY: the content is sanitised on the SERVER on write (richText.service.js),
 * with a strict allow-list — no script/style/event handlers, and links limited to
 * http(s)/mailto. This component therefore renders stored HTML directly.
 *
 * BACKWARD COMPATIBILITY: every comment written before #122 is PLAIN TEXT. Those
 * must not be fed to dangerouslySetInnerHTML (a stray "<" would break, and a
 * plain-text "<b>" should read literally), so we only treat a value as HTML when
 * it actually looks like markup; otherwise it renders as text with line breaks
 * preserved, exactly as before.
 */
const looksLikeHtml = (s: string) => /<[a-z][\s\S]*>/i.test(s);

export default function RichText({ html, className = '' }: { html: string; className?: string }) {
  if (!html) return null;

  if (!looksLikeHtml(html)) {
    // Legacy plain-text comment — preserve newlines, no HTML interpretation.
    return <p className={`whitespace-pre-wrap break-words ${className}`}>{html}</p>;
  }

  return (
    <div
      className={`rich-text break-words ${className}`}
      // Safe: server-sanitised on write with a strict allow-list.
      dangerouslySetInnerHTML={{ __html: html }}
    />
  );
}
