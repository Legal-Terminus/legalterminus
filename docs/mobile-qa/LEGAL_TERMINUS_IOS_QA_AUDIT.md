# LEGAL_TERMINUS_IOS_QA_AUDIT

Date: 2026-11-17 · Scope: the iOS app (`iOSApp/`) built as the **QA** app. Builds on
`docs/IOS_DEVELOPMENT_AUDIT.md` (2026-11-16); this file adds the environment-isolation check.
Everything marked *verified* was read from a file or measured on the build in this session.

## 1. What the iOS app is

A Capacitor 8 shell around the Portal web app (Vite + React + TypeScript). The app is one WKWebView; there is no
native UI. Android (`AndroidApp/`) wraps the same web bundle. Shared settings live in `MobileShared/`.

| Item | Value | How known |
|---|---|---|
| Project | `iOSApp/ios/App/App.xcworkspace` (CocoaPods) | verified |
| Bundle identifier (QA) | `com.legalterminus.app.qa` | verified in the built `.ipa` Info.plist |
| Bundle identifier (production) | `com.legalterminus.app` — **not built for upload, not registered in Firebase** | `MobileShared/environments.json` |
| Version / build | 1.0.0 / **5** (`iOSApp/ios/App/Config/Shared.xcconfig`; build 4 was the earlier QA archive) | verified |
| Display name | Legal Terminus QA | verified |
| Apple team | LEGAL TERMINUS PRIVATE LIMITED, `LMD2KSCQZX` | verified |
| Auth | Firebase Auth: email/password, email link, Google and Sign in with Apple (native plugin `@capacitor-firebase/authentication`, `skipNativeAuth`); session persisted in the web view's IndexedDB (`Portal/src/lib/firebase.ts`) | verified |
| Roles | admin, manager, team_member, client, professional (view-only) | `Portal/src/routes/appRoutes.tsx` |
| Third parties | Firebase (Auth, Firestore, Storage), Razorpay (payments; **test mode on QA**), Google sign-in, Apple sign-in | `docs/qa-environment.md` |

## 2. QA environment (who the QA build talks to)

| Layer | QA | Production (must never be reached) |
|---|---|---|
| API / web | `https://legal-terminus-qa.web.app` | `https://legalterminus.com` |
| Database | Firestore `qa-data` | `(default)` |
| File storage | `legal-terminus-web-qa` | `legal-terminus-web.firebasestorage.app` |
| Email | switched off on QA | sent |
| Payments | Razorpay TEST keys | Razorpay LIVE |
| Sign-in accounts | `qa-*@legalterminus.test` only (API refuses any other domain: `TEST_ACCOUNT_EMAIL_DOMAINS`) | real users |
| Firebase project | **shared** `legal-terminus-web` (one set of sign-in accounts for QA and live) | same |
| iOS Firebase app | `com.legalterminus.app.qa` (registered 2026-11-16) | `com.legalterminus.app` — **not registered** |

## 3. Isolation checks run on build 5

| Check | Result |
|---|---|
| Environment switch is a build-time setting (`LT_APP_ENV`, default `qa`); there is no runtime toggle for a tester to flip | verified in `MobileShared/environments.json` and `capacitor.config.ts` |
| The `.ipa` web bundle contains QA hosts (`legal-terminus-qa.web.app`, `legal-terminus-web-qa`, `qa-data`) | verified (9 / 1 / 1 matches) |
| The `.ipa` web bundle contains **none** of: `https://legalterminus.com`, `legalterminus.com/api`, `legal-terminus-web.firebasestorage.app`, `localhost:5001` | verified (0 matches) |
| Build guard (`scripts/check-bundle.mjs`) ran in `npm run sync:qa` and passed ("clean qa bundle") | verified |
| QA accounts sign in on QA and only there (Firebase accepted all five; the app showed QA data, e.g. `E2E Client` matters) | verified |
| Universal-link host is the QA host, so the QA app never claims `legalterminus.com` (`LT_LINK_HOST`) | verified |
| `GoogleService-Info.plist` in the build is the QA iOS app's | verified (bundle id matches) |

## 4. Things that could still connect QA to production — and how they are handled

1. **Shared Firebase Auth project.** A real person signing in to the QA app is refused by the QA API, by design
   (`testEnvironment.js`). Do not remove `TEST_ACCOUNT_EMAIL_DOMAINS`. *Handled; never change it.*
2. **Google / Apple sign-in on QA.** A real Google account is refused with "This is a test environment". Testers must
   use the `qa-*@legalterminus.test` email + password logins. Google/Apple login with a personal account will not
   work on QA by design.
3. **Production app id.** `com.legalterminus.app` is not registered in Firebase and no production build was
   uploaded. Nothing in this task creates a production App Store record.
4. **`/api/auth/firebase-config` returns 500 on QA** (observation O-1). Unrelated to isolation; not changed.
5. **Backend `.env`** points at QA (`FIRESTORE_DATABASE_ID=qa-data`) and holds a revoked service-account key; it was
   not used. No script was run against live data.

## 5. Decision needed from the owner (not assumed)

The brief says to keep the existing bundle identifier and upload to "the existing Legal Terminus app". The repo's
design is the opposite and was chosen so QA can never touch production: a **separate QA app identity**
`com.legalterminus.app.qa`. Using `com.legalterminus.app` for a QA build would put a QA-pointing build under the
production App ID / listing, require registering the production Firebase iOS app, and risk a QA build being
promoted. **This work keeps `com.legalterminus.app.qa`** and needs an App Store Connect record for it
("Legal Terminus QA"). Please confirm.
