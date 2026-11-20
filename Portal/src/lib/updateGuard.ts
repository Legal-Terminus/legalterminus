/**
 * Marks work the app must not interrupt (an upload in flight). The app's automatic
 * "new website version" refresh (lib/native.ts) waits while anything is busy.
 * Dependency-free so it can be imported anywhere.
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
