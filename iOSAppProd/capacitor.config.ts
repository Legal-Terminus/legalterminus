import type { CapacitorConfig } from '@capacitor/cli';
import { readFileSync } from 'node:fs';
import { join } from 'node:path';

// Production iPhone app (docs/ios-production-app.md). Same shell as iOSApp/, fixed to production.
// The QA app is "Legal Terminus QA", id com.legalterminus.app.qa, so it installs next
// to the production app and is never mistaken for it. On Android the ids also come
// from Gradle (android/app/build.gradle), on iOS from Config/Environment.xcconfig —
// both written from the same environments.json by scripts/app-env.mjs.
type Environments = {
  default: string;
  baseAppId: string;
  environments: Record<string, { appIdSuffix: string; appName: string }>;
};
const environments = JSON.parse(readFileSync(join(__dirname, '..', 'MobileShared', 'environments.json'), 'utf8')) as Environments;
// This is the PRODUCTION app folder: it can only ever be the production app. A different LT_APP_ENV
// (or a stale .app-env.json) is refused instead of silently building a QA app.
const envName = 'production';
if (process.env.LT_APP_ENV && process.env.LT_APP_ENV !== 'production') {
  throw new Error(`iOSAppProd/ builds production only (got LT_APP_ENV=${process.env.LT_APP_ENV}). The QA app is iOSApp/.`);
}
const target = environments.environments[envName];
if (!target) throw new Error('environments.json has no "production" entry');

const config: CapacitorConfig = {
  // Production id registered in Play Console; it cannot be changed after the first upload.
  appId: `${environments.baseAppId}${target.appIdSuffix}`,
  appName: target.appName,
  // Output of `npm run build:mobile` in Portal/.
  webDir: '../Portal/dist-mobile',
  // iOS keeps Capacitor's own capacitor://localhost origin: WKWebView refuses http/https as a
  // custom scheme handler, so server.iosScheme must NOT be set to 'https' (E29-S03 allows
  // that origin on the API). No allowNavigation list: every other host opens outside the app
  // (Safari), which is what external links, receipts and the website should do (E29-S06).
  ios: {
    // E29-S02/S06. iPhone only for the first release (D4): 'mobile' content mode. contentInset 'never': the Portal's CSS
    // (html[data-native] safe-area padding) already insets the header and bottom bar; 'automatic' did it a second time,
    // leaving a ~46pt empty band under the status bar and an uneven page offset.
    contentInset: 'never',
    preferredContentMode: 'mobile',
    allowsLinkPreview: false,
    scrollEnabled: true,
    limitsNavigationsToAppBoundDomains: false,
    // webContentsDebuggingEnabled is left to Capacitor's default: Safari Web Inspector
    // on Debug builds only; an archived (TestFlight / App Store) build is closed.
  },
  plugins: {
    // Native Google (and, on iOS, Apple) sign-in only returns the provider's ID token; the
    // Portal hands it to the Firebase web SDK, so the web and app share one session.
    FirebaseAuthentication: { skipNativeAuth: true, providers: ['google.com', 'apple.com'] },
    // Keep the splash up until the Portal has drawn its first screen (hidden in lib/native.ts),
    // so there is no blank white gap while the page loads.
    SplashScreen: { launchAutoHide: false, backgroundColor: '#ffffff' },
    // E29-S06: a focused input near the bottom (login, Chat composer) is scrolled into view.
    Keyboard: { resize: 'native', resizeOnFullScreen: true },
  },
};

export default config;
