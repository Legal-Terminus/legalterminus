# Mobile App Requirements — FINAL

> Source: `MOBILE APP REQUIREMENTS - FINAL.pdf`  
> Converted: 2026-05-31

---

## User Roles & Permissions

### Role Summary

| Role | Access Level |
|---|---|
| Admin | Full Access |
| Manager | Maximum Access |
| Team Member | Limited Access |
| Client / User | Very Limited Access |

---

### 1. Admin

- Full access to all system features and functionalities.
- Complete control over users, workflows, tasks, and reports.
- **Admin-Based Client Registration**: Admin can create and manage client profiles directly from the system with email verification.

---

### 2. Manager

- All permissions equivalent to Admin, **except**:
  - Cannot delete any data or records.
  - Can create a task without any payment, subject to **approval from Admin**.

---

### 3. Team Member

- Can access and work on assigned tasks.
- Can create new tasks.
- Can create tasks with full payment or partial payment, subject to **approval from the Manager**.
- Can reassign tasks to other team members.
- The reassigned team member has the option to **accept or reject** the task.
- **Restricted from viewing reports.**

---

### 4. Client / User

- Can view and track only their own list of tasks.
- Can upload documents whenever required as per the workflow step.
- Can access the **delay summary report**, if any.
- No access to other users' tasks or system data.

---

## User Creation

### Team Member — Required Profile Fields

#### Personal Information
- Full Name
- Father's Name
- Date of Birth
- Residential Address
- Contact Number

#### Professional Information
- Official Email Address
- Designation
- Role Assignment (Admin / Manager / Team Member / Client)
- Date of Joining

> Add and edit options must be available.

---

### Client — Required Profile Fields

#### Basic Information (Mandatory fields marked)
- Name *(Mandatory)*
- Organisation Name
- Mobile Number *(Mandatory)*
- Address *(Mandatory)*
- Email ID — Organisation and/or Personal; **multiple email IDs supported**

#### Identification Details
- GST Number
- Aadhaar Number
- PAN Number

#### Email Usage
The selected email ID(s) will be used for:
- Login Verification
- Workflow updates
- Notifications and alerts
- Ongoing discussions and correspondence

> Add and edit options must be available.

---

## Workflow Creation

### Step-Based Workflow Execution

- Workflows are structured in a **sequential, step-by-step** manner.
- Each step must be completed before initiating the subsequent step.
  - Example: Step 2 can begin only after Step 1 is successfully completed.

### Parallel Task Execution

- Certain tasks may be configured to run **simultaneously** where applicable.
  - Example: "Name Approval" and "DSC" processes can be executed in parallel.

### Payment-Based Workflow Control

- No task will be initiated until full or part payment is received.
- A task can be initiated **without payment only with Admin approval**.
- A task can be **blocked on any specified step** pending balance payment; it cannot be performed until payment is received.

---

## Payment Notifications & Reminders

- Automated payment reminders sent via:
  - In-application notifications
  - Email alerts
- Pending payments must be **visually highlighted** (e.g., blinking indicator).
- Automated reminder emails sent at **configurable frequency** (daily, alternate days, or custom intervals) when steps are blocked due to payment.

---

## Visual Indicators for Task Status

- Tasks blocked or pending due to dependencies (payment or approvals) must be **highlighted in red**.
- Urgent tasks marked by Admin/Manager must be **visually emphasised** (e.g., blinking or highlighted).

---

## Automated Communication

- Email notifications automatically triggered at **every stage** of the workflow.
- Clients receive **real-time updates** for each completed or pending step.

---

## Document Management System

- Both clients and team members can **upload and download** documents within the application.
- If a document is missing, incorrect, or unclear:
  - The team can raise a query within the system.
  - The client receives an in-app notification **and** an email.
  - Emails must include a **direct link** to the relevant application page.

### Document Upload Guidelines

- Clear instructions must be provided for each upload:
  - File format (e.g., PDF)
  - Maximum file size (e.g., XX MB)
  - Required format (e.g., scanned copy, colour copy, etc.)

### Document Management Enhancements

- No limit on document uploads (or configurable limit).
- **Re-upload option** for corrected documents.
- **Email notification** triggered on re-upload.

### Document Rejection Remarks

- When rejecting a document, the team **must** provide a mandatory remark explaining the reason.

---

## Auto Data Cleanup Policy

- Documents stored for **1 year**.
- Auto-deletion will occur after 1 year.
- Clients notified to download their documents before deletion.
- **Optional paid storage extension** should be available if the client declines deletion.

---

## Storage Limit & Alerts

- Define storage limits per client.
- Notify users when usage approaches or exceeds the limit.
- Option to purchase additional storage.

---

## Payment Integration

- A secure and user-friendly payment option should be integrated within the system for seamless transactions.

---

## Timeline & Escalation Management

- Each step has a predefined timeline/deadline.
- If a task exceeds the assigned timeline:
  - Automated notifications sent to the responsible team members.

---

## Internal Communication

- All internal team communication should be conducted **within the application** to maintain proper tracking and records.

---

## Role-Based Step Assignment

Each task step is assigned to either:
- A specific **team member**, or
- The **client** (where action/input is required from the client side)

---

## Priority & Urgency Control

- Admin/Manager can mark tasks or steps as **urgent**.
- Urgent tasks visually highlighted (blinking indicator) for immediate attention.

---

## Email Template & Customisation

- Predefined email templates with customisation options for:
  - Branding
  - Content
  - Communication tone

---

## Team Member Replacement

- Admin/Manager can reassign all tasks, workflows, and responsibilities from a departing team member to another.
- Automatic re-assignment if possible.

---

## Email Delivery Failure Alerts

- System notifies Admin/Manager if emails fail due to:
  - Invalid email address
  - Full mailbox
  - Delivery issues

---

## Secure Login Verification

- Login via **email OTP** verification.
- **Mobile OTP** verification for first-time login.

---

## Service Listing Interface

- Display all services with pricing and brief details.
- Show a limited number (e.g., top 20 services) with an option to redirect users to the website for full details.

---

## Approval/Rejection Correction Option

- Clients can request changes or **correct mistaken approvals or rejections** on any step.

---

## Support Contact Integration

- Dedicated support section with contact details (call, email, or chat support).

---

## Notification Pop-up

- System for sharing news, notifications, updates, and offers via:
  - In-app notification pop-ups
  - Email
  - Web application pop-ups

---

## Work Assignment / Task Creation

- Task created by associating a **Client + Workflow**.

---

## Reports

> Available to Admin. Comprehensive visibility and monitoring of all system activities.

### Client-wise Work Report

1. Detailed client-wise reports accessible to both **Admin and Client**, including task progress and timelines.

2. View of all tasks:
   - List of all tasks
   - Completed tasks
   - Pending tasks

3. Tasks tracked by completion status and payment status:
   - **Completed Tasks**: Fully Paid / Partially Paid / Not Paid
   - **Pending Tasks**: Fully Paid / Partially Paid / Not Paid

4. Revenue and workload distribution by service category:
   - Company Registration
   - Trademark Registration
   - GST Services

5. Workload monitoring and task redistribution:
   - Pending tasks per team member (with reassign option)
   - Completed tasks per team member

6. Categorisation of pending tasks:
   - **Time-based**: 0–2 days / 3–5 days / More than 5 days
   - **Reason-based**:
     - Blocked due to Payment
     - Pending from Internal Team (LT)
     - Pending from Client
     - Pending from Department
     - Pending for Action
     - Pending for Approval

7. Incoming payments by mode:
   - Bank Transfer / Cash / UPI / Cheque / Credit Card

8. Billing and collections monitoring:
   - Monthly Payment
   - Advance Payment
   - Payment after Completion of Task

9. Master sheets: GST Master Sheet, Company Incorporation Sheet, Trademark Sheet.

10. **"List of clients" report** with specific reference & groups.

11. **Delay Report** (in days):
    - Due to LT
    - Due to Client
    - Due to Department

12. **Storage report** per client — when to purchase additional storage.

13. **Client login mapping**: Single Email → Multiple Clients, Single Client → Multiple Emails.

---

## Views

### Admin View

The Admin dashboard provides a complete overview:
- All workflows (list and detailed view)
- Task status across all users
- Reports and analytics
- Payment status and pending alerts
- User management and role control
- Notifications and escalations
- Urgent and blocked tasks (highlighted for quick attention)

### Team Member View

Focused on task execution and coordination:
- Assigned workflows and tasks
- Task status updates (Pending / In Progress / Completed)
- Task reassignment options
- Notifications for approvals, deadlines, and escalations
- Internal communication (chat/discussion within the app)
- Restricted access to reports (as per permissions)

### Client View

Simple and user-friendly, with limited access:
- View and track own workflows/tasks
- Upload/download required documents
- Receive notifications and updates
- Payment status and payment options
- No access to reports or other users' data

#### Client Task Detail — Three-Tab Layout

For each service task, the client sees three tabs:

| Tab | Content |
|---|---|
| **Steps** | Which step is pending, completed, or in progress |
| **Documents** | Documents provided, approved, and rejected (with details) |
| **Payments** | Whether the service is fully paid, not paid, or has an amount due |
