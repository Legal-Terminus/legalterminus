# LEGAL_TERMINUS_IOS_QA_REPORT

Date: 2026-11-17 · App under test: **Legal Terminus QA** `com.legalterminus.app.qa` 1.0.0 (5) · Simulator: iPhone 18 Pro,
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
`offline-role`, most of `discussion`, `matters.spec`, `my-tasks`, `recurring-matters` passed. **Failed on both attempts
(9 specs):** `account-deletion` (deletion-request flow), `discussion` x2 (`@` suggestions; staff Edit visibility),
`matters.spec` x3 (grid render, multi-criteria filter, column filter), `my-tasks` x2 (work grid),
`recurring-matters` (Create Matter offers Repeats). **Not diagnosed.** Hints, not conclusions: the failing selectors are desktop
table/grid ones (`.cursor-pointer.border-b`, "Due" column) and the Create button reads "Create" below 640px
(`TasksPage.tsx`), so many are consistent with specs written for desktop width. They have not been opened in a
browser to separate test problems from real phone bugs. `documents.spec` results were cut off and are not counted.

## Defects

| ID | Severity | Finding | Status |
|---|---|---|---|
| D-1 | Medium | iOS zoomed/panned the page when a 14px field was focused | Fixed (16px in the app), guard test passes |
| T-1 | Low (test) | Signed-in runs left a session that broke the pre-login tests | Fixed: teardown signs out |
| P-1 | Unknown | 9 Playwright phone-width specs fail (above) | **Open, not diagnosed** |
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
down by: no document/matter/payment flows exercised in the app, 9 undiagnosed phone-width failures, no real-device run.
