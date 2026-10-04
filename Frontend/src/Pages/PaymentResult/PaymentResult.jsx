import React, { useEffect, useState } from "react";
import { useSearchParams, Link } from "react-router-dom";
import { onAuthStateChanged } from "firebase/auth";
import { getFirebaseAuth } from "../../utils/firebase";
import { getOrder } from "../../utils/checkout";
import "./PaymentResult.css";

/**
 * The result of a payment (E24-S05).
 *
 * This page used to believe its own address: `?status=success&amount=…` drew a
 * "Payment Successful" receipt for anyone who typed it. It now takes only an
 * order reference and ASKS THE SERVER what happened to that order — so what it
 * shows is what was actually recorded, and only the person who placed the order
 * can see it.
 *
 * A payment can be confirmed a moment after the customer lands here (the
 * gateway tells the server separately), so an order still "in progress" is
 * re-checked for a short while before the page says so.
 */

const PORTAL_URL = "/portal/";
const inr = (n) => `₹${Number(n ?? 0).toLocaleString("en-IN")}`;
const when = (iso) => (iso ? new Date(iso).toLocaleString("en-IN", {
  day: "numeric", month: "long", year: "numeric", hour: "2-digit", minute: "2-digit",
}) : "—");

const MAX_CHECKS = 10;      // ~30 seconds
const CHECK_EVERY_MS = 3000;

const PaymentResult = () => {
  const [searchParams] = useSearchParams();
  const orderId = searchParams.get("order") || "";
  // loading | signin | notfound | error | ready
  const [view, setView] = useState("loading");
  const [order, setOrder] = useState(null);
  const [checks, setChecks] = useState(0);

  useEffect(() => { window.scrollTo({ top: 0, behavior: "instant" }); }, []);

  useEffect(() => {
    if (!orderId) { setView("notfound"); return undefined; }
    let alive = true;
    let timer;
    const load = async (attempt) => {
      try {
        const o = await getOrder(orderId);
        if (!alive) return;
        setOrder(o);
        setView("ready");
        setChecks(attempt);
        if (o.status === "created" && attempt < MAX_CHECKS) timer = setTimeout(() => load(attempt + 1), CHECK_EVERY_MS);
      } catch (err) {
        if (!alive) return;
        setView(err?.status === 404 ? "notfound" : err?.status === 401 ? "signin" : "error");
      }
    };
    // Wait for the sign-in state: the order belongs to an account.
    const stop = onAuthStateChanged(getFirebaseAuth(), (user) => {
      if (!alive) return;
      if (!user) { setView("signin"); return; }
      load(1);
    });
    return () => { alive = false; clearTimeout(timer); stop(); };
  }, [orderId]);

  const status = order?.status;
  const stillChecking = status === "created" && checks < MAX_CHECKS;

  const rows = order ? [
    { label: "Order reference", value: order.orderId },
    { label: "Service", value: `${order.label} — ${order.planName}` },
    { label: "Amount", value: inr(order.amount) },
    ...(order.paymentReference ? [{ label: "Payment reference", value: order.paymentReference }] : []),
    { label: "Date", value: when(order.paidAt || order.createdAt) },
  ] : [];

  const Details = () => (
    <div className="pr-detail-box">
      {rows.map(({ label, value }) => (
        <div key={label} className="pr-detail-row">
          <span className="pr-detail-label">{label}</span>
          <span className="pr-detail-value">{value}</span>
        </div>
      ))}
    </div>
  );

  return (
    <div className="pr-page">
      <div className="pr-card" aria-live="polite">

        {view === "loading" && (
          <>
            <div className="pr-icon-circle pr-success-circle"><span className="pr-icon">…</span></div>
            <h1 className="pr-title">Checking your payment</h1>
            <p className="pr-sub">One moment.</p>
          </>
        )}

        {view === "signin" && (
          <>
            <h1 className="pr-title">Sign in to see your order</h1>
            <p className="pr-sub">An order can only be viewed by the account that placed it.</p>
            <Link to="/login" className="pr-btn-primary">Sign in</Link>
          </>
        )}

        {view === "notfound" && (
          <>
            <h1 className="pr-title">We could not find that order</h1>
            <p className="pr-sub">
              Check the link, or sign in with the account you paid from. If money was taken, it is safe:
              contact us with your payment reference and we will match it.
            </p>
            <Link to="/" className="pr-btn-primary">Back to home</Link>
          </>
        )}

        {view === "error" && (
          <>
            <h1 className="pr-title">We could not check your order</h1>
            <p className="pr-sub">Please refresh this page in a moment. If you paid, your payment is not lost.</p>
          </>
        )}

        {/* ── PAID ── */}
        {view === "ready" && status === "paid" && (
          <>
            <div className="pr-icon-circle pr-success-circle"><span className="pr-icon">✓</span></div>
            <h1 className="pr-title">Payment Successful!</h1>
            <p className="pr-sub">Thank you! Your payment has been received.</p>
            <Details />
            <div className="pr-next-box">
              <div className="pr-next-title">What Happens Next?</div>
              <ol className="pr-next-list">
                {order.matterId
                  ? <li>Your service has been started. You can follow each step in your portal.</li>
                  : <li>Our team will contact you within 2 working hours to start your service.</li>}
                <li>Required documents will be collected.</li>
                <li>Updates will be shared in your portal and by email.</li>
              </ol>
            </div>
            <a href={order.matterId ? `${PORTAL_URL}tasks/${order.matterId}` : PORTAL_URL} className="pr-btn-primary">
              {order.matterId ? "Track your service" : "Go to your portal"}
            </a>
          </>
        )}

        {/* ── RECEIVED, BEING CHECKED BY THE TEAM ── */}
        {view === "ready" && status === "review" && (
          <>
            <div className="pr-icon-circle pr-success-circle"><span className="pr-icon">✓</span></div>
            <h1 className="pr-title">Payment received</h1>
            <p className="pr-sub">
              We have your payment and our team is confirming the details. We will contact you shortly —
              you do not need to pay again.
            </p>
            <Details />
          </>
        )}

        {/* ── STILL BEING CONFIRMED ── */}
        {view === "ready" && status === "created" && (
          <>
            <div className="pr-icon-circle pr-success-circle"><span className="pr-icon">…</span></div>
            <h1 className="pr-title">{stillChecking ? "Confirming your payment" : "We are still waiting for confirmation"}</h1>
            <p className="pr-sub">
              {stillChecking
                ? "This usually takes a few seconds. Please keep this page open."
                : "Your bank has not confirmed the payment yet. If money left your account, we will be told automatically and will email you — please do not pay again."}
            </p>
            <Details />
          </>
        )}

        {/* ── NOT COMPLETED ── */}
        {view === "ready" && (status === "failed" || status === "abandoned") && (
          <>
            <div className="pr-icon-circle pr-failed-circle"><span className="pr-icon">✕</span></div>
            <h1 className="pr-title">Payment not completed</h1>
            <p className="pr-sub">
              {order.failureReason || "The payment was not completed."} No money has been taken for this order.
            </p>
            <Details />
            <Link to="/" className="pr-btn-primary">Try again</Link>
          </>
        )}

        {/* ── REFUNDED ── */}
        {view === "ready" && status === "refunded" && (
          <>
            <h1 className="pr-title">Payment refunded</h1>
            <p className="pr-sub">This payment has been refunded. Refunds usually reach your account in 5–7 working days.</p>
            <Details />
          </>
        )}
      </div>
    </div>
  );
};

export default PaymentResult;
