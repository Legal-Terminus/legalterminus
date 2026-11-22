# Agent recipes — step-by-step workflows

> Loaded on demand. The always-on rules are in `.github/copilot-instructions.md` (also `AGENTS.md` / `CLAUDE.md`), which says when to read this file.

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
