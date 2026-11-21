import { useState } from "react";
import "../PvtltdPlanandPricing/PvtltdPlanandPricing.css";
import CheckoutModal from "../ProCheckoutModal/ProCheckoutModal";
import ConsultationModal from "../ConsultationModal/ConsultationModal";
import CutPrice from "../CutPrice/CutPrice";
import { usePlans, PAYMENTS_ENABLED } from "../../utils/pricing";

// #241 (the firm, 21 Nov): the Odisha company pages are priced on their own.
// They sell `private-limited-odisha` — its own entry under Website Prices — so a
// price changed for the India-wide Private Limited page (PvtltdPlanandPricing,
// `private-limited`) no longer changes these pages, nor the other way round.
// The prices below are only the fallback and what the prerendered page shows;
// they start as the live Private Limited prices of 21 Nov, so nothing moved on
// the day the pages were split.
const DEFAULT_PLANS = [
  {
    id: "elemental",
    name: "Elemental",
    price: 5999, oldPrice: 7999,
    services: [
      "Name Search & Availability Report",
      "RUN Name Approval (up to 4 name choices)",
      "DIN for 2 Directors",
      "DSC for 2 Directors",
      "SPICe+ Part B + AGILE-PRO-S filing",
      "PAN + TAN application coordination",
      "Certificate of Incorporation (COI) delivery",
      "e-MOA & e-AOA Drafting",
      "EPF & ESI Registration",
      "1st Auditor Appointment Documents",
    ],
  },
  {
    id: "enriched",
    name: "Enriched",
    badge: "★ MOST POPULAR",
    popular: true,
    price: 9499, oldPrice: 13999,
    services: [
      "Everything in Elemental",
      "Bank Account Opening Documents",
      "Share Certificate",
      "Commencement of Business (INC-20A)",
      "Udyam / MSME Registration",
      "GST Registration Assistance",
    ],
  },
  {
    id: "supreme",
    name: "Supreme",
    price: 14999, oldPrice: 20999,
    services: [
      "Everything in Enriched",
      "The 1st Board Resolution documentation",
      "Annual ITR Filing — Company",
      "Financial Statements Filing — AOC-4",
      "Annual Return Filing — MGT-7",
      "Auditor Appointment Filing — ADT-1",
    ],
  },
  {
    id: "supreme-plus",
    name: "Supreme Plus",
    badge: "✦ FULL-SERVICE",
    fullService: true,
    price: 24999, oldPrice: 37499,
    services: [
      "Everything in Supreme",
      "Directors' Report Preparation",
      "Minutes of Board & General Meetings (1st FY)",
      "Statutory E-Register Maintenance",
      "DPT-3 & MSME-1 Filing (if applicable)",
      "ITR Filing for 2 Directors",
    ],
  },
];

const CroPlans = () => {
  // E24-S01: prices come from the server catalogue; DEFAULT_* is the fallback.
  const PLANS = usePlans("private-limited-odisha", DEFAULT_PLANS);
  const [activePlan, setActivePlan] = useState(null);
  // #133: payment (Buy Now → CheckoutModal) is paused; the shared "Book Free
  // Consultation" button below opens the consultation popup instead.
  const [showConsult, setShowConsult] = useState(false);

  return (
    <>
      <section className="pvtltd-pricing-section">
        <div className="pricing-container">

          <header className="pricing-header">
            <h2 className="PvtLtd-pricing-title">CHOOSE YOUR PLAN</h2>
            <p className="pricing-subtitle">
              Register your company in Odisha at pocket-friendly prices — pick the plan that fits your stage
            </p>
          </header>

          <div className="pricing-cards">
            {PLANS.map((plan) => (
              <article
                key={plan.id}
                className={`plan-card${plan.popular ? " plan-card--popular" : ""}${plan.fullService ? " plan-card--fullservice" : ""}`}
              >
                {plan.popular && <div className="plan-popular-badge">{plan.badge}</div>}
                {plan.fullService && <div className="plan-fullservice-badge">{plan.badge}</div>}
                <div>
                  <div className="plan-header">
                    <div className="plan-name">{plan.name}</div>
                    <CutPrice plan={plan} className="plan-old-price" />
                    <div className="plan-price">₹{plan.price.toLocaleString("en-IN")}</div>
                    <div className="plan-meta">+ Govt. fees &amp; GST extra</div>
                  </div>

                  <div className="plan-body">
                    <ul className="plan-list">
                      {plan.services.map((s, i) => (
                        <li key={i} className="plan-list-item">{s}</li>
                      ))}
                    </ul>
                  </div>
                </div>

                {/* #133: per-card "Buy Now" hidden while payment is paused. Kept in
                    place (not deleted) so it can be re-enabled later. */}
                {PAYMENTS_ENABLED && (
                <div className="plan-footer">
                  <button className="plan-button" onClick={() => setActivePlan(plan)}>Buy Now</button>
                </div>
                )}
              </article>
            ))}
          </div>

          {/* #133: one shared CTA below the plans — opens the consultation popup. */}
          <div className="consult-cta-row">
            <button
              type="button"
              className="consult-cta-button"
              onClick={() => setShowConsult(true)}
            >
              📅 Book Free Consultation
            </button>
          </div>

        </div>
      </section>

      {activePlan && (
        <CheckoutModal plan={activePlan} onClose={() => setActivePlan(null)} source="private-limited-odisha" />
      )}

      <ConsultationModal
        open={showConsult}
        onClose={() => setShowConsult(false)}
        source="company-registration-odisha"
        locationField="city"
        fixedState="Odisha"
      />
    </>
  );
};

export default CroPlans;
