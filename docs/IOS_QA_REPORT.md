# iOS QA report — Legal Terminus (QA build)

Date: 2026-11-16 · Build under test: **Legal Terminus QA** (`com.legalterminus.app.qa`), Debug, simulator ·
Device: iPhone 18 Pro simulator, iOS 27.2, Xcode 27.2 · Backend: QA (`legal-terminus-qa.web.app`, `qa-data`).

**Only tests that were actually executed are listed as passed. Everything else is listed as NOT RUN.**

## Summary

| | |
|---|---|
| Build, sync and bundle guard (QA) | Passed |
| Simulator UI tests (XCUITest, no account needed) | 8 executed, 8 passed (1 asserts a known defect) + 1 performance test passed on request |
| Signed-in flows (all roles) | **NOT RUN** — QA test-account passwords are out of date (login rejected) |
| Real iPhone, TestFlight, completing a Google/Apple login, payments, uploads | **NOT RUN** |
| Open defects | 1 low-severity (D-1), 1 environment issue (E-1) |
| **App Store readiness score** | **40 / 100** — it builds, signs and opens, and the sign-in screen is solid; most of the product has not been exercised on iOS |

Not met: "100% of critical test cases passing" — the critical signed-in cases have not run.

## What was run

### A. Build and packaging
| Check | Result |
|---|---|
| `npm run sync:qa` in `iOSApp/` (web build, bundle guard, `pod install`) | Passed — guard: "clean qa bundle", 8 plugins found |
| Simulator build (Debug, no signing) | Passed |
| Signed App Store `.ipa` (Release, team `LMD2KSCQZX`, export method `app-store-connect`) | Produced; signature `Apple Distribution: LEGAL TERMINUS PRIVATE LIMITED`. **Not uploaded** |
| Shared script tests (`npm test`, both apps) | 10/10 passed in each |
| Android debug build after the folder split (`gradlew assembleDebug`) | Passed |

### B. Simulator UI tests — `iOSApp/ios/App/AppUITests/LaunchAndSignInUITests.swift`
| Test | Result |
|---|---|
| Launch reaches the sign-in page and the splash screen hides | Passed |
| Google, Sign in with Apple (guideline 4.8), email-link, forgot-password and sign-up controls are present | Passed |
| Wrong credentials show a friendly message ("Invalid email or password."), no Firebase error code | Passed |
| Keyboard opens and the password field stays visible | Passed (software keyboard enabled in the Simulator) |
| Rotating to landscape and back keeps sign-in usable | Passed |
| Terms link opens in Safari, not inside the app (E29-S06) | Passed |
| No horizontal overflow before typing | Passed |
| No horizontal overflow **after** typing | **Fails as expected — D-1** (wrapped in `XCTExpectFailure`) |
| Google button starts native sign-in (iOS system prompt "wants to use accounts.google.com to sign in"; cancelled, no account used). Needs the QA `GoogleService-Info.plist` (registered 2026-11-16) | Passed |
| Launch time (5 runs, `LT_PERF=1`) | Passed — average **2.50 s**, relative std. dev. 2.0% (simulator on a Mac; not a phone figure) |

Screenshots: kept as attachments in the Xcode result bundle (sign-in portrait, landscape, keyboard open, wrong-credentials, after-typing).

### C. Web-level check
Normal iPhone WebKit (Playwright, iPhone 15 profile) on the same Portal login page: no horizontal overflow before or after typing (scroll width = viewport width). This is what isolates D-1 to the real WKWebView.

## Defects

| ID | Severity | Finding | Status |
|---|---|---|---|
| D-1 | Low–Medium | In the real app, after focusing and typing in the sign-in form, the page sits about 2 pt too far right (`Continue with Google` ends at 404.6 pt on a 402.5 pt screen; an earlier screenshot looked shifted further). Not reproducible in iPhone WebKit, so it is the WKWebView keyboard-focus scroll (`Keyboard: { resize: 'body' }`), not the page layout. Cause **not** confirmed — needs Safari Web Inspector on the simulator. | **Open** |
| E-1 | Environment | The QA test accounts reject the stored passwords (`Portal/e2e/.env.e2e`, 2 Nov): "Invalid email or password". The seed needs backend credentials that are not on this Mac. Blocks every signed-in test. | **Open** — needs the owner |
| O-1 | Observation | `GET /api/auth/firebase-config` returns 500 on QA. Not investigated. | Open |
| O-2 | Observation | Landscape (short viewport) shows the desktop split layout with the Google / Apple / email options below the fold. Usable by scrolling; not logged as a defect. | Note |
| O-4 | Polish | The Google system prompt names the app "App" (the Xcode product name), not "Legal Terminus QA". Cosmetic; worth fixing before App Review. | Open |
| O-3 | Observation | First launch after install once stayed on the splash for >14 s; later launches were normal (2.5 s). Not reproduced in 5 measured launches. | Watch |

## NOT RUN (and why)
- **Every signed-in screen, role-based access (admin / manager / team / client), matters, documents, uploads, downloads, discussion, notifications, account deletion, session expiry** — blocked by E-1. The repo's Playwright suite is ready (97 specs) and will cover them in iPhone WebKit once the accounts work.
- **Completing a Google login** — the native sign-in starts (tested), but no Google account was signed in; the full round trip into the Portal, the refused-account message and session restore are NOT RUN.
- **Sign in with Apple** — needs the Firebase Apple provider, Services ID and key (not configured), plus a device with an Apple ID.
- **Payments (Razorpay in WKWebView), camera/photo-library permissions, file picker, share sheet** — need signed-in data and, for the camera, a real iPhone.
- **Real-device testing, TestFlight, memory/battery profiling, dark mode** — no iPhone attached; not attempted.
- **Security testing** — only inferred from code in the audit; no penetration or token-storage test was run.
- **Production configuration** — a production sync was not run (QA-first rule).

## How to test better (what is set up and what is next)
1. **Now:** `cd iOSApp/ios/App && xcodebuild test -workspace App.xcworkspace -scheme App -destination 'platform=iOS Simulator,name=iPhone 18 Pro' CODE_SIGNING_ALLOWED=NO` (add `TEST_RUNNER_LT_PERF=1` to include the launch-time measurement).
2. **Unblock E-1** (owner): re-run `FIRESTORE_DATABASE_ID=qa-data node backend/scripts/seed-e2e.js` with backend credentials. Then run the repo's Playwright suite against QA in an iPhone WebKit profile for the broad functional coverage, and add a `SignedInUITests.swift` that signs in as each role in the real app (credentials passed as environment variables, never committed).
3. **Real iPhone** via TestFlight (needs the QA app record in App Store Connect) for camera, files, share, Apple sign-in and payments.
4. **D-1:** attach Safari → Develop → Simulator → the app's web view and watch `window.scrollX` while focusing the inputs.
