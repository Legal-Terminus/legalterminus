# Legal Terminus — Agent & BMad Instructions

> **Every coding agent reads this file.** It is the single copy: `AGENTS.md`, `CLAUDE.md`, `.cursorrules` and `.windsurfrules` are symlinks to `.github/copilot-instructions.md` — edit only that one. On Windows, clone with `git config core.symlinks true`. (The symlinks exist because on 2026-10-03 an agent ported four Ambyflow issues here without opening this file.)
>
> **Ownership:** this file holds **rules** only, kept short because it is sent with every agent turn. Detail lives in on-demand files (table below). Story/sprint **status** lives in `_bmad-output/planning-artifacts/epics.md`, **design** in `_bmad-output/planning-artifacts/architecture.md`, **requirements** in `spec.md`. Link, never copy.

## 📚 Read before you start (on-demand rules)

| Before you… | Read |
|---|---|
| add or change a backend route, public endpoint, upload or download | `docs/agents/security.md` |
| write backend code (logging, Firestore queries, validation, data model) | `docs/agents/backend.md` |
| build UI, a form or a table | `docs/agents/ui.md` |
| write or run Playwright specs | `Portal/e2e/README.md` |
| add an auth method, report/admin page, service layer, or fix a bug | `docs/agents/recipes.md` |
| need a build/run/seed command or ports | `docs/agents/commands.md` |
| add an env variable or GitHub Secret | `docs/agents/env-and-secrets.md` |
| use BMAD agents/skills or touch `_bmad*` | `docs/agents/bmad.md` |
| seed data, deploy, or touch QA | `docs/qa-environment.md`, `docs/delivery.md` |

These rules are binding — "on demand" means *read when relevant*, not *optional*.

---

## 🚦 Changes stop at QA — production is the owner's release

**Your work reaches QA. It never reaches production unless the repository owner
releases it.** This holds for every person and every agent. Since 2026-11-03 it
is enforced by GitHub and Google Cloud, not only by this file:

| Path | What happens |
|---|---|
| Branch → pull request → merge to `main` | `deploy-qa.yml` deploys to **QA**. No approval is needed unless the PR touches `.github/`. |
| Release tag `vX.Y.Z-lt.N`, or "Deploy to Production" | Runs in the GitHub Environment `production` and **waits for the owner's approval**. Nobody approves their own. |
| `.github/` (pipelines, this file, CODEOWNERS) | Needs a code owner's review (`.github/CODEOWNERS`). |
| Google Cloud deploy login | Accepts only the `qa` environment from `main`, and `production` from `main` or a release tag. A workflow on any other branch or tag cannot reach Google Cloud. |

**Never, unless the owner asks in so many words:**
- push a release tag, or start "Deploy to Production";
- run a script, `gcloud`, `firebase` or the Firebase Admin SDK against the **live**
  database (`(default)`), the live bucket, live sign-in accounts or the live
  Cloud Run services — QA is `qa-data`, `legal-terminus-web-qa` and the `-qa` services;
- change IAM, buckets (CORS included), Firebase project settings (Android/iOS apps,
  SHA fingerprints, authorized domains), indexes or rules on the live project;
- create a service-account key, or copy a secret out of GitHub or Cloud Run;
- edit `.github/workflows/` to deploy, or read secrets, from anywhere but its current
  trigger.

**Why:** on 2026-11-03 work meant for QA reached production three ways at once — a
release tag with no approval step, hand changes made in the Google Cloud console, and a
self-made admin key. Each is now closed, and an attempt fails with a permission error.
If you hit one, stop and ask the owner. Do not look for another way round it.

Working on QA needs none of this. QA logins are in `docs/qa-environment.md`, and running
the Portal against QA is in `docs/run-portal-local-qa.md`.

---

## 🎯 Task Completion Checklist

**CRITICAL: Before declaring ANY task complete:**

- [ ] Code implemented and tested locally
- [ ] Merged to `main` through a pull request (direct pushes to `main` are refused)
- [ ] **Epic story status updated** in `_bmad-output/planning-artifacts/epics.md` (✅ Completed / 🔄 In Progress / ⏳ Not Started)
- [ ] **Requirements updated if changed:** `spec.md` (user stories, workflows, Firestore schema, roles/permissions)
- [ ] **Technical decisions documented** in `_bmad-output/planning-artifacts/architecture.md`
- [ ] Error messages are user-friendly (no Firebase error codes)
- [ ] Build passes clean — `npm run build` (Portal runs `tsc -b && vite build`). ⚠️ `tsc --noEmit` is NOT sufficient; `tsc -b` is stricter and is what CI runs.
- [ ] **Playwright suite updated** — matching spec in `Portal/e2e/` (+ `seed-e2e.js` fixtures if needed) added/updated and passing. See `Portal/e2e/README.md`.
- [ ] Backend / Frontend / Portal in sync if applicable
- [ ] **A change ported from Ambyflow follows THIS checklist too** — Ambyflow's paperwork doesn't count here: dated entry in `epics.md`'s change log, update `architecture.md` and `spec.md`, add the row to `docs/releases/SYNC.md`.
- [ ] **Delivery is trunk-based — read `docs/delivery.md`.** A merge to `main` deploys to **QA** (https://legal-terminus-qa.web.app). Production is a tag `vX.Y.Z-lt.N` awaiting the owner's approval — never push one unless the owner asked for a release.
- [ ] **Everything merged to `main` must be safe to release.** Unfinished work goes in switched off.
- [ ] **Playwright runs against QA's data** (`npm run dev:e2e` selects `qa-data`). Test accounts are `qa-*@legalterminus.test`; passwords live in `Portal/e2e/.env.e2e` and are NEVER committed. No credential in a script, spec or doc.
- [ ] **QA shares production's sign-in accounts**, and a seed script run without `FIRESTORE_DATABASE_ID=qa-data` writes to the LIVE database. Read `docs/qa-environment.md` before seeding or changing the QA deploy.

**Commits:** Conventional Commits — `type(scope): description (#issue)`, e.g. `feat(reports): multiple-criteria filtering in the report bar (#91)`. Epic/story ID (e.g. `E01-S02`) in the body when story-related.

---

## 📂 Key File Locations

```
<repo root>/
├── _bmad-output/planning-artifacts/
│   ├── epics.md              ← Story status + implementation notes
│   └── architecture.md       ← Technical design decisions
├── spec.md                  ← Feature specifications + workflows
├── docs/
│   ├── agents/              ← On-demand agent rules (see table above)
│   ├── delivery.md / qa-environment.md
│   └── constitution.md      ← Core principles (reference only)
├── shared/workflows/        ← Workflow definitions, compiler, registry
├── Portal/                  ← Main app (Vite + React + TypeScript, port 5173)
│   ├── src/routes/appRoutes.tsx ← Routes + role access, single source of truth
│   └── e2e/                 ← Playwright suite
├── backend/                 ← Node.js/Express API (port 5001)
├── Frontend/                ← Marketing site (Vite + React, port 5174)
├── firebase.json / firestore.rules / firestore.indexes.json
└── .github/workflows/
```

- **Active:** Portal, backend, Frontend. **Deprecated — do not modify:** `AdminPannel/`, `ClientPannel/`, `EmployeePannel/`.
- **Core commands:** `npm run dev:all` (everything), `npm run build:all`, `npm run test`, `npm run cleanup:ports`. Everything else: `docs/agents/commands.md`.

## ⚠️ Vocabulary: UI labels vs code terms

| UI / user-facing label | Code / Firestore term |
|------------------------|------------------------|
| **Matter** | `task` (Firestore `tasks` collection) |
| **Service** | `workflowDefinition` |
| **Task** (a step in a matter) | `step` |

New code keeps the code terms; new UI copy uses the UI labels.

## 🗃️ Data Model

- **Single-tenant by decision.** Never add `tenantId`, org scoping or multi-tenancy scaffolding.
- **One field, one source of truth** — never mirror a value into a second field.
- **`firestore.rules` must match real document paths** — a new client-reachable collection needs a matching rule. Detail: `docs/agents/backend.md`.

## 🧭 Routes & Access Control

**Access control lives in ONE place: `Portal/src/routes/appRoutes.tsx` (`APP_ROUTES`).** Router, nav and dashboard tiles derive from it — never hand-edit guards or nav lists.
- Open a page to another role → add the role to that route's `roles` array.
- **URLs and folders name the FEATURE, never the role.** `/tasks`, `/users`, `pages/users/` — NEVER `/admin/*`, `/client/*`, `pages/admin/`, etc. One canonical page per feature; adapt the view by `role` from `useAuthStore`.
- Roles come from the role service: `Portal/src/lib/roles.ts` / `backend/src/config/roles.js`. See `architecture.md` §2.2.

## 🔒 Security — non-negotiables (detail: `docs/agents/security.md`)

1. **Every route declares its authorization:** `verifyToken` + `requireRole(...)` on the route, unless on the explicit public list in `security.md`. Mutations are never public. A handler-internal check is not a substitute.
2. **Identity, role, price and amount come from the server** — `req.user.uid` / `req.user.role`, never the request; role assignment via `canAssignRole`; payment amounts resolved server-side.
3. **Never leak internal errors** — log server-side, return a generic 5xx message.
4. **Validate and sanitize all input** before writing to Firestore.
5. **Uploads** need a mimetype allowlist + size cap; **downloads** stream through an authenticated backend endpoint — never a client-visible signed URL.
6. **Never commit secrets or keys.** Exposed key → rotate it.
7. **`console.*` is banned in `backend/src/`** — use the pino logger; never log secrets/PII.

## 📱 UI

**All UI is mobile-first and responsive:** touch targets ≥ 44px, no horizontal scroll, tables become cards on mobile, forms are full pages (not modals). Full rules: `docs/agents/ui.md`.

## ⚙️ Workspace Rules

1. Every commit includes epic/story status if story-related.
2. No commit without updated `spec.md` if requirements changed.
3. All error messages are user-friendly (no Firebase error codes).
4. TypeScript strict mode — no `any` without justification.
5. Work lands on `main` via pull request — no long-lived feature branches; every commit references its issue and follows the checklist above.
6. Don't run the full Playwright suite on unrelated edits — run it when touching a covered flow, when asked, or before declaring a feature done.
