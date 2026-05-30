import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import {
  signInWithEmailAndPassword,
  signInWithPopup,
  GoogleAuthProvider,
  onAuthStateChanged,
} from "firebase/auth";
import { doc, setDoc, getDoc } from "firebase/firestore";
import { getFirebaseAuth, getFirebaseDb } from "../../utils/firebase";
import { saveUserProfile } from "../../utils/userProfile";
import "./Login.css";

const Login = () => {
  const navigate = useNavigate();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const [errors, setErrors] = useState({ email: "", password: "" });
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
    let newErrors = { email: "", password: "" };
    let isValid = true;

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

    setErrors(newErrors);
    return isValid;
  };

  const handleLogin = async (e) => {
    e.preventDefault();

    if (!validateForm()) return;

    setLoading(true);
    const auth = getFirebaseAuth();
    try {
      const userCredential = await signInWithEmailAndPassword(auth, email, password);
      // Ensure user profile exists in Firestore
      const db = getFirebaseDb();
      const userDocRef = doc(db, "users", userCredential.user.uid);
      const userDoc = await getDoc(userDocRef);
      if (!userDoc.exists()) {
        await setDoc(userDocRef, {
          uid: userCredential.user.uid,
          name: userCredential.user.displayName || "User",
          email: userCredential.user.email,
          phone: "",
          address: "",
          avatar: userCredential.user.photoURL || null,
          createdAt: new Date(),
          updatedAt: new Date(),
        });
      }
      const firestoreData = userDoc.exists() ? userDoc.data() : {};
      saveUserProfile({
        fullName: firestoreData.fullName || firestoreData.name || userCredential.user.displayName || "",
        email: userCredential.user.email,
        mobile: firestoreData.mobile || firestoreData.phone || "",
        businessName: firestoreData.businessName || "",
        state: firestoreData.state || "",
      });
      navigate("/my-profile");
    } catch (error) {
      console.error("Login error:", error);
      let errorMsg = "Login failed";

      if (error.code === "auth/user-not-found") {
        errorMsg = "No account found with this email";
        setErrors((prev) => ({ ...prev, email: errorMsg }));
      } else if (error.code === "auth/wrong-password") {
        errorMsg = "Incorrect password";
        setErrors((prev) => ({ ...prev, password: errorMsg }));
      } else if (error.code === "auth/invalid-email") {
        errorMsg = "Invalid email address";
        setErrors((prev) => ({ ...prev, email: errorMsg }));
      } else if (error.code === "auth/too-many-requests") {
        errorMsg = "Too many failed attempts. Please try again later";
        setErrors((prev) => ({ ...prev, email: errorMsg }));
      } else {
        setErrors((prev) => ({ ...prev, email: errorMsg }));
      }
    } finally {
      setLoading(false);
    }
  };

  const handleGoogleLogin = async (e) => {
    e.preventDefault();
    setLoading(true);
    const auth = getFirebaseAuth();
    try {
      const provider = new GoogleAuthProvider();
      const result = await signInWithPopup(auth, provider);
      // Ensure user profile exists in Firestore
      const db = getFirebaseDb();
      const userDocRef = doc(db, "users", result.user.uid);
      const userDoc = await getDoc(userDocRef);
      if (!userDoc.exists()) {
        await setDoc(userDocRef, {
          uid: result.user.uid,
          name: result.user.displayName || "User",
          email: result.user.email,
          phone: "",
          address: "",
          avatar: result.user.photoURL || null,
          createdAt: new Date(),
          updatedAt: new Date(),
        });
      }
      const firestoreData = userDoc.exists() ? userDoc.data() : {};
      saveUserProfile({
        fullName: firestoreData.fullName || firestoreData.name || result.user.displayName || "",
        email: result.user.email,
        mobile: firestoreData.mobile || firestoreData.phone || "",
        businessName: firestoreData.businessName || "",
        state: firestoreData.state || "",
      });
      navigate("/my-profile");
    } catch (error) {
      console.error("Google login error:", error.code, error.message);
      if (error.code === "auth/popup-closed-by-user" || error.code === "auth/cancelled-popup-request") {
        // user closed popup — do nothing
      } else if (error.code === "auth/unauthorized-domain") {
        setErrors((prev) => ({ ...prev, email: "This domain is not authorized in Firebase. Add localhost to Firebase Console → Authentication → Settings → Authorized domains." }));
      } else {
        setErrors((prev) => ({ ...prev, email: `Sign-in failed: ${error.code || error.message}` }));
      }
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="login-container">
      <div className="card">
        {/* LEFT: login form */}
        <div className="form-panel">
          <h1>Welcome Back!</h1>
          <p className="sub">Please enter your details to continue</p>

          <form onSubmit={handleLogin}>
            <button type="button" className="btn-google" onClick={handleGoogleLogin} disabled={loading}>
              <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="currentColor">
                <path d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z" />
                <path d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" />
                <path d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z" />
                <path d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z" />
              </svg>
              Continue with Google
            </button>

            <div className="divider">
              <span>OR</span>
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
                  placeholder="Enter Password"
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

            <div className="row">
              <a href="/forgot-password" className="forgot">
                Forgot Password?
              </a>
            </div>

            <button type="submit" className="btn-login" disabled={loading}>
              {loading ? "Logging in..." : "Login"}
              <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                <line x1="5" y1="12" x2="19" y2="12" />
                <polyline points="12 5 19 12 12 19" />
              </svg>
            </button>

            <p className="signup-row">
              Don't have an account? <a href="/signup">Sign Up</a>
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
              {/* scatter dots */}
              <circle cx="12" cy="20" r="3" fill="rgba(255,255,255,0.35)" />
              <circle cx="178" cy="30" r="2.5" fill="rgba(255,255,255,0.30)" />
              <circle cx="8" cy="110" r="2" fill="rgba(255,255,255,0.25)" />
              <circle cx="170" cy="120" r="2" fill="rgba(255,255,255,0.25)" />
              <circle cx="90" cy="8" r="2" fill="rgba(255,255,255,0.20)" />

              {/* clipboard */}
              <rect x="18" y="28" width="82" height="106" rx="10" fill="rgba(255,255,255,0.18)" stroke="rgba(255,255,255,0.50)" strokeWidth="1.8" />
              <rect x="44" y="20" width="30" height="16" rx="8" fill="rgba(255,255,255,0.45)" />
              <rect x="50" y="24" width="18" height="8" rx="4" fill="rgba(255,255,255,0.20)" />
              <rect x="30" y="52" width="58" height="8" rx="4" fill="rgba(255,255,255,0.35)" />
              <rect x="30" y="68" width="58" height="8" rx="4" fill="rgba(255,255,255,0.55)" stroke="rgba(255,255,255,0.80)" strokeWidth="1" />
              <rect x="35" y="71" width="28" height="2" rx="1" fill="rgba(22,101,52,0.30)" />
              <rect x="30" y="84" width="58" height="8" rx="4" fill="rgba(255,255,255,0.35)" />
              <rect x="30" y="100" width="38" height="13" rx="6" fill="rgba(255,255,255,0.60)" />
              <rect x="37" y="104" width="24" height="5" rx="2.5" fill="rgba(22,101,52,0.35)" />

              {/* checkmark badge */}
              <circle cx="158" cy="32" r="20" fill="rgba(255,255,255,0.22)" stroke="rgba(255,255,255,0.50)" strokeWidth="1.5" />
              <circle cx="158" cy="32" r="14" fill="rgba(255,255,255,0.30)" />
              <polyline points="149,32 155,39 168,24" stroke="rgba(255,255,255,0.95)" strokeWidth="3" fill="none" strokeLinecap="round" strokeLinejoin="round" />

              {/* person */}
              <circle cx="148" cy="72" r="14" fill="rgba(255,255,255,0.65)" />
              <path d="M135 70 Q137 57 148 58 Q159 57 161 70" fill="rgba(255,255,255,0.38)" />
              <circle cx="143" cy="71" r="2" fill="rgba(22,101,52,0.55)" />
              <circle cx="153" cy="71" r="2" fill="rgba(22,101,52,0.55)" />
              <path d="M143 77 Q148 82 153 77" stroke="rgba(22,101,52,0.50)" strokeWidth="1.6" fill="none" strokeLinecap="round" />
              <rect x="144" y="85" width="8" height="8" rx="3" fill="rgba(255,255,255,0.55)" />
              <rect x="132" y="93" width="32" height="34" rx="8" fill="rgba(255,255,255,0.38)" />
              <path d="M132 100 Q110 102 100 98" stroke="rgba(255,255,255,0.70)" strokeWidth="7" strokeLinecap="round" fill="none" />
              <circle cx="97" cy="97" r="5" fill="rgba(255,255,255,0.60)" />
              <path d="M164 100 Q170 110 168 122" stroke="rgba(255,255,255,0.60)" strokeWidth="7" strokeLinecap="round" fill="none" />
              <path d="M140 127 Q139 138 138 146" stroke="rgba(255,255,255,0.55)" strokeWidth="8" strokeLinecap="round" />
              <path d="M156 127 Q157 138 158 146" stroke="rgba(255,255,255,0.55)" strokeWidth="8" strokeLinecap="round" />
              <ellipse cx="137" cy="147" rx="8" ry="4" fill="rgba(255,255,255,0.35)" />
              <ellipse cx="159" cy="147" rx="8" ry="4" fill="rgba(255,255,255,0.35)" />
            </svg>

            <h2>Trusted Legal Services at Your Fingertips</h2>
            <p>Instant registrations, filings &amp; compliance — trusted by thousands of businesses across India.</p>
          </div>

          <div className="dots">
            <div className="dot active"></div>
            <div className="dot"></div>
            <div className="dot"></div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Login;
