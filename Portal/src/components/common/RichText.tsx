import { useEffect, useLayoutEffect, useRef, useState } from 'react';
import { useCommentImageTaskId } from './commentImageContext';
import { hydrateCommentImage, openImageFullSize } from './commentImageDom';

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
 *
 * #122 follow-up — IMAGES. Stored content carries `<img data-lt-image="{id}">`
 * with NO src (the server strips any src). After render, each reference is
 * fetched through the authenticated API and shown from an object URL; clicking
 * opens it full size. A missing or forbidden image becomes a small "Image
 * unavailable" note. Object URLs are revoked when the content changes or unmounts.
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

export default function RichText({ html, className = '', collapsible = true, taskId }: {
  html: string;
  className?: string;
  /** Fold long content behind "Read more". On by default; pass false to always show everything. */
  collapsible?: boolean;
  /** The matter the content belongs to, for its images. Defaults to the page's CommentImageTaskContext. */
  taskId?: string | null;
}) {
  const ref = useRef<HTMLDivElement | HTMLParagraphElement | null>(null);
  const [overflows, setOverflows] = useState(false);
  const [expanded, setExpanded] = useState(false);
  const imageTaskId = useCommentImageTaskId(taskId);

  // Measure after layout: only content that is actually taller than the fold
  // gets a toggle. Re-measured when the content changes.
  useLayoutEffect(() => {
    const el = ref.current;
    if (!el || !collapsible) return;
    setOverflows(el.scrollHeight > COLLAPSED_MAX_PX + 24);
  }, [html, collapsible]);

  // #122 follow-up: resolve image references once the HTML is in the DOM.
  useEffect(() => {
    const el = ref.current;
    if (!el || !html.includes('data-lt-image')) return;
    const imgs = Array.from(el.querySelectorAll<HTMLImageElement>('img[data-lt-image]'));
    const cleanups = imgs.map((img) => {
      img.tabIndex = 0; // keyboard: Enter opens it full size, like a click
      img.title = 'Open full size';
      return hydrateCommentImage(img, imageTaskId);
    });
    // An image arriving changes the content's height — re-check the fold.
    const remeasure = () => {
      if (collapsible && ref.current) setOverflows(ref.current.scrollHeight > COLLAPSED_MAX_PX + 24);
    };
    const onClick = (e: Event) => {
      const t = e.target as HTMLElement | null;
      if (t instanceof HTMLImageElement && t.hasAttribute('data-lt-image')) openImageFullSize(t);
    };
    const onKey = (e: KeyboardEvent) => { if (e.key === 'Enter') onClick(e); };
    el.addEventListener('load', remeasure, true);
    el.addEventListener('click', onClick);
    el.addEventListener('keydown', onKey);
    return () => {
      el.removeEventListener('load', remeasure, true);
      el.removeEventListener('click', onClick);
      el.removeEventListener('keydown', onKey);
      cleanups.forEach((c) => c());
    };
  }, [html, imageTaskId, collapsible]);

  if (!html) return null;

  const folded = collapsible && overflows && !expanded;
  const foldStyle = folded ? { maxHeight: COLLAPSED_MAX_PX, overflow: 'hidden' as const } : undefined;

  const content = !looksLikeHtml(html) ? (
    // Legacy plain-text comment — preserve newlines, no HTML interpretation.
    <p
      ref={ref as React.RefObject<HTMLParagraphElement>}
      style={foldStyle}
      className={`whitespace-pre-wrap wrap-break-word ${className}`}
    >
      {html}
    </p>
  ) : (
    <div
      ref={ref as React.RefObject<HTMLDivElement>}
      style={foldStyle}
      className={`rich-text wrap-break-word ${className}`}
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
