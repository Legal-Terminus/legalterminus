# Feature Specification: Legal-Terminus Workflow App (Web + Mobile)

**Feature Branch**: `001-workflow-app`

**Created**: 2026-05-31

**Status**: Draft (Refined 2026-05-31)

---

## Overview

Legal-Terminus is a legal-services firm. This app replaces ad-hoc WhatsApp/email coordination with a structured workflow management system. It serves two audiences simultaneously:

- **Internal team** (admin, manager, team members) — assign, execute, and track service tasks
- **Clients** — track their service tasks, upload documents, approve steps, and pay

### Delivery Strategy

**Phase 1 — Web App**: Build the full feature set as a responsive web application. This is the primary delivery target. All screens and business logic are designed for web (desktop + tablet + mobile browser) first.

**Phase 2 — Mobile App**: Once the web app is stable, wrap it with Capacitor for Android/iOS. The UI/UX is designed mobile-friendly from day one to make porting straightforward.

### Workflow Engine

Workflows are modelled as **XState state machines**. Each workflow service (Company Incorporation, Trademark, etc.) is a configuration file that defines states (steps), transitions (completions, rejections, branches), guards (payment gates, role checks), and actions (email triggers, notifications). Adding a new service is a matter of writing a new XState config — no new code. The backend stores current state in Firestore; the XState machine is the authoritative source of transition rules.

### Technology

- **Frontend app**: Vite + React 19 + TypeScript at `Portal/` — responsive web app, Capacitor wrapper for Phase 2
- **Workflow engine**: XState v5 (state machines) — frontend and backend share the same machine config
- **Backend**: Node.js/Express (ES Modules), Firebase Admin SDK — `backend/`
- **Database**: Firestore (single source of truth); Firebase Storage for documents
- **Auth**: Firebase Authentication; Firebase custom claims carry `role`. **Auth methods**: Email/password login, Google Sign-In (OAuth), client self-signup (email/password), password reset via email link
- **Existing public website**: `Frontend/` — unchanged; marketing, blog, Razorpay payments

### Scope

**Phase 1 workflow**: Company Incorporation only (41 steps). The XState framework and all reusable building blocks (payment gate, document upload, email trigger, branch decision, parallel steps) are built for this workflow. The other 3 services (Trademark, GST, UDYAM) are config additions in Phase 2.

**Four roles**: `admin` | `manager` | `team_member` | `client`

**All four service workflows defined** (Phase 1 implements Company Incorporation; others follow the same pattern): Company Incorporation · Trademark Registration · GST Registration · UDYAM Registration

### Role & Permission Summary

| Action | Admin | Manager | Team Member | Client |
|---|---|---|---|---|
| Create task (no payment) | ✅ Direct | ✅ Needs Admin approval | ❌ | ❌ |
| Create task (with payment) | ✅ | ✅ | ✅ Needs Manager approval | ❌ |
| Delete any record | ✅ | ❌ | ❌ | ❌ |
| View all tasks | ✅ | ✅ | Assigned only | Own only |
| View all reports | ✅ | ✅ | ❌ | Delay summary only |
| Override payment gate | ✅ Audited | ❌ | ❌ | ❌ |
| Mark step urgent | ✅ | ✅ | ❌ | ❌ |
| Reassign task steps | ✅ Any | ✅ Any | ✅ To other members | ❌ |
| Configure email templates | ✅ | ❌ | ❌ | ❌ |
| Send broadcast notifications | ✅ | ❌ | ❌ | ❌ |

---

## User Scenarios & Testing

### User Story 1 — Client Login and Task Tracking (Priority: P1)

A registered client opens the app (or web panel), logs in with their email, and immediately sees a list of all their active service tasks. For each task they can drill into three views: Steps (what stage is the work at), Documents (what was uploaded/approved/rejected), and Payments (how much is paid, what is due).

**Why this priority**: This is the core value proposition for the client — replacing "call us to check status" with real-time self-service visibility.

**Independent Test**: Create a client account, assign them a task at step 5 of a workflow, then verify the client can log in and see the correct step status, uploaded documents, and payment balance without accessing any other client's data.

**Acceptance Scenarios**:

1. **Given** a user with role `client` is authenticated, **When** they open the app, **Then** they see only tasks linked to their `uid` — no other client's tasks are visible.
2. **Given** a task is at step 8 of 20, **When** the client taps "Steps", **Then** they see completed steps (checkmark), current step (highlighted), and upcoming steps (greyed out).
3. **Given** a document was rejected with a remark, **When** the client views Documents, **Then** they see the rejection remark and a re-upload button for that specific document.
4. **Given** a balance payment is due, **When** the client views Payments, **Then** the payment due amount blinks/is highlighted in red and a payment CTA is shown.
5. **Given** a client has multiple email IDs registered, **When** they log in with any of those emails, **Then** they see all tasks linked to their client profile.

---

### User Story 2 — Team Member Views and Executes Assigned Steps (Priority: P1)

A team member logs in and sees their personal queue of assigned workflow steps across all clients. They can mark a step complete, raise a document query to the client, reassign a step, or flag a step as urgent.

**Why this priority**: This is the core daily-use case for the internal team — the app replaces a task spreadsheet.

**Independent Test**: Create a team member account, assign them 3 steps across 2 different client workflows, then verify they can see, act on, and complete each step.

**Acceptance Scenarios**:

1. **Given** a team member is authenticated, **When** they open the app, **Then** they see only steps assigned to their `uid` grouped by client/workflow.
2. **Given** a step has status `pending`, **When** the team member marks it complete, **Then** the step status changes to `completed`, the next step becomes `active`, and a Firestore audit entry is written.
3. **Given** a step requires a client document, **When** the team member raises a query, **Then** the client receives an in-app notification and email with a direct link to the upload screen.
4. **Given** a team member wants to reassign a step, **When** they select another team member, **Then** the reassigned member receives a notification with accept/reject options; the original assignee retains ownership until accepted.
5. **Given** a step is blocked due to pending payment, **When** the team member views it, **Then** the step is highlighted in red and marked "Blocked — Payment Pending"; no completion action is available unless the user is admin.

---

### User Story 3 — Admin Creates a Task (Workflow Instance) for a Client (Priority: P1)

An admin or manager creates a new task by selecting a client and a service workflow. The system instantiates all steps for that workflow, assigns team members to applicable steps, records the payment terms (full/part), and notifies the client.

**Why this priority**: Tasks are the entry point — nothing else works until a task exists.

**Independent Test**: Admin selects client "Acme Corp" and workflow "GST Registration", sets part payment received, assigns a team member — verify all workflow steps are created in Firestore, the client sees the task, and the team member sees their assigned steps.

**Acceptance Scenarios**:

1. **Given** an admin is authenticated, **When** they create a task with `paymentStatus = part_paid`, **Then** the first applicable workflow steps become active and a blinking payment-due indicator is set at the correct balance-payment gate step.
2. **Given** an admin creates a task with `paymentStatus = not_paid`, **Then** no steps are initiated; the task sits in "Awaiting Payment" state.
3. **Given** a workflow is created, **When** the system instantiates steps, **Then** each step has: `assignedTo` (uid or "client"), `status` (pending/active/completed/blocked), `deadline`, `paymentGated` flag, `allowedWithoutPayment` flag, `isUrgent` flag, and `parallelGroup` identifier.
4. **Given** a task is created, **Then** the client receives an in-app notification and email confirming the service has started.
5. **Given** a manager creates a task with `paymentStatus = not_paid` (which requires admin approval), **When** submitted, **Then** the task status is `pending_approval` and the admin receives a notification to approve or reject.
6. **Given** a team member wants to create a task, **Then** they must provide payment evidence; task status is `pending_manager_approval` until a manager approves.
7. **Given** a manager approves or rejects a task submitted by a team member, **Then** the submitter receives an in-app notification and the task moves to `active` (approved) or `rejected` with a rejection reason.
8. **Given** an admin approves a manager-created task that had `paymentStatus = not_paid`, **Then** the task activates and both the manager and client are notified.
9. **Given** a task is created, **When** payment mode is recorded, **Then** `mode` must be one of: `bank_transfer | cash | upi | cheque | credit_card`; amount, date, and proof reference are also recorded.
10. **Given** an XState machine is instantiated for a task, **Then** the machine snapshot (current state, context) is persisted in `tasks/{taskId}/machineSnapshot`; every step transition re-persists the snapshot atomically.

---

### User Story 4 — Document Upload and Approval Cycle (Priority: P2)

A client uploads a required document for a workflow step. The team member reviews it, approves or rejects it with a mandatory remark. On approval the step advances; on rejection the client is notified to re-upload.

**Why this priority**: Document exchange is the primary communication channel between clients and the team for most service workflows.

**Independent Test**: At step "Collection of Documents (For GST Application)", a client uploads a PDF. A team member reviews it, rejects it with remark "Aadhaar not clearly scanned", then the client re-uploads and the team member approves.

**Acceptance Scenarios**:

1. **Given** a step is assigned to the client with a document requirement, **When** the client opens the step, **Then** they see upload instructions (file format, max size, required copy type) and an upload button.
2. **Given** a client uploads a document, **Then** it is stored in Firebase Storage under `documents/{taskId}/{stepId}/{fileName}` and the team member receives a notification.
3. **Given** a team member rejects a document, **When** they submit the rejection, **Then** a rejection remark is mandatory; the client receives an in-app notification and email containing the remark and a direct deep-link to the re-upload screen.
4. **Given** a team member approves a document, **Then** the document status changes to `approved` and the step can proceed.
5. **Given** no document is uploaded for a required step, **Then** the step cannot be marked complete by the team member.
6. **Given** a document has been stored for 1 year, **Then** the system triggers auto-deletion, notifies the client 30 days in advance to download, and offers a paid storage extension.

---

### User Story 5 — Payment-Gated Workflow Progression (Priority: P2)

Certain steps in a workflow are blocked until full payment is confirmed. The system enforces this automatically; only admin can override. Clients see payment-due indicators and can make payments within the app.

**Why this priority**: Payment collection is a core business requirement — steps proceeding without payment is a revenue risk.

**Independent Test**: In the Company Incorporation workflow, step 28 "Uploading of Incorporation Forms" is marked payment-gated. Attempt to mark it complete without full payment recorded — verify it fails. Then admin records full payment — verify step 28 becomes executable.

**Acceptance Scenarios**:

1. **Given** a workflow step has `paymentGated = true` and `paymentStatus ≠ fully_paid`, **When** a team member or manager attempts to complete the step, **Then** the action is blocked with message "Full payment required to proceed."
2. **Given** the same situation, **When** an admin overrides, **Then** the override is recorded in the audit trail with the admin's uid, timestamp, and reason.
3. **Given** a balance payment is due, **Then** automated payment reminder emails are sent to the client at a configurable interval (daily / alternate days / custom); the in-app indicator blinks until payment is recorded.
4. **Given** a payment is recorded (mode: Bank Transfer / Cash / UPI / Cheque / Credit Card), **Then** the payment record is stored with amount, mode, date, and the relevant workflow step is unblocked.
5. **Given** steps 22–26 of Company Incorporation are marked `allowedWithoutPayment = true`, **Then** those steps may proceed even when balance payment is pending.

---

### User Story 6 — Conditional Branching and Resubmission Loops (Priority: P2)

When a government department raises a resubmission (e.g. on name reservation or incorporation), the workflow branches: either loop back to an earlier step (for new name) or follow a documentation correction path. Both branch types must be supported.

**Why this priority**: Resubmissions are common in Indian regulatory filings and are explicitly modelled in the workflow data from the client.

**Independent Test**: In Company Incorporation, trigger the "Resubmission Received on name reservation" branch. Verify "For new name" loops back to step 6, while "For only documentation" follows the preparation → approval → resubmit path.

**Acceptance Scenarios**:

1. **Given** step 13 "Pending Name Approval" is active, **When** a resubmission is received, **Then** the team member can choose branch: "For new name" (loops to step 6) or "For documentation only" (proceeds to document correction path).
2. **Given** the "new name" branch is taken, **Then** an automated email is sent to the client requesting a new name, and the workflow waits at step 6 until new name/objects are received.
3. **Given** a client approval step is rejected, **Then** the workflow loops back to the preparation step (e.g. step 16 → step 16 for TM-A) with the rejection reason recorded.
4. **Given** a resubmission loop has occurred, **Then** the delay count for "Due to Department" is incremented in the delay report.

---

### User Story 7 — Admin Reports and Analytics (Priority: P2)

The admin has access to a comprehensive reporting dashboard covering 13 distinct report types across task status, payment collection, workload, delays, service categories, clients, and storage.

**Why this priority**: Without visibility, the admin cannot manage the business. All 13 report types are explicitly enumerated in the source requirements.

**Independent Test**: Create 10 tasks across 3 clients with varying payment statuses and step completions, then verify every report type below reflects accurate numbers with correct filters applied.

**Acceptance Scenarios**:

1. **All Tasks Report** — **Given** admin opens "All Tasks", **Then** all tasks are listed with filter/sort by: date range, status, service type, assigned team member, payment status (Fully Paid / Partially Paid / Not Paid).
2. **Completed Tasks Report** — **Given** admin opens "Completed Tasks", **Then** completed tasks appear with completion date, service type, team member, and payment status.
3. **Pending Tasks Report** — **Given** admin opens "Pending Tasks", **Then** pending tasks show with sub-categorisation by reason: payment pending, document pending, client action pending, government/department pending.
4. **Workload Report (per team member)** — **Given** admin opens Workload, **Then** it shows each team member's count of: pending tasks, completed tasks, delayed tasks; with drill-down to the task list and option to reassign directly from the report.
5. **Delay Report** — **Given** admin opens Delay Report, **Then** delays are categorised by cause: Due to LT (internal team) / Due to Client / Due to Government/Department; each bucket further segmented by age: 0–2 days / 3–5 days / >5 days.
6. **Payment Collection Report** — **Given** admin opens Payment Report, **Then** it shows: total collected, breakdown by mode (Bank Transfer / Cash / UPI / Cheque / Credit Card), monthly trend, outstanding dues, and advance payments received.
7. **Service Category Report** — **Given** admin opens Service Report, **Then** tasks are grouped by service type (Company Incorporation, Trademark, GST, UDYAM) with count, revenue, and average completion time.
8. **Client List Report** — **Given** admin opens Client List, **Then** it shows all client profiles with: name, reference/group tag, all linked email IDs, active task count, mobile, and last activity date.
9. **Client Login Mapping Report** — **Given** admin opens Login Mapping, **Then** it shows each email ID mapped to its owning client profile, showing which email is the primary login, flagging orphan emails (email exists in auth but not in any client profile).
10. **Storage Report** — **Given** admin opens Storage, **Then** it shows storage used per client, total system usage, and a projection alert if system-wide storage is within 20% of the provisioned limit.
11. **Master Sheet** — **Given** admin or manager opens Master Sheet, **Then** they see a table of all tasks with columns: client name, service, current step, assigned team member, payment status, amount paid, amount due, last updated. Exportable as CSV/Excel.
12. **Pending Task Categorisation** — Same as scenario 3 but with the ability to filter by any single reason to isolate blockers.
13. **Escalation Report** — **Given** admin opens Escalation, **Then** it shows steps that have exceeded their `deadlineDays` threshold grouped by team member, with escalation age and audit trail.

---

### User Story 8 — Role-Based User and Client Management (Priority: P2)

Admin can create and manage all user accounts. Managers can create/edit clients and team members but cannot delete any records. Team members can only view and edit their own profile.

**Why this priority**: The team and client roster is a prerequisite for assigning tasks.

**Independent Test**: Admin creates a team member, assigns them to a step, elevates them to manager — verify new role reflects immediately. Manager creates a client — verify client can log in. Manager attempts deletion — verify it is blocked.

**Acceptance Scenarios**:

1. **Given** an admin creates a team member, **Then** required fields are: full name, mobile/contact number, email, designation, date of joining, role; optional: father's name, date of birth, address. A Firebase Auth account is created server-side, password-reset email is sent, Firestore `users/{uid}` written with correct role and custom claim.
2. **Given** an admin or manager creates a client profile, **Then** required fields are: full name, mobile, address, primary email; optional: organisation name, GST number, PAN number, Aadhaar number, additional email IDs, state, business name. Multiple email IDs are stored in `emailIds[]`; any can be used for login and notifications.
3. **Given** an admin updates a user's role via `PATCH /api/auth/set-role`, **Then** both the Firestore document and the Firebase Auth custom claim are updated atomically; the user's next token refresh reflects the new role.
4. **Given** a manager attempts to delete a user, client, task, or any record, **Then** the action is blocked with HTTP 403 and UI message "Managers cannot delete records."
5. **Given** a team member leaves, **When** admin triggers reassignment, **Then** all open workflow steps assigned to that uid are bulk-reassigned to a selected new team member; the action is logged in the audit trail.
6. **Given** the same email address appears in multiple client profiles (multi-email client), **Then** login resolves to the profile where that email is the primary email; if it is a secondary email, the most recently created profile is returned and admin is alerted to resolve the ambiguity.
7. **Given** a manager creates a client profile, **Then** the profile is immediately active without admin approval — managers have full create/edit rights for clients.

---

### User Story 9 — In-App Notifications and Email Automation (Priority: P2)

Every meaningful workflow event triggers an in-app notification and an email to the relevant party. Email templates are customisable. Delivery failures are reported to admin.

**Why this priority**: Automated communication is a hard requirement in the spec — clients must receive real-time updates without the team manually sending emails.

**Independent Test**: Complete a workflow step, trigger a document rejection, and simulate an email delivery failure. Verify: (a) client receives in-app notification and email, (b) the email contains a deep-link back to the relevant screen, (c) admin is notified of the delivery failure.

**Acceptance Scenarios**:

1. **Given** a workflow step is completed, **Then** the client receives an in-app notification and email with the step name, service name, and current overall status.
2. **Given** a payment is due, **Then** automated reminder emails are sent at the configured frequency; the blinking payment indicator appears in both client and team-member views.
3. **Given** an email fails to deliver (invalid address, full mailbox), **Then** admin and manager receive an in-app alert identifying the client, the email address, and the failure reason.
4. **Given** admin configures an email template for a step, **Then** all future notifications for that step use the custom template with branding, content, and tone settings.
5. **Given** a notification pop-up (news/offer/update) is created by admin, **Then** it is shown in-app on next open and optionally sent as email to selected client groups.

---

### User Story 10 — Urgent Task Flagging (Priority: P3)

Admin and manager can mark any step or task as urgent. Urgent items receive a visual highlight (blinking/red border) across all views — client, team member, and admin — to ensure immediate attention.

**Why this priority**: Explicitly required in the spec; supports SLA management.

**Independent Test**: Admin marks step 28 of a task as urgent. Verify team member's queue highlights it, client's step list highlights it, and admin's dashboard shows it in the urgent section.

**Acceptance Scenarios**:

1. **Given** admin/manager marks a step as urgent, **Then** `isUrgent = true` is written to the step document and all users who can see that step see the urgent indicator immediately.
2. **Given** an urgent step is completed, **Then** the urgent flag is cleared automatically.
3. **Given** an urgent task exists, **When** admin views the dashboard, **Then** urgent tasks appear in a dedicated "Urgent" section above the main task list.

---

### User Story 11 — Client Approval / Rejection Correction (Priority: P3)

A client who mistakenly approved or rejected a step can request a correction within a grace period. The team member or admin reviews and can reverse the action with an audit record.

**Why this priority**: Explicit requirement from the spec; prevents errors from becoming permanent.

**Acceptance Scenarios**:

1. **Given** a client approved a step less than 24 hours ago, **When** they request a correction, **Then** a notification is sent to the assigned team member to review and reverse if appropriate.
2. **Given** a team member approves the correction, **Then** the step is reverted to the pre-approval state and the original approval is recorded as "reversed" in the audit trail.

---

### User Story 12 — Service Listing Interface (Priority: P3)

Clients see an in-app catalogue of all available legal services with pricing and brief descriptions. Up to 20 services are shown; a link redirects to the full website for more.

**Acceptance Scenarios**:

1. **Given** a client opens Services, **Then** they see up to 20 services with name, price, and 1-line description.
2. **Given** more than 20 services exist, **Then** a "View all services" link opens `legalterminus.com/services` in the in-app browser.
3. **Given** a client taps a service, **Then** they see full details and a "Request Service" CTA that opens a contact form pre-filled with their profile data.

---

### User Story 13 — Manager Task Approval Workflow (Priority: P1)

When a team member creates a task, it requires manager approval. When a manager creates a task without proof of payment, it requires admin approval. Approvals are time-sensitive with in-app alerts.

**Why this priority**: The approval chain is a core business process — tasks cannot go live without it.

**Acceptance Scenarios**:

1. **Given** a team member submits a new task with payment proof attached, **Then** the task status is `pending_manager_approval`; all managers receive an in-app notification with the task details.
2. **Given** a manager approves the task, **Then** status changes to `active`; the XState machine is instantiated; the team member and client are notified.
3. **Given** a manager rejects the task, **Then** status changes to `rejected`; the team member receives the rejection reason and must revise and resubmit.
4. **Given** a manager creates a task with `paymentStatus = not_paid`, **When** submitted, **Then** the task status is `pending_admin_approval`; admin receives notification.
5. **Given** an admin approves a manager's no-payment task, **Then** it activates; manager and client are notified.
6. **Given** an approval is pending for more than 24 hours, **Then** an escalation reminder is sent to the relevant approver.

---

### User Story 14 — Multi-Email Client Management (Priority: P1)

A client may have multiple email addresses. Any registered email can receive notifications. The primary email is the login credential; secondary emails receive copies of notifications.

**Why this priority**: Explicitly required in source requirements; clients often use both personal and business emails.

**Acceptance Scenarios**:

1. **Given** admin adds a secondary email to a client profile, **Then** it is appended to `emailIds[]` and all future notification emails are sent to all addresses in the array.
2. **Given** a client logs in with a secondary email, **Then** authentication resolves to the correct profile; a note is shown that "you are logged in via a secondary email; primary email is X".
3. **Given** admin removes a secondary email, **Then** it is removed from `emailIds[]` and no longer receives notifications from the next notification onwards.
4. **Given** an email exists in Firebase Auth but is not mapped to any `emailIds[]`, **Then** the Client Login Mapping Report flags it as an orphan email needing resolution.

---

### User Story 15 — Payment Mode Recording (Priority: P2)

Every payment recorded against a task must capture the mode (Bank Transfer, Cash, UPI, Cheque, Credit Card), amount, date, and optional reference/proof. This data feeds the payment report.

**Why this priority**: Finance tracking requires mode-level breakdown; the payment report depends on it.

**Acceptance Scenarios**:

1. **Given** admin or manager records a payment, **Then** required fields are: amount, date, mode (one of `bank_transfer | cash | upi | cheque | credit_card`); optional: reference number, uploaded proof image.
2. **Given** a payment is recorded, **Then** `amountPaid` on the task is updated, `amountDue` is recalculated, and `paymentStatus` is recomputed automatically (`not_paid → part_paid → fully_paid`).
3. **Given** a payment is recorded at or above the amount for a payment gate, **Then** the XState machine fires the `PAYMENT_CONFIRMED` event and activates the gated step.
4. **Given** admin views payment history for a task, **Then** they see a chronological list of all payments with mode, amount, date, recorded-by, and reference.

---

### User Story 16 — Admin Broadcast Notifications (Priority: P3)

Admin can push a notification (offer, news, alert) to all clients or a filtered group. The notification appears in-app on next open and is optionally sent as email.

**Why this priority**: Marketing and operational announcements are explicitly listed in the spec requirements.

**Acceptance Scenarios**:

1. **Given** admin creates a broadcast with title, body, and target (all clients / by state / by service type), **Then** a notification document is written to each target client's `notifications/` sub-collection.
2. **Given** a client opens the app after a broadcast, **Then** the broadcast notification appears as an in-app banner/modal with dismiss option.
3. **Given** admin enables "also send as email" on a broadcast, **Then** emails are queued to all target addresses; delivery failures are reported back to admin.

---

### User Story 17 — Workflow Template Configuration (Priority: P1)

Workflows have two layers: a **code layer** (XState machine topology — step order, branches, payment guards, parallel groups) which is developer-owned, and a **configuration layer** (step metadata — labels, deadlines, email templates, default assignee role) which is admin-editable via a Workflow Settings screen without any code deployment.

**Why this priority**: Without this separation, every label change or deadline adjustment requires a code deployment. Admin must be able to tune workflows for operational realities (e.g. change "3 days" to "5 days" for a government step) independently.

**Hybrid model**:
- **Code layer** (XState config file, deployed with app): step sequence, branch conditions (`new_name` vs `documentation`), payment gate guards, parallel group membership, loop-back transitions, `allowedWithoutPayment` flags. Changing any of these requires a developer and a deployment.
- **Config layer** (Firestore `workflowTemplates/{workflowId}/steps/{stepNumber}`): step label, description, deadline days, default assignee role, document requirement description, email template reference, whether a reminder is sent. Admin can edit these at any time from the portal.

**At task creation**, the backend:
1. Instantiates the XState machine for the workflow type.
2. Reads the config layer from Firestore to populate each step's metadata.
3. Persists the machine snapshot and the populated step list into `tasks/{taskId}`.

**Acceptance Scenarios**:

1. **Given** admin opens "Workflow Settings" for Company Incorporation, **Then** they see a list of all 41 steps with their current label, deadline, default assignee role, and email template.
2. **Given** admin updates a step's deadline from 3 days to 5 days, **Then** all new tasks created after that point use the updated deadline; existing in-progress tasks are unaffected unless admin explicitly re-applies.
3. **Given** admin changes a step's default assignee role from `team_member` to `manager`, **Then** new tasks auto-assign that step to the logged-in manager who created the task (or the first available manager).
4. **Given** admin edits a step's email template reference, **Then** the next email triggered by that step uses the new template.
5. **Given** a developer updates the XState machine topology (adds a new step, changes a branch condition), **Then** the system detects that the config layer has fewer steps than the machine and flags a "config out of sync" warning on the Workflow Settings screen; admin is prompted to fill in metadata for the new step before the workflow can be used in new tasks.
6. **Given** a non-admin role attempts to access Workflow Settings, **Then** the route is blocked with a 403 — only `admin` can edit workflow configurations.

---

### Edge Cases

- A client with a single email linked to multiple client profiles: login resolves to the correct profile based on the primary client lookup; admin can switch context between profiles.
- A workflow step assigned to "client" where the client has not yet completed it and the team member tries to advance: the step must remain blocked pending client action.
- Parallel steps (e.g. "Name Approval" and "DSC" in Company Incorporation): both can be in `active` status simultaneously; the subsequent step only becomes active when all parallel steps in the group are completed.
- Admin overrides a payment gate: recorded in audit with reason; the step is marked `payment_override = true`; the blinking indicator persists to remind the team of the outstanding balance.
- A document re-upload after approval: the approved document is archived; the new upload starts the approval cycle again.
- Team member rejects a task reassignment: the original assignee retains ownership; both parties are notified; admin is alerted if the reject leaves the step unassigned for more than X hours (configurable).
- Storage limit reached for a client: no new document uploads allowed; client and admin are notified; paid storage extension must be purchased to unblock uploads.
- Email OTP login (first-time mobile): OTP sent to registered email; mobile OTP for first-time login on native app.

---

## Workflow Definitions

> **Phase 1 implementation**: Company Incorporation only. The XState framework, all building blocks (payment gate, document cycle, email trigger, branch decision, parallel step group), and all shared UI components are built for this workflow. The remaining 3 services are Phase 2 — each is a new XState config file, zero new code.

### XState Architecture (Hybrid Model)

**Code layer** — XState machine config file (`Portal/src/workflows/configs/companyIncorporation.machine.ts`):

| Building Block | XState Pattern |
|---|---|
| Payment gate | Guard: `({ context }) => context.paymentStatus === 'fully_paid'` |
| `allowedWithoutPayment` steps | Guard override on specific states |
| Document upload/review cycle | Invoked actor (`documentReviewActor`) |
| Branch decision (new name vs docs) | Choice pseudostate → conditional transitions |
| Parallel step group | `type: 'parallel'` state with nested regions |
| Email trigger | Entry action (`sendEmailAction`) |
| Admin payment override | Event `ADMIN_OVERRIDE_PAYMENT` → guard bypassed |
| Loop back | Event transition back to earlier state (iteration count in context) |

**Config layer** — Firestore `workflowTemplates/{workflowId}/steps/{stepNumber}`:

| Field | Editable by Admin? |
|---|---|
| `label` (step title) | ✅ Yes |
| `description` | ✅ Yes |
| `deadlineDays` | ✅ Yes |
| `defaultAssigneeRole` | ✅ Yes |
| `documentRequirementText` | ✅ Yes |
| `emailTemplateRef` | ✅ Yes |
| `stepNumber` / `parallelGroup` / `paymentGated` | ❌ Code layer only |
| `allowedWithoutPayment` / branch conditions | ❌ Code layer only |

**Task instantiation flow**:
1. Admin/manager calls `POST /api/tasks` with `{ clientUid, workflowType, paymentStatus, ... }`
2. Backend reads `workflowTemplates/{workflowType}/steps` from Firestore (config layer)
3. Backend instantiates the XState machine with initial context `{ taskId, clientUid, paymentStatus }`
4. Backend writes populated step documents and machine snapshot to `tasks/{taskId}`
5. XState machine snapshot is the source of truth for which step is active; Firestore is the persistence layer
6. Every subsequent step transition: `POST /api/tasks/:taskId/transition { event: 'COMPLETE_STEP' }` → backend hydrates snapshot → sends event → persists new snapshot

---

### Company Incorporation (41 steps) — **Phase 1**

Sequential steps with conditional branches and parallel execution:

| Step(s) | Description | Assigned | Special |
|---|---|---|---|
| 1–2 | Payment gate (full / part / pending) | Admin/Manager | `paymentGated`; `part_paid` allows steps 3–10 |
| 3 | Work assignment — task assigned to team member | Admin/Manager | — |
| 4–5 | Collect company name + objects from client | Client action | — |
| 6 | Confirm/finalize name selection | Team member | — |
| 7 | Name availability search | Team member | — |
| 8 | Finalize name for filing | Team member | — |
| 9 | Send name draft to client | Client action | Email trigger |
| 10 | Client approval of name | Client | Loop to step 6 on rejection |
| 11 | File name application | Team member | Government/dept step |
| 12 | Await government approval | Dept | `status = awaiting_govt` |
| 13 | Name application result received | Team member | — |
| 14–19 | Resubmission branch | — | Branch: "New name" → loop to 6; "Documentation" → prepare → approve → resubmit |
| 20 | Name Approval Letter received | Team member | Email to client with attachment |
| 21 | Part-payment blinking gate | Admin/Manager | `paymentGated`; blinking until resolved |
| 22–26 | Document collection, form fill, form check | Team + Client | `allowedWithoutPayment = true` for steps 22–24 |
| 27 | Full payment confirmed | Admin/Manager | Clears payment gate at step 28 |
| 28 | Upload incorporation forms | Team member | `paymentGated = true`; admin override only |
| 29 | Challan payment | Team member | Manual entry only — date + challan ID; no payment integration |
| 30–37 | Government approval + resubmission branch | Dept + Team | Branch: information path OR document path |
| 38 | COI received | Team member | Email to client with attachment |
| 39 | PAN/TAN received | Team member | Email to client with attachment |
| 40 | Mail to client | Team member | — |
| 41 | Master sheet update | Team member | Marks task `completed` |

**Parallel steps**: Steps in the "DSC preparation" group run in parallel — all must complete before the next sequential step activates.

---

### Trademark Registration (25 steps) — Phase 2

- Steps 1–2: Payment gate
- Steps 3–10: Work assignment, name/object collection, search, client approval (loop to step 6 on rejection)
- Step 11: Document collection (client uploads logo + signed docs)
- Step 12: Part-payment blinking gate
- Steps 13–20: POA preparation, document collection, form fill (TM-A), draft to client, client approval (loop to step 16 on rejection)
- Step 21: Full payment confirmed
- Step 22: DSC affixation (`paymentGated = true`, admin override only)
- Step 23: Challan payment (manual entry only)
- Steps 24–25: Acknowledgement + challan mail to client, master sheet update

### GST Registration (21 steps) — Phase 2

- Steps 1–2: Payment gate
- Steps 3–5: Work assignment, checklist, document collection (client uploads)
- Steps 6–13: Board resolution prep, TRN generation, application fill and submit, Aadhaar authentication (client action), ARN received
- Step 14: Government approval (department step)
- Steps 15–20: Resubmission branch — information path OR document path — form resubmission
- Step 21: GST Certificate received — email to client with attachment

### UDYAM Registration (8 steps, simplified) — Phase 2

- Steps 1–2: Payment gate
- Steps 3–4: Work assignment, checklist received
- Steps 7–8: Application fill and submit
- Step 21: UDYAM Certificate received — email to client with attachment

---

## Data Model (Firestore Collections)

### `users/{uid}`
```
uid, email, fullName, mobile, role (admin|manager|team_member|client),
status (active|inactive), createdAt, updatedAt, createdBy?,
// team_member extras:
contactNumber?, fatherName?, dateOfBirth?, address?,
designation?, dateOfJoining?,
// client extras:
organisationName?, gstNumber?, panNumber?, aadhaarNumber?,
emailIds[] (all emails incl. primary), primaryEmail,
state?, businessName?, referenceGroup?
```

### `workflowTemplates/{workflowId}` — admin-editable config layer
```
// Top-level document (read-only, set by developer on first deploy):
workflowId (e.g. "company_incorporation"), name, serviceType, totalSteps,
machineConfigVersion  // bumped when code layer changes; triggers sync warning

// Sub-collection: workflowTemplates/{workflowId}/steps/{stepNumber}
// All fields below are ADMIN-EDITABLE via Workflow Settings screen:
stepNumber,
label,               // display name for this step
description,         // longer description shown to assignee
deadlineDays,        // SLA from step activation
defaultAssigneeRole, // "team_member" | "manager" | "client"
documentRequirementText?,  // instructions shown to client when doc upload required
emailTemplateRef?,   // references emailTemplates/{templateId}
sendReminderAfterDays?     // 0 = no reminder

// Read-only (reflects XState machine code layer — never edited via UI):
paymentGated,        // true if this step is behind a payment guard in the machine
allowedWithoutPayment, // true if machine allows this step before full payment
parallelGroup?,      // step group ID if this step runs in parallel with others
branches?,           // branch conditions defined in machine topology
```

### `tasks/{taskId}` — workflow instances per client
```
clientUid, workflowId, workflowName,
status (pending_manager_approval|pending_admin_approval|active|completed|rejected),
paymentStatus (not_paid|part_paid|fully_paid),
amountTotal, amountPaid, amountDue,
createdBy, createdAt, updatedAt, isUrgent,
currentStepNumber,
machineSnapshot: { value, context }   // XState persisted snapshot
// approval tracking:
pendingApprovalFrom?: (uid of approver),
rejectionReason?: string
```

### `taskSteps/{taskId}/steps/{stepId}`
```
stepNumber, title, assignedTo, status (pending|active|completed|blocked|skipped),
paymentGated, paymentOverride, isUrgent, startedAt?, completedAt?,
deadline, delayReason?, completedBy?, auditLog[{action, by, at, note}]
```

### `documents/{taskId}/files/{docId}`
```
taskId, stepId, uploadedBy, fileName, storagePath, signedUrl?,
status (pending_review|approved|rejected), rejectionRemark?,
uploadedAt, reviewedAt?, reviewedBy?, expiresAt (uploadedAt + 1 year)
```

### `notifications/{uid}/items/{notifId}`
```
uid, type, title, body, deepLink, read, createdAt, taskId?, stepId?
```

### `payments/{paymentId}`
```
taskId, clientUid, amount,
mode (bank_transfer|cash|upi|cheque|credit_card),
date, recordedBy,
referenceNumber?,   // UTR, cheque no., UPI transaction ID
proofStoragePath?,  // uploaded image/receipt
notes?, createdAt
```

### `auditLog/{entryId}`
```
entityType (task|step|document|user|payment), entityId,
action, performedBy, performedAt, previousValue?, newValue?, note?
```

---

## Non-Functional Requirements

### Delivery Phases
- **Phase 1**: Responsive web app only (`Portal/` — Vite + React + TypeScript). Target: Chrome/Safari/Edge on desktop, tablet, and mobile browser. No native app build yet.
- **Phase 2**: Capacitor wrapper for Android/iOS after web app is stable and validated.
- **Phase 1 workflow scope**: Company Incorporation only. All other services (Trademark, GST, UDYAM) follow in Phase 2 as XState config files.

### Workflow Engine (XState v5)
- Every workflow service is a `createMachine({...})` configuration file — no bespoke logic per service.
- Shared building blocks (guards, actions, actors) live in `Portal/src/workflows/shared/`.
- Individual workflow configs live in `Portal/src/workflows/configs/` (e.g. `companyIncorporation.machine.ts`).
- Backend exposes `POST /api/tasks/:taskId/transition` — accepts event, hydrates snapshot, sends event, persists new snapshot.
- Frontend uses `useMachine` (or `useSelector` on a service actor) to render the current step reactively.

### Security & Auth
- **Authentication**: Email/password + Google Sign-In via Firebase Auth; email OTP for first login on mobile (Phase 2)
- **Authorisation**: Firebase custom claims (`role`) verified on every protected backend route via `verifyToken` middleware; `requireRole()` enforces per-route permissions
- **Security**: Signed URLs for document access (TTL: 15 min); no PAN/Aadhaar in list endpoints; input sanitisation on all backend routes (OWASP Top 10)

### Performance
- Task list must load < 2s on broadband; step transitions must persist to Firestore < 1s
- XState snapshot hydration must add < 50ms overhead per transition

### Storage & Notifications
- **Storage**: Firebase Storage per-client quota; alerts at 80% and 100%; auto-deletion after 1 year with 30-day advance notice
- **Email**: Configurable SMTP/SendGrid via Nodemailer; delivery failure alerts to admin; template customisation per step/service
- **Notifications**: In-app (Firestore real-time listener) + email; FCM push notifications in Phase 2

### Platforms & Accessibility
- **Phase 1**: Chrome 100+, Safari 15+, Edge 100+ (web)
- **Phase 2**: Android 10+, iOS 15+
- **Accessibility**: WCAG 2.1 AA; responsive layout works at 320px minimum width; minimum 44×44px tap targets throughout

### Deployment
- `Portal/` web build → Firebase Hosting (same project as public website)
- `backend/` → Cloud Run (`asia-south2`, service `legal-terminus-qa`, 0–5 instances, 512Mi)
- CI/CD via `.github/workflows/firebase-preview-qa.yml`
- **CORS** (Phase 2 prep): Backend already allows `capacitor://localhost` (iOS) and `http://localhost` (Android)
