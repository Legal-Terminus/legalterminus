# How the mobile apps are built and released

Adopted 2026-11-10 (E-29). The model is the BeatMyEMI apps: **Android is built and signed
by the GitHub pipeline on a release; iOS is archived and uploaded from Xcode on the Mac.**
There is no fastlane, by the owner's decision. The web release process is unchanged and is
in `docs/delivery.md`; a production mobile build always starts from a production tag that has
already deployed.

**QA first (owner, 2026-11-11).** Both apps are pointed at QA until the owner says otherwise.
Every build is QA unless it is asked for production in so many words (the switch below).

```
tag vX.Y.Z-lt.N on main  ──(deploy-production.yml, approval)──▶ website + API live
        │
        ├── "Deploy to Production" run by hand from the TAG with build_android=true
        │        └─▶ signed .aab/.apk ──▶ GitHub Release "vX.Y.Z (Build N)" ──▶ Play Console (by hand)
        │
        └── Mac: git checkout vX.Y.Z-lt.N → LT_APP_ENV=production npm run sync:ios
                 └─▶ Xcode: Archive → Distribute → App Store Connect ──▶ TestFlight ──▶ App Store
```

## The environment switch

**One value decides which environment a build talks to: `LT_APP_ENV` = `qa` (the default) or
`production`.** Everything that depends on the environment comes from one file,
`MobileApp/environments.json`, and follows that value. Nothing environment-specific is written
anywhere else.

| | QA (`LT_APP_ENV=qa`, default) | Production (`LT_APP_ENV=production`) |
|---|---|---|
| App name on the phone | **Legal Terminus QA** | Legal Terminus |
| Android application id / iOS bundle id | **`com.legalterminus.app.qa`** | `com.legalterminus.app` |
| Website, API and account deletion (`/api/auth/me/deletion-request`) | `https://legal-terminus-qa.web.app` | `https://legalterminus.com` |
| Database / bucket in the Portal bundle | `qa-data` / `legal-terminus-web-qa` | `(default)` / `legal-terminus-web.firebasestorage.app` |
| Emailed links open the app on | `legal-terminus-qa.web.app` | `legalterminus.com` (only after launch approval) |
| Firebase files used | `~/lt-android-release/keys/qa/` | `~/lt-android-release/keys/production/` |
| Bundle guard | must not contain `legalterminus.com/api` | must not contain `qa-data`, `legal-terminus-qa`, `localhost:5001`, a `.test` address or `EMAIL_DISABLED` |

Because the QA app has its own id and name, it installs **next to** the production app and is
never mistaken for it.

How it works:

```
LT_APP_ENV ─▶ MobileApp/scripts/app-env.mjs  (run first by every `npm run sync:*`)
               ├─ MobileApp/.app-env.json              the choice; Gradle and capacitor.config.ts read it
               ├─ Portal/.env.mobile.local             the Portal's values (outranks Portal/.env.local)
               ├─ ios/App/Config/Environment.xcconfig  bundle id, display name, link host, Google URL scheme
               └─ copies the environment's google-services.json / GoogleService-Info.plist, and
                  refuses one that belongs to the other app
            ─▶ Portal: vite build --mode mobile ─▶ scripts/check-bundle.mjs (the guard) ─▶ cap sync
```

- `npm run sync:android` / `sync:ios` / `sync` in `MobileApp/` → a **QA** build.
- `LT_APP_ENV=production npm run sync:android` (or `sync:ios`) → a **production** build.
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
  (`MobileApp/ios/App/Config/Shared.xcconfig`, or Xcode → General).
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
| `google-services.json`, per environment | `~/lt-android-release/keys/<qa\|production>/` | `GOOGLE_SERVICES_JSON_B64` (production) |
| `GoogleService-Info.plist`, per environment | `~/lt-android-release/keys/<qa\|production>/` | — (iOS is built locally) |
| Apple distribution certificate (`.p12`) | same (exported from Keychain with a password) | — |
| App Store Connect API key (`.p8`), Key ID, Issuer ID | same | — (only if uploads are ever scripted: `xcrun altool --upload-app --apiKey … --apiIssuer …`) |
| Sign in with Apple key (`.p8`) | same; its contents also pasted into Firebase → Authentication → Apple | — |
| Portal values for `build:mobile` (API key, app id, sender id) | `~/lt-android-release/env/<qa\|production>.env` | written by the job from the existing `FIREBASE_QA_*` secrets the production Portal deploy already uses |
| Store reviewer account password | `~/lt-android-release/keys/STORE_REVIEWER.txt` (mode 600) | — |

`base64 -i <file> | pbcopy` to paste a file into a GitHub Secret. Losing the Android upload key
means asking Google for a reset; losing the Apple certificate means revoking and re-issuing it
(TestFlight builds already uploaded keep working). The ignore rules (`.gitignore`) refuse
`*.p8`, `*.p12`, `*.mobileprovision`, `*.jks`, `*.keystore`, `key.properties`, both Firebase files
and every generated file of the switch.

## The guard

`MobileApp/scripts/check-bundle.mjs [qa|production]` runs inside every `npm run sync:*` (and the
pipeline) and **fails the build** when the bundle carries the wrong environment: a production
bundle must not contain `qa-data`, `legal-terminus-qa`, `localhost:5001`, a `.test` address or
`EMAIL_DISABLED`; a QA bundle must not contain `legalterminus.com/api`; and either must contain its
own API address. The patterns are in `environments.json` (`forbidInBundle`). `npm test` in
`MobileApp/` checks the guard against a QA and a production fixture bundle.

## Android — the pipeline (production)

1. The tag has deployed and been checked on production (`docs/delivery.md`).
2. GitHub → Actions → "Deploy to Production" → Run workflow: **Use workflow from = the tag**,
   `build_android` = true, `android_format` = `both`, `version_name`, `build_number` (see above).
   The run waits for the `production` environment reviewer like any production deploy. With
   `build_android` on, the web deploy job is skipped.
3. The job (`build-android`) writes the Portal values from secrets, runs
   `LT_APP_ENV=production npm run sync:android` (switch → `build:mobile` → guard → `cap sync`),
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

The release build now shrinks code (`minifyEnabled true`) so `mapping.txt` exists. Run the first
pipeline-built APK on a real phone before uploading it (sign-in, View a document, Share a zip).

## Android — a QA build (Mac)

```
cd MobileApp && npm ci
npm run sync:android                      # QA: Legal Terminus QA, com.legalterminus.app.qa
cd android && ./gradlew assembleDebug     # or assembleRelease with key.properties present
```

A QA build is a different app from the one in Play (`com.legalterminus.app`), so it does **not**
go to the production app's Internal testing track. Install the APK directly (`adb install`), or
give the QA app its own Play Console entry (owner checklist).

## iOS — Xcode on the Mac

1. Clean checkout of the tag: `git clone --branch vX.Y.Z-lt.N … lt-release && cd lt-release`.
2. `cd MobileApp && npm ci && LT_APP_ENV=production npm run sync:ios` — writes the production
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
   **App Store Connect** → Upload (the settings of `MobileApp/ios/ExportOptions.plist`: method
   `app-store-connect`, symbols included). Also **Export** the `.ipa` to
   `~/lt-android-release/out/legalterminus-<version>-<build>.ipa` and attach it to the GitHub
   Release by hand, so both platforms' binaries sit on one release.
5. App Store Connect → TestFlight: the build appears after processing (10–30 min); add it to the
   internal group; test on a real iPhone (the checklists in E29-S04 to S08).
6. App Store → the version → select the build → Submit for Review, **phased release on**,
   **manual release** after approval.
7. Roll back: App Store cannot re-publish an older build either. Pause the phased release or
   remove the app from sale, fix, ship a higher build.

A simulator build needs none of the Apple items:
`xcodebuild -workspace App.xcworkspace -scheme App -sdk iphonesimulator -configuration Debug CODE_SIGNING_ALLOWED=NO build`
(from `MobileApp/ios/App`, after `npm run sync:ios`).

## Before any production build (both platforms)

- API CORS for the app origins (`https://localhost`, `capacitor://localhost`) is live on
  production. QA has both since E29-S03; production's `CORS_ORIGINS` in `deploy-production.yml`
  gets `capacitor://localhost` with the first production iOS build — a security change the owner
  approves (`curl -s -D - -o /dev/null -X OPTIONS -H "Origin: capacitor://localhost" -H
  "Access-Control-Request-Method: GET" https://legalterminus.com/api/auth/me | grep -i
  access-control-allow-origin`).
- Production bucket CORS carries both origins (`storage-cors.json`, applied with approval).
- The store reviewer account signs in on production (`GET /api/auth/me` → 200).
- `assetlinks.json` / `apple-app-site-association` on `legalterminus.com` only when launch is
  approved; until then, emailed links open the browser on purpose.

## QA app links

`deploy-qa.yml` writes the QA site's `/.well-known/apple-app-site-association` and
`/.well-known/assetlinks.json` from `environments.json` → `appLinks`
(`MobileApp/scripts/app-links.mjs qa Frontend/dist`). They name the QA apps only
(`com.legalterminus.app.qa`). Until the owner fills in the Apple team id and the QA signing
fingerprints there, nothing is written and Firebase's own generated files keep being served.
After the first deploy with values, check that the repo's files win over Firebase's:
`curl -s https://legal-terminus-qa.web.app/.well-known/assetlinks.json` must name
`com.legalterminus.app.qa`, and
`curl -sI https://legal-terminus-qa.web.app/.well-known/apple-app-site-association` must be `200`,
`application/json`, no redirect.

## Owner checklist — what only the firm's accounts can do

Nothing below has been done; every value the code needs is a named placeholder.

**Apple Developer account (E29-S01)**
1. Enrol LEGAL TERMINUS PRIVATE LIMITED (organisation; D-U-N-S number). Note the **Team ID**.
2. Put the Team ID in `MobileApp/ios/App/Config/Shared.xcconfig` (`DEVELOPMENT_TEAM = …`, now a
   comment), `MobileApp/ios/ExportOptions.plist` (`TEAMID`) and `MobileApp/environments.json` →
   `appLinks.appleTeamId`.
3. Identifiers → **two** App IDs: `com.legalterminus.app` (production) and
   `com.legalterminus.app.qa` (QA). On both: **Sign in with Apple** and **Associated Domains**.
4. App Store Connect → two apps: "Legal Terminus" (`com.legalterminus.app`, SKU
   `legalterminus-ios`) and, for TestFlight only, "Legal Terminus QA" (`com.legalterminus.app.qa`,
   SKU `legalterminus-ios-qa`). The QA app is never submitted for review.

**Sign in with Apple (E29-S11)**
5. Identifiers → Services ID `com.legalterminus.app.web`; domains `legalterminus.com` and
   `legal-terminus-qa.web.app`; return URL = the "OAuth redirect URI" shown in Firebase →
   Authentication → Sign-in method → Apple.
6. Keys → a Sign in with Apple key → download the `.p8` once, store it with the other keys →
   Firebase → Authentication → Apple: Services ID, Team ID, Key ID, the key. Enable the provider.
7. Then switch the website's button on: add `VITE_APPLE_SIGN_IN: 'true'` to the Portal build of
   `deploy-qa.yml` (and, at release, `deploy-production.yml`). The iPhone app shows the button
   always (App Store rule 4.8); Android never (D6).

**Firebase (project `legal-terminus-web`)**
8. Register the iOS apps `com.legalterminus.app` and `com.legalterminus.app.qa`; download each
   `GoogleService-Info.plist` to `~/lt-android-release/keys/<production|qa>/`. Fill in the Team
   ID (and the App Store ID once known) on each.
9. Register the Android app `com.legalterminus.app.qa` and add the SHA-1 and SHA-256 of the key
   that signs QA builds (the debug key for local builds, or the upload key). Download
   `google-services.json` (it lists both apps) to `~/lt-android-release/keys/qa/` and
   `~/lt-android-release/keys/production/`.
10. Google sign-in on the QA apps needs nothing more: Firebase creates their OAuth clients when
    they are registered.
11. Note: Firebase generates `/.well-known/assetlinks.json` and `apple-app-site-association` for
    the whole project and serves them on **every** site, `legalterminus.com` included. Filling the
    Team ID in step 8 can therefore publish an AASA on the live site. Do step 8's Team ID for the
    production app only when launch is approved; the QA site uses the repo's files (above).

**Play Console**
12. A QA build is now `com.legalterminus.app.qa`. Either create a second app "Legal Terminus QA"
    for internal testing, or install QA APKs directly. QA builds no longer go to the production
    app's Internal testing track.

**GitHub (code owner)**
13. Secrets `ANDROID_KEYSTORE_B64`, `ANDROID_KEYSTORE_PASSWORD`, `ANDROID_KEY_ALIAS`,
    `ANDROID_KEY_PASSWORD`, `GOOGLE_SERVICES_JSON_B64` in the `production` environment, and the
    repository variable `ANDROID_UPLOAD_KEY_SHA1`.
14. One dry run of `build-android` from the current tag (build 4); compare its signer and
    contents with vc3 (`apksigner verify --print-certs`, `unzip -l`) and record it here.

**Google Cloud (QA, then production at release)**
15. `gcloud storage buckets update gs://legal-terminus-web-qa --cors-file=storage-cors.json`
    (adds `capacitor://localhost`). Production bucket only at release, with approval.
16. `environments.json` → `appLinks.androidSha256.qa`: the SHA-256 of the key that signs QA
    builds, so the QA site's `assetlinks.json` is written.

**App Store Connect listing (E29-S10)** — privacy labels, age rating, reviewer account,
screenshots, review notes: see the epic.
