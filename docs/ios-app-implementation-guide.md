# iOS app — implementation guide for E-29

Code-level guidance per story, so nobody starts from a blank Xcode project. The stories, their
acceptance criteria and status are in `_bmad-output/planning-artifacts/epics.md` → E-29; the
design decisions in `architecture.md` → "iOS app (E-29)"; the release procedure in
`docs/mobile-release.md`. This file is the *how*. Paths are LT's (`/portal/…`,
`legalterminus.com`, `legal-terminus-qa.web.app`).

```
Portal/src ──(vite build --mode mobile)──▶ Portal/dist-mobile ──(cap sync ios)──▶ MobileApp/ios/App/App/public
   └─ lib/native.ts, lib/googleSignIn.ts (native branch), lib/firebase.ts (persistence)   — isNativePlatform() guards
WKWebView origin capacitor://localhost ──▶ API (CORS_ORIGINS) / buckets (storage-cors.json)
html[data-native="ios"] ──▶ safe-area and overscroll CSS; the web build has no attribute
```

## E29-S02 — the platform

`MobileApp/package.json` scripts:
```json
"build:web": "cd ../Portal && npm run build:mobile",
"sync:android": "npm run build:web && cap sync android",
"sync:ios": "npm run build:web && cap sync ios",
"sync": "npm run build:web && cap sync",
"open:ios": "cap open ios",
"run:ios": "npm run sync:ios && cap run ios"
```

`capacitor.config.ts` additions (keep everything that is there):
```ts
ios: { contentInset: 'automatic', preferredContentMode: 'mobile', allowsLinkPreview: false,
       limitsNavigationsToAppBoundDomains: false },
plugins: { …, Keyboard: { resize: 'body', resizeOnFullScreen: true } },
// Do NOT set server.iosScheme to 'https': WKWebView refuses http/https as custom scheme handlers.
// server.errorPath / android.minWebViewVersion stay Android-only; iOS has no old-WebView case.
```

`Info.plist` keys (`MobileApp/ios/App/App/Info.plist`):
```
NSCameraUsageDescription           Legal Terminus uses the camera to photograph a document for your matter.
NSPhotoLibraryUsageDescription     Legal Terminus needs your photos to upload a document or image.
NSPhotoLibraryAddUsageDescription  Legal Terminus saves documents you download when you ask.
ITSAppUsesNonExemptEncryption      false
```

`MobileApp/ios/ExportOptions.plist` (committed):
```xml
<?xml version="1.0" encoding="UTF-8"?>
<!DOCTYPE plist PUBLIC "-//Apple//DTD PLIST 1.0//EN" "http://www.apple.com/DTDs/PropertyList-1.0.dtd">
<plist version="1.0"><dict>
  <key>method</key><string>app-store</string>
  <key>signingStyle</key><string>automatic</string>
  <key>teamID</key><string>TEAMID</string>
  <key>uploadSymbols</key><true/>
  <key>stripSwiftSymbols</key><true/>
</dict></plist>
```

Root `.gitignore` additions (and uncomment `*.jks` / `*.keystore` in `MobileApp/android/.gitignore`):
```
MobileApp/ios/App/Pods/
MobileApp/ios/App/build/
MobileApp/ios/App/public/
MobileApp/ios/App/App/capacitor.config.json
MobileApp/ios/App/App/config.xml
MobileApp/ios/**/xcuserdata/
MobileApp/ios/**/GoogleService-Info*.plist
*.mobileprovision
*.p8
*.jks
*.keystore
key.properties
```

## E29-S03 — the origin

`backend/src/config/corsOrigins.js`:
```js
/** Exact origins only: scheme + host (+ port). The one non-web form is the iOS app's origin —
 *  WKWebView cannot serve the app over https, so Capacitor uses its own scheme. Nothing else on
 *  that scheme is accepted (no port, no path, no other host). */
const IOS_APP_ORIGIN = "capacitor://localhost";
const isExactOrigin = (value) =>
  value === IOS_APP_ORIGIN || /^https?:\/\/[a-z0-9.-]+(:\d+)?$/i.test(value);
```
Tests (next to the existing ones):
```js
const allowed = buildAllowedOrigins({ NODE_ENV: "production", CORS_ORIGINS: "https://localhost,capacitor://localhost" });
expect(isAllowedOrigin("capacitor://localhost", allowed)).toBe(true);
for (const o of ["capacitor://localhost:8080", "capacitor://localhost/", "capacitor://evil", "ionic://localhost", "capacitor://localhost.evil.test"])
  expect(isAllowedOrigin(o, allowed)).toBe(false);
expect(isAllowedOrigin("capacitor://localhost", buildAllowedOrigins({ NODE_ENV: "production" }))).toBe(false);
```
Workflows: `deploy-qa.yml` → `CORS_ORIGINS=https://localhost,capacitor://localhost,http://localhost:5173`;
`deploy-production.yml` → `CORS_ORIGINS=https://localhost,capacitor://localhost`.
`storage-cors.json` → add `"capacitor://localhost"`; apply to `legal-terminus-web-qa` now,
`legal-terminus-web.firebasestorage.app` at release with approval.

## E29-S04 — Google sign-in on iOS

No new sign-in code: `startGoogleSignIn` already takes the native branch on any native platform.
iOS needs the plugin's set-up (BeatMyEMI's `ios/App` is the worked example):

1. `GoogleService-Info.plist` into `MobileApp/ios/App/App/` and added to the App target in
   Xcode (ignored by git; the release Mac keeps it in `~/lt-android-release/keys/`).
2. `Info.plist` — the Google picker returns to the app through the reversed client id from
   that plist:
   ```xml
   <key>CFBundleURLTypes</key>
   <array><dict>
     <key>CFBundleURLSchemes</key>
     <array><string>com.googleusercontent.apps.XXXXXXXX-xxxxxxxx</string></array>   <!-- REVERSED_CLIENT_ID -->
   </dict></array>
   ```
3. `MobileApp/ios/App/Podfile` — after the line `cap sync` writes for the plugin, add the
   Google subspec (the plugin only links Google Sign-In when asked):
   ```ruby
   pod 'CapacitorFirebaseAuthentication', :path => '../../node_modules/@capacitor-firebase/authentication'
   pod 'CapacitorFirebaseAuthentication/Google', :path => '../../node_modules/@capacitor-firebase/authentication'
   ```
   then `pod install` (`cap sync ios` keeps the added line).
4. `capacitor.config.ts` stays `FirebaseAuthentication: { skipNativeAuth: true, providers: ['google.com', 'apple.com'] }`
   (Apple added by S11).
5. Firebase console: the iOS app registered in S01 carries its own OAuth client; nothing else to
   enable (the Google provider is already on for the web).

Refused account — already handled (E26-S08): `apiFetch` reads `error`; `LoginPage` signs out.
Verify on iOS only.

## E29-S11 — Sign in with Apple (same build as S04)

`Portal/src/lib/appleSignIn.ts`, the same shape as `googleSignIn.ts`:
```ts
import { Capacitor } from '@capacitor/core';
import { OAuthProvider, getAdditionalUserInfo, signInWithCredential, signInWithPopup, type Auth, type UserCredential } from 'firebase/auth';

const provider = () => { const p = new OAuthProvider('apple.com'); p.addScope('email'); p.addScope('name'); return p; };

export async function startAppleSignIn(auth: Auth): Promise<UserCredential> {
  if (Capacitor.isNativePlatform()) {
    const { FirebaseAuthentication } = await import('@capacitor-firebase/authentication');
    const { credential } = await FirebaseAuthentication.signInWithApple({ scopes: ['email', 'name'], skipNativeAuth: true });
    if (!credential?.idToken) throw Object.assign(new Error('No Apple ID token'), { code: 'auth/user-cancelled' });
    // The plugin sends Apple a hashed nonce; Firebase verifies the token against the raw one.
    return signInWithCredential(auth, provider().credential({ idToken: credential.idToken, rawNonce: credential.nonce ?? undefined }));
  }
  return signInWithPopup(auth, provider());   // web; reuse chooseGoogleFlow for the phone/redirect case if needed
}

/** Apple sends the name on the FIRST sign-in only. Return it so the caller can register with it. */
export function appleDisplayName(result: UserCredential): string | null {
  const p = getAdditionalUserInfo(result)?.profile as { name?: { firstName?: string; lastName?: string } } | undefined;
  const n = [p?.name?.firstName, p?.name?.lastName].filter(Boolean).join(' ').trim();
  return n || result.user.displayName || null;
}

export function appleSignInMessage(code: string): string | null {
  switch (code) {
    case 'auth/cancelled-popup-request': return null;
    case 'auth/popup-closed-by-user': case 'auth/user-cancelled': return 'The Apple window was closed before sign-in finished. Please try again.';
    case 'auth/account-exists-with-different-credential': return 'This email already has an account with a password or Google. Sign in that way, or use "Email me a sign-in link".';
    default: return 'Apple sign-in did not complete. Please try again, or use "Email me a sign-in link".';
  }
}
```
`LoginPage`: an Apple button below the Google one (black, Apple logo, "Sign in with Apple" —
Apple's Human Interface rules are checked at review), the hint "Use the email your firm has for
you — a hidden email creates a new account", and `completeGoogleSignIn` generalised to
`completeProviderSignIn(result, 'apple')` so the first-sign-in name reaches
`/api/auth/register` (`registerSchema` accepts `provider: 'apple'` and `fullName`).

Apple side: App ID → Sign in with Apple; Xcode → Signing & Capabilities → + Sign in with Apple;
Identifiers → Services ID (`com.legalterminus.app.web`), domains `legalterminus.com` and
`legal-terminus-qa.web.app`, return URL = the "OAuth redirect URI" shown in Firebase →
Authentication → Sign-in method → Apple; Keys → Sign in with Apple key → `.p8` (download once;
store with the other keys) → paste key id, team id and the key into Firebase's Apple provider.
`capacitor.config.ts` → `providers: ['google.com', 'apple.com']`; the `Podfile` needs no extra
subspec for Apple (system `AuthenticationServices`).

Backend: `register` treats `@privaterelay.appleid.com` like any new email (no special case);
`upsertUser`'s email match therefore creates a new Client — intended, see the epic's S11.

## E29-S05 — files

No new code expected. Checklist of sites that must go through `openBlobNative` /
`shareBlobNative`: document View, zip download, `exportToXlsx`, Master Sheet CSV
(`downloadMasterSheetCSV`, token fetch), comment-image zoom (`commentImageDom.ts`),
Worksheets download. `grep -rn "createObjectURL\|download=\|window.open(" Portal/src` must show
every hit guarded. iOS names the viewer by **extension** — the `EXTENSIONS` map in `native.ts`
must cover pdf, jpg, png, zip, csv, docx, xlsx, xls.

## E29-S06 — shell behaviour

`Portal/index.html`: `content="width=device-width, initial-scale=1.0, viewport-fit=cover"`.

`native.ts` `initNative` additions (iOS only where marked):
```ts
document.documentElement.dataset.native = Capacitor.getPlatform();
if (isIosApp()) {
  const { StatusBar, Style } = await import('@capacitor/status-bar');
  await StatusBar.setStyle({ style: Style.Light });
}
export async function openExternal(url: string): Promise<boolean> {
  if (!Capacitor.isNativePlatform()) return false;
  const { Browser } = await import('@capacitor/browser');
  await Browser.open({ url });
  return true;
}
```
`Portal/src/index.css`:
```css
html[data-native] { overscroll-behavior-y: none; }
html[data-native] .app-topbar { padding-top: env(safe-area-inset-top); }
html[data-native] .chat-composer, html[data-native] .app-bottombar { padding-bottom: env(safe-area-inset-bottom); }
```
(use the real class names in `TopBar`/`DiscussionPanel`; add a class rather than selecting by
structure). Every `window.open(url, '_blank')` to another host becomes
`if (!(await openExternal(url))) window.open(url, '_blank', 'noopener')`.

Razorpay (`PayNowCard.tsx`, `payNow.ts`): no code change expected. Device test: card with
3-D Secure, and UPI. If a UPI app does not open from the checkout, add to `Info.plist`:
```
LSApplicationQueriesSchemes: upi, phonepe, gpay, paytmmp
```

Playwright, web build: `expect(page.locator('html')).not.toHaveAttribute('data-native', /.+/)`.

## E29-S07 — Universal Links

`MobileApp/ios/App/Config/QA.xcconfig` → `LINK_HOST = legal-terminus-qa.web.app`;
`Production.xcconfig` → `LINK_HOST = legalterminus.com`; assign per build configuration.
`App/App.entitlements`:
```xml
<key>com.apple.developer.associated-domains</key>
<array><string>applinks:$(LINK_HOST)</string></array>
```
AASA (if from the repo: `Frontend/public/.well-known/apple-app-site-association`, no extension):
```json
{"applinks":{"details":[{"appIDs":["TEAMID.com.legalterminus.app"],"components":[{"/":"/portal/account/action*"}]}]}}
```
Prefer the same source as `assetlinks.json` (Firebase project settings — fill the iOS app's
Team ID there) so the two files cannot disagree. Production: only when launch is approved.

`native.ts` — extract the matcher for a unit test:
```ts
export const accountLinkPath = (raw: string): string | null => {
  let url: URL; try { url = new URL(raw); } catch { return null; }
  if (!url.pathname.startsWith('/portal/account/action')) return null;
  return url.pathname.replace(/^\/portal/, '') + url.search;
};
```
Checks: `curl -sI https://legal-terminus-qa.web.app/.well-known/apple-app-site-association`
(200, `application/json`, no `location`);
`https://app-site-association.cdn-apple.com/a/v1/legal-terminus-qa.web.app`.

## E29-S08 — account deletion

Design in `architecture.md` → "iOS app (E-29)". Code shape (Ambyflow's story 45.6 is the
source of this feature per `docs/releases/SYNC.md`; port by content):

- `backend/src/schemas/accountDeletion.schema.js`: `z.object({ reason: z.string().trim().max(500).optional() }).strict()`.
- `auth.routes.js`: `router.post('/me/deletion-request', verifyToken, requireRole(<every role but admin>), validate(deletionRequestSchema), handler)` → 202 `{ message }`; add to the strict rate limiter.
- `services/accountDeletion.service.js` `requestDeletion({ db, uid, reason, log })`: transaction
  sets `users/{uid}.deletionRequestedAt`, `deletionReason`, `status: 'deletion_requested'`
  (returns early if already set — idempotent, no second email); `admin.auth().updateUser(uid,
  { disabled: true })`; audit entry `account_deletion_requested`; email to admin addresses
  ("Account deletion requested — open Users, filter Deletion requested").
- Portal: `api/account.ts` `requestAccountDeletion`; route `/account/delete` (no nav, every
  role but admin) → `DeleteAccountPage` in `PageShell` (what happens, what the firm keeps,
  within 30 days, optional reason, `btn-danger`) → `signOut(auth)` →
  `/login?notice=deletion-requested`; account menu entry hidden for admin; Users page
  `badge-warning` "Deletion requested" + filter; `auth/user-disabled` → "This account has been
  disabled. Contact your firm."
- Existing admin delete completes it; its matters guard stays (close/reassign first).
- Playwright `account-deletion.spec.ts` (client requests, admin sees badge, admin completes; admin → 403).

## E29-S09 — the Android job and the guard

`MobileApp/scripts/check-bundle.mjs <qa|production> [dir]` — walks `Portal/dist-mobile`,
fails on: production → `/qa-data/`, `/legal-terminus-qa/`, `/localhost:5001/`,
`/@[\w.-]+\.test\b/`, `/EMAIL_DISABLED/`; qa → `/legalterminus\.com\/api/`. Exit 1 with the
file and pattern; unit test over two fixture directories.

`deploy-production.yml` job (shape; secrets per `docs/mobile-release.md`):
```yaml
inputs:
  build_android:  { type: boolean, default: false }
  android_format: { type: choice, options: [aab, apk, both], default: both }
  version_name:   { type: string }
  build_number:   { type: string }
jobs:
  build-android:
    if: github.event_name == 'workflow_dispatch' && inputs.build_android && startsWith(github.ref, 'refs/tags/v')
    runs-on: ubuntu-latest
    environment: production
    permissions: { contents: write }
    steps:
      - uses: actions/checkout@v5
      - uses: actions/setup-node@v6
        with: { node-version: '26' }
      - uses: actions/setup-java@v5
        with: { distribution: temurin, java-version: '21' }
      - uses: android-actions/setup-android@v3
      - name: Production env for the Portal build        # the same FRONTEND_* secrets the Portal deploy uses
        run: printf 'VITE_API_BASE_URL=%s\nVITE_FIREBASE_API_KEY=%s\n…' "${{ secrets.FRONTEND_API_URL }}" … > Portal/.env.local
      - run: npm ci --prefix Portal && npm ci --prefix MobileApp
      - run: cd Portal && npm run build:mobile && node ../MobileApp/scripts/check-bundle.mjs production
      - name: Signing material
        run: |
          echo "${{ secrets.GOOGLE_SERVICES_JSON_B64 }}" | base64 -d > MobileApp/android/app/google-services.json
          echo "${{ secrets.ANDROID_KEYSTORE_B64 }}"     | base64 -d > MobileApp/android/upload.keystore
          printf 'storeFile=../upload.keystore\nstorePassword=%s\nkeyAlias=%s\nkeyPassword=%s\n' \
            "${{ secrets.ANDROID_KEYSTORE_PASSWORD }}" "${{ secrets.ANDROID_KEY_ALIAS }}" "${{ secrets.ANDROID_KEY_PASSWORD }}" > MobileApp/android/key.properties
      - run: sed -i "s|versionCode [0-9]*|versionCode ${{ inputs.build_number }}|; s|versionName \"[^\"]*\"|versionName \"${{ inputs.version_name }}\"|" MobileApp/android/app/build.gradle
      - run: cd MobileApp && npx cap sync android
      - run: cd MobileApp/android && ./gradlew bundleRelease assembleRelease -PlinkHost=legalterminus.com --no-daemon
      - name: Verify the signer
        run: $ANDROID_HOME/build-tools/*/apksigner verify --print-certs MobileApp/android/app/build/outputs/apk/release/*.apk | grep -q "${{ vars.ANDROID_UPLOAD_KEY_SHA1 }}"
      - uses: actions/upload-artifact@v7
        with: { name: legalterminus-android-${{ inputs.version_name }}-${{ inputs.build_number }}, retention-days: 7,
                path: "MobileApp/android/app/build/outputs/bundle/release/*.aab\nMobileApp/android/app/build/outputs/apk/release/*.apk\nMobileApp/android/app/build/outputs/mapping/release/mapping.txt" }
      - uses: softprops/action-gh-release@v2
        with: { tag_name: "${{ github.ref_name }}", name: "${{ inputs.version_name }} (Build ${{ inputs.build_number }})",
                files: "MobileApp/android/app/build/outputs/bundle/release/*.aab\nMobileApp/android/app/build/outputs/apk/release/*.apk" }
```
`MobileApp/android/app/build.gradle` reads `key.properties` into `signingConfigs.release`
(standard snippet) and applies it to `buildTypes.release`; absent, a local build uses the debug
config. Turn `minifyEnabled true` on with Capacitor's ProGuard rules so `mapping.txt` exists —
test the release APK once after.

`MobileApp/scripts/env.sh <qa|production>` copies `~/lt-android-release/env/<env>.env` to
`Portal/.env.local` for the Mac path (`docs/mobile-release.md`).

## E29-S10 — the console

No code. `backend/scripts/seed-store-reviewer.js` is optional: the reviewer account from the
Android plan (step 17) already exists on production; add one sample matter through the Admin UI
with approval. Review notes text is in the epic.
