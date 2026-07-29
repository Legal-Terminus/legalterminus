import { useState } from "react";
import "./PvtllpPlans.css";
import CheckoutModal from "../ProCheckoutModal/ProCheckoutModal";
import ConsultationModal from "../ConsultationModal/ConsultationModal";

const PLANS = [
  {
    id: "elemental",
    name: "Elemental",
    badge: "BASIC CONVERSION",
    oldPrice: 14999,
    price: 9999,
    services: [
      "Section 56 / Third Schedule eligibility audit",
      "No-security-interest verification (creditor list review)",
      "All-shareholders-become-partners compliance check",
      "Section 47(xiiib) Income-tax eligibility check (T/O + assets thresholds)",
      "Board Resolution + Shareholders' consent drafting",
      "Name Search & Form RUN-LLP / FiLLiP Part A reservation",
      "DSC for all designated partners (Class 3, 2-year)",
      "DPIN allotment for designated partners (via FiLLiP)",
      "Shareholding → LLP Contribution proportionality mapping",
      "Form 18 — Application + Statement for conversion",
      "Audited Statement of Accounts review (not older than 30 days)",
      "List of creditors with consent / NoCs",
      "Form FiLLiP — Incorporation form (filed alongside Form 18)",
      "PAN + TAN coordination",
      "Certificate of Incorporation as LLP delivery",
      "Form 14 — Notice to ROC about conversion (within 15 days post-CoI)",
    ],
  },
  {
    id: "enriched",
    name: "Enriched",
    badge: "★ MOST POPULAR",
    popular: true,
    oldPrice: 22499,
    price: 14999,
    services: [
      "Everything in Elemental",
      "Custom LLP Agreement (capital + profit-share + decision rights)",
      "Form 3 — LLP Agreement drafting + filing (within 30 days of CoI)",
      "Section 47(xiiib) STRUCTURING NOTE — 5-year profit-share lock-in advisory",
      "Pvt Ltd's GST cancellation (Form REG-16)",
      "Fresh GST registration under LLP (Form REG-01)",
      "ITC carry-forward via Form ITC-02 (transfer of business)",
      "Corporate Bank Account Opening Documents",
      "Designated Partner consent + KYC pack for bank",
      "Udyam / MSME Registration migration (if applicable)",
      "60-day post-conversion advisory",
    ],
  },
  {
    id: "supreme",
    name: "Supreme",
    badge: "✦ FULL TRANSITION + 6-MONTH",
    oldPrice: 34499,
    price: 22999,
    services: [
      "Everything in Enriched",
      "Letterhead + invoice template (LLP format)",
      "Statutory records setup (Minutes Book, Partners Register)",
      "Asset Transfer Agreement (Pvt Ltd → LLP) where needed beyond auto-vesting",
      "Shop & Establishment registration migration",
      "Trade License amendment (Municipal Corporation)",
      "Annual ITR Filing — LLP (1st FY)",
      "Form 11 — LLP Annual Return Filing",
      "Form 8 — Statement of Account + Solvency Filing",
      "Statutory audit support (if turnover > ₹40 lakh or contribution > ₹25 lakh)",
      "Designated Partner KYC (DIR-3 KYC) — 1 year",
      "Section 47(xiiib) 5-year lock-in monitoring + advisory",
      "90-day post-issuance senior-CS helpline",
    ],
  },
];

const PvtllpPlans = () => {
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
              Convert your Private Limited Company into an LLP at pocket-friendly prices
            </p>
          </header>

          <div className="opcpricing-cards pvtllp-cards-center">
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
        <CheckoutModal plan={activePlan} onClose={() => setActivePlan(null)} source="private-to-llp" />
      )}

      <ConsultationModal
        open={showConsult}
        onClose={() => setShowConsult(false)}
        source="private-to-llp"
      />
    </>
  );
};

export default PvtllpPlans;
