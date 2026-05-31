import admin from "firebase-admin";
import dotenv from "dotenv";
import path from "path";
import { fileURLToPath } from "url";

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

    console.log("✅ Firebase Admin SDK initialized");
  }
};

/**
 * Get Firestore database instance
 */
export const getDb = () => {
  initializeFirebase();
  return admin.firestore();
};

// Export db singleton for convenience
export const db = (() => {
  initializeFirebase();
  return admin.firestore();
})();

/**
 * Get Firebase Auth instance
 */
export const getAuth = () => {
  initializeFirebase();
  return admin.auth();
};

export default initializeFirebase;
