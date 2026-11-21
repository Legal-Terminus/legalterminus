/**
 * Work the app must not interrupt (an upload in flight). The app's automatic "new website
 * version" reload (lib/native.ts) waits while anything is busy. Dependency-free so it can be
 * imported anywhere, including the browser build, where nothing ever reads it.
 *
 * From Akash's iPhone work on feat/ios-android-app-split (#268), 2026-11-20.
 */
let busy = 0;

/** Run `task` and count it as busy until it settles (success or failure). */
export async function whileBusy<T>(task: () => Promise<T>): Promise<T> {
  busy += 1;
  try {
    return await task();
  } finally {
    busy -= 1;
  }
}

/** True while at least one protected task is running. */
export const isBusy = (): boolean => busy > 0;
