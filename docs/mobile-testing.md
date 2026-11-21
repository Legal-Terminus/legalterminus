# Testing the Android and iPhone apps (QA)

For whoever tests the apps (Akash, from 2026-11-21). You **test**; you do not change the app
code. If something fails, write it down (below) and stop: the fix is made on `main`.

## What you are testing

There is **one app**, "Legal Terminus" (`com.legalterminus.app`), on Android and iPhone. It is a
thin native shell that opens the **hosted QA Portal**, `https://legal-terminus-qa.web.app/portal/`.
Nothing of the Portal is inside the app. This is the BeatMyEMI model (`docs/mobile-release.md`,
"Compared with BeatMyEMI").

Do **not** use the branch `feat/ios-android-app-split`, the folders `AndroidApp/`, `iOSApp/`,
`iOSAppProd/`, `MobileShared/`, or the app "Legal Terminus QA" (`com.legalterminus.app.qa`).
They are the earlier design and are retired. What was useful from them (the iPhone UI tests, the
reload after a website deploy, the QA reports) is on `main`.

## 1. Get the code

```bash
git checkout main && git pull
cd MobileApp
npm ci
```

## 2. Point both apps at QA

```bash
LT_APP_ENV=qa npm run sync
```

The last lines must say `Sync finished`. Check both apps open QA:

```bash
grep '"url"' android/app/src/main/assets/capacitor.config.json ios/App/App/capacitor.config.json
# both must print  "url": "https://legal-terminus-qa.web.app/portal/"
```

If either prints `localhost`, stop and report it.

**Google sign-in needs the Firebase files** for `com.legalterminus.app` (not the `.qa` one) in
`~/lt-android-release/keys/qa/`: `google-services.json` and `GoogleService-Info.plist`. Without
them the apps build and run, but the Google button shows an error. That is expected until the
owner provides them; test email/password sign-in meanwhile.

## 3. Build and run

**Android** (an emulator, or a phone with USB debugging):

```bash
npm run run:android          # or: cd android && ./gradlew assembleDebug  → app/build/outputs/apk/debug/app-debug.apk
```

**iPhone** (simulator):

```bash
npm run run:ios              # or open Xcode: npm run open:ios → App → iPhone 17 → Run
```

On a real iPhone: Xcode → Signing & Capabilities → team **LMD2KSCQZX**, then Run.

## 4. The checklist (both apps)

Sign in with the QA test accounts (`qa-…@legalterminus.test`; ask for the passwords). Real
accounts are refused on QA on purpose.

| # | Check | Pass when |
|---|---|---|
| 1 | Launch | The splash goes away and the sign-in screen shows |
| 2 | Sign in, each role: admin, manager, team member, client, professional | The dashboard for that role shows |
| 3 | Wrong password | A friendly message, no code like `auth/…` |
| 4 | Google sign-in (once the Firebase files are in) | The phone's own Google sheet opens and you are signed in |
| 5 | Sign in with Apple (iPhone only) | Apple's sheet opens. Finish it on a **real iPhone**; the simulator stops at Apple's password step, which is not an app fault |
| 6 | Every menu screen, each role | Each screen loads; nothing says "Load failed" |
| 7 | Open a matter, every tab | Steps, Documents, Payments, Chat all load |
| 8 | Create a matter (admin) | It is created and opens |
| 9 | **Upload a document** (photo or file) | It appears in the list and is **not** "Awaiting upload" — this is the D-5 check |
| 10 | Download a document | It opens or the share sheet appears |
| 11 | Chat: type a message | The Send button stays above the keyboard |
| 12 | Tap a text field (iPhone) | The page does not zoom in |
| 13 | Rotate the phone | The screen redraws and stays usable |
| 14 | Close the app, open it again | Still signed in |
| 15 | Sign out | Back to the sign-in screen |
| 16 | Airplane mode, then open the app | The "can't connect" page with Try again; Try again works once back online |
| 17 | Android back button | Goes back a screen; on the first screen it leaves the app |
| 18 | After a website deploy to QA: put the app in the background for over a minute, then return | It reloads once onto the new version, and you stay signed in |

## 5. The automated iPhone tests (optional)

```bash
cd MobileApp/ios/App
TEST_RUNNER_LT_QA_ADMIN_EMAIL=… TEST_RUNNER_LT_QA_ADMIN_PASSWORD=… \
TEST_RUNNER_LT_QA_CLIENT_EMAIL=… TEST_RUNNER_LT_QA_CLIENT_PASSWORD=… \
xcodebuild test -workspace App.xcworkspace -scheme App \
  -destination 'platform=iOS Simulator,name=iPhone 17' CODE_SIGNING_ALLOWED=NO
```

Same for `MANAGER`, `TEAM` and `PRO`. A role without credentials is skipped. Only after step 2
(QA sync): the signed-in tests use QA accounts.

## 6. Reporting

One line per failure in the GitHub issue (#268): **device and OS**, **app** (Android / iPhone),
**role**, **checklist number**, what you saw, and a screenshot. Do not change code to work around
it.
