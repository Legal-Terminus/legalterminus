import React, { useState, useEffect, useRef } from "react";
import { getAuth } from "firebase/auth";
import { getFirestore, doc, setDoc, getDoc } from "firebase/firestore";
import { getUserProfile, saveUserProfile } from "../../utils/userProfile.js";
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

const STEPS = ["order-summary", "checkout", "success", "failed"];

function loadRazorpayScript() {
  return new Promise((resolve, reject) => {
    if (window.Razorpay) { resolve(); return; }
    const script = document.createElement('script');
    script.src = 'https://checkout.razorpay.com/v1/checkout.js';
    script.onload = resolve;
    script.onerror = () => reject(new Error('Failed to load Razorpay script'));
    document.head.appendChild(script);
  });
}

const ProCheckoutModal = ({ plan, onClose }) => {
  const savedUser = getUserProfile();

  const [step, setStep] = useState("order-summary");
  const [failureReason, setFailureReason] = useState(null);
  const [form, setForm] = useState({
    fullName:     savedUser?.fullName     || "",
    mobile:       savedUser?.mobile       || "",
    email:        savedUser?.email        || "",
    businessName: savedUser?.businessName || "",
    state:        savedUser?.state        || "",
  });
  const [errors, setErrors] = useState({});
  const [isProcessing, setIsProcessing] = useState(false);
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
    return () => { document.body.style.overflow = ""; };
  }, []);

  // Firestore fallback: if localStorage has no profile, fetch from Firestore
  useEffect(() => {
    if (savedUser) return; // already have data from localStorage
    const auth = getAuth();
    const currentUser = auth.currentUser;
    if (!currentUser) return;
    const db = getFirestore();
    getDoc(doc(db, "users", currentUser.uid)).then((snap) => {
      if (!snap.exists()) return;
      const d = snap.data();
      setForm((f) => ({
        fullName:     f.fullName     || d.fullName     || d.name  || "",
        email:        f.email        || d.email        || currentUser.email || "",
        mobile:       f.mobile       || d.mobile       || d.phone || "",
        businessName: f.businessName || d.businessName || "",
        state:        f.state        || d.state        || "",
      }));
    }).catch(() => {});
  }, []); // eslint-disable-line react-hooks/exhaustive-deps

  useEffect(() => {
    if (modalRef.current) modalRef.current.scrollTop = 0;
  }, [step]);

  const total = plan.price;

  const stepIndex = STEPS.indexOf(step);
  const showProgress = stepIndex < 2; // only show for order-summary and checkout

  const updateField = (key, value) => {
    setForm((f) => ({ ...f, [key]: value }));
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

  // Back button behaviour depends on current step
  const handleBack = () => {
    if (step === "checkout") {
      setStep("order-summary");
    }
  };

  const showBackButton = step === "checkout";

  const handlePay = async () => {
    setIsProcessing(true);

    // Persist profile data for future auto-fill
    const profileData = {
      fullName:     form.fullName,
      email:        form.email,
      mobile:       form.mobile,
      businessName: form.businessName,
      state:        form.state,
    };

    const auth = getAuth();
    const currentUser = auth.currentUser;

    if (currentUser) {
      const db = getFirestore();
      setDoc(doc(db, 'users', currentUser.uid), {
        fullName:     profileData.fullName,
        businessName: profileData.businessName,
        state:        profileData.state,
        mobile:       profileData.mobile,
        updatedAt:    new Date(),
      }, { merge: true }).catch((err) => console.error('Error saving to Firestore:', err));
      saveUserProfile(profileData);
    } else {
      saveUserProfile(profileData);
    }

    try {
      // Step 1: Create Razorpay order on backend
      const orderRes = await fetch(`${API_BASE}/api/payment/create-order`, {
        method:  'POST',
        headers: { 'Content-Type': 'application/json' },
        body:    JSON.stringify({
          amount:   plan.price,
          planName: plan.name,
          userId:   currentUser?.uid || '',
        }),
      });

      if (!orderRes.ok) {
        const errData = await orderRes.json().catch(() => ({}));
        throw new Error(errData.error || 'Failed to create order');
      }

      const { orderId: rzpOrderId, amount: rzpAmount, currency, keyId } = await orderRes.json();

      // Step 2: Load Razorpay checkout script
      await loadRazorpayScript();

      // Step 3: Open Razorpay checkout popup
      const options = {
        key:         keyId,
        amount:      rzpAmount,
        currency,
        name:        'Legal Terminus',
        description: `${plan.name} Plan`,
        order_id:    rzpOrderId,
        prefill: {
          name:    form.fullName,
          email:   form.email,
          contact: form.mobile,
        },
        theme: { color: '#1a237e' },
        handler: async (response) => {
          // Step 4: Verify signature on backend
          try {
            const verifyRes = await fetch(`${API_BASE}/api/payment/verify`, {
              method:  'POST',
              headers: { 'Content-Type': 'application/json' },
              body:    JSON.stringify({
                razorpay_order_id:   response.razorpay_order_id,
                razorpay_payment_id: response.razorpay_payment_id,
                razorpay_signature:  response.razorpay_signature,
                planName: plan.name,
                userId:   currentUser?.uid || '',
                amount:   plan.price,
              }),
            });
            const verifyData = await verifyRes.json();
            if (verifyData.success) {
              setStep('success');
            } else {
              setFailureReason('network_error');
              setStep('failed');
            }
          } catch {
            setFailureReason('network_error');
            setStep('failed');
          }
        },
        modal: {
          ondismiss: () => { setIsProcessing(false); },
        },
      };

      const rzp = new window.Razorpay(options);
      rzp.on('payment.failed', () => {
        setFailureReason('bank_declined');
        setStep('failed');
      });
      rzp.open();
      setIsProcessing(false);
    } catch (err) {
      console.error('Payment error:', err);
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

            <button className="pco-btn-primary" onClick={() => setStep("checkout")}>
              Proceed to Checkout
            </button>
          </div>
        )}

        {/* ── STEP 2: CHECKOUT ── */}
        {step === "checkout" && (
          <div className="pco-step">
            <h2 className="pco-step-heading">Checkout</h2>

            {savedUser && (
              <div className="pco-autofill-banner">
                <span className="pco-autofill-icon">✓</span>
                Details pre-filled from your account. Update if needed.
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
              onClick={() => { if (validate()) handlePay(); }}
            >
              {isProcessing ? 'Processing…' : '🔒 Proceed to Payment'}
            </button>

            <div className="pco-secured-row">
              <span className="pco-secured-text">Secured by</span>
              <div className="pco-payment-badges">
                <span className="pco-badge pco-badge-razorpay">Razorpay</span>
                <span className="pco-badge pco-badge-upi">UPI</span>
                <span className="pco-badge pco-badge-visa">VISA</span>
                <span className="pco-badge pco-badge-mc">MC</span>
              </div>
            </div>
          </div>
        )}

        {/* ── STEP 3: PAYMENT SUCCESS ── */}
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
