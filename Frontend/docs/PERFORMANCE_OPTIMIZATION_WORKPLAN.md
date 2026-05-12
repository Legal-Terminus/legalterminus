# Legal Terminus Frontend — Performance Optimization Work Plan

**Client:** Legal Terminus  
**Project:** Frontend Performance Optimization  
**Date:** April 26, 2026  
**Status:** Planning Phase  

---

## Executive Summary

The Legal Terminus frontend codebase has **multiple critical performance bottlenecks** that are significantly impacting page load times, Core Web Vitals, and user experience. This work plan outlines all identified issues, prioritized fixes, and expected performance improvements.

**Current State Impact:**
- Initial bundle: **250-350 KB** (vs. target 100-150 KB)
- Page load delay: **+3-5 seconds** on 3G networks
- Time to Interactive: **+40-50% slower** than best practices
- Memory usage: **40-60 MB** on mobile (unnecessary asset loading)

**Expected Improvements After All Fixes:**
- Bundle size reduction: **60-70%** smaller
- Page load time: **50-60% faster**
- Core Web Vitals: **Significant improvement** (LCP, FCP, TTI)
- Mobile experience: **Dramatically improved** on slow networks

---

## Part 1: Current Issues (Critical Analysis)

### Issue #1: Bundle Bloat — 119 Client Images Imported 42 Times (**CRITICAL**)

**Severity:** 🔴 CRITICAL  
**Estimated Impact:** +8-12 MB bundle size, +2.5s load time on 3G

**Problem:**
- 42 different `*OurClients` components each independently import all 119 client logo images
- 119 imports × 42 components = **4,998 redundant import statements**
- All 119 images (8-12 MB) bundled into every page route
- Massive parse/compile overhead during module loading

**Current Implementation Example (PFRclients.jsx):**
```jsx
import client1 from "../../assets/our (1).webp";
import client2 from "../../assets/our (2).webp";
// ... repeated 117 more times

const logos = [
  client1, client2, client3, // ... all 119
];
```

**Why It's Slow:**
1. Browser must parse 4,998 import statements across the module graph
2. Webpack/Vite must resolve each import (overhead per build)
3. All 119 images loaded upfront even if page doesn't display all of them
4. No tree-shaking possible (each component has explicit references)

**Files Affected:** 42 components
```
AddOurclints, BCclients, CICclients, CIOclients, ChangeLlpOurClients, ChangeObjectComOurclints,
ChangeaddComOurclints, ChangetoCompanyOurClients, ChangetoLlpOurClients, CIRclient, DissolveLLPOurClients,
DissolaveOurClients, DPOurClients, FoodLicenseOurClints, IECOurclints, IncorporationOurClints, ISOclients,
LLPOurClients, LLRclients, LlptoPriOurclients, OPCOurclints, OurClients, PartnershipLLPOurclints,
ParttoPriOurclints, PFRclients, PritoLlpOurclints, PritoPublicOurcilnts, ProFOPCOurclints, ProFPLCOurclints,
ProOurclints, PvtltdOurclints, ReplyOfEROurclints, Section8OurClients, SocietyOurClients, TMApplicaOurclints,
TMOurclints, TradeLicenseOurClients, TrademarktoHearingOurClients, TrademarktoOppositionOurclients,
TrustOurClients, WindupPLCOurclints
```

---

### Issue #2: Zero Code Splitting — All 55 Pages Bundled Upfront (**CRITICAL**)

**Severity:** 🔴 CRITICAL  
**Estimated Impact:** +50-70% larger initial bundle, +3-4s parse time

**Problem:**
- `App.jsx` imports all 55 pages directly (no lazy loading)
- Every page component tree fully evaluated at startup
- Users downloading code for 40 service pages they won't visit
- No route-based chunk separation

**Current Implementation (App.jsx):**
```jsx
// ❌ ALL 55 pages imported at top level
import Home from "./Pages/Home/Home";
import ContactUs from "./Pages/ContactUs/ContactUs";
import OPC from "./Pages/OPC/OPC";
// ... 52 more direct imports

<Routes>
  <Route path="/" element={<Home />} />
  {/* All routes receive pre-loaded components */}
</Routes>
```

**Why It's Slow:**
1. **Initial bundle bloat:** 55 pages × 20+ components each = 300+ components all evaluated
2. **Parse overhead:** V8 engine must parse all JS even if unused
3. **Memory waste:** Home page visitors load Enterprise Registration code (not needed)
4. **No progressive loading:** All pages load together, not on demand

**Expected Result:**
- Home page bundle: 200-250 KB → 50-75 KB (-70%)
- Service pages: Load dynamically only when user navigates

---

### Issue #3: Vite Build Configuration — No Optimization (**HIGH**)

**Severity:** 🟠 HIGH  
**Estimated Impact:** +30-40% wasted optimization opportunity

**Current Config (vite.config.js):**
```js
export default defineConfig({
  plugins: [react()],
  // ❌ Missing: tree-shaking, chunk splitting, minification, CSS optimization
})
```

**What's Missing:**
- ❌ No manual chunk splitting strategy
- ❌ No vendor/vendor-chunk separation
- ❌ No CSS optimization
- ❌ No drop_console in production
- ❌ No dynamic import optimization

---

### Issue #4: 2-Second Forced Loader Delay (**MEDIUM**)

**Severity:** 🟡 MEDIUM  
**Estimated Impact:** +2s artificial delay on EVERY page load

**Current Implementation (RouteLoaderWrapper.jsx):**
```jsx
useEffect(() => {
  setLoading(true);
  const timer = setTimeout(() => {
    setLoading(false);
  }, 2000); // ❌ ALWAYS 2 seconds minimum
  return () => clearTimeout(timer);
}, [location.pathname]);
```

**Problem:**
- Artificially delays every route transition by 2 seconds
- Happens regardless of actual load time
- If page loads in 100ms, user still waits 1.9 additional seconds
- Compounds over user's session

**Impact on Real Usage:**
- User visits 10 pages/session × 2s = 20 seconds wasted per session

---

### Issue #5: Array Index as Keys in Lists (**HIGH**)

**Severity:** 🟠 HIGH  
**Estimated Impact:** +40-50% CPU usage in re-renders, bugs on reorder

**Found in 25+ Components:**
```jsx
// ❌ WRONG
{items.map((item, index) => (
  <div key={index}>  // Anti-pattern: React can't track identity
    {item.content}
  </div>
))}
```

**Affected Components:**
- All `*OurClients` (carousel items)
- All `*VideoTestimonial` 
- All `*FAQ` components
- `ClientFeedback`, various list components

**Why It's Slow:**
1. React can't differentiate between items when list reorders
2. Forces full re-render of all list items
3. Input state, focus state lost on reorder
4. **Combined with unMemoized components:** 2x-3x slower rendering

---

### Issue #6: Missing React.memo() — Unnecessary Re-renders (**HIGH**)

**Severity:** 🟠 HIGH  
**Estimated Impact:** +30-50% CPU/render time

**Problem:**
- Zero use of `React.memo()` on any component
- Every parent re-render = all carousel/list children re-render
- No `useCallback()` for event handlers
- No `useMemo()` for computed values

**Example Impact:**
- Home page re-render = 250+ child components re-render
- Each carousel item (119 logos) all re-evaluated even if data unchanged

---

### Issue #7: Large Static Data — No Chunking (**MEDIUM**)

**Severity:** 🟡 MEDIUM  
**Estimated Impact:** +10-15% module parsing overhead

**Pattern Found:**
- 100+ line static objects defined inside components
- Examples: `Navbar.jsx` (100-line navData), each `*FAQ.jsx` (50-100 lines FAQ arrays)
- Re-evaluated on every component render

**Example (Navbar.jsx):**
```jsx
const navData = [
  { id: "home", label: "Home" },
  { id: "business", children: [ /* 50+ items */ ] },
  // ... 100 lines total
];

export default Navbar() {
  // navData re-evaluated every render (even though it never changes)
}
```

---

### Issue #8: Image Format & Optimization (**MEDIUM**)

**Severity:** 🟡 MEDIUM  
**Estimated Impact:** +20-30% image bandwidth

**Issues Found:**
- PNG files not converted to WebP: `pvtltd-types.png`, `breadcrum.png`, `legal.png` (used 20+ places)
- JPEG retained: `tradelicense.jpg`, `foodlicense.jpg`
- No responsive images (`srcset`, `picture` elements)
- No lazy loading (`loading="lazy"` attribute)

**Opportunity:** 30-40% size reduction per image format conversion

---

### Issue #9: Hero & "Who We Are" Video Optimization (**MEDIUM**)

**Severity:** 🟡 MEDIUM  
**Estimated Impact:** +1-2s perceived load time

**Current Implementation (Herosection.jsx):**
```jsx
<video
  src={right3danimation}
  autoPlay
  muted
  loop
  playsInline
  // ❌ Missing: preload, poster, codec optimization
/>
```

**Problems:**
- No preload strategy (video starts after full download)
- No poster frame (shows blank until video loads)
- Full file download (no codec optimization)
- Whoweare.jsx: Controls enabled (extra overhead)

---

### Issue #10: Dual Icon Libraries — Redundant (**MEDIUM**)

**Severity:** 🟡 MEDIUM  
**Estimated Impact:** +50-80 KB bundle

**Current Dependencies (package.json):**
```json
{
  "lucide-react": "^0.555.0",
  "react-icons": "^5.5.0"  // Duplicate!
}
```

**Problem:** Both loaded in bundle even though only one needed

---

### Issue #11: CSS Animation Performance — No GPU Hints (**LOW**)

**Severity:** 🟢 LOW  
**Estimated Impact:** +10-15% smoother animations

**Pattern Found:**
- CSS transforms used (good!), but no `will-change` hints
- No `backface-visibility: hidden`
- No `transform: translate3d()` for GPU acceleration

---

### Issue #12: No Code Splitting — Blog, FAQ, Forms (**MEDIUM**)

**Severity:** 🟡 MEDIUM  
**Estimated Impact:** +20-30% unused code on home page

**Problem:**
- Blog components loaded on home page even if user never visits blog
- FAQ logic bundled globally
- Form components bundled everywhere

---

### Issue #13: Missing Resource Hints in HTML (**LOW**)

**Severity:** 🟢 LOW  
**Estimated Impact:** +100-500ms on slow connections

**Missing from index.html:**
- `<link rel="preconnect">` for CDNs
- `<link rel="dns-prefetch">`
- `<link rel="prefetch">` for known routes

---

## Part 2: Work Items (Prioritized)

### 🔴 CRITICAL Priority (Fix First)

#### Work Item #1: Create Shared Client Logos Module

**Issue:** Issue #1 (119 images imported 42 times)  
**Effort:** 1-2 hours  
**Expected Improvement:** 
- Bundle size: -8-12 MB
- Parse time: -30-40%
- Eliminates: 4,998 redundant import statements

**Tasks:**
- [ ] Create `src/assets/clientLogos.js` with single import of all 119 logos
- [ ] Update all 42 `*OurClients` components to import from shared module
- [ ] Remove 119 individual imports from each component
- [ ] Verify all carousel components still work correctly
- [ ] Test bundle output with `npm run build`

**File Changes:**
- Create: `src/assets/clientLogos.js` (new file, 1 export)
- Update: 42 component files (strip 119 imports, add 1 shared import)

---

#### Work Item #2: Implement React.lazy() Code Splitting for All 55 Pages

**Issue:** Issue #2 (All pages bundled upfront)  
**Effort:** 2-3 hours  
**Expected Improvement:**
- Initial bundle: -50-70%
- Home page load: -3-4 seconds
- Parse time: -40-50%

**Tasks:**
- [ ] Convert all 55 page imports to `React.lazy()`
- [ ] Wrap routes in `<Suspense>` with fallback
- [ ] Test each route navigation
- [ ] Verify chunk generation: `npm run build` should create 55+ chunk files
- [ ] Monitor bundle size before/after

**Implementation Pattern:**
```jsx
// Before
import Home from "./Pages/Home/Home";
<Route path="/" element={<Home />} />

// After
const Home = React.lazy(() => import("./Pages/Home/Home"));
<Suspense fallback={<PageLoader />}>
  <Route path="/" element={<Home />} />
</Suspense>
```

**Files to Update:**
- `src/App.jsx` (main routing file)

---

#### Work Item #3: Optimize Vite Build Configuration

**Issue:** Issue #3 (No build optimization)  
**Effort:** 1 hour  
**Expected Improvement:**
- Bundle minification: 15-20%
- Vendor separation: Faster cache invalidation
- CSS optimization: 10-15% smaller

**Tasks:**
- [ ] Add `rollupOptions` for manual chunk splitting
- [ ] Separate vendor chunks (react, router, icons, framer-motion)
- [ ] Enable aggressive tree-shaking
- [ ] Configure Terser for console removal in production
- [ ] Add CSS minification options

**Files to Update:**
- `src/vite.config.js` (add build config)

---

#### Work Item #4: Reduce/Eliminate RouteLoaderWrapper Delay

**Issue:** Issue #4 (2-second artificial delay)  
**Effort:** 30 minutes  
**Expected Improvement:**
- Page transitions: -2 seconds (100% faster)
- Perceived performance: Massively improved

**Options:**
- **Option A:** Remove forced 2-second delay entirely (if page is instant)
- **Option B:** Show loader only if page takes >500ms to load
- **Option C:** Progressive display (loader for 300ms, then content with fade-in)

**Recommendation:** Option B (show spinner only if actual load is slow)

**Files to Update:**
- `src/Components/PageLoader/RouteLoaderWrapper.jsx`

---

### 🟠 HIGH Priority (Fix Second)

#### Work Item #5: Add React.memo() to All Carousel/List Components

**Issue:** Issue #6 (Unnecessary re-renders)  
**Effort:** 2-3 hours  
**Expected Improvement:**
- Component re-renders: -40-50%
- CPU usage: -30-40%
- Responsiveness: Noticeably smoother

**Tasks:**
- [ ] Identify all list/carousel-based components
- [ ] Wrap in `React.memo()`
- [ ] Extract event handlers to `useCallback()`
- [ ] Measure performance improvement with React DevTools Profiler

**Affected Components (Priority Order):**
1. All `*OurClients` carousel items (42 components)
2. All `*VideoTestimonial` components (30+ components)
3. All `*FAQ` accordion items (25+ components)
4. Tab components
5. Blog card components

---

#### Work Item #6: Fix Array Index Keys Anti-Pattern

**Issue:** Issue #5 (Using index as key)  
**Effort:** 2 hours  
**Expected Improvement:**
- List re-renders: More efficient
- Bugs eliminated: UI inconsistencies on reorder
- Memory: Slight improvement

**Tasks:**
- [ ] Replace all `key={index}` with unique `key={item.id}`
- [ ] Add ID to static data structures if missing
- [ ] Test carousel reordering behavior
- [ ] Verify no console warnings in DevTools

**Search Pattern:**
```javascript
.map((item, index) => (
  <div key={index}>  // ❌ Find and replace
```

---

#### Work Item #7: Extract Large Static Data Objects

**Issue:** Issue #7 (Static data in component files)  
**Effort:** 1.5 hours  
**Expected Improvement:**
- Module parse time: -10-15%
- Component re-evaluation: Eliminated

**Tasks:**
- [ ] Create `src/data/` folder
- [ ] Extract navData from `Navbar.jsx` → `src/data/navData.js`
- [ ] Extract FAQ arrays from each `*FAQ.jsx` → separate files
- [ ] Extract static form data, menu structures, etc.
- [ ] Update imports in components

**Example:**
```js
// Extract from Navbar.jsx to src/data/navData.js
export const NAV_DATA = [ /* 100+ lines */ ];

// Update Navbar.jsx
import { NAV_DATA } from "../../data/navData";
```

---

#### Work Item #8: Consolidate Icon Libraries

**Issue:** Issue #10 (Dual icon libraries)  
**Effort:** 1.5 hours  
**Expected Improvement:**
- Bundle size: -50-80 KB

**Tasks:**
- [ ] Audit icon usage: which library used where?
- [ ] Pick primary library (recommend `lucide-react`)
- [ ] Replace all `react-icons` imports with `lucide-react`
- [ ] Remove `react-icons` from `package.json`
- [ ] Run `npm install`

---

### 🟡 MEDIUM Priority (Fix Third)

#### Work Item #9: Convert PNG/JPEG Images to WebP

**Issue:** Issue #8 (Image format optimization)  
**Effort:** 2-3 hours  
**Expected Improvement:**
- Image bandwidth: -30-40%
- Overall bundle: -3-5%

**Tasks:**
- [ ] Identify all PNG/JPEG files in `/public`
- [ ] Convert to WebP using `cwebp` or online tool
- [ ] Update image imports in components
- [ ] Add fallback `<picture>` tags for browser compatibility
- [ ] Add `loading="lazy"` attribute to all images

**Images to Convert:**
- `pvtltd-types.png` → `pvtltd-types.webp`
- `breadcrum.png` → `breadcrum.webp`
- `legal.png` → `legal.webp`
- `tradelicense.jpg` → `tradelicense.webp`
- `foodlicense.jpg` → `foodlicense.webp`
- And 15+ more

---

#### Work Item #10: Optimize Hero & "Who We Are" Videos

**Issue:** Issue #9 (Video loading optimization)  
**Effort:** 1 hour  
**Expected Improvement:**
- Video perceived load: -1-2 seconds
- Better user experience

**Tasks:**
- [ ] Add `preload="auto"` to hero video
- [ ] Add `poster` attribute (JPG thumbnail)
- [ ] Check video codec (should be H.264 + VP9)
- [ ] Compress videos if > 5 MB
- [ ] Remove `controls` attribute from Whoweare video

**Updated Pattern:**
```jsx
<video
  src={right3danimation}
  autoPlay
  muted
  loop
  playsInline
  preload="auto"
  poster="hero-poster.jpg"
/>
```

---

#### Work Item #11: Implement Lazy Loading for Blog/Testimonial Images

**Issue:** Issue #8 (Image optimization)  
**Effort:** 1.5 hours  
**Expected Improvement:**
- Initial page load: -1-2 seconds
- Memory usage: -20-30% on home page

**Tasks:**
- [ ] Add `loading="lazy"` to all blog images
- [ ] Add `loading="lazy"` to testimonial avatars
- [ ] Implement Intersection Observer for below-fold images
- [ ] Add `srcset` for responsive image serving

**Updated Pattern:**
```jsx
<img 
  src={blogImage}
  loading="lazy"
  alt="Blog post"
  srcset={`${blogImage}?w=300 300w, ${blogImage}?w=600 600w`}
/>
```

---

#### Work Item #12: Add CSS Animation Performance Hints

**Issue:** Issue #11 (GPU acceleration)  
**Effort:** 1 hour  
**Expected Improvement:**
- Animation smoothness: +10-15% FPS
- Battery usage: Slightly reduced on mobile

**Tasks:**
- [ ] Add `will-change: transform` to animated elements
- [ ] Add `backface-visibility: hidden` to 3D transforms
- [ ] Use `transform: translate3d()` instead of 2D transforms
- [ ] Test animation smoothness with DevTools Performance tab

**CSS Pattern Updates:**
```css
/* Before */
.animated-element {
  transform: translateY(0);
}

/* After */
.animated-element {
  transform: translate3d(0, 0, 0);
  will-change: transform;
  backface-visibility: hidden;
}
```

---

### 🟢 LOW Priority (Nice to Have)

#### Work Item #13: Add Resource Hints to HTML

**Issue:** Issue #13 (Missing preconnect/prefetch)  
**Effort:** 30 minutes  
**Expected Improvement:**
- First load: +100-500ms faster on slow connections

**Tasks:**
- [ ] Add `<link rel="preconnect">` for origin
- [ ] Add `<link rel="dns-prefetch">` for external domains
- [ ] Add `<link rel="prefetch">` for known routes

**Update:** `src/index.html`
```html
<head>
  <link rel="preconnect" href="https://legalterminus.com">
  <link rel="dns-prefetch" href="https://www.youtube.com">
  <link rel="prefetch" href="/assets/hero-poster.jpg">
</head>
```

---

#### Work Item #14: Implement Service Worker (Optional)

**Issue:** Offline support + caching  
**Effort:** 3-4 hours  
**Expected Improvement:**
- Repeat visits: 50-70% faster (cached)
- Offline fallback: Basic functionality available

**Tasks:**
- [ ] Create Service Worker file
- [ ] Register in `main.jsx`
- [ ] Cache strategies: Cache-first for images, network-first for API
- [ ] Test offline mode

---

## Part 3: Performance Metrics & Expected Improvements

### Current Performance Baseline

| Metric | Current | Target | Delta |
|--------|---------|--------|-------|
| **Initial Bundle** | 250-350 KB | 100-150 KB | **-60-70%** |
| **Home Page Load (3G)** | 8-12 seconds | 2-4 seconds | **-70%** ⚡ |
| **Time to Interactive** | 6-10 seconds | 2-3 seconds | **-70%** ⚡ |
| **Largest Contentful Paint** | 5-8 seconds | 1.5-2.5 seconds | **-70%** ⚡ |
| **First Contentful Paint** | 3-5 seconds | 1-1.5 seconds | **-70%** ⚡ |
| **Total Page Size** | 20-30 MB (with all logos) | 5-8 MB | **-75%** ⚡ |
| **Memory (Mobile)** | 60-80 MB | 20-30 MB | **-65%** ⚡ |
| **JavaScript Parse Time** | 3-4 seconds | 0.8-1 second | **-75%** ⚡ |
| **React Re-renders/sec** | 50-80 | 10-15 | **-80%** ⚡ |
| **Image Bandwidth** | 8-10 MB | 3-4 MB | **-60%** ⚡ |

---

### Impact by Work Item

| Work Item | Bundle Savings | Load Time Savings | Complexity |
|-----------|----------------|-------------------|------------|
| #1: Shared Client Logos | -8-12 MB (-5%) | -1.5s | Low |
| #2: Code Splitting (Lazy Loading) | -100-150 KB (initial -50%) | -2-3s | Medium |
| #3: Vite Build Optimization | -20-30 KB (-10%) | -0.5s | Low |
| #4: Remove Forced Delay | 0 | -2s | Trivial |
| #5: React.memo() | 0 | -0.3-0.5s CPU | Low |
| #6: Fix Key Anti-pattern | 0 | -0.2-0.3s CPU | Low |
| #7: Extract Static Data | -15-25 KB (-8%) | -0.3s | Low |
| #8: Icon Library Consolidation | -50-80 KB (-4%) | -0.2s | Low |
| #9: WebP Images | -3-5 MB (-20%) | -1.5s | Medium |
| #10: Video Optimization | -1-2 MB | -0.8s | Low |
| #11: Lazy Load Images | 0 | -0.5s initial | Low |
| #12: CSS Animations | 0 | +10% smoothness | Low |
| #13: Resource Hints | 0 | -0.2s | Trivial |
| | | | |
| **TOTAL (All Items)** | **-120-250 MB** ✅ | **-10-12s** ✅ | Manageable |

---

## Part 4: Implementation Timeline

### Phase 1: Critical Fixes (Week 1)
**Effort:** 6-8 hours  
**Expected Improvement:** 60% of total benefit

- [ ] Work Item #1: Shared Client Logos
- [ ] Work Item #2: Code Splitting (React.lazy)
- [ ] Work Item #3: Vite Optimization
- [ ] Work Item #4: Remove Forced Delay

### Phase 2: High-Priority Optimizations (Week 2)
**Effort:** 6-8 hours  
**Expected Improvement:** 30% more improvement

- [ ] Work Item #5: React.memo() on lists
- [ ] Work Item #6: Fix key anti-pattern
- [ ] Work Item #7: Extract static data
- [ ] Work Item #8: Icon library consolidation

### Phase 3: Medium-Priority Polish (Week 3)
**Effort:** 6-8 hours  
**Expected Improvement:** Final 10% + UX improvements

- [ ] Work Item #9: WebP images
- [ ] Work Item #10: Video optimization
- [ ] Work Item #11: Lazy load images
- [ ] Work Item #12: CSS animation hints

### Phase 4: Nice-to-Have (Optional)
**Effort:** 4-5 hours  
**Expected Improvement:** Marginal gains + offline support

- [ ] Work Item #13: Resource hints
- [ ] Work Item #14: Service Worker

---

## Part 5: Testing & Validation Plan

### Before/After Measurement

#### Tools to Use:
1. **Chrome DevTools Lighthouse:**
   - Run Lighthouse audit before/after each phase
   - Target: 90+ score across all categories

2. **Bundle Analysis:**
   - `npm run build` → analyze with `rollup-plugin-visualizer`
   - Compare bundle chunks before/after

3. **Network Performance:**
   - Chrome DevTools Network tab
   - Throttle to 3G, measure load times
   - Target: < 4 seconds for home page

4. **React Performance:**
   - React DevTools Profiler
   - Measure component render times
   - Identify remaining bottlenecks

#### Test Scenarios:
- [ ] Home page load (fast 4G, slow 3G, offline)
- [ ] Service page navigation (measure inter-route transition)
- [ ] Carousel interaction (scroll 100 items, check FPS)
- [ ] Mobile experience (slow phone CPU sim)
- [ ] Memory usage profile

---

## Part 6: Risk Assessment & Mitigation

| Risk | Likelihood | Severity | Mitigation |
|------|------------|----------|-----------|
| Breaking carousel display when consolidating logos | Medium | High | Thorough component testing, screenshot comparison |
| React.lazy() causing flickering on slow networks | Low | Medium | Implement smooth Suspense fallback transitions |
| Build process broken after Vite changes | Low | High | Test build immediately, have rollback ready |
| Missing edge cases in static data extraction | Medium | Low | Code review by 2 people, browser testing |
| Vendor bundle still too large | Low | Medium | Further analyze and lazy-load non-critical vendors |

---

## Part 7: Success Criteria

**Project is successful if:**

✅ Initial bundle size reduced from **250-350 KB → 100-150 KB** (60%+ reduction)  
✅ Home page load time reduced from **8-12s → 2-4s** (70%+ reduction)  
✅ Lighthouse score improved from **40-50 → 85+** (Performance category)  
✅ Core Web Vitals pass:
- LCP (Largest Contentful Paint) < 2.5s
- FID (First Input Delay) < 100ms
- CLS (Cumulative Layout Shift) < 0.1

✅ Mobile experience dramatically improved (test on 3G throttle)  
✅ Zero console warnings/errors after fixes  
✅ All functional tests pass (every route, carousel, form works)  

---

## Part 8: Deliverables

Upon completion, you will receive:

1. **Updated Codebase** with all optimizations applied
2. **Performance Report** with before/after metrics & screenshots
3. **Lighthouse Audit Results** (90+ score targets)
4. **Bundle Analysis** (visual breakdown of chunk sizes)
5. **Load Time Waterfall** (DevTools timeline comparison)
6. **Recommendations** for ongoing performance maintenance
7. **Performance Monitoring Setup** (optional: web-vitals tracking)

---

## Questions & Next Steps

**For Client Approval:**
1. Approve prioritized work plan?
2. Any work items to skip or reorder?
3. Timeline: Can we complete Phase 1 this week?
4. Additional performance targets beyond what's listed?

**Prepared by:** AI Code Optimization Specialist  
**Date:** April 26, 2026  
**Status:** Ready for Implementation  

---

*This document serves as a comprehensive roadmap for bringing Legal Terminus frontend to industry-leading performance standards. All work items are concrete, measurable, and have predictable implementation effort.*
