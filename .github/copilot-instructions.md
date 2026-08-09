# Legal Terminus - Copilot & BMad Instructions

> **Ownership** — this file holds **rules and workflows** only. Story/sprint **status** lives in `_bmad-output/planning-artifacts/epics.md`, **design** in `_bmad-output/planning-artifacts/architecture.md`, **requirements** in `spec.md`. Never copy their content into this file — copies rot; link instead. Copilot chats and BMad agents read this file for all project rules.

---

## 🎯 Task Completion Checklist

**CRITICAL: Before declaring ANY task complete:**

- [ ] Code implemented and tested locally
- [ ] All files committed to `main`
- [ ] **Epic story status updated:** `_bmad-output/planning-artifacts/epics.md` (mark ✅ Completed, 🔄 In Progress, or ⏳ Not Started)
- [ ] **Requirements updated if changed:** `spec.md` (user stories, workflows, Firestore schema, roles/permissions)
- [ ] **Technical decisions documented:** `_bmad-output/planning-artifacts/architecture.md` (service layers, components, database changes, integrations)
- [ ] Error messages are user-friendly (no Firebase error codes)
- [ ] Build passes clean — run `npm run build` (Portal uses `tsc -b && vite build`). ⚠️ `tsc --noEmit` is NOT sufficient: `tsc -b` is stricter (unused vars, project refs) and is what CI runs. Always verify with the real build command before declaring done.
- [ ] **Playwright suite updated for the feature** — added/updated the matching spec in `Portal/e2e/` (+ `seed-e2e.js` fixtures if new state is needed) and it passes. See "🧪 TESTING WITH PLAYWRIGHT". Tests are part of "done", not a follow-up.
- [ ] Backend/Frontend/Portal are all in sync if applicable

**Key Rule:** Commits use Conventional Commits format — `type(scope): description (#issue)` (e.g., `feat(reports): multiple-criteria filtering in the report bar (#91)`). Reference the GitHub issue number in the subject; put the epic/story ID (e.g., `E01-S02`) in the body when the work is story-related.

---

## 📂 Key File Locations

```
<repo root>/
├── _bmad-output/planning-artifacts/
│   ├── epics.md              ← Story status + implementation notes
│   └── architecture.md       ← Technical design decisions
├── spec.md                  ← Feature specifications + workflows
├── docs/
│   └── constitution.md      ← Core principles (reference only)
├── shared/
│   └── workflows/           ← Workflow definitions, compiler, registry
│       ├── companyIncorporation.definition.js  ← Incorporation workflow (seeded via db:seed:workflows)
│       ├── compileDefinition.js / registry.js / definitionSchema.js
│       └── stepList.js
├── Portal/                  ← Main app (Vite + React + TypeScript)
│   ├── src/
│   ├── e2e/                 ← Playwright suite
│   └── .env.local           ← Local dev secrets (not committed)
├── backend/                 ← Node.js/Express API (port 5001)
│   ├── src/
│   ├── services/            ← Shared business logic (e.g., userService.js)
│   ├── controllers/         ← API endpoint handlers
│   └── .env.local           ← Local dev secrets (not committed)
├── Frontend/                ← Marketing site (Vite + React, port 5174)
│   ├── src/
│   └── .env.local           ← Local dev secrets (not committed)
├── firebase.json            ← Hosting + Firestore config
├── firestore.rules          ← Security rules
├── firestore.indexes.json   ← Composite indexes
└── .github/
    └── workflows/firebase-preview-qa.yml
```

### Active vs Legacy Apps
- **Active (Maintained):** Portal (admin panel), Backend (API), Frontend (marketing site)
- **Inactive/Deprecated:** AdminPannel/, ClientPannel/, EmployeePannel/ (do not modify)

### ⚠️ Vocabulary: UI labels vs code terms
The UI and the code use DIFFERENT words for the same concepts. Never mix them up when searching code or naming things:

| UI / user-facing label | Code / Firestore term |
|------------------------|------------------------|
| **Matter** | `task` (Firestore `tasks` collection) |
| **Service** | `workflowDefinition` |
| **Task** (a step in a matter) | `step` |

New code keeps the existing code terms; new UI copy uses the UI labels.

---

## 🚀 Common Workflows

### When adding a new Auth method or login provider:
1. ✅ Implement LoginPage / SignupPage / ForgotPasswordPage components (Portal)
2. ✅ Update backend auth endpoints: `backend/src/routes/auth.routes.js`
3. ✅ Update Firebase custom claims in auth middleware
4. ✅ Add provider to `userService.upsertUser()` if custom UPSERT logic needed
5. ✅ Update `spec.md` → Technology section → Auth methods
6. ✅ Update `epics.md` story with acceptance criteria + implementation notes
7. ✅ Document in `architecture.md` if flow is complex
8. ✅ Test both scenarios: new signup + existing user merge
9. ✅ Commit to `main` referencing the issue + comment on and close the issue

### When adding a new Report or Admin feature:
1. ✅ Create backend controller endpoint (`backend/src/controllers/`)
2. ✅ Add backend route with role guard: `verifyToken, requireRole('admin', ...)` (`backend/src/routes/`)
3. ✅ Create frontend page in Portal (`Portal/src/pages/`)
4. ✅ **Register the page in `Portal/src/routes/appRoutes.tsx` — the SINGLE source of truth.** Add ONE `AppRoute` entry with `path`, `element`, `roles`, and optional `nav` block. Do NOT add it to `routes/index.tsx` or `navConfig.ts` directly — both derive from `appRoutes.tsx`.
5. ✅ Create or update Firestore indexes in `firestore.indexes.json`
6. ✅ Define TypeScript types (`Portal/src/types/` or alongside the API helper)
7. ✅ Update `spec.md` with new fields or workflow changes
8. ✅ Update `epics.md` story with acceptance criteria + file paths
9. ✅ Test CSV export if applicable + mobile responsiveness
10. ✅ Commit to `main` referencing the issue + comment on and close the issue

### When adding a route or changing who can access a page:
**⚠️ Access control is declarative and lives in ONE place: `Portal/src/routes/appRoutes.tsx` (`APP_ROUTES`). URLs are ROLE-NEUTRAL.**
1. ✅ To open a page to another role → add the role to that route's `roles` array. ONE line.
2. ✅ **Paths name the FEATURE, not the role.** Use `/tasks`, `/users`, `/reports/leads` — NEVER `/admin/*`, `/manager/*`, `/team/*`, `/client/*`. Role-prefixed URLs leak the role and cause duplication; they are banned.
3. ✅ A page used by multiple roles → ONE canonical path, list every allowed role, and adapt the view inside the component by reading `role` from `useAuthStore`. There is one `/dashboard` and one `/tasks` for all roles. NEVER duplicate a page per role.
4. ✅ A reachable-but-unlinked page (edit form, detail view) → omit the `nav` block.
5. ✅ The router (`routes/index.tsx`), navigation (`components/layout/navConfig.ts`), and dashboard tiles (`pages/dashboard/dashboardConfig.ts`) all auto-derive from declarative configs — do not hand-edit guards or nav lists.
6. ✅ **Folders name the FEATURE, not the role.** Organize `pages/` and `components/` as `pages/users/`, `pages/tasks/`, `pages/reports/`, `components/users/` — NEVER `pages/admin/`, `pages/client/`, `pages/manager/`, `pages/team/`, `components/admin/`. A role-named folder is the same anti-pattern as a role-prefixed URL.
7. ✅ Roles are NOT hardcoded: use the role service — `Portal/src/lib/roles.ts` (frontend) and `backend/src/config/roles.js` (backend). Adding a role = one entry there. Privilege rules (`canAssignRole`, `USER_DELETE_ROLES`, etc.) live in the role service too.
8. ✅ See `architecture.md` §2.2 for the full pattern.

### When refactoring code into a service layer:
1. ✅ Identify common logic across multiple controllers (e.g., user creation, email sending)
2. ✅ Create service file: `backend/src/services/serviceNameService.js`
3. ✅ Export pure functions (no controller/route logic)
4. ✅ Handle errors but don't send responses (let caller handle HTTP status)
5. ✅ Update all callers (controllers/routes) to use service functions
6. ✅ Document service in `architecture.md` → Service Layer section
7. ✅ Test all entry points still work (e.g., team-members, clients, auth)
8. ✅ Update `epics.md` with refactoring story
9. ✅ Commit to `main` referencing the issue + comment on and close the issue

### When fixing a bug:
1. ✅ Identify root cause (document in commit message)
2. ✅ Fix code + add inline comment explaining why
3. ✅ Test fix locally (especially auth flows, Firestore writes, email sending)
4. ✅ Update `epics.md` if related story needs status update
5. ✅ Commit with `fix(scope):` prefix + issue reference
6. ✅ Comment on and close the issue

### Issue → Commit Workflow:
1. **Refine the issue** (clarify scope, acceptance criteria)
2. **Plan via BMAD** — record the story in `epics.md`
3. **Implement + test** (including Playwright — see Task Completion Checklist)
4. **Commit to `main`**: `type(scope): description (#issue)` — Conventional Commits; epic/story ID in the body when story-related
5. **Comment on and close the issue** with a summary of the change
6. **Update story status** in `epics.md`

---

## 🛠️ BUILD & RUN COMMANDS

**Always use these commands (from project root):**

### Build Commands
| Command | Purpose | Services |
|---------|---------|----------|
| `npm run build:all` | Build all services (backend, frontend, portal) | Backend, Frontend, Portal |
| `npm run build:backend` | Build backend only | Backend |
| `npm run build:frontend` | Build frontend marketing site only | Frontend |
| `npm run build:portal` | Build portal admin app only | Portal |

### Run/Dev Commands
| Command | Purpose | Port(s) | Working Dir |
|---------|---------|---------|-------------|
| `npm run dev:all` | **Standard dev workflow — start everything** (kills existing processes first) | 5001/5173/5174 | Root |
| `npm run dev:e2e` | Backend + portal only — used ONLY by Playwright's webServer, not for manual dev (use `dev:all` for that). Sets `EMAIL_DISABLED=true`, which also lifts the API rate limit for the run — see "Always let Playwright boot the backend" | 5001/5173 | Root |
| `npm run start:backend` | Start backend (production mode) | 5001 | Backend |
| `npm run dev:backend` | Start backend (development mode with hot reload) | 5001 | Backend |
| `npm run dev:portal` | Start portal admin app | 5173 | Portal |
| `npm run dev:portal-only` | Alias for dev:portal | 5173 | Portal |
| `npm run dev:frontend` | Start frontend marketing site | 5174 | Frontend |

### Testing Commands
| Command | Purpose | Runs |
|---------|---------|------|
| `npm run test` | Run E2E tests (Playwright headless) with backend + frontend | Backend + Frontend + Tests |
| `npm run test:headed` | Run E2E tests (Playwright visible browser) with backend + frontend | Backend + Frontend + Tests (browser visible) |

### Utility Commands
| Command | Purpose |
|---------|---------|
| `npm run cleanup:ports` | Kill processes on ports 5001, 5173, 5174 (useful if services hang) |
| `npm run db:setup` (from `backend/`) | Seed workflows + deploy Firestore indexes. Index deploy needs Firebase CLI auth (user-run or CI token) — project `legal-terminus-web` |

---

## 📋 BMAD Integration & Architecture Principles

This project uses **BMad Method v6.8.0** for AI-driven development. Read `docs/constitution.md` for core principles.

**Agent Usage:**
- Use `bmad-agent-pm` for product requirements
- Use `bmad-agent-architect` for technical design decisions
- Use `bmad-agent-dev` for implementation guidance
- Use `bmad-spec` to distill requirements into SPEC kernel
- All agents have skills in `.agents/skills/`

**Key Directories:**
- `docs/constitution.md` — Core principles (Role-Gating, Workflow Engine, Single Source of Truth, etc.)
- `_bmad/` — BMAD framework installation (agents, skills, workflows)
- `.agents/skills/` — BMAD skills available as agent instructions
- `.github/agents/` — BMAD agent command files for GitHub Copilot
- `_bmad-output/planning-artifacts/` — PRD, architecture, stories
- `_bmad-output/implementation-artifacts/` — generated code artifacts

**Architecture Pattern (Backend):**
```
Route (auth.routes.js, team-members.routes.js)
  ↓
Controller (controllers/team-members.controller.js)
  ↓
Service (services/userService.js) ← Reusable business logic
  ↓
Firestore / Firebase Admin SDK
```
Services are called by multiple controllers for consistency.

---

## 📋 Story Status & Architecture Snapshots

**Story/sprint status lives ONLY in `_bmad-output/planning-artifacts/epics.md` — never duplicated here.** Read it at the start of story-related work; update it when a story's status changes.

Architecture snapshots (e.g., the consolidated user-management pages at `Portal/src/pages/users/`, routes `/users`, `/users/new/:type`, `/users/edit/:type/:uid`) live in `architecture.md` — this file only carries the rules for keeping them true (see route/folder rules above).

---

## ⚙️ Workspace Rules

1. **Every commit must include epic/story status** if work is story-related
2. **No commit without updated spec.md** if requirements changed
3. **All error messages must be user-friendly** (no Firebase error codes)
4. **TypeScript strict mode** - no `any` types without justification
5. **Work lands on `main`** — no long-lived feature branches; every commit references its GitHub issue and follows the Task Completion Checklist before push

### 🔐 Environment Variables & Secrets Management

**NEVER hardcode:**
- API keys, tokens, secrets
- Firebase credentials
- Database URLs or connection strings
- Feature flags or feature URLs
- Admin emails or internal IDs

**Environment file strategy (best practices):**

| File | Purpose | Who | Committed? |
|------|---------|-----|------------|
| `.env.local` | Local development secrets | Developer | ❌ No (in .gitignore) |
| `.env.example` | Template showing structure | Everyone | ✅ Yes |
| GitHub Secrets | CI/CD secrets (QA/Prod) | GitHub Actions | N/A |

**All three apps use the same naming:**
- Frontend: `.env.local` + `.env.example`
- Backend: `.env.local` + `.env.example` (NOT `.env.qa`)
- Portal: `.env.local` + `.env.example`

**GitHub Secrets format:** `BACKEND_FIREBASE_PRIVATE_KEY`, `FRONTEND_API_URL`, etc.

### When adding new env variables or GitHub Secrets:
1. Add to `.env.example` (empty value only, no secrets)
2. Add to `.env.local` with actual value (for local testing)
3. Add to GitHub Secrets via Settings → Secrets and variables → Actions
4. **Update ALL related workflows** to export the new secret as an env var:
   - `.github/workflows/firebase-preview-qa.yml` (QA deployment)
   - `.github/workflows/firebase-prod.yml` (if exists)
   - Any other CI/CD workflows
5. Update `spec.md` if this is a new feature configuration

---

## 🔒 SECURITY STANDARDS (Backend API)

**MANDATORY for every new/changed endpoint. These rules exist because each was a real vulnerability found in a security review — do not regress them.**

### 1. Every route must declare its authorization
- **Default to locked.** A new route gets `verifyToken` + `requireRole(...)` UNLESS it is *intentionally* public.
- **Mutations are never public.** Any `POST` / `PUT` / `PATCH` / `DELETE` that writes data, and any `GET` that returns PII or internal data, MUST require `verifyToken` and an explicit `requireRole(...)`.
- **Only these are public:** the marketing-site contact-form `POST /api/contact`, payment gateway callbacks (`/api/payment/redirect`), public content **reads** (`GET` blogs/categories/employees/testimonials), and `GET /api/auth/firebase-config`. Anything else is authenticated.
- Pattern for content management routes:
  ```js
  router.get("/all", getAll);                          // public read
  const manage = [verifyToken, requireRole("admin", "manager")];
  router.post("/create", ...manage, create);           // protected write
  router.delete("/delete/:id", ...manage, remove);     // protected delete
  ```
- ⚠️ A handler-internal role check is NOT a substitute for a route guard — put `requireRole` on the route so unauthorized requests never reach handler logic.

### 2. Never trust the client for identity, role, price, or amount
- **User identity comes from the verified token only:** `req.user.uid` — NEVER from `req.body.userId` / query params.
- **Role comes from `req.user.role`** (set by `verifyToken`) — NEVER from the request body/query/header.
- **Authorization to assign a role** goes through `canAssignRole(req.user.role, targetRole)` (in `backend/src/config/roles.js`). Never inline `req.user.role === "admin"` string checks — use `requireRole` + the role service so the escalation guard is consistent everywhere.
- **Payment amounts/prices must be resolved server-side** from a trusted source, never taken from the client. For gateway callbacks, trust only hash-verified fields (PayU `udf*`) or the gateway's Verify API — never unsigned query params.

### 3. Never leak internal errors to clients
- On `catch`, **log the real error server-side** (`console.error("[CONTEXT]", error)`) and return a **generic** message:
  ```js
  } catch (error) {
    console.error("[CREATE_USER_ERROR]", error);
    res.status(500).json({ message: "Internal server error" });
  }
  ```
- ❌ NEVER `res.json({ error: error.message })` or `{ message: error.message }` for 5xx — it exposes Firestore/stack internals. (Deliberate 4xx validation messages you authored are fine.)

### 4. Validate and sanitize all input
- Strip HTML/tags, clamp string lengths, and validate format (email/phone) on every user-supplied field before writing to Firestore. Mirror the pattern in `contact.controller.firestore.js` (`stripTags`, length limits, email regex).

### 5. File uploads
- `multer` configs MUST set a `fileFilter` with a **mimetype allowlist** (`image/jpeg|png|webp`) AND a `limits.fileSize` cap. Reject everything else before processing.

### 6. App-wide middleware (already in `server.js` — keep it)
- `helmet` (security headers), rate limiting (strict on `/api/auth`, `/api/payment`, `/api/contact`), `express.json({ limit: "1mb" })`, and a global error handler that hides internals. New sensitive public endpoints should be added to the strict rate limiter.

### 7. Secrets & keys
- Service-account JSON, `.pem`, `.key`, `.p12`, and any `.env*` (except `.env.example`) are gitignored — never commit them. If a key is ever exposed, **rotate it** (don't just delete the file): GCP service-account keys via `gcloud iam service-accounts keys create/delete`, then update local env + GitHub Secrets together.

### 8. Document downloads are proxied through the backend
- File/document downloads MUST stream through an authenticated backend endpoint (`verifyToken` + role/ownership check) — the backend fetches from Storage and pipes the bytes to the client.
- **NEVER return a client-visible signed URL** (even short-lived): signed links leak via history/logs/sharing and bypass role checks for their lifetime.

---

## 📊 LOGGING STANDARDS (Backend)

**Use the structured logger — `console.*` is banned in `backend/src/`.**

- Import the shared pino logger: `import { logger } from "../config/logger.js";` (adjust depth). Inside a request handler prefer `req.log` (carries the request id) when available.
- **Object first, message second:** `logger.error({ err }, "Failed to create user")`, `logger.info({ uid, role }, "User updated")`. Put the `Error` object under the `err` key (pino serializes the stack) — never `err.message`, never string-concatenate context into the message.
- Levels: `error` (handled exceptions / failures), `warn` (recoverable anomalies), `info` (lifecycle/business events), `debug` (verbose dev detail, off in prod via `LOG_LEVEL`).
- **Never log secrets/PII**: no tokens, passwords, private keys, full Aadhaar/PAN. The logger redacts `authorization` / `password` / `private_key` / `hash`, but don't rely on it — don't pass them.
- `console.log`/`console.error` are only acceptable in standalone scripts (`backend/src/scripts/`) that run outside the server.

## ⚡ PERFORMANCE & DATA-ACCESS STANDARDS (Firestore)

**Designed to stay fast and cheap as data grows — Firestore bills per document read.**

1. **Never read a whole collection to filter/sort/count in memory.** No `collection().get()` followed by JS `.filter()`/`.sort()`/`.length` on the full set. Push work to Firestore: `where()`, `orderBy()`, `limit()`, and `.count()` aggregation.
2. **All list endpoints paginate.** Use `limit` + cursor (`startAfter(doc)`); return `{ data, nextCursor }`. Validate `limit`/`cursor` with `paginationSchema`. Frontend consumes with `useInfiniteQuery`; large tables use TanStack Virtual (see `UsersPage.tsx`).
3. **Counts via aggregation, not document reads.** Use `query.count().get()` (see `getUserCounts`) — one cheap query, accurate at any scale.
4. **Enrich by targeted lookup, not full scans.** To join/enrich, collect the keys you need and look them up in chunks of ≤30 via `where(field, "in", chunk)` / `array-contains-any` (see leads report) — cost scales with the working set, not the whole collection.
5. **Add the composite index** for any `where() + orderBy()` combo to `firestore.indexes.json`.
6. **Don't read Firestore on the hot path per request.** The auth role fallback is cached (`auth.middleware.js`); custom claims are the source of truth. `getDb()` is memoized — reuse it.

## ✅ INPUT VALIDATION STANDARDS (Backend)

- **Validate every write endpoint with a Zod schema** via `validate(schema)` middleware (`middleware/validate.middleware.js`). Schemas live in `backend/src/schemas/`. Use `.strict()` to reject unknown fields; the parsed value replaces `req.body`.
- Don't hand-roll `String(x).slice(...)` checks in controllers when a schema can express it. Controllers keep only **authorization** logic (e.g. `canAssignRole`) — not shape/format validation.
- Reuse field primitives (email/phone/name) across schemas so rules stay consistent.

## 🗃️ DATA MODEL HYGIENE

- **Single-tenant by decision.** The portal serves ONE organization. Never add `tenantId`, org scoping, or any multi-tenancy scaffolding — it is deliberate scope, not an oversight.
- **One field, one source of truth.** Don't mirror a value into a second field that must be kept in sync (the legacy `type`-mirrors-`role` pattern was removed — use `role` only).
- **firestore.rules must match real document paths.** When you add a collection/subcollection the client SDK can reach, add a matching rule (e.g. payments live at `users/{uid}/payments/{txnId}` — the rule is there, not at a top-level `/payments`). Everything else is denied by the catch-all.

---

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
- `backend/scripts/seed-e2e.js --write-env` — creates the throwaway `e2e-*` users
  (one per role) + fixtures (active matter, pending-approval matter, a lead) and
  writes `Portal/e2e/.env.e2e`. Fixtures are tagged `e2e:true` and cleaned up on
  each re-seed. **Run this before the suite** (and after schema/flow changes).

**Run commands (from `Portal/`):**
```bash
# one-time per run / after flow changes: seed users + fixtures
cd ../backend && node scripts/seed-e2e.js --write-env && cd ../Portal
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

---

## 📱 UI/UX Requirements - Mobile-First & Responsive Design

**ALL new UI components MUST be mobile-friendly and responsive. This is mandatory, not optional.**

### Design Principles
- **Mobile-first approach:** Design for small screens first, then scale up
- **Touch-friendly:** All buttons/clickable elements ≥ 44px × 44px (iOS HIG standard)
- **Readable on small screens:** No horizontal scroll; 16px min font size for body text
- **Accessible:** Proper color contrast, keyboard navigation, aria labels

### Implementation Standards

1. **Use Tailwind responsive utilities:** `sm:`, `md:`, `lg:`, `xl:` breakpoints
   ```tsx
   <div className="flex flex-col md:flex-row gap-4 md:gap-6">
     <div className="w-full md:w-1/2">Content</div>
   </div>
   ```

2. **Form pages on mobile:** Use full-screen form pages instead of modals
   - ✅ Navigate to dedicated form pages — user forms use `/users/new/:type` and `/users/edit/:type/:uid`
   - ✅ Use full-page real estate on mobile (no modal overlay)
   - ✅ Include back button to return to list
   - ✅ Wrap form in `PageShell` for consistent layout
   - ✅ Make forms responsive with Tailwind utilities
   - Example pattern:
     ```tsx
     // List page with navigation — type = "member" | "client"
     <button onClick={() => navigate('/users/new/member')}>Add Member</button>
     <button onClick={() => navigate('/users/new/client')}>Add Client</button>
     <button onClick={() => navigate(`/users/edit/member/${uid}`)}>Edit</button>
     
     // UserFormPage reads :type param and renders TeamMemberForm or ClientForm
     // All users (clients, team_member, manager, admin) live at /users
     ```

3. **Forms on mobile:**
   - ✅ Full-width inputs on small screens
   - ✅ Stack form fields vertically
   - ✅ Use dropdown/select on mobile instead of complex multi-select UI
   - ✅ Increase input padding for touch: `px-4 py-3`

4. **Tables on mobile:**
   - ❌ **DO NOT** force table display on small screens (causes horizontal scroll)
   - ✅ Convert to stacked card view on mobile (`md:table` for desktop, block for mobile)
   - ✅ Show key columns first, hide secondary info on small screens

5. **Navigation:**
   - ✅ Collapsible sidebar on mobile
   - ✅ Hamburger menu for navigation
   - ✅ Sticky top bar with back button on small screens

6. **Testing before commit:**
   - Test in Chrome DevTools: `iPhone 12/14`, `Pixel 5`, `iPad Pro` (768px and 1024px widths)
   - Test on actual phone if possible
   - Verify no horizontal scroll on any page
   - Verify all buttons are tappable (≥44px)

### When adding new components:
- Always include breakpoint tests in your commit message
- Reference an existing form page (e.g., `Portal/src/pages/users/UserFormPage.tsx`) as the layout pattern instead of inventing a new one
