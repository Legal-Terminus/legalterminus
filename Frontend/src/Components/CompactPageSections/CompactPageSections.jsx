import React, { Suspense } from 'react'

/**
 * Lazy-load page sub-components using React.lazy + dynamic imports
 * Only the first 2 sections load eagerly; rest defer until needed
 */
const createLazyComponents = (componentImports) => {
  return componentImports.map((importFn, idx) => {
    if (idx < 2) {
      // First 2 components: eager load (above fold)
      return importFn();
    }
    // Rest: lazy load (below fold)
    return React.lazy(importFn);
  });
};

/**
 * CompactPageSections - lightweight lazy-loading wrapper
 * Usage:
 *   const lazyComps = createLazyComponents([
 *     () => import('../../Components/Breadcrumb'),
 *     () => import('../../Components/Tabs'),
 *     () => import('../../Components/Overview'),
 *   ]);
 *   <CompactPageSections components={lazyComps} />
 */
function CompactPageSections({ components = [] }) {
  return (
    <>
      {components.map((Component, idx) => (
        <Suspense key={`section-${idx}`} fallback={<div />}>
          <Component />
        </Suspense>
      ))}
    </>
  );
}

export { createLazyComponents, CompactPageSections };
export default CompactPageSections;
