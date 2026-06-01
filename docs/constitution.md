# Legal-Terminus Constitution

**Version**: 1.0.0 | **Ratified**: 2026-05-31 | **Last Amended**: 2026-06-01

> Core principles that define how Legal Terminus works. This document is a reference guide for architects and engineers — for operational rules, see `.github/copilot-instructions.md`.

---

## Core Principles

### I. Role-Gated Everything

Every API endpoint and UI screen enforces role-based access control. The four roles are **admin**, **manager**, **team_member**, and **client**. 

- No feature may be built without explicitly declaring which roles can access it
- Firebase custom claims carry the role
- The backend `verifyToken` + `requireRole` middleware enforces it on every protected route
- Role changes propagate atomically to both Firebase Auth and Firestore

### II. Workflow Engine is the Core Product

The workflow engine — sequential steps, conditional branches, parallel tracks, payment gates, client approvals — is the primary value. All other features (documents, notifications, reports) exist to support workflow execution.

- Workflow definitions are data (stored in Firestore), not code
- New service types can be added without deployments
- Every workflow step transition must be auditable and reversible

### III. Single Source of Truth (Firebase/Firestore)

All state lives in Firestore. The existing website (Frontend/), the new Portal (Portal/), and the future mobile app share the same Firebase project, the same Firestore collections, and the same authentication.

- There is no separate database
- All read/write operations flow through Firestore
- Schema is versioned in `spec.md` and `architecture.md`

### IV. Mobile-First, Web-Compatible

The new app is built with Vite + React + TypeScript wrapped in Capacitor for Android and iOS. The same codebase serves the web browser.

- Layouts are responsive
- Touch targets are minimum 44×44px
- No feature may exist only on web or only on mobile

### V. No Silent Failures

Every workflow step transition, document upload, payment event, and email send must either succeed with a recorded outcome in Firestore or fail with a visible, logged error and a notification to the responsible party.

- Background jobs must be idempotent and retryable
- Every state change writes an audit trail entry
- Errors are user-friendly, never expose technical details

### VI. Payment Gates are Hard

No workflow step that is marked as payment-gated may be executed without confirmed payment — only an **admin** can override with explicit approval recorded in Firestore.

- Part-payment states are tracked precisely (amount paid, amount due, payment mode, date)
- Payment reconciliation is a separate workflow step
- Refunds and adjustments are immutable records

### VII. Audit Trail

Every state change to a workflow step, document status, payment record, or user role must write a timestamped audit entry.

- Audit entries are append-only and never deleted
- Each entry records: who, what, when, why
- Audit data is available to admins for compliance reporting

### VIII. Security by Default

- All inputs sanitised and length-limited at the backend boundary
- Bearer token verified on every protected route
- No sensitive data (Aadhaar, PAN, GST) exposed in list endpoints — detail endpoints only
- Documents served via signed URLs with short TTL, never public
- OWASP Top 10 compliance required

---

## Technology Constraints

### Backend
- **Runtime**: Node.js / Express (ES Modules)
- **Database**: Firebase Admin SDK, Firestore
- **Deployment**: Cloud Run
- **CORS**: Covers `capacitor://localhost` and `http://localhost` for mobile

### Authentication & Authorization
- **Provider**: Firebase Authentication (email/password + Google Sign-In)
- **Roles**: Custom claims in Firebase Auth (sync'd with Firestore `/users/{uid}`)
- **Tokens**: Bearer token (Firebase ID token) verified on all protected routes

### Storage
- **Documents**: Firebase Storage; 1-year retention policy enforced by Cloud Functions
- **Database**: Firestore; collections versioned in schema documentation

### Email
- **Provider**: Configurable (Nodemailer + SMTP/SendGrid recommended)
- **Transactional**: All emails are transactional, never marketing/bulk
- **Failures**: Logged but don't block workflow progression

### Frontend Applications
- **Portal** (new): Vite + React 19 + TypeScript
- **Frontend** (existing): Vite + React (public marketing site, service landing pages, blog)
- **Mobile** (planned): Capacitor 6 (Android + iOS + Web) — lives in `MobileApp/`
- **All**: Deployed to Firebase Hosting with CDN

### Cloud Platform
- **Provider**: Google Cloud / Firebase
- **Project**: `legal-terminus-web`
- **Region**: `asia-south2`

---

## Development Workflow

1. **Spec** — Requirements and acceptance criteria in `spec.md`
2. **Plan** — Design and architecture in `_bmad-output/planning-artifacts/architecture.md`
3. **Tasks** — Implementation tasks in `_bmad-output/planning-artifacts/epics.md` (linked to stories)
4. **Implement** — Code changes with feature branch workflow
5. **Review** — Code review + documentation updates + testing
6. **Deploy** — Feature branch PR merge → CI/CD pipeline

### Key Rules
- Backend changes must not break existing panel API consumers
- New Firestore collections require documented schema before implementation
- All user-facing copy must use clear English; avoid legal jargon in UI labels
- Every commit references related epic/story in `epics.md`

---

## Governance

This constitution supersedes all other practices. Amendments require:
1. Updating this file
2. Notifying the team
3. Recording in `epics.md` if a sprint is in progress

All implementation work derives from `spec.md` → `architecture.md` → `epics.md`.

**Disputes**: Architecture decisions disputed at implementation time should be escalated to the tech lead for resolution, recorded in `architecture.md` as a design decision.
