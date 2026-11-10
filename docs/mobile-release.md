# How the mobile apps are built and released

Adopted 2026-11-10 (E-29). The model is the BeatMyEMI apps: **Android is built and signed
by the GitHub pipeline on a release; iOS is archived and uploaded from Xcode on the Mac.**
The web release process is unchanged and is in `docs/delivery.md`; a mobile build always
starts from a production tag that has already deployed.

```
tag vX.Y.Z-lt.N on main  ──(deploy-production.yml, approval)──▶ website + API live
        │
        ├── "Deploy to Production" run by hand with build_android=true
        │        └─▶ signed .aab/.apk ──▶ GitHub Release "vX.Y.Z (Build N)" ──▶ Play Console (by hand)
        │
        └── Mac: git checkout vX.Y.Z-lt.N → build:mobile (production env) → cap sync ios
                 └─▶ Xcode: Archive → Distribute → App Store Connect ──▶ TestFlight ──▶ App Store
```

## The numbers

- **One `version_name` and one `build_number` for both platforms per release.** Android's
  `versionName`/`versionCode`, iOS's `MARKETING_VERSION`/`CURRENT_PROJECT_VERSION`.
- `build_number` = the last GitHub Release's build + 1. It never goes down and is never reused,
  and a QA build takes a number too: Play and TestFlight count per app, not per track.
- `version_name` follows the Ambyflow release the tag carries (`v1.6.0-lt.9` → app `1.6.0`), so
  `/health` and the app version agree on what code is running.
- Used so far: Android builds 1 and 2 (QA), 3 (production 1.0.0, in Play review 2026-11-03).
  The next build of either platform is **4**.

## Where the secrets live (never in the repo)

| What | Original (two places) | In CI |
|---|---|---|
| Android upload keystore + passwords | `~/lt-android-release/keys/` on the release Mac **and** the firm's password manager | `ANDROID_KEYSTORE_B64`, `ANDROID_KEYSTORE_PASSWORD`, `ANDROID_KEY_ALIAS`, `ANDROID_KEY_PASSWORD` |
| `google-services.json` (production) | same | `GOOGLE_SERVICES_JSON_B64` |
| `GoogleService-Info.plist` (production) | same | — (iOS is built locally) |
| Apple distribution certificate (`.p12`) | same (exported from Keychain with a password) | — |
| App Store Connect API key (`.p8`), Key ID, Issuer ID | same | — (only if uploads are ever scripted: `xcrun altool --upload-app --apiKey … --apiIssuer …`) |
| Production `.env` for `build:mobile` | `~/lt-android-release/env/production.env` | written by the job from the existing `FRONTEND_*` secrets |
| Store reviewer account password | `~/lt-android-release/keys/STORE_REVIEWER.txt` (mode 600) | — |

`base64 -i <file> | pbcopy` to paste a file into a GitHub Secret. Losing the Android upload key
means asking Google for a reset; losing the Apple certificate means revoking and re-issuing it
(TestFlight builds already uploaded keep working).

## The guard

`MobileApp/scripts/check-bundle.mjs <qa|production>` runs after every `build:mobile` and
**fails the build** when the bundle carries the wrong environment: a production build must not
contain `qa-data`, `legal-terminus-qa`, `localhost:5001`, `.test` or `EMAIL_DISABLED`; a QA
build must not contain `legalterminus.com/api`. Vite loads `Portal/.env.local` in every mode,
so a build on a developer's machine bakes QA in unless the production env is written first.
This guard is what catches it. (Until E29-S09 lands, the check is by hand: `unzip -p app.apk
assets/public/assets/index-*.js | grep -c qa-data` must print `0`.)

## Android — the pipeline

1. The tag has deployed and been checked on production (`docs/delivery.md`).
2. GitHub → Actions → "Deploy to Production" → Run workflow: ref = the tag, `build_android` =
   true, `android_format` = `both`, `version_name`, `build_number` (see above). The run waits for
   the `production` environment reviewer like any production deploy.
3. The job writes `Portal/.env` from secrets, runs `build:mobile`, the guard, `cap sync android`,
   `gradle bundleRelease assembleRelease` with the keystore from secrets, `apksigner verify
   --print-certs` (the SHA-1 must be the upload key's), and attaches `.aab`, `.apk` and
   `mapping.txt` to the GitHub Release `vX.Y.Z (Build N)` on the tag.
4. Download the `.aab`, upload it to Play Console → **Internal testing** first; install from the
   Play link on a real phone; then promote to **Production** with a **staged rollout** (10% →
   watch crashes and ANRs for a day → 100%). Managed publishing stays **on**, so an approved
   release waits for a person to press Publish.
5. Roll back: Play cannot re-publish an older build. Halt the staged rollout, fix, ship a higher
   build number.

Until the job exists (E29-S09) the Android build is made by hand in a **clean checkout** of the
tag, as vc3 was: `docs/android-release-plan.md` step 16.

## iOS — Xcode on the Mac

1. Clean checkout of the tag: `git clone --branch vX.Y.Z-lt.N … lt-release && cd lt-release`.
2. `cp ~/lt-android-release/env/production.env Portal/.env.local` (there is no other `.env.local`
   in a clean checkout) → `cd Portal && npm ci && npm run build:mobile` → the guard.
3. `cd ../MobileApp && npm ci && npx cap sync ios`; copy `GoogleService-Info.plist` to
   `ios/App/App/` (ignored by git).
4. `npx cap open ios` (opens `App.xcworkspace`). Target App → General: Version = `version_name`,
   Build = `build_number`. Signing & Capabilities: the firm's team, automatic signing, Associated
   Domains = `applinks:legalterminus.com` (only once launch is approved — the production
   `apple-app-site-association` is published then).
5. Product → Destination "Any iOS Device" → Product → **Archive**. Organizer → Distribute App →
   **App Store Connect** → Upload (uses `MobileApp/ios/ExportOptions.plist` settings: method
   `app-store`, symbols included). Also **Export** the `.ipa` to
   `~/lt-android-release/out/legalterminus-<version>-<build>.ipa` and attach it to the GitHub
   Release by hand, so both platforms' binaries sit on one release.
6. App Store Connect → TestFlight: the build appears after processing (10–30 min); add it to the
   internal group; test on a real iPhone (the checklist in E29-S04 to S07).
7. App Store → the version → select the build → Submit for Review, **phased release on**,
   **manual release** after approval.
8. Roll back: App Store cannot re-publish an older build either. Pause the phased release or
   remove the app from sale, fix, ship a higher build.

## Before any production build (both platforms)

- API CORS for the app origins (`https://localhost`, `capacitor://localhost`) is live
  (`curl -s -D - -o /dev/null -X OPTIONS -H "Origin: capacitor://localhost" -H
  "Access-Control-Request-Method: GET" https://legalterminus.com/api/auth/me | grep -i
  access-control-allow-origin`).
- Production bucket CORS carries both origins.
- The store reviewer account signs in on production (`GET /api/auth/me` → 200).
- `assetlinks.json` / `apple-app-site-association` on `legalterminus.com` only when launch is
  approved; until then, emailed links open the browser on purpose.

## QA builds

A QA build is the same procedure with the QA env (`~/lt-android-release/env/qa.env`), the QA
`google-services.json` / `GoogleService-Info.plist`, `-PlinkHost=legal-terminus-qa.web.app` on
Android and `applinks:legal-terminus-qa.web.app` on iOS, and the next build number. It goes to
Play Internal testing / TestFlight internal only, and **never** to a production track: QA
refuses every real account.
