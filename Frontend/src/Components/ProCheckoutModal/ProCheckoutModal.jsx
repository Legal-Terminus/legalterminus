import React, { useState, useEffect, useRef, useCallback } from "react";
import {
  getAuth,
  signInWithEmailAndPassword,
  createUserWithEmailAndPassword,
  signInWithPopup,
  GoogleAuthProvider,
} from "firebase/auth";
import { getFirestore, doc, setDoc, getDoc } from "firebase/firestore";
import { getUserProfile, saveUserProfile } from "../../utils/userProfile.js";
import { getServiceDisplayName } from "../../utils/serviceConfig.js";
import "./ProCheckoutModal.css";

const STATES = [
  "Andhra Pradesh", "Arunachal Pradesh", "Assam", "Bihar", "Chhattisgarh",
  "Goa", "Gujarat", "Haryana", "Himachal Pradesh", "Jharkhand", "Karnataka",
  "Kerala", "Madhya Pradesh", "Maharashtra", "Manipur", "Meghalaya", "Mizoram",
  "Nagaland", "Odisha", "Punjab", "Rajasthan", "Sikkim", "Tamil Nadu",
  "Telangana", "Tripura", "Uttar Pradesh", "Uttarakhand", "West Bengal",
  "Delhi", "Jammu & Kashmir", "Ladakh", "Puducherry", "Chandigarh",
];

// Maps every possible failure code → what the user sees
const FAILURE_REASONS = {
  cancelled: {
    icon: "↩",
    colour: "#f57c00",
    title: "Payment Cancelled",
    message: "You cancelled the payment before it was completed.",
    tip: "No money has been deducted. Click \"Go Back\" to choose a payment method and try again.",
    tryLabel: "Go Back to Payment",
  },
  wrong_upi: {
    icon: "📲",
    colour: "#e53935",
    title: "Invalid UPI ID",
    message: "The UPI ID or VPA you entered could not be found.",
    tip: "Double-check the UPI ID and make sure it is active (e.g. yourname@upi).",
    tryLabel: "Try Again",
  },
  card_auth_failed: {
    icon: "💳",
    colour: "#e53935",
    title: "Card Authentication Failed",
    message: "We could not verify your card details. OTP may have expired or was entered incorrectly.",
    tip: "Re-enter your card details carefully and make sure to approve the OTP within 5 minutes.",
    tryLabel: "Try Again",
  },
  insufficient_balance: {
    icon: "💰",
    colour: "#e53935",
    title: "Insufficient Balance",
    message: "Your account does not have enough balance to complete this transaction.",
    tip: "Add funds to your account or choose a different payment method.",
    tryLabel: "Try Another Method",
  },
  bank_declined: {
    icon: "🏦",
    colour: "#e53935",
    title: "Transaction Declined by Bank",
    message: "Your bank has declined this transaction.",
    tip: "Contact your bank for details or use a different card / payment method.",
    tryLabel: "Try Another Method",
  },
  network_error: {
    icon: "📡",
    colour: "#e53935",
    title: "Network Error",
    message: "The payment could not be completed due to a connection issue.",
    tip: "Check your internet connection and try again. No amount has been deducted.",
    tryLabel: "Try Again",
  },
  timeout: {
    icon: "⏱",
    colour: "#e53935",
    title: "Payment Timed Out",
    message: "Your payment session expired before the transaction could be processed.",
    tip: "Please start the payment again. Sessions expire after 10 minutes for security.",
    tryLabel: "Try Again",
  },
};

// Picks a realistic failure reason for demo purposes
function pickFailureReason(paymentMethod) {
  const pool = {
    upi:        ["wrong_upi", "insufficient_balance", "network_error", "timeout"],
    card:       ["card_auth_failed", "insufficient_balance", "bank_declined", "network_error"],
    netbanking: ["bank_declined", "network_error", "timeout"],
    wallet:     ["insufficient_balance", "network_error", "timeout"],
  };
  const options = pool[paymentMethod] || ["network_error"];
  return options[Math.floor(Math.random() * options.length)];
}

// Base URL for backend API calls
const API_BASE = import.meta.env.VITE_API_BASE_URL ?? "";

const STEPS = ["order-summary", "login", "checkout", "redirecting", "failed"];

function loadRazorpayScript() {
  // No longer used — kept as stub in case of future rollback
  return Promise.resolve();
}

const ProCheckoutModal = ({ plan, onClose, source = 'unknown' }) => {
  const [step, setStep] = useState("order-summary");
  const [failureReason, setFailureReason] = useState(null);
  const [loggedInUser, setLoggedInUser] = useState(null);
  // Inline auth state
  const [authMode, setAuthMode] = useState("login"); // "login" | "signup"
  const [authEmail, setAuthEmail] = useState("");
  const [authPassword, setAuthPassword] = useState("");
  const [authName, setAuthName] = useState("");
  const [authError, setAuthError] = useState("");
  const [authLoading, setAuthLoading] = useState(false);
  const [form, setForm] = useState({
    fullName:     "",
    mobile:       "",
    email:        "",
    businessName: "",
    state:        "",
  });
  const [errors, setErrors] = useState({});
  const [isProcessing, setIsProcessing] = useState(false);
  const saveTimerRef = useRef(null);
  const modalRef = useRef(null);

  const orderId = useRef(
    `LT-${new Date().getFullYear()}-${String(Date.now()).slice(-6)}`
  ).current;

  const paymentDate = useRef(
    new Date().toLocaleDateString("en-IN", {
      day: "numeric", month: "long", year: "numeric",
      hour: "2-digit", minute: "2-digit",
    })
  ).current;

  useEffect(() => {
    document.body.style.overflow = "hidden";
    return () => {
      document.body.style.overflow = "";
      if (saveTimerRef.current) clearTimeout(saveTimerRef.current);
    };
  }, []);

  // Track auth state on mount
  useEffect(() => {
    const auth = getAuth();
    const cu = auth.currentUser;
    setLoggedInUser(cu || null);
  }, []);

  // Fill form from Firestore/localStorage for a given user
  const fillFormFromUser = useCallback(async (currentUser) => {
    // Start with localStorage cache
    const cached = getUserProfile();
    const base = {
      fullName:     cached?.fullName     || "",
      mobile:       cached?.mobile       || "",
      email:        cached?.email        || currentUser.email || "",
      businessName: cached?.businessName || "",
      state:        cached?.state        || "",
    };
    setForm(base);

    // Overlay with Firestore data
    try {
      const db = getFirestore();
      const snap = await getDoc(doc(db, "users", currentUser.uid));
      if (snap.exists()) {
        const d = snap.data();
        setForm({
          fullName:     d.fullName     || d.name  || base.fullName,
          email:        d.email        || currentUser.email || base.email,
          mobile:       d.mobile       || d.phone || base.mobile,
          businessName: d.businessName || base.businessName,
          state:        d.state        || base.state,
        });
      }
    } catch (_) {}
  }, []);

  useEffect(() => {
    if (modalRef.current) modalRef.current.scrollTop = 0;
  }, [step]);

  const total = plan.price;

  const stepIndex = STEPS.indexOf(step);
  const showProgress = step === "order-summary" || step === "checkout";

  // Debounced auto-save: whenever the user edits the form, persist to Firestore + localStorage
  const updateField = (key, value) => {
    setForm((f) => {
      const updated = { ...f, [key]: value };
      // Debounce save to avoid hammering Firestore on every keystroke
      if (saveTimerRef.current) clearTimeout(saveTimerRef.current);
      saveTimerRef.current = setTimeout(() => {
        saveUserProfile(updated);
        const auth = getAuth();
        const cu = auth.currentUser;
        if (cu) {
          const db = getFirestore();
          setDoc(doc(db, 'users', cu.uid), {
            fullName:     updated.fullName,
            businessName: updated.businessName,
            state:        updated.state,
            mobile:       updated.mobile,
            updatedAt:    new Date(),
          }, { merge: true }).catch(() => {});
        }
      }, 1000);
      return updated;
    });
    setErrors((e) => ({ ...e, [key]: "" }));
  };

  const validate = () => {
    const e = {};
    if (!form.fullName.trim()) e.fullName = "Full name is required";
    if (!/^\d{10}$/.test(form.mobile.trim())) e.mobile = "Enter a valid 10-digit mobile number";
    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(form.email.trim())) e.email = "Enter a valid email address";
    if (!form.state) e.state = "Please select your state";
    setErrors(e);
    return Object.keys(e).length === 0;
  };

  // After a successful auth inside the modal, fill form and advance
  const afterAuth = useCallback(async (currentUser) => {
    setLoggedInUser(currentUser);
    await fillFormFromUser(currentUser);
    setStep("checkout");
  }, [fillFormFromUser]);

  // Inline email/password login
  const handleAuthSubmit = async (e) => {
    e.preventDefault();
    setAuthError("");
    if (!authEmail.trim() || !authPassword) {
      setAuthError("Please enter your email and password.");
      return;
    }
    if (authMode === "signup" && !authName.trim()) {
      setAuthError("Please enter your name.");
      return;
    }
    setAuthLoading(true);
    const auth = getAuth();
    try {
      let userCredential;
      if (authMode === "login") {
        userCredential = await signInWithEmailAndPassword(auth, authEmail.trim(), authPassword);
      } else {
        userCredential = await createUserWithEmailAndPassword(auth, authEmail.trim(), authPassword);
        const db = getFirestore();
        await setDoc(doc(db, "users", userCredential.user.uid), {
          uid:       userCredential.user.uid,
          name:      authName.trim(),
          fullName:  authName.trim(),
          email:     authEmail.trim(),
          createdAt: new Date(),
          updatedAt: new Date(),
        }, { merge: true });
      }
      await afterAuth(userCredential.user);
    } catch (err) {
      const map = {
        "auth/user-not-found":      "No account found with this email.",
        "auth/wrong-password":      "Incorrect password.",
        "auth/invalid-credential": "Incorrect email or password.",
        "auth/email-already-in-use": "An account with this email already exists.",
        "auth/weak-password":       "Password must be at least 6 characters.",
        "auth/invalid-email":       "Invalid email address.",
        "auth/too-many-requests":   "Too many attempts. Please try again later.",
      };
      setAuthError(map[err.code] || "Something went wrong. Please try again.");
    } finally {
      setAuthLoading(false);
    }
  };

  // Google sign-in inside modal
  const handleGoogleAuth = async () => {
    setAuthError("");
    setAuthLoading(true);
    const auth = getAuth();
    try {
      const provider = new GoogleAuthProvider();
      const result = await signInWithPopup(auth, provider);
      const db = getFirestore();
      const ref = doc(db, "users", result.user.uid);
      const snap = await getDoc(ref);
      if (!snap.exists()) {
        await setDoc(ref, {
          uid:       result.user.uid,
          name:      result.user.displayName || "",
          fullName:  result.user.displayName || "",
          email:     result.user.email,
          avatar:    result.user.photoURL || null,
          createdAt: new Date(),
          updatedAt: new Date(),
        });
      }
      await afterAuth(result.user);
    } catch (err) {
      if (err.code !== "auth/popup-closed-by-user" && err.code !== "auth/cancelled-popup-request") {
        setAuthError("Google sign-in failed. Please try again.");
      }
    } finally {
      setAuthLoading(false);
    }
  };

  // "Proceed to Checkout" — requires login
  const handleProceedToCheckout = async () => {
    const auth = getAuth();
    const currentUser = auth.currentUser;
    if (!currentUser) {
      setStep("login");
      return;
    }
    setLoggedInUser(currentUser);
    await fillFormFromUser(currentUser);
    setStep("checkout");
  };

  // Back button behaviour depends on current step
  const handleBack = () => {
    if (step === "checkout") setStep(loggedInUser ? "order-summary" : "login");
    if (step === "login") setStep("order-summary");
  };

  const showBackButton = step === "checkout" || step === "login";

  const handlePay = async () => {
    if (!validate()) return;

    const auth = getAuth();
    const currentUser = auth.currentUser;
    // Should never reach here without a user (Proceed to Checkout already guards this),
    // but keep as a safety net.
    if (!currentUser) {
      setShowLoginPrompt(true);
      return;
    }

    setIsProcessing(true);

    // Do a final save before redirecting (in case debounce hadn't fired yet)
    saveUserProfile(form);
    const db = getFirestore();
    setDoc(doc(db, 'users', currentUser.uid), {
      fullName:     form.fullName,
      businessName: form.businessName,
      state:        form.state,
      mobile:       form.mobile,
      updatedAt:    new Date(),
    }, { merge: true }).catch(() => {});

    try {
      const res = await fetch(`${API_BASE}/api/payment/initiate`, {
        method:  'POST',
        headers: { 'Content-Type': 'application/json' },
        body:    JSON.stringify({
          amount:      plan.price,
          planName:    plan.name,
          userId:      currentUser.uid,
          form,
          source,
          sourceLabel: getServiceDisplayName(source),
        }),
      });

      if (!res.ok) {
        const errData = await res.json().catch(() => ({}));
        throw new Error(errData.error || 'Failed to initiate payment');
      }

      const { redirectUrl } = await res.json();

      // Show the redirecting step briefly, then navigate to PhonePe
      setStep('redirecting');
      setTimeout(() => { window.location.href = redirectUrl; }, 800);
    } catch (err) {
      console.error('Payment initiation error:', err);
      setIsProcessing(false);
      setFailureReason('network_error');
      setStep('failed');
    }
  };

  const handleTryAgain = () => {
    setFailureReason(null);
    setIsProcessing(false);
    setStep("checkout");
  };

  const progressSteps = [
    { label: "Order", key: "order-summary" },
    { label: "Details", key: "checkout" },
  ];

  const failure = failureReason ? FAILURE_REASONS[failureReason] : null;

  return (
    <div className="pco-overlay" onClick={(e) => e.target === e.currentTarget && onClose()}>
      <div className="pco-modal" ref={modalRef}>

        {/* Sticky header */}
        <div className="pco-modal-head">
          {showBackButton ? (
            <button className="pco-back-btn" onClick={handleBack}>← Back</button>
          ) : (
            <div />
          )}
          <button className="pco-close-btn" onClick={onClose} aria-label="Close">✕</button>
        </div>

        {/* Progress indicator */}
        {showProgress && (
          <div className="pco-progress">
            {progressSteps.map((ps, i) => {
              const isDone = stepIndex > i;
              const isActive = stepIndex === i;
              return (
                <React.Fragment key={ps.key}>
                  <div className={`pco-progress-item ${isActive ? "active" : ""} ${isDone ? "done" : ""}`}>
                    <div className="pco-progress-circle">{isDone ? "✓" : i + 1}</div>
                    <span className="pco-progress-label">{ps.label}</span>
                  </div>
                  {i < progressSteps.length - 1 && (
                    <div className={`pco-progress-line ${isDone ? "done" : ""}`} />
                  )}
                </React.Fragment>
              );
            })}
          </div>
        )}

        {/* ── STEP 1: ORDER SUMMARY ── */}
        {step === "order-summary" && (
          <div className="pco-step">
            <div className="pco-plan-header-row">
              <div className="pco-plan-avatar">👤</div>
              <h2 className="pco-section-title">Your Selected Plan</h2>
            </div>

            <div className="pco-selected-plan-box">
              <div className="pco-plan-gift-icon">🎁</div>
              <div>
                <div className="pco-plan-name-tag">{plan.name} Plan</div>
                <div className="pco-plan-price-tag">₹{plan.price.toLocaleString("en-IN")}</div>
              </div>
            </div>

            <div className="pco-includes">
              <div className="pco-includes-label">Includes:</div>
              {plan.services.map((s) => (
                <div key={s} className="pco-include-row">
                  <span className="pco-green-check">✓</span>
                  <span>{s}</span>
                </div>
              ))}
            </div>

            <div className="pco-summary-box">
              <div className="pco-summary-row">
                <span>{plan.name} Plan</span>
                <span>₹{plan.price.toLocaleString("en-IN")}</span>
              </div>
              <div className="pco-summary-divider" />
              <div className="pco-summary-total-row">
                <span>Total</span>
                <span className="pco-total-amount">₹{total.toLocaleString("en-IN")}</span>
              </div>
            </div>

            <button className="pco-btn-primary" onClick={handleProceedToCheckout}>
              Proceed to Checkout
            </button>
          </div>
        )}

        {/* ── STEP 2: INLINE LOGIN / SIGNUP ── */}
        {step === "login" && (
          <div className="pco-step">
            <div style={{ textAlign: "center", marginBottom: "24px" }}>
              <div style={{ fontSize: "36px", marginBottom: "8px" }}>🔐</div>
              <h2 className="pco-step-heading" style={{ marginBottom: "4px" }}>
                {authMode === "login" ? "Sign in to continue" : "Create your account"}
              </h2>
              <p style={{ color: "#666", fontSize: "14px", margin: 0 }}>
                Your payment will be linked to your account
              </p>
            </div>

            {/* Google button */}
            <button
              type="button"
              disabled={authLoading}
              onClick={handleGoogleAuth}
              style={{
                display: "flex", alignItems: "center", justifyContent: "center", gap: "10px",
                width: "100%", padding: "11px 16px", border: "1.5px solid #dadce0", borderRadius: "8px",
                background: "#fff", cursor: authLoading ? "not-allowed" : "pointer",
                fontSize: "15px", fontWeight: "500", color: "#3c4043", marginBottom: "20px",
                opacity: authLoading ? 0.6 : 1,
              }}
            >
              <svg width="18" height="18" viewBox="0 0 18 18"><path fill="#4285F4" d="M17.64 9.2c0-.637-.057-1.251-.164-1.84H9v3.481h4.844c-.209 1.125-.843 2.078-1.796 2.717v2.258h2.908c1.702-1.567 2.684-3.874 2.684-6.615z"/><path fill="#34A853" d="M9 18c2.43 0 4.467-.806 5.956-2.18l-2.908-2.259c-.806.54-1.837.86-3.048.86-2.344 0-4.328-1.584-5.036-3.711H.957v2.332A8.997 8.997 0 0 0 9 18z"/><path fill="#FBBC05" d="M3.964 10.71A5.41 5.41 0 0 1 3.682 9c0-.593.102-1.17.282-1.71V4.958H.957A8.996 8.996 0 0 0 0 9c0 1.452.348 2.827.957 4.042l3.007-2.332z"/><path fill="#EA4335" d="M9 3.58c1.321 0 2.508.454 3.44 1.345l2.582-2.58C13.463.891 11.426 0 9 0A8.997 8.997 0 0 0 .957 4.958L3.964 6.29C4.672 4.163 6.656 3.58 9 3.58z"/></svg>
              Continue with Google
            </button>

            <div style={{ display: "flex", alignItems: "center", gap: "10px", marginBottom: "20px" }}>
              <div style={{ flex: 1, height: "1px", background: "#e5e7eb" }} />
              <span style={{ color: "#9ca3af", fontSize: "13px" }}>or</span>
              <div style={{ flex: 1, height: "1px", background: "#e5e7eb" }} />
            </div>

            <form onSubmit={handleAuthSubmit} noValidate>
              {authMode === "signup" && (
                <div className="pco-field">
                  <label className="pco-field-label">Full Name</label>
                  <input
                    className="pco-input"
                    type="text"
                    placeholder="Enter your name"
                    value={authName}
                    onChange={(e) => { setAuthName(e.target.value); setAuthError(""); }}
                    autoComplete="name"
                  />
                </div>
              )}
              <div className="pco-field">
                <label className="pco-field-label">Email</label>
                <input
                  className="pco-input"
                  type="email"
                  placeholder="Enter your email"
                  value={authEmail}
                  onChange={(e) => { setAuthEmail(e.target.value); setAuthError(""); }}
                  autoComplete="email"
                />
              </div>
              <div className="pco-field">
                <label className="pco-field-label">Password</label>
                <input
                  className="pco-input"
                  type="password"
                  placeholder={authMode === "signup" ? "Create a password (min 6 chars)" : "Enter your password"}
                  value={authPassword}
                  onChange={(e) => { setAuthPassword(e.target.value); setAuthError(""); }}
                  autoComplete={authMode === "signup" ? "new-password" : "current-password"}
                />
              </div>

              {authError && (
                <div style={{ color: "#e53935", fontSize: "13px", marginBottom: "12px", padding: "8px 12px", background: "#fff5f5", borderRadius: "6px", border: "1px solid #ffcdd2" }}>
                  {authError}
                </div>
              )}

              <button
                type="submit"
                className="pco-btn-primary"
                disabled={authLoading}
                style={{ width: "100%", marginBottom: "12px" }}
              >
                {authLoading ? "Please wait…" : authMode === "login" ? "Sign In" : "Create Account"}
              </button>
            </form>

            <p style={{ textAlign: "center", fontSize: "14px", color: "#666", margin: 0 }}>
              {authMode === "login" ? (
                <>Don't have an account?{" "}
                  <button type="button" onClick={() => { setAuthMode("signup"); setAuthError(""); }} style={{ background: "none", border: "none", color: "#1a73e8", cursor: "pointer", fontWeight: "600", padding: 0 }}>
                    Sign up
                  </button>
                </>
              ) : (
                <>Already have an account?{" "}
                  <button type="button" onClick={() => { setAuthMode("login"); setAuthError(""); }} style={{ background: "none", border: "none", color: "#1a73e8", cursor: "pointer", fontWeight: "600", padding: 0 }}>
                    Sign in
                  </button>
                </>
              )}
            </p>
          </div>
        )}

        {/* ── STEP 3: CHECKOUT ── */}
        {step === "checkout" && (
          <div className="pco-step">
            <h2 className="pco-step-heading">Checkout</h2>

            {loggedInUser && (
              <div className="pco-autofill-banner">
                <span className="pco-autofill-icon">✓</span>
                Details pre-filled from your account. Any changes are saved automatically.
              </div>
            )}

            <div className="pco-form-group">
              <h3 className="pco-form-group-title">Personal Details</h3>

              <div className="pco-field">
                <label className="pco-field-label">Full Name</label>
                <input
                  className={`pco-input${errors.fullName ? " pco-input-error" : ""}`}
                  type="text"
                  placeholder="Enter your full name"
                  value={form.fullName}
                  onChange={(e) => updateField("fullName", e.target.value)}
                />
                {errors.fullName && <span className="pco-error-msg">{errors.fullName}</span>}
              </div>

              <div className="pco-field">
                <label className="pco-field-label">Mobile Number</label>
                <input
                  className={`pco-input${errors.mobile ? " pco-input-error" : ""}`}
                  type="tel"
                  placeholder="Enter mobile number"
                  value={form.mobile}
                  maxLength={10}
                  onChange={(e) => updateField("mobile", e.target.value.replace(/\D/g, ""))}
                />
                {errors.mobile && <span className="pco-error-msg">{errors.mobile}</span>}
              </div>

              <div className="pco-field">
                <label className="pco-field-label">Email Address</label>
                <input
                  className={`pco-input${errors.email ? " pco-input-error" : ""}`}
                  type="email"
                  placeholder="Enter email address"
                  value={form.email}
                  onChange={(e) => updateField("email", e.target.value)}
                />
                {errors.email && <span className="pco-error-msg">{errors.email}</span>}
              </div>
            </div>

            <div className="pco-form-group">
              <h3 className="pco-form-group-title">Business Details</h3>

              <div className="pco-field">
                <label className="pco-field-label">
                  Business Name <span className="pco-field-optional">(Optional)</span>
                </label>
                <input
                  className="pco-input"
                  type="text"
                  placeholder="Enter business name"
                  value={form.businessName}
                  onChange={(e) => updateField("businessName", e.target.value)}
                />
              </div>

              <div className="pco-field">
                <label className="pco-field-label">State</label>
                <select
                  className={`pco-select${errors.state ? " pco-input-error" : ""}`}
                  value={form.state}
                  onChange={(e) => updateField("state", e.target.value)}
                >
                  <option value="">Select State</option>
                  {STATES.map((s) => (
                    <option key={s} value={s}>{s}</option>
                  ))}
                </select>
                {errors.state && <span className="pco-error-msg">{errors.state}</span>}
              </div>
            </div>

            <div className="pco-summary-box">
              <div className="pco-summary-row">
                <span>{plan.name} Plan</span>
                <span>₹{plan.price.toLocaleString("en-IN")}</span>
              </div>
              <div className="pco-summary-divider" />
              <div className="pco-summary-total-row">
                <span>Total Amount</span>
                <span className="pco-total-amount">₹{total.toLocaleString("en-IN")}</span>
              </div>
            </div>

            <button
              className="pco-btn-primary"
              disabled={isProcessing}
              onClick={handlePay}
            >
              {isProcessing ? 'Processing…' : '🔒 Proceed to Payment'}
            </button>

            <div className="pco-secured-row">
              <span className="pco-secured-text">Secured by</span>
              <div className="pco-payment-badges">
                <span className="pco-badge pco-badge-razorpay">PhonePe</span>
                <span className="pco-badge pco-badge-upi">UPI</span>
                <span className="pco-badge pco-badge-visa">VISA</span>
                <span className="pco-badge pco-badge-mc">MC</span>
              </div>
            </div>
          </div>
        )}

        {/* ── STEP 3: REDIRECTING TO PHONEPE ── */}
        {step === "redirecting" && (
          <div className="pco-step" style={{ textAlign: 'center', padding: '48px 24px' }}>
            <div style={{ fontSize: 48, marginBottom: 16 }}>🔒</div>
            <h2 className="pco-step-heading">Redirecting to PhonePe…</h2>
            <p style={{ color: '#666', marginTop: 8 }}>
              You are being securely redirected to PhonePe to complete your payment.
            </p>
          </div>
        )}

        {/* ── STEP 4: PAYMENT SUCCESS ── */}
        {step === "success" && (
          <div className="pco-step pco-success-step">
            <div className="pco-success-circle">
              <span className="pco-success-tick">✓</span>
            </div>
            <h2 className="pco-success-title">Payment Successful!</h2>
            <p className="pco-success-sub">Thank you! Your payment has been received.</p>

            <div className="pco-order-detail-box">
              {[
                { label: "Order ID", value: orderId },
                { label: "Amount Paid", value: `₹${total.toLocaleString("en-IN")}` },
                { label: "Date", value: paymentDate },
              ].map(({ label, value }) => (
                <div key={label} className="pco-detail-row">
                  <span className="pco-detail-label">{label}</span>
                  <span className="pco-detail-value">{value}</span>
                </div>
              ))}
            </div>

            <div className="pco-services-box">
              <div className="pco-services-title">Services Purchased</div>
              {plan.services.map((s) => (
                <div key={s} className="pco-service-row">
                  <span className="pco-green-check">✓</span>
                  <span>{s}</span>
                </div>
              ))}
            </div>

            <div className="pco-next-box">
              <div className="pco-next-title">What Happens Next?</div>
              <ol className="pco-next-list">
                <li>Our team will contact you within 2 working hours.</li>
                <li>Required documents will be collected.</li>
                <li>Your registration process will begin.</li>
                <li>Updates will be shared via WhatsApp &amp; Email.</li>
              </ol>
            </div>

            <button className="pco-btn-outline" onClick={() => setStep("thankyou")}>
              Continue →
            </button>
          </div>
        )}

        {/* ── STEP 5: PAYMENT FAILED ── */}
        {step === "failed" && failure && (
          <div className="pco-step pco-failed-step">
            <div className="pco-failed-circle" style={{ background: failure.colour, boxShadow: `0 8px 24px ${failure.colour}55` }}>
              <span className="pco-failed-icon">{failure.icon}</span>
            </div>

            <h2 className="pco-failed-title">{failure.title}</h2>
            <p className="pco-failed-sub">{failure.message}</p>

            <div className="pco-failed-tip-box">
              <span className="pco-failed-tip-icon">💡</span>
              <p className="pco-failed-tip">{failure.tip}</p>
            </div>

            <button className="pco-btn-primary" onClick={handleTryAgain}>
              {failure.tryLabel}
            </button>
            <button className="pco-btn-outline pco-btn-mt" onClick={onClose}>
              Cancel Order
            </button>
          </div>
        )}

        {/* ── STEP 6: THANK YOU ── */}
        {step === "thankyou" && (
          <div className="pco-step pco-thankyou-step">
            <div className="pco-thankyou-illustration">🎉</div>
            <h2 className="pco-thankyou-title">Thank You!</h2>
            <p className="pco-thankyou-sub">
              We have received your order.<br />
              Our team will connect with you soon.
            </p>

            <div className="pco-contact-cards">
              <div className="pco-contact-card">
                <div className="pco-contact-card-icon pco-icon-whatsapp">📱</div>
                <div className="pco-contact-card-body">
                  <div className="pco-contact-card-label">We will update you on WhatsApp</div>
                  <div className="pco-contact-card-value">+91 82800 93456</div>
                </div>
              </div>

              <div className="pco-contact-card">
                <div className="pco-contact-card-icon pco-icon-email">✉️</div>
                <div className="pco-contact-card-body">
                  <div className="pco-contact-card-label">A confirmation email has been sent to</div>
                  <div className="pco-contact-card-value">{form.email || "your email"}</div>
                </div>
              </div>

              <div className="pco-contact-card">
                <div className="pco-contact-card-icon pco-icon-support">👤</div>
                <div className="pco-contact-card-body">
                  <div className="pco-contact-card-label">Need Help?</div>
                  <div className="pco-contact-card-value">+91 82800 93456</div>
                  <div className="pco-contact-card-value">sales21@legalterminus.com</div>
                </div>
              </div>
            </div>

            <button className="pco-btn-primary" onClick={onClose}>
              Back to Home
            </button>
          </div>
        )}
      </div>
    </div>
  );
};

export default ProCheckoutModal;
