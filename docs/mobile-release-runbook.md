# Release runbook: Legal Terminus app 1.0 (iPhone) and 1.0.2 (Android)

For Akash, from 2026-11-21. Do the steps in order and tick them off in GitHub issue #268. If a step
does not match what you see, **stop and ask**; do not change app code to get past it. The design
and the reasons are in `docs/mobile-release.md`; this page is only the steps.

**The rules**
- Build only from `main`, in `MobileApp/`. Do not use the deleted branch `feat/ios-android-app-split`
  or the folders `iOSApp/`, `AndroidApp/` or `MobileShared/`.
- One app, `com.legalterminus.app`, on both stores. It opens the hosted Portal:
  `LT_APP_ENV=qa` for testing and `LT_APP_ENV=production` for anything sent to a store.
- Never paste a password, key or keystore into chat, email, GitHub or a commit.

**What is already done (21 Nov)**
- Android **1.0.2 (build 8)** is built and signed by the pipeline. It is on the GitHub Release
  "1.0.2 (Build 8)" (tag `v1.6.0-lt.26`), signed with the **new** upload key.
- Play has accepted the **upload key reset**. The new key can be used from **23 Nov 2026, 08:58 UTC**.
- The App Store Connect app "Legal Terminus" (`com.legalterminus.app`, version 1.0) exists.
  The old "Legal Terminus QA" app is deleted.
- The Firebase iOS app `com.legalterminus.app` is registered.
- The reviewer account `play.reviewer@legalterminus.com` (a client with no data) has a new password.
- The store text is in `docs/store-listing.md`.

---

## Part A: before you start (once)

1. **Access.** Ask Payal (the Apple account holder) to invite you:
   - **App Store Connect → Users and Access** → your Apple ID with the **App Manager** role, with
     **Access to Certificates, Identifiers & Profiles** ticked. Accept the email invitation.
   - In Xcode → **Settings → Accounts**, add that Apple ID. The team **LEGAL TERMINUS PRIVATE
     LIMITED** (`LMD2KSCQZX`) must appear.
2. **Files from Ankit** (by AirDrop, or a password-protected zip with the password told by phone):
   - `GoogleService-Info.plist` → `~/lt-android-release/keys/production/` **and**
     `~/lt-android-release/keys/qa/` (the same file in both)
   - `PLAY_REVIEWER.txt` (the reviewer login) → `~/lt-android-release/keys/`
   - `.env.e2e` (the QA test accounts, one per role) → `Portal/e2e/.env.e2e` in your checkout (it is
     ignored by git)
3. **Code.**
   ```bash
   git checkout main && git pull
   cd MobileApp && npm ci
   ```

## Part B: iPhone, test on your own phone (QA)

1. `LT_APP_ENV=qa npm run sync:ios`, then check it opens QA:
   ```bash
   grep '"url"' ios/App/App/capacitor.config.json   # https://legal-terminus-qa.web.app/portal/
   ```
2. `npm run open:ios`. In Xcode: **App** target → **Signing & Capabilities** → Team **LEGAL TERMINUS
   PRIVATE LIMITED**.
3. Plug in your iPhone by cable, unlock it and tap **Trust**. Choose it as the device at the top
   and press **▶ Run**. Xcode registers your iPhone with the team; this also fixes the
   "Your team has no devices" signing error.
4. Test with the QA accounts from `.env.e2e`, using the checklist in `docs/mobile-testing.md`.
   Make sure to try:
   - **Sign in with Apple**, all the way through. It only completes on a real iPhone.
   - **Google** sign-in.
   - An **upload from Photos**.
   - **Chat** with the keyboard open.
5. Write the results in #268 (device, iOS version, pass or fail per item).

## Part C: iPhone, build and upload to TestFlight (production)

1. `LT_APP_ENV=production npm run sync:ios`. The check must print
   `https://legalterminus.com/portal/`.
2. In Xcode, **App** target → **General**: **Version 1.0**, **Build 8**. Do not type over them;
   they come from `ios/App/Config/Shared.xcconfig`.
3. Device at the top: **Any iOS Device (arm64)** → **Product → Archive**.
4. Organizer → **Distribute App** → **App Store Connect** → **Upload**, keeping the defaults
   (automatic signing). Wait for "Uploaded".
5. Save a copy: Organizer → right-click the archive → **Show in Finder**, and copy the `.xcarchive`
   to `~/lt-android-release/out/`.
6. App Store Connect → **TestFlight**. After 10–30 minutes build **1.0 (8)** appears.
   - Add yourself and Ankit under **Internal Testing**.
   - Install it from the **TestFlight** app on your iPhone.
   - Repeat the Part B test **against production**, using the reviewer login from `PLAY_REVIEWER.txt`
     or your own real account. It is live data, so do not create matters or send messages to
     real clients.

## Part D: iPhone, the store page and submission

In App Store Connect → **Legal Terminus** → **Distribution**:

1. **App Information:**
   - Category **Business**, secondary **Productivity**.
   - **Content Rights**: "does not contain third-party content".
   - **Age Rating**: answer None/No to everything, which gives 4+.
2. **Pricing and Availability:**
   - Price **Free**.
   - Availability **India**, or the countries Ankit names. **Leave out China mainland.**
3. **App Privacy:** answer the same way as the Play "Data safety" form in
   `docs/play-store-listing.md`:
   - Contact info (name, email, phone), user content (documents, messages), identifiers (user ID).
   - Collected for **App Functionality**, **linked to the user**, **not used for tracking**.
   - Privacy policy URL `https://legalterminus.com/privacy-policy`.
4. **Version 1.0:**
   - Paste the **subtitle**, **promotional text**, **description**, **keywords**, **support URL**,
     **marketing URL** and **copyright** from `docs/store-listing.md`.
   - **Screenshots**: iPhone 6.9" (1320 × 2868), 3 to 5 of them.
     - Take them from the **iPhone 17 Pro Max** simulator on a **QA** build (QA test data only,
       never real clients).
     - Suggested screens: the client dashboard, a matter's steps, documents, chat, and payments.
     - Simulator: **File → Save Screen** (Cmd+S).
   - **Build**: choose **1.0 (8)**.
   - **App Review Information**:
     - Sign-in required: the reviewer email and password from `PLAY_REVIEWER.txt`.
     - Notes: "A client account with no matters. Sign in with email and password. Sign in with
       Apple and Google are also offered."
     - Contact: `sales21@legalterminus.com`.
   - **Version Release**: **Manually release this version**.
5. **Before you submit**, check with Ankit:
   - the figures in the description are confirmed by the firm (`docs/store-listing.md`);
   - the privacy policy update (PR #223) is live on legalterminus.com.
6. **Add for Review → Submit.** When Apple approves, **Ankit decides when to press Release.**

## Part E: Android (from 23 Nov 2026, 08:58 UTC)

In Play Console → **LegalTerminus**:

1. **Testing → Internal testing → Create new release**.
   - Upload `app-release.aab` from the GitHub Release "1.0.2 (Build 8)":
     https://github.com/Legal-Terminus/legalterminus/releases/tag/v1.6.0-lt.26
   - Release notes: the "What's new" text from `docs/store-listing.md`.
   - **Start rollout**.
2. **Testers** tab: add the testers' Gmail addresses, open the opt-in link on an Android phone,
   **install from Play**, and repeat the checklist on production.
3. **Store presence → Main store listing**: paste the short and full description from
   `docs/store-listing.md`.
4. **Production → Create new release → Add from library → build 8 (1.0.2)**.
   - Same notes.
   - Staged rollout **20%**.
   - **App content → App access**: the reviewer login from `PLAY_REVIEWER.txt`.
   - **Send for review**.
5. **Publishing overview:** when Google approves, **Ankit decides when to press Publish**. Build 8
   then replaces build 4 (1.0.1) on existing phones.

**Never publish anything signed with the old key, and never upload build 4 again.** A new Android
build always comes from the pipeline ("Deploy to Production", from a release tag, `build_android`),
with the next build number (9 or higher).
