import { useState } from "react";
import "./LtopvtPlans.css";
import CheckoutModal from "../ProCheckoutModal/ProCheckoutModal";

const PLANS = [
  {
    id: "elemental",
    name: "Elemental",
    badge: "BASIC",
    oldPrice: 22499,
    price: 14999,
    services: [
      "Section 366 eligibility audit + URC-1 path advisory",
      "LLP active-status verification (Form 8 + Form 11 currency check)",
      "LLP Agreement + supplementary deeds review",
      "Name Search & SPICe+ Part A Name Reservation (up to 4 names)",
      "DSC for all partner-directors (DPIN-linked where existing)",
      "DIN for non-DPIN partners (via SPICe+)",
      "Capital Contribution → Share Capital mapping",
      "Partner-to-shareholder allotment schedule",
      "Form URC-2 Newspaper Advertisement — drafting + publication coordination",
      "(English + vernacular — 21-day objection window managed)",
      "Form URC-1 application drafting + filing on MCA portal",
      "All partners' consents + affidavits + declaration of solvency",
      "List of partners + creditors + LLP's audited statement of accounts",
      "MOA + AOA drafting (standard Pvt Ltd template)",
      "Form INC-9 (Declaration) by Directors + Subscribers",
      "SPICe+ Part B + AGILE-PRO-S filing alongside URC-1",
      "PAN + TAN coordination",
      "Certificate of Incorporation (under Sec 367) delivery",
    ],
  },
  {
    id: "enriched",
    name: "Enriched",
    badge: "★ MOST POPULAR",
    popular: true,
    oldPrice: 32999,
    price: 21999,
    services: [
      "Everything in Elemental",
      "LLP's GST cancellation (Form REG-16)",
      "Fresh GST registration under Pvt Ltd (Form REG-01)",
      "ITC carry-forward via Form ITC-02 (transfer of business)",
      "Corporate Bank Account Opening Documents",
      "1st Board Resolution documentation",
      "First Auditor Appointment Filing — ADT-1",
      "Share Certificate issuance (to each partner per allotment)",
      "Commencement of Business filing (INC-20A)",
      "Udyam / MSME Registration migration",
      "60-day post-incorporation advisory",
    ],
  },
  {
    id: "supreme",
    name: "Supreme",
    badge: "✦ 6-MONTH SERVICE",
    oldPrice: 47999,
    price: 31999,
    services: [
      "Everything in Enriched",
      "Statutory registers (members / directors / charges)",
      "Letterhead + invoice template",
      "Final Form 8 + Form 11 for the LLP",
      "LLPIN cancellation + ROC clearance",
      "Annual ITR Filing — Company (1st FY)",
      "Financial Statements Filing — AOC-4 (with CFS)",
      "Annual Return Filing — MGT-7 (full Pvt Ltd format)",
      "Auditor Appointment Filing — ADT-1",
      "90-day post-issuance senior-CS helpline",
    ],
  },
  {
    id: "supreme-plus",
    name: "Supreme Plus",
    badge: "✦ FULL-SERVICE 12-MONTH",
    oldPrice: 67499,
    price: 44999,
    services: [
      "Everything in Supreme",
      "Directors' Report preparation",
      "Documents preparation for 1st AGM (statutory format)",
      "List of Shareholders + List of Directors (statutory format)",
      "Minutes of Board & General Meetings (1st FY)",
      "Trademark Assignment (LLP → Pvt Ltd) via Form TM-P",
      "Director KYC (DIR-3 KYC) — all directors, 1 year",
      "Shop & Establishment registration migration",
      "Trade License amendment (Municipal Corporation)",
      "Asset Transfer Agreement (LLP → Pvt Ltd)",
      "12-month MCA compliance package",
      "Statutory auditor liaison + audit support",
      "Senior CA + Company Secretary-led monthly review",
    ],
  },
];

const LtopvtPlans = () => {
  const [activePlan, setActivePlan] = useState(null);

  return (
    <>
      <section className="opc-pricing-section">
        <div className="opcpricing-container">

          <header className="opcpricing-header">
            <h2 className="opcpricing-title">CHOOSE YOUR PLAN</h2>
            <p className="opcpricing-subtitle">
              Convert your LLP into a Pvt Ltd at pocket-friendly prices
            </p>
          </header>

          <div className="opcpricing-cards ltopvt-cards-center">
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
        <CheckoutModal plan={activePlan} onClose={() => setActivePlan(null)} source="llp-to-private" />
      )}
    </>
  );
};

export default LtopvtPlans;
