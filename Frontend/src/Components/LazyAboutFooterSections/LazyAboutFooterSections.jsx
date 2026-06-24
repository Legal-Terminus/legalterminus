import React, { useState, useEffect, useRef } from "react";

// Use the same generic testimonial sections shown on the service pages
const PvtltdTestimonial = React.lazy(() =>
  import("../PvtltdTestimonial/PvtltdTestimonial")
);
const PvtltdVideoTestimonial = React.lazy(() =>
  import("../PvtltdVideoTestimonial/PvtltdVideoTestimonial")
);

/**
 * LazyAboutFooterSections
 * 
 * Defers rendering of testimonial sections until user has scrolled down
 * or after an initial delay, preventing page load blocking.
 */
function LazyAboutFooterSections() {
  const [shouldRender, setShouldRender] = useState(false);
  const containerRef = useRef(null);

  useEffect(() => {
    // Defer initial render by at least 500ms to let main content fully paint
    const initialTimer = setTimeout(() => {
      setShouldRender(true);
    }, 500);

    return () => clearTimeout(initialTimer);
  }, []);

  // Also use Intersection Observer as a secondary trigger
  useEffect(() => {
    if (shouldRender) return;

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
  }, [shouldRender]);

  return (
    <div ref={containerRef}>
      {shouldRender && (
        <React.Suspense fallback={null}>
          <PvtltdTestimonial />
          <PvtltdVideoTestimonial />
        </React.Suspense>
      )}
    </div>
  );
}

export default LazyAboutFooterSections;
