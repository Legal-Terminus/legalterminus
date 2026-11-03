# Android app: release plan (Google Play)

Status 2026-11-03: **nothing on production has been changed.** Builds so far:

| Build | Values | State |
|---|---|---|
| 1.0.0-qa, versionCode 1 | QA | On the Play **Internal testing** track; installs and runs on a real phone |
| 1.0.1-qa, versionCode 2 | QA | Signed, ready to upload; clear message for refused accounts; runs on an emulator |
| **1.0.0, versionCode 3** | **Production** | Built and signed, **not uploaded and never run**. It cannot work until Phase 2 is done |

The QA website deploy of the Portal changes succeeded (run #60). This plan lists what is left, in
order, who does it, and which steps touch production.

- **Play Console account:** *LEGAL TERMINUS PRIVATE LIMITED*, an **organisation** account
  (ID 5266562184256323096). Organisation accounts do **not** need the "12 testers for 14 days"
  closed test that personal accounts need before production.
- **App:** `com.legalterminus.app` exists in the console ("LegalTerminus"). The package name cannot
  change after the first upload.
- **Marks:** ⚠ **PROD** = changes production (needs explicit approval, see `docs/delivery.md`).
  👤 = needs a person with the right access (Play Console, Firebase Owner, hosting).
  ✅ = done.

## Read this first: three things that shape the order

1. **Shared Portal code ships to the live website.** The app is the Portal in a WebView. The fixes
   made for it in shared files (`useAuth.ts`, `firebase.ts`, `googleSignIn.ts`, `documents.ts`,
   `reports.ts`, `exportXlsx.ts`, `commentImageDom.ts`, `LoginPage.tsx`, `api/client.ts`, ...) go to
   **legalterminus.com** with the next release tag. They have been tested on QA only. They need a
   regression pass before a tag, not after.
2. **Google sign-in can only be tested end to end on a production build.** The QA API accepts only
   `@legalterminus.test` accounts (`docs/qa-environment.md`, `config/testEnvironment.js`), by design,
   because QA and production share sign-in accounts. A real Google account on a QA build gets
   "This is a test environment. Only test accounts can be used here." That is correct, and it must
   never be loosened. So the first real Google sign-in test happens in Phase 3, against production,
   with a dedicated test Google account (it registers as a Client in the live database).
3. **Play review will ask about account deletion** (D2). Decide it before Phase 4.

## 0. Decisions needed before building

| # | Decision | Why it matters |
|---|---|---|
| D1 | **Minimum Android version.** Keep `minSdk 24` (Android 7) or raise it? | The Portal needs a WebView of Chrome 111+. Older phones now see an "update WebView" page, not a blank screen. Play Console's device catalogue shows how many users each choice excludes. Recommendation: keep 24. |
| D2 | **Account deletion.** Play requires apps that let people create an account to offer deletion (in the app and a web link). | The login screen has "Sign up", but a user cannot delete their own account today (only an Admin can). Either add a self-service request path or a web form, and put its URL in the Data safety form. Likely a review blocker. |
| D3 | **Team Member rules.** `spec.md` says a Team Member can reassign steps and create matters with payment. The code does not allow it. | Not a release blocker, but fix the spec or the code before real staff use the app. |
| D4 | **First release scope.** Ship without push notifications (not built)? | Recommended: yes. Add push in a later update. |

## Phase 1: Prepare (no production changes)

1. 👤 Decide D1, D2, D4 (D3 can wait).
2. 👤 Give the **GitHub issue number** for the Android app; replace `#TBD` in `epics.md` (E-26).
3. Commit in separate pieces (Conventional Commits, issue in the subject, `Co-Authored-By` line):
   Portal shared fixes, then `MobileApp/`, then docs. Everything is uncommitted today. Never commit
   `google-services.json`, keystores or `.env*` (all ignored). Update `epics.md`, `architecture.md`
   and `spec.md` for the clear-error-message change as well.
4. Run the **full Playwright suite on the final code**. The last full run (2026-11-03, before the
   login-message change): 523 passed, 2 failed, 1 flaky, 6 skipped, 5 did not run. The failures
   (`flow-order` #55, `orders` "missing payment can be checked") and the flaky one (`leads`
   team-member convert) also fail on the original code; say so in the commit rather than hide it.
   Someone should look at them.
5. ✅ The emailed-link host is now a build setting (`linkHost`, default `legalterminus.com`; a QA
   build passes `-PlinkHost=legal-terminus-qa.web.app`). Committed as `c8569402`.
6. ✅ (by hand) The production build was made in a **clean checkout** and its APK was inspected for QA
   values. Still to do: an automated **build guard** that fails a release build if `qa-data`, a `-qa`
   URL or a `.test` address is present. `Portal/.env.local` holds QA values, so a build from this
   checkout bakes them in.
7. ✅ `MobileApp/package-lock.json` is tracked (`0815a17e`), so a clean checkout can `npm ci`. It had been
   hidden by the repo-wide `package-lock.json` ignore rule.

## Phase 2: Website side (⚠ PROD each step; explicit "yes" per step)

7a. ✅ Merged to `main` and pushed (2026-11-03); "Deploy to QA" run #60 succeeded. The two later
   commits (`c8569402`, `0815a17e`) are local and unpushed. Re-check the shared fixes on the QA website
   (sign-in, document upload and View, CSV and xlsx export) before any release tag.
8. ⚠ PROD **API CORS: prepared, not applied.** `deploy-production.yml` now sets
   `CORS_ORIGINS=https://localhost` on the production API (it set none before). It takes effect when a
   release tag deploys the backend. Checked with the API's own `corsOrigins.js` in production mode:
   `https://localhost` is allowed; `http://localhost`, other ports, `https://evil.localhost`,
   `capacitor://localhost` and look-alike hosts stay refused. Note: that origin is shared by every
   Capacitor app that uses the default `https://localhost`, so it is protected only by the bearer token
   (the API sends no cookies to it), the same as on QA.
9. ✅ **assetlinks.json is already live on production** (found 2026-11-03; someone published it outside
   the repo). `https://legalterminus.com/.well-known/assetlinks.json` returns 200 with no redirect, and
   Google's Digital Asset Links service reads it without errors. It lists three SHA-256 fingerprints: the
   Play **app-signing** key (the one phones see), the **upload** key, and a **debug** key. The repo file
   `Frontend/public/.well-known/assetlinks.json` was aligned **on purpose** (option 2): app-signing +
   upload, **debug key dropped**; checked to differ from the live file by exactly that one entry. It
   replaces the live file when the release deploys the website. Whoever published the live file should
   know the repo now owns it. Checked: Vite copies it to `dist/.well-known/`, and Firebase CLI 15.34.2
   (what CI installs) deploys it despite the `**/.*` ignore rule, so `firebase.json` is unchanged.
10. ⚠ PROD 👤 **Bucket CORS: prepared, not applied.** Production's live config (read 2026-11-03) is the
    list in `storage-cors.json` **minus** `https://localhost`, so applying the file adds exactly one origin
    and drops nothing. Apply it **by hand**, because nothing in CI does:
    `gcloud storage buckets update gs://legal-terminus-web.firebasestorage.app --cors-file=storage-cors.json`
    (needs a Storage admin login). Confirm with
    `gcloud storage buckets describe gs://legal-terminus-web.firebasestorage.app --format="default(cors_config)"`.
    Re-read the live config right before applying: if it changed since, merge instead of overwriting.
11. ⚠ PROD: the release tag. Only when the user asks for a release. **See the runbook below: it ships
    much more than the app, and it needs production indexes first.**

## Release runbook: v1.6.0-lt.9 (prepared, NOT run)

**Name:** `v1.6.0-lt.9`. Per `docs/releases/SYNC.md` these are LT-only changes, so the sequence continues
(`lt.8` was the last tag, 2026-10-17; releases are taken in order, nothing is skipped).

**What it ships:** a tag deploys the **whole tagged commit**, not just the app: 44 commits and 215 files
since `lt.8` (≈17,800 lines added), across the backend, Portal, website and app. From the commit subjects
(read them before approving; this is a summary, not a review):
- **Android app:** the shell, shared Portal fixes (sign-in, uploads, exports, refused-account message),
  `CORS_ORIGINS=https://localhost` on the production API, `assetlinks.json` (two keys).
- **Portal:** Client Database screen (#205), Employee Performance report (#216), trademark reports (#210),
  thirteen company worksheets (#217), comment images (#122), team members see only the buttons and data they can use,
  My Tasks lists only steps a team member can complete.
- **Website:** Theme C round 3 and Supreme Plus plans on OPC and Trademark (#209), pricing and layout fixes.
- **Security / platform:** exact CORS allowlist for the API (`938046aa`), dependency audit and **Node 26.13.0
  image** (#218): nodemailer 10, sharp 0.35, xlsx from the SheetJS CDN build, firebase 12.19.

The app does **not** need a separate deploy: it bundles its own copy of the Portal and talks to the API. But
that Portal is `main`'s Portal, so it needs `main`'s backend, which is why this is a full release and not a
one-line patch tagged from `lt.8` (that option exists, rule 5 in `docs/delivery.md`, but it needs an API
compatibility check first).

### Before the tag (all must be true)
1. **The approval gate exists.** GitHub → Settings → Environments → **production** → Required reviewers must
   list a reviewer. On 2026-11-03 the public API showed `protection_rules: []` for `production`; I cannot see
   reviewer settings without admin access. `delivery.md`: *"If no reviewer is configured, a tag deploys
   immediately."* Fix this first.
2. ✅ **Production indexes are built first** (CI does **not** deploy them). **Done 2026-11-03** by the
   user's go-ahead: `firebase deploy --only firestore:indexes --project legal-terminus-web --non-interactive`
   (no `--force`), logged in as the user. `firestore.indexes.json` had gained 176 lines since `lt.8`; production
   now has **23 composite indexes, all READY** (15 before + 8 new: `steps` ×4 over assignedTo / assignedToUids ×
   completedAt / status, `events` byUid × at, `worksheetRecords` ×2, `tasks` serviceKey × createdAt) and all
   5 field overrides match the file (3 new collection-group ones: `steps.completedAt`, `steps.status`,
   `events.at`). Verified read-only afterwards. **Left alone on purpose:** the live index `tasks`
   accessProfessionalUids × updatedAt and one field override that are not in the file (the CLI offers to delete
   them with `--force`; do not). One side effect: the CLI set the three overrides exactly as written, which dropped
   those fields' default array index (`CONTAINS`); nothing queries them with `array-contains`.
   `firestore.rules` and the workflow definitions are unchanged since `lt.8`; no migration scripts changed.
3. **Look at it on QA** (rule 3: *a tag says this commit was seen working on QA*). QA runs #60–#62 are green
   on this commit. ✅ Full Playwright run on the final code (`c551928f`, 2026-11-03): **524 passed, 2 failed,
   1 flaky, 6 skipped, 5 did not run**; the same three tests fail as on the original code (`flow-order` #55, `orders`
   "missing payment can be checked", flaky `leads` team-member convert) and nothing new. Still to do: a hand check
   of the website and Portal on QA.
4. **Node 26 image** (#218) is a production runtime change; confirm the QA backend has been running on it.
5. Tag a commit that is **pushed** and is the one QA deployed (`git status` clean, `git log origin/main..HEAD` empty).

### The tag (explicit "yes" from the user for this step)
```bash
git checkout main && git pull
git tag -a v1.6.0-lt.9 -m "Legal Terminus v1.6.0-lt.9: Android app support, reports, worksheets, website, dependency and Node 26 update"
git push origin v1.6.0-lt.9      # starts "Deploy to Production", pending approval
```
Then a reviewer approves in the Actions tab. Watch the job: backend health check (`/health`, 6 retries), Portal, website.
`gh` is not installed on the working machine: create the GitHub Release in the web UI (or run `gh release create`).
Then add the ledger row to `docs/releases/SYNC.md` (draft: `| v1.5.0 | v1.6.0-lt.9 | <date> | **LT-only release — no
Ambyflow code.** Android app support (shared Portal fixes, production CORS for https://localhost, assetlinks);
Client Database, Employee Performance and trademark reports, company worksheets, comment images; website
Theme C and Supreme Plus plans; exact CORS allowlist; dependency audit and Node 26. |`).

### After the tag: prove it, then the app
- **CORS for the app origin.** Before release, a preflight from `Origin: https://localhost` to
  `https://legalterminus.com/api/auth/me` returns `204` with **no** `access-control-allow-origin` (baseline taken
  2026-11-03). After release it must return `access-control-allow-origin: https://localhost`:
  `curl -s -D - -o /dev/null -X OPTIONS -H "Origin: https://localhost" -H "Access-Control-Request-Method: GET" https://legalterminus.com/api/auth/me | grep -i access-control`
- 👤 **Bucket CORS** (step 10), then check an upload from the app.
- `assetlinks.json` still returns 200 / JSON with the two keys, and the Digital Asset Links API still lists both.
- Then Phase 3: upload vc3 to **Internal testing**, test on a phone, and only then Production.

### If it goes wrong (not rehearsed)
Cloud Run keeps earlier revisions: shift traffic back to the previous revision of `legal-terminus-api` and
`legal-terminal-portal`; Firebase Hosting has a release history to roll the website back. Or re-run
"Deploy to Production" by hand from `v1.6.0-lt.8`. Indexes are additive and can stay. Rolling back the
API means the app's origin is refused again, nothing worse.

## Phase 3: Production build and internal test

12. ✅ **Production values** used for build vc3 (confirm them with the team): API
    `https://legalterminus.com` (answers 401 JSON for a missing token), bucket
    `legal-terminus-web.firebasestorage.app`, project `legal-terminus-web`, auth domain
    `legalterminus.com`, **no** `VITE_FIRESTORE_DATABASE_ID`. The Firebase API key, app id and sender id
    are the same project's values as QA's (QA shares the project). Built from a clean checkout, not
    from this machine's `Portal/.env.local`.
13. ✅ Signing is set up: **Play App Signing** is on, an upload key exists
    (`~/lt-android-release/keys/`, 👤 **back it up in two places**; losing it means asking Google for a
    reset), and the Play app-signing and upload SHA-1 and SHA-256 are registered in Firebase
    (project `legal-terminus-web`, Android app `com.legalterminus.app`). The current
    `google-services.json` already includes them. Re-download it only if something changes.
14. ✅ versionCode 3 / versionName 1.0.0 (it must increase on every upload; vc1 and vc2 are the QA
    builds, so the next production build is 4 or higher).
15. `cd Portal && npm run build:mobile` with the production env, then `cd ../MobileApp && npx cap sync android`.
16. Build: `cd android && gradle clean bundleRelease assembleRelease` (JDK 21 and the Android SDK; the
    Gradle wrapper download times out here, so use the unpacked Gradle in `~/lt-android-release/tools/`).
    Sign the `.aab` with `jarsigner` and the APK with `zipalign` and `apksigner` using the upload key.
    Check the result by reading the APK (versionCode, signer SHA-1, and that no QA value is inside).
    ✅ Done for vc3: `~/lt-android-release/out/legalterminus-1.0.0-prod-vc3.aab` and `.apk`; signed with
    the upload key (SHA-1 `003b92…`); no QA host, database id or test account inside; link host
    `legalterminus.com`. Not installed or run anywhere yet.
17. ⚠ PROD: create a **dedicated reviewer account** in production (a limited Client with no real data).
    Its credentials go in the Play Console "App access" form.
18. 👤 Upload the `.aab` to **Internal testing** and install from the Play link (not a side-loaded APK).
19. Test on at least one real phone (ideally Android 8–11 and a low-end model):
    - email sign-in for every role, and **Google sign-in** with a dedicated test Google account:
      a new Google user lands as Client; an email that already has a password account gets the
      "already has an account" message; cancelling shows the friendly message; still signed in after restart;
    - restart (stay signed in), offline start ("try again" screen, then recovers), upload and View,
      Excel / CSV / zip export, emailed link opens the app, back button, rotation, small screen.
20. Fix, bump `versionCode`, upload again. Repeat until clean.

## Phase 4: Play Console (👤 you; the app already exists as a draft)

**Store listing:** name (max 30), short description (max 80), full description (max 4000),
app icon 512×512 PNG, feature graphic 1024×500, at least 2 phone screenshots (take them from
the emulator; use QA data only), category (Business), contact email, website.

**App content declarations:**
- **Privacy policy URL:** the website has a Privacy Policy page; confirm its exact address.
- **App access:** reviewers must be able to sign in. Give the reviewer account from step 17.
- **Data safety:** the app handles name, email, phone, address, government IDs (PAN / Aadhaar /
  GST), uploaded documents, payment status and amounts, and in-app messages. Data is encrypted
  in transit. Answer deletion (D2).
- **Ads:** none. **Advertising ID:** not used (the built app requests only `INTERNET` and
  `ACCESS_NETWORK_STATE`). **Content rating** questionnaire, **target audience** (adults), and the
  **financial features** and **government apps** declarations.

## Phase 5: Release

21. **Production** track → create release → **staged rollout** (start around 10%, watch the Play
    Console crash and ANR reports, then raise to 100%). First review can take several days.
22. Later updates: bump `versionCode`, build, upload to Internal → Production.
23. After release, watch **Android vitals** and reviews for the first week. If something is wrong,
    halt the staged rollout in the console, then ship a fixed `versionCode`.
24. Push notifications (E26-S06) and an iOS app are separate follow-ups.

## Tested so far, and not

**Tested (QA only):** the signed vc1 build installs from Play on a real phone and runs; the vc2 build
installs on an Android 16 emulator, signs in as the QA admin, stays signed in after a restart, and the
Google button opens the native account screen and returns a friendly message on cancel. The refused-
account message logic has a Playwright spec (mocked server response). The full suite is above.
The production build (vc3) was only **inspected** (contents, version, signer, link host).

**Not tested:** native Google sign-in end to end with a Google account, the sign-out and message after
a refused account on a device, the other roles on the app, offline start, upload and View and exports
on the latest build, any real phone beyond the first install, Android 8–11, push, and everything in
Phases 2–3 (production origins, the app-link file, and the production build's install and first
sign-in). Do **not** upload vc3 to Internal testing before steps 8–10 are done, or testers only see
errors, and do **not** promote a QA build (vc1, vc2) to Production: it talks to QA, which refuses real accounts.

## Open leftovers (from QA, not blockers)

- Leftover QA data: one Discussion message with an image and two "Awaiting upload" documents in an
  old QA matter.
- Master Sheet step number differs from the matter page by 2 (website too).
- "created by a manager" wording on an Admin-created matter.
- Login Password label is not linked to its input (accessibility).
- Report tables scroll sideways on phones instead of stacking.
- The "Google sign-in did not complete" message covers both cancelling and a setup failure, so the two
  cannot be told apart from the screen.
