import React, { useState, useEffect, useRef } from "react";

const DissolavePrivatesTestimonial = React.lazy(() =>
  import("../DissolvePrivateTestimonial/DissolvePrivateTestimonial")
);
const DissolveVideoTestimonial = React.lazy(() =>
  import("../DissolveVideoTestimonial/DissolveVideoTestimonial")
);
const DissolaveOurClients = React.lazy(() =>
  import("../DissolaveOurClients/DissolaveOurClients")
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
          <DissolavePrivatesTestimonial />
          <DissolveVideoTestimonial />
          <DissolaveOurClients />
        </React.Suspense>
      )}
    </div>
  );
}

export default LazyAboutFooterSections;
