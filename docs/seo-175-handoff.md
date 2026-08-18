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
| `firebase.json` | 59 server-level **301 redirects**, WordPress URL → React route, as `regex` entries tolerating the trailing slash (`^/old-path/?$`). Server 301s are what transfer ranking — a client-side `<Navigate>` would not. |
| `Frontend/public/sitemap.xml` | NEW. 78 indexable URLs (canonical short routes; `noindex` routes excluded). |
| `Frontend/public/robots.txt` | NEW. Allows all, disallows `/my-profile` + `/payment/`, points at the sitemap. |

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

## Known limitation — documented risk, deliberately out of scope

The site is still a **client-rendered SPA**: crawlers that do not execute
JavaScript (and all social link-preview bots) see an empty shell with the
default title. Google renders JS but slower/less reliably. The fix is
**prerendering or SSR** of the ~80 static marketing routes at build time —
recommended before or shortly after go-live, but it is a build-pipeline change
and was not part of this task. The head metadata added here is the
foundation that prerendering will snapshot.

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
