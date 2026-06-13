import React, { useState } from "react";
import "./ProFOPCPlanandPricing.css";
import CheckoutModal from "../ProCheckoutModal/ProCheckoutModal";

const PLANS = [
  {
    id: "elemental",
    name: "Elemental",
    badge: "* BASIC",
    oldPrice: 18999,
    price: 13999,
    services: [
      "Section 366 eligibility audit + URC-1 path advisory",
      "Name Search & SPICe+ Part A Name Reservation (up to 4 names)",
      "DSC for proposed Director + Nominee",
      "DIN for proposed Director (via SPICe+)",
      "Form URC-2 NEWSPAPER ADVERTISEMENT - drafting",
      "(English + vernacular - 21-day objection window managed)",
      "Affidavits, consents, declaration of solvency",
      "List of members / creditors + audited statement of accounts",
      "MOA + AOA drafting (standard OPC template)",
      "Form INC-3 (Nominee Consent) + INC-9 (Declaration)",
      "SPICe+ Part B + AGILE-PRO-S filing alongside URC-1",
      "Form URC-1 APPLICATION drafting + filing on MCA portal",
      "PAN + TAN coordination",
      "Certificate of Incorporation (under Sec 367) delivery",
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
      "Proprietorship GST cancellation (Form REG-16)",
      "Fresh GST registration under OPC (Form REG-01)",
      "ITC carry-forward via Form ITC-02 (transfer of business)",
      "Corporate Bank Account Opening Documents",
      "1st Board Resolution documentation",
      "First Auditor Appointment Filing - ADT-1",
      "Share Certificate issuance",
      "Commencement of Business filing (INC-20A)",
      "Udyam / MSME Registration migration",
      "60-day post-incorporation advisory",
    ],
  },
  {
    id: "supreme",
    name: "Supreme",
    badge: "* 6-MONTH SERVICE",
    oldPrice: 34499,
    price: 24999,
    services: [
      "Everything in Enriched",
      "Statutory registers (members / directors / charges)",
      "Letterhead + invoice template (OPC format)",
      "Annual ITR Filing - Company (1st FY)",
      "Financial Statements Filing - AOC-4",
      "Annual Return Filing - MGT-7A (OPC simplified)",
      "Auditor Appointment Filing in 1st AGM - ADT-1",
      "Proprietorship winding-up + bank closure pack",
      "90-day post-issuance senior-CS helpline",
    ],
  },
  {
    id: "supreme-plus",
    name: "Supreme Plus",
    badge: "* FULL-SERVICE 12-MONTH",
    oldPrice: 52499,
    price: 34999,
    services: [
      "Everything in Supreme",
      "Directors' Report preparation",
      "Documents preparation for 1st AGM (OPC waiver attested)",
      "List of Shareholders + List of Directors (statutory format)",
      "Minutes of Board & General Meetings (1st FY)",
      "Director KYC (DIR-3 KYC) - 1 year",
      "12-month MCA compliance package",
      "Shop & Establishment registration migration",
      "Trade License amendment (Municipal Corporation)",
      "Trademark Assignment (Proprietorship -> OPC) via Form TM-P",
      "Asset Transfer Agreement (Proprietorship -> OPC)",
      "Statutory auditor liaison + audit support",
      "Senior CA + Company Secretary-led monthly review",
    ],
  },
];

const PricingSection = () => {
  const [activePlan, setActivePlan] = useState(null);

  return (
    <>
      <section className="profopc-pricing-section">
        <div className="profopc-pricing-container">
          <header className="profopc-pricing-header">
            <h2 className="profopc-pricing-title">CHOOSE YOUR PLAN</h2>
            <p className="profopc-pricing-subtitle">
              Convert your proprietorship to OPC with transparent pricing
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

                <div className="profopc-plan-footer">
                  <button
                    className="profopc-plan-button"
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
        <CheckoutModal
          plan={activePlan}
          onClose={() => setActivePlan(null)}
          source="proprietorship-to-opc"
        />
      )}
    </>
  );
};

export default PricingSection;
