import { Link } from "react-router-dom";
import "./NotFound.css";

/**
 * #175 — 404 page.
 *
 * The site previously had NO catch-all route, so an unknown URL rendered the
 * header and footer around an empty middle and returned HTTP 200. That is a
 * "soft 404": the visitor sees a broken-looking page with no way forward, and
 * Google keeps every dead URL indexed as a thin duplicate, which drags ranking
 * down across the site.
 *
 * This is a NEW page — it changes no existing page's content or design.
 * `noindex` tells crawlers not to index it (a real 404 status is not possible
 * from a static host serving an SPA; noindex is the standard substitute).
 */
export default function NotFound() {
  return (
    <>
      <title>Page Not Found | Legal Terminus</title>
      <meta name="robots" content="noindex,follow" />
      <main className="lt-nf">
        <div className="lt-nf__inner">
          <p className="lt-nf__code">404</p>
          <h1 className="lt-nf__title">We couldn&rsquo;t find that page</h1>
          <p className="lt-nf__text">
            The page you&rsquo;re looking for may have moved or no longer exists.
            Here are some of the things we help with most often.
          </p>

          <div className="lt-nf__links">
            <Link to="/private-limited-company-registration-in-india">Company Registration</Link>
            <Link to="/gst-registration">GST Registration</Link>
            <Link to="/trademark/application">Trademark Registration</Link>
            <Link to="/gst-return-filing">GST Return Filing</Link>
            <Link to="/blog">Blog</Link>
            <Link to="/contact/us">Contact Us</Link>
          </div>

          <Link className="lt-nf__home" to="/">Back to home</Link>
        </div>
      </main>
    </>
  );
}
