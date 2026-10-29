import React, { useState, useEffect, useRef } from "react";
import { useLocation } from "react-router-dom";
import { THEME_C } from "../../utils/theme";

// Import testimonial components lazily to avoid blocking page load
const PvtltdTestimonial = React.lazy(() =>
  import("../PvtltdTestimonial/PvtltdTestimonial")
);
const PvtltdVideoTestimonial = React.lazy(() =>
  import("../PvtltdVideoTestimonial/PvtltdVideoTestimonial")
);
const PvtltdOurclints = React.lazy(() =>
  import("../PvtltdOurclints/PvtltdOurclints")
);
// Theme C (E-25, #209 review of 13 Oct): every page's testimonials are Home's.
const HomeTestimonials = React.lazy(() =>
  import("../Testimonials/Testimonials")
);

// Pages that are NOT service pages — testimonial/social proof sections are hidden here
const NON_SERVICE_PATHS = new Set([
  "/",
  "/contact/us",
  "/blog",
  "/blog/details",
  "/about",
  "/media",
  "/privacy-policy",
  "/terms-conditions",
  "/refund-policy",
  "/confidentiality-policy",
  "/policies/privacy",
  "/policies/terms",
  "/policies/refund",
  "/policies/confidentiality",
  "/login",
  "/signup",
  "/forgot-password",
  "/my-profile",
  // Utility tools page — no testimonials / video / client logos, footer only
  "/pdf-tools",
  // Full reproduction page ships its own testimonials + client logos + contact
  "/company-registration-odisha",
]);

// Routes where the client-logos carousel is hidden (but testimonials/video stay)
const HIDE_CLIENT_LOGOS_PATHS = new Set([
  "/companyregistration-in-odisha",
]);

// Routes where the video testimonial is hidden — client logos move up to sit
// directly after the regular testimonial instead
const HIDE_VIDEO_TESTIMONIAL_PATHS = new Set([
  "/company-registration-consultancy-in-odisha",
  "/trademark-registration-in-odisha",
]);

const isBlogPost = (pathname) => /^\/blog\/.+/.test(pathname);

/**
 * LazyServiceFooterSections
 *
 * Lazy-loads testimonial sections only when:
 * 1. Page is a service page (not in NON_SERVICE_PATHS)
 * 2. Component is about to enter viewport (via Intersection Observer)
 *
 * This prevents heavy YouTube embeds and testimonials from blocking
 * initial page load on service pages.
 */
function LazyServiceFooterSections() {
  const { pathname } = useLocation();
  const [shouldRender, setShouldRender] = useState(false);
  const containerRef = useRef(null);

  // Check if this is a service page. Under Theme C, Home carries the same
  // bottom block as the service pages (#209: "the same on every page,
  // including Home"), so "/" counts as one there.
  const isServicePage =
    (THEME_C && pathname === "/") ||
    (!NON_SERVICE_PATHS.has(pathname) && !isBlogPost(pathname));

  useEffect(() => {
    if (!isServicePage) return;

    // Defer initial render by at least 500ms to let main content fully paint
    const initialTimer = setTimeout(() => {
      setShouldRender(true);
    }, 500);

    return () => clearTimeout(initialTimer);
  }, [isServicePage, pathname]);

  // Also use Intersection Observer as a secondary trigger
  useEffect(() => {
    if (!isServicePage || shouldRender) return;

    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            setShouldRender(true);
            observer.unobserve(entry.target);
          }
        });
      },
      { rootMargin: "100px" }
    );

    if (containerRef.current) {
      observer.observe(containerRef.current);
    }

    return () => {
      if (containerRef.current) {
        observer.unobserve(containerRef.current);
      }
    };
  }, [isServicePage, shouldRender]);

  if (!isServicePage) return null;

  // Theme C (#209, the firm's review of 13 Oct): everything from Testimonials to
  // the bottom of the page is ONE common block, identical on every service page
  // and on Home — Home's testimonials (auto-rotating), then the client logos,
  // then the footer, styled as one band (theme/bottom.css). Pages that rendered
  // their own testimonials and logos above it skip them under Theme C.
  if (THEME_C) {
    return (
      <div ref={containerRef} className="lt-bottom">
        {shouldRender && (
          <React.Suspense fallback={null}>
            <HomeTestimonials />
            {!HIDE_VIDEO_TESTIMONIAL_PATHS.has(pathname) && <PvtltdVideoTestimonial />}
            {!HIDE_CLIENT_LOGOS_PATHS.has(pathname) && <PvtltdOurclints />}
          </React.Suspense>
        )}
      </div>
    );
  }

  return (
    <div ref={containerRef}>
      {shouldRender && (
        <React.Suspense fallback={null}>
          <PvtltdTestimonial />
          {!HIDE_VIDEO_TESTIMONIAL_PATHS.has(pathname) && <PvtltdVideoTestimonial />}
          {!HIDE_CLIENT_LOGOS_PATHS.has(pathname) && <PvtltdOurclints />}
        </React.Suspense>
      )}
    </div>
  );
}

export default LazyServiceFooterSections;
