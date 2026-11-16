# Legal Terminus — iPhone app (`iOSApp/`)

A Capacitor shell around the Portal. Separate from `AndroidApp/`; both share `MobileShared/`
(`environments.json`, build scripts) and the web bundle `Portal/dist-mobile`.
Full process: `docs/mobile-release.md`. Test results: `docs/IOS_QA_REPORT.md`.

| | QA | Production |
|---|---|---|
| App on the phone | **Legal Terminus QA** (`com.legalterminus.app.qa`) | Legal Terminus (`com.legalterminus.app`) |
| Backend | `legal-terminus-qa.web.app`, `qa-data` | `legalterminus.com`, live database |
| Prepare a build | `npm run sync:qa` | `npm run sync:production` — **owner-approved releases only** |

```bash
npm ci
export PATH=$HOME/.lt-bin:$PATH      # CocoaPods 1.17 on this Mac (docs/mobile-release.md)
npm run sync:qa                      # web build + bundle guard + pod install
npm run open                         # opens ios/App/App.xcworkspace in Xcode (never the .xcodeproj)
npm run run:app                      # sync + run on a simulator

# Simulator UI tests (no account needed)
cd ios/App && xcodebuild test -workspace App.xcworkspace -scheme App \
  -destination 'platform=iOS Simulator,name=iPhone 18 Pro' CODE_SIGNING_ALLOWED=NO
```

Signing: team `LMD2KSCQZX` (`ios/App/Config/Shared.xcconfig`, `ios/ExportOptions.plist`). Never commit
`GoogleService-Info.plist`, `.p8`, `.p12` or provisioning profiles.
