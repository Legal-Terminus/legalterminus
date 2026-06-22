import React from "react";
import "./AfcFeatures.css";

const types = [
  {
    number: "01",
    title: "Active Pvt Ltd — In-House CS + Auditor",
    text: "Your company is actively operating with in-house CS handling secretarial documents + statutory auditor already engaged delivering audited financials — you just need form filing services. Elemental tier files all 8 forms (AOC-4 + MGT-7 + ADT-1 + DPT-3 + MSME-1 + DIR-3 KYC + ITR-6) with DSC affixation + Govt fee + acknowledgement. Common for established companies with dedicated compliance teams.",
  },
  {
    number: "02",
    title: "Active Pvt Ltd — Needs Secretarial Support",
    text: "Your company has its own accountant + auditor delivering financials, but needs corporate-secretarial support for AGM season — Board Report drafting + AGM Notice + Directors/Shareholders lists + Auditor Appointment documents + minutes + resolutions. Enriched tier handles secretarial drafting + form filing. AVAILABLE FOR COMPANIES OF ANY TURNOVER SIZE.",
  },
  {
    number: "03",
    title: "Small / Growing Company — End-to-End",
    text: "Your company has TURNOVER UNDER ₹1 CRORE + you want end-to-end annual compliance — bookkeeping + financial statements + statutory audit + secretarial docs + all filings. Supreme tier covers everything with audit by LT's panel CA or your existing auditor. Most common scenario for first-2-year startups + small founder-led companies.",
  },
  {
    number: "04",
    title: "Tax-Audit Applicable Company — T/o > ₹1 Cr",
    text: "Your company's turnover crosses ₹1 CRORE — Tax Audit under Section 44AB of the Income Tax Act triggers. This is OUT OF SCOPE of the standard 3-tier plans — we quote it as a custom engagement covering 3CD/3CB tax audit form filing + tax audit by LT's associated CA + DSC procurement + all annual filings + premium CA coordination. Reach out for a tailored quote.",
  },
  {
    number: "05",
    title: "Dormant / Inactive Company — Still Mandatory",
    text: "Your company has done little or no business activity — but ALL FILINGS REMAIN MANDATORY. Even Section 455 'Dormant Company' status (separate filing in Form MSC-1) doesn't exempt from annual returns. Statutory audit still required (zero-revenue P&L + nominal Balance Sheet). Many founders learn this only after Section 164(2) disqualification threatens.",
  },
  {
    number: "06",
    title: "OPC (One Person Company) — Simplified Filings",
    text: "OPCs have lighter filing burden: Form MGT-7A (instead of MGT-7) + AOC-4 within 180 days of FY end (not 30 days post AGM) + no AGM mandatory. Statutory audit still mandatory. All 3 tiers handle OPC specifics. Recommend Supreme for OPCs without dedicated accounting setup + turnover under ₹1 Cr.",
  },
];

const AfcFeatures = () => {
  return (
    <section className="opc-features-section">
      <div className="opc-features-container">

        <h2 className="opc-features-title">Types of Annual Filing for Company in India</h2>

        <div className="opc-features-cards">
          {types.map((type) => (
            <div className="opc-features-card" key={type.number}>
              <div className="opc-features-number">{type.number}</div>
              <h3 className="opc-features-card-title">{type.title}</h3>
              <p className="opc-features-card-text">{type.text}</p>
            </div>
          ))}
        </div>

      </div>
    </section>
  );
};

export default AfcFeatures;
