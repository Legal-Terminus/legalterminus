import React, { useEffect, useState } from "react";
import { Navigate } from "react-router-dom";
import { initializeApp } from "firebase/app";
import { getAuth, onAuthStateChanged } from "firebase/auth";

/**
 * ProtectedRoute Component
 * Redirects unauthenticated users to login page
 * Shows loading state while checking auth
 */
export default function ProtectedRoute({ children }) {
  const [isAuthenticated, setIsAuthenticated] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    try {
      const firebaseConfig = {
        apiKey: import.meta.env.VITE_FIREBASE_API_KEY,
        authDomain: import.meta.env.VITE_FIREBASE_AUTH_DOMAIN,
        projectId: import.meta.env.VITE_FIREBASE_PROJECT_ID,
        storageBucket: import.meta.env.VITE_FIREBASE_STORAGE_BUCKET,
        messagingSenderId: import.meta.env.VITE_FIREBASE_MESSAGING_SENDER_ID,
        appId: import.meta.env.VITE_FIREBASE_APP_ID,
      };

      if (!firebaseConfig.apiKey) {
        console.warn("Firebase config missing");
        setIsAuthenticated(false);
        setLoading(false);
        return;
      }

      const app = initializeApp(firebaseConfig);
      const auth = getAuth(app);

      const unsubscribe = onAuthStateChanged(auth, (user) => {
        setIsAuthenticated(!!user);
        setLoading(false);
      });

      return () => unsubscribe();
    } catch (error) {
      console.error("Auth check error:", error);
      setIsAuthenticated(false);
      setLoading(false);
    }
  }, []);

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto mb-4"></div>
          <p className="text-gray-600">Loading...</p>
        </div>
      </div>
    );
  }

  if (!isAuthenticated) {
    return <Navigate to="/login" replace />;
  }

  return children;
}
