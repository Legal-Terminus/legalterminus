import { useState } from "react";
import "../PubpvtPlans/PubpvtPlans.css";
import CheckoutModal from "../ProCheckoutModal/ProCheckoutModal";
import ConsultationModal from "../ConsultationModal/ConsultationModal";

const PLANS = [
  {
    id: "elemental",
    name: "Elemental",
    badge: "BASIC",
    oldPrice: 7999,
    price: 4999,
    services: [
      "Company name search & availability report",
      "1 RUN / SPICe+ name approval",
      "DIN for 2 directors",
      "Certificate of Incorporation (SPICe+)",
      "E-PAN, E-TAN, E-MOA & E-AOA",
      "Bank account opening documents",
      "Auditor appointment paperwork",
      "EPF & ESI registration",
    ],
  },
  {
    id: "enriched",
    name: "Enriched",
    badge: "★ MOST POPULAR",
    popular: true,
    oldPrice: 13999,
    price: 7999,
    services: [
      "Everything in Elemental",
      "Share certificates for shareholders",
      "Commencement of Business (INC-20A) documentation",
      "MSME / Udyam registration",
      "Statutory register set-up guidance",
    ],
  },
  {
    id: "supreme",
    name: "Supreme",
    badge: "✦ FULL FIRST-YEAR COMPLIANCE",
    oldPrice: 29999,
    price: 24999,
    services: [
      "Everything in Enriched",
      "Income tax filing for the company (1st FY)",
      "Directors' report & annual return preparation",
      "AGM / Board Meeting notice & extract preparation",
      "AOC-4, MGT-7 & ADT-1 filings",
      "DPT-3 & MSME-1 filings (if applicable)",
      "DIR-3 KYC for 2 directors",
      "Income tax filing for 2 directors",
      "Statutory e-register maintenance + 1st-year minutes",
    ],
  },
];

const CroPlans = () => {
  const [activePlan, setActivePlan] = useState(null);
  // #133: payment (Buy Now → CheckoutModal) is paused; the shared "Book Free
  // Consultation" button below opens the consultation popup instead.
  const [showConsult, setShowConsult] = useState(false);

  return (
    <>
      <section className="opc-pricing-section">
        <div className="opcpricing-container">

          <header className="opcpricing-header">
            <h2 className="opcpricing-title">CHOOSE YOUR PLAN</h2>
            <p className="opcpricing-subtitle">
              Register your company in Odisha at pocket-friendly prices — pick the plan that fits your stage
            </p>
          </header>

          <div className="opcpricing-cards pubpvt-cards-center">
            {PLANS.map((plan) => (
              <article
                key={plan.id}
                className={`opcplan-card${plan.popular ? " opcplan-card--popular" : ""}`}
              >
                <div>
                  <div className="opcplan-header">
                    {plan.badge && (
                      <div className={`opcplan-badge${plan.popular ? " opcplan-badge--popular" : ""}`}>
                        {plan.badge}
                      </div>
                    )}
                    <div className="opcplan-name">{plan.name}</div>
                    <div className="opcplan-old-price">₹{plan.oldPrice.toLocaleString("en-IN")}</div>
                    <div className="opcplan-price">₹{plan.price.toLocaleString("en-IN")}</div>
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
                    className={`opcplan-button${plan.popular ? " opcplan-button--popular" : ""}`}
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

        </div>
      </section>

      {activePlan && (
        <CheckoutModal plan={activePlan} onClose={() => setActivePlan(null)} source="company-registration-odisha" />
      )}

      <ConsultationModal
        open={showConsult}
        onClose={() => setShowConsult(false)}
        source="company-registration-odisha"
      />
    </>
  );
};

export default CroPlans;
