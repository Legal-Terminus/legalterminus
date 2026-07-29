import React, { useState } from "react";
import "../ProFOPCPlanandPricing/ProFOPCPlanandPricing.css";
import CheckoutModal from "../ProCheckoutModal/ProCheckoutModal";
import ConsultationModal from "../ConsultationModal/ConsultationModal";

const PLANS = [
  {
    id: "elemental",
    name: "Elemental",
    badge: "* BASIC",
    oldPrice: 18999,
    price: 13999,
    services: [
      "Section 14 eligibility audit + conversion path advisory",
      "Board Meeting + EGM notice & documentation",
      "Special Resolution drafting (conversion to Private)",
      "Alteration of MOA + AOA (private company restrictions)",
      "Form MGT-14 filing with the RoC",
      "Form INC-25A newspaper advertisement - drafting",
      "(English + vernacular - 21-day objection window managed)",
      "Individual notices to creditors / debenture holders",
      "Notices to the RoC + Regional Director",
      "Form RD-1 APPLICATION drafting + filing with the RD",
      "Liaison with the Regional Director till order",
      "Form INC-28 filing of RD order with the RoC",
      "Fresh Certificate of Incorporation (Private status)",
      "Updated PAN + company master data",
    ],
  },
  {
    id: "enriched",
    name: "Enriched",
    badge: "* MOST POPULAR",
    oldPrice: 24499,
    price: 19999,
    services: [
      "Everything in Elemental",
      "Creditor / member consent management",
      "Declaration of solvency + list of creditors",
      "Updated statutory registers (members / directors / charges)",
      "Share certificate re-issuance under new status",
      "Bank record + GST profile update coordination",
      "Updated letterhead + invoice format (Pvt Ltd)",
      "Director KYC (DIR-3 KYC) - 2 directors",
      "60-day post-conversion compliance advisory",
    ],
  },
  {
    id: "supreme",
    name: "Supreme",
    badge: "* FULL-SERVICE 12-MONTH",
    oldPrice: 34499,
    price: 24999,
    services: [
      "Everything in Enriched",
      "Annual ITR Filing - Company (1st FY)",
      "Financial Statements Filing - AOC-4",
      "Annual Return Filing - MGT-7",
      "Auditor Appointment Filing - ADT-1",
      "Directors' Report + Minutes of Board & General Meetings",
      "Maintenance of statutory e-registers (1st FY)",
      "DPT-3 / MSME-1 filing (if applicable)",
      "Income Tax Filing of 2 Directors",
      "90-day post-conversion senior-CS helpline",
    ],
  },
];

const PricingSection = () => {
  const [activePlan, setActivePlan] = useState(null);
  // #133: payment (Buy Now → CheckoutModal) is paused; the shared "Book Free
  // Consultation" button below opens the consultation popup instead.
  const [showConsult, setShowConsult] = useState(false);

  return (
    <>
      <section className="profopc-pricing-section">
        <div className="profopc-pricing-container">
          <header className="profopc-pricing-header">
            <h2 className="profopc-pricing-title">CHOOSE YOUR PLAN</h2>
            <p className="profopc-pricing-subtitle">
              Convert your Public Limited Company to Private with transparent pricing
            </p>
          </header>

          <div className="profopc-pricing-cards">
            {PLANS.map((plan) => (
              <article key={plan.id} className="profopc-plan-card">
                <div>
                  <div className="profopc-plan-header">
                    {plan.badge && (
                      <div className="profopc-plan-badge">{plan.badge}</div>
                    )}
                    <div className="profopc-plan-name">{plan.name}</div>
                    <div className="profopc-plan-old-price">₹{plan.oldPrice.toLocaleString("en-IN")}</div>
                    <div className="profopc-plan-price">₹{plan.price.toLocaleString("en-IN")}</div>
                    <div className="profopc-plan-meta">+ Govt. fees & GST extra</div>
                  </div>

                  <div className="profopc-plan-body">
                    <ul className="profopc-plan-list">
                      {plan.services.map((service, idx) => (
                        <li key={idx} className="profopc-plan-list-item">
                          {service}
                        </li>
                      ))}
                    </ul>
                  </div>
                </div>

                {/* #133: per-card "Buy Now" hidden while payment is paused. Kept in
                    place (not deleted) so it can be re-enabled later. */}
                {false && (
                <div className="profopc-plan-footer">
                  <button
                    className="profopc-plan-button"
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
        <CheckoutModal
          plan={activePlan}
          onClose={() => setActivePlan(null)}
          source="public-to-private"
        />
      )}

      <ConsultationModal
        open={showConsult}
        onClose={() => setShowConsult(false)}
        source="public-to-private"
      />
    </>
  );
};

export default PricingSection;
