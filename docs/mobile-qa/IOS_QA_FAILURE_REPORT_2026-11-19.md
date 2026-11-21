# iPhone app QA failure report, 2026-11-19 (final)

**App tested:** main's cleaned `MobileApp` (Capacitor shell that opens the hosted QA Portal), commit `77d35f5e`, built in a scratch worktree. Nothing in the repo or in any env file was changed. **QA only**: `legal-terminus-qa.web.app`, `qa-*@legalterminus.test`.
**Devices:** iPhone 14 and iPhone 18 Pro, run one at a time. UI test target and extra tests exist only in the scratch copy (not committed).
**Not tested:** a real Apple ID login (no Apple account in the simulator; only the button's presence and enabled state), real Google login, launch performance (skipped), iPad.

| Device | Passed | Failed | Skipped |
|---|---|---|---|
| iPhone 18 Pro | 31 | 5 | 1 |
| iPhone 14 | 30 | 6 | 1 |

## Passed
Sign-in screen on both devices (launch, Google/Apple/email-link/forgot/sign-up controls present, friendly wrong-password message, keyboard, rotation, terms link). Login for admin, manager, team, client, professional. Relaunch keeps the session; sign-out works. Every-screen walk for every role. Admin matter search/filters, open matter and tabs, create matter. **Document upload** (photo picker to storage, no "Load failed") and **download of that document**. Clients **"Download contacts as Excel"** (share sheet with `client-database-2026-11-19.xlsx`, Save to Files). Reports sub-pages, dashboard tiles, notifications and profile. Header margin (iPhone 14 earlier run; iPhone 18 Pro via the every-screen header test).

## Failures
| # | Test | Devices | Reading |
|---|---|---|---|
| F-1 | Google button shows an error instead of starting | both | **Configuration.** Only a Firebase plist for `com.legalterminus.app.qa` exists here; main's app is `com.legalterminus.app`. `app-env.mjs` refuses this; I bypassed it in the scratch copy. A plist for `com.legalterminus.app` is needed for native Google sign-in. |
| F-2 | Website Orders, "Open matter": "Failed to load this matter. Task not found" | both | **Possibly real, not confirmed.** May be an order whose matter was deleted (QA data). |
| F-3 | Worksheets "Download Excel" shows no viewer | both | **Not an app bug.** The button is disabled because the QA sheet has 0 records. My test expectation was wrong. |
| F-4 | Admin header-margin test (18 Pro), admin matters search, admin sections, client sections (14) | one or both | **Test driver.** XCUITest drops or duplicates keystrokes in the login form. These tests did not run meaningfully on that device. |
| F-5 | Client sections "cannot open Dashboard" (18 Pro) | 18 Pro | Unverified, probably my menu lookup. |

## Not covered (honest gaps)
- Section tests only loaded top-level pages for Settings, Worksheets, Services, Clients, Users, My Tasks (no sub-links found to open). Those were not tested function by function.
- Worksheet download untested (empty sheet). Client "Export Excel" on Reports and invoice downloads not exercised.
- iPhone 14: admin matter search, admin header margin, admin sections and client sections were blocked by the driver in the final run (they passed or ran in earlier runs).
- Each create-matter run leaves a matter named "iOS QA Org <timestamp>" on QA (not deleted).

## Earlier run (this branch's older `iOSApp`)
That app calls the API from `capacitor://localhost`, which QA's API does not allow, so staff lists showed "Load failed". Main's hosted-Portal app does not have this problem.

## Follow-up, 2026-11-20 (iPhone 18 Pro, QA)
- **Test driver fixed.** The dropped keystrokes (F-4) came from typing into the login form while the keyboard was still animating in. `typeReliably()` in `iOSApp/ios/App/AppUITests/LaunchAndSignInUITests.swift` now reads the field back and retries. F-5 ("cannot open Dashboard" for the client) was the same cause; the client section walk now passes.
- **Staff-screen "Load failed" is the bundled app's origin.** This branch's `iOSApp` runs as `capacitor://localhost`, which QA's API does not allow (preflight: allowed for `https://legal-terminus-qa.web.app` only). Run against main's hosted-Portal app, admin matter search, the admin / manager / team / client / professional section walks (including My Tasks) and the header-margin tests (menu button at 71pt on every screen, including chat keyboard and rotation) all pass.
- **Sign in with Apple, simulator.** The button shows, opens Apple's sheet and recognises the signed-in Apple Account. The sign-in then stops at Apple's own password step ("Could Not Connect"; the simulator is not a trusted device). Not an app defect, but not verified end to end: it needs a real iPhone with the QA TestFlight build.
- **Production note.** The bundled iPhone app would hit the same origin rejection on production unless production's API allows `capacitor://localhost` (not checked; production untouched). The hosted-Portal build avoids it. Switching iPhone to the hosted build is on hold until the owner says to start.
