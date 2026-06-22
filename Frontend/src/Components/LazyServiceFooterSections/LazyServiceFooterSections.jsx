import React, { useState, useEffect, useRef } from "react";
import { useLocation } from "react-router-dom";

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
  // Full reproduction page ships its own testimonials + client logos + contact
  "/company-registration-odisha",
  // Standalone landing page — no global testimonials / client logos
  "/company-registration",
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

  // Check if this is a service page
  const isServicePage =
    !NON_SERVICE_PATHS.has(pathname) && !isBlogPost(pathname);

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

  return (
    <div ref={containerRef}>
      {shouldRender && (
        <React.Suspense fallback={null}>
          <PvtltdTestimonial />
          <PvtltdVideoTestimonial />
          <PvtltdOurclints />
        </React.Suspense>
      )}
    </div>
  );
}

export default LazyServiceFooterSections;
