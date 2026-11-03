import type { CapacitorConfig } from '@capacitor/cli';

const config: CapacitorConfig = {
  // Registered in Play Console. It cannot be changed after the first upload.
  appId: 'com.legalterminus.app',
  appName: 'Legal Terminus',
  // Output of `npm run build:mobile` in Portal/.
  webDir: '../Portal/dist-mobile',
  // Keep the default https scheme: QA's CORS allowlist has https://localhost.
  server: {
    androidScheme: 'https',
    // Shown instead of a blank screen when the phone's WebView is too old (see below).
    errorPath: 'webview-update.html',
  },
  android: {
    // The Portal is built for Chrome 111+ (Vite's default target, and Tailwind 4's own
    // minimum), far above Capacitor's default of 60. Without this, an old WebView gets a
    // blank white screen instead of a message.
    minWebViewVersion: 111,
  },
  plugins: {
    // Native Google sign-in only returns the Google ID token; the Portal hands it to
    // the Firebase web SDK, so the web and app share one session.
    FirebaseAuthentication: { skipNativeAuth: true, providers: ['google.com'] },
    // Keep the splash up until the Portal has drawn its first screen (hidden in lib/native.ts),
    // so there is no blank white gap while the page loads.
    SplashScreen: { launchAutoHide: false, backgroundColor: '#ffffff' },
  },
};

export default config;
