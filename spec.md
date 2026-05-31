# Feature Specification: Legal-Terminus Workflow App (Hybrid Mobile + Web)

**Feature Branch**: `001-workflow-app`

**Created**: 2026-05-31

**Status**: Draft

---

## Overview

Legal-Terminus is a legal-services firm. This app replaces ad-hoc WhatsApp/email coordination with a structured workflow management system. It serves two audiences simultaneously:

- **Internal team** (admin, manager, team members) — assign, execute, and track service tasks
- **Clients** — track their service tasks, upload documents, approve steps, and pay

The app is a single Capacitor build (web + Android + iOS) that shows different screens based on the authenticated user's role. It shares the existing Firebase project, Firestore database, and backend APIs with the website.

**Four roles**: `admin` | `manager` | `team_member` | `client`

**Four initial service workflows**: Company Incorporation · Trademark Registration · GST Registration · UDYAM Registration

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

The admin has access to a comprehensive reporting dashboard covering tasks by status, payment collection, workload by team member, delay analysis, and service category breakdowns.

**Why this priority**: Without visibility, the admin cannot manage the business. Reports are explicitly required in the spec.

**Independent Test**: Create 10 tasks across 3 clients with varying payment statuses and step completions, then verify the admin report correctly shows all breakdowns listed below.

**Acceptance Scenarios**:

1. **Given** an admin opens Reports, **Then** they can view: all tasks (list + filter), completed tasks, pending tasks — each crosscut by: Fully Paid / Partially Paid / Not Paid.
2. **Given** the workload report is opened, **Then** admin sees pending tasks per team member and completed tasks per team member, with the ability to reassign from the report screen.
3. **Given** the delay report is opened, **Then** delays are categorised by: Due to LT (internal) / Due to Client / Due to Department, with day buckets (0–2 / 3–5 / >5).
4. **Given** the payment report is opened, **Then** it shows incoming payments by mode (Bank Transfer, Cash, UPI, Cheque, Credit Card), monthly totals, outstanding dues, and advance payments.
5. **Given** the service category report is opened, **Then** tasks are grouped by service (Company Incorporation, Trademark, GST, UDYAM) with count and revenue.
6. **Given** the storage report is opened, **Then** admin sees storage used per client and a system-wide projection for when more storage should be purchased.
7. **Given** an admin opens "List of Clients" report, **Then** they see each client's reference group, linked email IDs, and active task count.

---

### User Story 8 — Role-Based User and Client Management (Priority: P2)

Admin can create and manage team member accounts and client profiles. Managers can create/edit but not delete. All user creation goes through the system — no out-of-band account sharing.

**Why this priority**: The team and client roster is a prerequisite for assigning tasks.

**Independent Test**: Admin creates a team member (role: team_member), assigns them to a workflow step, then admin elevates them to manager — verify the new role is reflected immediately in the app and the manager can now approve tasks.

**Acceptance Scenarios**:

1. **Given** an admin creates a team member with email, full name, designation, date of joining, and role, **Then** a Firebase Auth account is created server-side, a password-reset email is sent, and a Firestore `users/{uid}` document is written with the correct role and custom claim.
2. **Given** an admin creates a client profile, **Then** mandatory fields (name, mobile, address, email) are validated; optional fields (GST, Aadhaar, PAN, organisation name) are stored; multiple email IDs are supported and any can be used for login/notifications.
3. **Given** an admin updates a user's role via `PATCH /api/auth/set-role`, **Then** both the Firestore document and the Firebase Auth custom claim are updated atomically; the user's next token refresh reflects the new role.
4. **Given** a manager attempts to delete a user or record, **Then** the action is blocked with "Managers cannot delete records."
5. **Given** a team member leaves, **When** admin triggers reassignment, **Then** all open workflow steps assigned to that uid are reassigned to a new team member; the action is logged in the audit trail.

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

## Workflow Definitions (from service data)

### Company Incorporation (41 steps)

Sequential steps with conditional branches and parallel execution:
- Steps 1–2: Payment gate (full / part / pending)
- Steps 3–10: Work assignment, name/object collection, search, finalization, client approval (loop back to step 6 on rejection)
- Steps 11–13: Name application filing and government approval (department step)
- Steps 14–19: Resubmission branch — "For new name" (loop to step 6) OR "For documentation" (prepare → approve → resubmit)
- Step 20: Name Approval Letter received — email to client with attachment
- Step 21: Part-payment blinking gate
- Steps 22–26: Document collection, form fill, form check (`allowedWithoutPayment = true` for these 3 steps)
- Step 27: Full payment confirmed
- Step 28: Upload incorporation forms (`paymentGated = true`, admin override only)
- Step 29: Challan payment (manual entry only — date + challan details, no payment integration)
- Steps 30–37: Government approval + resubmission branch (information vs. document path)
- Steps 38–41: COI received, PAN/TAN received, mail to client, master sheet update

### Trademark Registration (25 steps)

- Steps 1–2: Payment gate
- Steps 3–10: Work assignment, name/object collection, search, client approval (loop to step 6 on rejection)
- Step 11: Document collection (client uploads logo + signed docs)
- Step 12: Part-payment blinking gate
- Steps 13–20: POA preparation, document collection, form fill (TM-A), draft to client, client approval (loop to step 16 on rejection)
- Step 21: Full payment confirmed
- Step 22: DSC affixation (`paymentGated = true`, admin override only)
- Step 23: Challan payment (manual entry only)
- Steps 24–25: Acknowledgement + challan mail to client, master sheet update

### GST Registration (21 steps)

- Steps 1–2: Payment gate
- Steps 3–5: Work assignment, checklist, document collection (client uploads)
- Steps 6–13: Board resolution prep, TRN generation, application fill and submit, Aadhaar authentication (client action), ARN received
- Step 14: Government approval (department step)
- Steps 15–20: Resubmission branch — information path OR document path — form resubmission
- Step 21: GST Certificate received — email to client with attachment

### UDYAM Registration (8 steps, simplified)

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
fatherName?, dateOfBirth?, address?, designation?, dateOfJoining?,
// client extras:
organisationName?, gstNumber?, panNumber?, aadhaarNumber?,
emailIds[] (array of additional emails), state?, businessName?
```

### `workflows/{workflowId}` — workflow template definitions
```
name, serviceType, steps[{
  stepNumber, title, description, assignedTo (uid|"client"|null),
  paymentGated, allowedWithoutPayment, parallelGroup?,
  deadlineDays, emailTrigger?, documentRequired?,
  branches[{condition, nextStepNumber}]
}]
```

### `tasks/{taskId}` — workflow instances per client
```
clientUid, workflowId, workflowName, status, paymentStatus,
amountTotal, amountPaid, amountDue, paymentMode?, paymentDate?,
createdBy, createdAt, updatedAt, isUrgent,
currentStepNumber, steps[{...step state}]
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
taskId, clientUid, amount, mode, date, recordedBy, notes?, createdAt
```

### `auditLog/{entryId}`
```
entityType (task|step|document|user|payment), entityId,
action, performedBy, performedAt, previousValue?, newValue?, note?
```

---

## Non-Functional Requirements

- **Authentication**: Email/password + Google Sign-In via Firebase Auth; email OTP for first login on mobile
- **Authorisation**: Firebase custom claims (role) verified on every backend request via `verifyToken` middleware
- **Performance**: Task list must load < 2s on 4G; step transitions must persist to Firestore < 1s
- **Offline**: Capacitor app must show cached task list when offline; mutations queue and sync on reconnect
- **Security**: Signed URLs for document access (TTL: 15 min); no PAN/Aadhaar in list endpoints; input sanitisation on all backend routes
- **Storage**: Firebase Storage per-client quota; alerts at 80% and 100%; auto-deletion after 1 year with 30-day advance notice
- **Email**: Configurable SMTP/SendGrid; delivery failure alerts to admin; template customisation per step/service
- **Notifications**: In-app (Firestore listener) + push (FCM for mobile) + email; configurable frequency for payment reminders
- **Platforms**: Android 10+, iOS 15+, Chrome/Safari/Edge (web)
- **Accessibility**: WCAG 2.1 AA; minimum 44×44px touch targets on mobile
