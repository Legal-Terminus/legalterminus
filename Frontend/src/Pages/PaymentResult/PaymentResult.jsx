import React, { useEffect, useRef } from "react";
import { useSearchParams, Link } from "react-router-dom";
import "./PaymentResult.css";

const PaymentResult = () => {
  const [searchParams] = useSearchParams();

  const status     = searchParams.get("status")      || "failed";
  const orderId    = searchParams.get("order_id")    || "—";
  const amount     = searchParams.get("amount")      || "";
  const trackingId = searchParams.get("tracking_id") || "";
  const reason     = searchParams.get("reason")      || "Payment could not be completed.";

  const isSuccess   = status === "success";
  const isCancelled = status === "cancelled";

  // Scroll to top on mount
  useEffect(() => { window.scrollTo({ top: 0, behavior: "instant" }); }, []);

  const paymentDate = useRef(
    new Date().toLocaleDateString("en-IN", {
      day: "numeric", month: "long", year: "numeric",
      hour: "2-digit", minute: "2-digit",
    })
  ).current;

  return (
    <div className="pr-page">
      <div className="pr-card">

        {/* ── SUCCESS ── */}
        {isSuccess && (
          <>
            <div className="pr-icon-circle pr-success-circle">
              <span className="pr-icon">✓</span>
            </div>
            <h1 className="pr-title">Payment Successful!</h1>
            <p className="pr-sub">Thank you! Your payment has been received.</p>

            <div className="pr-detail-box">
              {[
                { label: "Order ID",    value: orderId },
                { label: "Amount Paid", value: amount ? `₹${Number(amount).toLocaleString("en-IN")}` : "—" },
                { label: "Tracking ID", value: trackingId || "—" },
                { label: "Date",        value: paymentDate },
              ].map(({ label, value }) => (
                <div key={label} className="pr-detail-row">
                  <span className="pr-detail-label">{label}</span>
                  <span className="pr-detail-value">{value}</span>
                </div>
              ))}
            </div>

            <div className="pr-next-box">
              <div className="pr-next-title">What Happens Next?</div>
              <ol className="pr-next-list">
                <li>Our team will contact you within 2 working hours.</li>
                <li>Required documents will be collected.</li>
                <li>Your registration process will begin.</li>
                <li>Updates will be shared via WhatsApp &amp; Email.</li>
              </ol>
            </div>

            <div className="pr-contact-cards">
              <div className="pr-contact-card">
                <div className="pr-contact-icon">📱</div>
                <div>
                  <div className="pr-contact-label">WhatsApp updates</div>
                  <div className="pr-contact-value">+91 82800 93456</div>
                </div>
              </div>
              <div className="pr-contact-card">
                <div className="pr-contact-icon">✉️</div>
                <div>
                  <div className="pr-contact-label">Support email</div>
                  <div className="pr-contact-value">sales21@legalterminus.com</div>
                </div>
              </div>
            </div>

            <Link to="/" className="pr-btn-primary">Back to Home</Link>
          </>
        )}

        {/* ── CANCELLED ── */}
        {isCancelled && (
          <>
            <div className="pr-icon-circle pr-cancel-circle">
              <span className="pr-icon">↩</span>
            </div>
            <h1 className="pr-title">Payment Cancelled</h1>
            <p className="pr-sub">You cancelled the payment. No amount has been deducted.</p>

            {orderId !== "—" && (
              <div className="pr-detail-box">
                <div className="pr-detail-row">
                  <span className="pr-detail-label">Order ID</span>
                  <span className="pr-detail-value">{orderId}</span>
                </div>
              </div>
            )}

            <div className="pr-tip-box">
              <span className="pr-tip-icon">💡</span>
              <p>You can go back and try again whenever you are ready.</p>
            </div>

            <Link to="/" className="pr-btn-primary">Back to Home</Link>
          </>
        )}

        {/* ── FAILED ── */}
        {!isSuccess && !isCancelled && (
          <>
            <div className="pr-icon-circle pr-failed-circle">
              <span className="pr-icon">✕</span>
            </div>
            <h1 className="pr-title">Payment Failed</h1>
            <p className="pr-sub">We could not process your payment.</p>

            {orderId !== "—" && (
              <div className="pr-detail-box">
                <div className="pr-detail-row">
                  <span className="pr-detail-label">Order ID</span>
                  <span className="pr-detail-value">{orderId}</span>
                </div>
              </div>
            )}

            <div className="pr-tip-box">
              <span className="pr-tip-icon">💡</span>
              <p>{reason}</p>
            </div>

            <Link to="/" className="pr-btn-primary">Back to Home</Link>
          </>
        )}

      </div>
    </div>
  );
};

export default PaymentResult;
