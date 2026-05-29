import React, { useState, useEffect, useRef } from "react";
import "./ProCheckoutModal.css";
import { getUserProfile } from "../../utils/userProfile";

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

const STEPS = ["order-summary", "checkout", "payment", "success", "failed", "thankyou"];

const ProCheckoutModal = ({ plan, onClose }) => {
  const savedUser = getUserProfile();

  const [step, setStep] = useState("order-summary");
  const [paymentMethod, setPaymentMethod] = useState("upi");
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

  useEffect(() => {
    if (modalRef.current) modalRef.current.scrollTop = 0;
  }, [step]);

  const total = plan.price;

  const stepIndex = STEPS.indexOf(step);
  const showProgress = stepIndex < 3;

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
    if (step === "payment") {
      // Clicking back FROM payment = user cancelled
      setFailureReason("cancelled");
      setStep("failed");
    } else if (step === "checkout") {
      setStep("order-summary");
    }
  };

  const showBackButton = step === "checkout" || step === "payment";

  const handlePay = () => {
    setIsProcessing(true);
    setTimeout(() => {
      setIsProcessing(false);
      // Replace with real gateway result — demo simulates ~20% failure rate
      const success = Math.random() > 0.2;
      if (success) {
        setStep("success");
      } else {
        setFailureReason(pickFailureReason(paymentMethod));
        setStep("failed");
      }
    }, 2000);
  };

  const handleTryAgain = () => {
    setFailureReason(null);
    setIsProcessing(false);
    setStep("payment");
  };

  const progressSteps = [
    { label: "Order", key: "order-summary" },
    { label: "Details", key: "checkout" },
    { label: "Payment", key: "payment" },
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
              onClick={() => { if (validate()) setStep("payment"); }}
            >
              🔒 Pay Securely
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

        {/* ── STEP 3: PAYMENT ── */}
        {step === "payment" && (
          <div className="pco-step">
            <h2 className="pco-step-heading">Select Payment Method</h2>

            <div className="pco-payment-methods">
              {[
                { id: "upi", label: "UPI", icon: "📲" },
                { id: "card", label: "Card", icon: "💳" },
                { id: "netbanking", label: "Net Banking", icon: "🏦" },
                { id: "wallet", label: "Wallet", icon: "👛" },
              ].map((pm) => (
                <div
                  key={pm.id}
                  className={`pco-pm-row${paymentMethod === pm.id ? " selected" : ""}`}
                  onClick={() => setPaymentMethod(pm.id)}
                >
                  <span className="pco-pm-icon">{pm.icon}</span>
                  <span className="pco-pm-label">{pm.label}</span>
                  <span className="pco-pm-arrow">›</span>
                </div>
              ))}
            </div>

            {paymentMethod === "upi" && (
              <div className="pco-upi-panel">
                <p className="pco-upi-scan-text">Scan &amp; Pay using UPI</p>
                <div className="pco-qr-wrapper">
                  <div className="pco-qr-box">
                    <svg viewBox="0 0 100 100" width="130" height="130" xmlns="http://www.w3.org/2000/svg">
                      <rect width="100" height="100" fill="#fff"/>
                      <rect x="5" y="5" width="28" height="28" rx="2" fill="none" stroke="#111" strokeWidth="3"/>
                      <rect x="11" y="11" width="16" height="16" rx="1" fill="#111"/>
                      <rect x="67" y="5" width="28" height="28" rx="2" fill="none" stroke="#111" strokeWidth="3"/>
                      <rect x="73" y="11" width="16" height="16" rx="1" fill="#111"/>
                      <rect x="5" y="67" width="28" height="28" rx="2" fill="none" stroke="#111" strokeWidth="3"/>
                      <rect x="11" y="73" width="16" height="16" rx="1" fill="#111"/>
                      <rect x="40" y="5" width="4" height="4" fill="#111"/><rect x="46" y="5" width="4" height="4" fill="#111"/>
                      <rect x="56" y="5" width="4" height="4" fill="#111"/><rect x="62" y="5" width="4" height="4" fill="#111"/>
                      <rect x="40" y="11" width="4" height="4" fill="#111"/><rect x="52" y="11" width="4" height="4" fill="#111"/>
                      <rect x="40" y="17" width="4" height="4" fill="#111"/><rect x="50" y="17" width="4" height="4" fill="#111"/>
                      <rect x="58" y="17" width="4" height="4" fill="#111"/><rect x="62" y="23" width="4" height="4" fill="#111"/>
                      <rect x="46" y="23" width="4" height="4" fill="#111"/><rect x="54" y="23" width="4" height="4" fill="#111"/>
                      <rect x="40" y="29" width="4" height="4" fill="#111"/><rect x="48" y="29" width="4" height="4" fill="#111"/>
                      <rect x="5" y="40" width="4" height="4" fill="#111"/><rect x="13" y="40" width="4" height="4" fill="#111"/>
                      <rect x="21" y="40" width="4" height="4" fill="#111"/><rect x="29" y="40" width="4" height="4" fill="#111"/>
                      <rect x="5" y="48" width="4" height="4" fill="#111"/><rect x="17" y="48" width="4" height="4" fill="#111"/>
                      <rect x="25" y="48" width="4" height="4" fill="#111"/><rect x="5" y="56" width="4" height="4" fill="#111"/>
                      <rect x="13" y="56" width="4" height="4" fill="#111"/><rect x="21" y="56" width="4" height="4" fill="#111"/>
                      <rect x="29" y="56" width="4" height="4" fill="#111"/><rect x="9" y="62" width="4" height="4" fill="#111"/>
                      <rect x="25" y="62" width="4" height="4" fill="#111"/><rect x="40" y="40" width="4" height="4" fill="#111"/>
                      <rect x="48" y="40" width="4" height="4" fill="#111"/><rect x="56" y="40" width="4" height="4" fill="#111"/>
                      <rect x="44" y="46" width="4" height="4" fill="#111"/><rect x="60" y="46" width="4" height="4" fill="#111"/>
                      <rect x="40" y="52" width="4" height="4" fill="#111"/><rect x="52" y="52" width="4" height="4" fill="#111"/>
                      <rect x="64" y="52" width="4" height="4" fill="#111"/><rect x="46" y="58" width="4" height="4" fill="#111"/>
                      <rect x="54" y="58" width="4" height="4" fill="#111"/><rect x="40" y="64" width="4" height="4" fill="#111"/>
                      <rect x="62" y="64" width="4" height="4" fill="#111"/><rect x="67" y="40" width="4" height="4" fill="#111"/>
                      <rect x="79" y="40" width="4" height="4" fill="#111"/><rect x="87" y="40" width="4" height="4" fill="#111"/>
                      <rect x="73" y="46" width="4" height="4" fill="#111"/><rect x="83" y="46" width="4" height="4" fill="#111"/>
                      <rect x="91" y="46" width="4" height="4" fill="#111"/><rect x="67" y="52" width="4" height="4" fill="#111"/>
                      <rect x="75" y="52" width="4" height="4" fill="#111"/><rect x="69" y="58" width="4" height="4" fill="#111"/>
                      <rect x="85" y="58" width="4" height="4" fill="#111"/><rect x="75" y="64" width="4" height="4" fill="#111"/>
                      <rect x="91" y="64" width="4" height="4" fill="#111"/><rect x="40" y="67" width="4" height="4" fill="#111"/>
                      <rect x="52" y="67" width="4" height="4" fill="#111"/><rect x="60" y="67" width="4" height="4" fill="#111"/>
                      <rect x="44" y="73" width="4" height="4" fill="#111"/><rect x="56" y="73" width="4" height="4" fill="#111"/>
                      <rect x="64" y="73" width="4" height="4" fill="#111"/><rect x="40" y="79" width="4" height="4" fill="#111"/>
                      <rect x="48" y="79" width="4" height="4" fill="#111"/><rect x="62" y="79" width="4" height="4" fill="#111"/>
                      <rect x="54" y="85" width="4" height="4" fill="#111"/><rect x="40" y="91" width="4" height="4" fill="#111"/>
                      <rect x="48" y="91" width="4" height="4" fill="#111"/><rect x="60" y="91" width="4" height="4" fill="#111"/>
                      <rect x="67" y="73" width="4" height="4" fill="#111"/><rect x="79" y="73" width="4" height="4" fill="#111"/>
                      <rect x="73" y="79" width="4" height="4" fill="#111"/><rect x="87" y="79" width="4" height="4" fill="#111"/>
                      <rect x="67" y="85" width="4" height="4" fill="#111"/><rect x="79" y="85" width="4" height="4" fill="#111"/>
                      <rect x="91" y="85" width="4" height="4" fill="#111"/><rect x="73" y="91" width="4" height="4" fill="#111"/>
                      <rect x="85" y="91" width="4" height="4" fill="#111"/>
                    </svg>
                  </div>
                </div>
                <p className="pco-upi-or">Or pay using UPI ID</p>
                <div className="pco-upi-id-box">legalterminus@upi</div>
              </div>
            )}

            {paymentMethod === "card" && (
              <div className="pco-card-panel">
                <div className="pco-field">
                  <label className="pco-field-label">Card Number</label>
                  <input className="pco-input" type="text" placeholder="0000 0000 0000 0000" maxLength={19} />
                </div>
                <div className="pco-card-row">
                  <div className="pco-field">
                    <label className="pco-field-label">Expiry</label>
                    <input className="pco-input" type="text" placeholder="MM / YY" maxLength={7} />
                  </div>
                  <div className="pco-field">
                    <label className="pco-field-label">CVV</label>
                    <input className="pco-input" type="password" placeholder="•••" maxLength={3} />
                  </div>
                </div>
                <div className="pco-field">
                  <label className="pco-field-label">Name on Card</label>
                  <input className="pco-input" type="text" placeholder="Enter cardholder name" />
                </div>
              </div>
            )}

            {paymentMethod === "netbanking" && (
              <div className="pco-generic-panel">
                <p className="pco-generic-note">
                  You will be redirected to your bank's secure portal to complete the payment.
                </p>
              </div>
            )}

            {paymentMethod === "wallet" && (
              <div className="pco-generic-panel">
                <p className="pco-generic-note">
                  Select your preferred wallet — Paytm, PhonePe, or Amazon Pay — to complete payment.
                </p>
              </div>
            )}

            <div className="pco-total-payable-row">
              <span>Total Payable</span>
              <span className="pco-total-amount">₹{total.toLocaleString("en-IN")}</span>
            </div>

            <button className="pco-btn-primary" onClick={handlePay} disabled={isProcessing}>
              {isProcessing ? (
                <span className="pco-processing-text">
                  <span className="pco-spinner" /> Processing...
                </span>
              ) : (
                `🔒 Pay ₹${total.toLocaleString("en-IN")}`
              )}
            </button>

            <div className="pco-secure-note">
              <span className="pco-lock-icon">🔒</span>
              <div>
                <div className="pco-secure-title">100% Secure Payments</div>
                <div className="pco-secure-sub">Your payment details are safe and encrypted.</div>
              </div>
            </div>
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
                {
                  label: "Payment Method",
                  value: paymentMethod.charAt(0).toUpperCase() + paymentMethod.slice(1),
                },
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
