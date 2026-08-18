import { useLocation } from "react-router-dom";
import { SEO_META, SITE_URL, DEFAULT_TITLE, DEFAULT_DESCRIPTION } from "../../data/seoMeta";

/**
 * #175 — per-page <head> metadata. HEAD-ONLY by design: renders no visible DOM,
 * so page content and design are untouched (a hard constraint on this work).
 *
 * React 19 hoists <title>/<meta>/<link> rendered anywhere into document.head,
 * so this needs no helmet library. Mounted ONCE in App.jsx beside the router
 * chrome; it re-renders on navigation via useLocation.
 *
 * Unknown paths (blog posts etc.) fall back to the site-wide defaults — never
 * a missing title. Blog detail pages can layer their own <title> later.
 */
export default function SeoHead() {
  const { pathname } = useLocation();
  // Match with and without a trailing slash so /about/ and /about read the same.
  const key = pathname !== "/" && pathname.endsWith("/") ? pathname.slice(0, -1) : pathname;
  const meta = SEO_META[key];

  const title = meta?.title ?? DEFAULT_TITLE;
  const description = meta?.description ?? DEFAULT_DESCRIPTION;
  const canonical = `${SITE_URL}${key === "/" ? "/" : key}`;

  return (
    <>
      <title>{title}</title>
      <meta name="description" content={description} />
      <link rel="canonical" href={canonical} />
      {meta?.noindex && <meta name="robots" content="noindex,nofollow" />}
      {/* Open Graph / Twitter — used by link previews. NOTE: only crawlers that
          execute JS see these until the site is prerendered (documented risk). */}
      <meta property="og:type" content="website" />
      <meta property="og:site_name" content="Legal Terminus" />
      <meta property="og:title" content={title} />
      <meta property="og:description" content={description} />
      <meta property="og:url" content={canonical} />
      <meta name="twitter:card" content="summary" />
    </>
  );
}
