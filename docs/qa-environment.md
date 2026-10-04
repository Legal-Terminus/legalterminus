# The QA environment

A **temporary** second copy of Legal Terminus — website, portal and API — for
building and testing changes that must not touch the live site. Set up on
2026-10-03 for the online-payments work (#28, epic E-24).

| | Live | QA |
|---|---|---|
| Address | https://legalterminus.com | https://legal-terminus-qa.web.app |
| Portal | `/portal/` | `/portal/` |
| Deploys from | a release tag `vX.Y.Z-lt.N`, after approval | every merge to `main`, automatically |
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

Use the QA test accounts only. Your own account is refused, by design.

| Role | Email |
|---|---|
| Admin | `qa-admin@legalterminus.test` |
| Manager | `qa-manager@legalterminus.test` |
| Team member | `qa-team@legalterminus.test` |
| Client | `qa-client@legalterminus.test` |
| Professional | `qa-pro@legalterminus.test` |

**The passwords are not in the repository.** They are generated the first time
the accounts are seeded and written to `Portal/e2e/.env.e2e`, which is not
committed. Ask whoever seeded QA, or re-seed (below) — a re-seed keeps the
passwords already in that file, so nobody is locked out.

These accounts have no record in the live database, so the live portal and its
API refuse them.

> **They are still not harmless.** Sign-in accounts are shared with the live
> project, and the live database's access rules trust the role stored on the
> account. A QA *admin* account is therefore an admin as far as the live
> database's rules are concerned, for anyone who talks to the database directly
> instead of through the portal. Treat the QA admin and manager passwords like
> real staff passwords: give them only to people you would trust with the live
> data. Closing this properly means refusing test-domain accounts in the live
> API and the live rules — not yet done.

The older `e2e-*@legalterminus.test` accounts were retired on 2026-10-04: their
passwords had been committed to the repository while they held real roles on the
live portal. They can no longer sign in anywhere
(`backend/scripts/retire-legacy-test-accounts.js`).

## Deploying to QA

QA deploys itself: every merge to `main` runs `.github/workflows/deploy-qa.yml`,
which rebuilds and deploys whichever of the API, portal and website changed. See
`docs/delivery.md` for the whole flow.

To deploy by hand — a branch you want to see on QA before merging, or the
database rules, which the pipeline does not deploy — from the repo root, signed
in to `gcloud` and `firebase`:

```bash
scripts/deploy-qa.sh            # everything
scripts/deploy-qa.sh api        # only the API container
scripts/deploy-qa.sh portal     # only the portal container
scripts/deploy-qa.sh site       # only the website
scripts/deploy-qa.sh rules      # only database rules and indexes
```

It needs `backend/.env` and `Portal/.env.local` on the machine it runs from. A
hand deploy is overwritten by the next merge to `main`.

Neither route can release to the live site: `firebase.qa.json` names the QA
hosting site and the QA database explicitly, and the container names end in `-qa`.

## Putting data into QA

QA starts empty. To load the service catalog, the workflow and the test users:

```bash
cd backend
export FIRESTORE_DATABASE_ID=qa-data FIREBASE_STORAGE_BUCKET=legal-terminus-web-qa EMAIL_DISABLED=true
node src/scripts/seedServiceConfig.js
node src/scripts/seedWorkflowDefinitions.js
node scripts/seed-e2e.js      # the test accounts; writes Portal/e2e/.env.e2e
```

Those three variables are what point a script at QA. **Without them the first
two commands write to the live database.** Check the first log line says
`Using a named Firestore database` before trusting a run. `seed-e2e.js` refuses
to run at all without `FIRESTORE_DATABASE_ID`.

## Running the automated tests

The Playwright suite runs against QA's data, never the live database:
`npm run dev:e2e` — which the suite starts for itself — points the local API and
portal at the `qa-data` database and the QA bucket. From `Portal/`:

```bash
npm run test:e2e
```

It needs `Portal/e2e/.env.e2e` (written by the seed above).

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

Push a release tag — see `docs/delivery.md`. Two things to remember:

- The code that selects a named database and the test-account guard are inert
  unless their settings are present, and production sets neither.
- QA's database is not production's. Anything a release needs there (the price
  catalogue, a new index) has to be set up in the live database too.

## Taking QA down

It is temporary. When it is no longer needed, an Owner removes:

```bash
gcloud run services delete legal-terminus-api-qa    --region=asia-south2 --project legal-terminus-web
gcloud run services delete legal-terminus-portal-qa --region=asia-south2 --project legal-terminus-web
firebase hosting:sites:delete legal-terminus-qa --project legal-terminus-web
gcloud firestore databases delete --database=qa-data --project legal-terminus-web
gcloud storage rm -r gs://legal-terminus-web-qa
```

and removes `legal-terminus-qa.web.app` from the authorised domains, and deletes
the five `qa-*@legalterminus.test` sign-in accounts.

## Known limits

- **Not a second project.** Quotas, billing and sign-in accounts are shared with
  the live site.
- **No email.** Anything that depends on receiving an email cannot be tested
  end to end on QA.
- **The automated tests do not run in the pipeline yet.** They run from a
  developer's machine, against QA's data.
- **Nobody is alerted if QA is down.** It is not monitored.
