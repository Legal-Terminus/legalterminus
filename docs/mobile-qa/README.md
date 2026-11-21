# iPhone QA reports (16–20 Nov 2026)

Written by Akash during the iPhone QA rounds on `feat/ios-android-app-split` (#268), kept for the
record. **They test the earlier design**: a separate QA app (`com.legalterminus.app.qa`) with the
Portal bundled inside, running at `capacitor://localhost`. That design is retired (E29-S13, S14).

What they found that still matters:
- D-1 (form fields zoom on focus), the account button's name, Chat Send under the keyboard and the
  friendly upload error — fixed on `main` in #336.
- **D-5 (uploads fail)** and the staff screens' "Load failed" were the bundled app's
  `capacitor://localhost` origin. The hosted app has the site's own origin, so they pass; the
  report of 20 Nov already shows them passing against main's hosted app.
- F-1 (Google sign-in error): the only Firebase plist was for the `.qa` app. The app on `main` needs
  the plist for `com.legalterminus.app`.

How to test now: `docs/mobile-testing.md`.

| File | What |
|---|---|
| `IOS_QA_FAILURE_REPORT_2026-11-19.md` | the final round, with the 20 Nov follow-up against main's hosted app |
| `IOS_QA_REPORT.md` | defects D-1 to D-6 |
| `LEGAL_TERMINUS_IOS_QA_REPORT.md`, `LEGAL_TERMINUS_IOS_QA_AUDIT.md` | the TestFlight rounds |
| `IOS_DEVELOPMENT_AUDIT.md` | the audit of the iOS work |
