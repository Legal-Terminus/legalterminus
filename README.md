# Legal Terminus: Run Locally

Two ways to run. **Option A is the default**: it needs no server key.

| App      | Folder      | URL                            |
|----------|-------------|--------------------------------|
| Portal   | `Portal/`   | http://localhost:5173/portal/  |
| Backend (Option B only) | `backend/` | http://localhost:6500 |
| Website  | `Frontend/` | http://localhost:5174 (optional) |

Requires Node 26 (`.nvmrc`; Node 24 only warns `EBADENGINE`) and access to `cdn.sheetjs.com`.

## Option A: Portal only, against QA (no backend, no service-account key)

The Portal calls the hosted QA API and the `qa-data` database.

```bash
cd Portal
npm install
```

Create `Portal/.env.local` (gitignored). Get the API key and app ID from the Android handover doc:

```
VITE_FIREBASE_API_KEY=
VITE_FIREBASE_AUTH_DOMAIN=legal-terminus-qa.web.app
VITE_FIREBASE_PROJECT_ID=legal-terminus-web
VITE_FIREBASE_STORAGE_BUCKET=legal-terminus-web-qa
VITE_FIREBASE_MESSAGING_SENDER_ID=576889424515
VITE_FIREBASE_APP_ID=
VITE_API_BASE_URL=https://legal-terminus-qa.web.app
VITE_FIRESTORE_DATABASE_ID=qa-data
```

```bash
npm run dev
```

Open http://localhost:5173/portal/ (the `/portal/` is required; only port 5173 is on QA's CORS list).

Sign in with a `qa-*@legalterminus.test` account (`qa-admin`, `qa-manager`, `qa-team`, `qa-client`, `qa-pro`).
Passwords are not in the repo: ask the team. QA shares sign-in accounts with the live site, so use only these.
Do **not** run `cd backend && npm start` for this option: it needs a Firebase service-account key.

## Option B: Full stack (needs the Firebase service-account key)

```bash
npm install && (cd backend && npm install) && (cd Portal && npm install)
# add credentials (see "Credentials"), set Portal VITE_API_BASE_URL=http://localhost:6500
cd backend && npm start      # Terminal 1 -> :6500
cd Portal  && npm run dev    # Terminal 2 -> :5173
```

The backend is healthy when its log shows `Server running on http://localhost:6500` and `Using a named Firestore database`.

## Credentials (Option B only)

Two gitignored files, already created with defaults. Only the blanks need filling.

**`backend/.env`**: `FIREBASE_PROJECT_ID`, `FIREBASE_PRIVATE_KEY_ID`, `FIREBASE_PRIVATE_KEY`,
`FIREBASE_CLIENT_EMAIL`, `FIREBASE_CLIENT_ID`, `FIREBASE_CLIENT_CERT_URL`.
Get them from Firebase Console → Project Settings → Service accounts → *Generate new private key*
(they are the matching fields in the downloaded JSON). Keep `FIREBASE_PRIVATE_KEY` in quotes with its `\n` escapes.

**`Portal/.env.local`**: `VITE_FIREBASE_API_KEY`, `VITE_FIREBASE_MESSAGING_SENDER_ID`, `VITE_FIREBASE_APP_ID`
from Firebase Console → Project Settings → General → Your apps.

GitHub repository secrets cannot be read back, so use Firebase or ask a teammate.
Never commit these files or paste their contents into issues or chat.

> ⚠️ Keep `FIRESTORE_DATABASE_ID=qa-data` in `backend/.env`. Without it the API and seed scripts use the **live** database.

## Test user (QA database only)

```bash
cd backend
export FIRESTORE_DATABASE_ID=qa-data FIREBASE_STORAGE_BUCKET=legal-terminus-web-qa EMAIL_DISABLED=true
node src/scripts/seedServiceConfig.js
node src/scripts/seedWorkflowDefinitions.js
node scripts/seed-e2e.js
```

`seed-e2e.js` creates `qa-*@legalterminus.test` accounts and writes their generated passwords to
`Portal/e2e/.env.e2e` (gitignored). Sign in to the Portal with one of those.

## Default settings

`backend/.env` ships with `PORT=6500`, `EMAIL_DISABLED=true`, `PAYMENT_GATEWAY=simulated`, and
`FRONTEND_URL=http://localhost:5173`. The Portal talks to the backend via `VITE_API_BASE_URL=http://localhost:6500`.

## Known port caveat

The repo still hard-codes the old backend port **5001** in a few places, so use the two-terminal flow above
instead of `npm run dev:all` / `dev:e2e`:
- root `package.json` scripts and `backend`'s `start`/`dev` pre-kill step
- the Portal Vite proxy (`Portal/vite.config.ts`), which is bypassed because `VITE_API_BASE_URL` is set
- the Website's fallback API URL. To run it, add `Frontend/.env.local` with `VITE_API_BASE_URL=http://localhost:6500`, then `cd Frontend && npm run dev`.

## Useful commands

```bash
cd Portal && npm run build       # tsc -b && vite build (same as CI)
cd Portal && npm run test:e2e    # Playwright; needs Portal/e2e/.env.e2e
lsof -ti :6500 | xargs kill -9   # free the backend port
```

## Troubleshooting

| Symptom | Fix |
|---------|-----|
| `Service account object must contain a string "project_id"` | `backend/.env` has no `FIREBASE_*` key. Use Option A, or get the key |
| Firebase init / credential error | A `FIREBASE_*` value in `backend/.env` is empty or the private key lost its `\n` escapes |
| Portal can't reach the API | Check the backend is on :6500 and `VITE_API_BASE_URL` has no trailing path; restart Vite after editing `.env.local` |
| `EADDRINUSE` | Free the port with the `lsof` command above |

More: `docs/qa-environment.md`, `docs/delivery.md`.
