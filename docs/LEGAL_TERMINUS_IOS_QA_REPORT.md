# LEGAL_TERMINUS_IOS_QA_REPORT

Date: 2026-11-17 · App under test: **Legal Terminus QA** `com.legalterminus.app.qa` 1.0.0 (6) · Simulator: iPhone 18 Pro,
iOS 27.2, Xcode 27.2 · Backend: QA only (`legal-terminus-qa.web.app`, `qa-data`). Earlier detail: `docs/IOS_QA_REPORT.md`.
**Only tests that actually ran are counted. Everything else is under "Not run".**

## Results

| Suite | Run | Passed | Failed | Skipped |
|---|---|---|---|---|
| iOS XCUITest, real app in the simulator (`AppUITests`) | 18 | 17 | 0 | 1 (launch-time perf, runs on request) |
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

## Defects

| ID | Severity | Finding | Status |
|---|---|---|---|
| D-1 | Medium | iOS zoomed/panned the page when a 14px field was focused | Fixed (16px in the app), guard test passes |
| T-1 | Low (test) | Signed-in runs left a session that broke the pre-login tests | Fixed: teardown signs out |
| D-2 | Low (accessibility) | The account button had no accessible name on phones (VoiceOver read only initials) | **Fixed** in `TopBar.tsx` (`aria-label` = the user's name); web build passes |
| P-1 | Info | 9 phone-width Playwright specs fail; all pass on desktop; 6 are desktop-only selectors, 1 fixed via D-2 (admin step unconfirmed) | Classified above |
| P-2 | Low (UI) | In the chat composer the Send button can rest under the bottom nav until scrolled | **Open** (sticky fix tried and reverted) |
| O-1 | Low | `/api/auth/firebase-config` returns 500 on QA | Open |
| O-4 | Low | Google prompt says "App", not "Legal Terminus QA" | Open |
| O-3 | Watch | One first launch after install sat on the splash >14s | Not reproduced in the final runs |
No Critical or High defects were found in what ran.

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

## Readiness score: **58 / 100**
Up from 42: all five roles sign in on QA in the real app, RBAC/session/sign-out verified, build uploaded and processed. Held
down by: no document/matter/payment flows exercised in the app, a few open phone UI items (P-2) and no document/matter/payment flows exercised in the app, no real-device run.
