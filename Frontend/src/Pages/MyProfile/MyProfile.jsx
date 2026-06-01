import React, { useEffect, useState } from "react";
import { onAuthStateChanged, signOut } from "firebase/auth";
import { doc, getDoc, updateDoc } from "firebase/firestore";
import { useNavigate } from "react-router-dom";
import { getFirebaseAuth, getFirebaseDb } from "../../utils/firebase";
import "./MyProfile.css";

export default function MyProfile() {
  const navigate = useNavigate();
  const [user, setUser] = useState(null);
  const [profile, setProfile] = useState(null);
  const [loading, setLoading] = useState(true);
  const [editing, setEditing] = useState(false);
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    phone: "",
    address: "",
  });
  const [message, setMessage] = useState("");

  useEffect(() => {
    const auth = getFirebaseAuth();
    const db = getFirebaseDb();
    const unsubscribe = onAuthStateChanged(auth, async (currentUser) => {
          if (currentUser) {
            setUser(currentUser);

            // Fetch user profile from Firestore
            try {
              const userDocRef = doc(db, "users", currentUser.uid);
              const userDocSnap = await getDoc(userDocRef);

              if (userDocSnap.exists()) {
                const userData = userDocSnap.data();
                setProfile(userData);
                setFormData({
                  name: userData.name || "",
                  email: userData.email || currentUser.email,
                  phone: userData.phone || "",
                  address: userData.address || "",
                });
              } else {
                // Create default profile if doesn't exist
                setProfile({
                  name: currentUser.displayName || "",
                  email: currentUser.email,
                  phone: "",
                  address: "",
                });
                setFormData({
                  name: currentUser.displayName || "",
                  email: currentUser.email,
                  phone: "",
                  address: "",
                });
              }
            } catch (error) {
              console.error("Error fetching profile:", error);
              setProfile({
                name: currentUser.displayName || "",
                email: currentUser.email,
              });
            }
          } else {
            navigate("/login");
          }
          setLoading(false);
        });
    return () => unsubscribe();
  }, [navigate]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleSave = async () => {
    try {
      const auth = getFirebaseAuth();
      const db = getFirebaseDb();

      if (auth.currentUser) {
        const userDocRef = doc(db, "users", auth.currentUser.uid);
        await updateDoc(userDocRef, {
          name: formData.name,
          phone: formData.phone,
          address: formData.address,
          updatedAt: new Date(),
        });

        setProfile(formData);
        setEditing(false);
        setMessage("✅ Profile updated successfully!");
        setTimeout(() => setMessage(""), 3000);
      }
    } catch (error) {
      console.error("Error saving profile:", error);
      setMessage("❌ Error updating profile");
      setTimeout(() => setMessage(""), 3000);
    }
  };

  const handleLogout = async () => {
    try {
      const auth = getFirebaseAuth();
      await signOut(auth);
      localStorage.clear();
      navigate("/");
    } catch (error) {
      console.error("Error logging out:", error);
    }
  };

  if (loading) {
    return (
      <div className="mp-loading">
        <div className="mp-spinner"></div>
        <p>Loading profile...</p>
      </div>
    );
  }

  return (
    <div className="mp-page">
      <div className="mp-container">

        {/* ── Profile card ── */}
        <div className="mp-card">
          {/* card header */}
          <div className="mp-card-header">
            <div className="mp-avatar">{user?.email?.[0]?.toUpperCase()}</div>
            <div className="mp-header-info">
              <h1>My Profile</h1>
              <p>{user?.email}</p>
            </div>
            <button className="mp-btn-logout" onClick={handleLogout}>
              <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                <path d="M9 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h4"/><polyline points="16 17 21 12 16 7"/><line x1="21" y1="12" x2="9" y2="12"/>
              </svg>
              Logout
            </button>
          </div>

          {/* success/error message */}
          {message && (
            <div className={`mp-message ${message.startsWith("✅") ? "mp-message--success" : "mp-message--error"}`}>
              {message}
            </div>
          )}

          {/* fields */}
          <div className="mp-fields">
            <div className="mp-field">
              <label>Full Name</label>
              {editing ? (
                <input type="text" name="name" value={formData.name} onChange={handleChange} placeholder="Enter your name" />
              ) : (
                <p className="mp-value">{formData.name || <span className="mp-empty">Not provided</span>}</p>
              )}
            </div>

            <div className="mp-field">
              <label>Email Address</label>
              <p className="mp-value">{formData.email}</p>
              <span className="mp-hint">Email cannot be changed</span>
            </div>

            <div className="mp-field">
              <label>Phone Number</label>
              {editing ? (
                <input type="tel" name="phone" value={formData.phone} onChange={handleChange} placeholder="Enter your phone number" />
              ) : (
                <p className="mp-value">{formData.phone || <span className="mp-empty">Not provided</span>}</p>
              )}
            </div>

            <div className="mp-field">
              <label>Address</label>
              {editing ? (
                <textarea name="address" value={formData.address} onChange={handleChange} rows="3" placeholder="Enter your address" />
              ) : (
                <p className="mp-value">{formData.address || <span className="mp-empty">Not provided</span>}</p>
              )}
            </div>
          </div>

          {/* action buttons */}
          <div className="mp-actions">
            {!editing ? (
              <button className="mp-btn-primary" onClick={() => setEditing(true)}>
                <svg xmlns="http://www.w3.org/2000/svg" width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                  <path d="M11 4H4a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2v-7"/><path d="M18.5 2.5a2.121 2.121 0 0 1 3 3L12 15l-4 1 1-4 9.5-9.5z"/>
                </svg>
                Edit Profile
              </button>
            ) : (
              <>
                <button className="mp-btn-primary" onClick={handleSave}>Save Changes</button>
                <button className="mp-btn-secondary" onClick={() => { setEditing(false); setFormData({ name: profile?.name || "", email: profile?.email || "", phone: profile?.phone || "", address: profile?.address || "" }); }}>Cancel</button>
              </>
            )}
          </div>
        </div>

        {/* Portal Access Card - Admin Only */}
        {profile?.role === 'admin' && (
          <div className="mp-card">
            <div className="mp-card-header" style={{ backgroundColor: '#3b82f6', borderRadius: '20px 20px 0 0' }}>
              <div className="mp-avatar" style={{ background: 'rgba(255, 255, 255, 0.3)' }}>
                <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="white" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                  <rect x="3" y="3" width="7" height="7"/><rect x="14" y="3" width="7" height="7"/><rect x="14" y="14" width="7" height="7"/><rect x="3" y="14" width="7" height="7"/>
                </svg>
              </div>
              <div className="mp-header-info" style={{ color: 'white' }}>
                <h1>Admin Portal</h1>
                <p>Manage users, clients, and tasks</p>
              </div>
            </div>
            <div style={{ padding: '32px 40px' }}>
              <p style={{ fontSize: '14px', color: '#6b7280', marginBottom: '20px' }}>
                Access the admin dashboard to manage team members, clients, and service configurations.
              </p>
              <a 
                href="/portal" 
                className="mp-btn-primary" 
                style={{ display: 'inline-block', textDecoration: 'none', color: 'white', backgroundColor: '#3b82f6' }}
              >
                <svg xmlns="http://www.w3.org/2000/svg" width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" style={{ marginRight: '8px', verticalAlign: 'middle' }}>
                  <path d="M18 13v6a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V8a2 2 0 0 1 2-2h6"/><polyline points="15 3 21 3 21 9"/><line x1="10" y1="14" x2="21" y2="3"/>
                </svg>
                Open Portal
              </a>
            </div>
          </div>
        )}

      </div>
    </div>
  );
}
