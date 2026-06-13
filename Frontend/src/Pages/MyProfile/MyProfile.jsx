import React, { useEffect } from "react";
import "./MyProfile.css";

/**
 * /my-profile is now a thin REDIRECT into the Portal.
 *
 * Account management lives in the Portal, so the marketing-site "My Portal" entry
 * forwards an authenticated user straight to the Portal dashboard. This route is
 * wrapped in <ProtectedRoute>, so unauthenticated users are already sent to /login.
 *
 * We use a full-page navigation (not react-router) because the Portal is a
 * separate app served under /portal/, not a route within this SPA.
 */
export default function MyProfile() {
  useEffect(() => {
    window.location.replace("/portal/dashboard");
  }, []);

  return (
    <div className="mp-loading">
      <div className="mp-spinner"></div>
      <p>Taking you to your portal…</p>
    </div>
  );
}
