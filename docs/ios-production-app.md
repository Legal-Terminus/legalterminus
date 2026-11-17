# Production iPhone app (`iOSAppProd/`)

Created 2026-11-17 (#268). A separate folder from the QA app so a QA build can never be made or uploaded from it.

| | QA (`iOSApp/`) | Production (`iOSAppProd/`) |
|---|---|---|
| App | Legal Terminus QA, `com.legalterminus.app.qa` | Legal Terminus, `com.legalterminus.app` |
| Backend | `legal-terminus-qa.web.app`, `qa-data`, `legal-terminus-web-qa` | `legalterminus.com`, live database, `legal-terminus-web.firebasestorage.app` |
| Environment | `LT_APP_ENV` switch (default qa) | fixed to production: `capacitor.config.ts` refuses any other value |
| Prepare | `npm run sync:qa` | `npm run sync` (bundle guard runs in production mode) |
| Tests | pre-login + signed-in (QA accounts) | pre-login only: no sign-ins, no test accounts, no live data |
| App Store Connect | record exists (Apple ID 6835742436) | **record does not exist yet** |

Shared: `MobileShared/` (scripts, `environments.json`) and the web bundle `Portal/dist-mobile` (rebuilt by each `sync`; run the
sync of the app you are about to build).

## Status 2026-11-17 (built, NOT uploaded)
- `npm run sync` in `iOSAppProd/`: production bundle guard passed ("clean production bundle"); bundle has no QA host, `qa-data` or `.test` address.
- Simulator tests (pre-login only): 10 passed, 1 skipped (launch-time measure), 0 failed. The Google test is an expected failure (below).
- Release archive (unsigned, local only): `~/lt-android-release/out/prod/legalterminus-prod-1.0.0-1.xcarchive`. Info.plist: `com.legalterminus.app`, "Legal Terminus", 1.0.0 (1). **Not exported, not signed, not uploaded; Apple was not contacted** (signing with managed profiles would register the production App ID in the Apple account).

## Before the production build can be uploaded (owner)
1. App Store Connect: create the record "Legal Terminus", `com.legalterminus.app`.
2. Firebase: register the iOS app `com.legalterminus.app` in `legal-terminus-web`; put its `GoogleService-Info.plist` in `~/lt-android-release/keys/production/` (never in the repo). Until then Google sign-in fails in this app (the Google test is wrapped in `XCTExpectFailure`; remove it when fixed).
3. Sign in with Apple for production (Firebase Apple provider, Services ID, key): App Store guideline 4.8.
4. Universal links: Apple Team ID `LMD2KSCQZX` in `MobileShared/environments.json` (`appLinks.appleTeamId`).
5. Production storage bucket CORS: add `capacitor://localhost` (otherwise document upload fails, as on QA: D-5 in `docs/LEGAL_TERMINUS_IOS_QA_REPORT.md`). Production API `CORS_ORIGINS` must allow `capacitor://localhost`.
6. Privacy policy live and covering the app and account deletion (draft PR #223). Listing text, screenshots, age rating, privacy label. A production reviewer account (client, no real data); delete it after review.

## Upload (only when the owner says so, after QA is finished)
```
cd iOSAppProd && export PATH=$HOME/.lt-bin:$PATH LANG=en_US.UTF-8 && npm run sync
# raise CURRENT_PROJECT_VERSION in ios/App/Config/Shared.xcconfig, then:
cd ios/App && xcodebuild -workspace App.xcworkspace -scheme App -configuration Release -destination 'generic/platform=iOS' \
  -archivePath ~/lt-android-release/out/prod/<name>.xcarchive CODE_SIGNING_ALLOWED=NO archive
# export + upload (this registers the App ID and uploads): copy ../ExportOptions.plist, plutil -insert destination -string upload,
xcodebuild -exportArchive -archivePath <archive> -exportOptionsPlist <that plist> -exportPath <dir> -allowProvisioningUpdates
```
Test the production build in TestFlight with staff before App Review. Never push a release tag for the app.
