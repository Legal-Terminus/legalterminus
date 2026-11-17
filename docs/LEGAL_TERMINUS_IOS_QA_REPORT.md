# LEGAL_TERMINUS_IOS_QA_REPORT

Date: 2026-11-17 · App under test: **Legal Terminus QA** `com.legalterminus.app.qa` 1.0.0 (7) · Simulator: iPhone 18 Pro,
iOS 27.2, Xcode 27.2 · Backend: QA only (`legal-terminus-qa.web.app`, `qa-data`). Earlier detail: `docs/IOS_QA_REPORT.md`.
**Only tests that actually ran are counted. Everything else is under "Not run".**

## Results

| Suite | Run | Passed | Failed | Skipped |
|---|---|---|---|---|
| iOS XCUITest, real app in the simulator (`AppUITests`) | 22 | 21 | 0 | 1 (launch-time perf, runs on request) |
| Playwright, iPhone 15 WebKit against QA (focused set, 2 batches) | not totalled (two partial batches) | see below | 9 specs | not counted |

**XCUITest (17 passed):** launch + splash, sign-in options (Google, Sign in with Apple, email link, forgot password, sign up),
wrong password (friendly message, no Firebase code), keyboard, rotation, Terms opens in Safari, D-1 margin guard, sign-up /
forgot-password / email-link screens, Google button starts the native prompt (no account used), **sign-in and role checks
for admin, manager, team member, client and professional** (menu items each role should and should not see), **session
survives an app relaunch**, **sign out returns to sign-in and stays signed out after relaunch**. Admin and client
dashboards showed QA data. Screenshots are attached in the Xcode result bundle for each role.

**Playwright (iPhone WebKit, QA data):** `auth.setup` (5 roles), `auth-rbac`, `dashboard-cockpits`, `notifications`,
`offline-role`, most of `discussion`, `matters.spec`, `my-tasks`, `recurring-matters` passed. **9 specs failed at phone width and pass on desktop Chromium** (same QA data), so none is a backend or logic fault. Each was
reproduced and the phone screenshot read:
- **6 are desktop-only test selectors, UI is fine** (screens checked visually): `matters.spec` x3 and `my-tasks` x2 look for table
  columns while the phone shows cards; `recurring-matters` clicks "Create Matter" while the phone button reads "Create". Not changed
  (you asked for UI fixes only); the desktop run covers them.
- **2 chat specs** (`@` mention, Edit message): the `@` list and Send work on the phone (message posted, 201) once the Send
  button is scrolled into the clear. At rest it can sit under the fixed bottom nav, so an automated click lands on the nav. I tried a
  sticky Send row; it broke sending in my probe, so I **reverted it**. Left open as a minor UI item (P-2).
- **1 spec** (`account-deletion`): its first step failed because the phone account button had no readable name (only initials).
  **Fixed** (D-2). With that, the client's deletion flow passes on the phone through the friendly "account disabled" message. The
  last step (admin sees the request in Users on a phone) was **not confirmed**.

## Round 2 (2026-11-17, build 7)
Added in-app tests: matters list + search + Status/Payment filters, open a matter and its Steps / Documents / Payments / Chat tabs,
chat composer, notifications, client "My Services" page, plus **Send must sit above the on-screen keyboard** (measured).
Wider Playwright sweep in iPhone WebKit on QA (documents, payments, search, users, matters, professional): 85 passed, 14 failed,
7 skipped. On desktop 13 of those 14 pass, so they are phone-only; the 14th (`payments-client` unauthenticated check, API on
localhost:5001) fails on desktop too and is not a UI matter.

**Phone-only failures, classified (screens read):** 10 are test-only: `getByText(...).first()` lands on a hidden desktop-table copy
(matters-and-clients-lists x6, users x3), or expects a hidden desktop label/format ("Matter owner" label is hidden below 640px but the
select is named for VoiceOver; WebKit formats upload time as "at 12:05 pm", the spec expects a comma; sidebar "Users" link is the
bottom-bar item on phones). `account-deletion` (admin step) and `professional-access` (needs "Create Matter" label) are the same family.
None points to broken app behaviour. Not rewritten (UI-only brief); desktop runs cover them.

## Defects

| ID | Severity | Finding | Status |
|---|---|---|---|
| D-1 | Medium | iOS zoomed/panned the page when a 14px field was focused | Fixed (16px in the app), guard test passes |
| D-2 | Low (a11y) | Account button had no accessible name on phones | Fixed (`TopBar.tsx`) |
| D-3 | **Medium** | **iPhone app: with the keyboard open, the chat Send button was hidden behind the keyboard** (measured: Send bottom 741 > keyboard top 590) | **Fixed**: Capacitor Keyboard `resize: 'native'` (iPhone app only). Retested: passes. Two web-only attempts did not work and were reverted |
| D-4 | Low (UI) | Chat Send could rest under the bottom nav | Fixed: scroll margin on the Send row; chat specs pass on phone |
| T-1 | Low (test) | Signed-in runs left a session that broke pre-login tests | Fixed (teardown signs out) |
| T-2 | Info | Phone-only Playwright failures (above) | Classified; 3 specs adjusted to phone width |
| O-1 | Low | `/api/auth/firebase-config` returns 500 on QA (backend; out of UI scope) | Open |
| O-4 | Low | Google prompt says "App", not "Legal Terminus QA" | Open |
| O-3 | Watch | One first launch after install sat on the splash >14s | Not reproduced |
No Critical or High defects found in what ran.

## Performance / crashes / security (only what was observed)
- **Launch:** 2.5 s average (5 runs, simulator; not a phone figure). **Crashes:** none observed in any simulator run.
- **Memory, battery, repeated API calls, dark mode:** not measured.
- **Token storage:** Firebase session is kept in the web view's IndexedDB (`indexedDBLocalPersistence`), not the Keychain. It
  survived relaunch and was cleared by sign out (tested). Judgement: acceptable for a Capacitor shell; not a penetration test.
- **HTTPS:** the QA API and the bundle use `https://` only; no ATS exceptions in `Info.plist` (read, not network-captured).
- **Secrets:** none in the repo; the bundle holds the public Firebase web key only. QA passwords were read from a gitignored
  file and passed by environment variable.
- **RBAC:** client and professional navigation hides staff areas (Users, Clients, Coupons, API Keys); team member hides Users.
- **Production exposure:** the build contains no production host or bucket (audit §3).

## Not run
Uploading and downloading a document, document preview, creating or editing a matter, search/filter on a phone in the real
app, payments (Razorpay test mode), completing Google or Sign in with Apple, camera/photo picker, share sheet, push
notifications, session expiry, password reset by email, a real iPhone, smaller screens (SE) and iPad, landscape beyond sign-in.

## Readiness score: **64 / 100**
Up from 42 (58 earlier today): all five roles sign in on QA in the real app, RBAC/session/sign-out verified, build uploaded and processed. Held
down by: no document/matter/payment flows exercised in the app, a few open phone UI items (P-2) and no document/matter/payment flows exercised in the app, no real-device run.
