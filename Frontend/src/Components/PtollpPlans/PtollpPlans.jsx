import { useState } from "react";
import "./PtollpPlans.css";
import CheckoutModal from "../ProCheckoutModal/ProCheckoutModal";

const PLANS = [
  {
    id: "elemental",
    name: "Elemental",
    badge: "BASIC CONVERSION",
    oldPrice: 14999,
    price: 9999,
    services: [
      "Section 55 / Second Schedule eligibility audit",
      "Partnership Deed + Registration Certificate verification",
      "Name Search & Form RUN-LLP / FiLLiP Part A reservation",
      "DSC for all designated partners (Class 3, 2-year)",
      "DPIN allotment for designated partners (via FiLLiP)",
      "Capital Account → LLP Contribution mapping",
      "Form 17 — Application + Statement for conversion",
      "Audited Statement of Accounts review (not older than 30 days)",
      "All partners' consent + affidavits + declaration of solvency",
      "List of creditors with consent / NoCs",
      "Form FiLLiP — Incorporation form (filed alongside Form 17)",
      "PAN + TAN coordination",
      "Certificate of Incorporation as LLP delivery",
      "Form 14 — Notice to Registrar of Firms (within 15 days post-CoI)",
    ],
  },
  {
    id: "enriched",
    name: "Enriched",
    badge: "★ MOST POPULAR",
    popular: true,
    oldPrice: 22999,
    price: 14999,
    services: [
      "Everything in Elemental",
      "Custom LLP Agreement (capital + profit-share + decision rights)",
      "Form 3 — LLP Agreement drafting + filing (within 30 days of CoI)",
      "Partnership Firm's GST cancellation (Form REG-16)",
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
    oldPrice: 26499,
    price: 17999,
    services: [
      "Everything in Enriched",
      "Asset Transfer Agreement (Firm → LLP) — if needed beyond Second Schedule auto-vesting",
      "Statutory records setup (Minutes Book, Partners Register)",
      "Letterhead + invoice template (LLP format)",
      "Shop & Establishment registration migration",
      "Trade License amendment (Municipal Corporation)",
      "Annual ITR Filing — LLP (1st FY)",
      "Form 11 — LLP Annual Return Filing",
      "Form 8 — Statement of Account + Solvency Filing",
      "Designated Partner KYC (DIR-3 KYC) — 1 year",
      "90-day post-issuance senior-professional helpline",
    ],
  },
];

const PtollpPlans = () => {
  const [activePlan, setActivePlan] = useState(null);

  return (
    <>
      <section className="opc-pricing-section">
        <div className="opcpricing-container">

          <header className="opcpricing-header">
            <h2 className="opcpricing-title">CHOOSE YOUR PLAN</h2>
            <p className="opcpricing-subtitle">
              Convert your partnership into an LLP at pocket-friendly prices
            </p>
          </header>

          <div className="opcpricing-cards ptollp-cards-center">
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

                <div className="opcplan-footer">
                  <button
                    className={`opcplan-button${plan.popular ? " opcplan-button--popular" : ""}`}
                    onClick={() => setActivePlan(plan)}
                  >
                    Buy Now
                  </button>
                </div>
              </article>
            ))}
          </div>

        </div>
      </section>

      {activePlan && (
        <CheckoutModal plan={activePlan} onClose={() => setActivePlan(null)} source="partnership-to-llp" />
      )}
    </>
  );
};

export default PtollpPlans;
