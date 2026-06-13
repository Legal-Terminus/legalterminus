import React, { useEffect } from "react";
import "./MyProfile.css";

/**
 * /my-profile is now a thin REDIRECT into the Portal.
 *
 * Profile and Orders have moved to the Portal (role-neutral /portal/profile and
 * /portal/orders) so account management lives in one place — the Portal — instead
 * of being duplicated on the marketing site. This route is wrapped in
 * <ProtectedRoute>, so unauthenticated users are already sent to /login; an
 * authenticated user landing here is forwarded straight into the Portal.
 *
 * We use a full-page navigation (not react-router) because the Portal is a
 * separate app served under /portal/, not a route within this SPA.
 */
export default function MyProfile() {
  useEffect(() => {
    window.location.replace("/portal/profile");
  }, []);

  return (
    <div className="mp-loading">
      <div className="mp-spinner"></div>
      <p>Taking you to your portal…</p>
    </div>
  );
}
