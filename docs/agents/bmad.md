# BMAD integration, architecture and story status

> Loaded on demand. The always-on rules are in `.github/copilot-instructions.md` (also `AGENTS.md` / `CLAUDE.md`), which says when to read this file.

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
- `.agents/skills/` — BMAD skills available as agent instructions
- `.github/agents/` — BMAD agent command files for GitHub Copilot
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

## 📋 Story Status & Architecture Snapshots

**Story/sprint status lives ONLY in `_bmad-output/planning-artifacts/epics.md` — never duplicated here.** Read it at the start of story-related work; update it when a story's status changes.

Architecture snapshots (e.g., the consolidated user-management pages at `Portal/src/pages/users/`, routes `/users`, `/users/new/:type`, `/users/edit/:type/:uid`) live in `architecture.md` — this file only carries the rules for keeping them true (see route/folder rules above).
