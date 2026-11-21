import type { CapacitorConfig } from '@capacitor/cli';
import { readFileSync } from 'node:fs';
import { join } from 'node:path';

// ONE app, the hosted Portal (owner decision 2026-11-19). The app opens the Portal from its
// hosting URL; nothing of the Portal is bundled. The environment switch (docs/mobile-release.md)
// picks only WHICH hosted Portal: LT_APP_ENV, else the last `npm run sync:*` (.app-env.json),
// else environments.json's default (qa). The app id and name are the same for QA and
// production, so the QA build and the production build are the same app in both stores.
//
// Because the page's origin is the real site (legal-terminus-qa.web.app / legalterminus.com),
// API calls are same-origin through the Hosting rewrite and uploads use the site's own bucket
// CORS entry: no localhost or capacitor:// origin is allowed anywhere.
type Environments = {
  default: string;
  appId: string;
  appName: string;
  environments: Record<string, { host: string; portalUrl: string }>;
};
const environments = JSON.parse(readFileSync(join(__dirname, 'environments.json'), 'utf8')) as Environments;
const synced = (() => {
  try { return (JSON.parse(readFileSync(join(__dirname, '.app-env.json'), 'utf8')) as { env?: string }).env; } catch { return undefined; }
})();
const envName = process.env.LT_APP_ENV || synced || environments.default;
const target = environments.environments[envName];
if (!target) throw new Error(`Unknown LT_APP_ENV "${envName}"`);

const config: CapacitorConfig = {
  // Registered in Play Console; it cannot be changed after the first upload. Same in the App Store.
  appId: environments.appId,
  appName: environments.appName,
  // Only the local fallback pages (offline, old Android WebView) are bundled. The Portal is not.
  webDir: 'web',
  server: {
    url: target.portalUrl,
    // Only the environment's own host loads inside the app (and gets the native bridge).
    // Every other host — receipts, the payment gateway's hand-offs, other sites — opens
    // outside the app (Safari / the browser).
    allowNavigation: [target.host],
    // Shown when the Portal cannot be loaded (no connection) and, on Android, when the
    // phone's WebView is older than minWebViewVersion.
    errorPath: 'error.html',
  },
  android: {
    // The Portal is built for Chrome 111+ (Vite's default target, and Tailwind 4's own
    // minimum), far above Capacitor's default of 60.
    minWebViewVersion: 111,
  },
  ios: {
    // iPhone only for the first release (D4): 'mobile' content mode.
    // contentInset 'never': the Portal's CSS (html[data-native] safe-area padding) insets the
    // header and bottom bar once; 'automatic' did it a second time (Akash, QA round 2).
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
    // 'native' resizes the web view itself, so the Chat Send button stays above the iPhone
    // keyboard ('body' left the h-dvh shell full height — Akash, QA round 2).
    Keyboard: { resize: 'native', resizeOnFullScreen: true },
  },
};

export default config;
