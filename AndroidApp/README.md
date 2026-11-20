# Legal Terminus — Android app (`AndroidApp/`)

A Capacitor shell that **opens the hosted Portal** (`https://<host>/portal/`; nothing of the Portal is
bundled), so a website deployment reaches installed apps with no new Play release. Only native changes
(plugins, permissions, manifest, icons, SDK, Capacitor config) need a new build. Separate from `iOSApp/`
(which still bundles the Portal); both share `MobileShared/environments.json`.
`web-src/*.html` are the local fallback pages (offline / old WebView); `npm run sync` generates `web/` from them.
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
