import { Capacitor } from '@capacitor/core';
import { accountLinkPath, entryScriptOf, shouldReloadForUpdate } from './nativeRules';
import { isBusy } from './updateGuard';

/** True inside the iPhone app. */
export const isIosApp = (): boolean => Capacitor.getPlatform() === 'ios';

/**
 * True when the page is the app's own bundled copy (origin https://localhost on Android,
 * capacitor://localhost on iPhone) rather than the hosted website.
 */
const isBundledApp = (): boolean => Capacitor.isNativePlatform() && window.location.hostname === 'localhost';

/**
 * The website's address. In a browser, and in an app that opens the hosted Portal (the
 * Android app), that is this page's own origin. An app that still bundles the Portal runs at
 * https://localhost or capacitor://localhost, so a link to a website page must name the
 * environment's host instead (the build's API base URL — the API is served from the site's own host).
 */
export const siteOrigin = (): string =>
  isBundledApp() ? (import.meta.env.VITE_API_BASE_URL ?? '') : window.location.origin;

/** Back in the foreground after at least this long: check whether the website was redeployed. */
const UPDATE_CHECK_AFTER_MS = 60_000;

/** The entry script this page was loaded from (e.g. /portal/assets/index-AbC123.js). */
const currentEntryScript = (): string | null => {
  const el = document.querySelector<HTMLScriptElement>('script[type="module"][src*="/assets/index-"]');
  return el ? new URL(el.src, window.location.href).pathname : null;
};

/** True while the person is typing in a field: a reload would lose what they entered. */
const isEditing = (): boolean => {
  const el = document.activeElement as HTMLElement | null;
  return !!el && (el.tagName === 'INPUT' || el.tagName === 'TEXTAREA' || el.tagName === 'SELECT' || el.isContentEditable);
};

/**
 * Hosted app only: when the app returns from the background, fetch the Portal's index.html
 * (the hosting sends no-store, so it is always current) and reload ONLY if the deployed entry
 * script changed, nobody is typing and no upload is running. Sessions are untouched: the
 * Firebase sign-in lives in this origin's storage, which a reload does not clear. Any error
 * (offline, hosting restarting) is ignored and the current page keeps working.
 */
function watchForNewWebsiteVersion(App: typeof import('@capacitor/app').App): void {
  if (isBundledApp()) return;
  let hiddenAt: number | null = null;
  void App.addListener('appStateChange', async ({ isActive }) => {
    if (!isActive) { hiddenAt = Date.now(); return; }
    if (hiddenAt === null) return;
    const hiddenMs = Date.now() - hiddenAt;
    hiddenAt = null;
    if (hiddenMs < UPDATE_CHECK_AFTER_MS) return;
    try {
      const res = await fetch(`${window.location.origin}/portal/`, { cache: 'no-store', credentials: 'omit' });
      if (!res.ok) return;
      const latest = entryScriptOf(await res.text());
      if (shouldReloadForUpdate({
        hiddenMs, minHiddenMs: UPDATE_CHECK_AFTER_MS, current: currentEntryScript(), latest,
        busy: isBusy(), editing: isEditing(),
      })) window.location.reload();
    } catch { /* offline or hosting restarting: keep the page we have */ }
  });
}

/**
 * Behaviour that only exists inside the Android and iPhone apps. A no-op in the browser,
 * so the web build is unaffected.
 */
export async function initNative(): Promise<void> {
  if (!Capacitor.isNativePlatform()) return;
  // E29-S06: CSS hooks for the app only (safe areas, overscroll) — `html[data-native]`.
  // The web build never has the attribute, so the website's layout cannot change.
  document.documentElement.dataset.native = Capacitor.getPlatform();
  // The hosted Portal's own viewport tag has no viewport-fit=cover (only the bundled mobile
  // build adds it). Inside the app only, draw under the status bar and home indicator; index.css
  // pads with the safe-area insets. Idempotent, so the bundled build is unaffected.
  const viewport = document.querySelector('meta[name="viewport"]');
  if (viewport && !/viewport-fit=cover/.test(viewport.getAttribute('content') ?? '')) {
    viewport.setAttribute('content', `${viewport.getAttribute('content')}, viewport-fit=cover`);
  }
  if (isIosApp()) {
    // Dark text on the white top bar.
    const { StatusBar, Style } = await import('@capacitor/status-bar');
    await StatusBar.setStyle({ style: Style.Light }).catch(() => undefined);
  }
  const { App } = await import('@capacitor/app');
  watchForNewWebsiteVersion(App);
  // Android's back button: go back through the app's history, and leave the app
  // only from the first screen. (iOS has none; every screen has its own Back control.)
  await App.addListener('backButton', ({ canGoBack }) => {
    if (canGoBack) window.history.back();
    else void App.exitApp();
  });

  // Emailed account links (sign-in, password setup/reset) open the app, not the browser:
  // Android App Links and iOS Universal Links both arrive as `appUrlOpen`.
  // Only that one path is routed; any other link the system hands over is ignored.
  const openAccountLink = async (raw: string) => {
    const to = accountLinkPath(raw);
    if (!to) return;
    const { router } = await import('../routes');
    await router.navigate(to, { replace: true });
  };
  await App.addListener('appUrlOpen', ({ url }) => { void openAccountLink(url); });
  const launch = await App.getLaunchUrl();
  if (launch?.url) void openAccountLink(launch.url);
}

/** Hide the launch splash once the first screen has been drawn. A no-op in a browser. */
export async function hideNativeSplash(): Promise<void> {
  if (!Capacitor.isNativePlatform()) return;
  // Two frames: React has committed AND the browser has painted it.
  await new Promise<void>((r) => requestAnimationFrame(() => requestAnimationFrame(() => r())));
  const { SplashScreen } = await import('@capacitor/splash-screen');
  await SplashScreen.hide({ fadeOutDuration: 200 });
}

const EXTENSIONS: Record<string, string> = {
  'application/pdf': 'pdf',
  'image/jpeg': 'jpg',
  'image/png': 'png',
  'application/zip': 'zip',
  'text/csv': 'csv',
  'application/json': 'json', // #219
  'text/plain': 'txt',        // #219
  'application/vnd.openxmlformats-officedocument.wordprocessingml.document': 'docx',
  'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet': 'xlsx',
  'application/vnd.ms-excel': 'xls',
};

const blobToBase64 = (blob: Blob) => new Promise<string>((resolve, reject) => {
  const reader = new FileReader();
  reader.onload = () => resolve(String(reader.result).split(',')[1] ?? '');
  reader.onerror = () => reject(reader.error);
  reader.readAsDataURL(blob);
});

/** Write a fetched file into the app's cache and return its file:// URI. */
async function writeToCache(blob: Blob, baseName: string): Promise<string> {
  const { Filesystem, Directory } = await import('@capacitor/filesystem');
  const ext = EXTENSIONS[blob.type];
  const safe = baseName.replace(/[^\w.-]+/g, '_');
  const name = ext && !safe.toLowerCase().endsWith(`.${ext}`) ? `${safe}.${ext}` : safe;
  const { uri } = await Filesystem.writeFile({
    path: `shared/${name}`,
    data: await blobToBase64(blob),
    directory: Directory.Cache,
    recursive: true,
  });
  return uri;
}

/**
 * An Android WebView cannot window.open() a blob: URL, so "View" did nothing in
 * the app. Hand the file to the phone's own viewer instead. Returns false in a
 * browser so the caller keeps its normal web behaviour.
 */
export async function openBlobNative(blob: Blob, baseName: string): Promise<boolean> {
  if (!Capacitor.isNativePlatform()) return false;
  const uri = await writeToCache(blob, baseName);
  const { FileOpener } = await import('@capacitor-community/file-opener');
  await FileOpener.open({ filePath: uri, contentType: blob.type || undefined });
  return true;
}

/** Same idea for a download (e.g. a zip): offer it through the share sheet. */
export async function shareBlobNative(blob: Blob, baseName: string): Promise<boolean> {
  if (!Capacitor.isNativePlatform()) return false;
  const uri = await writeToCache(blob, baseName);
  const { Share } = await import('@capacitor/share');
  await Share.share({ title: baseName, url: uri });
  return true;
}
