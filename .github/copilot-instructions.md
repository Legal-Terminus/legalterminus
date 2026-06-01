# Legal Terminus - Copilot & BMad Instructions

> **Single Source of Truth** — Copilot chats and BMad agents read this file for all project rules and workflows. All updates happen here.

---

## 🎯 Task Completion Checklist

**CRITICAL: Before declaring ANY task complete:**

- [ ] Code implemented and tested locally
- [ ] All files committed to feature branch
- [ ] **Epic story status updated:** `_bmad-output/planning-artifacts/epics.md` (mark ✅ Completed, 🔄 In Progress, or ⏳ Not Started)
- [ ] **Requirements updated if changed:** `spec.md` (user stories, workflows, Firestore schema, roles/permissions)
- [ ] **Technical decisions documented:** `_bmad-output/planning-artifacts/architecture.md` (service layers, components, database changes, integrations)
- [ ] Error messages are user-friendly (no Firebase error codes)
- [ ] Build passes clean (no TypeScript errors)
- [ ] Backend/Frontend/Portal are all in sync if applicable

**Key Rule:** Every commit must reference the related epic/story ID (e.g., "E01-S02: Implement Google Sign-In")

---

## 📂 Key File Locations

```
/Users/ankygoyal/Documents/git/legalterminus/Legal-Terminus/
├── _bmad-output/planning-artifacts/
│   ├── epics.md              ← Story status + implementation notes
│   └── architecture.md       ← Technical design decisions
├── spec.md                  ← Feature specifications + workflows
├── docs/
│   └── constitution.md      ← Core principles (reference only)
├── Portal/                  ← Main app (Vite + React + TypeScript)
│   ├── src/
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
9. ✅ Create feature branch + PR with epic/story reference

### When adding a new Report or Admin feature:
1. ✅ Create backend controller endpoint (`backend/src/controllers/`)
2. ✅ Create frontend page in Portal (`Portal/src/pages/`)
3. ✅ Create or update Firestore indexes in `firestore.indexes.json`
4. ✅ Define TypeScript types (`Portal/src/types/`)
5. ✅ Add role-based access control checks (admin/manager only)
6. ✅ Update `spec.md` with new fields or workflow changes
7. ✅ Update `epics.md` story with acceptance criteria + file paths
8. ✅ Test CSV export if applicable + mobile responsiveness
9. ✅ Create feature branch + PR

### When refactoring code into a service layer:
1. ✅ Identify common logic across multiple controllers (e.g., user creation, email sending)
2. ✅ Create service file: `backend/src/services/serviceNameService.js`
3. ✅ Export pure functions (no controller/route logic)
4. ✅ Handle errors but don't send responses (let caller handle HTTP status)
5. ✅ Update all callers (controllers/routes) to use service functions
6. ✅ Document service in `architecture.md` → Service Layer section
7. ✅ Test all entry points still work (e.g., team-members, clients, auth)
8. ✅ Update `epics.md` with refactoring story
9. ✅ Create feature branch + PR

### When fixing a bug:
1. ✅ Identify root cause (document in commit message)
2. ✅ Fix code + add inline comment explaining why
3. ✅ Test fix locally (especially auth flows, Firestore writes, email sending)
4. ✅ Update `epics.md` if related story needs status update
5. ✅ Commit with `fix:` prefix + issue/story reference
6. ✅ Create feature branch + PR

### Code Review & PR Process:
1. **Branch naming:** `feature/story-id-description` (e.g., `feature/E01-S02-google-signin`)
2. **Commit messages:** `[STORY-ID] Brief description` (e.g., `[E01-S02] Add Google Sign-In button`)
3. **PR description:** Link to epic/story + key changes + testing notes
4. **Before merge:** Verify Task Completion Checklist ✓
5. **After merge:** Update sprint status in `epics.md`

---

## 🛠️ BUILD & RUN COMMANDS

**Always use these commands (from project root):**

| Service | Build Command | Run Command | Port | Working Directory |
|---------|---------------|------------|------|-------------------|
| Backend | `npm run build:backend` | `npm run start:backend` | 5001 | `/backend` |
| Frontend | `npm run build:frontend` | `npm run dev:frontend` | 5174 | `/Frontend` |
| Portal | `npm run build:portal` | `npm run dev:portal` | 5173 | `/Portal` |
| All Combined | `npm run build:all` | `npm run dev:all` | 5001/5173/5174 | Root |

```bash
# From project root
npm run build:all      # Build all services
npm run dev:all        # Start all services in parallel
npm run start:backend  # Backend only (5001)
npm run dev:portal     # Portal only (5173)
npm run dev:frontend   # Frontend only (5174)
```

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
- `.agents/skills/` — 44 BMAD skills available as agent instructions
- `.github/agents/` — 6 BMAD agent command files for GitHub Copilot
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

## 📋 Current Sprint Status (Sprint 4)

**Completed:**
- ✅ Portal frontend scaffold
- ✅ Auth system (email, Google, signup, forgot password)
- ✅ Reports (All Tasks, Completed, Pending, Master Sheet)
- ✅ Task urgent flagging
- ✅ CI/CD Portal deployment
- ✅ Hybrid auth UPSERT system (team members + clients + Google merge)

**In Progress:**
- 🔄 Manual testing of all auth flows
- 🔄 Error message UX improvements
- 🔄 End-to-end test automation

**Next:**
- ⏳ Firestore rules deployment
- ⏳ Production release

---

## ⚙️ Workspace Rules

1. **Every commit must include epic/story status** if work is story-related
2. **No PR without updated spec.md** if requirements changed
3. **All error messages must be user-friendly** (no Firebase error codes)
4. **TypeScript strict mode** - no `any` types without justification
5. **Feature branches only** - no commits to `main` directly

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

## 🧪 TESTING WITH PLAYWRIGHT

- ⚠️ **DO NOT automatically run Playwright tests** or open browsers unless explicitly asked
- Only use Playwright when user requests: "test in playwright" or "verify in browser"
- Default behavior: Code changes only, no automatic testing

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
   - ✅ Navigate to dedicated form pages (`/admin/team-members/new`, `/admin/team-members/edit/:id`)
   - ✅ Use full-page real estate on mobile (no modal overlay)
   - ✅ Include back button to return to list
   - ✅ Wrap form in `PageShell` for consistent layout
   - ✅ Make forms responsive with Tailwind utilities
   - Example pattern:
     ```tsx
     // List page with navigation
     <button onClick={() => navigate('/admin/team-members/new')}>New</button>
     <button onClick={() => navigate(`/admin/team-members/edit/${member.uid}`)}>Edit</button>
     
     // Form page with full-screen form
     <PageShell title={uid ? 'Edit Team Member' : 'New Team Member'}>
       <div className="max-w-2xl mx-auto">
         <div className="bg-white rounded-lg shadow p-6 md:p-8">
           <form>...</form>
         </div>
       </div>
     </PageShell>
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

### Example - Full-screen form page pattern (mobile-friendly):
```tsx
// Form page with responsive full-screen layout
<PageShell title={id ? 'Edit' : 'New'}>
  <div className="max-w-2xl mx-auto">
    <div className="mb-6">
      <button onClick={onClose} className="text-sm font-medium">← Back</button>
    </div>
    <div className="bg-white rounded-lg shadow p-4 md:p-6 lg:p-8">
      <form className="space-y-3 md:space-y-4">
        {/* Full-width input on mobile */}
        <div>
          <label className="block text-xs md:text-sm font-medium mb-1 md:mb-2">Field *</label>
          <input className="w-full px-4 py-3 md:px-3 md:py-2 border rounded text-sm md:text-base" />
        </div>
        
        {/* Responsive buttons with touch targets */}
        <div className="flex gap-2 md:gap-3 pt-8 md:pt-10">
          <button className="flex-1 px-4 py-3 md:px-4 md:py-2 border rounded text-sm md:text-base">Cancel</button>
          <button className="flex-1 px-4 py-3 md:px-4 md:py-2 bg-blue-600 text-white rounded text-sm md:text-base">Submit</button>
        </div>
      </form>
    </div>
  </div>
</PageShell>
```

### When adding new components:
- Always include breakpoint tests in your commit message
- Update component in Storybook if applicable
- Tag `@mobile-tested` in PR description
