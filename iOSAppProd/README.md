# Legal Terminus — iPhone app, PRODUCTION (`iOSAppProd/`)

The production iPhone app: **Legal Terminus**, bundle `com.legalterminus.app`, talks to `legalterminus.com` and the live
database. It is a separate folder from the QA app (`iOSApp/`, "Legal Terminus QA", `com.legalterminus.app.qa`), so a QA build can
never be produced or uploaded from here. Both share `MobileShared/` and the web bundle `Portal/dist-mobile`.
Process and rules: `docs/ios-production-app.md`.

**This folder only builds production.** `capacitor.config.ts` refuses any other `LT_APP_ENV`, and `npm run sync` always runs the bundle
guard in production mode (it fails if a QA host, `qa-data`, a `.test` address or a localhost API is in the bundle).

```bash
npm ci
export PATH=$HOME/.lt-bin:$PATH LANG=en_US.UTF-8
npm run sync          # production web build + bundle guard + pod install
npm run open          # opens ios/App/App.xcworkspace (never the .xcodeproj)
```

**Never uploaded from here without the owner's go-ahead.** Production build checklist: `docs/ios-production-app.md`.
Signing: team `LMD2KSCQZX`. Never commit `GoogleService-Info.plist`, `.p8`, `.p12` or provisioning profiles. The production
`GoogleService-Info.plist` goes in `~/lt-android-release/keys/production/` (not in the repo).
