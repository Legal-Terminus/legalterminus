# Agent rules — index and full-text originals

> The always-on rules are `.github/copilot-instructions.md`, condensed so it stays cheap to load on every agent turn. This file keeps the full original wording of the sections that were condensed there (header, checklist, file map, vocabulary). If the two ever disagree, the main file wins.

# Legal Terminus — Agent & BMad Instructions

> **Every coding agent reads this file.** It is the single copy; the filenames
> each tool looks for are symlinks to it, so there is nothing to keep in sync:
>
> | Symlink | Read by |
> |---|---|
> | `AGENTS.md` | Cursor, Codex, Gemini CLI, Jules, Devin — the cross-vendor standard |
> | `CLAUDE.md` | Claude Code |
> | `.cursorrules` | older Cursor versions |
> | `.windsurfrules` | Windsurf |
> | `.github/copilot-instructions.md` | GitHub Copilot — **the real file** |
>
> Edit only `.github/copilot-instructions.md`. **On Windows**, clone with
> `git config core.symlinks true`.
>
> The symlinks were added on 2026-10-03 because an agent working from the
> Ambyflow repo ported four issues here without opening this file, and so
> without updating `epics.md`, `architecture.md` or `spec.md`.

> **Ownership** — this file holds **rules and workflows** only. Story/sprint **status** lives in `_bmad-output/planning-artifacts/epics.md`, **design** in `_bmad-output/planning-artifacts/architecture.md`, **requirements** in `spec.md`. Never copy their content into this file — copies rot; link instead. Copilot chats and BMad agents read this file for all project rules.

## 🎯 Task Completion Checklist

**CRITICAL: Before declaring ANY task complete:**

- [ ] Code implemented and tested locally
- [ ] All files merged to `main` through a pull request (direct pushes to `main` are refused)
- [ ] **Epic story status updated:** `_bmad-output/planning-artifacts/epics.md` (mark ✅ Completed, 🔄 In Progress, or ⏳ Not Started)
- [ ] **Requirements updated if changed:** `spec.md` (user stories, workflows, Firestore schema, roles/permissions)
- [ ] **Technical decisions documented:** `_bmad-output/planning-artifacts/architecture.md` (service layers, components, database changes, integrations)
- [ ] Error messages are user-friendly (no Firebase error codes)
- [ ] Build passes clean — run `npm run build` (Portal uses `tsc -b && vite build`). ⚠️ `tsc --noEmit` is NOT sufficient: `tsc -b` is stricter (unused vars, project refs) and is what CI runs. Always verify with the real build command before declaring done.
- [ ] **Playwright suite updated for the feature** — added/updated the matching spec in `Portal/e2e/` (+ `seed-e2e.js` fixtures if new state is needed) and it passes. See "🧪 TESTING WITH PLAYWRIGHT". Tests are part of "done", not a follow-up.
- [ ] Backend/Frontend/Portal are all in sync if applicable
- [ ] **A change ported from Ambyflow follows THIS checklist too.** Ambyflow's own
  paperwork (its manual, story files, `sprint-status.yaml`) does not count here:
  add the dated entry to the change log in `epics.md`, update `architecture.md`
  and `spec.md` in this repo, and add the row to `docs/releases/SYNC.md`.
- [ ] **Delivery is trunk-based — read `docs/delivery.md`.** A merge to `main`
  deploys to **QA** (https://legal-terminus-qa.web.app). Production is released by
  pushing a tag `vX.Y.Z-lt.N`, which waits for the owner's approval in GitHub. Never push a
  release tag unless the owner asked for a release. See "Changes stop at QA" above.
- [ ] **Everything merged to `main` must be safe to release.** Unfinished work goes
  in switched off; the next tag ships whatever `main` contains.
- [ ] **The Playwright suite runs against QA's data** (`npm run dev:e2e` selects the
  `qa-data` database). Test accounts are `qa-*@legalterminus.test`; their passwords
  are generated into `Portal/e2e/.env.e2e` and are NEVER committed. Do not put a
  credential in a script, a spec or a doc.
- [ ] **QA shares production's sign-in accounts** and a seed script run without
  `FIRESTORE_DATABASE_ID=qa-data` writes to the LIVE database. Read
  `docs/qa-environment.md` before seeding or changing the QA deploy.

**Key Rule:** Commits use Conventional Commits format — `type(scope): description (#issue)` (e.g., `feat(reports): multiple-criteria filtering in the report bar (#91)`). Reference the GitHub issue number in the subject; put the epic/story ID (e.g., `E01-S02`) in the body when the work is story-related.

---

## 📂 Key File Locations

```
<repo root>/
├── _bmad-output/planning-artifacts/
│   ├── epics.md              ← Story status + implementation notes
│   └── architecture.md       ← Technical design decisions
├── spec.md                  ← Feature specifications + workflows
├── docs/
│   └── constitution.md      ← Core principles (reference only)
├── shared/
│   └── workflows/           ← Workflow definitions, compiler, registry
│       ├── companyIncorporation.definition.js  ← Incorporation workflow (seeded via db:seed:workflows)
│       ├── compileDefinition.js / registry.js / definitionSchema.js
│       └── stepList.js
├── Portal/                  ← Main app (Vite + React + TypeScript)
│   ├── src/
│   ├── e2e/                 ← Playwright suite
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

### ⚠️ Vocabulary: UI labels vs code terms
The UI and the code use DIFFERENT words for the same concepts. Never mix them up when searching code or naming things:

| UI / user-facing label | Code / Firestore term |
|------------------------|------------------------|
| **Matter** | `task` (Firestore `tasks` collection) |
| **Service** | `workflowDefinition` |
| **Task** (a step in a matter) | `step` |

New code keeps the existing code terms; new UI copy uses the UI labels.
