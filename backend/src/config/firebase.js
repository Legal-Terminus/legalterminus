import admin from "firebase-admin";
import dotenv from "dotenv";
import path from "path";
import { fileURLToPath } from "url";
import { logger } from "./logger.js";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

dotenv.config({ path: path.join(__dirname, "../../.env.qa") });
dotenv.config({ path: path.join(__dirname, "../../.env") });

/**
 * Initialize Firebase Admin SDK
 * Uses FIREBASE_* environment variables from .env.qa
 */
const initializeFirebase = () => {
  if (admin.apps.length === 0) {
    const serviceAccount = {
      type: "service_account",
      project_id: process.env.FIREBASE_PROJECT_ID,
      private_key_id: process.env.FIREBASE_PRIVATE_KEY_ID,
      private_key: process.env.FIREBASE_PRIVATE_KEY
        ? process.env.FIREBASE_PRIVATE_KEY.replace(/\\n/g, "\n")
        : undefined,
      client_email: process.env.FIREBASE_CLIENT_EMAIL,
      client_id: process.env.FIREBASE_CLIENT_ID,
      auth_uri: "https://accounts.google.com/o/oauth2/auth",
      token_uri: "https://oauth2.googleapis.com/token",
      auth_provider_x509_cert_url:
        "https://www.googleapis.com/oauth2/v1/certs",
      client_x509_cert_url: process.env.FIREBASE_CLIENT_CERT_URL,
    };

    admin.initializeApp({
      credential: admin.credential.cert(serviceAccount),
      projectId: process.env.FIREBASE_PROJECT_ID,
    });

    logger.info("✅ Firebase Admin SDK initialized");
  }
};

/**
 * Get Firestore database instance (memoized — admin.firestore() is created once).
 */
let _firestore;
export const getDb = () => {
  if (!_firestore) {
    initializeFirebase();
    _firestore = admin.firestore();
  }
  return _firestore;
};

// Lazy Firestore handle: behaves like a Firestore instance for existing callers
// (`db.collection(...)`), but initialization is deferred until first use instead
// of running as an import-time side-effect. This avoids crashing at import if env
// vars aren't loaded yet, and keeps the module importable in tests. Bound methods
// are cached so repeated `db.collection(...)` access doesn't re-bind each time.
const _boundCache = new Map();
export const db = new Proxy(
  {},
  {
    get(_target, prop) {
      const instance = getDb();
      const value = instance[prop];
      if (typeof value !== "function") return value;
      if (!_boundCache.has(prop)) _boundCache.set(prop, value.bind(instance));
      return _boundCache.get(prop);
    },
  }
);

/**
 * Get Firebase Auth instance
 */
export const getAuth = () => {
  initializeFirebase();
  return admin.auth();
};

export { admin };
export default initializeFirebase;
