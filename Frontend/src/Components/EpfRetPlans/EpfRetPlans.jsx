import { useState } from "react";
import "./EpfRetPlans.css";
import CheckoutModal from "../ProCheckoutModal/ProCheckoutModal";
import ConsultationModal from "../ConsultationModal/ConsultationModal";

// Every tier ships the same end-to-end monthly EPF compliance scope —
// only the covered headcount and price change between plans.
const SERVICES = [
  "Employee addition (Form 11 new joinee processing)",
  "KYC seeding (Aadhaar + PAN + Bank linkage to UAN)",
  "Form 5A submission",
  "eSign approval workflow coordination",
  "ECR statement preparation (member-wise wages + contributions)",
  "ECR upload on EPF portal (unifiedportal-emp.epfindia.gov.in)",
  "Acknowledgement (TRRN) delivery to client",
  "EPF contribution payment coordination",
  "Monthly filing by 15th of next month",
  "Late-fee ZERO promise (we file on time)",
];

const PLANS = [
  {
    id: "elemental",
    name: "ELEMENTAL",
    range: "Up to 10 Employees",
    oldPrice: 1499,
    price: 999,
    period: "/ mo",
    yearly: 10500,
    services: SERVICES,
  },
  {
    id: "enriched",
    name: "ENRICHED",
    range: "10 to 25 Employees",
    oldPrice: 2199,
    price: 1999,
    period: "/ mo",
    yearly: 21500,
    services: SERVICES,
  },
  {
    id: "supreme",
    name: "SUPREME",
    range: "25 to 50 Employees",
    oldPrice: 2999,
    price: 2999,
    period: "/ mo",
    yearly: 31500,
    services: SERVICES,
  },
];

const EpfRetPlans = () => {
  const [activePlan, setActivePlan] = useState(null);
  // #133: payment (Buy Now → CheckoutModal) is paused; the shared "Book Free
  // Consultation" button below opens the consultation popup instead.
  const [showConsult, setShowConsult] = useState(false);

  return (
    <>
      <section className="opc-pricing-section epfret-plans">
        <div className="opcpricing-container">

          <header className="opcpricing-header">
            <h2 className="opcpricing-title">CHOOSE YOUR PLAN</h2>
            <p className="opcpricing-subtitle">
              Keep your EPF compliance on track at pocket-friendly prices
            </p>
          </header>

          <div className="opcpricing-cards">
            {PLANS.map((plan) => (
              <article key={plan.id} className="opcplan-card">
                <div>
                  <div className="opcplan-header">
                    <div className="opcplan-name">{plan.name}</div>
                    <div className="epfplan-range">✦ {plan.range} ✦</div>
                    {plan.oldPrice > plan.price && (
                      <div className="opcplan-old-price">
                        ₹{plan.oldPrice.toLocaleString("en-IN")}/mo
                      </div>
                    )}
                    <div className="opcplan-price">
                      ₹{plan.price.toLocaleString("en-IN")}
                      <span style={{ fontSize: "0.5em", fontWeight: 500 }}> {plan.period}</span>
                    </div>
                    <div className="epfplan-yearly">
                      ₹{plan.yearly.toLocaleString("en-IN")} / year
                    </div>
                    <div className="opcplan-meta">+ Govt. fees &amp; GST extra</div>
                  </div>

                  <div className="opcplan-body">
                    <ul className="opcplan-list">
                      {plan.services.map((s, i) => (
                        <li key={i} className="opcplan-list-item">{s}</li>
                      ))}
                    </ul>
                  </div>
                </div>

                {/* #133: per-card "Buy Now" hidden while payment is paused. Kept in
                    place (not deleted) so it can be re-enabled later. */}
                {false && (
                <div className="opcplan-footer">
                  <button
                    className="opcplan-button"
                    onClick={() => setActivePlan(plan)}
                  >
                    Buy Now
                  </button>
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

          {/* Custom plan call-out for establishments above the SUPREME headcount */}
          <div className="epfplan-enterprise">
            <h3 className="epfplan-enterprise-title">
              ✶ Establishment with more than 50 employees? ✶
            </h3>
            <p className="epfplan-enterprise-text">
              Please reach out to us for a <strong>Custom Enterprise Plan</strong> tailored
              to your employee count, multi-branch presence, and compliance complexity.
              Drop us a note &amp; we&apos;ll structure a fit-for-purpose monthly engagement.
            </p>
          </div>

        </div>
      </section>

      {activePlan && (
        <CheckoutModal plan={activePlan} onClose={() => setActivePlan(null)} source="epf-return" />
      )}

      <ConsultationModal
        open={showConsult}
        onClose={() => setShowConsult(false)}
        source="epf-return"
      />
    </>
  );
};

export default EpfRetPlans;
