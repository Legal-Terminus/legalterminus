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
tag vX.Y.Z-lt.N on main  ──(deploy-production.yml, approval)──▶ website + API live
        │
        ├── "Deploy to Production" run by hand from the TAG with build_android=true
        │        └─▶ signed .aab/.apk ──▶ GitHub Release "vX.Y.Z (Build N)" ──▶ Play Console (by hand)
        │
        └── Mac: git checkout vX.Y.Z-lt.N → cd iOSApp && npm run sync:production
                 └─▶ Xcode: Archive → Distribute → App Store Connect ──▶ TestFlight ──▶ App Store
```

## Repo layout (since 2026-11-16)

```
iOSApp/        the iPhone app: package.json, capacitor.config.ts, ios/ (Xcode project). Run npm here.
AndroidApp/    the Android app: package.json, capacitor.config.ts, android/ (Gradle project). Run npm here.
MobileShared/  what both use: environments.json (the one QA/production description), scripts/
               (app-env, check-bundle, app-links + tests), assets/ (icon, splash), web/ (the
               old-WebView page)
Portal/        the web app both apps wrap; `npm run build:mobile` writes Portal/dist-mobile
```

Each app has its own `node_modules`, lockfile, Capacitor config and QA/production switch
(`npm run sync:qa` / `npm run sync:production`). The old single `MobileApp/` folder is gone; the
QA and production apps are still separate installs (different app id and name), chosen at build time.

## The environment switch

**One value decides which environment a build talks to: `LT_APP_ENV` = `qa` (the default) or
`production`.** Everything that depends on the environment comes from one file,
`MobileShared/environments.json`, and follows that value. Nothing environment-specific is written
anywhere else.

| | QA (`LT_APP_ENV=qa`, default) | Production (`LT_APP_ENV=production`) |
|---|---|---|
| App name and id | Legal Terminus, `com.legalterminus.app` | the same |
| The app opens | `https://legal-terminus-qa.web.app/portal/` | `https://legalterminus.com/portal/` |
| Loads inside the app (`allowNavigation`) | `legal-terminus-qa.web.app` only | `legalterminus.com` only |
| Emailed links open the app on | `legal-terminus-qa.web.app` | `legalterminus.com` (only after launch approval) |
| Who can sign in | `@legalterminus.test` accounts only (the QA guard) | real accounts; test accounts refused |

```
LT_APP_ENV ─▶ MobileShared/scripts/app-env.mjs  (run first by every `npm run sync` in iOSApp/ and AndroidApp/)
               ├─ <app>/.app-env.json              the choice; Gradle and capacitor.config.ts read it
               ├─ Portal/.env.mobile.local             the Portal's values (outranks Portal/.env.local)
               ├─ ios/App/Config/Environment.xcconfig  bundle id, display name, link host, Google URL scheme
               └─ copies google-services.json / GoogleService-Info.plist, and refuses one for another app
            ─▶ cap sync  (writes capacitor.config.json with server.url into each platform)
```

- `npm run sync:qa` in `iOSApp/` or `AndroidApp/` (or plain `npm run sync`) → a **QA** build.
- `npm run sync:production` in either folder → a **production** build.
- Gradle and Xcode then build whatever was synced. Gradle refuses `-PappEnv=production` on a
  bundle synced for QA (and the other way round). Xcode refuses to build at all until a sync has
  written `Config/Environment.xcconfig`.
- The Firebase API key, web app id and sender id are not in the repo. `app-env.mjs` takes them
  from `~/lt-android-release/env/<env>.env` (or the file named by `LT_MOBILE_ENV_FILE`), else
  from `Portal/.env.local`. Everything that **defines** the environment always comes from
  `environments.json`, so a QA `.env.local` cannot leak into a production bundle.
- Both environments live in the one Firebase project, `legal-terminus-web` (`docs/qa-environment.md`).
  QA refuses every account outside `@legalterminus.test`, so a QA app can only be used with the
  QA test accounts.
- No `allowNavigation` list is set: every other host opens outside the app.

## The numbers

- **One `version_name` and one `build_number` for both platforms per release.** Android's
  `versionName`/`versionCode`, iOS's `MARKETING_VERSION`/`CURRENT_PROJECT_VERSION`
  (`iOSApp/ios/App/Config/Shared.xcconfig`, or Xcode → General).
- `build_number` = the last GitHub Release's build + 1. It never goes down and is never reused,
  and a QA build takes a number too: Play and TestFlight count per app, not per track.
- `version_name` follows the Ambyflow release the tag carries (`v1.6.0-lt.9` → app `1.6.0`), so
  `/health` and the app version agree on what code is running.
- Used so far: Android builds 1 and 2 (QA, under the **old** id `com.legalterminus.app`), 3
  (production 1.0.0, in Play review 2026-11-03). The next build of either platform is **4**.
  From build 4 on, a QA build is the separate app `com.legalterminus.app.qa`.

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

`base64 -i <file> | pbcopy` to paste a file into a GitHub Secret. Losing the Android upload key
means asking Google for a reset; losing the Apple certificate means revoking and re-issuing it
(TestFlight builds already uploaded keep working). The ignore rules (`.gitignore`) refuse
`*.p8`, `*.p12`, `*.mobileprovision`, `*.jks`, `*.keystore`, `key.properties`, both Firebase files
and every generated file of the switch.

## The guard

`MobileShared/scripts/check-bundle.mjs [qa|production]` runs inside every `npm run sync` (and the
pipeline) and **fails the build** when the bundle carries the wrong environment: a production
bundle must not contain `qa-data`, `legal-terminus-qa`, `localhost:5001`, a `.test` address or
`EMAIL_DISABLED`; a QA bundle must not contain `legalterminus.com/api`; and either must contain its
own API address. The patterns are in `environments.json` (`forbidInBundle`). `npm test` in
`iOSApp/` or `AndroidApp/` runs the shared tests in `MobileShared/` that check the guard against a QA and a production fixture bundle.

## Android — the pipeline (production)

Only when the native shell changed (above).

1. GitHub → Actions → "Deploy to Production" → Run workflow: **Use workflow from = a release
   tag**, `build_android` = true, `android_format` = `both`, `version_name`, `build_number`.
   The run waits for the `production` environment reviewer like any production deploy. With
   `build_android` on, the web deploy job is skipped.
3. The job (`build-android`) writes the Portal values from secrets, runs
   `npm run sync:production` in `AndroidApp/` (switch → `build:mobile` → guard → `cap sync`),
   writes the keystore and `google-services.json` from secrets, sets the version, runs
   `gradle bundleRelease assembleRelease`, checks the signer is the upload key (`apksigner` /
   `keytool` against `ANDROID_UPLOAD_KEY_SHA1`), and attaches `.aab`, `.apk` and `mapping.txt` to
   the GitHub Release `vX.Y.Z (Build N)` on the tag. A run from a branch is refused.
4. Download the `.aab`, upload it to Play Console → **Internal testing** first; install from the
   Play link on a real phone; then promote to **Production** with a **staged rollout** (10% →
   watch crashes and ANRs for a day → 100%). Managed publishing stays **on**, so an approved
   release waits for a person to press Publish.
5. Roll back: Play cannot re-publish an older build. Halt the staged rollout, fix, ship a higher
   build number.

## Android — a QA-pointed build (Mac)

```
cd AndroidApp && npm ci
npm run sync:qa                      # QA: Legal Terminus QA, com.legalterminus.app.qa
cd android && ./gradlew assembleDebug     # or assembleRelease with key.properties present
```

The QA-pointed build is the **same app** as production, so it goes to the app's **Internal
testing** track in Play Console with the next build number.

## iOS — Xcode on the Mac

1. Clean checkout of the tag: `git clone --branch vX.Y.Z-lt.N … lt-release && cd lt-release`.
2. `cd iOSApp && npm ci && npm run sync:production` — writes the production
   values (from `~/lt-android-release/env/production.env`), copies
   `~/lt-android-release/keys/production/GoogleService-Info.plist` into `ios/App/App/`, builds the
   Portal, runs the guard and `cap sync ios` (which runs `pod install`). For QA, leave
   `LT_APP_ENV` out.
3. `npx cap open ios` (opens `App.xcworkspace`, never the `.xcodeproj`). Check Target App →
   General: Display Name and Bundle Identifier show the environment (they come from
   `Config/Environment.xcconfig`; do not type over them). Version and Build = `version_name` and
   `build_number` (`Config/Shared.xcconfig`). Signing & Capabilities: the firm's team, automatic
   signing; the capabilities Sign in with Apple and Associated Domains come from
   `App/App.entitlements` (the domain is `applinks:` + the environment's host).
4. Product → Destination "Any iOS Device" → Product → **Archive**. Organizer → Distribute App →
   **App Store Connect** → Upload (the settings of `iOSApp/ios/ExportOptions.plist`: method
   `app-store-connect`, symbols included). Also **Export** the `.ipa` to
   `~/lt-android-release/out/legalterminus-<version>-<build>.ipa` and attach it to the GitHub
   Release by hand.
4. App Store Connect → TestFlight: the build appears after processing (10–30 min); add it to the
   testers; test on a real iPhone. QA-pointed builds stay on TestFlight.
5. The production-pointed build → App Store → the version → select the build → Submit for Review,
   **phased release on**, **manual release** after approval.
6. Roll back: as Android — a Portal problem is fixed on the website, a shell problem by a higher build.

A simulator build needs none of the Apple items:
`xcodebuild -workspace App.xcworkspace -scheme App -sdk iphonesimulator -configuration Debug CODE_SIGNING_ALLOWED=NO build`
(from `iOSApp/ios/App`, after `npm run sync:qa` in `iOSApp/`).

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
(`MobileShared/scripts/app-links.mjs qa Frontend/dist`). They name the QA apps only
(`com.legalterminus.app.qa`). Until the owner fills in the Apple team id and the QA signing
fingerprints there, nothing is written and Firebase's own generated files keep being served.
After the first deploy with values, check that the repo's files win over Firebase's:
`curl -s https://legal-terminus-qa.web.app/.well-known/assetlinks.json` must name
`com.legalterminus.app.qa`, and
`curl -sI https://legal-terminus-qa.web.app/.well-known/apple-app-site-association` must be `200`,
`application/json`, no redirect.

## Owner checklist — what only the firm's accounts can do

**Apple Developer account (E29-S01)**
1. Enrol LEGAL TERMINUS PRIVATE LIMITED (organisation; D-U-N-S number). Note the **Team ID**.
2. Put the Team ID in `iOSApp/ios/App/Config/Shared.xcconfig` (`DEVELOPMENT_TEAM = …`, now a
   comment), `iOSApp/ios/ExportOptions.plist` (`TEAMID`) and `MobileShared/environments.json` →
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
