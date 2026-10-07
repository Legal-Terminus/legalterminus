import { useLayoutEffect, useRef, useState } from 'react';

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

/**
 * How tall a comment may be before it is folded behind "Read more".
 *
 * #194: a comment may run to 1,000 words. Shown in full, one long comment pushes
 * the rest of the activity or discussion off the screen; the firm asked for a
 * "Read more". Short comments are never folded — the check is on rendered
 * height, so a table or a list counts for what it actually occupies.
 */
const COLLAPSED_MAX_PX = 240;

export default function RichText({ html, className = '', collapsible = true }: {
  html: string;
  className?: string;
  /** Fold long content behind "Read more". On by default; pass false to always show everything. */
  collapsible?: boolean;
}) {
  const ref = useRef<HTMLDivElement | HTMLParagraphElement | null>(null);
  const [overflows, setOverflows] = useState(false);
  const [expanded, setExpanded] = useState(false);

  // Measure after layout: only content that is actually taller than the fold
  // gets a toggle. Re-measured when the content changes.
  useLayoutEffect(() => {
    const el = ref.current;
    if (!el || !collapsible) return;
    setOverflows(el.scrollHeight > COLLAPSED_MAX_PX + 24);
  }, [html, collapsible]);

  if (!html) return null;

  const folded = collapsible && overflows && !expanded;
  const foldStyle = folded ? { maxHeight: COLLAPSED_MAX_PX, overflow: 'hidden' as const } : undefined;

  const content = !looksLikeHtml(html) ? (
    // Legacy plain-text comment — preserve newlines, no HTML interpretation.
    <p
      ref={ref as React.RefObject<HTMLParagraphElement>}
      style={foldStyle}
      className={`whitespace-pre-wrap break-words ${className}`}
    >
      {html}
    </p>
  ) : (
    <div
      ref={ref as React.RefObject<HTMLDivElement>}
      style={foldStyle}
      className={`rich-text break-words ${className}`}
      // Safe: server-sanitised on write with a strict allow-list.
      dangerouslySetInnerHTML={{ __html: html }}
    />
  );

  if (!collapsible || !overflows) return content;

  return (
    <div>
      {content}
      <button
        type="button"
        onClick={() => setExpanded((v) => !v)}
        aria-expanded={expanded}
        className="mt-1 min-h-11 sm:min-h-0 text-sm font-medium text-brand-600 hover:underline"
      >
        {expanded ? 'Show less' : 'Read more'}
      </button>
    </div>
  );
}
