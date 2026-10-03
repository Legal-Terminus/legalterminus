# The QA environment

A **temporary** second copy of Legal Terminus — website, portal and API — for
building and testing changes that must not touch the live site. Set up on
2026-10-03 for the online-payments work (#28, epic E-24).

| | Live | QA |
|---|---|---|
| Address | https://legalterminus.com | https://legal-terminus-qa.web.app |
| Portal | `/portal/` | `/portal/` |
| Git branch | `main` | `qa` |
| How it deploys | automatically, on every push to `main` | by hand: `scripts/deploy-qa.sh` |
| Hosting site | `legal-terminus-web` | `legal-terminus-qa` |
| API container | `legal-terminus-api` | `legal-terminus-api-qa` |
| Portal container | `legal-terminal-portal` | `legal-terminus-portal-qa` |
| Database | `(default)` | `qa-data` |
| File storage | `legal-terminus-web.firebasestorage.app` | `legal-terminus-web-qa` |
| Email | sent | **switched off** |
| Sign-in accounts | **shared — see below** | **shared — see below** |

Both live in the same Google Cloud / Firebase project, `legal-terminus-web`,
region `asia-south2`. QA is not indexed by search engines.

## The one thing to understand: accounts are shared

A Firebase project has **one** set of sign-in accounts. QA has its own database
and its own files, but the same accounts as the live site — and a person's role
(admin, manager, client…) is stored on the account itself.

So, without protection, this would happen on QA:

- A real staff member signs in. QA's database has no record of them, registers
  them as a client, and **their live role becomes "client"**.
- Someone adds, edits or deletes a user with a real client's address. **That
  person's live account is changed or deleted.**

The QA API therefore runs with `TEST_ACCOUNT_EMAIL_DOMAINS=legalterminus.test`.
With it set, the API refuses to sign in, create, change or delete any account
that is not on that domain. The code is `backend/src/config/testEnvironment.js`.

**Never remove that setting from the QA API, and never add a real domain to it.**

## Signing in to QA

Use the test accounts only. Your own account is refused, by design.

| Role | Email |
|---|---|
| Admin | `e2e-admin@legalterminus.test` |
| Manager | `e2e-manager@legalterminus.test` |
| Team member | `e2e-team@legalterminus.test` |
| Client | `e2e-client@legalterminus.test` |
| Professional | `e2e-pro@legalterminus.test` |

Passwords are in `Portal/e2e/.env.e2e` on a developer's machine (the file is not
committed). These are the same accounts the automated tests use on the live
project.

## Deploying to QA

From the repo root, on the `qa` branch, signed in to `gcloud` and `firebase`:

```bash
scripts/deploy-qa.sh            # everything
scripts/deploy-qa.sh api        # only the API container
scripts/deploy-qa.sh portal     # only the portal container
scripts/deploy-qa.sh site       # only the website
scripts/deploy-qa.sh rules      # only database rules and indexes
```

The script builds the two container images with Cloud Build, deploys them,
builds the website and releases it to the QA hosting site, then checks that the
site, the portal and the API answer. It needs `backend/.env` and
`Portal/.env.local` on the machine it runs from.

It cannot release to the live site: `firebase.qa.json` names the QA hosting site
and the QA database explicitly, and the container names end in `-qa`.

An **Editor** on the project can run it. Editor is not enough for the one-time
setup below.

## Putting data into QA

QA starts empty. To load the service catalog, the workflow and the test users:

```bash
cd backend
export FIRESTORE_DATABASE_ID=qa-data FIREBASE_STORAGE_BUCKET=legal-terminus-web-qa EMAIL_DISABLED=true
node src/scripts/seedServiceConfig.js
node src/scripts/seedWorkflowDefinitions.js
node scripts/seed-e2e.js
```

Those three variables are what point a script at QA. **Without them the same
command writes to the live database.** Check the first log line says
`Using a named Firestore database` before trusting a run.

## One-time setup (already done — recorded for next time)

These need a project **Owner** (`admin@legalterminus.com` or
`sales23@legalterminus.com`); an Editor is refused.

```bash
# The database. Its name must be at least four characters — "qa" is refused.
gcloud firestore databases create --database=qa-data --location=asia-south2 \
  --type=firestore-native --project legal-terminus-web

# Let the public reach the two QA containers (the hosting site calls them unauthenticated).
gcloud run services add-iam-policy-binding legal-terminus-api-qa \
  --region=asia-south2 --member=allUsers --role=roles/run.invoker --project legal-terminus-web
gcloud run services add-iam-policy-binding legal-terminus-portal-qa \
  --region=asia-south2 --member=allUsers --role=roles/run.invoker --project legal-terminus-web
```

And in the Firebase console → Authentication → Settings → Authorised domains,
add `legal-terminus-qa.web.app`.

An Editor created the rest: the bucket `legal-terminus-web-qa` (with CORS for
the QA address), the hosting site `legal-terminus-qa`, and the two containers.

## Moving finished work to the live site

Work is built and approved on `qa`, then merged to `main`, which deploys it
live. Before merging:

- The `qa` branch carries QA-only files (`scripts/deploy-qa.sh`,
  `cloudbuild.qa.yaml`, `firebase.qa.json`, `.gcloudignore`). They are harmless
  on `main` — nothing there runs them.
- The code that selects a named database and the test-account guard are both
  inert unless their settings are present, and production sets neither.
- Run the full Playwright suite first; a push to `main` is a production deploy.

## Taking QA down

It is temporary. When it is no longer needed, an Owner removes:

```bash
gcloud run services delete legal-terminus-api-qa    --region=asia-south2 --project legal-terminus-web
gcloud run services delete legal-terminus-portal-qa --region=asia-south2 --project legal-terminus-web
firebase hosting:sites:delete legal-terminus-qa --project legal-terminus-web
gcloud firestore databases delete --database=qa-data --project legal-terminus-web
gcloud storage rm -r gs://legal-terminus-web-qa
```

and removes `legal-terminus-qa.web.app` from the authorised domains. The test
accounts stay: the automated tests use them on the live project too.

## Known limits

- **Not a second project.** Quotas, billing and sign-in accounts are shared with
  the live site.
- **No email.** Anything that depends on receiving an email cannot be tested
  end to end on QA.
- **The automated tests do not run against QA yet.** They still target the live
  project from a developer's machine.
- **Nobody is alerted if QA is down.** It is not monitored.
