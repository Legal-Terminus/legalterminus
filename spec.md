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
- **Auth**: Firebase Authentication; role stored in Firestore `/users/{uid}` document. **Auth methods**: Email/password login, Google Sign-In (OAuth), Sign in with Apple (E29-S11: iPhone app always, website when `VITE_APPLE_SIGN_IN` is on, not Android), client self-signup (email/password; the password must have 8+ characters with an uppercase letter, a lowercase letter, a number and a special character, shown as a checklist, and the Terms & Conditions and Privacy Policy must be agreed, recorded as `users.termsAcceptedAt` — #35), password reset via email link (same password rules)
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
| Create, edit, switch on/off coupon codes; read the Coupon & Discount report (#256) | ✅ | ✅ | ❌ | ❌ (applies a code at checkout) |

**Matters list (#275):** "All Matters" lists every matter the user may see, whatever its status — completed matters included, however many matters there are. Only deleting a matter removes it. The Status filter (and a dashboard link that opens it, e.g. `/tasks?status=completed`) shows every matter in that status.

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
14. **Client / Group Work & Fee Report (#206, admin only)** — **Given** an admin opens the report and picks a financial year, group, client or service, **Then** it shows total works, fees charged, fees received and balance, with one row per work (client, service, date, fee, status). A work counts in the April–March year it was created in. Managers and other roles cannot see or open it.
15. **Client Database (#205, revised 2026-10-29)** — **Given** an admin or manager opens Reports → Client Database, **Then** a separate screen shows nine fields per client — Client Name, Contact Person Name, Contact Person Designation (Owner / Director / Accountant / Manager), Contact Number, Alternative Number, Email ID, Alternative Email, Business Address, Client Since — starting from the client's creation data. Choosing a client in **Client Name** shows that client's record; with none chosen, every client is listed. **Edit** makes the record editable on the same screen and **Save** updates that one record; the client form, profile and login email are never changed by it. The nine columns download as Excel. Team members and clients have no access.
16. **Employee Performance (#216, admin and manager)** — **Given** a manager picks a team member (or All team) and a period (today, this week, this month or custom dates), **Then** they see: the work summary (assigned, completed, pending, started and completed in the period, carried forward); elapsed time per completed task, labelled as elapsed and not hours worked (the portal records no working hours); completion and pending figures (in progress, not started, overdue, awaiting approval, completion %); a per-task history and the activity log, newest first; deadlines (on time, late, overdue now, average delay of late tasks, and the comment recorded when a late task was completed); a daily / weekly / monthly completion and on-time trend compared with the previous equal period; and quality (first-time right, returned for corrections with counts, awaiting approval). All team adds a per-person overview table, exportable to Excel. Team members and clients cannot open it.

**Website payments (E24-S02 … S05)** — **Given** a signed-in customer chooses a plan on the website and pays, **Then** the amount charged is the plan's price in the catalogue plus GST at 18% (prices are exclusive of GST; the checkout shows the price, the GST and the total); the order is marked paid only on a verified confirmation from the gateway; the customer sees a confirmation with an order reference; and, where the service has a workflow, the order waits for a member of staff — an admin, a manager or a team member — to approve it under **Website Orders**, and on approval a matter is opened for the customer, fully paid and live. Payment alone opens no matter. Where the service has no workflow, the firm's admins are told to open one. A payment confirmed twice, or an order approved by two people at once, opens one matter. A refunded order cannot be approved. A payment for the wrong amount is held for review. Staff see every order under **Website Orders**.

**Client dashboard before approval (#242)** — **Given** a client paid for a service on the website and the firm has not yet approved it, and the client has no open matter, **Then** their dashboard keeps its layout and four cards but shows **Payment status** (Paid / Under review / Refunded), **Matter status** (Pending approval / Cancelled), **Amount paid** and **Service requests**, with a **Pending approval** notice that the payment was received and the team is reviewing the request. It never shows ₹0 amount due or workflow progress in that state. When the order is approved its matter appears and the usual cards (Needs you, In progress, Amount due, Completed) return on the next refresh. Payment and approval stay separate statuses. A client who already has matters sees the usual cards plus a **Waiting for approval** list of their unapproved requests. A request cancelled and refunded before approval shows as **Refunded** (or Refund in progress) with the amount, status and reason, and the notice reads **Service cancelled**.

**Refund log (#240)** — **Given** an admin or manager opens a matter → Payments → **Refund History** (or a website order not yet approved, under Website Orders → Details), **Then** they can record a refund: reason, refund amount, initiation date, transaction id and status (Initiated, Processing, Successfully Credited, Failed). The client name, matter and the payment amount are taken from the matter or order, not typed. The refund amount, with every refund that has not failed, may not exceed the amount paid. Status is changed **by hand** — Razorpay's refund API is not connected, so the refund itself is made in Razorpay or at the bank. Successfully Credited needs the transaction id; Credited and Failed are final (a retry is a new refund). A refund never changes the payment history: amount paid stays what was received and the log shows **Net received** beside it. A refund recorded on an unapproved order stops it being approved; when refunds credited reach the amount paid the order becomes Refunded. The client sees their own matter's refunds read-only (amount, reason, initiation date, transaction reference, status — not who recorded it), and a fifth **Refund** card on the dashboard (total refunded or on its way, with the latest status and reason) only when they have a refund. Team members do not see refunds. Another client's matter answers "not found".

**Website cart (#244)** — **Given** a customer adds several services to the cart (from a plan's "Add to Cart" in the checkout), **Then** a cart icon in the header shows how many services it holds; the cart page lists each service with its plan and price, lets the customer change a service's plan or remove it, and shows the price, the GST and the total; and one checkout pays for all of them in a single payment. One plan per service (another plan of a service already in the cart replaces it), no quantities, at most 10 services. The server prices every service from the catalogue — the cart sends only plans. The order waits for ONE approval under **Website Orders**, which opens one matter per service, each fully paid with what was paid for that service (GST included). A service with no workflow is listed for staff to open by hand. The confirmation page and the confirmation email list every service. The cart is kept in the browser and is emptied once paid; it is shown only where online payment is switched on.

**Website prices (E24-S01)** — **Given** an admin opens Settings → Website Prices and changes a plan's price, **Then** the website shows the new price within a couple of minutes and a payment for that plan is charged that amount. A manager can change prices too (#241); no other role can view or change them. At least one plan of a service stays on sale.

**Trademark user type (#221)** — **Given** a customer opens Trademark Registration on the website, **Then** above the four plans they must choose **Proposed to be Used** or **Prior User**; nothing is chosen for them, and Buy Now with no choice asks them to choose first. Prior User adds an extra charge (₹2,500 unless the firm changes it under Website Prices — admins and managers) to every plan, before GST and before any coupon; every card's price changes at once, and the checkout shows the user type and the final amount. The server works the amount out from the plan and the user type — the page cannot set it — for Buy Now and for the cart, which keeps and shows the user type and lets it be changed. Website Orders shows the user type, the plan price and the extra charge; the matter opened on approval shows them in its payment note.

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
8. **Given** a client is added, **Then** they appear on the Clients list straight away, however many clients the firm has (#277).
9. **Given** a client's name is changed (by staff or by the client), **Then** every matter of that client shows the new name — in lists, the matter, reports and later emails (#277).

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
6. **Given** a client sends a message in a matter's Discussion (#200), **Then** the matter's owner and everyone assigned to its current step each receive one notification and one email; if the matter has neither, the admins do.
7. **Given** staff send a client a reminder, or post a Discussion message visible to the client (#207), **Then** the client receives exactly one email for it, alongside the in-app notification.
8. **Given** a user writes a step comment, a note to the client or a Discussion message of up to 1,000 words (#194), **Then** it is saved in full and shown folded behind "Read more" when long; **Given** it exceeds 1,000 words, **Then** it is refused with the actual word count and nothing is saved.
9. **Given** a user opens a matter from a report, the dashboard, a client's page or search and presses Back (#208), **Then** they return to that page; a report's filters are part of its address and are still applied.
10. **Given** an admin or manager creates a matter from the Matters page or a client's page (#211), **Then** the new matter opens, and Back returns them to the page they created it from.
11. **Given** a step becomes someone's to work — when a matter is created already paid, when an admin approves a matter created with no payment (every automatic GST return matter), or when the matter moves on to that step (#293), **Then** every team member assigned to the step receives one notification and one email; if nobody is assigned, the matter's owner does.

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

### User Story 15c — Coupon Codes at the Website Checkout (Priority: P2) — #256, #257, #260

A client lowers what they pay on the website only by entering a valid coupon code. Admins and managers manage the codes; a report records every use. (E-27.)

**Acceptance Scenarios**:

1. **Given** an admin or manager opens Settings → Coupons and creates a coupon, **Then** they choose a unique code (3–30 letters, numbers or hyphens; a code already used is refused), a **discount type** — a percentage (1–100) or a fixed amount in whole rupees — a **coupon type** — General (every service, the whole cart), Specific services (only the services chosen) or Minimum order amount (the whole cart once its price before GST reaches the amount) — and a **validity** — One-time use, or a Time period of 7 days, 30 days or chosen dates (India time, from the start of the first day to the end of the last). They can edit it, switch it off and on, and delete it while nobody has used it. A team member, client or professional cannot reach the screen or the API.
2. **Given** a signed-in client at checkout on the website enters a code and presses Apply, **Then** the server checks it and the checkout shows the original price, the discount (with the code), the GST and the final amount; Pay charges exactly that. The discount comes off the price **before GST**; GST is worked on the discounted price. A fixed amount is never more than the services it applies to cost, and is shared across them in proportion to price. A code that would leave less than ₹1 to pay is refused.
3. **Given** a code that cannot be used, **Then** the client is told why: it is not valid (unknown or switched off); it "can be used from" a date; it "expired on" a date; it "has already been used"; it "is being used in another checkout. Try again in a few minutes."; "This code applies only to: <services>."; or "This code needs an order of at least ₹X before GST — add ₹Y more." The client can always remove the code and pay without it.
4. **Given** a one-time code, **Then** the checkout that applies it holds it for 30 minutes (another person is turned away meanwhile; the same client coming back is not); when that order is paid the code is used up and switched off for everyone. A time-period code can be used by any number of clients until its last day.
5. **Given** the page sends an amount or a discount, **Then** the order is refused (400); the server prices every order from the plans and the code alone.
6. **Given** a paid order used a code, **Then** Reports → Coupon & Discount shows that use — code, discount type and value, who created the coupon and when, the client's name and email, the services, the original amount (before GST), the discount, the final amount paid and the date — plus the number of uses per coupon, with a date filter and CSV export. Editing or switching off a coupon later does not change what the report says happened. Website Orders, the payment result page and the confirmation email show the code and the discount.

---

### User Story 15b — Additional Payment Requests with a Fee Breakup (Priority: P2) — #222

Staff ask a matter's client for an additional payment — typically government fees — listed fee by fee, and the client pays the total online.

**Acceptance Scenarios**:

1. **Given** an admin, manager or team member is on a matter's Payments tab, **When** they add one or more fees (name, optional description, amount), add or remove fees and press Send, **Then** the request is stored with a total the SERVER computes from the fees, the total is added to the matter's total cost (so the amount due and payment status include it), and the client is notified in the portal and by email with the breakup.
2. **Given** the request body carries a `total` or any field other than the fees and an optional note, **Then** it is refused (400). A fee with no name, a non-positive amount or more than two decimals is refused.
3. **Given** the matter has no total cost, **Then** a request cannot be sent (409 `NO_TOTAL_COST`).
4. **Given** a client opens their matter's Payments tab, **Then** they see each open or paid request with every fee, its amount and the total, and a "Pay ₹<total>" button on an open one; the amount is the request's stored total. Pay Now offers only the rest of the amount due.
5. **Given** the gateway confirms the payment, **Then** the request becomes paid and one payment of its total is added to the payment history, once — a repeated confirmation or a second order changes nothing.
6. **Given** an admin or manager, **Then** they can cancel an unpaid request (its total comes off the total cost) or record it as paid some other way. Team members and clients cannot.
7. No GST is added to a request: the fees are charged as entered.

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

### User Story 18 — Trademark Reports and Company Worksheets (Priority: P1) — #210, #217, #280

The firm's Excel registers live in the portal: five **Trademark Reports** (TM Master, Register TM, Opposition Raised, Opposition Received, TM Assignment) at `/reports/trademark`, and fourteen **Worksheets** (Incorporation, Auditor Master, KYC, Annual Filing, ROC Register, Strike Off, Auditor Registration (ADT-3), Startup Odisha, Startup India, GST, TDS, Udyam, Professional Tax, FSSAI) at `/worksheets`. Each page has a dropdown of its sheets.

**Acceptance Scenarios**:

1. **Given** an admin, manager or team member, **Then** they can view and edit every sheet; only an admin can add, hide or delete columns, or delete a record. Clients and professionals cannot reach either page or its API.
2. **Given** a trademark is added to TM Master and Register TM, **When** its client is changed in one report, **Then** the other report shows the change — one record per trademark.
3. **Given** a Registration Date or a Date of Last Renewal / First Application, **Then** the 9, 9.5, 10, 10.5 and 11-year milestones are calculated (not typed).
4. **Given** an .xlsx file, **When** it is uploaded, **Then** a preview shows how many records will be added and updated (matched by Application No., or the sheet's own key) and which headings were not recognised; nothing is written until the user applies it, and blank cells never clear existing data. Logos inside the Excel file are not imported.
5. **Given** any sheet, **Then** every column can be filtered and sorted both ways, a search highlights and narrows to matching rows, and Download Excel exports the rows on screen.
6. **Given** a KYC row with a filing date, **Then** Next KYC Due is three years later, and every admin and manager is notified 30 days and 7 days before, and on the day — once each.
7. **Given** a sheet linked to services, **Then** a record can link to a matter of one of those services and shows a link to it.
8. **Given** the TDS Sheet (#280), **Then** its columns are the firm's Excel file's, in its order and spelling: Sl. No., Company Name, Assigned to, Checker, Client, TAN NO, USER ID, Traces Password, IT Password, TDS Data Received, Excel Prepared, Final Excel Mail to Client, Challan paid by client, SALARY (Form 138) FILING DATE, NON-SALARY (form 140) FILING DATE, SALARY (Form 138) PR NO, NON-SALARY (form 140) PR NO, STATEMENT STATUS 26Q (Form 140), STATEMENT STATUS 24Q (Form 138). Sl. No. is the row number (shown and downloaded, skipped on upload); an upload matches rows by TAN NO.
9. **Given** a dropdown column (the yellow columns of the firm's files), **When** an admin, manager or team member adds, renames, re-orders or removes its choices under **Edit dropdowns**, **Then** the new list is offered at once when adding or editing a record, and an upload matches the new spelling. Records keep the value they hold: a renamed or removed choice stays on the rows that use it.

---

### User Story 19 — GST Return Filing sheet under Reports (Priority: P1) — #279

The firm's GST return register at `/reports/gst-returns` (a tile on the Reports hub and on the dashboard of admin, manager and team member): one row per client per return period, with a **Monthly / Quarterly** dropdown at the top, the firm's columns (GST Return Clients, CONSTITUTION, GSTN No, Mail ID for data collection, GST User ID, GST Pswd, Contact No., Assign Person, Current Status, Data Received, Tally/ Excel Prepared, Date of GSTR-1 Filing, GSTR-1 Filed Mail, GSTR_2B Reco Mail to Client, Additional Data or Confirmation Received from Client, Challan Mail to the client, Challan paid by client, Annual Working Sheet Update, Date of GSTR-3B Filing, Completion Check, Remarks), plus Return Period and Matter at the end, and the worksheet features (Add record, Upload Excel, Edit columns, Edit dropdowns, Search, filters, Download Excel).

**Acceptance Scenarios**:

1. **Given** a matter of a linked GST service (by default GST Return Filing monthly and quarterly), **When** the sheet is opened, **Then** the matter has a row in Monthly or Quarterly (the matter's GST period, else the service, else the client's GST return setting) with the client's name, constitution, GSTIN, email and mobile, the period, the current task as Current Status, its assignee as Assign Person, a link to the matter, and — for each column whose task the workflow has (matched by the task's name) — Yes or the completion date once that task is completed; Completion Check is Done when the matter is completed.
2. **Given** a later change in the matter (a task completed, approval, a stop), **When** the sheet is opened again, **Then** the row shows it. A cell a person typed keeps the typed value until the workflow changes that same cell; then the workflow's value shows (last change wins). GST User ID, GST Pswd and Remarks are never filled from the workflow.
3. **Given** Monthly and Quarterly, **Then** they show different records: a record is in one of them only, an upload to one never updates the other, and a record of one is not reachable through the other.
4. **Given** a row typed or uploaded for the same GSTIN and period before the matter existed, **Then** the matter's row is that row (it is linked, not duplicated).
5. **Given** the yellow columns (CONSTITUTION, Assign Person and the eight Yes/No status columns), **Then** an admin, manager or team member edits their choices under Edit dropdowns; Monthly and Quarterly share them. Constitution starts with Company, Partnership, Proprietorship, OPC, LLP, Section 8; Assign Person starts empty.
6. **Given** a client or professional, **Then** neither the page nor its API is reachable; only an admin changes columns or deletes a record.

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
state?, businessName?, referenceGroup?,
// client contact person (#205):
altPhone?, contactDesignation? (Owner|Director|Accountant|Manager),
groupCompany?, professionalUid?
```

### `clientDatabase/{clientUid}` — the Client Database's own values (#205)
```
// Backend-only. One doc per client, id = the client's uid. A field absent here
// shows the value derived from users/{uid}; a field present (even '') wins.
clientName?, contactPerson?, contactDesignation? (Owner|Director|Accountant|Manager|''),
phone?, altPhone?, email?, altEmail? (comma-separated), address?,
clientSince? (YYYY-MM-DD), updatedAt, updatedBy
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
clientName,       // copy of the client's profile name; rewritten on every matter when the client is renamed (#277)
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

### `tasks/{taskId}/refunds/{refundId}` and `paymentOrders/{orderId}/refunds/{refundId}` — refund log (#240)
```
refundAmount, paymentAmount (server: amount paid when recorded), reason,
initiatedAt (YYYY-MM-DD), transactionId?, status (initiated|processing|credited|failed),
clientUid, clientName, taskId?, orderId?, serviceName,
recordedBy, recordedByName, recordedAt, updatedAt,
statusHistory[{ status, at, by, byName }]
// The parent (task or order) carries refundSummary:
//   { count, activeTotal, creditedTotal, latest{ status, refundAmount, reason, initiatedAt, transactionId } }
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

### `tasks/{taskId}/paymentRequests/{requestId}` — additional payment requests (#222)
```
lines[{ name, description|null, amount }], total (server sum of lines), note|null,
status (sent|paid|cancelled), createdBy, createdByName, createdByRole, createdAt,
totalCostBefore, paidAt|null, paidVia (online|recorded)|null, orderId|null,
paymentId|null (ledger row `request-<requestId>`),
cancelledAt?, cancelledBy?, cancelledByName?, cancelReason?
```

### `paymentOrders/{orderId}` — website orders (E24, #212, #220, #244)
```
uid, customer { name, email, phone }, kind? (matter_balance — #220 Pay Now | payment_request — #222, with taskId + requestId),
productKey, productCode, planId, label, planName, serviceKey,   // null/"N services" on a cart order
price, gst, gstPercent, amount (= charged: price + GST), currency,
items?[ { productKey, productCode, planId, label, planName, serviceKey,   // #244: only on a cart order
          price, gst, gstPercent, amount,
          matter { state (none|awaiting_approval|created|failed|not_applicable), taskId?, error?, reason? } } ],
status (created|paid|review|failed|abandoned|refunded), gateway, gatewayOrderId,
gatewayPaymentId?, method?, amountPaid?, settledBy?, paidAt?, refundedAt?, failureReason?, reviewReason?,
matter { state (none|awaiting_approval|pending|created|failed|not_applicable | balance|crediting|credited|credit_failed),
         taskId?, error?, reason?, approvedBy?, approvedByName?, approvedAt? },
createdAt, updatedAt
```
A one-service order has no `items` and is stored exactly as before #244. On a cart order the
top-level price / gst / amount are the sums of the lines, and each matter it opens carries
`websiteOrderId` and `websiteOrderItem` (the line number).

#256 — an order priced with a coupon code also has (an order without one has none of these):
```
couponCode, discount (rupees off, before GST — the sum of the lines'), subtotalBeforeDiscount,
coupon { discountType, discountValue, scope, validity, productKeys?, minAmount?, createdBy, createdAt },  // the terms on the day
items[].listPrice, items[].discount      // (top level on a one-service order)
```
`price`, `gst` and `amount` are AFTER the discount (GST worked on the discounted price).

#221 — an order (or cart line) for a product that asks a question (trademark's user type) also has
`optionId, optionName, optionLabel, basePrice (the plan's own price), surcharge`; `price` is
basePrice + surcharge and `planName` names the answer ("Supreme (Prior User)"). The matter it opens
carries `websiteOrderPlanName` and `websiteOrderOption { label, id, name }`. In
`pricingCatalog/{productKey}` the question is `choice { label, options[{ id, name, surcharge }] }`.

### `coupons/{CODE}` — coupon codes (#256, #257, #260)
The document id is the code (upper case, `[A-Z0-9-]{3,30}`), so each is unique. Backend only.
```
description, discountType (percent|fixed), discountValue (whole % 1–100 | whole rupees),
scope (general|services|min_amount), productKeys[] (services), minAmount|null (min_amount, before GST),
validity (one_time|period), startsAt|null, endsAt|null (period: IST start of first day → IST end of last),
active, usedCount, lastUsedAt?,
heldBy { orderId, uid, until }|null      // one_time: a checkout in progress, 30 minutes
consumedBy { orderId, uid, at }|null     // one_time: the payment that used it
createdBy { uid, name }, createdAt, updatedAt, updatedBy { uid, name }
```

### `couponRedemptions/{orderId}` — one per paid order that used a code (#256)
Written once, in the transaction that marks the order paid. Backend only.
```
orderId, code, discountType, discountValue, scope, validity, couponCreatedBy { uid, name }, couponCreatedAt,
uid, clientName, clientEmail,
services[ { productKey, label, planName, listPrice, discount, price, gst, amount } ],
originalAmount (before discount and GST), discount, gst, amountCharged, amountPaid, paidAt, gateway,
note?   // e.g. a payment that arrived after its one-time code had been used by another order
```

### `auditLog/{entryId}`
```
entityType (task|step|document|user|payment), entityId,
action, performedBy, performedAt, previousValue?, newValue?, note?
```

### `worksheetRecords/{id}` — Trademark Reports and Worksheets (#210, #217)
```
module (trademark|company|gst_return), book, sheets[] (sheet keys the record appears in),
values { fieldKey: string|number },  // calculated fields are derived, not stored
recordKey,            // normalised key fields (Application No.; DIN|FY …), unique per book
images { fieldKey: { objectPath, contentType, updatedAt } },  // streamed, never signed
reminderDue?, remindersSent { "<due>:<days>": iso },        // KYC reminders
createdAt, createdBy, updatedAt, updatedBy, source? ("excel" | "matter")
sourceMatterId?,      // #279: the GST return matter a GST Return Filing row comes from
derived?,             // #279: { field: what the workflow last said } — "last change wins"
```

### `worksheetConfig/{book}` — the firm's column edits
```
customFields[{ key, label, type, options? }],
sheets { sheetKey: { columns[{ key, label, hidden }], linkedServices[] } },
optionOverrides { fieldKey: [option] },   // #280: staff-edited dropdown choices (any select)
updatedAt, updatedBy
```

---

## Non-Functional Requirements

### Delivery Phases
- **Phase 1**: Responsive web app only (`Portal/` — Vite + React + TypeScript). Target: Chrome/Safari/Edge on desktop, tablet, and mobile browser. No native app build yet.
- **Phase 2**: Capacitor wrapper for Android/iOS after web app is stable and validated.
  - **Android app requirements** (E-26): same roles, screens and permissions as the website,
    from the same code. Android 7+ with a WebView of Chrome 111 or newer (otherwise a message
    asks the user to update it). Google sign-in uses the phone's own account picker. Documents,
    exports and images open in the phone's own viewer or share sheet. Emailed sign-in and
    password links open the app. Uploads follow the website's rules (10 MB; PDF, JPG, PNG, DOCX,
    Excel). Push notifications are not yet built.
  - **iPhone app requirements** (E-29): the same roles, screens and permissions from the same code;
    iOS 15+, iPhone only. Sign-in: email + password, the emailed sign-in link, native Google, and
    **Sign in with Apple** (App Store rule 4.8; also offered on the website once switched on, never
    on Android for the first release). Documents open in the system viewer / share sheet; emailed
    account links open the app (Universal Links).
  - **Account deletion** (E29-S08, both apps and the website): any signed-in person except an Admin
    can ask for their own account to be deleted (`/account/delete`). The sign-in is disabled at once,
    the admins are emailed, the Users page marks the person "Deletion requested", and an Admin
    completes it with the normal delete within 30 days. Records the firm must keep (matters,
    invoices, payments, filed documents) are kept.
  - **Environments** (D7, 2026-11-11): both apps are built for **QA by default**; a production build is
    chosen explicitly at build time. A QA build is a separate app named "Legal Terminus QA"
    (`com.legalterminus.app.qa`) that installs next to the production app and accepts only the QA
    test accounts.
- **Phase 1 workflow scope**: Company Incorporation only. All other services (Trademark, GST, UDYAM) follow in Phase 2 as XState config files.

### Workflow Engine (XState v5)
- Every workflow service is a `createMachine({...})` configuration file — no bespoke logic per service.
- Shared building blocks (guards, actions, actors) live in `Portal/src/workflows/shared/`.
- Individual workflow configs live in `Portal/src/workflows/configs/` (e.g. `companyIncorporation.machine.ts`).
- Backend exposes `POST /api/tasks/:taskId/transition` — accepts event, hydrates snapshot, sends event, persists new snapshot.
- Frontend uses `useMachine` (or `useSelector` on a service actor) to render the current step reactively.

### Security & Auth
- **Authentication**: Email/password + Google Sign-In + Sign in with Apple (iPhone app; website when switched on — E29-S11) + one-time email sign-in link (#203) via Firebase Auth; account emails link to the portal's own `/account/action` page, never to Firebase's hosted page; email OTP for first login on mobile (Phase 2)
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
- **CORS** (Phase 2): the allowlist is exact, in `backend/src/config/corsOrigins.js`. A native app's origin is added per deployment through `CORS_ORIGINS`: QA has `https://localhost` (Capacitor on Android), `capacitor://localhost` (Capacitor on iOS — accepted as that one exact string, E29-S03) and `http://localhost:5173`; production gets the apps' origins when a release build is ready.

## Website redesign in Theme C (#209, E-25)

The website is restyled to the approved Theme C concept with **no change to content**
(text, links, images, video) and the site's existing green palette. The design is a
shared stylesheet applied to every page, so later changes apply site-wide. It is built
on the QA website behind a build switch and reaches the live site only after the firm
signs off on #209. Three content faults carried over from the current site (Private
Limited FAQ answers describe a Public Limited company; "Registration Srvices"; two
price sets for the Private Limited plans) are left as they are until the firm answers.
