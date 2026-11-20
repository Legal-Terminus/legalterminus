import type { CapacitorConfig } from '@capacitor/cli';
import { readFileSync } from 'node:fs';
import { join } from 'node:path';

// The environment switch (docs/mobile-release.md): LT_APP_ENV, else the last
// `npm run sync` (.app-env.json), else MobileShared/environments.json's default (qa).
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
const synced = (() => {
  try { return (JSON.parse(readFileSync(join(__dirname, '.app-env.json'), 'utf8')) as { env?: string }).env; } catch { return undefined; }
})();
const envName = process.env.LT_APP_ENV || synced || environments.default;
const target = environments.environments[envName];
if (!target) throw new Error(`Unknown LT_APP_ENV "${envName}"`);

const config: CapacitorConfig = {
  // Production id registered in Play Console; it cannot be changed after the first upload.
  appId: `${environments.baseAppId}${target.appIdSuffix}`,
  appName: target.appName,
  // Only the local fallback pages (offline, old WebView) are bundled; the Portal is not.
  // Hosted design (owner request 2026-11-20): the app opens the live Portal, so a website
  // deployment reaches installed apps with no new Play release.
  webDir: 'web',
  server: {
    // The page's origin is the real site, so API calls are same-origin through the Hosting
    // rewrite (/api/** to Cloud Run) and no https://localhost CORS entry is needed.
    url: `https://${target.host}/portal/`,
    // Only this exact host loads inside the app (and gets the native bridge). Every other
    // host (receipts, payment hand-offs, other sites) opens outside the app, in the browser.
    allowNavigation: [target.host],
    // Shown instead of a blank screen when the Portal cannot be loaded (no connection,
    // hosting down) and when the phone's WebView is older than minWebViewVersion.
    errorPath: 'error.html',
  },
  android: {
    // The Portal is built for Chrome 111+ (Vite's default target, and Tailwind 4's own
    // minimum), far above Capacitor's default of 60. Without this, an old WebView gets a
    // blank white screen instead of a message.
    minWebViewVersion: 111,
  },
  plugins: {
    // Native Google (and, on iOS, Apple) sign-in only returns the provider's ID token; the
    // Portal hands it to the Firebase web SDK, so the web and app share one session.
    FirebaseAuthentication: { skipNativeAuth: true, providers: ['google.com', 'apple.com'] },
    // Keep the splash up until the Portal has drawn its first screen (hidden in lib/native.ts),
    // so there is no blank white gap while the page loads.
    // Hosted design: a failed load (offline, hosting down) shows the local error page, and only the
    // Portal's own hide() would remove the splash, so the error page would stay hidden behind it.
    // So the splash also hides by itself after 3 s; a Portal that paints sooner still hides it sooner.
    SplashScreen: { launchAutoHide: true, launchShowDuration: 3000, launchFadeOutDuration: 200, backgroundColor: '#ffffff' },
    // E29-S06: a focused input near the bottom (login, Chat composer) is scrolled into view.
    Keyboard: { resize: 'body', resizeOnFullScreen: true },
  },
};

export default config;
