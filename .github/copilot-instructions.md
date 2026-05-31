<!-- BMAD START -->
This project uses the BMad Method (v6.8.0) for AI-driven agile development.

**IMPORTANT: Documentation-First Approach**

After ANY feature implementation, bug fix, or technical change, you MUST update:
1. `_bmad-output/planning-artifacts/epics.md` - Update story status & implementation notes
2. `spec.md` - Update requirements, workflows, or Firestore schema
3. `_bmad-output/planning-artifacts/architecture.md` - Document technical decisions & design patterns

**CRITICAL: Environment & Secrets Management**
- NEVER hardcode variables (API keys, tokens, credentials, URLs)
- Use `.env.local` files for local development
- Use GitHub Secrets for CI/CD pipelines
- Always include `.env.example` templates (without actual values)
- When adding new secrets/env vars: update `.env.example` + `.env.local` + GitHub Secrets + **ALL workflows**

See `.instructions.md` at project root for complete enforcement rules and task checklists.

Key locations:
- `_bmad/` — BMAD framework installation (agents, skills, workflows)
- `.agents/skills/` — 44 BMAD skills available as agent instructions
- `.github/agents/` — 6 BMAD agent command files for GitHub Copilot
- `_bmad-output/planning-artifacts/` — PRD, architecture, stories go here
- `_bmad-output/implementation-artifacts/` — generated code artifacts
- `docs/` — project knowledge (tech stack, conventions, API docs)
- `spec.md` — existing feature specification (12 user stories, workflow definitions, Firestore schema)
- `.instructions.md` — Project rules, workflows, and task checklists (PROJECT ROOT)

To start: invoke the `bmad-help` skill and ask what to do next, or use
a specific agent like `bmad-agent-pm` (product), `bmad-agent-architect`
(architecture), or `bmad-agent-dev` (implementation).
<!-- BMAD END -->
