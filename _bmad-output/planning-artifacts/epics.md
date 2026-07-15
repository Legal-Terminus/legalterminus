---
title: Legal-Terminus Portal — Epics & Stories
version: 1.0
date: 2026-05-31
author: Winston (BMAD Architect Agent)
status: In progress — Phase 1 substantially complete (status reconciled against code 2026-06-21)
stepsCompleted: ["validate-prerequisites", "gather-context", "decompose-epics", "write-stories", "sprint-plan", "status-reconciliation-2026-06-21"]
---

# Legal-Terminus Portal — Epics & User Stories

**Project**: Legal-Terminus Portal  
**Stack**: Vite + React 19 + TypeScript (`Portal/`), Node.js/Express ES Modules (`backend/`), Firebase Auth + Firestore + Storage, XState v5, Tailwind CSS, TanStack Query, Zustand  
**Roles**: `admin | manager | team_member | client`  
**Phase 1 scope**: Company Incorporation workflow only (41 steps), responsive web app  
**Phase 2**: Trademark, GST, UDYAM workflows + Capacitor mobile wrapper  
**Spec reference**: `spec.md` (17 user stories) | **Architecture reference**: `_bmad-output/planning-artifacts/architecture.md`

---

## Vocabulary (UI labels vs. code) — set 2026-06-13

The data model is unchanged; only **user-facing labels** differ from code identifiers to avoid
the task/workflow confusion. Canonical mapping:

| Concept | Code identifier (unchanged) | Staff UI label | Client UI label |
|---|---|---|---|
| Workflow template/definition | `workflowDefinition`, `workflowDefinitions` | **Workflow** | (not shown) |
| A client's running instance | `task`, `tasks` collection, `/api/tasks` | **Matter** (a client case) | **Service** |
| A unit of work within an instance | `step`, `tasks/{id}/steps` | **Task** (the steps are the tasks staff do) | **Step** |

So: a **Workflow** is instantiated as a **Matter** (client case) made of **Tasks** (steps). Clients
see their Matter as a **Service** with **Steps**. Code keeps `task` = the instance (matches the
~80 existing spec references and `/api/tasks`); we did NOT rename the data model. Implemented via
role-aware page copy, a nav label override (`/tasks`: staff "Matters", client "My Services"), and
split dashboard tiles.

---

## Story ID Convention

`E{epic}-S{story}` — e.g. `E01-S02` = Epic 1, Story 2.

## Priority Legend

| Code | Meaning |
|---|---|
| P1 | Must-have — core value; nothing else works without it |
| P2 | High-value — significant feature; blocks dependent epics |
| P3 | Nice-to-have — explicitly required but not on the critical path |

## Complexity Legend

| Code | T-shirt | Rough Effort |
|---|---|---|
| S | Small | 0.5–1 day |
| M | Medium | 1–3 days |
| L | Large | 3–5 days |
| XL | X-Large | 5–8 days |

---

## Epic Overview

| Epic | Title | Phase | Stories |
|---|---|---|---|
| E-01 | Foundation & Auth | Phase 1 | E01-S01 – E01-S04 |
| E-02 | Workflow Engine | Phase 1 | E02-S01 – E02-S04 |
| E-03 | Task Management | Phase 1 | E03-S01 – E03-S05 |
| E-04 | Client Portal | Phase 1 / 2 | E04-S01 – E04-S08 |
| E-05 | Document Cycle | Phase 1 / 2 | E05-S01 – E05-S04 |
| E-06 | Payments | Phase 1 / 2 | E06-S01 – E06-S04 |
| E-07 | Notifications & Email | Phase 1 / 2 | E07-S01 – E07-S05 |
| E-08 | Reports & Master Sheet | Phase 1 / 2 | E08-S01 – E08-S06 |
| E-09 | User & Client Management | Phase 1 / 2 | E09-S01 – E09-S05 |
| E-10 | Workflow Configuration | Phase 1 / 2 | E10-S01 – E10-S03 |
| E-11 | Matter Creation, Pre-Assignment, Priority & UI Platform | Phase 1 | E11-S01 – E11-S08 |
| E-12 | Client vs Internal View Separation | Phase 1 | E12-S01 – E12-S03 |
| E-13 | Per-Step ETAs & SLA Tracking | Phase 1 / 2 | E13-S01 – E13-S05 |
| E-14 | Matter Detail UX — Collapsible/Resizable Panels, Header Compaction, Table Wrap & Activity History | Phase 2 | E14-S01 – E14-S06 |
| E-15 | Document Naming & Step Configuration (Visibility, Status/Notes, Descriptions) | Phase 2 | E15-S01 – E15-S04 |
| E-16 | Comment Draft Autosave | Phase 2 | E16-S01 |
| E-17 | Professional Assignment on Matters | Phase 2 | E17-S01 |
| E-18 | Centralized Reporting Module | Phase 2 | E18-S01 – E18-S06 |

---

## E-01 — Foundation & Auth

**Goal**: Stand up the `Portal/` Vite + React 19 + TypeScript application with Firebase Auth, role-aware routing, and the full app shell so that every subsequent epic can build on a stable, authenticated scaffold.

---

### E01-S01 — Portal Project Scaffold [Phase 1]

**Priority**: P1 | **Complexity**: M | **Linked spec story**: US-3 (prerequisite) | **Dependencies**: none

**Rationale**: The entire portal lives in `Portal/`. This story creates the Vite + React 19 + TypeScript project, installs all dependencies (TanStack Query, XState v5, Zustand, Tailwind CSS, React Router v7, Firebase SDK v10), and establishes the exact directory structure defined in the architecture (`pages/`, `components/`, `api/`, `workflows/`, `hooks/`, `store/`, `lib/`, `types/`).

**Acceptance Criteria**:
- `Portal/` is a Vite + React 19 TypeScript project; `npm run dev` starts the dev server without errors on port 5173.
- All dependencies are installed and importable: `react-router-dom` v7, `@tanstack/react-query` v5, `xstate` v5, `zustand`, `firebase` v10, `tailwindcss`.
- `Portal/src/lib/firebase.ts` initialises Firebase app with env vars from `.env.local`; `getAuth()`, `getFirestore()`, `getStorage()` are exported.
- `Portal/src/lib/queryClient.ts` exports a singleton `QueryClient`.
- Directory skeleton exists: `pages/`, `components/layout/`, `workflows/configs/`, `workflows/shared/`, `hooks/`, `api/`, `store/`, `types/`.
- `tailwind.config.ts` is configured; a basic Tailwind class renders correctly in `App.tsx`.

**Backend endpoints needed**: None for this story.

**Frontend screens/components**:
- `Portal/` project root (vite.config.ts, tsconfig.json, index.html, package.json)
- `Portal/src/lib/firebase.ts`
- `Portal/src/lib/queryClient.ts`
- `Portal/src/App.tsx` (placeholder root)
- `Portal/src/main.tsx`

---

### E01-S02 — Firebase Auth Integration: Email/Password, Google Sign-In, Signup & Forgot Password [Phase 1]

**Priority**: P1 | **Complexity**: M | **Linked spec story**: US-1, US-3 | **Dependencies**: E01-S01

**Status**: ✅ IMPLEMENTED with Hybrid Auth System (2026-06-01)

**Rationale**: All portal screens require authentication. This story wires up:
- Email/password login with Firebase Auth
- Google OAuth sign-in (federated identity)
- Client self-signup (email/password)
- Forgot password / reset link flow
- Zustand `authStore` with decoded user + role claim
- Typed `apiFetch` client injecting Bearer tokens on every call
- **NEW: Hybrid auth system supporting 3 user onboarding scenarios with email-based sync**

**Acceptance Criteria**:
- `LoginPage.tsx` — email/password form + "Sign in with Google" button; successful login stores Firebase user in `authStore` and redirects to role dashboard.
- `SignupPage.tsx` — client self-signup form (email, password, full name, mobile, optional business name); calls `POST /api/auth/register` after Firebase Auth account creation; shows "Check your email" confirmation.
- `ForgotPasswordPage.tsx` — email form; calls Firebase `sendPasswordResetEmail`; shows confirmation and link to return to login.
- `Google OAuth` — configured in Firebase Console; redirect back to `http://localhost:5173/login` after sign-in.
- `Portal/src/store/authStore.ts` — `onAuthStateChanged` populates `{ user, role, loading }`.
- `Portal/src/hooks/useAuth.ts` — exports `{ user, role, loading, isAuthenticated }` by reading role from Firestore `/users/{uid}` document.
- `Portal/src/api/client.ts` — `apiFetch<T>()` injects `Authorization: Bearer <token>` from `currentUser.getIdToken()` on every call (auto-refreshes if expired).
- `setPersistence(auth, browserLocalPersistence)` called on app mount (survives page refresh).
- Logout clears `authStore` and redirects to `/login`.

**Hybrid Auth System — 3 Scenarios** (NEW 2026-06-01):
1. **Scenario 1: New Self-Signup (Email/Google)** → User without admin record → Creates with role='client'
2. **Scenario 2: Admin Creates Team Member** → Admin creates joe@gmail.com with role='manager' → Joe receives password reset email → On login, role is preserved
3. **Scenario 3: Admin + Google Merge** → Admin creates joe@gmail.com → Joe signs in via Google → Email-based Firestore lookup → Role preserved, profile synced, account linking attempted

**Implementation Notes** (Updated 2026-06-13):
- ✅ Hybrid auth system fully implemented in backend auth flow
- ✅ `POST /api/auth/register` now implements email-based search:
  - Searches Firestore by email FIRST (for admin-created users)
  - If found: UPDATEs with provider sync, PRESERVEs role, tracks authProviders
  - If not found: CREATEs as 'client'
  - Returns scenario type for debugging: 'admin-created-merge' or 'new-self-signup'
- ✅ LoginPage passes `provider: 'email'` or `provider: 'google'` parameter to registration endpoint
- ✅ Firestore fields: `authProviders[]` (tracks ['email'] or ['google'] or ['email','google']), `signInMethod` ('email'|'google'|'both')
- ✅ Profile sync on Google signin: name, mobile, profilePictureUrl synced from Google provider
- ✅ Custom claims set automatically on role changes: `admin.auth().setCustomUserClaims(uid, { role })`
- ✅ Firebase import fixed in auth.routes.js: Added `import { getDb }` for Firestore queries
- Role is stored in **Firestore** `/users/{uid}` document (not Firebase custom claims) for easier development testing
- Backend `POST /api/auth/register` creates user document with `role: "client"` by default (or admin-assigned role if found)
- `useAuthListener()` reads role from Firestore via `getDoc(doc(db, 'users', uid))` instead of `getIdTokenResult().claims`
- This allows changing role directly in Firestore console for testing without needing Firebase Console custom claims UI
- ✅ BUG FIX (2026-06-13): `upsertUser` UPDATE path — `authProviders` now derived from Firebase Auth `providerData` when no Firestore doc exists yet, instead of incorrectly defaulting to `['email']` (broke Google-only users)
- ✅ BUG FIX (2026-06-13): Firebase Auth `providerId: 'password'` now correctly mapped to `'email'` (was left as `'password'`, causing spurious password-reset emails for existing email/password users)
- ✅ BUG FIX (2026-06-13): `createdAt` is now written on first Firestore doc creation even when going through the UPDATE path (e.g. Firebase Auth user with no prior Firestore doc)
- ✅ BUG FIX (2026-06-13): `setCustomUserClaims` wrapped in try/catch on UPDATE path — gracefully handles edge case where UID has no Firebase Auth account yet (Firestore-only placeholder); claims are set on next login

**Backend endpoints needed**:
- ✅ `POST /api/auth/register` — creates `users/{uid}` with role; searches by email for admin-created users; accepts { fullName, email?, mobile?, businessName?, state?, provider }
- ✅ `GET /api/auth/me` — verify token, return decoded claims + Firestore profile

**Frontend screens/components**:
- `Portal/src/pages/auth/LoginPage.tsx` — email/password form + Google button
- `Portal/src/pages/auth/SignupPage.tsx` — client registration form
- `Portal/src/pages/auth/ForgotPasswordPage.tsx` — password reset flow
- `Portal/src/store/authStore.ts`
- `Portal/src/hooks/useAuth.ts`
- `Portal/src/api/client.ts`

---

### E01-S03 — Role-Based Routing & Protected Routes [Phase 1]

**Priority**: P1 | **Complexity**: M | **Linked spec story**: US-1, US-2, US-3 | **Dependencies**: E01-S02

**Rationale**: Every page in the portal has a defined set of allowed roles (architecture §2.2). `ProtectedRoute` enforces both auth state and role. `RoleRedirect` sends each role to its home dashboard on login.

**Acceptance Criteria**:
- `Portal/src/routes/index.tsx` — `createBrowserRouter` defines all routes listed in architecture §2.2 route tree; placeholder page components are used where the real page doesn't exist yet.
- `ProtectedRoute.tsx` redirects unauthenticated users to `/login`; users with insufficient role see `/unauthorized`.
- `RoleRedirect.tsx` — `/dashboard` redirects to `/dashboard/admin`, `/dashboard/manager`, `/dashboard/team-member`, or `/dashboard/client` based on role.
- Route `/workflow-settings` is `admin`-only; attempting access as `manager` redirects to `/unauthorized`.
- Route `/reports/*` allows `admin` and `manager` only (except `/reports/client-delays` which allows `client`).
- `useRequireRole` hook redirects programmatically if role does not match; exported from `Portal/src/hooks/useRequireRole.ts`.

**Backend endpoints needed**: None (routing is client-side only).

**Frontend screens/components**:
- `Portal/src/routes/index.tsx`
- `Portal/src/routes/ProtectedRoute.tsx`
- `Portal/src/routes/RoleRedirect.tsx`
- `Portal/src/hooks/useRequireRole.ts`
- `Portal/src/pages/auth/UnauthorizedPage.tsx` (simple 403 screen)

---

### E01-S04 — App Shell, Sidebar & Layout [Phase 1]

**Priority**: P1 | **Complexity**: M | **Linked spec story**: US-1, US-2 | **Dependencies**: E01-S03

**Rationale**: All authenticated pages share the `AppShell` (top nav + sidebar). The sidebar is role-aware — clients see only their tabs; admins see all. The `NotificationBell` shows the unread count badge and links to `/notifications`.

**Acceptance Criteria**:
- `AppShell.tsx` wraps all authenticated routes; renders `Sidebar` on the left and a top navbar.
- `Sidebar.tsx` — navigation items are conditionally rendered by role; `client` sees: Tasks, Documents, Payments, Notifications, Services; `team_member` sees: My Queue, Tasks, Notifications; `admin/manager` see: Dashboard, Tasks, Clients, Users, Reports, Workflow Settings (admin only), Notifications.
- `NotificationBell.tsx` — shows a badge with unread count; count is driven by the `useNotifications` hook (Firestore real-time listener on `notifications/{uid}/items` where `read == false`); clicking navigates to `/notifications`.
- Active route is highlighted in the sidebar.
- Sidebar collapses to icon-only on mobile viewport; hamburger toggle works.
- Shared components exist: `ConfirmDialog.tsx`, `LoadingSpinner.tsx`, `ErrorBoundary.tsx`.

**Backend endpoints needed**: `GET /api/notifications` (needed for bell badge — can be a count endpoint or reuse full list).

**Frontend screens/components**:
- `Portal/src/components/layout/AppShell.tsx`
- `Portal/src/components/layout/Sidebar.tsx`
- `Portal/src/components/layout/NotificationBell.tsx`
- `Portal/src/components/shared/ConfirmDialog.tsx`
- `Portal/src/components/shared/LoadingSpinner.tsx`
- `Portal/src/components/shared/ErrorBoundary.tsx`
- `Portal/src/hooks/useNotifications.ts`

---

## E-02 — Workflow Engine

**Goal**: Implement the XState v5 Company Incorporation machine, the backend transition endpoint, and task creation with config-layer merge so that workflow state is reliably instantiated, persisted, and advanced through all 41 steps including payment gates, parallel groups, and resubmission branches.

> **⚠️ STATUS UPDATE (2026-06-13) — workflows are DATA-DRIVEN; see architecture.md §1.3.**
> - **E02-S01 (machine):** ✅ done, but **re-architected from code to data.** The 41-step
>   incorporation machine now lives as a Firestore **definition** (`workflowDefinitions/company-incorporation`)
>   compiled to XState at runtime by the shared `compileDefinition.js` (verified behaviourally
>   equivalent). New flows are documents, not code files. The hardcoded `companyIncorporation.machine.ts`
>   is retained only as the seed source; the spec's parallel `incorporation_docs` region and the
>   `__tests__` Vitest file are NOT implemented (incorporation modelled as linear+branch).
> - **E02-S03 (task creation):** ✅ **`POST /api/tasks`** built (admin/manager, Zod-validated). Creates a
>   task from the compiled definition; pins `workflowDefinitionId`+`workflowVersion` (immutable per task);
>   writes per-step instance state to a `tasks/{id}/steps/{n}` **subcollection** (+ denormalized `totalSteps`).
>   "Config-layer merge" is now "instance state from definition steps."
> - **E02-S02 (transition endpoint):** ⏳ NOT built yet — `POST /api/tasks/:id/transition` is **Phase 2**
>   (step execution). Tasks can be created/assigned but not yet advanced.
> - **E03-S03 (task creation UI):** ✅ Entry point is **"Assign Service" on the client profile**
>   ([ClientForm.tsx](../../Portal/src/components/users/ClientForm.tsx)) → lists workflow-backed services →
>   creates the task; appears in the Tasks list ([TasksPage.tsx](../../Portal/src/pages/tasks/TasksPage.tsx)).
> - **Assignment:** `step.assignedRole` (role, from definition) vs `task/step.assignedTo` (user UID). Today
>   `assignedTo` is **null** on create — assigning to a specific user/role is **Phase 4**, not built.

---

### E02-S01 — XState Machine — Company Incorporation (Code Layer) [Phase 1]

**Priority**: P1 | **Complexity**: XL | **Linked spec story**: US-3, US-6 | **Dependencies**: E01-S01

**Rationale**: The machine is the authoritative source of workflow topology. All 41 steps, payment guards, parallel regions, branch decisions, and resubmission loops must be modelled before any step execution can be tested. This is the highest-complexity story in the project.

**Acceptance Criteria**:
- `Portal/src/workflows/configs/companyIncorporation.machine.ts` — `createMachine({...})` covers all 41 states as outlined in the spec workflow definition (§ "Company Incorporation").
- `Portal/src/workflows/shared/types.ts` — exports `WorkflowContext`, `PaymentStatus`, `TaskStatus`, `StepMetadata`, and the full `WorkflowEvent` union type (all events from architecture §4.3).
- `Portal/src/workflows/shared/guards.ts` — exports `paymentGateGuard`, `partPaymentAllowedGuard`, `adminOverrideGuard`, `clientApprovalPendingGuard`, `allParallelCompleteGuard`.
- `Portal/src/workflows/shared/actors.ts` — exports `documentReviewActor` (fromCallback), `emailTriggerActor` (fromPromise).
- `Portal/src/workflows/shared/actions.ts` — exports `sendEmailAction`, `writeAuditAction`, `setCurrentStepAction`, `markTaskCompleted`, `setPaymentBlinkingIndicator`.
- Steps 22–26 carry `allowedWithoutPayment = true` context; the machine does not block on them when `paymentStatus == 'part_paid'`.
- The incorporation_docs compound state uses `type: 'parallel'` with doc_preparation and form_fill regions; `onDone` fires only when both complete.
- Resubmission branch from `resubmission_branch` transitions to `name_collection` (for new name) or `resubmission_docs` (for documentation), incrementing `resubmissionCount` in context.
- Unit tests (Vitest) verify: initial state is `payment_gate`; `RECORD_PAYMENT` with `fully_paid` transitions to `work_assignment`; `BRANCH_DECISION({ branch: 'new_name' })` transitions back to `name_collection`.

**Backend endpoints needed**: None (this is the shared machine config — used by both frontend and backend).

**Frontend screens/components**:
- `Portal/src/workflows/configs/companyIncorporation.machine.ts`
- `Portal/src/workflows/shared/types.ts`
- `Portal/src/workflows/shared/guards.ts`
- `Portal/src/workflows/shared/actors.ts`
- `Portal/src/workflows/shared/actions.ts`
- `Portal/src/workflows/configs/__tests__/companyIncorporation.test.ts` (Vitest unit tests)

---

### E02-S02 — Backend Transition Endpoint [Phase 1]

**Priority**: P1 | **Complexity**: L | **Linked spec story**: US-3 | **Dependencies**: E02-S01

**Rationale**: `POST /api/tasks/:taskId/transition` is the core engine call. It hydrates the persisted snapshot, sends the XState event, persists the new snapshot atomically with step status updates, and fires notification side-effects.

**Acceptance Criteria**:
- `POST /api/tasks/:taskId/transition` — accepts `{ event: { type, ...payload } }`; requires roles `admin | manager | team_member` (clients may only send client-specific events: `CLIENT_APPROVE`, `CLIENT_REJECT`, `REQUEST_CORRECTION`).
- Backend imports the correct machine via `getMachineForWorkflow(workflowId)` (supports `company_incorporation` in Phase 1).
- `createActor(machine, { snapshot: taskDoc.machineSnapshot })` hydrates the actor; `actor.send(event)` fires the event; `actor.getPersistedSnapshot()` captures the new snapshot.
- Firestore batch: updates `tasks/{taskId}` (`machineSnapshot`, `currentStepNumber`, `updatedAt`) AND all affected `taskSteps/{taskId}/steps/{stepId}` status fields atomically.
- `applySnapshotDiffToSteps` derives which steps changed from `active → completed` and which changed from `pending → active` and writes those updates.
- `triggerNotificationsForTransition` is called fire-and-forget after the batch commits.
- `ADMIN_OVERRIDE_PAYMENT` event is only accepted if `req.user.role === 'admin'`; otherwise returns HTTP 403.
- Returns `{ success: true, data: { snapshot: newSnapshot } }`.
- Invalid event types or events rejected by guards return `{ success: false, error: "...", code: "GUARD_FAILED" }` with HTTP 400.

**Backend endpoints needed**:
- `POST /api/tasks/:taskId/transition`

**Frontend screens/components**: None (backend only — frontend integration tested in E03-S02).

---

### E02-S03 — Task Creation Endpoint (Config Layer Merge) [Phase 1]

**Priority**: P1 | **Complexity**: L | **Linked spec story**: US-3 | **Dependencies**: E02-S01

**Rationale**: `POST /api/tasks` reads the Firestore config layer, instantiates the XState machine with `stepMetadata` populated, and writes the task + all step documents in one Firestore batch. Nothing in the portal works until tasks exist.

**Acceptance Criteria**:
- `POST /api/tasks` — accepts `{ clientUid, workflowType, paymentStatus, amountTotal, assignedTo? }`; allowed roles: `admin | manager | team_member`.
- Backend reads all `workflowTemplates/{workflowType}/steps` documents and builds `stepMetadata` map.
- `createActor(machine, { input: { taskId, clientUid, paymentStatus, stepMetadata } })` is called; `actor.start()` produces the initial snapshot.
- Firestore batch writes: `tasks/{taskId}` (full task doc + `machineSnapshot`) + one `taskSteps/{taskId}/steps/{stepId}` document per step (status `active` for the initial step(s), `pending` for all others).
- If `paymentStatus === 'not_paid'` and creator is `manager` → task `status = 'pending_admin_approval'`; admin notified.
- If creator is `team_member` → task `status = 'pending_manager_approval'`; all managers notified.
- Task ID is auto-generated (Firestore `doc().id`); returned in response as `{ success: true, data: { taskId } }`.
- `POST /api/tasks/:taskId/approve` — admin/manager approves a pending task; XState machine is advanced to `work_assignment`; notifies creator and client.
- `POST /api/tasks/:taskId/reject` — admin/manager rejects with reason; task `status = 'rejected'`; creator notified.

**Backend endpoints needed**:
- `POST /api/tasks`
- `POST /api/tasks/:taskId/approve`
- `POST /api/tasks/:taskId/reject`

**Frontend screens/components**: None (backend only — frontend UI in E03-S03).

---

### E02-S04 — Conditional Branching & Resubmission Loop [Phase 1]

**Priority**: P2 | **Complexity**: M | **Linked spec story**: US-6 | **Dependencies**: E02-S02

> **✅ BUILT (status reconciled 2026-06-21).** `transitionTask` handles `BRANCH_DECISION` and the
> `GOVT_REJECT`/resubmission events end-to-end through `POST /api/tasks/:taskId/transition`; the persisted
> XState snapshot drives step (re)activation, and conditional-branch steps that don't apply on a given
> path are skipped. Branch decision is surfaced as a UI affordance on the step hero. Edge coverage exists
> via `Portal/e2e/step-execution.spec.ts`.

**Rationale**: Resubmissions from government departments are common in Indian regulatory filings. The machine topology supports them (story E02-S01), but this story validates the end-to-end flow through the backend transition endpoint including branch decision UI affordances.

**Acceptance Criteria**:
- `BRANCH_DECISION { branch: "new_name" }` event fired via `POST /api/tasks/:taskId/transition` — machine snapshot transitions to `name_collection` compound state; `resubmissionCount` is incremented in context; step status correctly reflects active = step 6.
- `BRANCH_DECISION { branch: "documentation" }` — machine transitions to `resubmission_docs`; correct steps become active.
- Delay count for "Due to Department" is incremented in the task context on each resubmission (stored in `WorkflowContext.resubmissionCount`).
- `GET /api/tasks/:taskId/steps` returns the correct `status` for all affected steps after a branch transition (some steps may be re-activated; completed steps retain their history in `auditLog`).
- Frontend `StepDetailPage` (E03-S02) shows a branch-decision selector when the step type is `branch_point`; the decision is sent as the `BRANCH_DECISION` event.

**Backend endpoints needed**:
- `POST /api/tasks/:taskId/transition` (already created in E02-S02 — this story exercises branch events)
- `GET /api/tasks/:taskId/steps`

**Frontend screens/components**:
- `Portal/src/pages/workflow/StepDetailPage.tsx` (branch decision UI section)

---

## E-03 — Task Management

**Goal**: Enable admin and manager to create tasks and manage approval chains; enable team members to view their assigned step queue and execute steps (mark complete, reassign, flag urgent).

> **✅ STATUS UPDATE (2026-06-13) — step execution + matter management built.** (Vocabulary: a
> "Matter" is the running instance; its steps are "Tasks". See the Vocabulary section up top.)
> - **Backend-authoritative execution:** `POST /api/tasks/:id/transition` rebuilds the matter's
>   compiled (pinned) workflow, resumes at the current step, applies the event under engine guards,
>   and persists. Handles `COMPLETE_STEP`, `RECORD_PAYMENT`, `ADMIN_OVERRIDE_PAYMENT`,
>   `BRANCH_DECISION`, `CLIENT_APPROVE/REJECT`, `GOVT_APPROVE/REJECT`. Invalid moves rejected;
>   payment gates enforced. ([tasks.controller.js](../../backend/src/controllers/tasks.controller.js))
> - **Step status lifecycle:** the step left → `completed`; landed-on → `active`. On a forward JUMP,
>   bypassed steps are classified: a satisfied **payment gate** → `completed` (auto-passed, no action
>   needed); a **conditional branch** step that doesn't apply (e.g. 14–19 when Govt approves at 13) →
>   `skipped`. (Inferred from step-number ranges + step type — a known limitation vs. the engine
>   emitting traversed steps directly; fine for the current linear+branch flow.)
> - **Action comments / audit:** events accept an optional `remark` (required on CLIENT_REJECT /
>   GOVT_REJECT); stored on the acted-on step + appended to a `tasks/{id}/events` audit subcollection.
> - **Task detail UI:** role-branched 3-tab (Steps/Documents/Payments); context-aware action buttons
>   derived from the current step's definition; step title + description shown. ([TaskDetailPage.tsx](../../Portal/src/pages/tasks/TaskDetailPage.tsx))
> - **Matters list:** scannable rows (client anchor, service, status, payment, progress, recency),
>   search, urgent-first sort; completed matters show "Completed · N of N" (no 9999 leak).
> - **Delete matter (admin-only):** `DELETE /api/tasks/:id` cascades the `steps` + `events`
>   subcollections then the doc (Firestore doesn't cascade). UI: trash action on each Matters row
>   (admin), with confirm + cache invalidation.
> - **Cross-role freshness:** global `refetchOnWindowFocus` + polling on the matters list (15s) and
>   detail (10s) so admin↔client changes appear without a manual refresh (React Query cache is
>   per-browser-context). Real-time `onSnapshot` remains a later option.
> - **Bug fixes:** workflow topology (Govt-approve at 13 → 20; synthetic final step so matters can
>   complete); 9999 sentinel no longer shown; admin override now advances immediately.
> - **My Tasks — consolidated cross-matter worklist (E03-S01):** new staff page surfacing the
>   **active step of every open matter** the user is involved in, as one to-do inbox (no opening
>   matters one by one). `GET /api/tasks/my-steps` returns each open matter's active step enriched
>   with client/service/urgency/recency and bucketed: **Assigned to me** vs **Available to pick up**.
>   Role-scoped (admin/manager see all open matters; team members see matters/steps that are theirs
>   or unassigned). Urgent-first, polled (15s). Nav: "My Tasks" for all staff roles.
>   ([MyTasksPage.tsx](../../Portal/src/pages/tasks/MyTasksPage.tsx), [tasks.controller.js](../../backend/src/controllers/tasks.controller.js) `listMySteps`)
> - **Assignment — step-level AND matter-level (2026-06-14):**
>   - **Step owner:** `PATCH /api/tasks/:id/steps/:n { assignedTo }` assigns the **current step** to a
>     staff user (null → back to the shared pool). Surfaced as a **"Step owner"** picker in the step
>     hero. Routes that step into the assignee's "My Tasks".
>   - **Matter owner:** `PATCH /api/tasks/:id { assignedTo }` assigns the **whole matter** (all steps)
>     to one user and **cascades onto the active step** (without clobbering a step delegated elsewhere).
>     Validates the assignee is staff (rejects clients). Surfaced as a **"Matter owner"** control in the
>     page header. ([tasks.controller.js](../../backend/src/controllers/tasks.controller.js) `patchTask`)
>   - **Team-member routing fixed:** lists/My-Tasks for `team_member` now union *matters assigned to them*
>     ∪ *matters where a step is assigned to them* (collection-group query on `steps.assignedTo`; field
>     override deployed). Previously `assignedTo` was always null so team members saw nothing.
> - **Activity thread (real audit feed):** `GET /api/tasks/:id/events` returns the matter's event history
>   name-enriched (who/what/when + comment), and each entry **references the step acted on** as
>   *phase · Step N · title* (looked up from the pinned definition; events store only the step number).
>   Shown as an **Activity** section on the task detail; clients can read their own matter's thread.
>   ([tasks.controller.js](../../backend/src/controllers/tasks.controller.js) `listTaskEvents`)
> - **Task detail redesign (Option 3 — timeline-centric, 2026-06-14):** replaced the flat stacked-cards
>   view with a clearer hierarchy: left **stage rail** (phases w/ done/total + status dots; collapses to
>   a dropdown on mobile, hidden when a flow has no phases), a **merged hero panel** (step action +
>   Step-owner/Documents in one elevated container), then quieter **Activity** and **Steps** sections.
>   A **"pending-on" summary** ("N remaining · X Our team · Y Client · Z Registrar") + a whose-turn chip
>   ("With our team" / "Waiting on client" / "With registrar") restore the at-a-glance ownership signal.
>   Completed steps are **expandable** (who/when/remark). Matter status shown once in the page header
>   (no in-body duplication). Back is a leading-left link. Responsive desktop ↔ mobile.
> - **Still TODO:** approval-chain management (E03-S04); reassign-with-accept handshake (E03-S02);
>   assignment on matter creation + assigning not-yet-active steps in advance; real document attach (E05).

---

### E03-S01 — Team Member Step Queue [Phase 1]

**Priority**: P1 | **Complexity**: M | **Linked spec story**: US-2 | **Dependencies**: E02-S02, E01-S04

> **✅ Delivered (2026-06-13) as "My Tasks".** Implemented for **all staff roles** (not just team
> members) as a consolidated cross-matter worklist at `/my-tasks`. Differences from the original
> spec below: the endpoint is `GET /api/tasks/my-steps` (returns each open matter's **active step**,
> not a flat `taskSteps` query); rows are bucketed **Assigned to me / Available to pick up** rather
> than only `assignedTo == me`; freshness is via polling (15s) rather than `onSnapshot` (deferred).
> Step-level `assignedTo` is now writable (see E-03 status block). Reassign-with-accept handshake and
> the "Blocked — Payment Pending" label remain TODO.

**Rationale**: The step queue is the core daily-use screen for team members — the primary replacement for the spreadsheet.

**Acceptance Criteria**:
- `TeamMemberDashboard.tsx` and `TaskListPage.tsx` for `team_member` role — shows only steps where `assignedTo == currentUser.uid`, grouped by client/workflow.
- `GET /api/tasks?assignedTo=me` — backend filters `taskSteps` collection for steps with `assignedTo == req.user.uid` and `status IN ['active', 'blocked']`; returns enriched list including task + client name.
- Steps are grouped by `taskId`; within each task, active steps are shown at the top.
- Blocked steps (payment pending) display a red "Blocked — Payment Pending" label; no complete action is available.
- `useTask` hook (TanStack Query) caches task data under `["tasks", taskId]`; `useRequireRole` guards the page to `team_member | manager | admin`.
- Real-time Firestore `onSnapshot` on `taskSteps/{taskId}/steps` updates the queue without requiring a page refresh.

**Backend endpoints needed**:
- `GET /api/tasks` (with role-based filter: team_member sees only their assigned tasks)
- `GET /api/tasks/:taskId/steps`

**Frontend screens/components**:
- `Portal/src/pages/dashboard/TeamMemberDashboard.tsx`
- `Portal/src/pages/tasks/TaskListPage.tsx` (team_member view)
- `Portal/src/components/tasks/StepCard.tsx`
- `Portal/src/hooks/useTask.ts`

---

### E03-S02 — Step Execution (Complete, Query, Reassign) [Phase 1]

**Priority**: P1 | **Complexity**: L | **Linked spec story**: US-2 | **Dependencies**: E03-S01, E02-S02

> **✅ Reassignment BUILT — DIRECT + audited (revised 2026-06-14).** The "reassign to another team
> member" half of this story is done (the other halves — mark-complete, doc-query — were already covered
> by the transition endpoint + E05 stub).
> - **⚠️ DESIGN CHANGED (2026-06-14):** an earlier accept/decline **handshake** was built then **removed**
>   per user decision — *"we should not need acceptance, but yes record in the activity reassignments
>   also."* Reassignment is now **direct and immediate**: changing the **Step owner** picker on the task
>   detail (admin/manager, or the step's current owner) moves ownership at once.
> - **Audited:** `PATCH /api/tasks/:id/steps/:n { assignedTo }` records a `STEP_REASSIGNED` event in the
>   matter's activity thread ("Reassigned to X (from Y)" / "Unassigned"). Surfaces in the Activity feed.
> - **Removed artifacts:** the `offer`/`accept`/`decline` endpoints, `reassignOffer` step field, the
>   `steps.reassignOffer.toUid` index override, and the My Tasks "Reassignments offered to you" section
>   are all gone.
> - **Still TODO (this story):** "Raise Document Query" (needs E-07 notifications); blocked-step gating.

**Rationale**: A team member must be able to act on steps: mark complete (fires `COMPLETE_STEP` XState event), raise a document query (sends notification to client), and reassign to another team member. These are the three primary daily interactions.

**Acceptance Criteria**:
- `StepDetailPage.tsx` — shows step metadata, current status, assigned team member, deadline countdown, audit log.
- "Mark Complete" button fires `POST /api/tasks/:taskId/transition { event: { type: "COMPLETE_STEP", stepId, completedBy } }`; on success, TanStack Query cache for `["tasks", taskId]` is invalidated; step transitions to `completed` and next step becomes `active`.
- "Raise Document Query" — opens a modal to write a query message; fires `POST /api/notifications` to create an in-app notification for the client with a deep-link to the upload screen.
- "Reassign Step" — opens a team member picker; fires `POST /api/tasks/:taskId/transition { event: { type: "REASSIGN_STEP", stepId, toUid } }`; reassigned member receives a notification with accept/reject options; original assignee retains ownership until accepted.
- Firestore audit entry (`auditLog/{entryId}`) is written by the backend on every `COMPLETE_STEP` event.
- Steps with `status = 'blocked'` (payment gate) show no complete action unless `role === 'admin'`.

**Backend endpoints needed**:
- `POST /api/tasks/:taskId/transition`
- `PATCH /api/tasks/:taskId/steps/:stepId` (for reassign metadata)
- `POST /api/notifications` (document query notification)

**Frontend screens/components**:
- `Portal/src/pages/workflow/StepDetailPage.tsx`
- `Portal/src/components/tasks/StepTimeline.tsx`
- `Portal/src/components/tasks/StepCard.tsx` (complete/reassign actions)

---

### E03-S03 — Admin/Manager Task Creation UI [Phase 1]

**Priority**: P1 | **Complexity**: M | **Linked spec story**: US-3 | **Dependencies**: E02-S03, E09-S02

**Rationale**: Creating a task is the entry point — the UI that calls `POST /api/tasks`. Admin and manager see a form to select client, workflow, payment status, and assign a team member to the work assignment step.

**Acceptance Criteria**:
- `NewTaskPage.tsx` — form with: client picker (searchable dropdown populated from `GET /api/portal/users?role=client`), workflow selector (`company_incorporation` in Phase 1), payment status (`not_paid | part_paid | fully_paid`), amount total, payment mode (if part/full paid), payment date, assign team member (optional — can be assigned later at step 3).
- On submit, calls `POST /api/tasks`; on success, redirects to `TaskDetailPage` for the new task.
- If submitter is `team_member`, the form also requires uploading payment proof; task submission sets status to `pending_manager_approval`; a banner confirms "Your task is pending manager approval."
- If submitter is `manager` with `not_paid`, a confirmation dialog explains the task will require admin approval before activation.
- `TaskListPage.tsx` (admin/manager view) — shows all tasks with filter/sort by status, service, client, team member; uses TanStack Query with `["tasks", "list"]` cache key; paginated.
- `TaskDetailPage.tsx` — shows task overview (client, workflow, status, payment summary) with three tabs: Steps | Documents | Payments.

**Backend endpoints needed**:
- `POST /api/tasks`
- `GET /api/tasks`
- `GET /api/tasks/:taskId`
- `GET /api/portal/users?role=client` (client picker)
- `GET /api/portal/users?role=team_member` (assignee picker)

**Frontend screens/components**:
- `Portal/src/pages/tasks/NewTaskPage.tsx`
- `Portal/src/pages/tasks/TaskListPage.tsx` (admin/manager view)
- `Portal/src/pages/tasks/TaskDetailPage.tsx`

---

### E03-S04 — Task Approval Workflow [Phase 1]

**Priority**: P1 | **Complexity**: M | **Linked spec story**: US-13 | **Dependencies**: E03-S03, E07-S01

> **✅ BUILT (2026-06-14) — manager→admin gate; chain is role-derived & extensible.** Scope chosen:
> a **manager-created** matter enters `pending_admin_approval` (first step held `pending`, kept out of
> worklists); an **admin-created** matter activates immediately. (Team-member creation isn't enabled,
> so the team_member→manager leg is N/A today; the `needsApproval` seam in `createTask` extends it.)
> - `POST /api/tasks/:id/approve` (admin) → matter `active`, first step activated, logged `TASK_APPROVED`.
> - `POST /api/tasks/:id/reject` (admin, **reason required**) → matter `rejected`, reason stored + logged.
>   ([tasks.controller.js](../../backend/src/controllers/tasks.controller.js))
> - **Task detail** shows an amber approval banner (admins get Approve / Reject-with-reason; others see
>   a waiting note); a rejected matter shows the reason. **Matters list** has "Awaiting approval" / "rejected"
>   badges. ([TaskDetailPage.tsx](../../Portal/src/pages/tasks/TaskDetailPage.tsx), [TasksPage.tsx](../../Portal/src/pages/tasks/TasksPage.tsx))
> - **Surfaced as worklist items (E11-S04):** approval to-dos appear in My Tasks + a dashboard widget;
>   approver is role-derived via `canApprove(user, matter)` (admin today, extensible). Notifications/email
>   on submit deferred to E-07. New statuses added: `pending_admin_approval`, `rejected`.

**Rationale**: The approval chain (team_member → manager → admin) is a core business process. Without it, tasks created by non-admins cannot be activated.

**Acceptance Criteria**:
- When a `team_member` submits a task, all managers receive an in-app notification linking to the task detail; task card shows `pending_manager_approval` badge.
- Manager's task list highlights pending-approval tasks; "Approve" and "Reject (with reason)" buttons are visible on the task detail when `status = 'pending_manager_approval'` and `role = 'manager | admin'`.
- `POST /api/tasks/:taskId/approve` — transitions task to `active`; fires `TASK_APPROVED` XState event; notifies team_member and client.
- `POST /api/tasks/:taskId/reject` — transitions task to `rejected`; notifies submitter with reason; submitter can revise and resubmit (PUT to same task with status reset to draft).
- When a `manager` submits a task with `not_paid`, admins are notified; admin-only approval controls appear.
- Escalation: if an approval is pending for > 24 hours, a reminder notification is sent to the approver (scheduled via Cloud Scheduler or a Firestore TTL-triggered function — implementation detail TBD at dev time).

**Backend endpoints needed**:
- `POST /api/tasks/:taskId/approve`
- `POST /api/tasks/:taskId/reject`
- `PATCH /api/tasks/:taskId` (for resubmission after rejection)

**Frontend screens/components**:
- `Portal/src/pages/tasks/TaskDetailPage.tsx` (approval action buttons)
- `Portal/src/pages/dashboard/AdminDashboard.tsx` (pending approvals section)
- `Portal/src/pages/dashboard/ManagerDashboard.tsx` (pending approvals section)

---

### E03-S05 — Urgent Task Flagging [Phase 1]

**Priority**: P3 | **Complexity**: S | **Linked spec story**: US-10 | **Dependencies**: E03-S01

**Rationale**: Urgent flagging is explicitly required and is a simple field toggle, but it is a P3 (non-blocking for core workflow).

**Acceptance Criteria**:
- Admin and manager see a "Mark Urgent" toggle on `StepDetailPage` and `TaskDetailPage`; team_member and client see an `UrgentBadge` but cannot toggle.
- `PATCH /api/tasks/:taskId/steps/:stepId { isUrgent: true }` — writes `isUrgent = true` to the step document; real-time Firestore update propagates to all open sessions viewing that step.
- `PATCH /api/tasks/:taskId { isUrgent: true }` — marks the entire task urgent.
- `UrgentBadge.tsx` — red blinking border indicator; shown on `StepCard`, `TaskListPage` row, and client `TaskDetailPage`.
- On step completion, `isUrgent` is automatically cleared (backend sets `isUrgent = false` when `COMPLETE_STEP` event is processed).
- Admin dashboard shows a dedicated "Urgent" section at the top of the task list (`GET /api/tasks?isUrgent=true`).

**Backend endpoints needed**:
- `PATCH /api/tasks/:taskId` (isUrgent flag)
- `PATCH /api/tasks/:taskId/steps/:stepId` (isUrgent flag)

**Frontend screens/components**:
- `Portal/src/components/tasks/UrgentBadge.tsx`
- `Portal/src/pages/dashboard/AdminDashboard.tsx` (urgent section)

---

### E03-S06 — Comment & Attach on Any Step Action [Phase 1 — comment ✅ / attach stub]

**Priority**: P1 | **Complexity**: S | **Linked spec story**: US-2 / US-13 | **Dependencies**: E03-S02, E05 (attach upload)
**Raised**: 2026-06-14

**Rationale**: When acting on a step, staff/clients need to (a) leave a **comment** explaining the action and (b) **attach a document** relevant to it. Today comments exist only on rejections/overrides (via a `window.prompt`), and there is no attach affordance on actions. Generalising comments to every transition and exposing an attach control makes each action self-documenting and audit-complete. Real file upload belongs to **E-05 (Document Cycle)**; this story delivers the **comment** end-to-end and the **attach affordance as a stub** now.

> **✅ BUILT (2026-06-14) — comment half done; attach is a stub (E-05).** The step hero now shows an
> **inline comment composer** for every action (optional on positive actions, required on rejections),
> sent as `event.remark` and persisted on the step + `events` trail; the comment surfaces in the
> Activity thread and the expandable completed-step details. The **"Attach document"** control is a
> visible-but-disabled stub (real upload = E-05). `window.prompt` is gone.

**Acceptance Criteria**:
- **Comment on every action:** the current-step action card shows an **inline comment composer** (replacing `window.prompt`). Comment is **optional** on positive actions (Complete Step, Approve, Mark as Paid, Branch decision, Govt Approved) and **required** on rejections (CLIENT_REJECT / GOVT_REJECT) — preserving the existing required-remark rule.
- The composer's value is sent as `event.remark` to `POST /api/tasks/:taskId/transition`; backend persistence is unchanged (already stores it). Comment shows in the step's history/remark and the `events` trail.
- **Attach affordance (stub now):** an "Attach document" control sits next to the composer, **visible but disabled**, with a "coming soon" hint — consistent with the Documents-tab scaffold. No bytes are uploaded; no backend change.
- Clients only see the composer on their own actionable steps; staff see it on the operational actions.
- When E-05 lands, the attach control is enabled and wired to the signed-URL upload + step `documents` (this story's stub is the seam).

**Backend endpoints needed**:
- `POST /api/tasks/:taskId/transition` (already accepts `remark`; no change for the comment half).
- *(Future, E-05)* attach upload via signed URL.

**Frontend screens/components**:
- `Portal/src/pages/tasks/TaskDetailPage.tsx` — `StepHeroPanel` inline comment composer (`ActionComposer`) + disabled attach control.

---

## E-04 — Client Portal

**Goal**: Give clients a self-service view of their tasks (steps, documents, payments) and a service catalogue, eliminating "call us to check status" interactions.

> **✅ STATUS UPDATE (2026-06-13) — client task view built (Steps live; Documents/Payments scaffolded).**
> **♻️ Steps tab redesigned 2026-06-14** — the task detail (both roles) now uses the Option-3
> timeline-centric layout (stage rail + merged step hero + Activity thread + pending-on summary); see the
> E-03 status block "Task detail redesign". Clients get the same structure, still limited to their own
> actionable steps. The bullets below describe the original build; the engine/data are unchanged.
> - **Client list (E04-S01):** ✅ `/tasks` (role-neutral) lists the client's own tasks framed as
>   purchased services — anchor is the SERVICE name, with status/payment/progress. (Client name is the
>   anchor for staff instead.) [TasksPage.tsx](../../Portal/src/pages/tasks/TasksPage.tsx).
> - **Task detail (E04-S02):** ✅ **role-branched 3-tab layout** (Steps / Documents / Payments) on a
>   single `/tasks/:id` route ([TaskDetailPage.tsx](../../Portal/src/pages/tasks/TaskDetailPage.tsx)).
>   - **Steps tab:** timeline with **title + description** (description seeded on each step, see below),
>     done/current/upcoming status, and step remarks shown inline. Clients see **only** their own-step
>     CTAs (Approve / Request Changes); all staff-internal actions are hidden and replaced with neutral
>     "waiting…" notes. Staff see the operational actions.
>   - **Documents tab:** scaffolded with a disabled "Attach document (coming soon)" — the real upload/
>     review system is **E05 (deferred)**.
>   - **Payments tab:** read-only payment status + amount paid/due; online payment is a later phase.
> - **Step descriptions:** added `description` to the workflow definition schema; seeded concise,
>   client-friendly descriptions for all 41 incorporation steps (convertMachineToDefinition.js). Carried
>   through the compiler `meta` and the `/api/workflow-definitions/:id` read endpoint.
> - **Action comments / audit:** the transition endpoint accepts an optional `remark` on events
>   (required on CLIENT_REJECT / GOVT_REJECT, optional on admin override); the comment is stored on the
>   acted-on step and an **event-history subcollection** `tasks/{id}/events` records who did what, when.
> - **Access fix:** `GET /api/workflow-definitions/:id` is now readable by ANY authenticated role (was
>   staff-only), because clients need their task's definition to render progress + CTAs. The LIST
>   endpoint stays staff-only.
> - **Journey tracker (E04-S08, 2026-06-13):** the Steps tab now leads with a client-facing **progress
>   tracker** above the step list — a phase "rail" (6 milestone stations with a you-are-here pulse +
>   animated active connector), a **next-stop hero card** (current step + who's blocking + optional ETA),
>   and a **"steps remaining" ownership strip** (You / Our team / Registrar, decrementing as steps
>   complete). Added to the definition schema: `phases[]` (+ per-step `phaseId`), plus optional
>   `typicalDurationDays`, `clientActionLabel`, `ownerType`. Owner is **derived** (`deriveOwnerType`:
>   payment-gate/CLIENT_APPROVE → client, GOVT_APPROVE → registrar, else team) so no per-step config is
>   needed; phase done/now/upcoming is computed from **real per-step statuses** (`phaseProgress`) so the
>   final phase turns green on completion. Seeded 6 phases for incorporation; re-seed required.
>   ([TaskJourneyTracker.tsx](../../Portal/src/pages/tasks/TaskJourneyTracker.tsx),
>   [definitionSchema.js](../../shared/workflows/definitionSchema.js))
> - **Not yet (later phases):** assigning steps to a specific user (Phase 4), real documents (E05),
>   online payments/receipts (E06), real-time `onSnapshot` updates, and XState snapshot rehydration
>   (we resume from stored domain fields instead — see architecture.md §1.3).

---

### E04-S01 — Client Task List [Phase 1]

**Priority**: P1 | **Complexity**: M | **Linked spec story**: US-1 | **Dependencies**: E01-S03, E02-S03

**Rationale**: The first thing a client sees on login. Must show only their tasks — never another client's data.

**Acceptance Criteria**:
- `ClientDashboard.tsx` + `TaskListPage.tsx` (client view) — lists all tasks where `clientUid == currentUser.uid`; no other client's tasks are visible (enforced by both backend filter and Firestore security rules).
- `GET /api/tasks` with role=client — backend applies `WHERE clientUid == req.user.uid`; returns task list with `workflowName`, `status`, `currentStepNumber`, `paymentStatus`.
- Each task card shows: service name, current step number / total steps, payment status badge (`PaymentBadge.tsx`), urgent indicator if `isUrgent`.
- `PaymentBadge.tsx` — if `paymentStatus !== 'fully_paid'` and a payment gate is the current blocker, badge blinks red; otherwise static colour coding (green = paid, amber = part paid, grey = no payment).
- Tapping a task navigates to `TaskDetailPage` (`/tasks/:taskId`).
- A client with multiple email IDs sees the same task list regardless of which email they used to log in (enforced by `clientUid` link, not email).

**Backend endpoints needed**:
- `GET /api/tasks` (client-scoped)

**Frontend screens/components**:
- `Portal/src/pages/dashboard/ClientDashboard.tsx`
- `Portal/src/pages/tasks/TaskListPage.tsx` (client variant)
- `Portal/src/components/tasks/PaymentBadge.tsx`

---

### E04-S02 — Task Detail — Steps Tab [Phase 1]

**Priority**: P1 | **Complexity**: M | **Linked spec story**: US-1 | **Dependencies**: E04-S01, E02-S01

**Rationale**: The Steps tab is the primary status view for the client — must accurately reflect the XState machine state.

**Acceptance Criteria**:
- `TaskDetailPage.tsx` Steps tab — renders `StepTimeline.tsx`; completed steps show a checkmark and completion date; current step is highlighted; upcoming steps are greyed out.
- Machine snapshot is rehydrated client-side: `createActor(companyIncorporationMachine, { snapshot: taskDoc.machineSnapshot })`; `useSelector` reads `currentStepNumber` and `activeStepIds` to drive rendering.
- Real-time Firestore `onSnapshot` on `tasks/{taskId}` and `taskSteps/{taskId}/steps` keeps the timeline live without page refresh.
- Steps assigned to the client (e.g. "Collect company name") show a CTA button ("Upload Document" or "Provide Approval") when `status === 'active'` and `defaultAssigneeRole === 'client'`.
- Parallel steps (DSC group) both appear as active simultaneously; both must show complete before the next sequential step activates.
- Client cannot see team-internal steps' internal notes — only `title`, `status`, `deadline` are shown.

**Backend endpoints needed**:
- `GET /api/tasks/:taskId` (includes `machineSnapshot`)
- `GET /api/tasks/:taskId/steps`

**Frontend screens/components**:
- `Portal/src/pages/tasks/TaskDetailPage.tsx` (Steps tab)
- `Portal/src/components/tasks/StepTimeline.tsx`
- `Portal/src/hooks/useWorkflowMachine.ts` (XState useMachine wrapper)

---

### E04-S03 — Task Detail — Documents Tab [Phase 1]

**Priority**: P1 | **Complexity**: M | **Linked spec story**: US-1, US-4 | **Dependencies**: E04-S02, E05-S01

**Rationale**: Clients see all their uploaded documents, their review status, rejection remarks, and re-upload buttons — replacing email chains.

**Acceptance Criteria**:
- `TaskDetailPage.tsx` Documents tab — lists all documents for the task from `documents/{taskId}/files`; shows status badge (`pending_review | approved | rejected`).
- Rejected documents show the `rejectionRemark` prominently and a "Re-upload" button that opens `DocumentUploader.tsx`.
- Approved documents show a download link (signed URL from `GET /api/tasks/:taskId/documents/:docId/signed-url`).
- Pending documents show "Under review" with upload date.
- Only documents belonging to this task (scoped by `taskId` in Storage path) are shown.

**Backend endpoints needed**:
- `GET /api/tasks/:taskId/documents` (list)
- `GET /api/tasks/:taskId/documents/:docId/signed-url` (download)

**Frontend screens/components**:
- `Portal/src/pages/tasks/TaskDetailPage.tsx` (Documents tab)
- `Portal/src/components/documents/DocumentCard.tsx`
- `Portal/src/components/documents/DocumentUploader.tsx`

---

### E04-S04 — Task Detail — Payments Tab [Phase 1]

**Priority**: P1 | **Complexity**: M | **Linked spec story**: US-1, US-5 | **Dependencies**: E04-S01, E06-S01

**Rationale**: Clients need to see what they've paid, what's due, and when payment gates block progress — this drives payment collection.

**Acceptance Criteria**:
- `TaskDetailPage.tsx` Payments tab — shows `amountTotal`, `amountPaid`, `amountDue`; payment status badge.
- If `amountDue > 0` and a payment gate step is the current blocker, the due amount blinks red with a CTA "Contact us to pay" (Phase 1 — no in-portal payment integration; Razorpay is on the public site).
- Payment history list shows all recorded payments: date, mode, amount, reference.
- Admin payment overrides appear in the list with `payment_override = true` label.

**Backend endpoints needed**:
- `GET /api/payments?taskId=:taskId`
- `GET /api/tasks/:taskId` (for `amountTotal`, `amountPaid`, `amountDue`, `paymentStatus`)

**Frontend screens/components**:
- `Portal/src/pages/tasks/TaskDetailPage.tsx` (Payments tab)
- `Portal/src/components/payments/PaymentHistory.tsx`

---

### E04-S05 — Service Catalog (staff-facing) [Phase 1]

**Priority**: P3 | **Complexity**: S | **Linked spec story**: US-12 | **Dependencies**: E01-S04

**Status**: ✅ IMPLEMENTED (2026-06-13)

**Rationale**: A service catalog for **staff** (admin/manager/team_member) to browse and customise the services Legal Terminus offers — pricing/fields that drive checkout. **Re-scoped 2026-06-13 from "client-facing listing" to staff-facing:** clients don't manage the catalog, staff do; clients are excluded.

**Acceptance Criteria**:
- `ServicesPage.tsx` — accessible to `admin`, `manager`, `team_member` (NOT `client`). Lists services with editable fields.
- Staff can update service fields via `PATCH /api/service-config/:categoryId/:key` (role-guarded).
- Catalog data fetched from `GET /api/service-config/all` (staff-only; returns all services including inactive). The public `GET /api/service-config` returns active services only (used by the marketing site / checkout).
- Surfaced as a "Service Catalog" dashboard tile + `/services` sidebar nav for staff roles.

**Backend endpoints needed**:
- `GET /api/service-config` — public, active services only
- `GET /api/service-config/all` — staff-only (verifyToken + requireRole admin/manager/team_member)
- `PATCH /api/service-config/:categoryId/:key` — staff-only, edit a service field

**Frontend screens/components**:
- `Portal/src/pages/services/ServicesPage.tsx`
- `Portal/src/api/services.ts`
- `backend/src/routes/serviceConfig.routes.js`, `backend/src/schemas/content.schema.js`

> **Note:** `/services` route + dashboard tile roles changed from `['client']` to `['admin','manager','team_member']` in `appRoutes.tsx` / `dashboardConfig.ts`.

---

### E04-S06 — Client Approval/Correction Flow [Phase 2]

**Priority**: P3 | **Complexity**: M | **Linked spec story**: US-11 | **Dependencies**: E04-S02, E02-S02

**Rationale**: Grace-period reversal for client approval/rejection errors. P3, Phase 2.

**Acceptance Criteria**:
- Client who approved or rejected a step less than 24 hours ago sees a "Request Correction" button on the step.
- `REQUEST_CORRECTION` event fires via `POST /api/tasks/:taskId/transition`; notification sent to assigned team member.
- Team member sees a "Review Correction Request" action; `APPROVE_CORRECTION` event reverts the step; original action recorded as "reversed" in audit log.
- After 24-hour window closes, the button disappears.

**Backend endpoints needed**:
- `POST /api/tasks/:taskId/transition` (REQUEST_CORRECTION, APPROVE_CORRECTION events)

**Frontend screens/components**:
- `Portal/src/pages/workflow/StepDetailPage.tsx` (correction request UI)

---

### E04-S07 — Migrate Profile & Orders into the Portal [Phase 1]

**Priority**: P2 | **Complexity**: M | **Linked spec story**: — | **Dependencies**: E01-S04, E04-S01, E06-S03 | **Raised**: 2026-06-13

> **✅ BUILT (status reconciled 2026-06-21).** Profile + Orders now live in the Portal as role-neutral
> pages (`Portal/src/pages/profile/ProfilePage.tsx`, `Portal/src/pages/orders/OrdersPage.tsx`). The
> marketing-site `/my-profile` route is reduced to a 25-line thin redirect
> (`Frontend/src/Pages/MyProfile/MyProfile.jsx` → `window.location.replace('/portal/dashboard')`); no
> account UI remains on the marketing site.

**Rationale**: Account features (Profile, Orders) currently live on the **marketing site** (`Frontend/src/Pages/MyProfile/MyProfile.jsx`) as a mini-app bolted onto the brochure site. This violates the consolidation principle established for the portal: authenticated, role-scoped application surface belongs in the Portal (React 19 + TS + Tailwind + Cal.com design system + unified `/api/portal/users`), not on the marketing site (plain JSX + hand-rolled CSS). Maintaining account UI in two stacks duplicates work and bypasses the portal's design language, auth model, and type safety. The marketing site's job is to convert and hand off to the portal — not to host an app.

**Decision (2026-06-13)**: Migrate Profile + Orders into the Portal as role-neutral pages. Reduce the marketing `/my-profile` route to a **thin redirect** (logged in → `/portal/`, logged out → login). No account UI remains on the marketing site.

**Acceptance Criteria**:
- New portal routes added to `Portal/src/routes/appRoutes.tsx` as role-neutral, available to all roles:
  - `/profile` — view/edit own profile (name, phone, email read-only, address, business details for clients). Uses unified `/api/portal/users` for self-read/self-update (a user editing their own record).
  - `/orders` — order/payment history for the current user. Client sees own orders; reuses or extends existing order-fetching logic.
- Profile + Orders surfaced in nav (sidebar + bottom nav) via `appRoutes` `nav` config, consistent with role-neutral routing — visible to all authenticated roles.
- Self-service authorization: a user can read and update **their own** `users` record via the portal regardless of role; this must not require admin/manager (`requireRole`) — backend needs a self-or-privileged guard (a user may PATCH their own uid; managing *other* users still requires `admin`/`manager`).
- Order-fetching logic from `MyProfile.jsx` (added in commit `bcd3875`) is moved into the portal's API layer (`Portal/src/api/`), not duplicated.
- Marketing `/my-profile` becomes a redirect-only route:
  - Authenticated → redirect to portal (`/portal/`).
  - Unauthenticated → redirect to login.
  - The "My Portal" tab/card and the Profile/Orders tabs are removed from `MyProfile.jsx`.
- Verify no other marketing-site links point at `/my-profile` account tabs; the header avatar links to `/portal/` (or to login if unauthenticated).
- Profile + Orders pages adopt the Cal.com design system (Tailwind component classes), matching the rest of the portal.

**Backend endpoints needed**:
- Self-service profile read/update path on `/api/portal/users` — a `self-or-requireRole` guard so a user can GET/PATCH their own uid without admin/manager.
- Orders/payment-history endpoint scoped to the current user (`req.user.uid`), reusing existing order logic.

**Frontend screens/components**:
- `Portal/src/pages/profile/ProfilePage.tsx` (new)
- `Portal/src/pages/orders/OrdersPage.tsx` (new)
- `Portal/src/api/orders.ts` (new — migrated order-fetch logic)
- `Frontend/src/Pages/MyProfile/MyProfile.jsx` (reduced to redirect)

**Notes**:
- Sequenced **after** the current uncommitted portal consolidation work and the user-name backfill have landed.
- Naming already aligned: the marketing link was renamed "Admin" → "My Portal" on 2026-06-13 as an interim step before this full migration.

---

### E04-S08 — Service Progress / Journey Tracker [Phase 1]

**Priority**: P2 | **Complexity**: M | **Linked spec story**: US-1 | **Dependencies**: E04-S02 | **Raised**: 2026-06-13

**Status**: ✅ IMPLEMENTED (2026-06-13) → **superseded by the Option-3 task-detail redesign (2026-06-14)**

> **♻️ SUPERSEDED (2026-06-14).** The standalone `TaskJourneyTracker.tsx` (horizontal phase rail +
> next-stop hero + ownership strip) is **no longer rendered**. Its three ideas were absorbed into the
> Option-3 task-detail layout (see the E-03 status block "Task detail redesign"): the horizontal rail
> became the **left stage rail** (vertical on desktop, a dropdown on mobile); the ownership strip became
> the **"pending-on" summary** ("N remaining · X Our team · Y Client · Z Registrar"); the next-stop hero
> became the **merged step hero**. The underlying data model below (`phases[]`, `phaseId`,
> `deriveOwnerType`, `phaseProgress`) is unchanged and still powers it. `TaskJourneyTracker.tsx` is now
> dead and can be deleted in cleanup.

**Rationale**: The original Steps tab (E04-S02) was a flat 41-row "Done / Done / Done" list — accurate but low-signal for a client, who mainly wants to know *where am I, what's next, and who's holding things up* (the "live train map" mental model). This story adds a client-facing **journey tracker** above the step list that collapses the 41 steps into ~6 milestone "stations" and surfaces the current step and its owner, without changing the workflow engine or the detailed list (which remains the source of truth for per-step actions).

**Acceptance Criteria**:
- The Steps tab renders a **phase rail** above the step list: one station per workflow phase, in order, with a you-are-here pulse on the active phase, an animated connector on the active segment, green checks for completed phases, and a "Stage X of N · {phase name}" smart-progress label (replacing the bare "N of N").
- A **next-stop hero card** shows the current step's number, title, description, an owner badge ("Waiting on you / our team / registrar"), and an optional "Typically takes N days" line when `typicalDurationDays` is set. Hidden on completion (replaced by the completion banner).
- A **"steps remaining" ownership strip** shows three counts — client / team / registrar — computed from **not-yet-completed** steps (excludes `completed` + `skipped`), so each count decrements as work is done and all read 0 on completion. The strip highlights the current owner.
- Phase status is derived from **real per-step statuses** (`task.steps`), not the cursor alone: a phase is `done` when all its steps are completed/skipped, `now` when it holds the current/in-progress step, else `upcoming`. The **final phase therefore turns green on completion** (a cursor-only heuristic left it stuck on "now").
- Owner is **derived** with no per-step config: payment_gate or `CLIENT_APPROVE` → client; `GOVT_APPROVE` → registrar; otherwise team. An explicit `step.ownerType` overrides the derivation.
- Role-aware copy: clients see "You" for client-owned work; staff see "Client". The tracker degrades gracefully — if a workflow has no `phases`, it renders nothing and the existing list (+ completion banner) shows unchanged.
- Mobile-first: the rail scrolls horizontally; the ownership strip is a 3-column grid.
- Skipped steps in the detailed list use a distinct `CircleSlash` icon (not the plain pending circle).

**Schema / data changes**:
- `WorkflowDefinition` gains `phases[]` (`{ id, name, order }`); `WorkflowStepDef` gains optional `phaseId`, `typicalDurationDays`, `clientActionLabel`, `ownerType`. `validateDefinition` rejects dangling `phaseId`s and malformed phases. Shared helpers added: `deriveOwnerType`, `stepPhaseMap`, `phaseProgress` (in `definitionSchema.js`, mirrored in `Portal/src/api/workflowDefinitions.ts`).
- `convertMachineToDefinition.js` seeds 6 incorporation phases (Payment & Name Approval → Handover) and assigns each step a `phaseId`. **Re-seed required** (`node backend/src/scripts/seedWorkflowDefinitions.js`) — done 2026-06-13.

**Backend endpoints needed**: None new — reuses `GET /api/tasks/:taskId` (returns `steps` with per-step status) and `GET /api/workflow-definitions/:id` (now returns `phases`).

**Frontend screens/components**:
- `Portal/src/pages/tasks/TaskJourneyTracker.tsx` (new)
- `Portal/src/pages/tasks/TaskDetailPage.tsx` (Steps tab wiring + skipped-step icon)
- `Portal/src/api/workflowDefinitions.ts` (types + `deriveOwnerType` / `phaseProgress`)
- `Portal/tailwind.config.js` (`pulse-ring`, `flow-dash` keyframes)
- `shared/workflows/definitionSchema.js`, `shared/workflows/convertMachineToDefinition.js`

**Still TODO**: deriving the ~6 phases for non-incorporation workflows (Phase 2 flows); per-phase ETA / delay ("running late") states; surfacing `clientActionLabel` as a real CTA on the hero card; an activity/event feed alongside the rail.

---

## E-05 — Document Cycle

**Goal**: Implement the full document lifecycle: client uploads → team review → approve/reject with remark → re-upload → expiry management.

> **⏳ STATUS (2026-06-13) — NOT built; deferred.** No task-document system exists yet. The only
> upload code is `backend/src/middleware/upload.middleware.js` (image-only, memory + sharp, for the
> marketing/blog flows) — not reusable for task documents (any file type, Firebase Storage, per-step,
> review status). Firebase Storage is not yet wired for the Portal. The task-detail **Documents tab is
> scaffolded** with a disabled "coming soon" affordance (see E04 update). This epic is the next major
> subsystem when documents are prioritised.

---

### E05-S01 — Document Upload (Signed URL Flow) [Phase 1]

**Priority**: P2 | **Complexity**: L | **Linked spec story**: US-4 | **Dependencies**: E01-S02, E02-S03

> **✅ BUILT (2026-06-14).** Two-step signed-URL upload via Firebase Storage Admin SDK
> ([documents.controller.js](../../backend/src/controllers/documents.controller.js)):
> `POST /api/tasks/:taskId/documents/signed-upload-url` (15-min signed PUT, type pinned into the
> signature, pre-creates an `awaiting_upload` metadata doc) → browser PUTs bytes straight to storage →
> `POST .../:docId/confirm` (verifies the object exists, flips to `pending_review`, stamps
> `uploadedAt`/`expiresAt = +1y`, notifies the reviewer). Metadata in `tasks/{taskId}/documents/{docId}`;
> bytes at `tasks/{taskId}/{docId}/{fileName}`. Type allow-list (PDF/JPG/PNG/DOCX) + 10MB enforced
> client- and server-side. `getBucket()` added to firebase config (env `FIREBASE_STORAGE_BUCKET`,
> defaults to `<projectId>.appspot.com`). Frontend: [documents.ts](../../Portal/src/api/documents.ts) +
> `DocumentsPanel`/uploader, wired into the Task detail Documents tab (replaced the "coming soon" stub).
> - Adaptation: documents are DECOUPLED from the XState machine (own status lifecycle + REST endpoints),
>   not `APPROVE_DOCUMENT`/`REJECT_DOCUMENT` transition events — matches the data-driven model.
> - ⚠️ Storage Security Rules still need to enforce type/size server-side at the bucket (defence in depth);
>   today the signed-URL content-type pin + app checks cover it. Deploy rules before launch.

**Rationale**: Documents are the primary communication channel. The signed URL flow avoids routing large files through the backend.

**Acceptance Criteria**:
- `DocumentUploader.tsx` — shows upload instructions (format, max size, required copy type from `documentRequirementText`); "Upload" button triggers the two-step signed URL flow.
- Step 1: `POST /api/tasks/:taskId/documents/signed-upload-url { stepId, fileName, contentType }` → backend generates a 15-min signed PUT URL via Firebase Storage Admin SDK; returns `{ signedUrl, docId }`.
- Step 2: Browser PUTs the file directly to `signedUrl`; no backend bandwidth used.
- Step 3: `POST /api/tasks/:taskId/documents/:docId/confirm { uploaded: true }` → backend writes `documents/{taskId}/files/{docId}` to Firestore; assigns team member notification.
- File validation: max 10MB, allowed types: PDF, JPG, PNG, DOCX (validated both client-side before upload and in Storage Security Rules).
- `expiresAt` is set to `uploadedAt + 1 year` in the Firestore document.

**Backend endpoints needed**:
- `POST /api/tasks/:taskId/documents/signed-upload-url`
- `POST /api/tasks/:taskId/documents/:docId/confirm`

**Frontend screens/components**:
- `Portal/src/components/documents/DocumentUploader.tsx`

---

### E05-S02 — Document Review (Approve/Reject) [Phase 1]

**Priority**: P2 | **Complexity**: M | **Linked spec story**: US-4 | **Dependencies**: E05-S01, E07-S01

> **✅ BUILT (2026-06-14).** `POST /api/tasks/:taskId/documents/:docId/review { action, remark? }`
> (staff only): approve → `approved` (records `reviewedBy`/`reviewedAt`); reject → `rejected` with a
> **required remark** (shown to the client) + a client notification (E07-S01). `GET .../documents` lists
> a matter's docs. UI: approve/reject (with remark modal) on each pending `DocumentCard`.
> - 🔒 SECURITY (2026-06-14): downloads now **stream through the authenticated backend**
>   (`GET .../:docId/download`) instead of handing the browser a signed READ URL. The old signed URL
>   was signature-gated + 15-min TTL but **replayable by anyone with the link** for its lifetime —
>   unacceptable for legal docs. Now every fetch re-checks the caller's session + ownership (staff, or
>   the owner-client) and pipes the bytes; the browser never sees a `storage.googleapis.com` URL.
>   Upload still uses a short signed PUT (write-only). Bucket stays deny-all. Frontend fetches a blob
>   with the auth header and opens an object URL.
> - ✅ ATTACH WIRED (E03-S06): the Steps-tab "Attach document" buttons (previously a "soon" stub) now
>   open the Documents tab (the real E-05 uploader); no stub remains.
> - Adaptation: review is its own endpoint, not a machine transition (see E05-S01 note). The "Mark
>   Complete disabled until a required doc is approved" gating is NOT wired (steps don't declare required
>   docs in the definition yet) — deferred until document requirements are modelled on steps.

**Rationale**: Team members must review uploaded documents before the step can proceed. Rejection requires a mandatory remark which is shown to the client.

**Acceptance Criteria**:
- Team member sees `DocumentCard.tsx` with "Approve" and "Reject" action buttons on `StepDetailPage`.
- `APPROVE_DOCUMENT` event fires via `POST /api/tasks/:taskId/transition`; document `status → approved`; step can proceed.
- "Reject" opens a modal requiring a non-empty `rejectionRemark`; `REJECT_DOCUMENT { remark }` event fires; document `status → rejected`; client receives in-app notification and email with the remark and a deep-link to the re-upload screen.
- If no document is uploaded for a required step, the "Mark Complete" button is disabled with tooltip "Document upload required."
- Approved documents: `reviewedAt`, `reviewedBy` are recorded.

**Backend endpoints needed**:
- `POST /api/tasks/:taskId/transition` (APPROVE_DOCUMENT, REJECT_DOCUMENT events)
- `GET /api/tasks/:taskId/documents`

**Frontend screens/components**:
- `Portal/src/components/documents/DocumentCard.tsx`
- `Portal/src/pages/workflow/StepDetailPage.tsx` (review actions)

---

### E05-S03 — Document Re-upload After Rejection [Phase 1]

**Priority**: P2 | **Complexity**: S | **Linked spec story**: US-4 | **Dependencies**: E05-S02

> **✅ BUILT (2026-06-14).** A rejected document shows its remark + a **Re-upload** button (reuses the
> uploader). On confirm, `confirmUpload` archives any prior active doc for the same step
> (`status → archived`, `archivedAt` set — NOT deleted) so there's one active doc per step while the
> history is preserved; the new upload starts a fresh `pending_review` cycle and notifies the reviewer.
> Archived versions are shown under a collapsible "Version history" section and remain downloadable.

**Rationale**: Re-upload is a continuation of the document cycle; rejections are common and the flow must be seamless for clients.

**Acceptance Criteria**:
- Rejected document in client's Documents tab shows remark and "Re-upload" button.
- Re-upload reuses `DocumentUploader.tsx`; on confirm, the previous rejected document is archived (status → `archived`, not deleted) and the new upload starts a fresh `pending_review` cycle.
- Team member receives a notification when the re-upload is confirmed.
- The re-upload replaces the active document reference for the step; the archived version is still accessible in the document history.

**Backend endpoints needed**:
- `POST /api/tasks/:taskId/documents/signed-upload-url` (reused)
- `POST /api/tasks/:taskId/documents/:docId/confirm` (reused; backend detects existing doc and archives it)

**Frontend screens/components**:
- `Portal/src/pages/tasks/TaskDetailPage.tsx` (Documents tab — re-upload CTA)
- `Portal/src/components/documents/DocumentUploader.tsx` (reused)

---

### E05-S04 — Document Expiry & Auto-Deletion [Phase 2]

**Priority**: P3 | **Complexity**: M | **Linked spec story**: US-4 | **Dependencies**: E05-S01

**Rationale**: Storage hygiene and compliance. Phase 2 — not required for initial web launch.

**Acceptance Criteria**:
- A Cloud Scheduler job (or Firestore TTL policy) runs daily; documents with `expiresAt < today + 30 days` trigger a client notification "Your document X expires in 30 days — download it."
- Documents with `expiresAt < today` are moved to a "pending deletion" state; actual deletion occurs 7 days after the expiry notification.
- Admin Storage Report shows documents approaching expiry.
- Clients are offered a "paid storage extension" CTA (integration TBD — outside Phase 1 scope).

**Backend endpoints needed**:
- Scheduled Cloud Function or Cloud Scheduler + backend job (endpoint TBD)

**Frontend screens/components**:
- Storage Report (Epic 8)

---

### E05-S05 — Full Matter-Delete Cleanup (Storage + subcollections) [Phase 1]

**Priority**: P1 | **Complexity**: S | **Linked spec story**: US-4 | **Dependencies**: E05-S01

**Rationale**: Firestore does not cascade and Storage objects are independent, so
deleting a matter must explicitly purge EVERYTHING related or it orphans data/files
(a privacy + storage-cost issue). Raised 2026-06-14 (user).

> **✅ BUILT (2026-06-14).** `deleteTask` (admin-only) now removes all subcollections
> (`steps`, `events`, **and `documents`**) AND deletes the matter's Cloud Storage
> objects under the `tasks/{taskId}/` prefix (`getBucket().getFiles({prefix})` →
> delete). Storage cleanup is best-effort (a bucket error is logged, never blocks the
> Firestore delete) and the response reports `{stepsDeleted, eventsDeleted,
> documentsDeleted, filesDeleted}`. The orphan-sweep in `seed-e2e.js` covers crash leftovers.
>
> **Update (2026-06-20):** also sweeps the matter's **notifications**. These live in the TOP-LEVEL
> `notifications` collection (referenced by `taskId`), not a subcollection, so the subcollection loop
> missed them — leaving dangling bell entries that deep-linked to a now-404 matter. `deleteTask` now
> queries `notifications.where('taskId','==',taskId)` and deletes them; response adds `notificationsDeleted`.
> Test: `matter-lifecycle.spec.ts` asserts a matter-linked notification exists pre-delete and is gone after.

**Acceptance Criteria**:
- Deleting a matter removes its steps, events, document metadata, and uploaded files.
- Storage failures are logged and do not block the matter delete; deletion is idempotent.

---

### E11-S09 — Archive Matter (non-destructive alternative to delete) [Phase 1]

**Priority**: P1 | **Complexity**: S | **Linked spec story**: US-8 | **Dependencies**: E11-S01

**Rationale**: Only an admin can DELETE a matter (destructive). Managers/team members
need a way to get a finished/abandoned matter OUT of active worklists without losing
history — i.e. archive it. Raised 2026-06-14 (user).

> **✅ BUILT (2026-06-14).** `POST /api/tasks/:taskId/archive` (admin/manager/team_member)
> sets status `archived` (new terminal state), closes the active step, records a
> `TASK_ARCHIVED` event; data + documents are preserved (only admin `deleteTask` purges).
> UI: an **Archive** button beside **Stop workflow** on the matter detail (confirm dialog);
> an archived banner; `archived` excluded from active worklists (`my-steps` already filters
> to pending/active). Status added to TaskStatus + the list query enum + grid badge/label.

**Acceptance Criteria**:
- Staff can archive an active/pending matter; it leaves My Tasks/active lists, history kept.
- Archived matters are not deletable except by an admin; re-archiving is a no-op (409).

---

## E-06 — Payments

**Goal**: Record all payments with the five required modes, enforce payment gates in the workflow, display blinking payment-due indicators, and allow admin-only overrides with full audit trail.

---

### E06-S01 — Record Payment Form [Phase 1]

**Priority**: P2 | **Complexity**: M | **Linked spec story**: US-15 | **Dependencies**: E02-S03

**Rationale**: Payment recording is admin/manager-only; it updates task `amountPaid`, recalculates `amountDue`, and fires `PAYMENT_CONFIRMED` to unblock payment gates.

**Acceptance Criteria**:
- `RecordPaymentForm.tsx` — available on `TaskDetailPage` Payments tab for `admin` and `manager` roles.
- Required fields: amount (number), date, mode (select: `bank_transfer | cash | upi | cheque | credit_card`).
- Optional fields: reference number (UTR/cheque/UPI ID), proof image upload (reuses DocumentUploader signed URL flow to `payments/{taskId}/{paymentId}/`).
- On submit, calls `POST /api/payments { taskId, amount, mode, date, referenceNumber?, proofStoragePath? }`.
- Backend atomically: writes `payments/{paymentId}`, updates `tasks/{taskId}` (`amountPaid`, `amountDue`, `paymentStatus` recomputed), fires `PAYMENT_CONFIRMED` XState event if the new `amountPaid` meets or exceeds the payment gate threshold.
- `paymentStatus` recomputation: `not_paid` → `part_paid` when any amount is recorded; `fully_paid` when `amountPaid >= amountTotal`.

**Backend endpoints needed**:
- `POST /api/payments`

**Frontend screens/components**:
- `Portal/src/components/payments/RecordPaymentForm.tsx`
- `Portal/src/pages/tasks/TaskDetailPage.tsx` (Payments tab — admin/manager controls)

---

### E06-S02 — Payment Gate Enforcement & Admin Override [Phase 1]

**Priority**: P2 | **Complexity**: M | **Linked spec story**: US-5 | **Dependencies**: E06-S01, E02-S02

**Rationale**: Payment-gated steps are enforced by the XState machine (guard). This story covers the UI feedback and the admin override flow.

**Acceptance Criteria**:
- Steps with `paymentGated = true` and `paymentStatus !== 'fully_paid'` — "Mark Complete" button is disabled; a red banner reads "Full payment required to proceed."
- `PaymentBadge.tsx` on the task card and detail blinks red when a payment gate is the current blocker (CSS `animate-pulse`).
- Admin sees an "Override Payment Gate" button on the blocked step; clicking opens a confirmation dialog requiring a written reason.
- `ADMIN_OVERRIDE_PAYMENT { reason, adminUid }` event fires via `POST /api/tasks/:taskId/transition`; backend enforces `req.user.role === 'admin'` before accepting the event.
- Override is recorded in `auditLog/{entryId}` with `adminUid`, `timestamp`, `reason`; the step is marked `paymentOverride = true`.
- Blinking indicator persists after override (outstanding balance reminder) until `amountDue === 0`.
- Steps 22–26 (`allowedWithoutPayment = true`) bypass the payment gate guard and are not blocked.

**Backend endpoints needed**:
- `POST /api/tasks/:taskId/transition` (ADMIN_OVERRIDE_PAYMENT event — role check enforced here)

**Frontend screens/components**:
- `Portal/src/components/tasks/PaymentBadge.tsx`
- `Portal/src/pages/workflow/StepDetailPage.tsx` (blocked state UI, admin override button)

---

### E06-S03 — Payment History View [Phase 1]

**Priority**: P2 | **Complexity**: S | **Linked spec story**: US-15 | **Dependencies**: E06-S01

**Rationale**: Admin, manager, team member, and client can all view payment history for a task; team member and client views are read-only.

**Acceptance Criteria**:
- `PaymentHistory.tsx` — chronological list of payments: date, mode, amount, recorded-by display name, optional reference, proof link.
- Accessible to all roles who can view the task; no add/edit controls for `team_member` or `client`.
- Admin override entries appear with an "Override" badge.
- `GET /api/payments?taskId=:taskId` returns payments sorted by `date DESC`.

**Backend endpoints needed**:
- `GET /api/payments?taskId=:taskId`

**Frontend screens/components**:
- `Portal/src/components/payments/PaymentHistory.tsx`

---

### E06-S04 — Payment Reminder Automation [Phase 2]

**Priority**: P2 | **Complexity**: M | **Linked spec story**: US-5, US-9 | **Dependencies**: E07-S02

**Rationale**: Automated payment reminders reduce manual follow-up. Phase 2 (after email system is stable).

**Acceptance Criteria**:
- Admin can configure reminder frequency per workflow (daily / alternate days / custom interval) in Workflow Settings.
- A scheduled job evaluates tasks with `paymentStatus !== 'fully_paid'` and sends reminder emails to `emailIds[]` at the configured interval.
- Reminders stop automatically when `paymentStatus === 'fully_paid'`.
- Email delivery failures are reported to admin per E07-S03.

**Backend endpoints needed**:
- Scheduled Cloud Function / Cloud Scheduler (implementation TBD)
- `PATCH /api/workflows/:workflowId/steps/:stepNumber` (reminder config field)

**Frontend screens/components**:
- `Portal/src/pages/workflow/WorkflowSettingsPage.tsx` (reminder interval field)

---

## E-07 — Notifications & Email

**Goal**: Deliver real-time in-app notifications and automated transactional emails on every meaningful workflow event; give admin tools to manage templates and broadcast messages.

---

### E07-S01 — In-App Notification System [Phase 1]

**Priority**: P2 | **Complexity**: M | **Linked spec story**: US-9 | **Dependencies**: E01-S04

> **✅ BUILT (2026-06-14).** The notification store + UI already existed (controller
> `notifications.controller.js` with `createNotification` helper, routes, `useNotifications` hook + bell).
> This round WIRED `createNotification` into the workflow events so notifications actually fire:
> matter created → admins (needs approval) / first step assignee; approve/reject → creator; matter
> assigned → new owner; step reassigned → new assignee; **transition** → whoever the ball moves to
> (client when it's their turn, else the next step's assignee; client-responded → matter owner;
> completion → client + owner); document review → client; document uploaded → reviewer (E-05). All
> fire-and-forget (a notification failure never breaks the action), self-notifications skipped.
> - Adaptation: delivery is the existing **30s poll** (kept per decision), not a Firestore `onSnapshot`
>   real-time listener; notifications live in a flat `notifications` collection (`recipientUid` field),
>   not `notifications/{uid}/items`. Deep-link is carried as `taskId` (the bell links to the matter).
> - ✅ ADDED (2026-06-14): the full **`/notifications` page** (`NotificationsPage.tsx`) — the complete
>   list behind the bell, with per-type icons, mark-all-read, and click-to-deep-link to the matter
>   (`taskId`). The bell dropdown gained a **"View all notifications"** link. Registered for ALL roles.
> - ⏳ Still Phase-2 / deferred: `onSnapshot` real-time upgrade; transactional **email** (E07-S02).

**Rationale**: In-app notifications replace WhatsApp pings. The Firestore real-time listener on `notifications/{uid}/items` makes them instantaneous.

**Acceptance Criteria**:
- `useNotifications.ts` — Firestore `onSnapshot` listener on `notifications/{uid}/items` ordered by `createdAt DESC`; exposes `{ notifications, unreadCount }`.
- `NotificationBell.tsx` shows `unreadCount` badge; clicking navigates to `NotificationsPage.tsx`.
- `NotificationsPage.tsx` — lists all notifications; unread items are highlighted; clicking a notification marks it read (`PATCH /api/notifications/:notifId/read`) and follows `deepLink` to the relevant screen.
- Backend writes a notification document to `notifications/{uid}/items/{notifId}` for each workflow event (step completed, document rejected, task created, approval requested).
- `deepLink` is a Portal-relative URL (e.g. `/tasks/task_abc123/steps/step_6`).
- Notifications are delivered to all roles: client, team_member, manager, admin as appropriate to the event.

**Backend endpoints needed**:
- `GET /api/notifications` (paginated list)
- `PATCH /api/notifications/:notifId/read`
- Internal notification writer (utility function called from transition handler, not a public endpoint)

**Frontend screens/components**:
- `Portal/src/pages/notifications/NotificationsPage.tsx`
- `Portal/src/hooks/useNotifications.ts`
- `Portal/src/components/layout/NotificationBell.tsx` (E01-S04 — extended here)

---

### E07-S02 — Email Automation (Transactional) [Phase 1]

**Priority**: P2 | **Complexity**: L | **Linked spec story**: US-9 | **Dependencies**: E07-S01

> **✅ BUILT (2026-06-27).** Implemented with **Gmail SMTP** (not SendGrid):
> `backend/src/services/emailService.js` (Nodemailer + App Password) wired into
> `createNotification`, so **every in-app notification also emails** the recipient
> (branded HTML + plain text + deep link). Env-driven (`GMAIL_USER`,
> `GMAIL_APP_PASSWORD`, `EMAIL_FROM`, `FRONTEND_URL`); safe no-op when unconfigured.
> Also delivers account password-setup links + the #60 resubmission email. See the
> 2026-06-27 change log (Appendix B) for details. The original SendGrid/
> `email.js`/`emailTemplateRef` design below is superseded by this simpler central
> mirror; per-step email templates remain a future enhancement.

**Rationale**: Every workflow event that creates an in-app notification also sends an email with a deep-link. This is a hard requirement in the spec.

**Acceptance Criteria**:
- `triggerNotificationsForTransition()` (backend utility) — called after each transition; looks up the `emailTemplateRef` for the triggered step; renders the template with event context; queues delivery via SendGrid/SMTP.
- Emails are sent to all addresses in the target user's `emailIds[]` (or the single `email` field if `emailIds` is empty).
- Each email includes a deep-link back to the relevant Portal screen (e.g. `https://portal.legalterminus.com/tasks/:taskId`).
- At minimum, emails are triggered for: step completed (client notification), document rejected (client with remark + deep-link to re-upload), task created (client welcome), payment reminder (configurable frequency), approval requested (manager/admin).
- Default email templates exist for all trigger types; admin can override via E07-S04.

**Backend endpoints needed**:
- `POST /api/notifications/send-email` (internal — called by `emailTriggerActor` from XState)
- SMTP/SendGrid integration in `backend/src/utils/email.js` (new or extend existing)

**Frontend screens/components**: None (backend only).

---

### E07-S03 — Email Delivery Failure Alerts [Phase 2]

**Priority**: P2 | **Complexity**: S | **Linked spec story**: US-9 | **Dependencies**: E07-S02

**Rationale**: Admin must know when email delivery fails to manually follow up with clients.

**Acceptance Criteria**:
- SendGrid/SMTP webhook or polling detects delivery failures (bounce, invalid address, full mailbox).
- On failure, backend writes an in-app notification to all admin and manager UIDs: "Email delivery failed for [clientEmail] — [reason]."
- Admin `NotificationsPage` shows delivery failure alerts distinctly (different icon/colour from workflow notifications).

**Backend endpoints needed**:
- `POST /api/notifications/email-webhook` (SendGrid webhook receiver)

**Frontend screens/components**: None (uses existing `NotificationsPage`).

---

### E07-S04 — Email Template Management [Phase 2]

**Priority**: P2 | **Complexity**: M | **Linked spec story**: US-9 | **Dependencies**: E07-S02

**Rationale**: Admin must be able to customise email content and branding without a code deployment.

**Acceptance Criteria**:
- `POST /api/notifications/email-templates { templateId, subject, bodyHtml, variables[] }` — admin creates/updates a template stored in Firestore `emailTemplates/{templateId}`.
- `GET /api/notifications/email-templates` — admin lists all templates.
- Templates use `{{variable}}` placeholders for `clientName`, `stepName`, `deepLink`, etc.
- `WorkflowSettingsPage` (Epic 10) links each step's `emailTemplateRef` to a template ID.

**Backend endpoints needed**:
- `POST /api/notifications/email-templates`
- `GET /api/notifications/email-templates`

**Frontend screens/components**:
- Email template editor (can be part of `WorkflowSettingsPage` or a standalone admin screen)

---

### E07-S05 — Admin Broadcast Notifications [Phase 2]

**Priority**: P3 | **Complexity**: M | **Linked spec story**: US-16 | **Dependencies**: E07-S02

**Rationale**: Marketing and operational announcements. P3, Phase 2.

**Acceptance Criteria**:
- Admin creates a broadcast: title, body, target (all clients / by state / by service type), optional email toggle.
- `POST /api/notifications/broadcast { title, body, target, sendEmail? }` — backend writes notification to each target client's `notifications/{uid}/items`; optionally queues emails.
- Clients see the broadcast as an in-app banner/modal with dismiss; `deepLink` is empty for broadcasts.
- Email delivery failures are reported per E07-S03.

**Backend endpoints needed**:
- `POST /api/notifications/broadcast`

**Frontend screens/components**:
- Admin broadcast creation form (new page or modal in admin dashboard)

---

## E-08 — Reports & Master Sheet

**Goal**: Provide admin and manager with all 13 enumerated report types covering task status, payment collection, workload, delays, clients, storage, and a CSV-exportable master sheet.

---

### E08-S01 — Report Shell + All Tasks, Completed, Pending [Phase 1]

**Priority**: P2 | **Complexity**: L | **Linked spec story**: US-7 | **Dependencies**: E02-S03, E03-S03

> **✅ DONE (verified 2026-06-14).** Built in a prior session; confirmed complete this session.
> Shell grid ([ReportsPage.tsx](../../Portal/src/pages/reports/ReportsPage.tsx)) + the three task
> reports ([AllTasksReport.tsx](../../Portal/src/pages/reports/AllTasksReport.tsx),
> [CompletedTasksReport.tsx](../../Portal/src/pages/reports/CompletedTasksReport.tsx),
> [PendingTasksReport.tsx](../../Portal/src/pages/reports/PendingTasksReport.tsx) grouped by reason:
> payment / document / client_action / government) + Master Sheet. Backend
> `GET /api/reports/{all-tasks,completed,pending,master-sheet}` return real data
> ([reports.controller.js](../../backend/src/controllers/reports.controller.js)); routes admin/manager.
> Routes registered in appRoutes; date-range filters present.
> ✅ 2026-06-14: the Pending report now includes `pending_admin_approval` matters as a distinct
> **"Awaiting Approval"** bucket (alongside payment/document/client_action/government).

**Rationale**: The three core task reports are needed immediately after tasks exist. The report shell (selector page) provides the navigation scaffold for the remaining 10 reports.

**Acceptance Criteria**:
- `ReportsPage.tsx` — grid of all report type cards; clicking a card navigates to the specific report; accessible to `admin` and `manager`.
- `AllTasksReport.tsx` — `GET /api/reports/all-tasks?status=&serviceType=&teamMember=&paymentStatus=&startDate=&endDate=` — filterable, sortable table of all tasks.
- `CompletedTasksReport.tsx` — `GET /api/reports/completed` — shows completion date, service type, team member, payment status.
- `PendingTasksReport.tsx` — `GET /api/reports/pending` — sub-categorised by reason: payment pending / document pending / client action pending / government pending.
- Each report has a date range filter; results render in a Tailwind table; loading state uses `LoadingSpinner`.

**Backend endpoints needed**:
- `GET /api/reports/all-tasks`
- `GET /api/reports/completed`
- `GET /api/reports/pending`

**Frontend screens/components**:
- `Portal/src/pages/reports/ReportsPage.tsx`
- `Portal/src/pages/reports/AllTasksReport.tsx`
- `Portal/src/pages/reports/CompletedTasksReport.tsx`
- `Portal/src/pages/reports/PendingTasksReport.tsx`

---

### E08-S02 — Workload, Delay & Escalation Reports [Phase 2]

**Priority**: P2 | **Complexity**: L | **Linked spec story**: US-7 | **Dependencies**: E08-S01

**Rationale**: Operational management reports needed after the core workflow is running.

**Acceptance Criteria**:
- `WorkloadReport.tsx` — `GET /api/reports/workload` — per team member: count of pending, completed, delayed tasks; drill-down to task list; "Reassign" action on task row calls `POST /api/portal/users/:uid/bulk-reassign`.
- `DelayReport.tsx` — `GET /api/reports/delays` — categorised: Due to LT / Due to Client / Due to Govt; each bucket segmented by age: 0–2 / 3–5 / >5 days.
- `EscalationReport.tsx` — `GET /api/reports/escalations` — steps past `deadline` grouped by team member; shows escalation age and audit trail link.

**Backend endpoints needed**:
- `GET /api/reports/workload`
- `GET /api/reports/delays`
- `GET /api/reports/escalations`

**Frontend screens/components**:
- `Portal/src/pages/reports/WorkloadReport.tsx`
- `Portal/src/pages/reports/DelayReport.tsx`
- `Portal/src/pages/reports/EscalationReport.tsx`

---

### E08-S03 — Payment Collection Report [Phase 2]

**Priority**: P2 | **Complexity**: M | **Linked spec story**: US-7 | **Dependencies**: E06-S01

**Rationale**: Finance visibility — breakdown by payment mode, monthly trend, outstanding dues.

**Acceptance Criteria**:
- `PaymentReport.tsx` — `GET /api/reports/payments` — total collected, breakdown by mode (Bank Transfer / Cash / UPI / Cheque / Credit Card), monthly bar/line chart, outstanding dues list, advance payments.
- Date range filter applies to both chart and list.

**Backend endpoints needed**:
- `GET /api/reports/payments`

**Frontend screens/components**:
- `Portal/src/pages/reports/PaymentReport.tsx`

---

### E08-S04 — Service, Client, Login Mapping & Storage Reports [Phase 2]

**Priority**: P2 | **Complexity**: L | **Linked spec story**: US-7, US-14 | **Dependencies**: E09-S02

**Rationale**: Client management and storage visibility reports.

**Acceptance Criteria**:
- `ServiceReport.tsx` — `GET /api/reports/services` — tasks grouped by service type; count, revenue, average completion time.
- `ClientListReport.tsx` — `GET /api/reports/clients` — all clients: name, ref/group, email IDs, active task count, mobile, last activity.
- `LoginMappingReport.tsx` — `GET /api/reports/login-mapping` — email → client profile mapping; orphan emails (Firebase Auth but not in any `emailIds[]`) flagged.
- `StorageReport.tsx` — `GET /api/reports/storage` — per-client storage usage, total system usage, alert if within 20% of provisioned limit.

**Backend endpoints needed**:
- `GET /api/reports/services`
- `GET /api/reports/clients`
- `GET /api/reports/login-mapping`
- `GET /api/reports/storage`

**Frontend screens/components**:
- `Portal/src/pages/reports/ServiceReport.tsx`
- `Portal/src/pages/reports/ClientListReport.tsx`
- `Portal/src/pages/reports/LoginMappingReport.tsx`
- `Portal/src/pages/reports/StorageReport.tsx`

---

### E08-S05 — Master Sheet & CSV Export [Phase 2]

**Priority**: P2 | **Complexity**: M | **Linked spec story**: US-7 | **Dependencies**: E08-S01

**Rationale**: The master sheet is the most-used summary view for daily management.

**Acceptance Criteria**:
- `MasterSheetReport.tsx` — `GET /api/reports/master-sheet` — table of all tasks: client name, service, current step, assigned team member, payment status, amount paid, amount due, last updated.
- "Export CSV" button calls `GET /api/reports/master-sheet?format=csv`; backend returns `Content-Type: text/csv` with `Content-Disposition: attachment`.
- Table supports column sort and text search filter (client-side for performance).

**Backend endpoints needed**:
- `GET /api/reports/master-sheet`
- `GET /api/reports/master-sheet?format=csv`

**Frontend screens/components**:
- `Portal/src/pages/reports/MasterSheetReport.tsx`

---

### E08-S06 — Contact Leads Report [Phase 1]

**Priority**: P2 | **Complexity**: S | **Linked spec story**: US-7 | **Dependencies**: E09-S02

**Status**: ✅ IMPLEMENTED (2026-06-13)

**Rationale**: The public marketing site (`Frontend/`) captures enquiries into the `contactLeads` Firestore collection. Admins, managers, and team members need to review and follow up on these leads from the portal, and immediately see whether a lead is already a registered client (to avoid duplicate onboarding and to route follow-up correctly).

**Access requirement**: `ContactLeadsReport` is accessible to **`admin`, `manager`, and `team_member`** (the internal staff roles). Clients have no access.

**Acceptance Criteria**:
- `ContactLeadsReport.tsx` — accessible to `admin`, `manager`, and `team_member`.
- `GET /api/leads` — returns all `contactLeads` docs, each enriched with a `registered` boolean indicating whether the lead's email matches a `users` doc (by primary `email` OR any entry in `emailIds[]`), plus `registeredUid` and `registeredRole`.
- Each lead row shows: name, company, email, phone, state, message, service/source, preferred call time, status (`new`/`contacted`/`closed`), received date, and a **Client / New lead** tag from the `registered` flag.
- Filters: status tabs (All/New/Contacted/Closed with counts), registered-vs-new-lead tabs, and free-text search across name/email/phone/company/service.
- Mobile-first: desktop table + mobile card layout; tappable `mailto:`/`tel:` links.
- Reachable via a "Contact Leads" card on `ReportsPage` (admin + manager), a dashboard tile (all three roles), and direct link. No standalone sidebar entry.

**Implementation Notes** (2026-06-13):
- ✅ Backend controller: `backend/src/controllers/leads.controller.js` (`getContactLeadsReport`) — fetches `contactLeads` + `users` in parallel, builds an email→user map (incl. `emailIds[]`), flags each lead.
- ✅ Backend route: `backend/src/routes/leads.routes.js` mounted at `/api/leads` with `verifyToken, requireRole('admin', 'manager', 'team_member')`. Mounted in `server.js`.
- ✅ Frontend page: `Portal/src/pages/reports/ContactLeadsReport.tsx`.
- ✅ API helper + types: `getContactLeadsReport()` and `ContactLead` interface in `Portal/src/api/reports.ts`.
- ✅ Registered as a single `AppRoute` at canonical role-neutral path `/reports/leads` with `roles: ['admin', 'manager', 'team_member']` in `Portal/src/routes/appRoutes.tsx`.
- ⚠️ Reuses existing `contactLeads` data + existing `POST/GET/PATCH/DELETE /api/contact` endpoints; this story only adds the read-with-enrichment report endpoint.
- ✅ DONE (2026-06-14): **inline status update** from the report — a status `<select>` on each row (and
  the drawer) PATCHes the lead without opening the drawer. **Convert lead → client**: `POST /api/leads/:id/convert`
  (admin/manager) creates or links a `client` user from the lead via the shared `upsertUser` path, stamps
  the lead `convertedAt/convertedBy/convertedUid`; the `registered` tag then resolves live from the users
  collection. Surfaced as a "Convert to client" action on each unregistered-lead row, mobile card, and in
  the drawer; refreshes both the leads list and the Users grid. Client/admin role-gated via `canConvert`.

**Backend endpoints needed**:
- ✅ `GET /api/leads` — enriched contact-leads list (admin, manager, team_member)

**Frontend screens/components**:
- ✅ `Portal/src/pages/reports/ContactLeadsReport.tsx`

---

### ⚠️ ARCHITECTURE DECISION (2026-06-13) — Declarative role-based routing

**Decision**: Route access control is data-driven from a **single source of truth**: `Portal/src/routes/appRoutes.tsx` (`APP_ROUTES`). Each route declares `{ path, element, roles, nav? }`. The router guards (`routes/index.tsx`) and navigation (`components/layout/navConfig.ts`) both **derive** from this table.

**Rules**:
- To grant a role access to a page → add the role to that route's `roles` array (one line).
- Shared multi-role pages use a **role-neutral canonical path** (e.g. `/reports/leads`) and list every allowed role. **Do NOT** create per-role duplicate routes (`/admin/reports/leads` + `/team/leads`).
- Role-prefixed paths (`/admin/*`) are URL-clarity only; the `roles` array is the access mechanism.

Full pattern documented in `architecture.md` §2.2 and `.github/copilot-instructions.md`.

---

## E-09 — User & Client Management

**Goal**: Enable admin to create and manage team members and clients; enable manager to create/edit clients; enforce multi-email client login resolution; support bulk step reassignment.

---

### E09-S01 — Create & Edit Team Members [Phase 1]

**Priority**: P2 | **Complexity**: M | **Linked spec story**: US-8 | **Dependencies**: E01-S02

**Status**: ✅ IMPLEMENTED with Hybrid Auth UPSERT (2026-06-01) | ✅ CONSOLIDATED into unified Users page (2026-06-13)

**Rationale**: Team members must exist before tasks can be assigned to them. Admin creates them; Firebase Auth accounts are created server-side. **Updated: Now supports UPSERT pattern to handle existing users and hybrid auth scenarios.**

**Acceptance Criteria**:
- `UserListPage.tsx` (role=team_member mode) — required fields: full name, mobile, email, designation, date of joining, role; optional: father's name, date of birth, address.
- On submit, calls `POST /api/team-members { ...fields, role: "team_member" }`; backend implements UPSERT pattern:
  - **If user exists** (by Firebase Auth email or Firestore email lookup) → UPDATE role, preserve auth providers, sync profile
  - **If user is new** → CREATE Firebase Auth account, sends password-reset email, writes user profile
  - Returns `{ isUpdate: boolean }` flag for frontend feedback
- `TeamMembersPage.tsx` — lists all team members (`GET /api/team-members`); shows name, email, phone, designation, role (color-coded badge), joining date; clickable rows or edit button.
- `TeamMemberForm.tsx` — modal form for creating/editing; email field disabled on edit (cannot change); role selector; all required and optional fields supported.
- Manager cannot delete users — delete button only available to admin role; delete via `DELETE /api/team-members/{uid}`.
- **NEW: Supports Scenario 3 merge** — If admin creates joe@gmail.com as manager and Joe later signs in via Google, the system:
  1. Looks up joe@gmail.com in Firestore (finds admin-created record)
  2. UPDATEs the record with authProviders=['email','google'], signInMethod='both'
  3. PRESERVEs role='manager' from admin assignment
  4. SYNCs profile data from Google provider
  5. Preserves admin-created status and metadata

**Implementation Notes** (Updated 2026-06-13):
- ✅ Frontend UI: `Portal/src/pages/admin/UsersPage.tsx` (unified list with role filter tabs — All/Clients/Team Members/Managers/Admins)
- ✅ Frontend UI: `Portal/src/pages/admin/UserFormPage.tsx` (unified form page; reads `:type` param to render TeamMemberForm or ClientForm)
- ✅ Frontend UI: `Portal/src/components/admin/TeamMemberForm.tsx` (reusable form component)
- ✅ Routes registered: `/admin/users`, `/admin/users/new/:type`, `/admin/users/edit/:type/:uid` in `Portal/src/routes/index.tsx`
- ✅ Navigation: Single "Users" sidebar entry; navigate to `/admin/users/new/member` or `/admin/users/edit/member/:uid`
- ⚠️ DESIGN DECISION (2026-06-13): Clients, Team Members, and Users are all roles — they live on ONE page with filter tabs. Do NOT create separate pages per role.
- ✅ Mobile-friendly: Full-screen forms work better on mobile than modals; responsive padding and sizing applied
- ✅ Backend: `backend/src/controllers/team-members.controller.js` implements UPSERT pattern with email lookup
- ✅ Backend: `backend/src/routes/team-members.routes.js` (routes mounted at `/api/team-members`)
- ✅ Backend mounted: `backend/src/server.js` imports and mounts team-members routes
- ✅ Firebase Auth integration: `createTeamMember` creates Auth account OR updates existing user
- ✅ Firestore integration: `/users/{uid}` document created/updated with role='team_member'
- ✅ Hybrid auth support: Searches Firestore by email FIRST, then Firebase Auth, for existing user detection
- ✅ authProviders tracking: Stores array of auth methods (['email'], ['google'], or ['email','google'])
- ✅ signInMethod field: Tracks 'email', 'google', or 'both'
- ✅ Custom claims set automatically: `admin.auth().setCustomUserClaims(uid, { role })`
- ✅ BUG FIX (2026-06-13): `getTeamMembers` query changed from `type == 'team_member'` to `type in ['team_member', 'manager', 'admin']` — previously managers and admins created via the team member form were invisible in the list
- ✅ BUG FIX (2026-06-13): `updateTeamMember` changed from `.update()` to `.set(clean({...}), { merge: true })` — prevents Firestore failure when optional fields are undefined or document doesn't exist yet
- ⏳ TODO: Email sending via SendGrid (password reset link)
- ⏳ TODO: Role-based permission enforcement (manager cannot delete)
- ⏳ TODO: Admin-only endpoint guards (verify req.user.role === 'admin')

**Backend endpoints needed**:
- ✅ `POST /api/team-members` — Create with Firebase Auth account
- ✅ `GET /api/team-members` — List all
- ✅ `GET /api/team-members/:uid` — Get single
- ✅ `PATCH /api/team-members/:uid` — Update (cannot change email)
- ✅ `DELETE /api/team-members/:uid` — Delete (admin only)

**Frontend screens/components**:
- ✅ `Portal/src/pages/admin/TeamMembersPage.tsx`
- ✅ `Portal/src/components/admin/TeamMemberForm.tsx`

> **⚠️ SESSION UPDATE (2026-06-13) — supersedes the stale notes above.** The
> separate `/api/team-members` + `/api/clients` endpoints and the role-prefixed
> `/admin/*` paths described above **no longer exist**. See the consolidated
> current state in the shared note under E09-S02.

---

### E09-S02 — Create & Edit Clients [Phase 1]

**Priority**: P1 | **Complexity**: M | **Linked spec story**: US-8, US-14 | **Dependencies**: E01-S02

**Status**: ✅ IMPLEMENTED (2026-05-31)

**Rationale**: Clients must exist before tasks can be created for them. Admin and manager can create clients.

**Acceptance Criteria**:
- `ClientsPage.tsx` — lists all clients (`GET /api/clients`); searchable by name/email; shows name, email, phone, organisation, email IDs (primary + secondary list), created date.
- `ClientForm.tsx` — displays full profile; edit button opens form; shows no task count yet (Phase 2 integration).
- Create client form — required: full name, mobile, primary email, address; optional: organisation name, GST, PAN, Aadhaar, additional email IDs, state, business name.
- `POST /api/clients { ...fields, role: "client" }` creates Firebase Auth account and Firestore profile; `emailIds[]` is initialised with `[primaryEmail]` plus any secondary emails provided.
- Admin or manager can add/remove secondary emails from `ClientForm` — `PATCH /api/clients/:clientId { emailIds: [...] }`.
- Manager cannot delete clients — `DELETE` is admin-only.
- Multi-email display: Shows primary email and list of secondary email IDs with remove (✕) button.
- Email validation: Prevents adding primary email as secondary; prevents duplicate emails in `emailIds[]`.

**Implementation Notes** (Updated 2026-06-13):
- ✅ Frontend UI: `Portal/src/pages/admin/UsersPage.tsx` (unified list; filter to "Clients" tab to see clients only)
- ✅ Frontend UI: `Portal/src/pages/admin/UserFormPage.tsx` (unified form page; `:type=client` renders ClientForm)
- ✅ Frontend UI: `Portal/src/components/admin/ClientForm.tsx` (reusable form component with full-page and modal modes; multi-email support)
- ✅ Routes registered: `/admin/users/new/client`, `/admin/users/edit/client/:uid` in `Portal/src/routes/index.tsx`
- ✅ Navigation: "Add Client" button on UsersPage navigates to `/admin/users/new/client`
- ⚠️ DESIGN DECISION (2026-06-13): No standalone /admin/clients route. All user management at /admin/users.
- ✅ Mobile-friendly: Full-screen forms work better on mobile than modals; responsive padding and sizing applied
- ✅ Backend: Refactored `backend/src/controllers/client.controller.firestore.js` to integrate Firebase Auth + Firestore
- ✅ Backend routes: `backend/src/routes/client.routes.js` already existed; POST/GET/PATCH/DELETE mapped
- ✅ Backend mounted: Routes already mounted at `/api/clients` in `backend/src/server.js`
- ✅ Firebase Auth integration: `createClient` creates Auth account with temporary password
- ✅ Firestore integration: `/clients/{uid}` document with emailIds array, `/users/{uid}` document with role='client'
- ✅ Multi-email support: emailIds array stored and managed; primary email locked on edit
- ✅ BUG FIX (2026-06-13): `createClient` and `updateClient` changed from `.update()` to `.set(clean({...}), { merge: true })` — prevents Firestore NOT_FOUND failure when client doc doesn't exist yet, and Firestore undefined value rejection for optional fields
- ✅ BUG FIX (2026-06-13): `toggleClientStatus` changed from `.update()` to `.set({...}, { merge: true })` — same NOT_FOUND protection
- ⏳ TODO: Email sending via SendGrid (password reset link)
- ⏳ TODO: Role-based permission enforcement (manager cannot delete)
- ⏳ TODO: Admin-only endpoint guards (verify req.user.role === 'admin')
- ⏳ TODO: Task count display in list (requires JOIN with tasks collection)

**Backend endpoints needed**:
- ✅ `POST /api/clients` — Create with Firebase Auth account and multi-email support
- ✅ `GET /api/clients` — List all
- ✅ `GET /api/clients/:clientId` — Get single (field: uid or clientId)
- ✅ `PATCH /api/clients/:clientId` — Update with emailIds array support
- ✅ `DELETE /api/clients/:clientId` — Delete (admin only)

**Frontend screens/components**:
- ✅ `Portal/src/pages/admin/ClientsPage.tsx`
- ✅ `Portal/src/components/admin/ClientForm.tsx`

> **⚠️ SESSION UPDATE (2026-06-13) — current state of user management (E09-S01 + E09-S02).**
> Supersedes the stale `/api/team-members`, `/api/clients`, `/clients/{uid}`,
> and `/admin/*` references in both stories above.
>
> **Unified, role-neutral API + UI:**
> - Single endpoint `/api/portal/users` ([portalUsers.controller.js](../../backend/src/controllers/portalUsers.controller.js), [portalUsers.routes.js](../../backend/src/routes/portalUsers.routes.js)) for ALL roles. `GET /` (list, paginated), `GET /counts`, `GET /:uid`, `POST /`, `PATCH /:uid`, `DELETE /:uid`. Backed by the single `users` collection (the `clients` collection is gone). GET/POST/PATCH require `admin|manager`; DELETE is `admin` only.
> - Single page [Portal/src/pages/users/UsersPage.tsx](../../Portal/src/pages/users/UsersPage.tsx) at role-neutral `/users` (not `/admin/users`). Forms at `/users/new/:type` and `/users/edit/:type/:uid`. Components under `Portal/src/components/users/`.
> - Role logic is centralized in the role services ([Portal/src/lib/roles.ts](../../Portal/src/lib/roles.ts), [backend/src/config/roles.js](../../backend/src/config/roles.js)); privilege-escalation guards via `canAssignRole` (manager cannot mint admin/manager).
>
> **Data grid (2026-06-13):** UsersPage now uses **TanStack Table + TanStack Virtual** (replaced the hand-rolled virtualized table). Sortable columns, global search (name/email/role/phone/designation/org), role-tab filtering, virtualized scroll (~70vh, no pagination), Cal.com styling. Column order: User → Role → Contact → Added → Actions (actions always visible).
>
> **Delete now cleans up related data (E09-S01/S02 delete path):**
> - Refuses to delete a user who still has tasks (`clientUid` or `assignedTo`) → `409` with task count; admin must reassign/close first.
> - Deletes the `users/{uid}/payments` subcollection (Firestore does not cascade), then the user doc, then the Auth account.
> - Firestore-first ordering (no orphan on partial failure); tolerates `auth/user-not-found` so legacy/Google-only docs without an Auth account can still be deleted.
>
> **Critical bug fixed (2026-06-13):** the Users list returned **0 rows / 500** — root cause was the `validate(paginationSchema,'query')` middleware doing `req.query = ...`, which throws in **Express 5** (getter-only `req.query`). Fixed in [validate.middleware.js](../../backend/src/middleware/validate.middleware.js) via `Object.defineProperty`. Also fixed: role-filtered list 500'd needing a `role+createdAt` composite index → now sorts in memory when filtering (see TD-01). Backfilled missing `role`/`createdAt` on legacy docs.
>
> **Source-of-drift fix:** the marketing Frontend wrote `users` docs directly via client SDK (Signup/Login/ProCheckoutModal), bypassing `upsertUser` — producing docs with no `role` and Timestamp-vs-ISO `createdAt` drift. Those now route through `POST /api/auth/register` → `upsertUser` ([Frontend/src/utils/registerUser.js](../../Frontend/src/utils/registerUser.js)).
>
> **Bug fix (2026-06-13) — new/edited user didn't appear in the grid without a manual refresh.** Neither user form invalidated the React Query cache on save; `UsersPage` loads `['portalUsers']` with `staleTime: 30s` and only invalidated on delete, so the cached list was shown after create/edit. Fix: both [ClientForm.tsx](../../Portal/src/components/users/ClientForm.tsx) and [TeamMemberForm.tsx](../../Portal/src/components/users/TeamMemberForm.tsx) now invalidate `['portalUsers']` (and `['portalUser', uid]` on edit) in their mutation `onSuccess`, so the grid refetches immediately.

---

### E09-S03 — Role Management & Custom Claims [Phase 1]

**Priority**: P2 | **Complexity**: S | **Linked spec story**: US-8 | **Dependencies**: E09-S01

> **✅ BUILT (status reconciled 2026-06-21).** Role is changed via `PATCH /api/portal/users/:uid`
> (guarded `requireRole('admin','manager')`); `canAssignRole` enforces that a manager cannot mint
> admin/manager. Backend persists `users/{uid}.role` and best-effort syncs the Firebase custom claim
> via `admin.auth().setCustomUserClaims(uid, { role })`. The **self-role-change guard** blocks a user
> from changing their own role. Auth middleware reads the claim (with a short role cache) so changes
> take effect without forced logout.

**Rationale**: Role changes must take effect promptly and reliably, without forcing the user to log out or wait for a token to expire.

**Acceptance Criteria**:
- Role is changed via the unified user edit form (`PATCH /api/portal/users/:uid`); `role` is admin/manager-assignable per `canAssignRole` (manager cannot mint admin/manager). Backend persists `users/{uid}.role` and best-effort syncs the Firebase custom claim.
- The new role takes effect within ≤60s for the affected user with **no logout required**.

> **⚠️ UPDATED 2026-06-13 — authorization model changed.** The original design above relied on the **token custom claim** taking effect "on next login / token refresh", which left a stale-token window of up to ~1h (a real bug: changing a user's role didn't apply until their cached token expired). **Now `verifyToken` resolves the role from Firestore `users/{uid}.role` as the authoritative source** (cached 60s), treating the token claim as a fallback only. Consequences:
> - Role up/down-grades propagate within ≤60s for everyone (self or admin-initiated) — no re-login, no token-refresh/revocation dance.
> - **`role` is the single source of truth.** The legacy `type` mirror field is fully removed (no code reads/writes it; `backfill-remove-user-type.js` cleared existing docs).
> - Security note: the Firestore read is server-side, so the client cannot influence the resolved role; trusting it over the signed claim stays secure. Cost: ≤1 Firestore read per user per minute (cached).
> - Implementation: `backend/src/middleware/auth.middleware.js` (`verifyToken`).
> - ✅ DONE (2026-06-14): the **self-role-change guard** and **role-change confirmation** are now built.
>   Server: `updateUser` rejects a role change where `uid === req.user.uid` (403 — an admin can't self-demote
>   and lock the org out; another admin must do it). UI: `TeamMemberForm` disables the role buttons + shows
>   "You can't change your own role" when editing yourself, and prompts a `useConfirm()` dialog before any
>   role change ("X will become Manager. This immediately changes what they can access.").

> **⚠️ BUG FIX 2026-06-13 — clients could not be promoted.** Since **every new user defaults to `client`**, promotion (client → staff) is the common path, but it was unreachable from the UI: editing a client opened `ClientForm`, which hardcoded `role: 'client'` with no selector, and only `TeamMemberForm` had a role picker (staff roles only). The backend already authorized the change via `canAssignRole`. Fix: added a **Role & Access** section to [ClientForm.tsx](../../Portal/src/components/users/ClientForm.tsx) — shown only when editing an existing user and only if the actor can assign a non-client role (`assignableRolesFor`). Selecting a staff role reveals a **required Designation** field (backend requires designation for staff). On save, `role` is sent only when changeable, `designation` only for staff roles. Create still always makes a client; promotion happens on a later edit.

**Backend endpoints needed**:
- `PATCH /api/portal/users/:uid` (role is one of the updatable fields; authz via `canAssignRole`)

**Frontend screens/components**:
- `Portal/src/components/users/TeamMemberForm.tsx` (role selector for staff users, gated by `assignableRolesFor`)
- `Portal/src/components/users/ClientForm.tsx` (role selector to promote a client to staff, gated by `assignableRolesFor`)

---

### E09-S04 — Bulk Step Reassignment [Phase 1 — core built; pulled forward from Phase 2]

**Priority**: P2 | **Complexity**: M | **Linked spec story**: US-8 | **Dependencies**: E09-S01

> **✅ BUILT (2026-06-14) — core flow.** Pulled forward because it's the companion to the delete guard
> (E11-S02): offboarding was a dead end without it. `POST /api/portal/users/:uid/reassign { toUid }`
> (admin only) batch-moves BOTH matter-level (`tasks.assignedTo`) and step-level (collection-group
> `steps.assignedTo`) ownership to another **staff** user (rejects clients / self), stamps `updatedAt`,
> returns `{ mattersMoved, stepsMoved }`. UI: `UsersPage` delete now catches the 409 "user has work"
> and opens a **Reassign work** modal (pick a team member → reassign → user becomes deletable). `apiFetch`
> now attaches `status`/`body` to errors so the 409 can be branched on.
> - ⏳ Deferred (need other epics): per-task `auditLog` entry + destination-user notification (E-07);
>   triggering reassignment from the Workload report (E08-S02); the standalone `UserDetailPage` button
>   (today it's driven from the Users grid delete flow, which is the actual offboarding path).

**Rationale**: When a team member leaves, all their open steps must be reassigned without manual step-by-step editing.

**Acceptance Criteria**:
- Admin can trigger bulk reassignment from `UserDetailPage` — "Reassign all open steps" button; opens a team member picker for the destination.
- `POST /api/portal/users/:uid/bulk-reassign { toUid: "..." }` — backend queries all `taskSteps` where `assignedTo == uid AND status IN ['active', 'pending']`; batch-updates `assignedTo → toUid`; writes audit entries; notifies the destination user.
- Action is logged: `auditLog` entry per task with `action = 'bulk_reassign'`.
- Workload report (E08-S02) can trigger reassignment from within the report.

**Backend endpoints needed**:
- `POST /api/portal/users/:uid/bulk-reassign`

**Frontend screens/components**:
- `Portal/src/pages/users/UserDetailPage.tsx` (bulk reassign button)

---

### E09-S05 — Multi-Email Login Resolution [Phase 1]

**Priority**: P1 | **Complexity**: M | **Linked spec story**: US-14 | **Dependencies**: E09-S02

> **🚧 PARTIAL (status reconciled 2026-06-21) — data model + UI built; login resolution NOT wired.**
> Built: clients carry an `emailIds[]` secondary-email array (`user.schema.js`, defaults to `[email]`),
> the `ClientForm` lets staff add/remove secondary emails, and the **leads** report already matches a
> contact against both primary `email` and `emailIds[]` (`array-contains-any`).
> **Still TODO (the core of this story):**
> - `getUserByEmail`/`userService` and auth middleware resolve a logged-in user **by primary `email` only**
>   (`.where('email','==',email)`) — they do NOT consult `emailIds[]`, so signing in with a secondary
>   email does not resolve to the profile. Add an `emailIds array-contains` fallback + set `req.clientUid`.
> - Secondary-email banner in the Portal ("logged in via secondary email; primary: …").
> - Ambiguous-resolution rule (prefer the profile where it is primary; else most-recent + admin alert).
> - No e2e coverage (`Portal/e2e` has no multi-email spec).

**Rationale**: Clients often have both personal and business emails. Any registered email must resolve to the correct profile.

**Acceptance Criteria**:
- On login with a secondary email: Firebase Auth ID token contains the secondary email; backend middleware (`verifyToken`) checks if `req.user.email` is in any `emailIds[]` across `users` collection; sets `req.clientUid` to the matching profile UID.
- If the email is a secondary email, the Portal shows a subtle banner: "You are logged in via a secondary email. Primary email: [primaryEmail]."
- If the same secondary email appears in multiple profiles, the backend returns the profile where it is the primary email; if not primary anywhere, returns the most recently created profile and creates an admin alert notification ("Ambiguous email resolution — please review client profiles for [email]").
- `GET /api/reports/login-mapping` (E08-S04) flags orphan emails.

**Backend endpoints needed**:
- Modification to `verifyToken` middleware: after verifying the ID token, perform the `emailIds[]` lookup for `client` role tokens.

**Frontend screens/components**:
- `Portal/src/pages/auth/LoginPage.tsx` (secondary email banner — shown post-login on dashboard)

---

### E09-S06 — User Detail (Read-Only View Mode) [Phase 2 — BACKLOG]

**Priority**: P3 | **Complexity**: S | **Linked spec story**: US-1 | **Dependencies**: E09-S01, E09-S02

**Rationale**: On the Users page, clicking a user row only opens **edit** mode — there's no way to just *view* a user's full details without entering the edit form. Users want a read-only detail view that shows all fields at a glance (opening edit only when they choose to change something).

**Acceptance Criteria**:
- Clicking a user in the Users grid opens a **read-only detail view** showing all of that user's fields (profile, role, client/professional mapping, emails, etc.).
- An explicit **Edit** action switches from view → edit; viewing never mutates.
- Consistent for both team members and clients.

**Frontend screens/components**:
- `Portal/src/pages/users/UsersPage.tsx` (+ a UserDetail view/drawer component).

---

## E-10 — Workflow Configuration

**Goal**: Give admin a UI to edit the Firestore config layer (step metadata: labels, deadlines, email template refs, default assignee roles) without a code deployment, and detect when the XState code layer is out of sync with the config layer.

---

### E10-S01 — Workflow Settings Screen [Phase 1]

**Priority**: P1 | **Complexity**: M | **Linked spec story**: US-17 | **Dependencies**: E02-S01, E01-S03

**Rationale**: Without this, every deadline or label change requires a code deployment. The spec explicitly calls for the admin-editable config layer.

**Acceptance Criteria**:
- `WorkflowSettingsPage.tsx` — accessible only to `admin` role (`/workflow-settings`); 403 for all other roles.
- Lists all workflows (`GET /api/workflows`); admin selects one to expand step list.
- `GET /api/workflows/:workflowId/steps` — returns all config-layer step documents; each row shows: step number, label, description, deadline days, default assignee role, email template ref, reminder days.
- Admin editable fields (inline editing or edit modal): `label`, `description`, `deadlineDays`, `defaultAssigneeRole`, `documentRequirementText`, `emailTemplateRef`, `sendReminderAfterDays`.
- `PATCH /api/workflows/:workflowId/steps/:stepNumber { ...editableFields }` — backend validates that only admin-editable fields are changed (read-only fields `paymentGated`, `allowedWithoutPayment`, `parallelGroup`, `branches` are rejected if included).
- Changes apply to **new tasks only**; a tooltip clarifies "Existing in-progress tasks are not affected."
- Non-editable fields (`paymentGated`, `allowedWithoutPayment`, etc.) are shown as read-only badges for context.

**Backend endpoints needed**:
- `GET /api/workflows`
- `GET /api/workflows/:workflowId`
- `GET /api/workflows/:workflowId/steps`
- `PATCH /api/workflows/:workflowId/steps/:stepNumber`

**Frontend screens/components**:
- `Portal/src/pages/workflow/WorkflowSettingsPage.tsx`

> **✅ PARTIAL (2026-06-13) — visual workflow review shipped (read-only).** Admins/managers/team_members can now **view** a service's configured workflow as an interactive diagram: from `/services`, each card has a "View workflow →" link to a new service detail page `/services/:serviceKey` ([ServiceDetailPage.tsx](../../Portal/src/pages/services/ServiceDetailPage.tsx)). The diagram is auto-derived from the XState machine (no hand-maintained chart) and stays in sync with code:
> - [machineToGraph.ts](../../Portal/src/workflows/machineToGraph.ts) derives nodes/edges (labels + kind: step/payment_gate/waiting/branch/final) from `machine.config.states`.
> - [layoutGraph.ts](../../Portal/src/workflows/layoutGraph.ts) lays out via dagre; [WorkflowDiagram.tsx](../../Portal/src/components/workflow/WorkflowDiagram.tsx) renders read-only React Flow (`@xyflow/react` + `@dagrejs/dagre`).
> - [registry.ts](../../Portal/src/workflows/registry.ts) maps `serviceKey → machine` (only `incorporation` wired; others show "No workflow configured yet").
> - **Still the hardcoded machine is the source of truth.** This is review/visualization only — NOT the DB-backed editable config layer this story specifies (no `workflowTemplates` collection, no `/api/workflows*` endpoints yet, no inline step-metadata editing). The editable config layer remains TODO.

> **✅ UPDATE (2026-06-13) — DB-backed definitions now exist (read side); editor UI deferred.**
> The data-driven foundation this story needs is **built**: workflows are stored in
> `workflowDefinitions/{id}` (versioned) and compiled at runtime (see architecture.md §1.3).
> Read endpoints exist: `GET /api/workflow-definitions`, `GET /api/workflow-definitions/:id`.
> The visualizer reads from these (no longer the hardcoded machine). **What remains for this
> story** is the WRITE/edit side, deferred to its own phase below.

> **🔜 FUTURE PHASE — Admin Workflow Editor (E10-S01 write side).** Scoped & deferred 2026-06-13.
> The seed script is a one-time migration; ongoing flow changes (we edit flows talking to business,
> and will author 50+ flows) must be doable from the UI. Planned scope:
> - Backend: CRUD on `workflowDefinitions` — create/update/**publish** (publish bumps `version`;
>   `createTask` already pins version so in-flight tasks are unaffected). Reuse `validateDefinition`
>   + a Zod schema; invalidate the workflow cache on write.
> - Portal: flesh out the stub `WorkflowSettingsPage` — list definitions, **edit step metadata**
>   (title, assignedRole, effects, deadlines, reorder, active), live-preview via the existing
>   visualizer/compiler, publish → new version.
> - **v1 scope = step-metadata editing only** (NOT topology rewiring, NOT authoring brand-new flows
>   from scratch — those are later sub-phases). Build sequence: after Phase 2 (step execution).

> **✅ BUILT (2026-06-21) — write side shipped, incl. topology editing.** Admin-only editor.
> Backend: `POST /api/workflow-definitions` (create) + `PATCH /api/workflow-definitions/:id` (update),
> both run the shared `validateDefinition` before persisting and **bump `version`** (in-flight matters
> are version-pinned, so unaffected); serviceKey collisions are rejected; `invalidateWorkflowCache()`
> is now called on every write (it was defined but never invoked — also retrofitted into the existing
> step-eta / step-assignee writes). Portal: `WorkflowEditorPage.tsx` (`/services/:serviceKey/edit`) —
> add/remove/reorder steps, edit every step field (title, description, type, role, ETA, phase, effects,
> client CTA), wire transitions + payment-gate targets, manage phases, with **live inline validation**
> and a **live diagram preview** via the same compiler the runtime uses. Reached from a service's
> "Edit workflow" button (admin only). e2e: `Portal/e2e/workflow-editor.spec.ts` (load, validation
> gating, publish round-trip with version bump, 422 on invalid, 403 for clients).
> **Note (2026-06-21):** per-step `clientVisible` + a merged single per-step settings block
> (assignee + ETA + client-visible) are being added on top of this — see the combined-settings work.

> **✅ UX REDESIGN + CREATE-FROM-SCRATCH (2026-06-27).** The editor was rebuilt for
> non-technical admins: plain-language controls ("What kind of step?", "What
> happens next?" with named step pickers, automatic-action toggles, "Who does
> this?"), an **ⓘ tooltip on every field**, "Stages" terminology, plain-language
> validation, and a collapsed "Advanced (raw)" escape hatch. A **"+ New workflow"**
> entry on the Service Catalog (`/workflows/new`) lets admins author a brand-new
> workflow from scratch in the same editor (→ `POST /api/workflow-definitions`).
> No engine/schema change — presentation layer over the existing definition model.

---

### E10-S02 — Config Sync Warning [Phase 1]

**Priority**: P1 | **Complexity**: S | **Linked spec story**: US-17 | **Dependencies**: E10-S01

> **✅ BUILT (2026-06-14) — adapted to the data-driven model.** The original two-layer check
> (`workflowTemplates.totalSteps` vs config step-doc count) is obsolete — workflows are now single
> `workflowDefinitions` documents compiled at runtime, so there's no second layer to drift from. The
> faithful equivalent is a **definition health check**: `GET /api/workflow-definitions/:id/sync-check`
> runs `validateDefinition` (hard errors: dangling transitions/gates, dangling phaseIds, dup step
> numbers) plus soft warnings (unreachable steps; steps with no phase).
> ([workflowDefinitions.controller.js](../../backend/src/controllers/workflowDefinitions.controller.js))
> - **`ServiceDetailPage`** shows a red banner (hard errors → "new matters blocked") or amber banner
>   (warnings) when the workflow isn't clean.
> - **`createTask` blocks** on hard errors with **409 `WORKFLOW_OUT_OF_SYNC`** (the spec's
>   "reject new task creation until in sync"), so a broken workflow can't spawn an unrunnable matter.

**Rationale**: When a developer updates the XState machine topology (adds a step, changes a branch), the Firestore config layer may be missing metadata for new steps. The sync check prevents broken task instantiation.

**Acceptance Criteria**:
- `GET /api/workflows/:workflowId/sync-check` — backend compares `workflowTemplates/{workflowId}.totalSteps` (set by developer on deploy, derived from machine config) with the count of `workflowTemplates/{workflowId}/steps` documents.
- If counts differ, returns `{ inSync: false, machineTotalSteps: N, configStepCount: M, missingStepNumbers: [...] }`.
- `WorkflowSettingsPage.tsx` calls `sync-check` on mount; if `inSync === false`, shows a yellow warning banner: "⚠ Config out of sync — the machine has N steps but config has M. Fill in metadata for steps [list] before using this workflow in new tasks."
- Admin can click "Fill in missing steps" to open an edit form pre-populated with blank metadata for each missing step number.
- The workflow is blocked from new task creation (`POST /api/tasks` returns 409 "Workflow config out of sync") until all steps have config entries.

**Backend endpoints needed**:
- `GET /api/workflows/:workflowId/sync-check`
- Modification to `POST /api/tasks`: call sync-check for the selected `workflowType`; reject with 409 if out of sync.

**Frontend screens/components**:
- `Portal/src/pages/workflow/WorkflowSettingsPage.tsx` (sync warning banner)

---

### E10-S03 — Collapsible Sections on Workflow Config Screens [Phase 2]

**Priority**: P3 | **Complexity**: S | **Linked spec story**: US-17 | **Dependencies**: E10-S01

**Rationale** (#68): The Workflow Editor and Service Detail config screens stack several tall sections (Workflow meta, Stages/Phase Assignment, Steps, Step Settings, Live preview), forcing a lot of scrolling. The ticket asked to *remove* the Phase Assignment section, but stakeholder direction was to keep it functional and instead let admins **collapse** sections to reclaim space.

**Acceptance Criteria**:
- On the **Workflow Editor** ([WorkflowEditorPage.tsx](../../Portal/src/pages/workflow/WorkflowEditorPage.tsx)), each section — **Workflow**, **Stages**, **Steps**, **Live preview** — is independently collapsible via a header toggle.
- On the **Service Detail** page ([ServiceDetailPage.tsx](../../Portal/src/pages/services/ServiceDetailPage.tsx)), **Configured Workflow**, **Phase Assignments**, and **Step Settings** are collapsible.
- Collapse state **persists per section** (localStorage) across reloads.
- **Live preview** additionally collapses to a slim **vertical rail** and is **drag-resizable** (reuses `useRail`), so the editor column widens; width + state persist.
- No section is removed; all config functionality (phase assignment, step settings, etc.) is unchanged.

**e2e**: `workflow-editor.spec.ts` (`#68` sections collapse and persist on reload); `service-catalog.spec.ts` / `services-eta.spec.ts` / `step-settings.spec.ts` (section titles are collapse toggles).

**Frontend screens/components**:
- New shared `Portal/src/components/common/CollapsibleSection.tsx`; `WorkflowEditorPage.tsx`, `ServiceDetailPage.tsx`, `useResizablePanels` (`useRail`).

---

## E-11 — Matter Creation, Pre-Assignment, Priority & UI Platform

**Goal**: Make matter creation a first-class action from the Matters page, let staff
**pre-configure who owns each phase** of a service's workflow so steps are auto-assigned
on creation, make **Urgent** priority visible where staff actually look (My Tasks +
dashboard) including approval to-dos, and standardise the app's list/confirm UX
(reusable data grid, in-app confirm dialog, clearer task-detail layout). Raised 2026-06-14.

> **Why these together**: S01–S04 form one operational loop — *create a matter → its work is
> already routed to the right people → the urgent/pending items surface on each person's
> worklist* — building on the assignment model (E-03 status block) and the approval chain
> (E03-S04). S05–S08 are the **UI platform** work that emerged while polishing that loop:
> the flame priority icon (S05), a reusable DataGrid + list→grid migration (S06), an in-app
> confirmation dialog replacing `window.confirm` (S07), and the task-detail Activity sidebar (S08).
>
> **Story status (all 2026-06-14):** S01 ✅ · S02 ✅ · S03 ✅ · S04 ✅ · S05 ✅ · S06 ✅ · S07 ✅ · S08 ✅.

---

### E11-S01 — Create Matter from the Matters Page [Phase 1]

**Priority**: P1 | **Complexity**: S | **Linked spec story**: US-3 | **Dependencies**: E02-S03

> **✅ BUILT (2026-06-14).** "Create Matter" button (admin/manager) on the Matters page header opens
> [CreateMatterModal.tsx](../../Portal/src/components/tasks/CreateMatterModal.tsx) — searchable client
> picker + workflow-backed service picker → `POST /api/tasks`. Client-profile "Assign Service" retained.

**Rationale**: Today a matter can only be created from a client's profile ("Assign Service" on
`ClientForm`). Staff managing the Matters list have no direct way to start a new matter — they
must navigate to the client first. A **"Create Matter"** action on the Matters page closes that
gap with a client picker + service picker, reusing the existing `POST /api/tasks`.

**Acceptance Criteria**:
- A **"Create Matter"** button on the Matters page header (admin/manager only; hidden for client
  and team_member) opens a **modal** (chosen over a separate route for mobile-friendliness).
- The modal has: a **searchable client picker** (from `GET /api/portal/users?role=client`) and a
  **service picker** limited to workflow-backed, active services (services ∩ `workflowDefinitions`).
- On submit → `POST /api/tasks { clientUid, serviceKey, serviceName }` (existing endpoint, incl. the
  E03-S04 approval gate). On success the modal closes, the list invalidates (`['tasks']`), and the
  new matter appears.
- The existing client-profile "Assign Service" flow is **retained** (both entry points work).
- Validation + error states (no client / no service selected; API error shown inline).

**Backend endpoints needed**: none new — reuses `POST /api/tasks`, `GET /api/portal/users`,
`GET /api/service-config`, `GET /api/workflow-definitions`.

**Frontend screens/components**:
- `Portal/src/pages/tasks/TasksPage.tsx` (header button + modal)
- `Portal/src/components/tasks/CreateMatterModal.tsx` (new)

---

### E11-S02 — Per-Phase Default Assignees (Service-Level Config) [Phase 1]

**Priority**: P1 | **Complexity**: M | **Linked spec story**: US-3 / US-8 | **Dependencies**: E11-S01, E04-S08 (phases)

> **✅ BUILT (2026-06-14).** Collection `workflowPhaseAssignments/{definitionId}` + endpoints
> `GET`/`PUT /api/workflow-definitions/:id/phase-assignments` (read staff / write admin+manager;
> validates phaseId exists + assignee is staff). Editor section on
> [ServiceDetailPage.tsx](../../Portal/src/pages/services/ServiceDetailPage.tsx) ("Phase Assignments").
> `createTask` applies each phase's assignee onto its steps at creation. **Delete-guard extended**:
> `removeUser` now also counts `collectionGroup('steps').where('assignedTo','==',uid)` so a user owning
> steps (via pre-assignment / Step owner) can't be deleted and orphan them — folds in the
> "delete user with matters" requirement / TD-07.
>
> **Extension (2026-06-20) — per-STEP default assignees.** Beyond per-phase defaults, a specific step can
> now be pre-assigned to a team member. Stored as `defaultAssigneeUid` ON the step in the definition
> (version-pinned per matter, like ETAs). Endpoints `GET`/`PUT /api/workflow-definitions/:id/step-assignees`
> (read staff / write admin+manager; validates step exists + assignee is staff). UI: `StepAssigneeEditor`
> on the service detail page (one staff dropdown per step). Precedence in `createTask`: a step's own
> `defaultAssigneeUid` **overrides** its phase default; neither set → shared pool. Tests: `services-eta.spec.ts`.
>
> **UI merge (2026-06-20):** the former separate "Phase Assignments" and "Step Assignees" sections are now a
> single **"Assignments"** editor (`AssignmentsEditor` in `ServiceDetailPage.tsx`) — each phase shows its
> default-assignee dropdown with its steps nested beneath; a step defaults to "Inherit from phase" and can
> override. One Save button persists both phase and step changes (each only if edited). Steps without a
> phase render under an "Unphased steps" group.

**Rationale**: A firm runs the same workflow the same way each time — a given phase's tasks always
go to the same person/team. Configuring this **once per service workflow** means every new matter is
pre-routed: each step inherits its phase's default assignee at creation, so work lands in the right
person's "My Tasks" without manual per-step assignment.

**Decision (2026-06-14)**: Store the phase→assignee map in a **separate config collection**
`workflowPhaseAssignments/{definitionId}` (NOT on the versioned definition), so ops can re-route a
phase without bumping the workflow version. Edited in the **Services section** (the service workflow
detail page), keeping definition topology and staffing concerns separate.

**Acceptance Criteria**:
- New collection `workflowPhaseAssignments/{definitionId}` = `{ definitionId, assignments: { [phaseId]: uid|null }, updatedAt, updatedBy }`.
- Backend: `GET /api/workflow-definitions/:id/phase-assignments` (staff read) and
  `PUT /api/workflow-definitions/:id/phase-assignments { assignments }` (admin/manager write) —
  validates each `phaseId` exists on the definition and each `uid` is a staff user (rejects clients).
- The **service workflow detail page** (`ServiceDetailPage`) gains a **"Phase assignments"** section:
  for each phase of the definition, a staff-user dropdown (default "Unassigned"). Saving calls the PUT.
- **On matter creation** (`createTask`): for each instance step, resolve its `phaseId` → look up the
  phase's default assignee → set `step.assignedTo`. The matter-level `assignedTo` stays null (these are
  per-step routings, not a single matter owner). Steps in phases with no configured assignee stay
  unassigned (shared pool).
- Re-configuring assignments affects **new matters only**; in-flight matters are unchanged (consistent
  with the version-pinning model). A later edit/reassign still works per the existing step/matter
  assignment controls.
- If a configured assignee is later deleted, matter creation degrades gracefully (step left unassigned;
  no failure).
- **Delete-guard extension (folds in TD-07 / the "delete user with matters" ask, 2026-06-14):** because
  pre-assignment routes users onto *steps* (not just matter-level `assignedTo`), the user-delete guard
  ([portalUsers.controller.js](../../backend/src/controllers/portalUsers.controller.js) `removeUser`)
  must ALSO refuse deletion when the user owns any step (`collectionGroup('steps').where('assignedTo','==',uid)`),
  not only matter-level `clientUid`/`assignedTo`. Otherwise pre-assignment creates orphaned steps pointing
  at a dead UID. The 409 count includes step ownership.

**Backend endpoints needed**:
- `GET /api/workflow-definitions/:id/phase-assignments`
- `PUT /api/workflow-definitions/:id/phase-assignments`
- Modification to `POST /api/tasks` (`createTask`): apply phase assignees to seeded steps.
- Modification to `DELETE /api/portal/users/:uid` (`removeUser`): include step-assignee count in the guard.

**Frontend screens/components**:
- `Portal/src/pages/services/ServiceDetailPage.tsx` (Phase assignments editor section)
- `Portal/src/api/workflowDefinitions.ts` (get/put phase-assignments helpers)

---

### E11-S03 — Urgent Priority Visibility on My Tasks & Dashboard [Phase 1]

**Priority**: P2 | **Complexity**: S | **Linked spec story**: US-10 | **Dependencies**: E03-S01, E03-S05

> **✅ BUILT (2026-06-14).** `my-steps` rows now carry EFFECTIVE urgency (matter `isUrgent` OR active
> step `isUrgent`). **My Tasks** has an "Urgent — waiting on you" section above the assigned queue;
> the staff **dashboard** has a [MyWorkWidget.tsx](../../Portal/src/components/dashboard/MyWorkWidget.tsx)
> "Urgent — waiting on you" card. Reuses `isUrgent` (no new data model).

**Rationale**: The `isUrgent` flag already exists (E03-S05) on matters and steps, but it's not
surfaced where staff plan their day. Staff need to immediately see **which urgent items are waiting
on them**. This reuses `isUrgent` (no new data model) and adds the *visibility* layer.

**Acceptance Criteria**:
- `GET /api/tasks/my-steps` carries urgency that reflects **either** the matter `isUrgent` **or** the
  active step `isUrgent` (an urgent step makes the row urgent even if the matter isn't).
- **My Tasks**: urgent rows are visually flagged and an **"Urgent — waiting on you"** grouping/treatment
  surfaces a user's urgent assigned items first (above the rest of their assigned queue).
- **Dashboard**: a staff widget **"Urgent tasks waiting on you"** shows the count + a short list of the
  user's urgent assigned steps, linking into each matter. Zero-state hidden or shows "None".
- Urgency continues to clear naturally as steps complete (existing behaviour); no urgent item lingers
  after its step is done.

**Backend endpoints needed**:
- `GET /api/tasks/my-steps` (extend the row with effective urgency; already exists).

**Frontend screens/components**:
- `Portal/src/pages/tasks/MyTasksPage.tsx` (urgent grouping)
- `Portal/src/pages/dashboard/DashboardPage.tsx` (+ a new urgent widget component)

---

### E11-S04 — Approvals as Worklist Items [Phase 1]

**Priority**: P1 | **Complexity**: S | **Linked spec story**: US-13 | **Dependencies**: E03-S04, E03-S01

> **✅ BUILT (2026-06-14) — fixes "approvals not appearing in My Tasks".** `GET /api/tasks/my-steps`
> now also returns `approvals` (matters awaiting the caller's approval, via role-derived
> `canApprove(user, matter)` — admin + `pending_admin_approval` today, extensible). **My Tasks** shows
> an "Awaiting your approval" section; the staff **dashboard** widget shows the count + list. Each links
> to the matter's approval banner (Approve/Reject from E03-S04).
> *(Update 2026-06-14: the reassignment-offers section that briefly shared this feed was removed when
> reassignment became direct — see E03-S02.)*

**Rationale**: A matter `pending_admin_approval` (E03-S04) has no `active` step, so it never appeared
in My Tasks — yet approving it **is** a to-do for the approver. Approvals must surface as worklist
items. The approver is **role-derived, not hardcoded** (today admin approves a manager-created matter;
the model must extend to future approval rules without a rewrite).

**Acceptance Criteria**:
- A `canApprove(user, matter)` notion (helper) determines who sees a pending matter as an approval
  to-do. v1: admin + matter status `pending_admin_approval`. Designed to extend (e.g. manager approving
  team-member-created matters) without changing call sites.
- Backend: `GET /api/tasks/my-steps` (or a sibling field/endpoint) returns the set of matters awaiting
  the caller's approval, enriched (client, service, who created it, age).
- **My Tasks**: an **"Approvals"** section at the top (for users who can approve) listing pending-approval
  matters; each links to the matter's approval banner (Approve / Reject live there, E03-S04).
- **Dashboard**: the count is reflected in the urgent/approvals widget area ("N matters awaiting your
  approval").
- Non-approvers never see the section. A matter leaving `pending_admin_approval` drops out immediately.

**Backend endpoints needed**:
- Extend `GET /api/tasks/my-steps` (or add `GET /api/tasks/my-approvals`).

**Frontend screens/components**:
- `Portal/src/pages/tasks/MyTasksPage.tsx` (Approvals section)
- `Portal/src/pages/dashboard/DashboardPage.tsx` (approvals count)

---

### E11-S05 — Urgent Priority Icon (Flame) [Phase 1]

**Priority**: P3 | **Complexity**: S | **Linked spec story**: US-10 | **Dependencies**: E11-S03 | **Raised**: 2026-06-14

> **✅ BUILT (2026-06-14).** Replaced the text "Mark urgent" toggle button with a more intuitive
> **flame icon** (per user request). Filled red when urgent, grey outline when not, used consistently
> app-wide: matter header (icon button) + step hero (labelled) on the task detail, and the Urgent
> badges in the Matters grid, My Tasks, and the dashboard widget. `aria-pressed` for a11y. Reuses the
> existing `isUrgent` flag — no data change.

**Acceptance Criteria**:
- The urgent control is a flame icon (toggle), filled+red when active; consistent across matter header,
  step hero, list/grid badges and the dashboard widget.
- My Tasks work grid has a sortable + searchable **Priority** column (Urgent / Normal), urgent on top.

**Frontend screens/components**:
- `Portal/src/pages/tasks/TaskDetailPage.tsx`, `MyTasksPage.tsx`, `TasksPage.tsx`,
  `Portal/src/components/dashboard/MyWorkWidget.tsx`.

---

### E11-S06 — Reusable Data Grid + List→Grid Migration [Phase 1]

**Priority**: P2 | **Complexity**: M | **Linked spec story**: — | **Dependencies**: E09 (Users grid pattern) | **Raised**: 2026-06-14

> **✅ BUILT (2026-06-14).** Extracted the Users-page table pattern into a single reusable
> **`DataGrid<T>`** ([Portal/src/components/common/DataGrid.tsx](../../Portal/src/components/common/DataGrid.tsx)):
> sortable headers, global search, client-side pagination, desktop div-grid table + optional mobile-card
> renderer, loading/error/empty states, and an **`onRowClick`** that makes whole rows clickable
> (cursor + hover). Migrated these list pages from ad-hoc tables/cards to `DataGrid`:
> - **Matters** ([TasksPage.tsx](../../Portal/src/pages/tasks/TasksPage.tsx)) — sortable Client/Service,
>   Status, Payment, Progress, Updated, Actions; row → matter detail.
> - **My Tasks** ([MyTasksPage.tsx](../../Portal/src/pages/tasks/MyTasksPage.tsx)) — two grids: "Awaiting
>   your approval" + "My work" (assigned + pool combined with a sortable **Queue** column; Priority column).
> - **Reports** — All / Completed / Pending (per reason group) / Master Sheet
>   ([reportColumns.tsx](../../Portal/src/pages/reports/reportColumns.tsx) shared columns); server-side
>   status/payment/date filters retained, CSV export retained; rows → matter detail.

**Acceptance Criteria**:
- One `DataGrid<T>` component is the shared basis for Users-style lists; supports sort, search, pagination,
  mobile cards, and optional `onRowClick`.
- Matters, My Tasks (both sections), and all four report pages render via `DataGrid` with clickable rows
  that open the matter (`/tasks/:id`).
- Pre-existing server-side report filters and CSV export are preserved.

**Frontend screens/components**:
- `Portal/src/components/common/DataGrid.tsx` (new), `Portal/src/pages/reports/reportColumns.tsx` (new),
  `TasksPage.tsx`, `MyTasksPage.tsx`, `reports/*`.

---

### E11-S07 — App Confirmation Dialog (replace window.confirm) [Phase 1]

**Priority**: P3 | **Complexity**: S | **Linked spec story**: — | **Dependencies**: E01-S04 | **Raised**: 2026-06-14

> **✅ BUILT (2026-06-14).** Native `window.confirm()` for destructive actions replaced with a styled,
> promise-based in-app dialog — `ConfirmProvider` + `useConfirm()`
> ([ConfirmDialog.tsx](../../Portal/src/components/common/ConfirmDialog.tsx),
> [confirmContext.ts](../../Portal/src/components/common/confirmContext.ts)), mounted at the app root.
> Usage: `if (await confirm({ title, message, tone: 'danger', confirmLabel: 'Delete' })) …`. Wired into
> the **delete matter**, **delete user**, and **delete lead** flows.
> - ✅ DONE (2026-06-14): `window.alert()` error popups (mutation onError handlers across
>   tasks/services/users/reports) replaced with an in-app **toast** system — `ToastProvider` +
>   `useToast()` ([ToastProvider.tsx](../../Portal/src/components/common/ToastProvider.tsx),
>   [toastContext.ts](../../Portal/src/components/common/toastContext.ts)), mounted at the app root.
>   `toast.error/success/info`; errors linger longer, all auto-dismiss + manually dismissable. No
>   `window.alert()` remains in `Portal/src`.

**Acceptance Criteria**:
- A single app-wide confirm dialog (our UI, not the browser's) is used for all destructive confirmations.
- Delete matter / user / lead use it with a danger tone and explicit confirm label.

**Frontend screens/components**:
- `Portal/src/components/common/ConfirmDialog.tsx`, `confirmContext.ts`; `TasksPage.tsx`,
  `users/UsersPage.tsx`, `reports/ContactLeadsReport.tsx`, `main.tsx`.

---

### E11-S08 — Task Detail: Activity in a Sticky Sidebar [Phase 1]

**Priority**: P3 | **Complexity**: S | **Linked spec story**: US-1 | **Dependencies**: E-03 redesign | **Raised**: 2026-06-14

> **✅ BUILT (2026-06-14).** UX review flagged that the Activity feed stacked *below* the current step
> competed with the action zone and pushed the step list down. Moved Activity into a **sticky right
> sidebar** (xl+) beside the hero/steps, capped height with internal scroll; on smaller screens it
> collapses below the content. ([TaskDetailPage.tsx](../../Portal/src/pages/tasks/TaskDetailPage.tsx))

**Acceptance Criteria**:
- On wide screens Activity is a sticky right column; on narrow screens it stacks below the step content.
- The step list is reachable without scrolling past the full activity history.

---

## E-12 — Client vs Internal View Separation

**Goal**: Ensure the client-facing view never exposes internal operational detail. A client must see a
clean, client-appropriate picture of *their* service — never internal team assignees, internal-only
activity events, or staff mechanics. Raised 2026-06-14.

> **✅ BUILT (2026-06-14).** S01 ✅ · S02 ✅ · S03 ✅. The client↔internal boundary is now hardened
> server-side: client reads get a projected payload (no `assignedTo`/owner/audit fields) and a
> whitelisted, actor-masked activity feed; the client UI hides Step-owner controls. Don't rely on
> hiding in the UI — the API itself withholds internal data from clients.

---

### E12-S01 — Hide Internal Assignees & Owner Controls from Clients [Phase 1]

**Priority**: P1 | **Complexity**: S | **Linked spec story**: US-1 | **Dependencies**: E-03, E-04

> **✅ BUILT (2026-06-14).** `projectTaskForClient()` strips `assignedTo`/`createdBy`/`adminOverride`/
> internal step fields from `getTask`+`listTasks` for clients; `TaskDetailPage` hides the Step-owner
> block for clients (`!role.isClient`). Matter-owner controls were already `canAssign`-gated (staff only).

> **✅ EXTENDED (2026-06-21) — per-step client visibility.** Steps now carry a `clientVisible`
> boolean on the workflow definition (default `true`). `getTask` for a client DROPS steps whose
> definition marks `clientVisible === false` (`clientVisibleStepSet()` + `projectTaskForClient(task,
> visibleSet)`), so internal-only steps (e.g. "DSC preparation", "Form Check") never appear in the
> client's step list — matching the business sheet's "Steps viewed in client interface" column.
> Configurable per step in two places: the service **Step Settings** block and the **Workflow Editor**
> (a "Visible to client" toggle). The company-incorporation seed was rewritten to the 44-step sheet
> with `clientVisible` set on the 16 client-facing steps. e2e: `Portal/e2e/step-settings.spec.ts`
> (combined settings + client-projection filtering).

**Rationale**: Clients should not see *who internally* is working their matter (Step owner, Matter owner,
assignee names, reassignment controls). These are internal staffing details.

**Acceptance Criteria**:
- The client task view shows no Step-owner / Matter-owner pickers, assignee names, or reassign controls.
- Backend: `GET /api/tasks/:id` and `/steps` responses for a **client** omit (or null) `assignedTo` and
  any internal-only fields — defence at the API, not just the UI.
- Staff views are unchanged.

**Backend/Frontend**:
- `backend/src/controllers/tasks.controller.js` (role-aware projection for client reads).
- `Portal/src/pages/tasks/TaskDetailPage.tsx` (client branch hides owner/assignee UI).

---

### E12-S02 — Client-Safe Activity Feed [Phase 1]

**Priority**: P1 | **Complexity**: M | **Linked spec story**: US-1 | **Dependencies**: E03-S06 (events), E12-S01

> **✅ BUILT (2026-06-14).** `listTaskEvents` filters to a `CLIENT_EVENT_WHITELIST`
> (COMPLETE_STEP, BRANCH_DECISION, CLIENT_APPROVE/REJECT, GOVT_APPROVE/REJECT, RECORD_PAYMENT) for
> clients; internal events (STEP_REASSIGNED, TASK_APPROVED/REJECTED, ADMIN_OVERRIDE_PAYMENT) are dropped.
> Actor names are masked to "You" (own actions) / "Our team" (everyone else); `byRole` is nulled. Staff
> still get the full feed with real names.

**Rationale**: The activity thread currently records internal events (reassignments, step-owner changes,
internal comments, payment-override mechanics, govt-step internals). A client should see only events
meaningful to them — their own approvals/rejections, status/stage changes, document requests, completion.

**Acceptance Criteria**:
- A **client-safe event whitelist** governs what `GET /api/tasks/:id/events` returns to a client (e.g.
  matter created/approved, stage completed, client-action requested, client approve/reject, matter
  completed). Internal events (`STEP_REASSIGNED`, internal `COMPLETE_STEP` detail, payment overrides,
  internal comments) are excluded for clients.
- Event actor identity is generalised for clients ("Our team") rather than naming internal staff.
- Filtering is enforced **server-side** by role; staff still get the full feed.
- The client task view's Activity reflects only the whitelisted, client-friendly entries.

**Backend/Frontend**:
- `backend/src/controllers/tasks.controller.js` `listTaskEvents` (role-aware whitelist + actor masking).
- `Portal/src/pages/tasks/TaskDetailPage.tsx` (client Activity copy).

---

### E12-S03 — Client View Audit Pass [Phase 1]

**Priority**: P2 | **Complexity**: S | **Linked spec story**: US-1 | **Dependencies**: E12-S01, E12-S02

> **✅ DONE (verified 2026-06-14).** Swept every client-reachable surface. Findings:
> - `getTask`/`listTasks`/`listTaskEvents` — the only client-reachable task data paths — all projected (S01/S02).
> - Reports (`/api/leads`, `/api/reports/*`) are `requireRole('admin','manager')` (+team_member for leads) — no client access.
> - `my-steps` 403s clients. Matters grid (TasksPage) shows clients only Service/Status/Payment/Progress — no assignee column.
> - StepHeroPanel Step-owner block hidden for clients; matter-owner picker is staff-only (`canAssign`).
> No remaining leaks. (Approval/rejected status labels are unreachable by clients since clients never create matters.)

**Rationale**: A holistic sweep of every client-facing surface to catch any remaining internal leakage
(labels, tooltips, step internal notes, "with our team" vs internal role names, urgent flags meant for
ops, etc.).

**Acceptance Criteria**:
- Reviewed: client task list, task detail (Steps/Documents/Payments), journey/stage cues, and any
  client-visible report/profile surfaces — none expose internal assignees, internal events, or staff-only
  controls.
- Findings tracked and fixed; documented in this story.

---

## E-13 — Per-Step ETAs & SLA Tracking

**Goal**: Make every matter time-aware. Each step in a service's workflow can be configured with an
expected duration (an ETA / SLA), and the system derives a per-step and whole-matter **due date** as a
matter progresses, surfaces what's **running late**, and exposes "time on step" / "time to complete" for
ops visibility. Configured once at the **service (workflow definition) level**; applied automatically to
every matter created from that service. Raised 2026-06-14.

> **✅ PHASE-1 BUILT (status reconciled 2026-06-21).** The time-aware core shipped: ETA config
> (S01), derived per-step + whole-matter due dates (S02), and "running late" visibility (S03) are all
> in code. ETA config lives on the definition's steps (`typicalDurationDays`); due dates are computed
> server-side at matter creation / on each transition and stored on the step instance so reports and
> worklists sort/filter by lateness without recomputation.
> **Still pending (Phase 2):** SLA / Delay report (S04) and SLA breach notifications (S05, gated on E-07 email).

**Why now**: We already pre-assign work per phase and flag urgency manually (E-11). The missing piece is
*objective* timeliness — without ETAs, "running late" is guesswork and the journey tracker (E04-S08) has
no time dimension. This turns the workflow config into an SLA engine.

---

### E13-S01 — Per-Step ETA Configuration (Service Level) [Phase 1]

**Priority**: P1 | **Complexity**: M | **Linked spec story**: US-9, US-10 | **Dependencies**: E10-S02, E11-S02

> **✅ BUILT (2026-06-14).** Used the definition schema's existing `typicalDurationDays` field (already
> documented there as "powers ETA + delay states") rather than a new `etaDays`. `validateDefinition`
> now rejects a negative/non-numeric ETA; `syncCheckDefinition` warns on partial coverage
> (some-but-not-all steps have an ETA). Write path:
> `GET/PUT /api/workflow-definitions/:id/step-etas` (admin/manager write) sets `typicalDurationDays` on
> the matching steps and **bumps `version`** (definitions are version-pinned per matter, so in-flight
> matters are unaffected; new matters inherit the change). UI: `StepEtaEditor` on the service detail page
> beside Phase Assignments (per-step day input + live total), edits-overlay + cache-write pattern.
>
> **Update (2026-06-20):** steps with no configured ETA now default to **2 days** (`DEFAULT_STEP_ETA_DAYS`
> in `tasks.controller.js` `etaDaysOf`), so every step — and therefore every matter — gets a projected
> due date out of the box. An explicit per-step value in Workflow Settings still overrides the default.

**Rationale**: Each step of a service workflow should carry an expected duration so the system can compute
due dates. Configured on the workflow definition (per service), the same place per-phase assignees are
set — one config, applied to all matters of that service.

**Acceptance Criteria**:
- A workflow step can carry an `etaDays` (or `etaHours`) value in the definition schema (optional;
  unset = untracked). Validated by `validateDefinition` (non-negative number).
- An admin/manager can edit each step's ETA from the service detail page (alongside Phase Assignments),
  persisted to the definition; `getWorkflowSyncCheck` flags definitions with partial/missing ETAs as a
  *warning* (not an error).
- Editing ETAs does not alter in-flight matters (definitions are version-pinned per matter); applies to
  matters created after the change.

**Backend/Frontend**:
- `shared/workflows/definitionSchema.js` (add `etaDays` to step shape + validation).
- `backend/src/controllers/workflowDefinitions.controller.js` (persist step ETAs; surface in sync-check).
- `Portal/src/pages/services/ServiceDetailPage.tsx` (per-step ETA editor near PhaseAssignmentsEditor).

---

### E13-S02 — Derived Due Dates on Matter Steps [Phase 1]

**Priority**: P1 | **Complexity**: M | **Linked spec story**: US-9 | **Dependencies**: E13-S01

> **✅ BUILT (2026-06-14).** `createTask` stamps the active first step's `startedAt`/`dueAt` and the
> matter's `matterDueAt` (now + sum of remaining step ETAs); deferred to `approveTask` for
> manager-created matters (the clock starts when work actually starts). `transitionTask` stamps the
> completed step's `onTime` (completedAt ≤ its `dueAt`), starts the newly-active step's clock, and
> re-projects `matterDueAt` from the landing step. Steps without an ETA get no `dueAt` (and contribute 0
> to the projection). All computed server-side (single source of truth). Helpers: `addDaysIso`,
> `etaDaysOf`, `projectMatterDueAt` in `tasks.controller.js`.

**Rationale**: When a matter is created and as it advances, each step needs a concrete **due date** so
lateness is objective and sortable.

**Acceptance Criteria**:
- On matter creation, the first/active step gets `startedAt` (now) and `dueAt` (= startedAt + step ETA).
- On each forward transition, the newly-active step is stamped `startedAt`/`dueAt`; the completed step
  records `completedAt` and `onTime` (completedAt ≤ dueAt). Steps without an ETA get no `dueAt`.
- A whole-matter projected completion (`matterDueAt`) is derived from the sum of remaining step ETAs and
  stored/denormalized on the task for list display.
- Due dates are computed server-side in `createTask` + `transitionTask` (single source of truth).

**Backend**:
- `backend/src/controllers/tasks.controller.js` (`createTask`, `transitionTask` stamp `startedAt`/`dueAt`/`onTime`).

---

### E13-S03 — "Running Late" Visibility (My Tasks, Matters, Dashboard) [Phase 1]

**Priority**: P1 | **Complexity**: M | **Linked spec story**: US-9, US-10 | **Dependencies**: E13-S02

> **✅ BUILT (2026-06-14).** Shared `lib/dueDate.ts` (`dueInfo` → tone/label/days + `DUE_BADGE_CLASS`)
> drives all surfaces. My Tasks work grid: sortable **Due** column (overdue sorts to top; untracked
> last) + due badge on mobile cards (`my-steps` now returns the active step's `dueAt`). Matters grid:
> a **Due** column (staff only — clients don't see an internal SLA) off `matterDueAt`. Dashboard
> `MyWorkWidget`: an "Overdue — waiting on you" section mirroring the urgent one. All lateness derived
> client-side from `dueAt`/`matterDueAt` vs now — no extra backend calls.

**Rationale**: Computed due dates are only useful if late work is visible where staff already look.

**Acceptance Criteria**:
- My Tasks gains a **Due / lateness** column (sortable): "Overdue by Nd", "Due today", "Nd left". Overdue
  rows are visually flagged (like urgent).
- The Matters grid shows a due/late indicator; the staff dashboard widget gains an "Overdue — waiting on
  you" section (mirrors the urgent widget).
- Lateness is derived from `dueAt` vs now on the client; no extra backend calls (data already on the row).

**Frontend**:
- `Portal/src/pages/tasks/MyTasksPage.tsx`, `TasksPage.tsx`, `components/dashboard/MyWorkWidget.tsx`.

---

### E13-S04 — SLA / Delay Report [Phase 2]

**Priority**: P2 | **Complexity**: M | **Linked spec story**: US-9 | **Dependencies**: E13-S02, E08-S02

> **✅ BUILT (2026-06-21).** `GET /api/reports/sla` (admin/manager) aggregates lateness across all
> in-flight matters from server-stamped per-step `dueAt`/`onTime` (E13-S02 — never recomputed):
> `breaches[]` = every ACTIVE step that is overdue or at-risk (within an `atRiskDays` window) with
> service / phase / assignee / breach-age; plus `onTimeByService` and `onTimeByPhase` completion-rate
> summaries. Portal: `SlaReport.tsx` (`/reports/sla`) — summary chips, an at-risk-window control, a
> searchable DataGrid (rows link to the matter), and on-time-rate bars; linked from the Reports hub.
> e2e: `Portal/e2e/sla-report.spec.ts` (page + aggregation contract + client 403/route gating).

**Rationale**: Management needs an aggregate view of where matters are slipping (which service, which
phase, which assignee) — the reporting counterpart to E08-S02 (Workload/Delay).

**Acceptance Criteria**:
- A report lists overdue/at-risk steps across all matters with filters (service, phase, assignee, age of
  breach) and sortable lateness, reusing the shared DataGrid; rows link to the matter.
- On-time-completion rate per service/phase is summarized.

**Frontend/Backend**:
- `backend/src/controllers/reports.controller.js` (SLA aggregation), `Portal/src/pages/reports/` (new report).

---

### E13-S05 — SLA Breach Notifications [Phase 2]

**Priority**: P2 | **Complexity**: M | **Linked spec story**: US-9 | **Dependencies**: E13-S02, E-07

**Rationale**: Proactive alerting when a step is overdue (or approaching its due date) so work is chased
before it breaches — depends on the notification/email subsystem (E-07).

**Acceptance Criteria**:
- A scheduled check flags steps past `dueAt` (and optionally approaching it) and notifies the step
  assignee + matter owner via the E-07 in-app/email channels.
- Configurable thresholds (e.g. notify at due, +1 day, +3 days); de-duplicated so one breach doesn't spam.

**Backend**:
- Scheduled job + `EFFECT_HANDLERS` (NOTIFY/SEND_EMAIL) once E-07 lands.

---

## E-14 — Matter Detail UX — Collapsible/Resizable Panels & Activity History

**Goal**: Give staff more usable horizontal space and a less noisy activity feed on the matter detail screen. The three-column layout (Stages rail | content | Activity) stays, but each rail becomes collapsible and user-resizable, and the Activity feed defaults to the current step with older steps behind an expander. The header is compacted (Back moved into it, destructive actions behind a ⋮ menu) to reclaim vertical space, and tables across the app wrap/resize instead of overflowing.

**Source**: GitHub #72 (remove/expand — reinterpreted as *collapsible + resizable* per stakeholder decision, keeping Stages), #73 (activity history), #88 (table column overflow).

---

### E14-S01 — Collapsible & Resizable Matter Panels [Phase 2]

**Priority**: P2 | **Complexity**: M | **Linked spec story**: US-2 | **Dependencies**: E11-S08

**Rationale**: Stakeholder rejected outright removal of the Stages rail (#72). The real pain is fixed-width panels that waste/limit space. Instead: keep Stages, Activity, and the app's left navigation, but let the user collapse each and drag to resize — persisted so the layout sticks.

**Acceptance Criteria**:
- On the matter detail screen ([TaskDetailPage.tsx](../../Portal/src/pages/tasks/TaskDetailPage.tsx)), the **Stages rail** and the **Activity rail** each have a collapse/expand toggle. Collapsed rails free their width for the content column.
- Both rails are **drag-resizable** via a divider handle; the content column reflows. Widths are clamped to sane min/max.
- The app's **left navigation** (sidebar) is collapsible (icon-rail) as well.
- Collapsed/expanded state and rail widths **persist per user** (localStorage) across reloads.
- Mobile/`lg` fallbacks (existing MobileStagePicker, inline Activity) continue to work; resize/collapse affordances are desktop-only (`xl`).
- No change to workflow navigation or data — purely presentational.

**Header compaction (added — #72 follow-up):**
- "Back to Matters" moves **into the page header** (via a `PageShell` `back` slot) instead of a separate row that pushed content down, removing the large empty band above the tabs.
- Destructive admin actions (**Archive**, **Stop workflow**) collapse into a header **⋮ actions menu** instead of full-width buttons.
- Page-header vertical spacing tightened.

**e2e**: `matter-layout.spec.ts` (rails collapse/persist, sidebar icon-rail), `stop-workflow.spec.ts` (⋮ menu offers Archive + Stop on active matters).

**Frontend screens/components**:
- `Portal/src/pages/tasks/TaskDetailPage.tsx` (rails, header, `MatterActionsMenu`), `PageShell.tsx` (`back` slot), sidebar component, `useResizablePanels` (`useRail`) hook.

---

### E14-S02 — Activity Feed: Current Step by Default + "Show Previous Steps" [Phase 2]

**Priority**: P2 | **Complexity**: M | **Linked spec story**: US-2 | **Dependencies**: E14-S01

**Rationale** (#73): The Activity feed shows the whole history at once, which is noisy. Default to just the current step's activity, with older steps behind an expander.

**Acceptance Criteria**:
- The Activity panel shows only events for the **most recent / current workflow step** by default.
- A **"Show Previous Steps"** control expands to reveal earlier steps' activity, grouped by step.
- Long comments **wrap** fully (no overflow/overlap) and **preserve line breaks/whitespace** (e.g. `whitespace-pre-wrap`).
- Multiple comments on the same step render in **chronological order**.
- Applies to both internal and client activity views (client sees only client-visible events, unchanged).

**e2e**: `matter-layout.spec.ts` (`#73` Activity defaults to current step + "Show previous steps" expander).

**Frontend screens/components**:
- `Portal/src/pages/tasks/TaskDetailPage.tsx` (ActivityFeed / Section rendering).

> **Follow-up (2026-07-11).** The client clarified the default was too narrow: hiding the *immediately-previous* step's activity by default (e.g. current = Step 23, but Step 22's "Documents requested / Reminder sent / Awaiting response" were hidden until expanding) still caused confusion. **Default now shows the CURRENT step's activity PLUS the immediately-PREVIOUS step's** — only step N-2 and earlier hide behind "Show previous steps". "Previous" is resolved from the ordered DEFINITION sequence (not `stepNumber − 1`, which can skip over gaps — #66). e2e: a new `matter-layout.spec.ts` case leaves distinct remarks on two consecutive plain steps and asserts the immediately-previous one is visible by default while the one before it is not (until expanded).

---

### E14-S03 — Table Column Overflow: Wrap + User-Resizable Columns [Phase 2]

**Priority**: P2 | **Complexity**: S | **Linked spec story**: US-2 | **Dependencies**: E08-S06

**Rationale** (#88): Across the app, table cell text overflowed into neighbouring columns (e.g. an email overlapping the service name, `pending_admin_approval` overlapping priority), making grids unreadable.

**Acceptance Criteria**:
- Cell content **wraps** (`break-words`) inside its column instead of spilling into adjacent columns; any legacy `truncate` styling is neutralised to wrap.
- Columns are **user-resizable** by dragging the header edge; the handle is exposed as `role="separator"` / `aria-label="Resize column"`.
- Adjusted widths **persist across reloads** per table (localStorage, keyed by a `tableId`).
- Fixed once in the shared **DataGrid** so **every** table benefits (all report grids + Tasks / My Tasks / Users).

**e2e**: `master-sheet.spec.ts` (`#88` columns resizable + width persists).

**Frontend screens/components**:
- `Portal/src/components/common/DataGrid.tsx` (wrap + resize + `columnSizing` persistence); `tableId` wired into all report and task grids.

---

### E14-S04 — Archive Available for Completed Matters [Phase 2]

**Priority**: P3 | **Complexity**: XS | **Linked spec story**: US-2 | **Dependencies**: E14-S01

**Rationale**: The header ⋮ actions menu was gated to `active`/`pending` matters, so a **completed** matter had no way to be archived even though the backend already permits archiving from any non-archived status.

**Acceptance Criteria**:
- The ⋮ actions menu is available on **completed** matters (admin-only) and offers **Archive**.
- **Stop workflow** is **not** offered on completed matters (a finished workflow can't be stopped).
- Archiving a completed matter transitions it to `archived` (backend unchanged; it already allowed this).

**e2e**: `stop-workflow.spec.ts` (completed matter can be archived; ⋮ offers Archive but not Stop).

**Frontend screens/components**:
- `Portal/src/pages/tasks/TaskDetailPage.tsx` (`MatterActionsMenu` `canStop` flag + status gate).

---

### E14-S05 — Stopped Matters Are Frozen: Restart Is Admin-Only [Phase 2]

**Priority**: P1 | **Complexity**: S | **Linked spec story**: US-2 | **Dependencies**: E14-S01

**Rationale** (#89): When an admin **stops** a workflow it becomes `cancelled`. Restart is already admin-only (`restartTask`), but the **transition endpoint had no status guard** — so any staff member (e.g. a manager) could complete a step on a cancelled matter, which silently **re-activated** it, bypassing the admin-only restart. Stopped work must stay stopped until an admin explicitly restarts it.

**Acceptance Criteria**:
- A `cancelled` (admin-stopped) matter **cannot be advanced** by anyone via `POST /api/tasks/:id/transition` — the backend rejects it (`409 MATTER_NOT_ACTIVE`, message "This matter was stopped. Only an admin can restart it.").
- The same freeze applies to other terminal states (`completed`, `rejected`, `archived`).
- The **only** way to reactivate a cancelled matter remains the admin-only restart (`restartTask`), unchanged.
- **UI**: the current-step action panel (Complete Step / approve / etc.) is **not shown** on a non-advanceable matter (only `active`/`pending` show it), so a non-admin never sees a way to move a stopped matter forward.

**e2e**: `stop-workflow.spec.ts` (a stopped matter can't be advanced by a manager — API 409 + no Complete Step control; only an admin can restart).

**Backend/Frontend**:
- `backend/src/controllers/tasks.controller.js` (`transitionTask` terminal-status guard).
- `Portal/src/pages/tasks/TaskDetailPage.tsx` (`isAdvanceable` gate on the step hero panel).

---

### E14-S06 — Admin-Approval Steps: Client-Hidden, Admin-Only Action [Phase 2]

**Priority**: P1 | **Complexity**: M | **Linked spec story**: US-13 | **Dependencies**: E11-S02, E12-S01

**Rationale** (#90): Steps that require **admin approval** were exposed to the client (visible + a working Approve button) and completable by non-admin staff. An admin-approval step must be an internal control: the client should never see or act on it, and only an **admin** may approve/complete it — a **manager can view but not act**.

**Model** (chosen: reuse assignee = admin): a step is an "admin-approval step" when its **active step's `assignedRole === 'admin'`** (declared on the definition step / phase, stamped onto the step at matter creation). No new step type or schema migration.

**Acceptance Criteria**:
- **Client-hidden**: an admin-approval step is excluded from the client projection — the client never sees it in the step list, progress tracker, or as an actionable step (regardless of any `CLIENT_APPROVE` transition it carries).
- **Admin-only action**: completion/approval events on an admin-approval step are accepted **only** from `role === 'admin'`. A manager, team member, or client is rejected (`403 ADMIN_APPROVAL_REQUIRED`), including the client-approve path — so a client can't approve it even via the API.
- **Manager view-only**: a manager can open the matter and SEE the admin-approval step, but the UI shows no approve/complete control for them.
- Existing non-admin steps are unaffected (team/client/govt behaviour unchanged).

**e2e**: `step-execution.spec.ts` / a dedicated case — a client cannot see or approve an admin-approval step (API 403 + not in client projection); a manager sees it but has no action (API 403); an admin can complete it.

**Backend/Frontend**:
- `backend/src/controllers/tasks.controller.js` (`transitionTask` admin-approval gate; client projection excludes `assignedRole === 'admin'` steps).
- `Portal/src/pages/tasks/TaskDetailPage.tsx` (hide the action for non-admins on an admin-approval step).

---

## E-15 — Document Naming & Step Configuration (Visibility, Status/Notes, Descriptions)

**Goal**: Make workflow steps configurable and legible: uploaded documents show their type name; the client-visibility toggle actually works; each step carries **independent** internal vs client status/notes; and admins can attach multiple audience-tagged descriptions per step.

**Source**: GitHub #79, #80, #81, #82.

---

### E15-S01 — Display Document Type Name for Uploads [Phase 2]

**Priority**: P2 | **Complexity**: S | **Linked spec story**: US-5 | **Dependencies**: E05-S01

**Rationale** (#79): Uploaded documents render generically; users can't tell a PAN from an Address Proof at a glance.

**Acceptance Criteria**:
- Each uploaded document displays its selected **document type name** (e.g. PAN, TAN, Address Proof) in the document card.
- The name is shown consistently in **both internal and client** document views.
- Documents without a captured type fall back gracefully to the file name.

**Backend/Frontend**:
- `documents.controller.js` (persist/return `docType`/`label`), `DocumentsPanel.tsx`, upload flow captures the type.

---

### E15-S02 — Fix Client-Visible Toggle in Step Configuration [Phase 2]

**Priority**: P1 | **Complexity**: S | **Linked spec story**: US-6 | **Dependencies**: E10-S01, E12-S01

**Rationale** (#80): The "Client Visible" checkbox on a step does not correctly gate client visibility.

**Acceptance Criteria**:
- Checking **Client Visible** on a step makes that step (and its client-facing content) visible to the client; unchecking hides it.
- Enforced consistently on **both** the client view and the internal view, and on the **backend** projection that filters client-facing data (not UI-only).
- Existing workflow execution logic is unaffected.

**Backend/Frontend**:
- Workflow definition step flag (`clientVisible`), `projectTaskForClient`/client projection in `tasks.controller.js`, Workflow Editor step settings.

> **Re-verified (2026-07-11).** The client reported it was "Not working" again after the original fix. Re-audited the full path end to end and added a genuine UI-DRIVEN e2e test (`step-settings.spec.ts`) that clicks the actual checkbox in the browser, saves, and checks the client's rendered step list (not just an API call) — it passes: unchecking hides the step for the client, re-checking restores it, both observed through real navigation. No code defect found in this pass; the mechanism works correctly today. If it's still reported as broken, the next step is a live screen-share/repro session, since static analysis and automated UI testing both show correct behavior.

---

### E15-S03 — Independent Internal vs Client Status & Notes per Step [Phase 2]

**Priority**: P2 | **Complexity**: L | **Linked spec story**: US-6 | **Dependencies**: E15-S02

**Rationale** (#81): Steps need two independent presentation channels — what internal staff see vs what the client sees — without one leaking into the other.

**Acceptance Criteria**:
- Step settings expose two sections: **Internal View** (Internal Status, Internal Notes) and **Client View** (Client Status, Client Note/Description), gated behind the Client-Visible toggle for the client side.
- Internal users see only internal status/notes + internal actions (assignee, priority, uploads); clients see only client status/notes + client actions.
- The two are **fully independent** — editing one never changes the other.
- **Admin-only** to modify; admin can add/edit/clear either.
- **Existing workflows migrate automatically** with no data loss (new fields default empty/derived from current values).

**Backend/Frontend**:
- Workflow definition step schema (`internalStatus`, `internalNotes`, `clientStatus`, `clientNote`), migration on load/seed, Workflow Editor, TaskDetailPage rendering split by audience.

> **Bug found & fixed (2026-07-11).** The client reported the configured status "isn't showing/updating" for the active step, with a screenshot of the editor's Client Status field. Root cause: `statusFor()`/`descFor()` (the audience-aware readers) were only ever passed to `ExpandableStepRow` — the collapsed step-LIST row — and never to `StepHeroPanel`, the current-step ACTION card that's the primary place a user looks and acts. So a step's configured status/description had no visible home while it was the active step; it only appeared once the step was completed and the list row was inspected. Fixed by threading `statusLabel`/`description` into `StepHeroPanel` too: the status renders as a badge next to "Current step · N", and the audience-tagged description(s) replace the legacy raw `step.description` (falling back to it). Same fix serves #82 (multi-description) since `descFor()` already joins all of the viewer-audience descriptions. e2e: `hero-status-notes.spec.ts` proves staff see internal-only content and clients see client-only content, scoped to the hero panel specifically (not just the list row).

---

### E15-S04 — Multiple Audience-Tagged Descriptions per Step [Phase 2]

**Priority**: P3 | **Complexity**: M | **Linked spec story**: US-6 | **Dependencies**: E15-S03

**Rationale** (#82): One description per step is limiting; admins want several, each targeted at internal or client audiences.

**Acceptance Criteria**:
- Step settings provide **Add Description**; admin can add unlimited descriptions, **edit**, and **delete** each.
- Each description is tagged **Internal** or **Client**; only descriptions for the viewer's audience render.
- Admin-only to modify; existing single descriptions migrate into the list.

**Backend/Frontend**:
- Step schema `descriptions: [{ id, audience, text }]`, Workflow Editor list editor, TaskDetailPage renders the audience-filtered set.

> **Bug fixed alongside #81 (2026-07-11)**: multi-descriptions had the same hero-panel gap — see the #81 follow-up above (same fix, `descFor()` now reaches `StepHeroPanel`).
>
> **Separate, NOT-YET-IMPLEMENTED ask surfaced in the client's latest comment**: configurable **structured comment/input fields** per step (e.g. "Comment 1: Company Name", "Comment 2: Business Object") — distinct from admin-authored *description* text, this is a mini-form the step's actor fills in. Out of scope for this fix; needs its own design (field definitions on the step schema, an input UI, and where the entered values are stored/surfaced). Flagged for a follow-up issue rather than silently reinterpreted as "more descriptions."

---

## E-16 — Comment Draft Autosave

### E16-S01 — Save Draft / Autosave for Comment Boxes (Internal & Client) [Phase 2]

**Priority**: P3 | **Complexity**: M | **Linked spec story**: US-2, US-5 | **Dependencies**: E03-S06

**Rationale** (#83): Users lose in-progress comments when they navigate away. Autosave/Save-Draft protects the work.

**Acceptance Criteria**:
- Every comment box (internal and client) autosaves the draft as the user types (debounced) — or offers an explicit **Save Draft**.
- The draft **restores automatically** when the same box is reopened.
- A status line shows **"Draft saved" / "Last saved: N minutes ago"**, distinct from a submitted comment.
- Users can keep editing a restored draft; on **successful submit** the draft is **cleared**.
- Drafts are scoped **per step and per user** (no cross-user/cross-step leakage); only the owner can access their draft.
- Client-side persistence (localStorage keyed by `taskId:stepNumber:uid`) is acceptable for Phase 2; no backend endpoint required.

**e2e**: `interactions.spec.ts` (comment draft autosaves, restores on reopen, clears on submit) — see coverage audit.

**Frontend**:
- A `useCommentDraft(taskId, stepNumber, uid)` hook + wiring into the comment inputs in `TaskDetailPage.tsx` (and any client comment box).

---

## E-17 — Professional Assignment on Matters

### E17-S01 — "Professional" Field on Create Matter + Filters/Reports [Phase 2]

**Priority**: P2 | **Complexity**: M | **Linked spec story**: US-3, US-7 | **Dependencies**: E11-S01

**Rationale** (#85): Matters should record the responsible **professional**; used for filtering and reporting.

**Acceptance Criteria**:
- Create Matter/Service form has an **optional Professional dropdown** listing active professionals (searchable/filterable).
- Existing matters work without a professional (nullable, no forced backfill).
- Matters can be **filtered/searched by professional**; the field appears in **Excel exports and relevant reports**.
- The assigned member can **update** the professional after creation.

**Backend/Frontend**:
- `task.professionalUid`/`professionalName`, `taskCreateSchema` + patch path, `CreateMatterModal.tsx`, matter list filter, report columns.

---

## E-18 — Centralized Reporting Module

**Goal** (#84): One centralized reporting system. The existing **Master Sheet** is the primary Admin report; standalone reports are generated from the same underlying task/payment/client data with **Excel (.xlsx) download, search, filter, sort, and real-time auto-update**. Clients see only their own reports.

**Cross-cutting requirements (all reports)**:
- **Excel (.xlsx)** export (not just CSV) — use a spreadsheet lib (e.g. `exceljs`/`xlsx`) server-side or a client-side generator.
- **Search**, **column filter**, **column sort**.
- **Real-time auto-update** — reports refetch on an interval / React Query `refetchInterval` (or invalidate on relevant mutations).
- Role-gated: admin/manager for internal reports; clients restricted to their own (E18-S05).

---

### E18-S01 — Master Sheet Expansion + .xlsx/Search/Filter/Sort/Auto-update [Phase 2]

**Priority**: P1 | **Complexity**: L | **Linked spec story**: US-7 | **Dependencies**: E08-S05, E17-S01

**Rationale**: The Master Sheet becomes the central report. Add the missing operational/payment/workflow fields and the cross-cutting capabilities.

**Acceptance Criteria**:
- Master Sheet adds columns: **Task Creation Date, Current Workflow Step, Pending Reason, Pending From (Client/LT/Department), Priority Level, Assigned Team Member, Approval Pending From (Admin/Manager/Client), Total Fees, Payment Mode, Referral Source, Professional**.
- **.xlsx download** (replaces/augments CSV), plus **search + per-column filter + sort**.
- **Auto-update** so the sheet reflects live changes without a manual reload.

**Backend/Frontend**:
- `GET /api/reports/master-sheet` (+ `format=xlsx`), `MasterSheetReport.tsx`.

---

### E18-S02 — Payment & Revenue Reports [Phase 2]

**Priority**: P2 | **Complexity**: L | **Linked spec story**: US-7 | **Dependencies**: E06-S01, E18-S01

**Acceptance Criteria** — implements #84 reports: **1 Payment Status** (Fully/Partly/Unpaid; client, service, total fees, received, due, status, mode, date), **10 Revenue Analytics** (monthly, service-wise, team-wise revenue; outstanding/collected/pending), **14 Paid Work**, **15 Partly Paid Work**, **16 Unpaid Work**. All with .xlsx/search/filter/sort/auto-update.

---

### E18-S03 — Client & Service Reports [Phase 2]

**Priority**: P2 | **Complexity**: L | **Linked spec story**: US-7 | **Dependencies**: E09-S02, E18-S01

**Acceptance Criteria** — #84 reports: **2 Client-wise Work** (per client: total services, completed/pending/delayed, service-wise status, payment status, assignee), **3 Service-wise Client** (clients per service; current status, payment status, assignee), **7 Referred Client** (referred by, services taken, revenue, status), **8 Inactive Client** (last service date, last login, follow-up, assigned manager).

---

### E18-S04 — Operational Reports (Team, Priority, Pending-Reason, Approval, Storage) [Phase 2]

**Priority**: P2 | **Complexity**: L | **Linked spec story**: US-7 | **Dependencies**: E13-S02, E18-S01

**Acceptance Criteria** — #84 reports: **4 Team Performance** (assigned/completed/pending/delayed, avg completion time, pending-approval), **5 Priority Task** (High/Medium/Normal; pending since, status), **6 Reason-based Pending** (Client/LT/Department/Signature/Approval/Payment/Document; current step, pending since, responsible person), **9 Approval Pending** (Admin/Manager/Client approval type, pending since, assignee), **11 Storage Usage** (total/remaining, per-client document storage, alert level).

---

### E18-S05 — Client-Facing Reports [Phase 2]

**Priority**: P2 | **Complexity**: M | **Linked spec story**: US-7 | **Dependencies**: E12-S01, E18-S01

**Acceptance Criteria** — #84 reports **12/13/14/15/16** scoped to the logged-in client only: **All Work** (service, status, pending action, timeline, assigned team), **Paid Work** (paid amount, payment date, invoice number), **Partly Paid**, **Unpaid**. Client can only ever see their own services/payments; enforced server-side.

---

### E18-S06 — Reporting Infrastructure: .xlsx Export + Table Toolkit [Phase 2]

**Priority**: P1 | **Complexity**: M | **Linked spec story**: US-7 | **Dependencies**: E08-S01

**Rationale**: Shared plumbing so every report gets export/search/filter/sort/auto-update consistently instead of duplicating logic.

**Acceptance Criteria**:
- A reusable **ReportTable** component (search box, column filters, sortable headers, loading/empty states) and an **.xlsx export** helper.
- A shared **auto-update** convention (React Query `refetchInterval`).
- Backend report helpers to centralize pending-reason / pending-from / approval-pending-from derivations reused across E18 reports.

---

### E18-S07 — Multiple-Criteria Report Filtering [Phase 2]

**Priority**: P2 | **Complexity**: S | **Linked spec story**: US-7 | **Dependencies**: E18-S01, E18-S06

**Rationale** (#91): The report search allowed only a single free-text value at a time, so a user couldn't narrow by more than one condition (e.g. "this client AND active only"). Users need to combine criteria — Client + Status, Client + Service, Service + Status — and see results satisfying **all** of them.

**Design**: reuse the existing structured `ReportFilters` (already AND-combined server-side via chained Firestore `.where()`), surfaced through the shared `ReportFiltersBar`. Structured criteria (**Status**, **Service Type**, **Payment**, date range) combine with logical **AND**; the existing free-text **search box** composes on top (client-name / assignee / reason contains-search within the filtered set). No backend change — the query params were already supported.

**Acceptance Criteria**:
- The report filter bar exposes **Status**, **Service Type**, and **Payment** selectors (plus the existing date range), all applied together as **AND**.
- Combining criteria works: e.g. Status=Active + Service=Incorporation returns only active incorporation matters; adding a client name in the search box narrows further.
- **Clear** resets every criterion at once; it is disabled when no filter is set.
- Reports whose status is intrinsic (Completed, Pending) omit the redundant Status selector but keep Service/Payment/date.
- Applied consistently across the reports that use the bar (Master Sheet, All / Pending / Completed Matters). No duplicate per-report filter controls remain.
- Purely a filtering/UX change — report data, columns and export are unchanged.

**e2e**: `reports.spec.ts` — selecting Status + Service together returns only rows matching BOTH; the free-text box further narrows; Clear resets.

**Frontend**:
- `Portal/src/components/reports/ReportFiltersBar.tsx` (built-in Status/Service/Payment criteria + `criteria` prop), `MasterSheetReport.tsx` / `AllTasksReport.tsx` / `PendingTasksReport.tsx` / `CompletedTasksReport.tsx` (drop duplicated inline filters).

> **Extended app-wide (2026-07-11).** The client called this out as valuable enough to apply everywhere, not just the report grids. Rolled the same Status/Service/Payment (AND-combined, composing with search) pattern onto the **Matters / My Services grid** (`TasksPage.tsx`) — previously free-text search only, now the single highest-traffic table in the app has structured filtering too. Implemented client-side (the grid already holds the full role-scoped row set from `getTasks()`, so no new backend endpoint was needed): Service options are derived from the tasks' own `serviceName` values (not the full catalog — `workflowType` is a definition id, not the catalog's `serviceKey`, so filtering against catalog keys wouldn't have matched); Payment is staff-only (not meaningful framed as "My Services" for a client). `Users` (role tabs + search) and `MyTasksPage` (already scoped to "mine") were reviewed and left as-is — they already have adequate multi-criteria filtering for their scope. e2e: `matters.spec.ts` proves Status + Payment combine with AND and Clear resets both.
>
> **Excel-style per-COLUMN filters, all DataGrid tables (2026-07-12).** Client escalated #91 to a grid-level capability: every table should filter like Excel — per column. Built ONCE in the shared `DataGrid`: a funnel button in each column header opens a popover listing that column's **distinct values as checkboxes** (computed from TanStack's faceted row model, i.e. respecting the other columns' active filters — exactly Excel's behaviour), with a type-to-narrow box and Select all / Clear. Ticked sets AND across columns and compose with the global search + the structured toolbar filters. Default ON for every DataGrid table (9 report grids + Matters/My Services + My Tasks); columns opt out via `columnDef.meta.disableColumnFilter` — applied to timestamp/day-count columns (Updated/Created/Due) where every value is unique and a picker is useless; display-only action columns are excluded automatically (no accessor). When a filter excludes every row the grid keeps the header row + a "no rows match / Clear filters" note (never a dead-end that hides the funnels). **Follow-up:** `UsersPage` uses its own bespoke table (not DataGrid) — migrating it to DataGrid to inherit the funnels is deferred (higher-risk refactor; the page already has role tabs + search). e2e: `matters.spec.ts` — tick a non-matching Status value → row hidden; Clear → row returns.
>
> **Numeric columns → RANGE filters (feedback, 2026-07-12).** Checkboxes over amounts (₹0 / ₹5000 / ₹7000…) are useless. A column whose (non-blank) faceted values are ALL numeric now renders **Min–Max inputs** instead of the value picker; the shared filter fn handles both shapes (`string[]` set vs `{min,max}` range; a range excludes blank/non-numeric cells). e2e: `master-sheet.spec.ts` — Min above every fee hides the row; Clear restores.
>
> **#101 edge regression (feedback, 2026-07-12).** After the border-solid fix, the owner edge STILL only painted on the FIRST step row: the list container's `divide-hairline-soft` sets the border-color **shorthand** on every child except the first (`> :not([hidden]) ~ :not([hidden])`, higher specificity), silently overriding `border-left-color` on rows 2+. Replaced the border with an **absolutely-positioned background bar** (`w-1 bg-teal/amber/violet-500`) that no border utility can touch. e2e: `matter-layout.spec.ts` asserts EVERY step row (not just the first) contains a colour bar.

---

## APPENDIX A — Infrastructure & Build System (Updated 2026-06-01)

### NPM Run Commands Standardization

**Motivation**: Standardize build and run commands across all services (backend, Portal, Frontend) to simplify developer workflow and CI/CD pipelines.

**Implementation**:
- Created root `package.json` with unified commands
- Updated `backend/package.json`, `Portal/package.json`, `Frontend/package.json` with service-specific scripts

**Commands Available**:

| Command | Service(s) | Port(s) | Working Directory |
|---------|-----------|--------|-------------------|
| `npm run build:all` | All | — | Root |
| `npm run dev:all` | All (parallel) | 5001, 5173, 5174 | Root |
| `npm run start:backend` | Backend only | 5001 | Root (cd backend) |
| `npm run dev:backend` | Backend only | 5001 | Root (cd backend) |
| `npm run dev:portal` | Portal only | 5173 | Root (cd Portal) |
| `npm run build:portal` | Portal only | — | Root (cd Portal) |
| `npm run dev:frontend` | Frontend only | 5174 | Root (cd Frontend) |
| `npm run build:frontend` | Frontend only | — | Root (cd Frontend) |

**Usage**:
```bash
# Start all services in parallel
npm run dev:all

# Start individual services
npm run start:backend
npm run dev:portal
npm run dev:frontend

# Build all
npm run build:all
```

**Backend Ports**: 5001 (HTTP, Node.js/Express)  
**Portal Ports**: 5173 (Vite dev server)  
**Frontend Ports**: 5174 (Vite dev server)

---

### Copilot Instructions Update (2026-06-01)

**File**: `.github/copilot-instructions.md`

**Changes**:
1. **Added "DO NOT auto-test" rule**:
   - ⚠️ "DO NOT automatically run Playwright tests or open browsers unless explicitly asked by user"
   - Only test when user explicitly requests: "test in playwright" or "verify in browser"
   - Default behavior: Code changes only, no automatic testing

2. **Added BUILD & RUN COMMANDS table**:
   - Comprehensive reference for all services and their ports
   - Emphasized: "ALWAYS use these commands instead of manual invocations"
   - Lists backend on 5001, Portal on 5173, Frontend on 5174
   - Combined commands for running all services in parallel

3. **Updated methodology**:
   - Build commands now reference npm run scripts (not raw vite/node commands)
   - Copilot instructed to default to documentation-first approach
   - Clear enforcement: "Always use npm run commands defined in package.json"

**Effect**: Copilot will no longer:
- Auto-test with Playwright unless explicitly requested
- Run bare `npm run dev` or `vite` commands without referencing the standardized npm scripts
- Bypass the centralized build/run command table

**Benefit**: Ensures consistent developer experience and CI/CD compatibility across the team.

---

## Sprint Plan — Phase 1 (4 × 2-week Sprints)

### Sprint 1 — Foundation (weeks 1–2)

**Goal**: The portal boots, users can log in, and the app shell + role routing work. Developers can reach any screen.

| Story | Title | Priority | Complexity |
|---|---|---|---|
| E01-S01 | Portal Project Scaffold | P1 | M |
| E01-S02 | Firebase Auth Integration & Auth Store | P1 | M |
| E01-S03 | Role-Based Routing & Protected Routes | P1 | M |
| E01-S04 | App Shell, Sidebar & Layout | P1 | M |
| E09-S01 | Create & Edit Team Members | P2 | M |
| E09-S02 | Create & Edit Clients | P1 | M |
| E09-S03 | Role Management & Custom Claims | P2 | S |
| E09-S05 | Multi-Email Login Resolution | P1 | M |

**Sprint goal checkpoints**: By end of Sprint 1, an admin can log in, see the dashboard, create a team member, create a client, and log in as that client to see an empty task list.

---

### Sprint 2 — Core Workflow Engine + Task Creation (weeks 3–4)

**Goal**: The Company Incorporation workflow machine is live; tasks can be created and transition through steps; the team member queue works.

| Story | Title | Priority | Complexity |
|---|---|---|---|
| E02-S01 | XState Machine — Company Incorporation | P1 | XL |
| E02-S02 | Backend Transition Endpoint | P1 | L |
| E02-S03 | Task Creation Endpoint (Config Layer Merge) | P1 | L |
| E02-S04 | Conditional Branching & Resubmission Loop | P2 | M |
| E03-S01 | Team Member Step Queue | P1 | M |
| E03-S02 | Step Execution (Complete, Query, Reassign) | P1 | L |
| E03-S03 | Admin/Manager Task Creation UI | P1 | M |
| E03-S04 | Task Approval Workflow | P1 | M |
| E10-S01 | Workflow Settings Screen | P1 | M |
| E10-S02 | Config Sync Warning | P1 | S |

**Sprint goal checkpoints**: By end of Sprint 2, an admin can create a Company Incorporation task for a client, the team member queue shows the task, and a team member can mark step 3 (work assignment) complete — causing step 4 to become active.

---

### Sprint 3 — Client View + Document Cycle + Payments (weeks 5–6)

**Goal**: Clients can track their tasks end-to-end; documents can be uploaded, reviewed, and approved; payments are recorded and gates enforced.

| Story | Title | Priority | Complexity |
|---|---|---|---|
| E04-S01 | Client Task List | P1 | M |
| E04-S02 | Task Detail — Steps Tab | P1 | M |
| E04-S03 | Task Detail — Documents Tab | P1 | M |
| E04-S04 | Task Detail — Payments Tab | P1 | M |
| E05-S01 | Document Upload (Signed URL Flow) | P2 | L |
| E05-S02 | Document Review (Approve/Reject) | P2 | M |
| E05-S03 | Document Re-upload After Rejection | P2 | S |
| E06-S01 | Record Payment Form | P2 | M |
| E06-S02 | Payment Gate Enforcement & Admin Override | P2 | M |
| E06-S03 | Payment History View | P2 | S |
| E07-S01 | In-App Notification System | P2 | M |
| E07-S02 | Email Automation (Transactional) | P2 | L |

**Sprint goal checkpoints**: By end of Sprint 3, a client can log in, view their task at step 9 ("Send name draft to client"), upload a document, see it rejected with a remark, re-upload, see it approved, and see their payment history including a blinking gate on step 28.

---

### Sprint 4 — Reports + Notifications Polish + Config + QA (weeks 7–8)

**Goal**: Admin has full reporting visibility; all Phase 1 P3 stories are implemented; regression testing and production hardening.

| Story | Title | Priority | Complexity |
|---|---|---|---|
| E08-S01 | Report Shell + All Tasks, Completed, Pending | P2 | L |
| E03-S05 | Urgent Task Flagging | P3 | S |
| E08-S05 | Master Sheet & CSV Export | P2 | M |
| Phase 1 E2E regression | All P1 user flows tested end-to-end | — | — |
| Performance hardening | Task list < 2s; step transitions < 1s; Firestore indexes | — | M |
| Security audit | OWASP Top 10 check; signed URL TTL; Firestore rules review | — | M |
| Deployment | Firebase Hosting target `portal`; Cloud Run deploy; env config | — | M |

**Sprint goal checkpoints**: By end of Sprint 4, the full Company Incorporation workflow can be run end-to-end in staging; admin can view all-tasks and master-sheet reports; the portal is deployed to `portal.legalterminus.com`.

---

## Tech Debt & Hardening Backlog (Deferred — address after feature implementation)

These are non-feature engineering tasks captured during development. **Scheduled to be worked AFTER core feature implementation is complete** (per direction 2026-06-13).

### TD-01 — Firestore Indexing & Query Performance Optimization [Deferred]

**Priority**: P2 | **Complexity**: M | **Raised**: 2026-06-13

**Rationale**: The backend logs Firestore index warnings during development (composite-index-required / missing-index notices on report and list queries). Several report and list endpoints currently fetch whole collections and filter/sort in memory (e.g. `getContactLeadsReport` reads all `contactLeads` + all `users`; `listUsers` reads `users` and sorts in memory). This is acceptable at current data volume but will not scale.

**Acceptance Criteria**:
- Audit all Firestore queries across `backend/src/controllers/*` for: (a) missing composite indexes (capture the exact warnings), (b) full-collection reads that should be server-side filtered, (c) N+1 patterns.
- Add all required composite indexes to `firestore.indexes.json` (align with `architecture.md` §5.2 Indexing Strategy table); deploy via `firebase deploy --only firestore:indexes`.
  - **Known needed index (2026-06-13):** `users` collection `role ASC, createdAt DESC` — the role-filtered Users list currently sorts in memory specifically to avoid this missing composite index (it 500'd with `FAILED_PRECONDITION`). Once the index exists, move `listUsers` role-filter ordering back to Firestore.
- Replace in-memory filter/sort with indexed Firestore queries where data volume warrants it.
- For enrichment joins (leads↔users), evaluate denormalisation or a cached lookup vs. full-collection scan.
- Document final index set and any deliberate in-memory-by-design choices in `architecture.md` §5.2.
- No Firestore index warnings in backend logs for normal portal usage.

**Files likely touched**:
- `firestore.indexes.json`
- `backend/src/controllers/reports.controller.js`, `leads.controller.js`, `portalUsers.controller.js`
- `architecture.md` §5.2

---

### TD-02 — Backend Authorization Audit (all routes) [Deferred]

**Priority**: P1 (security) | **Complexity**: M | **Raised**: 2026-06-13

**Rationale**: During the user-API consolidation we found `/api/clients` and `/api/team-members` had **no auth middleware at all** (anyone could create/delete users). They're now fixed/removed, but the discovery means other route files may have the same gap. Every route that reads or mutates portal data must enforce `verifyToken` + an appropriate `requireRole`.

**Acceptance Criteria**:
- Audit every router in `backend/src/routes/*` — confirm each portal-data route has `verifyToken` and a correct `requireRole` per BMAD role matrix (architecture §3.x tables).
- Verify no authorization check anywhere reads role from request body/query/headers (must use `req.user.role` from the verified token only). (Confirmed clean for user routes 2026-06-13; extend to tasks/payments/notifications/workflows/contact.)
- Confirm public endpoints (e.g. `POST /api/contact` from the marketing site, `GET /api/auth/firebase-config`) are intentionally public and documented as such.
- Document the per-route auth matrix in `architecture.md`.

---

### TD-03 — Role Escalation Guard Tests [Deferred]

**Priority**: P2 (security) | **Complexity**: S | **Raised**: 2026-06-13

**Rationale**: The privilege-escalation guards (`canAssignRole` / `assignableRolesFor` in `backend/src/config/roles.js` and `Portal/src/lib/roles.ts`) prevent a manager from minting an admin/manager account. These are security-critical and currently have no automated coverage (no test framework is set up in the backend).

**Acceptance Criteria**:
- Establish a backend test setup (built-in `node:test`, or vitest/supertest — decide during the broader test-infra task).
- Unit-test `canAssignRole`/`assignableRolesFor`: manager → cannot assign admin/manager, can assign team_member/client; admin → any role.
- API-level: `POST /api/portal/users {role:'admin'}` as manager → 403; `PATCH /api/portal/users/:uid {role:'admin'}` as manager → 403; role field silently dropped for non-privileged edits.

---

### TD-04 — CORS Allowed-Origins Hardening [Critical]

**Priority**: P0 (security) | **Complexity**: S | **Raised**: 2026-06-13

**Rationale**: The CORS `allowedOrigins` list in `backend/src/server.js` uses unanchored / overly-broad regular expressions, so origins outside our control are accepted:
- `/legalterminus\.com$/` matches attacker-controlled domains like `https://evil-legalterminus.com` and `https://notlegalterminus.com` (no `.`/start-of-host boundary before `legalterminus`).
- `/\.firebaseapp\.com$/` and `/\.web\.app$/` match **any** project on those shared Firebase/Google hosting domains, not just ours.

Combined with `credentials: true`, a malicious origin that matches these patterns can make authenticated cross-origin requests with the user's credentials. This is a genuine cross-origin attack surface and should be treated as critical.

**Acceptance Criteria**:
- Anchor the primary domain to a host boundary, e.g. `/(^|\.)legalterminus\.com$/`, so only `legalterminus.com` and its subdomains match.
- Replace the broad `.firebaseapp.com` / `.web.app` patterns with our exact project hostnames (e.g. `https://<project-id>.web.app`, `https://<project-id>.firebaseapp.com`).
- Keep `localhost` / Capacitor origins only for non-production environments; gate them behind `NODE_ENV !== 'production'`.
- Add a regression note/test asserting `evil-legalterminus.com` and an unrelated `*.web.app` are rejected.

---

### TD-05 — Server-Side Price Catalog & Payment Amount Validation [Critical]

**Priority**: P0 (security/financial) | **Complexity**: L | **Raised**: 2026-06-13

**Rationale**: `POST /api/payment/initiate` trusts the client-supplied `amount` and signs it straight into the PayU request hash, so a user can pay an arbitrary amount (e.g. ₹1) for any plan. The proper fix is a server-authoritative price catalog: the backend looks up the price for `(source, planName)` and ignores the client `amount`.

This was **partially mitigated** on 2026-06-13 (auth + userId binding — see below), which closes pay-as-another-user and entitlement spoofing, but **NOT** amount tampering. Amount tampering remains open until this catalog exists.

**Blocker discovered**: prices are currently defined inline across ~71 frontend plan components, keyed by a `source` prop. Auditing them surfaced data-integrity problems that must be resolved before a catalog can be trusted:
- **Duplicate `source` keys with conflicting prices** — the same `source` maps to different plan sets/prices in two components, e.g. `trademark-application` (`TmarkPlans`: 1499/3499/7999 vs `TMApplicaPlanandPricing`: **1**/7499/24499), `professional-tax`, `dissolve-llp`, `trademark-renewal`, `trademark-hearing`, `trademark-opposition`, `proprietorship-to-opc`.
- **Suspicious values** — `TMApplicaPlanandPricing` has a plan priced at `₹1` (likely a test value left in prod).
- **`source` defined in a parent (breadcrumb) component, prices in a sibling** for: `proprietorship-to-company`, `director-partner`, `gst-returns`, `pf-registration`, `society-registration`, `trust-registration`.

**Acceptance Criteria**:
- Reconcile duplicate `source` keys to a single canonical plan set + price each (product decision required).
- Model the catalog in Firestore (extend `serviceCategories`, or a new `plans` collection) keyed by `source` → `{ planName → { price, label } }`.
- `/initiate` looks up price server-side by `(source, planName)`; reject if not found; ignore client `amount`.
- On the PayU callback, cross-check the verified `amount`/`productinfo` against the looked-up plan before granting entitlement.
- Migrate frontend plan components to read prices from the catalog API (price field only — no other content changes) so displayed and validated prices cannot diverge.

**Done so far (2026-06-13, partial)**:
- `/api/payment/initiate` now requires `verifyToken`; `userId` is derived from `req.user.uid`, not the request body.
- The PayU callback (`/redirect`) credits the hash-protected `udf1` (userId), `udf2` (planName) and `amount` from the verified PayU body rather than the unsigned query string.
- Frontend `ProCheckoutModal` sends the Firebase ID token and no longer sends `userId`.

---

### TD-06 — Sensitive PII Encryption / Masking (Aadhaar, PAN, GST) [Critical]

**Priority**: P0 (privacy/compliance) | **Complexity**: L | **Raised**: 2026-06-13

**Rationale**: User documents store `aadhaarNumber`, `panNumber`, and `gstNumber` as plaintext in the `users` Firestore collection (`portalUsers.controller.js`). Aadhaar in particular is sensitive personal data under India's DPDP Act; storing it unencrypted, queryable, and readable by every admin/manager is a compliance liability and would fail a privacy review.

**Acceptance Criteria**:
- Confirm each field is actually required; drop any that aren't (data minimization).
- Encrypt sensitive identifiers at rest with a KMS-managed key (Google Cloud KMS), or tokenize them; never store raw Aadhaar in a queryable field.
- Mask on read by default (e.g. `XXXX-XXXX-1234`); expose the full value only to a narrowly-scoped role and log every access (audit trail).
- Ensure the values are never written to logs (the structured logger already redacts common secret keys — extend the redact list to these fields).
- Document the data-handling policy in `architecture.md`.

---

### TD-07 — User-Delete Related-Data Cascade [Deferred]

**Priority**: P2 | **Complexity**: M | **Raised**: 2026-06-13

**Rationale**: Deleting a user (`DELETE /api/portal/users/:uid`) currently cleans up the user doc, the `users/{uid}/payments` subcollection, and the Auth account, and **blocks** the delete (`409`) if the user still has tasks (`clientUid` or `assignedTo`). The block is the safe interim choice, but it means an admin cannot remove a user with any task history without manual reassignment/closure, and other references aren't considered. A fuller policy is needed.

**Acceptance Criteria**:
- Decide and document the policy per reference type: tasks (block vs. reassign vs. soft-delete), task subcollections (steps/documents/payments), notifications, and any audit trail.
- Consider **soft-delete** (status = `deleted`/`deactivated`) instead of hard delete, so history is preserved and reports don't show ghosts — likely the better default for a compliance-sensitive app.
- If hard delete is kept, implement a transactional cascade (or a background cleanup job) so a partial failure can't orphan related data.
- Leads enrichment (`registeredUid`) re-derives at read time, so it needs no cleanup — confirm this stays true.
- Add tests for: delete blocked by tasks (409), payments subcollection removed, Auth-missing tolerated.

**Files likely touched**:
- `backend/src/controllers/portalUsers.controller.js` (`removeUser`), `backend/src/services/userService.js` (`deleteUser`)

---

### TD-08 — `steps` Collection-Group Index for Team-Member Routing [Deferred]

**Priority**: P2 | **Complexity**: S | **Raised**: 2026-06-14

**Rationale**: Team-member work routing (`listTasks`, `listMySteps`) resolves "matters where a step is assigned to me" via `db.collectionGroup('steps').where('assignedTo','==',uid)` (in `taskIdsWithStepAssignedTo`). This needs a **collection-group** index on `steps.assignedTo`, added to `firestore.indexes.json` (2026-06-14) but **not yet deployed**. Until deployed, the helper **degrades gracefully** (try/catch → logs a warning, returns empty), so team members still see matters assigned to them at the task level, but **step-only delegations won't surface**. Step-level assignment to a member whose matter isn't task-assigned silently won't route until the index is live.

**Acceptance Criteria**:
- Deploy the `steps` collection-group index (`assignedTo ASC, __name__ ASC`) via `npm run db:deploy-indexes` (needs Firebase CLI auth — user-run or CI token).
- Verify a team member with only a *step* (not matter) assigned to them sees that matter in both `/tasks` and `/my-tasks`.
- Confirm no `FAILED_PRECONDITION` warnings from `taskIdsWithStepAssignedTo` in backend logs.

**Files**: `firestore.indexes.json` (index added), `backend/src/controllers/tasks.controller.js` (`taskIdsWithStepAssignedTo`).

---

### TD-09 — Team-Member Task List: In-Memory Merge & Missing Pagination [Deferred]

**Priority**: P3 | **Complexity**: M | **Raised**: 2026-06-14

**Rationale**: A team member's visible set is `matters task-assigned to them ∪ matters where a step is assigned to them`. Firestore can't OR a task-doc field with a subcollection field in one query, so `listTasks`/`listMySteps` **fetch both sources, merge, filter and sort in memory** for `role === 'team_member'`. Consequences: (a) the team-member `/tasks` response returns **all** their matters in one page with `nextCursor: null` — cursor pagination doesn't apply to that branch; (b) per-matter active-step reads in `listMySteps` are an N-read fan-out. Acceptable at firm scale; won't scale to thousands of matters.

**Acceptance Criteria**:
- Decide a scalable model: e.g. **denormalise** a per-matter `assigneeUids` array (task owner + any step assignees) so a single `array-contains` query serves the whole team-member view with native pagination; OR a maintained `myWork/{uid}` index doc updated on assignment.
- Restore cursor pagination for the team-member list once the query is single-source.
- Bound or batch the active-step fan-out in `listMySteps`.

**Files**: `backend/src/controllers/tasks.controller.js` (`listTasks`, `listMySteps`, assignment writes in `patchTask`/`patchStep`).

---

## Phase 2 Stories (Out of Sprint 1–4 Scope)

The following stories are tagged `[Phase 2]` and are scoped for the next planning cycle after the web app is stable:

| Story | Title | Epic |
|---|---|---|
| E04-S06 | Client Approval/Correction Flow | E-04 |
| E05-S04 | Document Expiry & Auto-Deletion | E-05 |
| E06-S04 | Payment Reminder Automation | E-06 |
| E07-S03 | Email Delivery Failure Alerts | E-07 |
| E07-S04 | Email Template Management | E-07 |
| E07-S05 | Admin Broadcast Notifications | E-07 |
| E08-S02 | Workload, Delay & Escalation Reports | E-08 |
| E08-S03 | Payment Collection Report | E-08 |
| E08-S04 | Service, Client, Login Mapping & Storage Reports | E-08 |
| E08-S05 | Master Sheet & CSV Export | E-08 |
| E09-S04 | Bulk Step Reassignment | E-09 |
| Capacitor wrapper | Phase 2 mobile packaging | — |
| Trademark workflow | XState config for Trademark Registration | — |
| GST workflow | XState config for GST Registration | — |
| UDYAM workflow | XState config for UDYAM Registration | — |

---

## APPENDIX B — Change Log: GitHub-issue fixes (2026-06-27)

### Step config + client-facing emails (2026-07-12, #103–#106)
- **#103 — Separate Internal / Client step names.** New `step.clientTitle` on the
  definition. The client sees `clientTitle` (falling back to the internal `title`)
  everywhere — matter step list, hero, diagram — via the definition + task
  projections (`projectDefinitionForClient`, `projectTaskForClient`), and it's
  stamped onto the task step at creation. Editor gains a "Client step name" field
  under the (now explicitly labelled "Internal") step name. The existing
  Internal/Client status+notes block is KEPT (least-destructive, per decision).
- **#104 — Email subject names the organisation.** `matterSubject` now includes the
  client's `organisation` when known:
  `[Legal Terminus] ABC Technologies Pvt. Ltd. | Company Incorporation (#9Dr8eq)`.
  Resolved from the matter's client user in the email dispatch path. Gmail
  threading is unaffected — it keys on the stable `References` header (`#98`), not
  the subject, so a changing org string doesn't split the thread.
- **#105 — Read-only info box for client approvals.** On a client-approval step, a
  boxed "Shared by our team" note renders above Approve / Request Changes, showing
  the LATEST internal-team comment targeting that step (per-matter, dynamic) with
  author + relative time. Sourced from the matter's activity feed (staff comments
  reach the client via the client-safe event projection). Hidden until the team
  leaves something.
- **#106 — Editable client email per step.** New `step.clientPromptTitle` /
  `clientPromptMessage`. When a client-owned step becomes the client's turn,
  `transitionTask` uses these as the notification/email title+body instead of the
  generic auto-generated text; blank falls back to the old copy. Editor exposes
  the two fields on client steps only.
- e2e: `step-config.spec.ts` (client sees clientTitle; approval info box shows the
  team's latest comment), `admin-approval.spec.ts` unaffected.

## APPENDIX B — Change Log: GitHub-issue fixes (2026-06-27)

Code changes shipped today in response to GitHub issues. These refine/extend the
epics above; the workflow-shape changes are data edits to
`shared/workflows/companyIncorporation.definition.js` (re-seeded; now **40 steps**),
not new engine code.

### Client-view clarity, workflow-machine & email batch (2026-07-11 — #92–#102, #20)

**Workflow machine / notifications (backend)**
- **#94 — Payment-gate first step auto-advances on creation.** `createTask` never
  ran the compiled XState machine — it hard-wrote `definition.initialStep`, so a
  matter created part- or fully-paid was stranded on the step-1 payment gate
  ("Waiting for payment to be recorded") instead of passing it. Fix: instantiate
  the machine with the initial `paymentStatus` in context and take the SETTLED
  `currentStepNumber` (the gate's `always` transition fires on `actor.start()`);
  steps the gate auto-passed are marked `completed`. Root cause behind #92/#93's
  confusing client screen. e2e: `step-execution.spec.ts` (#94).
- **#100 — Client "Action needed" alerts orphaned on multi-step advances.**
  Notifications were keyed to the ARRIVAL step but resolved by the single DEPARTED
  step, so a gate auto-pass / branch skip / jump left the skipped step's alert
  unread forever. Fix: `resolveNotificationsForTask` gains a `stepNumberLte` range
  match; on any forward move `transitionTask` clears every vacated step (`≤ newStep-1`),
  and backward REWORK clears the stale departed-step alert.
- **#99 — Client confirmation when a client-pending step completes.** Closes the
  "Action needed → done" loop: when a step that was client-owned completes (client
  acted, or staff overrode on their behalf), the client gets an "Action received"
  notification + email. Uses `createNotification` directly so it isn't suppressed
  when the client is the actor. Gated on `deriveOwnerType(departedStep) === 'client'`.

**Email (backend)**
- **#97 — Brand re-skin.** `renderEmail` rebuilt table-based/inline-styled with the
  portal's tokens (brand-600 CTA, ink/hairline/surface greys) + a Legal Terminus
  wordmark header; email-safe (no external CSS/fonts), pre-wrap body.
- **#98 — Matter-threaded emails.** Stable per-matter subject
  `[Legal Terminus] <Service> (#<shortId>)` + a stable `References`/`In-Reply-To`
  header (`<matter-{taskId}@legalterminus>`) so Gmail groups a matter's emails.
  `createNotification` now resolves the task's `serviceName` for the subject.
- **#20 — Contact-form email.** Now that the Gmail transport works, `createContactLead`
  emails the team (`CONTACT_LEADS_EMAIL` → `GMAIL_USER`) on every submission,
  `replyTo` set to the enquirer. Fire-and-forget; all ~60 forms covered via the one
  controller. (Storage was already implemented under #30.)

**Client-view / steps-list clarity (frontend — `TaskDetailPage.tsx`)**
- **#92 — "Waiting on you"** for the client (was third-person "Waiting on client");
  staff unchanged. Audience-aware chip via `role.isClient`.
- **#93 — Payment-gate client copy** replaced the dead-end "Waiting for payment to
  be recorded" with reassuring "…nothing is needed from you on this step." (staff
  unchanged; recording stays staff-only).
- **#95 — Read-only client checklist**: a staff-owned step's checklist renders as a
  plain bulleted status list for the client (no interactive checkboxes it isn't
  theirs to tick).
- **#96 — Collapse completed steps** behind a "Show completed (N)" toggle (default
  hidden), mirroring the Activity "Show previous steps" UX; ascending order kept.
- **#101 — Owner colour-coding**: a solid owner-coloured left edge on **every** step
  row + the current-step hero card, plus matching pending-bar dots.
  **Revised (feedback):** the first pass used team=brand-500 / client=blue-500 which
  were near-identical blues (indistinguishable) and were `opacity-50`-muted on past
  rows (so pending rows showed no edge). Now three **clearly distinct** hues —
  **team=slate-400, client=amber-500, govt=violet-500** — applied as a solid
  `border-l-4` (border-colour, not opacity) so the edge is visible on white pending
  rows too, consistent across rows / hero / pending-bar legend. `title` label for
  a11y (not colour-alone).
- **#102 — Collapsed Stages rail → self-sufficient timeline**: when the rail is
  collapsed the steps pane shows EVERY stage grouped with subheaders + a compact
  "Jump to stage…" dropdown, instead of being stranded on one stage.
- **Client-view wording — "Client" → "You" (feedback, extends #92)**: from the
  client's own POV, third-person "Client" reads wrong. The pending-bar breakdown
  ("… · 2 Client · …") now shows **"2 You"** for a client, and the step-row owner
  tooltip reads "You step" — consistent with #92's "Waiting on you". Staff views
  keep "Client".
- **My Orders removed from the sidebar (feedback)** for all roles. The `/orders`
  route stays reachable by URL (no 404) but is no longer a nav item.
- **#101 edge render fix (feedback):** the owner left-edges weren't showing on the
  step rows — a bare `border-l-4` with no border-style renders nothing (this project
  has no border-style base). Added `border-solid` to the row + hero edge classes.
- **Notification cleanup — no background job (feedback):** notifications were never
  deleted (resolve only marked `read`), and the list returned ALL history unbounded.
  Two event-driven cleanups, no cron: (A) `resolveNotificationsForTask` now **deletes**
  the stale step-alerts it resolves on a matter advance (they'd already served their
  purpose), instead of marking them read; (B) `listNotifications` fires a
  fire-and-forget prune AFTER responding that **deletes the user's READ notifications
  older than 7 days** — cleanup happens exactly when the user opens the bell, driven
  by their own activity. Completion/approval notifications (their own entries, not
  resolved here) are unaffected.
- e2e: `matter-layout.spec.ts` (#73 current+previous, #96 collapse), `client-hero.spec.ts`
  (#92/#93 + Client→You), plus existing specs updated for the #94 gate auto-pass.

### Workflow / matter-lifecycle
- **#51 — Remove Work Assigning step + payment-at-creation.** "Work Assigning"
  step removed (matter starts at step 4). Create Matter modal captures **payment
  status** (No / Part / Full); Part/Full capture Total Cost, Amount Received, Mode,
  Amount Due → mirrored to the matter's payment fields. **No Payment → admin
  approval box** (creation deferred until admin approves). (E-11, E-06.)
- **#47 — Admin approval not required.** Removed the manager-created approval gate
  (old E03-S04 rule). Paid matters go live immediately; the **only** remaining
  approval trigger is No-Payment (#51). (E-03.)
- **#54 — Part-payment is an alert, not a step.** "Part Payment Due" step removed;
  a blinking part-paid banner shows to client + team with the "pay remaining" message.
- **#76 — Part-payment reminder fires after Name Approval.** A configurable
  per-step `REMIND_PART_PAYMENT` effect on the (editable) definition pushes the
  client an in-app + email reminder to clear the balance when its step completes —
  attached to step 20 "Name Approval Letter Received". Fires only while the matter
  is still `part_paid` (a fully-paid matter gets nothing). `f13dcf52`.
  e2e: `part-payment-reminder.spec.ts` (part-paid notifies; fully-paid does not). (E-06.)
- **#58 — Payment gate only when unpaid + override reporting.** Step-29 full-payment
  gate auto-passes when created fully-paid (engine guard). New **Payment Overrides
  report** (`/reports/payment-overrides`) lists no-payment / gate-overridden matters. (E-08.)
- **#56 — Step-28 approval logic.** Form Check is owner-gated approve/reject;
  Reject (`REWORK`) reverts to Step-27 and notifies its owner. (E-03.)
- **#59 — Removed Step-35 email-trigger step.**
- **#60 — Resubmission notification.** Step-34 fires `NOTIFY_CLIENT_RESUBMISSION`
  → in-app client notification (email send pending E-07 transport). (E-07.)
- **#61 — Step-38 rename + per-step docs.** "Client Approval/Signature Required";
  per-step document upload (generic `allowDocUpload` flag); "Please Proceed"
  (CLIENT_APPROVE) auto-completes → next. (E-05, E-04.)
- **#57 — Early DSC/MCA** documented as editor-configurable transitions.
- **#52 — Checklist step.** Generic `checklistItems` per-step flag (schema + UI);
  applied to "Name & Objects received".
- **#46 — Client assignee.** `CLIENT_ASSIGNEE` (`__CLIENT__`) sentinel selectable in
  phase/step assignee config; client-owned steps auto-assign to the matter's client. (E-11.)

### Task management & visibility
- **#48 — Assignee shows correctly.** Backend returns resolved `assigneeName` on
  tasks/my-steps so team members no longer see a false "Unassigned". (E-03.)
- **#49 — Restrict completion to assignee.** Completion events gated to the step
  assignee; managers reassign-only; admin keeps an audited override. (E-03.)
- **#50 — My Tasks = mine + unassigned pool only.** Steps assigned to others no
  longer appear in any staff member's My Tasks. New **Unassigned Tasks report**
  (`/reports/unassigned`). (E-11, E-08.)
- **#55 — Step numbering.** Client step list renders a display index (1,2,3,4…)
  over visible steps, not the stored stepNumber (which can gap when steps are hidden).
- **#69 — Completed steps struck through.** Per client request (completed steps
  were confusing to identify), a completed step's TITLE renders with a subtle
  `line-through` (muted, decoration-1) in the shared step row — applies to both the
  client tracker and the internal list. Confined to the title text (icon + "Done"
  badge + layout unchanged) to keep the design language. e2e: `interactions.spec.ts`.
- **#66 — Continuous step numbering everywhere.** The stored `stepNumber` is a
  gappy internal identity (deleted steps leave holes: 1,4,5,7…). Every DISPLAY
  surface now shows a gap-free 1..N position over the ordered steps instead:
  Service **Step Settings** list, matter-detail subtitle, activity-thread headers
  (`ff7ba72a`), and the Service Detail **"Configured Workflow" diagram** nodes
  (`2519aa94`). Identity/state keys/transition targets are untouched.
  e2e: `step-settings.spec.ts` (list + diagram are 1..N; aria-labels keep gaps).
- **#53 — Client-approval → proceed.** Auto-advance + explicit "Client approval
  received, please proceed" notification to the next assignee. (E-07.)

### Reporting (E-08 additions)
- New reports: **SLA / Delay** (E13-S04), **Payment Overrides** (#58),
  **Professional / Group Mapping** (#62), **Unassigned Tasks** (#50).

### Workflow editor (E-10 write side)
- Full create/update/**delete** of workflow definitions (admin); delete refuses if
  matters still use the definition. Step-config now includes `clientVisible`,
  `checklistItems`, `allowDocUpload`, ETA, assignee (incl. CLIENT_ASSIGNEE).
- **Plain-language redesign for non-technical admins (2026-06-27).** The editor now
  speaks human, not engine: per step a **"What kind of step?"** picker (Work /
  Client action / Government wait / Payment checkpoint / Split into options /
  Final), a **"What happens next?"** section with **named step pickers** (no raw
  step numbers or event codes), **automatic-action toggles** (instead of free-text
  effects), and a **"Who does this?"** selector (team role / the client). Every
  field has an **ⓘ tooltip** (`components/common/FieldLabel.tsx`). "Phases" relabeled
  **"Stages"** (raw id/order hidden). Validation messages are plain-language
  ("…points to a step that doesn't exist"). A collapsed **"Advanced (raw)"** panel
  per step still exposes the underlying transitions/effects for power users. The
  underlying data model/engine is unchanged — purely a presentation layer.
- **Create a workflow from scratch.** "+ New workflow" on the Service Catalog page
  (admin) → `/workflows/new` opens the same editor in create mode (blank
  definition, pick the service it powers) → **Create** (`POST /api/workflow-definitions`).

### Per-step comments & attachments on the matter detail (2026-06-28)
- Expanding a step on the matter detail (Steps tab) now shows that step's **comments**
  (from the activity log, matched by from/to step) and its **document attachments**
  (filtered by `stepNumber`) with click-to-open download — for completed AND
  in-progress steps. A small "N comments · M files" hint shows on the collapsed row.
- Visibility follows existing rules: **staff** see everything; **clients** see only
  the client-safe activity (E12 whitelist) and documents the API already scopes to
  them — no new client-side data exposure. (E-04, E-05.)

### Platform fixes
- **Phase pointer** on the matter detail now advances as steps complete into a new phase.
- **Notification resolution.** In-app notifications carry an optional `stepNumber`;
  on step-done / matter-complete / matter-stopped, the related active notifications
  are auto-resolved (marked read, non-destructive). (E-07.)
- **#62 — Professional/Group mapping.** `professionalName` + `groupCompany` on the
  client profile + the mapping report. (E-09, E-08.)

### Email transport — E07-S02 (BUILT 2026-06-27)
- **Gmail SMTP transport** (`backend/src/services/emailService.js`) — Nodemailer →
  smtp.gmail.com:465 with an **App Password**. Env: `GMAIL_USER`,
  `GMAIL_APP_PASSWORD`, `EMAIL_FROM`, `FRONTEND_URL` (documented in
  `backend/.env.example`). **Safe no-op when unconfigured** (logs + skips; never
  throws / blocks a workflow action).
- **Mirrors all in-app notifications**: `createNotification` now resolves the
  recipient's email and sends a branded HTML + plain-text email (deep link to the
  matter), fire-and-forget. So every wired event (step ready, client action-needed,
  approvals, resubmission #60, doc review, matter complete, correction required,
  etc.) emails automatically.
- Also delivers the **account password-setup link** (was a SendGrid TODO in
  `userService`) and the **#60 resubmission** email via the same transport.
- To go live: set `GMAIL_USER` + `GMAIL_APP_PASSWORD` (App Password) in the backend
  env. Full e2e suite green (email no-ops under test).
- **Open refinement:** "mirror all" may be chatty for staff; could narrow to
  clients-always + staff-high-signal if noisy in practice.

---

*Document generated by Winston (BMAD Architect Agent) — 2026-05-31; change log appended 2026-06-27.*
