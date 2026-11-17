# iOS QA report — Legal Terminus (QA build)

Date: 2026-11-16 · Build under test: **Legal Terminus QA** (`com.legalterminus.app.qa`), Debug, simulator ·
Device: iPhone 18 Pro simulator, iOS 27.2, Xcode 27.2 · Backend: QA (`legal-terminus-qa.web.app`, `qa-data`).

**Only tests that were actually executed are listed as passed. Everything else is listed as NOT RUN.**

## Summary

| | |
|---|---|
| Build, sync and bundle guard (QA) | Passed |
| Simulator UI tests (XCUITest, no account needed) | 11 executed, 11 passed + 1 performance test passed on request |
| Signed-in flows (all roles) | **NOT RUN** — QA test-account passwords are out of date (login rejected) |
| Real iPhone, TestFlight, completing a Google/Apple login, payments, uploads | **NOT RUN** |
| Open defects | none in the app; 1 environment issue (E-1) blocks signed-in testing |
| **App Store readiness score** | **42 / 100** — it builds, signs and opens, and the sign-in screen is solid; most of the product has not been exercised on iOS |

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
| Page keeps its left margin with the keyboard open (pixel check; guards D-1) | Failed before the fix, **passed after** |
| Sign-up screen opens (name, email, password rules, mobile, business, terms checkbox, Create account) — opened, never submitted | Passed (screenshot reviewed) |
| Forgot-password screen opens ("Reset password", email field, Send reset link, Back to Sign in) — never submitted | Passed (screenshot reviewed) |
| Asking for a sign-in link with no email shows "Enter your email address above, then ask for a sign-in link." | Passed (screenshot reviewed) |
| Google button starts native sign-in (iOS system prompt "wants to use accounts.google.com to sign in"; cancelled, no account used). Needs the QA `GoogleService-Info.plist` (registered 2026-11-16) | Passed |
| Launch time (5 runs, `LT_PERF=1`) | Passed — average **2.50 s**, relative std. dev. 2.0% (simulator on a Mac; not a phone figure) |

Screenshots: kept as attachments in the Xcode result bundle (sign-in portrait, landscape, keyboard open, wrong-credentials, after-typing).

### C. Web-level check
Normal iPhone WebKit (Playwright, iPhone 15 profile) on the same Portal login page: no horizontal overflow before or after typing (scroll width = viewport width). This is what isolates D-1 to the real WKWebView.

## Defects

| ID | Severity | Finding | Status |
|---|---|---|---|
| D-1 | ~~Medium~~ **Fixed 2026-11-16** | With the keyboard open on any form, the page was ~14% larger and panned sideways (left margin gone, right edge cut off). **Cause (verified):** every form field was 14 px (`text-sm`, read from the page: login and sign-up inputs all `14px`); iOS zooms into any focused field under 16 px by 16/14 = 1.14 — the measured zoom — and scrolls to it. It never showed in Playwright/desktop WebKit, which does not do the focus zoom. **Fix:** `Portal/src/index.css` — in the iPhone app only (`html[data-native="ios"]`) inputs, selects, textareas and contenteditable are 16 px. Website and Android unchanged. **Verified:** the new pixel test `testPageKeepsItsMarginWhileTyping` FAILS on the unfixed build and PASSES on the fixed build, with the keyboard confirmed on screen. | **Fixed — needs a look on a real iPhone** |
| E-1 | Environment | The QA test accounts reject the stored passwords (`Portal/e2e/.env.e2e`, 2 Nov): "Invalid email or password". The seed needs backend credentials that are not on this Mac. Blocks every signed-in test. | **Open** — needs the owner |
| O-1 | Observation | `GET /api/auth/firebase-config` returns 500 on QA. Not investigated. | Open |
| O-2 | Observation | Landscape (short viewport) shows the desktop split layout with the Google / Apple / email options below the fold. Usable by scrolling; not logged as a defect. | Note |
| O-5 | Note | The pixel test does not include the keyboard in its screenshot (a capture quirk); the test itself confirms the keyboard is on screen before checking. | Note |
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
4. **D-1 follow-up:** the website has the same 14 px fields, so iPhone *Safari* users probably get the same zoom on legalterminus.com. Not changed here (web is out of scope for the app fix); worth a separate issue.
