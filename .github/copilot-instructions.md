<!-- BMAD START -->
This project uses the BMad Method (v6.8.0) for AI-driven agile development.

Key locations:
- `_bmad/` — BMAD framework installation (agents, skills, workflows)
- `.agents/skills/` — 44 BMAD skills available as agent instructions
- `.github/agents/` — 6 BMAD agent command files for GitHub Copilot
- `_bmad-output/planning-artifacts/` — PRD, architecture, stories go here
- `_bmad-output/implementation-artifacts/` — generated code artifacts
- `docs/` — project knowledge (tech stack, conventions, API docs)
- `spec.md` — existing feature specification (12 user stories, workflow definitions, Firestore schema)

To start: invoke the `bmad-help` skill and ask what to do next, or use
a specific agent like `bmad-agent-pm` (product), `bmad-agent-architect`
(architecture), or `bmad-agent-dev` (implementation).
<!-- BMAD END -->
