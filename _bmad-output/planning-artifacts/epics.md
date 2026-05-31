---
title: Legal-Terminus Portal — Epics & Stories
version: 1.0
date: 2026-05-31
author: Winston (BMAD Architect Agent)
status: Draft — ready for developer review
stepsCompleted: ["validate-prerequisites", "gather-context", "decompose-epics", "write-stories", "sprint-plan"]
---

# Legal-Terminus Portal — Epics & User Stories

**Project**: Legal-Terminus Portal  
**Stack**: Vite + React 19 + TypeScript (`Portal/`), Node.js/Express ES Modules (`backend/`), Firebase Auth + Firestore + Storage, XState v5, Tailwind CSS, TanStack Query, Zustand  
**Roles**: `admin | manager | team_member | client`  
**Phase 1 scope**: Company Incorporation workflow only (41 steps), responsive web app  
**Phase 2**: Trademark, GST, UDYAM workflows + Capacitor mobile wrapper  
**Spec reference**: `spec.md` (17 user stories) | **Architecture reference**: `_bmad-output/planning-artifacts/architecture.md`

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
| E-04 | Client Portal | Phase 1 / 2 | E04-S01 – E04-S06 |
| E-05 | Document Cycle | Phase 1 / 2 | E05-S01 – E05-S04 |
| E-06 | Payments | Phase 1 / 2 | E06-S01 – E06-S04 |
| E-07 | Notifications & Email | Phase 1 / 2 | E07-S01 – E07-S05 |
| E-08 | Reports & Master Sheet | Phase 1 / 2 | E08-S01 – E08-S05 |
| E-09 | User & Client Management | Phase 1 / 2 | E09-S01 – E09-S05 |
| E-10 | Workflow Configuration | Phase 1 | E10-S01 – E10-S02 |

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

**Rationale**: All portal screens require authentication. This story wires up:
- Email/password login with Firebase Auth
- Google OAuth sign-in (federated identity)
- Client self-signup (email/password)
- Forgot password / reset link flow
- Zustand `authStore` with decoded user + role claim
- Typed `apiFetch` client injecting Bearer tokens on every call

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

**Implementation Notes** (Updated 2026-05-31):
- Role is now stored in **Firestore** `/users/{uid}` document (not Firebase custom claims) for easier development testing
- Backend `POST /api/auth/register` creates user document with `role: "client"` by default
- `useAuthListener()` reads role from Firestore via `getDoc(doc(db, 'users', uid))` instead of `getIdTokenResult().claims`
- This allows changing role directly in Firestore console for testing without needing Firebase Console custom claims UI
- Backend endpoint `PATCH /api/auth/set-role` (admin-only) can update roles in Firestore and sync to custom claims if needed later

**Backend endpoints needed**:
- `POST /api/auth/register` — creates `users/{uid}` with role = "client"; accepts { fullName, email?, mobile?, businessName?, state? }
- `GET /api/auth/me` — verify token, return decoded claims + Firestore profile

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

---

### E03-S01 — Team Member Step Queue [Phase 1]

**Priority**: P1 | **Complexity**: M | **Linked spec story**: US-2 | **Dependencies**: E02-S02, E01-S04

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

## E-04 — Client Portal

**Goal**: Give clients a self-service view of their tasks (steps, documents, payments) and a service catalogue, eliminating "call us to check status" interactions.

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

### E04-S05 — Service Listing Interface [Phase 2]

**Priority**: P3 | **Complexity**: S | **Linked spec story**: US-12 | **Dependencies**: E01-S04

**Rationale**: Client-facing service catalogue. P3, Phase 2 — not on the critical path.

**Acceptance Criteria**:
- `ServicesPage.tsx` — accessible only to `client` role; shows up to 20 services with name, price, 1-line description.
- "View all" link opens `legalterminus.com/services` in a new tab.
- "Request Service" CTA opens a pre-filled contact form.
- Services data is fetched from `GET /api/services` (simple static or Firestore-backed list).

**Backend endpoints needed**:
- `GET /api/services`

**Frontend screens/components**:
- `Portal/src/pages/services/ServicesPage.tsx`

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

## E-05 — Document Cycle

**Goal**: Implement the full document lifecycle: client uploads → team review → approve/reject with remark → re-upload → expiry management.

---

### E05-S01 — Document Upload (Signed URL Flow) [Phase 1]

**Priority**: P2 | **Complexity**: L | **Linked spec story**: US-4 | **Dependencies**: E01-S02, E02-S03

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

## E-09 — User & Client Management

**Goal**: Enable admin to create and manage team members and clients; enable manager to create/edit clients; enforce multi-email client login resolution; support bulk step reassignment.

---

### E09-S01 — Create & Edit Team Members [Phase 1]

**Priority**: P2 | **Complexity**: M | **Linked spec story**: US-8 | **Dependencies**: E01-S02

**Rationale**: Team members must exist before tasks can be assigned to them. Admin creates them; Firebase Auth accounts are created server-side.

**Acceptance Criteria**:
- `NewUserPage.tsx` (role=team_member mode) — required fields: full name, mobile, email, designation, date of joining, role; optional: father's name, date of birth, address.
- On submit, calls `POST /api/portal/users { ...fields, role: "team_member" }`; backend creates Firebase Auth account (`admin.auth().createUser`), sends password-reset email, writes `users/{uid}` with correct role and custom claim.
- `UserListPage.tsx` — lists all team members (`GET /api/portal/users?role=team_member`); clickable rows go to `UserDetailPage.tsx`.
- `UserDetailPage.tsx` — shows profile; edit fields; role change picker (admin only — `PATCH /api/portal/users/:uid/role`).
- Manager cannot delete users — delete button hidden for manager role; delete (soft) available to admin via `DELETE /api/portal/users/:uid`.

**Backend endpoints needed**:
- `POST /api/portal/users`
- `GET /api/portal/users?role=team_member`
- `GET /api/portal/users/:uid`
- `PATCH /api/portal/users/:uid`
- `PATCH /api/portal/users/:uid/role`
- `DELETE /api/portal/users/:uid` (admin only, soft-delete)

**Frontend screens/components**:
- `Portal/src/pages/users/NewUserPage.tsx`
- `Portal/src/pages/users/UserListPage.tsx`
- `Portal/src/pages/users/UserDetailPage.tsx`

---

### E09-S02 — Create & Edit Clients [Phase 1]

**Priority**: P1 | **Complexity**: M | **Linked spec story**: US-8, US-14 | **Dependencies**: E01-S02

**Rationale**: Clients must exist before tasks can be created for them. Admin and manager can create clients.

**Acceptance Criteria**:
- `ClientListPage.tsx` — lists all clients (`GET /api/portal/users?role=client`); searchable by name, email, org name.
- `ClientDetailPage.tsx` — displays full profile; edit button opens inline edit; shows active task count; links to task list filtered by this client.
- Create client form — required: full name, mobile, primary email, address; optional: organisation name, GST, PAN, Aadhaar, additional email IDs, state, business name, reference group.
- `POST /api/portal/users { ...fields, role: "client" }` creates Firebase Auth account and Firestore profile; `emailIds[]` is initialised with `[primaryEmail]`.
- Admin or manager can add/remove secondary emails from `ClientDetailPage` — `PATCH /api/portal/users/:uid { emailIds: [...] }`.
- Manager cannot delete clients — `DELETE` is admin-only.

**Backend endpoints needed**:
- `POST /api/portal/users` (with role=client)
- `GET /api/portal/users?role=client`
- `GET /api/portal/users/:uid`
- `PATCH /api/portal/users/:uid`
- `DELETE /api/portal/users/:uid` (admin only)

**Frontend screens/components**:
- `Portal/src/pages/clients/ClientListPage.tsx`
- `Portal/src/pages/clients/ClientDetailPage.tsx`

---

### E09-S03 — Role Management & Custom Claims [Phase 1]

**Priority**: P2 | **Complexity**: S | **Linked spec story**: US-8 | **Dependencies**: E09-S01

**Rationale**: Role changes must propagate to Firebase custom claims atomically to take effect on the next token refresh.

**Acceptance Criteria**:
- Admin selects a new role from a dropdown on `UserDetailPage`; confirmation dialog warns "This will change the user's access level immediately on next login."
- `PATCH /api/portal/users/:uid/role { role: "manager" }` — backend calls `admin.auth().setCustomUserClaims(uid, { role })` then updates `users/{uid}.role` in the same response; returns `{ success: true }`.
- Frontend notes "The user's new role will be active after their next login or token refresh."
- The calling admin's own role cannot be changed via the UI (guard: `uid !== currentUser.uid`).

**Backend endpoints needed**:
- `PATCH /api/portal/users/:uid/role`

**Frontend screens/components**:
- `Portal/src/pages/users/UserDetailPage.tsx` (role change section)

---

### E09-S04 — Bulk Step Reassignment [Phase 2]

**Priority**: P2 | **Complexity**: M | **Linked spec story**: US-8 | **Dependencies**: E09-S01

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

---

### E10-S02 — Config Sync Warning [Phase 1]

**Priority**: P1 | **Complexity**: S | **Linked spec story**: US-17 | **Dependencies**: E10-S01

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

## Phase 2 Stories (Out of Sprint 1–4 Scope)

The following stories are tagged `[Phase 2]` and are scoped for the next planning cycle after the web app is stable:

| Story | Title | Epic |
|---|---|---|
| E04-S05 | Service Listing Interface | E-04 |
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

*Document generated by Winston (BMAD Architect Agent) — 2026-05-31*
