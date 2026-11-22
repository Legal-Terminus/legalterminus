# Playwright end-to-end suite

> Loaded on demand. The always-on rules are in `.github/copilot-instructions.md` (also `AGENTS.md` / `CLAUDE.md`), which says when to read this file.

## 🧪 TESTING WITH PLAYWRIGHT

The Portal has an end-to-end Playwright suite in **`Portal/e2e/`** covering every
implemented epic across all four roles (admin / manager / team_member / client).

**Layout & how it works:**
- `Portal/playwright.config.ts` — starts the stack the tests need via `npm run dev:e2e`
  (port cleanup + backend + portal) and waits for the Portal URL.
- `e2e/auth.setup.ts` — a "setup" project that logs in each role ONCE and saves
  `storageState` to `e2e/.auth/<role>.json`. Every spec reuses it (no per-test
  login → fast, no Firebase auth throttling).
- `e2e/fixtures.ts` — exposes `adminPage` / `managerPage` / `teamPage` / `clientPage`
  fixtures (pre-authenticated contexts). Specs do `test('…', async ({ adminPage }) => …)`.
- `e2e/helpers.ts` — `login`, `openMatter`, `openDocumentsTab`, `pdfFile`, `creds`, `env`.
- `backend/scripts/seed-e2e.js` — creates the `qa-*` test accounts (one per role) in the
  QA database and writes `Portal/e2e/.env.e2e`, including their generated passwords.
  It refuses to run without `FIRESTORE_DATABASE_ID`. **Run this before the suite** (and after schema/flow changes).

**Run commands (from `Portal/`):**
```bash
# one-time per run / after flow changes: seed users + fixtures
cd ../backend && FIRESTORE_DATABASE_ID=qa-data node scripts/seed-e2e.js && cd ../Portal
npm run test:e2e            # headless (boots backend + portal via dev:e2e)
npm run test:e2e:headed     # watch the browser
npm run test:e2e:ui         # interactive debugger
npm run test:e2e:report     # open last HTML report
```

### ⚠️ Always let Playwright boot the backend (rate limits)

The API is rate-limited: **1000 requests / 15 min** globally and **20 / 15 min** on
the sensitive routes (`/api/auth`, `/api/payment`, `/api/contact`). The full suite
is ~260 tests from ONE IP inside a single window and blows past 1000 on its own.

`backend/src/server.js` therefore lifts both ceilings to 100 000 **for E2E only**,
gated on `EMAIL_DISABLED=true` (or `NODE_ENV=test`) — the same kill-switch
`emailService` uses. Production keeps the real limits; do NOT raise those.

`npm run dev:e2e` → `start:backend:e2e` sets `EMAIL_DISABLED=true`, and
Playwright's `webServer` runs `dev:e2e`, so the normal path Just Works.

**The caveat:** if you point Playwright at a backend you started yourself with a
plain `npm start` (or `dev:all`), the flag is NOT set and the 1000-request cap
applies again. Past ~1000 requests every later call returns `429` and tests fail
with *misleading* errors — e.g. `workflow-definitions did not return a list` —
rather than anything that mentions rate limiting. The tail of the run gets
poisoned, and WHICH specs fail shifts between otherwise identical runs, so it
reads like flakiness.

- Symptom to recognise: unrelated late-running specs failing on malformed API
  responses, with a different set failing each run.
- Confirm it: `grep -c 429 <run log>` — anything above 0 means the cap was hit.
- Fix: use `npm run dev:e2e` (let Playwright own the server), or export
  `EMAIL_DISABLED=true` before starting the backend manually.

### 🔴 MANDATE: new features MUST update the Playwright suite
When you build or change a feature/flow, you **must** add or update the matching
spec in `Portal/e2e/` in the SAME change — this is part of "done", not a follow-up:
- New page/flow → new `*.spec.ts` (or extend the closest existing one).
- New role-gated route → add an allow/deny assertion per role (see `auth-rbac.spec.ts`).
- New backend endpoint that the UI drives → cover its happy path + the primary
  error/guard (e.g. validation, 403, conflict) through the UI.
- New fixture state needed (a matter in some status, a lead, etc.) → extend
  `backend/scripts/seed-e2e.js`, never hardcode prod data.
- Prefer role-based fixtures + accessible selectors (`getByRole`, exact text) over
  brittle CSS. Keep specs idempotent/order-independent where possible.

### Test design rules (learned the hard way)
- **Per-run fresh state, then delete.** Each spec PROVISIONS its own matter/lead/
  user via `e2e/api.ts` (create in `beforeAll`/`beforeEach`, delete in `afterAll`/
  `afterEach`). Never share a static seeded matter across mutating specs — it causes
  cross-test pollution + flakiness. `seed-e2e.js` only provisions the stable role USERS.
- **Never hardcode workflow steps/types.** Workflows are EDITABLE. Discover structure
  from the live definition (`e2e/api.ts`: `getDefinitionForMatter`, `firstPaymentGate`,
  `firstPlainStep`, `firstClientStep`, `advanceUntil`, `resolveServiceKey`). A workflow
  edit must not break tests for the wrong reason.
- **Auth via cached storageState.** `auth.setup.ts` logs each role in once (IndexedDB
  captured — Firebase needs it); API tokens are cached per role in `api.ts` to avoid
  Firebase "QUOTA_EXCEEDED" on password sign-ins. Don't mint per call.
- **webServer = `npm run dev:e2e`** (backend + portal only; NOT `dev:all` which also
  boots the marketing app and can crash the run).

### Current coverage
The suite covers every implemented epic across all four roles — the spec files in
`Portal/e2e/*.spec.ts` ARE the coverage list (don't enumerate it here; enumerations rot).
Before writing a new spec, `ls Portal/e2e/*.spec.ts` and extend the closest existing one.

Do NOT run the suite automatically on unrelated edits; run it when you touch a
covered flow, when explicitly asked, or before declaring a feature done.
