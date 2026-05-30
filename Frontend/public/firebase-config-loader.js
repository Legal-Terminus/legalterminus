/**
 * Firebase Config Loader
 * Fetches Firebase configuration from backend API
 * Usage: <script src="/firebase-config-loader.js"></script>
 */

let firebaseConfig = null;
let firebaseInitialized = false;

/**
 * Load Firebase config from backend and initialize Firebase
 * Returns a promise that resolves when Firebase is ready
 */
function loadFirebaseConfig() {
  return new Promise((resolve, reject) => {
    // Check if already loaded
    if (firebaseInitialized) {
      resolve(firebaseConfig);
      return;
    }

    // Fetch config from backend
    fetch("/api/auth/firebase-config")
      .then((response) => {
        if (!response.ok) {
          throw new Error(`HTTP error! status: ${response.status}`);
        }
        return response.json();
      })
      .then((data) => {
        if (!data.success) {
          throw new Error(data.error || "Failed to load Firebase config");
        }

        firebaseConfig = data.config;
        firebaseInitialized = true;

        // Initialize Firebase if not already initialized
        if (!firebase.apps.length) {
          firebase.initializeApp(firebaseConfig);
        }

        resolve(firebaseConfig);
      })
      .catch((error) => {
        console.error("Error loading Firebase config:", error);
        reject(error);
      });
  });
}

/**
 * Helper function to wait for Firebase to be initialized
 * Usage: await ensureFirebaseReady();
 */
function ensureFirebaseReady() {
  if (firebaseInitialized) {
    return Promise.resolve();
  }
  return loadFirebaseConfig().then(() => {});
}
