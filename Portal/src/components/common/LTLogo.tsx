/**
 * #110 — the Legal Terminus logo, in one place.
 *
 * Every logo across the portal now renders from here rather than from a generic
 * Lucide `Scale` icon, so the brand can never drift between screens again.
 *
 * Two forms, because one asset cannot serve both jobs:
 *   • `mark`     — the square "L⌐" glyph. Inline SVG, so it scales crisply and
 *                  inherits `currentColor` for its dark strokes (the green is
 *                  brand-constant). Use wherever space is square or tight.
 *   • `lockup`   — the full stacked wordmark as a raster asset. Use where there
 *                  is horizontal room: login, sidebar header, page headers.
 *
 * The mark is hand-vectorised from the official raster favicon — the glyph is
 * pure axis-aligned rectangles, so the coordinates are exact rather than traced.
 */

const GREEN = '#27B811';

/**
 * The square "L⌐" mark. Dark strokes follow `currentColor`.
 *
 * The viewBox is cropped to the artwork (not the source's 0 0 100 100) because
 * the glyph only occupies the middle ~53% x 63% of that square — rendered at
 * `w-6 h-6` it came out around 13px, reading as a smudge. Cropping makes the
 * className the real rendered size.
 */
export function LTMark({ className = 'w-5 h-5' }: { className?: string }) {
  return (
    <svg
      viewBox="20 16 57 67"
      className={className}
      role="img"
      aria-label="Legal Terminus"
      fill="none"
    >
      <rect x="22" y="18" width="13" height="6" fill="currentColor" />
      <rect x="37" y="18" width="14" height="6" fill={GREEN} />
      <rect x="54" y="18" width="21" height="6" fill="currentColor" />
      <rect x="37" y="18" width="6" height="62" fill={GREEN} />
      <rect x="46" y="24" width="5" height="47" fill={GREEN} />
      <rect x="54" y="18" width="6" height="53" fill="currentColor" />
      <rect x="37" y="75" width="38" height="6" fill={GREEN} />
    </svg>
  );
}

/**
 * The full stacked lockup. `srcSet` gives retina screens the 960px asset and
 * everything else the 480px one, so the wordmark stays sharp without shipping
 * 30KB to a phone.
 */
export function LTLockup({ className = 'h-8' }: { className?: string }) {
  return (
    <img
      src="/portal/lt-logo@1x.png"
      srcSet="/portal/lt-logo@1x.png 1x, /portal/lt-logo.png 2x"
      alt="Legal Terminus"
      className={className}
      // Intrinsic ratio prevents layout shift while the image loads.
      width={480}
      height={125}
      style={{ width: 'auto' }}
    />
  );
}
