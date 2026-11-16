# Legal Terminus — Android app (`AndroidApp/`)

A Capacitor shell around the Portal. Separate from `iOSApp/`; both share `MobileShared/`
(`environments.json`, build scripts) and the web bundle `Portal/dist-mobile`.
Full process: `docs/mobile-release.md`.

| | QA | Production |
|---|---|---|
| App on the phone | **Legal Terminus QA** (`com.legalterminus.app.qa`) | Legal Terminus (`com.legalterminus.app`) |
| Backend | `legal-terminus-qa.web.app`, `qa-data` | `legalterminus.com`, live database |
| Prepare a build | `npm run sync:qa` | `npm run sync:production` (the GitHub release job does this) |

```bash
npm ci
npm run sync:qa
cd android && ./gradlew assembleDebug      # APK in android/app/build/outputs/apk/debug/
npm run open                               # Android Studio
```

Production releases are built and signed by the GitHub pipeline ("Deploy to Production" with
`build_android`), not locally. Never commit `google-services.json`, `key.properties` or keystores.
