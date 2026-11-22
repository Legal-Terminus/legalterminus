# Build, run, test and utility commands

> Loaded on demand. The always-on rules are in `.github/copilot-instructions.md` (also `AGENTS.md` / `CLAUDE.md`), which says when to read this file.

## 🛠️ BUILD & RUN COMMANDS

**Always use these commands (from project root):**

### Build Commands
| Command | Purpose | Services |
|---------|---------|----------|
| `npm run build:all` | Build all services (backend, frontend, portal) | Backend, Frontend, Portal |
| `npm run build:backend` | Build backend only | Backend |
| `npm run build:frontend` | Build frontend marketing site only | Frontend |
| `npm run build:portal` | Build portal admin app only | Portal |

### Run/Dev Commands
| Command | Purpose | Port(s) | Working Dir |
|---------|---------|---------|-------------|
| `npm run dev:all` | **Standard dev workflow — start everything** (kills existing processes first) | 5001/5173/5174 | Root |
| `npm run dev:e2e` | Backend + portal only — used ONLY by Playwright's webServer, not for manual dev (use `dev:all` for that). Sets `EMAIL_DISABLED=true`, which also lifts the API rate limit for the run — see "Always let Playwright boot the backend" | 5001/5173 | Root |
| `npm run start:backend` | Start backend (production mode) | 5001 | Backend |
| `npm run dev:backend` | Start backend (development mode with hot reload) | 5001 | Backend |
| `npm run dev:portal` | Start portal admin app | 5173 | Portal |
| `npm run dev:portal-only` | Alias for dev:portal | 5173 | Portal |
| `npm run dev:frontend` | Start frontend marketing site | 5174 | Frontend |

### Testing Commands
| Command | Purpose | Runs |
|---------|---------|------|
| `npm run test` | Run E2E tests (Playwright headless) with backend + frontend | Backend + Frontend + Tests |
| `npm run test:headed` | Run E2E tests (Playwright visible browser) with backend + frontend | Backend + Frontend + Tests (browser visible) |

### Utility Commands
| Command | Purpose |
|---------|---------|
| `npm run cleanup:ports` | Kill processes on ports 5001, 5173, 5174 (useful if services hang) |
| `npm run db:setup` (from `backend/`) | Seed workflows + deploy Firestore indexes. Index deploy needs Firebase CLI auth (user-run or CI token) — project `legal-terminus-web` |
