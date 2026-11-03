# Android app: release plan (Google Play)

Status 2026-11-03: the app runs on **QA only**. An internal-testing build (1.0.0-qa, versionCode 1)
is published to the Play **Internal testing** track and installs and runs on a real phone. Build
1.0.1-qa (versionCode 2) is signed and ready to upload. **Nothing on production has been changed.**
This plan lists what is left, in order, who does it, and which steps touch production.

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
5. Add the manifest intent filter for `legalterminus.com` (path `/portal/account/action`); the
   current one is QA-only. Decide whether a release keeps the QA host (build flavors are the clean way).
6. Add a **build guard** that fails a release build if the QA database id (`qa-data`) or a `-qa` URL
   is present. `Portal/.env.local` holds QA values, so a build on this machine bakes them in.

## Phase 2: Website side (⚠ PROD each step; explicit "yes" per step)

7. Merge to `main`. This deploys the **website to QA** only and releases nothing. Let it soak and
   re-check the shared fixes on the QA website (sign-in, document upload and View, CSV and xlsx export).
8. ⚠ PROD: add `https://localhost` to the production API's `CORS_ORIGINS` (set in
   `deploy-production.yml`, so it ships with a release tag). `https://legalterminus.com` is the live
   origin today and allows neither the app nor `localhost`.
9. ⚠ PROD 👤: publish `https://legalterminus.com/.well-known/assetlinks.json` listing the app-signing
   SHA-256, so emailed sign-in and password links open the app instead of the browser.
10. ⚠ PROD 👤: add `https://localhost` to the **production bucket's** CORS (`storage-cors.json` shows
    the format; apply it to the production bucket, not the QA one). This is a separate manual step,
    not part of the tag. Uploads and every API call fail in the production app until 8 and 10 are done.
11. ⚠ PROD: push a release tag `vX.Y.Z-lt.N` only when the user asks for a release. It waits for an
    approval in GitHub. Whatever is on `main` ships, so everything merged must be safe to release.

## Phase 3: Production build and internal test

12. Get the **production values**: production API base URL, **no** `VITE_FIRESTORE_DATABASE_ID`, the
    production storage bucket. Confirm them with the team. Build from a clean environment (or CI),
    not from this machine's `Portal/.env.local`.
13. ✅ Signing is set up: **Play App Signing** is on, an upload key exists
    (`~/lt-android-release/keys/`, 👤 **back it up in two places**; losing it means asking Google for a
    reset), and the Play app-signing and upload SHA-1 and SHA-256 are registered in Firebase
    (project `legal-terminus-web`, Android app `com.legalterminus.app`). The current
    `google-services.json` already includes them. Re-download it only if something changes.
14. Bump `versionCode` in `MobileApp/android/app/build.gradle` (it must increase on every upload;
    vc1 and vc2 are the QA builds, so use 3 or higher) and `versionName`.
15. `cd Portal && npm run build:mobile` with the production env, then `cd ../MobileApp && npx cap sync android`.
16. Build: `cd android && gradle clean bundleRelease assembleRelease` (JDK 21 and the Android SDK; the
    Gradle wrapper download times out here, so use the unpacked Gradle in `~/lt-android-release/tools/`).
    Sign the `.aab` with `jarsigner` and the APK with `zipalign` and `apksigner` using the upload key.
    Check the result by reading the APK (versionCode, signer SHA-1, and that no QA value is inside).
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

**Not tested:** native Google sign-in end to end with a Google account, the sign-out and message after
a refused account on a device, the other roles on the app, offline start, upload and View and exports
on the latest build, any real phone beyond the first install, Android 8–11, push, and everything in
Phases 2–3 (production origins, the app-link file, the production build and its first install).

## Open leftovers (from QA, not blockers)

- Leftover QA data: one Discussion message with an image and two "Awaiting upload" documents in an
  old QA matter.
- Master Sheet step number differs from the matter page by 2 (website too).
- "created by a manager" wording on an Admin-created matter.
- Login Password label is not linked to its input (accessibility).
- Report tables scroll sideways on phones instead of stacking.
- The "Google sign-in did not complete" message covers both cancelling and a setup failure, so the two
  cannot be told apart from the screen.
