# iOS Development Audit — Legal Terminus

Date: 2026-11-16 · Phase 1 of the iOS delivery plan · **No application code was changed for this audit.**
Sources read: `MobileApp/` (since split into `iOSApp/`, `AndroidApp/`, `MobileShared/`), `docs/mobile-release.md`,
`docs/ios-app-implementation-guide.md`, `_bmad-output/planning-artifacts/epics.md` (E-29),
`Portal/src/routes/appRoutes.tsx`, `Portal/src/lib/{native,firebase,appleSignIn,googleSignIn}.ts`.
Anything not verified by reading or running it is marked **(unverified)**.

## 1. Existing architecture

| Layer | What it is |
|---|---|
| Mobile apps | **Capacitor 8 shell** (now `iOSApp/` and `AndroidApp/`, sharing `MobileShared/`) around the Portal. Android and iOS load the same web bundle (`Portal/dist-mobile`, from `npm run build:mobile`). There is no React Native, Flutter or native UI. |
| Portal | Vite + React + TypeScript + Tailwind (`Portal/`). Routes are declared once in `Portal/src/routes/appRoutes.tsx`. Native behaviour is guarded by `Capacitor.isNativePlatform()` (`lib/native.ts`, `lib/googleSignIn.ts`, `lib/appleSignIn.ts`, `lib/firebase.ts`). |
| Backend | Node/Express API (`backend/`), Firebase Auth (custom claims for roles), Firestore (QA = `qa-data`, live = `(default)`), Cloud Storage, Cloud Run behind Firebase Hosting. |
| Environments | One switch, `LT_APP_ENV` (`qa` default, `production`), described in `MobileShared/environments.json`; QA app id `com.legalterminus.app.qa`, production `com.legalterminus.app`. |
| Release model | Android: GitHub pipeline. iOS: Archive and upload from Xcode on a Mac (no fastlane, owner's decision). |

**Answer to "can Android run on iOS?"** No, and it doesn't need to: the Android app is not native code. Both
platforms are thin shells over one web app. `iOSApp/ios/` already exists (commit `9e22e144`, E29-S02),
so the iOS project is **already created**. What remains is build verification, Apple-side setup,
device QA and release.

Plugins: `@capacitor-firebase/authentication` (Google + Apple, `skipNativeAuth`), `@capacitor/app`,
`filesystem`, `keyboard`, `share`, `splash-screen`, `status-bar`, `@capacitor-community/file-opener`.
Pods: Capacitor 8 + the above + `CapacitorFirebaseAuthentication/Google`. `platform :ios, '15.0'`.

## 2. Android functionality inventory (= the Portal)

Routes from `appRoutes.tsx` (all work inside the shell; role gates are server- and client-enforced):

- **All roles:** Dashboard, Matters (`/tasks`, `/tasks/:id`), Profile, Orders, Notifications, Account deletion (`ACCOUNT_DELETION_ROLES`).
- **Admin / Manager / Team member:** My Tasks, Services, Matters board, Worksheets, Statutory calendar, Website orders, Leads / Marketing / Trademark / GST-returns reports.
- **Admin / Manager:** Users (+ forms), Clients, Reports (all-tasks, completed, pending, SLA, payment overrides, professional mapping, unassigned, master sheet, revenue, team performance, storage, client database), Website prices.
- **Admin only:** API keys, Webhooks, Email templates, Reporting access, Workflow editor, Client group fees.
- **Client:** My services report.
- **Cross-cutting:** sign-in (email + password, emailed sign-in link, Google, Apple), document upload / view / zip / CSV / XLSX export, discussion with image attachments, payments (gateway `razorpay`), account deletion request.
- **Not in v1 by decision (D4):** push notifications (E29-S12), iPad layout.

## 3. iOS compatibility assessment

| Area | Assessment |
|---|---|
| WebView | WKWebView, origin `capacitor://localhost` (not https; `server.iosScheme` must stay unset). API allowlist handles this exactly (E29-S03, code + QA workflow done). |
| Auth | Firebase JS SDK with IndexedDB persistence (pinned under Capacitor). Native Google and Apple return an ID token that the web SDK exchanges, so one session across web and app. Same accounts as Android and web. |
| Files | Download/share goes through `openBlobNative` / `shareBlobNative` (`native.ts`, `EXTENSIONS` map). Audit found no new code needed; device checklist open. |
| Payments | Razorpay web checkout inside WKWebView. See risk R3. |
| Safe areas / keyboard / status bar | `viewport-fit=cover`, `html[data-native="ios"]` CSS, Keyboard `resize: 'body'`, StatusBar `Style.Light` — code done; **never exercised on a device**. |
| Universal Links | `App.entitlements` `applinks:$(LT_LINK_HOST)`; needs Team ID. |
| Deletion (5.1.1(v)) | `POST /api/auth/me/deletion-request` + `/account/delete` page. Code and tests done; its Playwright spec is written but **not yet run**. |
| Sign in with Apple (4.8) | Code done; Firebase provider and Apple keys are not configured. |

## 4. Required code changes (remaining, small)

1. Verify the existing QA build on the simulator (never run in this session; Xcode absent — section 9).
2. `Info.plist`: `UIRequiredDeviceCapabilities` is `armv7`; use `arm64`. Confirm orientation intent (portrait + landscape listed; product doc says portrait-first). **(unverified impact)**
3. Run the unrun Playwright spec for E29-S08 against QA.
4. Fill placeholders once Apple data exists: `DEVELOPMENT_TEAM` (`Shared.xcconfig`), `TEAMID` (`ExportOptions.plist`), `appLinks.appleTeamId` (`environments.json`).
5. Enable Apple button on the website only after the Firebase Apple provider exists (`VITE_APPLE_SIGN_IN`).
6. Housekeeping the checklist requires with any change: `epics.md`, `architecture.md`, `spec.md`, `docs/releases/SYNC.md`, and a Playwright update for any flow changed.

## 5. Apple capabilities and permissions

- Capabilities: **Sign in with Apple**, **Associated Domains** (both in `App.entitlements`). Push is *not* requested.
- Usage strings present: camera, photo library read, photo library add. `ITSAppUsesNonExemptEncryption = false` (standard HTTPS/TLS only; **to be confirmed** at export-compliance time).
- Identifiers needed: App IDs `com.legalterminus.app` and `com.legalterminus.app.qa`; Services ID `com.legalterminus.app.web`; a Sign in with Apple key; an App Store Connect API key if uploads are scripted.

## 6. Backend and API compatibility

- QA: `capacitor://localhost` allowed (`corsOrigins.js`, tested). QA **bucket** CORS still to be applied.
- **Production API and bucket CORS do not yet allow the iOS origin.** Changing them is a security/production change that needs the owner's explicit approval, and the repo rules forbid touching the live project otherwise.
- All other endpoints are reused unchanged; roles are enforced by `verifyToken` + `requireRole`.

## 7. Third-party SDK compatibility

Capacitor 8 and the plugins above declare iOS support. Firebase iOS SDK is pulled in through the Authentication plugin pods. Razorpay is web-only. **Pod resolution has not been run** (no CocoaPods yet), so version conflicts are **unverified**.

## 8. Security risks

| # | Risk | Mitigation / status |
|---|---|---|
| R1 | Wrong environment baked into an App Store build | `check-bundle.mjs` guard + Xcode refuses to build before sync. Good; keep. |
| R2 | Secrets in repo | `.gitignore` covers `*.p8 *.p12 *.mobileprovision`, Firebase files, generated env. No Apple secrets exist on this Mac (only Android keystore + Firebase JSON were found). |
| R3 | **Payments in-app, App Review 3.1.1** — Razorpay for legal services. Services are delivered outside the app, which normally falls outside IAP, but a reviewer may question it. | Prepare a review note; owner decides whether to hide payment in the app if Apple objects. |
| R4 | Tokens in IndexedDB (WKWebView storage), not Keychain | Standard for Firebase web SDK; acceptable, noted for the QA report. Moving to Keychain would be a design change, not done. |
| R5 | Debug web inspector | Capacitor default: on in Debug only. Verify on the archived build. |
| R6 | Firebase serves AASA/assetlinks for all sites | Filling Team ID can publish an AASA on the live site; do it for production only when launch is approved (`mobile-release.md` item 11). |
| R7 | Hide-My-Email Apple accounts create a new client | Intended and documented (E29-S11). |

## 9. Development and deployment requirements — current state

| Requirement | State |
|---|---|
| Xcode | **Not installed.** Only Command Line Tools (outdated). Needs Mac App Store install (Apple ID sign-in) and `sudo xcode-select -s`. |
| CocoaPods | **Not installed.** Homebrew exists at `~/homebrew` (user-level). Gem install of 1.15.2 failed to compile a native extension against the old CLT SDK; retry after Xcode. |
| Apple Developer membership | You state it exists. **Not verifiable from here**: no Apple credentials, certificates, provisioning profiles, Team ID or App Store Connect API key are on this Mac. |
| `GoogleService-Info.plist` | Absent for both environments (`~/lt-android-release/keys/{qa,production}/` hold only `google-services.json`). |
| Existing App Store Connect listing | Unknown — to be checked before anything is created (rule: no duplicate listing). |
| Real iPhone | Not available to me. Device-only tests will be reported as **not executed**. |

## 10. Implementation stages

| Stage | Work | Blocked on |
|---|---|---|
| A | Install Xcode, `xcode-select`, license, CocoaPods | **You** (Apple ID, `sudo`) |
| B | `sync:ios` (QA), `pod install`, simulator build; fix issues; Info.plist corrections | A |
| C | Simulator QA: sign-in (email), navigation per role, uploads, safe areas, offline states, dark mode, performance. Write `IOS_QA_REPORT.md` | B, QA test accounts (`docs/qa-environment.md`) |
| D | Apple/Firebase setup: Team ID, App IDs, iOS Firebase apps, Apple key, plists; enable Google and Apple sign-in; QA bucket CORS (needs your approval) | Your Apple + Google Cloud access |
| E | Signed QA archive → TestFlight (QA app), real-iPhone checklist | D, a real iPhone (yours) |
| F | Store listing material: description, keywords, privacy answers (derived from `privacy-policy-app-addendum.md` and the code), age rating, screenshots, review notes → `APP_STORE_SUBMISSION_CHECKLIST.md` | C (screenshots), your sign-off on privacy answers |
| G | Production build: **production CORS change, production sync, archive, upload, submit** | **Explicit owner approval at each step** (repo rule: production is the owner's release) |
| H | Review monitoring, fixes, `IOS_PRODUCTION_DELIVERY_REPORT.md` | G |

## Decisions I need from you (nothing blocks stage A/B)

1. Which Apple ID / team owns the membership, and has App Store Connect already got a "Legal Terminus" entry?
2. Confirm production is still **QA-first**: I will stop at TestFlight on the QA app and ask before any production CORS change, production archive or App Review submission.
