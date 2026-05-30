import express from "express";

const router = express.Router();

/**
 * GET /api/auth/firebase-config
 * Returns Firebase configuration for client-side initialization
 * Public endpoint (no authentication required)
 */
router.get("/firebase-config", (req, res) => {
  try {
    const firebaseConfig = {
      apiKey: process.env.VITE_FIREBASE_API_KEY,
      authDomain: process.env.VITE_FIREBASE_AUTH_DOMAIN,
      projectId: process.env.VITE_FIREBASE_PROJECT_ID,
      storageBucket: process.env.VITE_FIREBASE_STORAGE_BUCKET,
      messagingSenderId: process.env.VITE_FIREBASE_MESSAGING_SENDER_ID,
      appId: process.env.VITE_FIREBASE_APP_ID,
      measurementId: process.env.VITE_FIREBASE_MEASUREMENT_ID,
    };

    // Validate that all required config values exist
    const requiredFields = [
      "apiKey",
      "authDomain",
      "projectId",
      "storageBucket",
      "messagingSenderId",
      "appId",
    ];

    const missingFields = requiredFields.filter((field) => !firebaseConfig[field]);

    if (missingFields.length > 0) {
      return res.status(500).json({
        success: false,
        error: "Missing Firebase configuration",
        missingFields,
      });
    }

    res.json({
      success: true,
      config: firebaseConfig,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      error: error.message,
    });
  }
});

export default router;
