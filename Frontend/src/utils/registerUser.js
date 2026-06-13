/**
 * registerUser.js
 *
 * Single entry point for creating/syncing the logged-in user's Firestore
 * `users` document. Calls the backend `POST /api/auth/register`, which routes
 * through the unified `upsertUser` service so that:
 *   - `createdAt` is written as an ISO string (consistent with the portal),
 *   - `name`/`phone` are normalized (no fullName/mobile drift),
 *   - role is assigned correctly (new self-signups default to 'client',
 *     admin-created users keep their assigned role).
 *
 * This replaces direct client-SDK `setDoc(doc(db,'users',uid), {...})` writes,
 * which bypassed the backend chokepoint and produced field/type drift.
 *
 * Usage (after a successful Firebase sign-in/sign-up):
 *   await registerUser(firebaseUser, { provider: 'google', fullName });
 */
import { getAuth } from "firebase/auth";

const API_BASE = import.meta.env.VITE_API_BASE_URL ?? "";

/**
 * @param {import('firebase/auth').User} user  the signed-in Firebase user
 * @param {{ provider?: 'google'|'email', fullName?: string, mobile?: string,
 *           businessName?: string, state?: string }} [profile]
 * @returns {Promise<object|null>} the backend user payload, or null on failure
 */
export async function registerUser(user, profile = {}) {
  try {
    const current = user ?? getAuth().currentUser;
    if (!current) return null;

    const idToken = await current.getIdToken();
    const res = await fetch(`${API_BASE}/api/auth/register`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${idToken}`,
      },
      body: JSON.stringify({
        provider: profile.provider ?? "email",
        fullName: profile.fullName ?? current.displayName ?? "",
        mobile: profile.mobile ?? "",
        businessName: profile.businessName ?? "",
        state: profile.state ?? "",
      }),
    });

    if (!res.ok) {
      const err = await res.json().catch(() => ({}));
      console.error("registerUser: backend register failed", err);
      return null;
    }

    const data = await res.json();
    return data?.user ?? null;
  } catch (error) {
    console.error("registerUser: error calling /api/auth/register", error);
    return null;
  }
}
