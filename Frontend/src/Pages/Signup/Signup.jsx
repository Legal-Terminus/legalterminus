import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import {
  createUserWithEmailAndPassword,
  signInWithPopup,
  GoogleAuthProvider,
  onAuthStateChanged,
} from "firebase/auth";
import { getFirebaseAuth } from "../../utils/firebase";
import { registerUser } from "../../utils/registerUser";
import "./Signup.css";

const Signup = () => {
  const navigate = useNavigate();
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const [errors, setErrors] = useState({ name: "", email: "", password: "", confirmPassword: "" });
  useEffect(() => {
    const auth = getFirebaseAuth();
    const unsubscribe = onAuthStateChanged(auth, (user) => {
      if (user) navigate("/my-profile");
    });
    return () => unsubscribe();
  }, [navigate]);

  const clearFieldErr = (field) => {
    setErrors((prev) => ({ ...prev, [field]: "" }));
  };

  const validateForm = () => {
    let newErrors = { name: "", email: "", password: "", confirmPassword: "" };
    let isValid = true;

    if (!name.trim()) {
      newErrors.name = "Full name is required";
      isValid = false;
    } else if (name.trim().length < 2) {
      newErrors.name = "Name must be at least 2 characters";
      isValid = false;
    }

    if (!email.trim()) {
      newErrors.email = "Email is required";
      isValid = false;
    } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
      newErrors.email = "Please enter a valid email";
      isValid = false;
    }

    if (!password) {
      newErrors.password = "Password is required";
      isValid = false;
    } else if (password.length < 6) {
      newErrors.password = "Password must be at least 6 characters";
      isValid = false;
    }

    if (!confirmPassword) {
      newErrors.confirmPassword = "Please confirm your password";
      isValid = false;
    } else if (password !== confirmPassword) {
      newErrors.confirmPassword = "Passwords do not match";
      isValid = false;
    }

    setErrors(newErrors);
    return isValid;
  };

  // Create/sync the Firestore user doc via the backend so it goes through the
  // unified upsertUser chokepoint (ISO createdAt, normalized fields, role logic).
  const createUserProfile = async (user, provider = "email") => {
    await registerUser(user, {
      provider,
      fullName: name || user.displayName || "User",
    });
  };

  const handleSignup = async (e) => {
    e.preventDefault();

    if (!validateForm()) return;

    setLoading(true);
    const auth = getFirebaseAuth();
    try {
      const userCredential = await createUserWithEmailAndPassword(auth, email, password);
      await createUserProfile(userCredential.user);
      navigate("/login");
    } catch (error) {
      console.error("Signup error:", error);
      let errorMsg = "Signup failed";

      if (error.code === "auth/email-already-in-use") {
        errorMsg = "Email already in use";
        setErrors((prev) => ({ ...prev, email: errorMsg }));
      } else if (error.code === "auth/invalid-email") {
        errorMsg = "Invalid email address";
        setErrors((prev) => ({ ...prev, email: errorMsg }));
      } else if (error.code === "auth/weak-password") {
        errorMsg = "Password is too weak";
        setErrors((prev) => ({ ...prev, password: errorMsg }));
      } else {
        setErrors((prev) => ({ ...prev, email: errorMsg }));
      }
    } finally {
      setLoading(false);
    }
  };

  const handleGoogleSignup = async (e) => {
    e.preventDefault();
    setLoading(true);
    const auth = getFirebaseAuth();
    try {
      const provider = new GoogleAuthProvider();
      const result = await signInWithPopup(auth, provider);
      await createUserProfile(result.user, "google");
      navigate("/my-profile");
    } catch (error) {
      console.error("Google signup error:", error);
      if (error.code !== "auth/popup-closed-by-user") {
        setErrors((prev) => ({ ...prev, email: "Google signup failed" }));
      }
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="signup-container">
      <div className="card">
        {/* LEFT: signup form */}
        <div className="form-panel">
          <h1>Create Account</h1>
          <p className="sub">Sign up to access your profile and manage your services</p>

          <form onSubmit={handleSignup}>
            <div className="field">
              <label htmlFor="name">Full Name</label>
              <input
                type="text"
                id="name"
                placeholder="Enter Your Full Name"
                value={name}
                onChange={(e) => setName(e.target.value)}
                onInput={() => clearFieldErr("name")}
                className={errors.name ? "input-err" : ""}
              />
              {errors.name && (
                <div className="field-err-msg show">
                  <svg xmlns="http://www.w3.org/2000/svg" width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                    <circle cx="12" cy="12" r="10" />
                    <line x1="12" y1="8" x2="12" y2="12" />
                    <line x1="12" y1="16" x2="12.01" y2="16" />
                  </svg>
                  <span>{errors.name}</span>
                </div>
              )}
            </div>

            <div className="field">
              <label htmlFor="email">Email Address</label>
              <input
                type="email"
                id="email"
                placeholder="Enter Your Email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                onInput={() => clearFieldErr("email")}
                className={errors.email ? "input-err" : ""}
              />
              {errors.email && (
                <div className="field-err-msg show">
                  <svg xmlns="http://www.w3.org/2000/svg" width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                    <circle cx="12" cy="12" r="10" />
                    <line x1="12" y1="8" x2="12" y2="12" />
                    <line x1="12" y1="16" x2="12.01" y2="16" />
                  </svg>
                  <span>{errors.email}</span>
                </div>
              )}
            </div>

            <div className="field">
              <label htmlFor="password">Password</label>
              <div className="pw-wrap">
                <input
                  type={showPassword ? "text" : "password"}
                  id="password"
                  placeholder="Enter Password (min 6 chars)"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  onInput={() => clearFieldErr("password")}
                  className={errors.password ? "input-err" : ""}
                />
                <button
                  type="button"
                  className="eye-btn"
                  onClick={() => setShowPassword(!showPassword)}
                  aria-label="Toggle password visibility"
                >
                  {showPassword ? (
                    <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                      <path d="M17.94 17.94A10.07 10.07 0 0 1 12 20c-7 0-11-8-11-8a18.45 18.45 0 0 1 5.06-5.94" />
                      <path d="M9.9 4.24A9.12 9.12 0 0 1 12 4c7 0 11 8 11 8a18.5 18.5 0 0 1-2.16 3.19" />
                      <line x1="1" y1="1" x2="23" y2="23" />
                    </svg>
                  ) : (
                    <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                      <path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z" />
                      <circle cx="12" cy="12" r="3" />
                    </svg>
                  )}
                </button>
              </div>
              {errors.password && (
                <div className="field-err-msg show">
                  <svg xmlns="http://www.w3.org/2000/svg" width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                    <circle cx="12" cy="12" r="10" />
                    <line x1="12" y1="8" x2="12" y2="12" />
                    <line x1="12" y1="16" x2="12.01" y2="16" />
                  </svg>
                  <span>{errors.password}</span>
                </div>
              )}
            </div>

            <div className="field">
              <label htmlFor="confirmPassword">Confirm Password</label>
              <div className="pw-wrap">
                <input
                  type={showConfirmPassword ? "text" : "password"}
                  id="confirmPassword"
                  placeholder="Confirm Your Password"
                  value={confirmPassword}
                  onChange={(e) => setConfirmPassword(e.target.value)}
                  onInput={() => clearFieldErr("confirmPassword")}
                  className={errors.confirmPassword ? "input-err" : ""}
                />
                <button
                  type="button"
                  className="eye-btn"
                  onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                  aria-label="Toggle confirm password visibility"
                >
                  {showConfirmPassword ? (
                    <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                      <path d="M17.94 17.94A10.07 10.07 0 0 1 12 20c-7 0-11-8-11-8a18.45 18.45 0 0 1 5.06-5.94" />
                      <path d="M9.9 4.24A9.12 9.12 0 0 1 12 4c7 0 11 8 11 8a18.5 18.5 0 0 1-2.16 3.19" />
                      <line x1="1" y1="1" x2="23" y2="23" />
                    </svg>
                  ) : (
                    <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                      <path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z" />
                      <circle cx="12" cy="12" r="3" />
                    </svg>
                  )}
                </button>
              </div>
              {errors.confirmPassword && (
                <div className="field-err-msg show">
                  <svg xmlns="http://www.w3.org/2000/svg" width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                    <circle cx="12" cy="12" r="10" />
                    <line x1="12" y1="8" x2="12" y2="12" />
                    <line x1="12" y1="16" x2="12.01" y2="16" />
                  </svg>
                  <span>{errors.confirmPassword}</span>
                </div>
              )}
            </div>

            <button type="submit" className="btn-signup" disabled={loading}>
              {loading ? "Creating Account..." : "Sign Up"}
              <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                <line x1="5" y1="12" x2="19" y2="12" />
                <polyline points="12 5 19 12 12 19" />
              </svg>
            </button>

            <div className="divider">
              <span>OR</span>
            </div>

            <button type="button" className="btn-google" onClick={handleGoogleSignup} disabled={loading}>
              <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="currentColor">
                <path d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z" />
                <path d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" />
                <path d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z" />
                <path d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z" />
              </svg>
              Continue with Google
            </button>

            <p className="login-row">
              Already have an account? <a href="/login">Log In</a>
            </p>
          </form>
        </div>

        {/* RIGHT: brand panel */}
        <div className="brand-panel">
          {/* animated logo */}
          <div className="logo-area">
            <img
              className="logo-gif"
              src="/logo-animated.gif"
              onError={(e) => (e.target.src = "https://legalterminus.com/wp-content/uploads/2023/09/Legal-Terminus-LOGO-GIF_300-x-150.gif")}
              alt="Legal Terminus"
            />
          </div>

          {/* illustration card */}
          <div className="illus-card">
            <svg xmlns="http://www.w3.org/2000/svg" width="190" height="150" viewBox="0 0 190 150">
              {/* rocket ship illustration */}
              <g transform="translate(95, 75)">
                <circle cx="0" cy="0" r="40" fill="rgba(255,255,255,0.10)" stroke="rgba(255,255,255,0.30)" strokeWidth="1.5" />
                {/* rocket body */}
                <rect x="-12" y="-35" width="24" height="50" rx="6" fill="rgba(255,255,255,0.25)" stroke="rgba(255,255,255,0.50)" strokeWidth="1" />
                {/* window */}
                <circle cx="0" cy="-20" r="5" fill="rgba(22,101,52,0.40)" />
                {/* fins */}
                <path d="M-12 5 L-25 25 L-15 10 Z" fill="rgba(255,255,255,0.20)" />
                <path d="M12 5 L25 25 L15 10 Z" fill="rgba(255,255,255,0.20)" />
                {/* flame */}
                <path d="M-8 15 L0 35 L8 15 Q0 25 -8 15" fill="rgba(255,200,100,0.30)" />
              </g>

              {/* stars */}
              <circle cx="20" cy="15" r="2" fill="rgba(255,255,255,0.40)" />
              <circle cx="160" cy="25" r="2.5" fill="rgba(255,255,255,0.35)" />
              <circle cx="15" cy="120" r="1.5" fill="rgba(255,255,255,0.30)" />
              <circle cx="170" cy="110" r="1.5" fill="rgba(255,255,255,0.30)" />
            </svg>

            <h2>Welcome to Legal Terminus</h2>
            <p>Join thousands of businesses using our trusted legal services for registrations, filings, and compliance.</p>
          </div>

          <div className="dots">
            <div className="dot"></div>
            <div className="dot active"></div>
            <div className="dot"></div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Signup;
