# Run the Portal locally against QA

Use this to run the Portal on your machine (and later wrap it for Android) without
starting the backend. The Portal talks to the **QA** backend and the `qa-data` database.

| What | Value |
|---|---|
| Portal URL | http://localhost:5173/portal/ |
| API | https://legal-terminus-qa.web.app (QA, no local backend needed) |
| Database | `qa-data` (separate from live data) |

## 1. Requirements

- Node 26 (`.nvmrc`). With nvm: `nvm install 26 && nvm use 26`
- Access to `cdn.sheetjs.com` (the `xlsx` package is downloaded from there)

## 2. Environment file

Create `Portal/.env.local`. It is gitignored (`*.local`), never commit it.

```
VITE_FIREBASE_API_KEY=<from the Android handover doc>
VITE_FIREBASE_AUTH_DOMAIN=legal-terminus-qa.web.app
VITE_FIREBASE_PROJECT_ID=legal-terminus-web
VITE_FIREBASE_STORAGE_BUCKET=legal-terminus-web-qa
VITE_FIREBASE_MESSAGING_SENDER_ID=576889424515
VITE_FIREBASE_APP_ID=<from the Android handover doc>
VITE_API_BASE_URL=https://legal-terminus-qa.web.app
VITE_FIRESTORE_DATABASE_ID=qa-data
```

Do not drop `VITE_FIRESTORE_DATABASE_ID`: QA sits inside the live Firebase project,
and without it the app would read the live database.

## 3. Run

```bash
cd Portal
npm install
npm run dev
```

Open http://localhost:5173/portal/ (the trailing `/portal/` is required).
`http://localhost:5173` is on QA's CORS allowlist; other ports will be refused.

## 4. Sign in

Use only the QA test accounts, one per role:

| Role | Email |
|---|---|
| Admin | `qa-admin@legalterminus.test` |
| Manager | `qa-manager@legalterminus.test` |
| Team Member | `qa-team@legalterminus.test` |
| Client | `qa-client@legalterminus.test` |

(Confirm the exact emails in `backend/scripts/seed-e2e.js`.)

Passwords are never committed. They are generated into `Portal/e2e/.env.e2e` when
someone with backend credentials runs the seed script, so ask your team lead for them.

**Sign-in accounts are shared between QA and live.** Never use a real client's or
staff member's account here.

## 5. Check it works

- The login page loads and an `qa-*` account signs in.
- The dashboard shows data; DevTools → Network shows requests going to
  `legal-terminus-qa.web.app` and no CORS errors.
- Upload a small PDF to a matter. If it fails with a CORS error the bucket
  settings need updating (known blocker 3 in the Android handover).

## Troubleshooting

| Symptom | Fix |
|---|---|
| Blank page at `http://localhost:5173/` | Use `/portal/` |
| CORS error | The page must be served from exactly `http://localhost:5173` |
| Login says unauthorized domain | Ask the Firebase owners to add `localhost` to authorised domains |
| Google sign-in fails | Use email sign-in locally; Google sign-in in the mobile app needs a native plugin |
| Port 5173 busy | `npm run cleanup:ports` from the repo root |
