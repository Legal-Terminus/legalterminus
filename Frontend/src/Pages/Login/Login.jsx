import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { saveUserProfile, getUserProfile, clearUserProfile } from "../../utils/userProfile";
import "./Login.css";

const STATES = [
  "Andhra Pradesh", "Arunachal Pradesh", "Assam", "Bihar", "Chhattisgarh",
  "Goa", "Gujarat", "Haryana", "Himachal Pradesh", "Jharkhand", "Karnataka",
  "Kerala", "Madhya Pradesh", "Maharashtra", "Manipur", "Meghalaya", "Mizoram",
  "Nagaland", "Odisha", "Punjab", "Rajasthan", "Sikkim", "Tamil Nadu",
  "Telangana", "Tripura", "Uttar Pradesh", "Uttarakhand", "West Bengal",
  "Delhi", "Jammu & Kashmir", "Ladakh", "Puducherry", "Chandigarh",
];

const Login = () => {
  const navigate = useNavigate();
  const existing = getUserProfile();

  const [form, setForm] = useState({
    fullName:     existing?.fullName     || "",
    email:        existing?.email        || "",
    mobile:       existing?.mobile       || "",
    state:        existing?.state        || "",
    businessName: existing?.businessName || "",
  });
  const [errors, setErrors]     = useState({});
  const [submitted, setSubmitted] = useState(false);
  const isEditing = !!existing;

  const update = (key, val) => {
    setForm(f => ({ ...f, [key]: val }));
    setErrors(e => ({ ...e, [key]: "" }));
  };

  const validate = () => {
    const e = {};
    if (!form.fullName.trim())
      e.fullName = "Full name is required";
    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(form.email.trim()))
      e.email = "Enter a valid email address";
    if (!/^\d{10}$/.test(form.mobile.trim()))
      e.mobile = "Enter a valid 10-digit mobile number";
    setErrors(e);
    return Object.keys(e).length === 0;
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!validate()) return;
    saveUserProfile(form);          // sets lt_user + lt_logged_in + fires lt-auth-change
    setSubmitted(true);
  };

  const handleLogout = () => {
    clearUserProfile();             // removes keys + fires lt-auth-change
    navigate("/");
  };

  // Redirect after 1.5 s so user sees the success tick
  useEffect(() => {
    if (!submitted) return;
    const t = setTimeout(() => navigate("/"), 1500);
    return () => clearTimeout(t);
  }, [submitted, navigate]);

  return (
    <div className="login-page">
      <div className="login-card">
        <div className="login-brand">
          <div className="login-brand-icon">⚖️</div>
          <h1 className="login-brand-name">Legal Terminus</h1>
        </div>

        {submitted ? (
          <div className="login-success">
            <div className="login-success-icon">✓</div>
            <h2>{isEditing ? "Details updated!" : "Signed in successfully!"}</h2>
            <p>Redirecting you to the home page…</p>
          </div>
        ) : (
          <>
            <h2 className="login-title">{isEditing ? "My Account" : "Sign In"}</h2>
            <p className="login-sub">
              {isEditing
                ? "Your details are saved. Edit below to update them."
                : "Save your details once — they'll auto-fill at checkout every time."}
            </p>

            <form className="login-form" onSubmit={handleSubmit} noValidate>
              <div className="login-field">
                <label className="login-label">Full Name</label>
                <input
                  className={`login-input${errors.fullName ? " error" : ""}`}
                  type="text"
                  placeholder="Enter your full name"
                  value={form.fullName}
                  onChange={e => update("fullName", e.target.value)}
                />
                {errors.fullName && <span className="login-error">{errors.fullName}</span>}
              </div>

              <div className="login-field">
                <label className="login-label">Email Address</label>
                <input
                  className={`login-input${errors.email ? " error" : ""}`}
                  type="email"
                  placeholder="Enter your email"
                  value={form.email}
                  onChange={e => update("email", e.target.value)}
                />
                {errors.email && <span className="login-error">{errors.email}</span>}
              </div>

              <div className="login-field">
                <label className="login-label">Mobile Number</label>
                <input
                  className={`login-input${errors.mobile ? " error" : ""}`}
                  type="tel"
                  placeholder="10-digit mobile number"
                  value={form.mobile}
                  maxLength={10}
                  onChange={e => update("mobile", e.target.value.replace(/\D/g, ""))}
                />
                {errors.mobile && <span className="login-error">{errors.mobile}</span>}
              </div>

              <div className="login-field">
                <label className="login-label">
                  Business Name <span className="login-optional">(Optional)</span>
                </label>
                <input
                  className="login-input"
                  type="text"
                  placeholder="Enter your business name"
                  value={form.businessName}
                  onChange={e => update("businessName", e.target.value)}
                />
              </div>

              <div className="login-field">
                <label className="login-label">
                  State <span className="login-optional">(Optional)</span>
                </label>
                <select
                  className="login-input"
                  value={form.state}
                  onChange={e => update("state", e.target.value)}
                >
                  <option value="">Select State</option>
                  {STATES.map(s => <option key={s} value={s}>{s}</option>)}
                </select>
              </div>

              <button className="login-btn" type="submit">
                {isEditing ? "Update Details" : "Sign In & Save Details"}
              </button>

              {isEditing && (
                <button
                  type="button"
                  className="login-btn-logout"
                  onClick={handleLogout}
                >
                  Sign Out
                </button>
              )}
            </form>
          </>
        )}
      </div>
    </div>
  );
};

export default Login;
