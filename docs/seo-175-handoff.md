# #175 — SEO & URL rewrites for the marketing site (`Frontend/`)

Handoff document: everything changed, every constraint, and what remains.
Written for any agent or developer picking this up.

## Hard constraints (from the owner — do not violate)

1. **No content or design change on any page.** All SEO work is HEAD-ONLY
   (`<title>`, `<meta>`, `<link rel=canonical>`) plus standalone files. No page
   component may be edited. The single exception made: **one line** in
   `App.jsx` mounting `<SeoHead />`, which renders no visible DOM.
2. **Nothing is pushed until the owner verifies** localhost against the hosted
   app (content + design identical). Work is committed locally only.
3. **No CMS.** #176 asks for one; the owner explicitly deferred it. `seoMeta.js`
   is the plain-data stand-in a future CMS would write into.

## Context you need before touching anything

- The **live** legalterminus.com is **WordPress 7.0.4 + WooCommerce** — the SEO
  rankings live on WordPress URLs (deep paths like
  `/setting-up-a-business/profit-making-structures/private-limited-company-registration-in-india/`).
- `Frontend/` in this repo is a **client-rendered React 19 SPA** that will
  REPLACE WordPress at go-live (#174). Its routes are short
  (`/private-limited-company-registration-in-india`, `/gst-registration`, …).
- Before this work it had **one static title for 85 routes and zero meta tags**.
- The authoritative page list is the sheet pasted as a comment on
  **issue #175** (~64 canonical WordPress URLs).

## What was changed (all local, commit pending owner verification)

| File | What |
|---|---|
| `Frontend/src/data/seoMeta.js` | NEW. Route → `{title, description, noindex?}` for 83 routes. Titles follow the sheet's page names; descriptions are first-pass copy meant to be refined. |
| `Frontend/src/Components/SeoHead/SeoHead.jsx` | NEW. Reads the map by pathname, emits title/description/canonical/OG/twitter + `noindex` for auth pages, via **React 19 native head hoisting** (no helmet dependency). Trailing slashes normalised. Unknown paths fall back to site defaults. |
| `Frontend/src/App.jsx` | One import + one `<SeoHead />` line beside `<ScrollManager />`. **Nothing else.** |
| `firebase.json` | **591 server-level 301 redirects** covering 457 of the 463 live WordPress URLs. All are EXACT `source` paths (each listed with and without its trailing slash, since Firebase globs treat those as distinct) — regex was removed after review. Server 301s are what transfer ranking; a client-side `<Navigate>` would not. |
| `Frontend/scripts/prerender.mjs` | NEW. Postbuild step: serves `dist/`, visits all 78 indexable routes headless, writes rendered HTML to `dist/<route>/index.html`. Fixes the SPA-invisible-to-crawlers problem. Build FAILS if any route misses. |
| `Frontend/src/Pages/NotFound/` | NEW page. There was no catch-all route, so unknown URLs rendered an empty frame at HTTP 200 (a soft 404). Scoped `lt-nf__*` CSS so no existing page's styling can be affected. |
| `Frontend/scripts/gen-sitemap.mjs` | NEW. Generates sitemap.xml + robots.txt from `seoMeta.js` as a **prebuild** step, so they can never drift from the routes. (They did drift once — the URL rename instantly left 74 stale entries in a hand-run sitemap.) Excludes `noindex` and canonical aliases. |
| `Frontend/src/data/urlMap.js` | NEW. Old short route → canonical WordPress URL. Source of truth for the rename; drives the legacy 301s. |

## Mapping decisions worth knowing

- `conversion-of-private-limited-company-to-public-limited-compan` — the live
  WordPress slug really is truncated ("compan"). Copied exactly; do not "fix" it.
- The sheet lists the **same URL** for "Dissolve A Limited Liability Partnership"
  and "Dissolve A Partnership Firm" (a sheet bug). The one redirect covers both.
- `IncorptionPage` (`/incorption-registration-in-india`) — the misspelt route is
  the **Wholly Owned Subsidiary** page ("Build Your Global Presence" hero).
  The WP subsidiary URL redirects there. The route was NOT renamed (constraint 1).
- `/company-registration-consultancy-in-odisha` matches WordPress exactly — no
  redirect needed. Same for `/`.

## URL RENAME — the React routes now ARE the WordPress URLs

The short routes (`/society`, `/llp`, `/gst-registration`) were replaced with the
full WordPress paths
(`/setting-up-a-business/non-profit-making-structures/society-registration-in-india`).

**Why:** those URLs are what currently rank; they carry the keywords; and a 301
passes most authority but not all. Adopting them loses nothing, whereas
redirecting away from 57 ranking URLs leaks equity on every one.

`Frontend/src/data/urlMap.js` is the SINGLE SOURCE OF TRUTH for the rename and
must be kept — it documents old→new and drives the legacy redirects. If a route
is ever renamed again, add it there rather than editing paths ad hoc.

What the rename touched (all mechanical, no content changed):
- `App.jsx` — 57 route paths
- `seoMeta.js` — 57 keys (canonicals regenerate from them)
- **internal links in 4 components** (Navbar, Herosection, Legalhelp, NotFound) —
  89 references. Missing these would have made every internal link a 301 hop,
  wasting crawl budget and diluting link equity.
- `firebase.json` — 112 now-native redirects dropped (they would have LOOPED),
  306 retargeted, 114 legacy short-URL 301s added so old links still work.

Two deliberate exceptions, both in `urlMap.js`:
- `/conversion/private-to-public` adopts the CORRECTED spelling; WordPress has a
  truncated slug (`...public-limited-compan`), still redirected in.
- `/trademark-registration-in-odisha` is NOT renamed — the only deep WP URL is a
  *Bhubaneswar* page, a different city and a different page.

## The sheet is NOT the full URL list

The sheet has ~64 URLs. The **live WordPress sitemap has 463**
(`legalterminus.com/sitemap_index.xml` → 9 sub-sitemaps). Always work from the
live sitemap, not the sheet. Breakdown: 103 pages, 100 products, 147 tags, 69
posts, 34 product categories, 7 categories, plus templates/author.

### WooCommerce (133 URLs) — mapped to service pages, not the homepage

The WordPress site sells plans through WooCommerce: `/product/<service>-<tier>`
(Elemental / Enriched / Supreme) and `/product-category/<service>`. The React
site sells the SAME tiers inline on each service page via `ProCheckoutModal`, so
each product URL now 301s to its service page — where that exact plan is still
purchasable. An earlier version sent all 133 to `/`, which would have discarded
~130 ranking URLs and dumped purchase-intent visitors on the homepage.

**See #178** — whether that React checkout actually works end to end is a
separate go-live blocker, and these redirects assume it does.

## UNMAPPED — needs an owner decision (do not guess)

Two sheet pages have **no corresponding React page**:

1. **Change In Contribution (LLP)** — `/event-based-compliances/changing-the-contribution-of-llp/`
2. **Add Or Remove A Partner Or Designated Partner (LLP)** — `/event-based-compliances/add-or-remove-a-partner-or-designated-partner-llp/`

No redirect was added for either: redirecting a ranking page to an unrelated
topic is worse for SEO than a 404, and building pages violates constraint 1.
Options for the owner: build the two pages later, or accept the ranking loss.
(The routes `/updation/change-name-company-to-company` and
`/updation/change-name-llp-to-llp` were investigated as possible matches —
their content is generic company boilerplate; inconclusive.)

## Verification status

- `npm run build:frontend` — clean.
- `vite preview` + Playwright: per-page title, meta description and canonical
  confirmed on `/`, `/gst-registration`, `/trademark/renewal`; screenshots in
  the session scratchpad for design comparison.
- **NOT yet done: the owner's side-by-side check** of localhost vs hosted
  WordPress (content/design parity), and any redirect smoke-test on a Firebase
  preview channel (`firebase hosting:channel:deploy seo-test`).

## Prerendering — DONE (was the SPA risk)

`npm run build` now runs `scripts/prerender.mjs` as a postbuild step: 78/78
routes are snapshotted to `dist/<route>/index.html`. Firebase matches static
files before rewrites, so crawlers and social preview bots get complete HTML
while users still get the SPA hydrating over it.

Three traps found while building it, all fixed — re-check these if it is ever
rewritten:
1. React 19 hoists head tags but leaves the PREVIOUS route's behind, so snapshots
   carried the home page's description/canonical FIRST. Crawlers honour the
   first, so 77 of 78 pages would have shipped the wrong description.
2. Title needs the OPPOSITE dedupe rule from meta tags: React inserts its title
   before the static one from `index.html`, so "keep last" preserves the generic
   fallback. `document.title` is authoritative.
3. `waitUntil: 'networkidle'` never settles on routes with polling or slow lazy
   chunks. Waits for actual render instead, with one retry.

Still client-rendered: `/blog/:slug` (dynamic). Unknown slugs fall back to the
blog listing rather than dead-ending.

## How to verify (for the owner)

```bash
cd Frontend && npm run build && npx vite preview --port 5175
# compare against https://legalterminus.com page by page — design must be identical
# titles: browser tab changes per page; view-source will NOT show them (SPA — expected)
```
Redirects can only be tested on Firebase:
`npx firebase hosting:channel:deploy seo-test` then hit an old WP URL on the
preview channel.

## Related issues

- **#175** — this work (page list in its comments)
- **#176** — CMS for this data: DEFERRED
- **#174** — Go Live gate: the redirects MUST deploy with the site cutover,
  or every WordPress ranking 404s
- **#177** — same per-page-title idea for the Portal side
