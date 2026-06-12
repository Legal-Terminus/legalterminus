import React from "react";
import "./GstFilingFeatures.css";

const types = [
  {
    number: "01",
    title: "GSTR-1 - Outward Supplies (Monthly / Quarterly)",
    text: "The foundational sales invoice return - every B2B / B2C / export / SEZ invoice issued during the period. Monthly filers: 11th of next month. QRMP filers: 13th of next month following the quarter. Hard-locks GSTR-3B Tables 3.1 + 3.2 from July 2025 - accuracy is non-negotiable. We file in Elemental / Enriched / Supreme / Supreme+.",
  },
  {
    number: "02",
    title: "GSTR-1A - Last-Minute Amendment",
    text: "Introduced July 2024. Optional form to add / amend / delete GSTR-1 invoices BEFORE filing GSTR-3B for the same period. Critical for fixing supplier errors without waiting for next month's GSTR-1 amendment. Filed as standard in Supreme and Supreme+.",
  },
  {
    number: "03",
    title: "GSTR-3B - Summary Return + Tax Payment (Monthly)",
    text: "Monthly summary return + tax payment due. From July 2025, Tables 3.1 (outward supplies) + 3.2 (inter-state to unregistered) are AUTO-POPULATED from GSTR-1 / GSTR-1A / IFF and HARD-LOCKED. Phase 2 (ITC Table 4 hard-lock) targeted July 2026. Due 20th / 22nd / 24th of next month depending on State + QRMP status.",
  },
  {
    number: "04",
    title: "GSTR-9 - Annual Return",
    text: "Annual consolidated return summarising the FY's GST activity - outward + inward supplies, tax paid, ITC availed, refund / demand, late-fee, etc. Mandatory for filers with turnover ABOVE Rs.2 crore (optional below, but recommended). Due 31 December of next FY. Included in Supreme+; separately quoted for other tiers.",
  },
  {
    number: "05",
    title: "GSTR-9C - Reconciliation Statement",
    text: "Self-certified reconciliation between GSTR-9 (GST returns) and the audited financial statements. Mandatory for filers with turnover ABOVE Rs.5 crore. Due 31 December of next FY (with GSTR-9). Add-on at Rs.7,500 per FY for Supreme+ subscribers (with CA's reconciliation working papers).",
  },
  {
    number: "06",
    title: "CMP-08 + GSTR-4 - Composition Scheme Returns",
    text: "For COMPOSITION SCHEME filers (turnover up to Rs.1.5 crore for goods / Rs.50 lakh for services). CMP-08 = quarterly statement of self-assessed tax (due 18th of next quarter month). GSTR-4 = annual return (due 30 April of next FY). Lighter regime; simpler returns; flat-rate tax. Specially quoted at Rs.499 / quarter.",
  },
  {
    number: "07",
    title: "GSTR-7 / GSTR-8 - TDS / TCS Returns",
    text: "GSTR-7: monthly TDS return by Government departments / PSUs / notified entities deducting GST TDS @ 2% on payments above Rs.2.5 lakh. GSTR-8: monthly TCS return by e-commerce operators collecting GST TCS @ 0.5% on supplier supplies. Both due 10th of next month. Supreme+ tier where applicable.",
  },
  {
    number: "08",
    title: "GSTR-5 / GSTR-5A / GSTR-6 / GSTR-10 / GSTR-11 - Specialised Returns",
    text: "GSTR-5: Non-resident taxable persons. GSTR-5A: OIDAR (online services from foreign suppliers). GSTR-6: Input Service Distributor (ISD) monthly return. GSTR-10: Final return after cancellation. GSTR-11: UIN-holders (Embassies / UN bodies / Consulates). Specialised filings - quoted on case basis.",
  },
];

const GstFilingFeatures = () => {
  return (
    <section className="opc-features-section">
      <div className="opc-features-container">

        <h2 className="opc-features-title">Types of GST Returns in India</h2>

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

export default GstFilingFeatures;
