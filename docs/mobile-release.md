# How the mobile apps are built and released

Adopted 2026-11-10 (E-29). The model is the BeatMyEMI apps: **Android is built and signed
by the GitHub pipeline on a release; iOS is archived and uploaded from Xcode on the Mac.**
There is no fastlane, by the owner's decision. The web release process is unchanged and is
in `docs/delivery.md`.

**One app that opens the hosted Portal (owner, 2026-11-19).** The Android and iPhone apps are a
native shell around the Portal **as it is hosted**: `https://legal-terminus-qa.web.app/portal/`
on QA, `https://legalterminus.com/portal/` in production. Nothing of the Portal is bundled into
the app. There is **one app**, `com.legalterminus.app`, "Legal Terminus", in both stores: it is
pointed at QA first, and the same app is switched to production by building it for production.
This replaces the bundled-Portal design of 2026-11-02 to 2026-11-18 (E29 D7).

What that means:

- **A Portal deploy reaches the apps at once.** Merging to `main` updates the QA app; a release
  tag updates the production app. No store build is needed for a Portal change. A new store
  build is needed only when the **native shell** changes (a Capacitor plugin, a permission, an
  icon, the version number).
- **No CORS for the apps.** The app's page *is* the site, so API calls are same-origin through
  the Hosting rewrite and uploads use the site's own bucket entry. `localhost` and
  `capacitor://localhost` are allowed nowhere — not on the API, not on either bucket.
- **The shell and the Portal must agree.** The Portal calls native plugins only behind
  `Capacitor.isNativePlatform()` and dynamic `import()` (`Portal/src/lib/native.ts`). A Portal
  change that needs a **new** plugin must check the plugin is there
  (`Capacitor.isPluginAvailable('X')`) and keep working without it, because phones run older
  shells until they update. Keep the `@capacitor/*` versions in `Portal/package.json` and
  `MobileApp/package.json` on the same major.

```
merge to main ──▶ QA site + QA Portal ──▶ every QA-pointed app shows it immediately
tag vX.Y.Z-lt.N ──(approval)──▶ legalterminus.com + its Portal ──▶ every production app shows it

native shell change only:
  "Deploy to Production" by hand from the TAG, build_android=true
        └─▶ signed .aab/.apk ──▶ GitHub Release "vX.Y.Z (Build N)" ──▶ Play Console (by hand)
  Mac: git checkout vX.Y.Z-lt.N → LT_APP_ENV=production npm run sync:ios
        └─▶ Xcode: Archive → Distribute → App Store Connect ──▶ TestFlight ──▶ App Store
```

## The environment switch

**One value decides which hosted Portal a build opens: `LT_APP_ENV` = `qa` (the default) or
`production`.** It comes from one file, `MobileApp/environments.json`.

| | QA (`LT_APP_ENV=qa`, default) | Production (`LT_APP_ENV=production`) |
|---|---|---|
| App name and id | Legal Terminus, `com.legalterminus.app` | the same |
| The app opens | `https://legal-terminus-qa.web.app/portal/` | `https://legalterminus.com/portal/` |
| Loads inside the app (`allowNavigation`) | `legal-terminus-qa.web.app` only | `legalterminus.com` only |
| Emailed links open the app on | `legal-terminus-qa.web.app` | `legalterminus.com` (only after launch approval) |
| Who can sign in | `@legalterminus.test` accounts only (the QA guard) | real accounts; test accounts refused |

```
LT_APP_ENV ─▶ MobileApp/scripts/app-env.mjs  (run first by every `npm run sync:*`)
               ├─ MobileApp/.app-env.json              the choice; Gradle and capacitor.config.ts read it
               ├─ MobileApp/web/app-env.js             the Portal URL, for the error page's "Try again"
               ├─ ios/App/Config/Environment.xcconfig  bundle id, display name, link host, Google URL scheme
               └─ copies google-services.json / GoogleService-Info.plist, and refuses one for another app
            ─▶ cap sync  (writes capacitor.config.json with server.url into each platform)
```

- `npm run sync:android` / `sync:ios` / `sync` in `MobileApp/` → a build that opens **QA**.
- `LT_APP_ENV=production npm run sync:android` (or `sync:ios`) → a build that opens **production**.
- Gradle and Xcode build whatever was synced. Gradle refuses `-PappEnv=production` on a project
  synced for QA (and the other way round). Xcode refuses to build until a sync has written
  `Config/Environment.xcconfig`.
- Only the environment's host loads inside the app. Every other host — receipts, the payment
  gateway's hand-offs, other sites — opens in Safari / the browser.
- `MobileApp/web/` holds only `error.html` (no connection; on Android, a WebView older than
  version 111) and a placeholder `index.html` Capacitor requires.
- Both environments use the one Firebase project, `legal-terminus-web`, and the one app id, so
  there is **one** `google-services.json` and **one** `GoogleService-Info.plist`.

**Switching the app from QA to production** is a new store build: run the production sync,
raise the build number, build, upload. Testers on TestFlight / Internal testing get the QA-pointed
builds; the first production-pointed build is the one that goes to review.

## The numbers

- **One `version_name` and one `build_number` for both platforms per release.** Android's
  `versionName`/`versionCode`, iOS's `MARKETING_VERSION`/`CURRENT_PROJECT_VERSION`
  (`MobileApp/ios/App/Config/Shared.xcconfig`, or Xcode → General).
- `build_number` = the last build of either platform + 1. It never goes down and is never reused,
  and a QA-pointed build takes a number too: Play and TestFlight count per app, not per track.
- `version_name` is the app shell's own version (1.0.0 for the first store release). It does not
  follow the website's release tag: the Portal inside the app is always the hosted one.
- **Used so far.** Android: 1 and 2 (QA, bundled), 3 (production 1.0.0, bundled, in Play review
  since 2026-11-03 — **must not be published**, see below). iOS: builds 5–7 of the separate QA app
  `com.legalterminus.app.qa` (bundled; that app is retired). **The next build of either platform
  is 8.**

**Android version code 3 must not be published.** It is the bundled design: it runs at
`https://localhost`, which the production API and bucket no longer allow, so every screen that
loads data would fail. Managed publishing is on, so an approval does not publish it. Replace it in
the Production release with the first production-pointed hosted build (8 or higher) before anyone
presses Publish.

## Where the secrets live (never in the repo)

| What | Original (two places) | In CI |
|---|---|---|
| Android upload keystore + passwords | `~/lt-android-release/keys/` on the release Mac **and** the firm's password manager | `ANDROID_KEYSTORE_B64`, `ANDROID_KEYSTORE_PASSWORD`, `ANDROID_KEY_ALIAS`, `ANDROID_KEY_PASSWORD` |
| Upload key SHA-1 (40 hex digits, no colons — public) | same | repository **variable** `ANDROID_UPLOAD_KEY_SHA1` |
| `google-services.json` (one app, `com.legalterminus.app`) | `~/lt-android-release/keys/<qa\|production>/` (the same file in both) | `GOOGLE_SERVICES_JSON_B64` |
| `GoogleService-Info.plist` (one app) | `~/lt-android-release/keys/<qa\|production>/` (the same file in both) | — (iOS is built locally) |
| Apple distribution certificate (`.p12`) | same (exported from Keychain with a password) | — |
| App Store Connect API key (`.p8`), Key ID, Issuer ID | same | — (only if uploads are ever scripted) |
| Sign in with Apple key (`.p8`) | same; its contents also pasted into Firebase → Authentication → Apple | — |
| Store reviewer account password | `~/lt-android-release/keys/STORE_REVIEWER.txt` (mode 600) | — |

`base64 -i <file> | pbcopy` to paste a file into a GitHub Secret. The ignore rules (`.gitignore`)
refuse `*.p8`, `*.p12`, `*.mobileprovision`, `*.jks`, `*.keystore`, `key.properties`, both
Firebase files and every generated file of the switch.

## Android — the pipeline (production)

Only when the native shell changed (above).

1. GitHub → Actions → "Deploy to Production" → Run workflow: **Use workflow from = a release
   tag**, `build_android` = true, `android_format` = `both`, `version_name`, `build_number`.
   The run waits for the `production` environment reviewer like any production deploy. With
   `build_android` on, the web deploy job is skipped.
2. The job (`build-android`) runs `LT_APP_ENV=production npm run sync:android`, **checks the
   synced app opens `https://legalterminus.com/portal/`**, writes the keystore and
   `google-services.json` from secrets, sets the version, runs `gradle bundleRelease
   assembleRelease`, checks the signer is the upload key, and attaches `.aab`, `.apk` and
   `mapping.txt` to the GitHub Release `vX.Y.Z (Build N)` on the tag. A run from a branch is refused.
3. Upload the `.aab` to Play Console → **Internal testing** first; install from the Play link on a
   real phone; then promote to **Production** with a **staged rollout** (10% → watch crashes and
   ANRs for a day → 100%). Managed publishing stays **on**.
4. Roll back: Play cannot re-publish an older build. A Portal problem is rolled back on the
   website (Hosting / Cloud Run), which fixes the app at once; a shell problem needs a higher build.

## Android — a QA-pointed build (Mac)

```
cd MobileApp && npm ci
npm run sync:android                      # opens https://legal-terminus-qa.web.app/portal/
cd android && ./gradlew bundleRelease     # with key.properties present (the upload key)
```

The QA-pointed build is the **same app** as production, so it goes to the app's **Internal
testing** track in Play Console with the next build number.

## iOS — Xcode on the Mac

1. `cd MobileApp && npm ci && npm run sync:ios` for a QA-pointed build, or
   `LT_APP_ENV=production npm run sync:ios` for production. This copies
   `~/lt-android-release/keys/<env>/GoogleService-Info.plist` into `ios/App/App/` and runs
   `cap sync ios` (which runs `pod install`). Use a clean checkout of a release tag for a
   production build, so the shell is the reviewed one.
2. `npx cap open ios` (opens `App.xcworkspace`, never the `.xcodeproj`). Target App → General:
   Display Name "Legal Terminus", Bundle Identifier `com.legalterminus.app` (they come from
   `Config/Environment.xcconfig`; do not type over them). Version and Build = `version_name` and
   `build_number` (`Config/Shared.xcconfig`). Signing & Capabilities: the firm's team, automatic
   signing; Sign in with Apple and Associated Domains come from `App/App.entitlements`.
3. Product → Destination "Any iOS Device" → Product → **Archive**. Organizer → Distribute App →
   **App Store Connect** → Upload. Also **Export** the `.ipa` to
   `~/lt-android-release/out/legalterminus-<version>-<build>.ipa` and attach it to the GitHub
   Release by hand.
4. App Store Connect → TestFlight: the build appears after processing (10–30 min); add it to the
   testers; test on a real iPhone. QA-pointed builds stay on TestFlight.
5. The production-pointed build → App Store → the version → select the build → Submit for Review,
   **phased release on**, **manual release** after approval.
6. Roll back: as Android — a Portal problem is fixed on the website, a shell problem by a higher build.

A simulator build needs none of the Apple items:
`xcodebuild -workspace App.xcworkspace -scheme App -sdk iphonesimulator -configuration Debug CODE_SIGNING_ALLOWED=NO build`
(from `MobileApp/ios/App`, after `npm run sync:ios`).

## Before the first production-pointed build (both platforms)

- The production Portal has every app fix the QA app was tested with: the Portal is deployed by a
  release tag, so **tag first** (with the owner's approval, `docs/delivery.md`).
- The store reviewer account signs in on production (`GET /api/auth/me` → 200).
- `assetlinks.json` / `apple-app-site-association` on `legalterminus.com` only when launch is
  approved; until then, emailed links open the browser on purpose.
- Nothing about CORS: the app's origin is the site.

## QA app links

`deploy-qa.yml` writes the QA site's `/.well-known/apple-app-site-association` and
`/.well-known/assetlinks.json` from `environments.json` → `appLinks`
(`MobileApp/scripts/app-links.mjs qa Frontend/dist`). They name the app, `com.legalterminus.app`;
only a QA-pointed build claims the QA host, so QA links never open a production-pointed build.
Until the owner fills in the Apple team id and the signing fingerprints, nothing is written.

## Owner checklist — what only the firm's accounts can do

**Apple Developer account (E29-S01)**
1. Enrol LEGAL TERMINUS PRIVATE LIMITED (organisation; D-U-N-S number). Note the **Team ID**
   (`LMD2KSCQZX` per Akash's notes — confirm).
2. Put the Team ID in `MobileApp/ios/App/Config/Shared.xcconfig` (`DEVELOPMENT_TEAM = …`),
   `MobileApp/ios/ExportOptions.plist` (`TEAMID`) and `MobileApp/environments.json` →
   `appLinks.appleTeamId`.
3. Identifiers → **one** App ID: `com.legalterminus.app`, with **Sign in with Apple** and
   **Associated Domains**.
4. App Store Connect → **one** app: "Legal Terminus" (`com.legalterminus.app`, SKU
   `legalterminus-ios`). QA-pointed builds go to its TestFlight; the production-pointed build to review.
5. The earlier QA app "Legal Terminus QA" (`com.legalterminus.app.qa`, Apple ID 6835742436, builds
   5–7) is retired: stop testing on it, remove its testers, and remove the app from App Store
   Connect (allowed while no version has been approved). Its App ID can be deleted.

**Sign in with Apple (E29-S11)**
6. Identifiers → Services ID `com.legalterminus.app.web`; domains `legalterminus.com` and
   `legal-terminus-qa.web.app`; return URL = the "OAuth redirect URI" shown in Firebase →
   Authentication → Sign-in method → Apple.
7. Keys → a Sign in with Apple key → download the `.p8` once → Firebase → Authentication → Apple:
   Services ID, Team ID, Key ID, the key. Enable the provider.
8. Switch the website's button on: `VITE_APPLE_SIGN_IN: 'true'` in the Portal build of
   `deploy-qa.yml` (and, at release, `deploy-production.yml`). The iPhone app shows it always
   (rule 4.8); Android never (D6).

**Firebase (project `legal-terminus-web`)**
9. Register the iOS app `com.legalterminus.app`; download its `GoogleService-Info.plist` to
   `~/lt-android-release/keys/qa/` and `~/lt-android-release/keys/production/`. Fill in the Team
   ID (and the App Store ID once known) only when launch is approved: Firebase then publishes an
   AASA on every site of the project, `legalterminus.com` included.
10. The Android app `com.legalterminus.app` exists. Add the SHA-1 and SHA-256 of the key that signs
    QA-pointed builds if it is not the upload key. Remove any `com.legalterminus.app.qa` apps.

**Play Console**
11. QA-pointed builds go to the app's Internal testing track. **Do not publish version code 3**
    (above); replace it in the Production release with the first production-pointed build.

**GitHub (code owner)**
12. Secrets `ANDROID_KEYSTORE_B64`, `ANDROID_KEYSTORE_PASSWORD`, `ANDROID_KEY_ALIAS`,
    `ANDROID_KEY_PASSWORD`, `GOOGLE_SERVICES_JSON_B64` in the `production` environment, and the
    repository variable `ANDROID_UPLOAD_KEY_SHA1`.

**Google Cloud — bucket CORS without localhost (2026-11-19)**
13. Apply the two files (they list only the sites' own origins):
    `gcloud storage buckets update gs://legal-terminus-web-qa --cors-file=storage-cors.qa.json`
    and, for production with the owner's approval,
    `gcloud storage buckets update gs://legal-terminus-web.firebasestorage.app --cors-file=storage-cors.json`.
    Check with a preflight: `Origin: https://localhost` gets no `access-control-allow-origin`,
    the site's own origin does.

**App Store Connect listing (E29-S10)** — privacy labels, age rating, reviewer account,
screenshots, review notes: see the epic.
