import React, { useState, useEffect, useRef } from "react";

/**
 * LazyPageSections
 *
 * Defers rendering of below-the-fold sections to improve initial page load time.
 * - First 2 sections render immediately (above fold)
 * - Remaining sections defer 300ms, then render on viewport intersection
 *
 * Usage:
 *   const sections = [
 *     { key: 'breadcrumb', component: <Breadcrumb /> },
 *     { key: 'tabs', component: <Tabs /> },
 *     { key: 'overview', component: <Overview /> },  // deferOnce after
 *     { key: 'details', component: <Details /> },
 *   ];
 *   <LazyPageSections sections={sections} />
 */
function LazyPageSections({ sections = [] }) {
  const [visibleSections, setVisibleSections] = useState(
    new Set(sections.slice(0, 2).map((s) => s.key))
  );
  const observerRef = useRef(null);

  useEffect(() => {
    if (!observerRef.current) return;

    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            const key = entry.target.getAttribute("data-section-key");
            setVisibleSections((prev) => new Set([...prev, key]));
            observer.unobserve(entry.target);
          }
        });
      },
      { rootMargin: "150px" }
    );

    // Attach observer to sentinel elements
    const sentinels = document.querySelectorAll("[data-section-sentinel]");
    sentinels.forEach((s) => observer.observe(s));

    return () => observer.disconnect();
  }, []);

  // Defer rendering of non-initial sections
  useEffect(() => {
    if (visibleSections.size > 2) return;

    const timer = setTimeout(() => {
      // Pre-render offscreen to trigger lazy loading
      setVisibleSections((prev) => {
        const newSet = new Set(prev);
        // Gradually make more sections visible
        sections.slice(2, 4).forEach((s) => newSet.add(s.key));
        return newSet;
      });
    }, 300);

    return () => clearTimeout(timer);
  }, [sections, visibleSections.size]);

  return (
    <div>
      {sections.map((section, idx) => (
        <React.Fragment key={section.key}>
          {/* Sentinel for intersection observer */}
          {idx > 1 && (
            <div
              data-section-key={section.key}
              data-section-sentinel
              style={{ height: 0 }}
            />
          )}

          {/* Render section if visible */}
          {visibleSections.has(section.key) ? (
            <React.Suspense fallback={<div />}>{section.component}</React.Suspense>
          ) : (
            <div key={`placeholder-${section.key}`} />
          )}
        </React.Fragment>
      ))}
    </div>
  );
}

export default LazyPageSections;
