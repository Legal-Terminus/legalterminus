import React from "react";
import "./GstFilingElegibility.css";

const steps = [
  {
    title: "Data Hand-Off (You → Us)",
    day: "Day 1-3",
    text: "First 3 days of each month: share your previous month's outward register (sales invoices / credit notes / debit notes / export invoices / SEZ supplies) + inward register (purchase invoices) + e-way bill data + expense vouchers + bank statement. Standard formats: Excel / Tally export / Zoho / QuickBooks / SAP / Marg JSON. Onboarded clients use our secure portal upload.",
  },
  {
    title: "Sales Register Validation + GSTR-1 Drafting",
    day: "Day 4-5",
    text: "We validate every outward invoice - GSTIN of buyer (live API check), HSN / SAC code, place of supply, tax rate, invoice number sequence (Rule 46 CGST Rules), reverse-charge / export / SEZ classification. GSTR-1 drafted in portal format. Reconciliation against your sales register + e-way bill data.",
  },
  {
    title: "IMS Action (Supreme / Supreme+)",
    day: "Day 6-7",
    text: "Login to Invoice Management System on the GST portal. Review all supplier invoices that have flowed into your IMS dashboard. ACCEPT genuine invoices, REJECT incorrect / fraudulent ones, KEEP PENDING the ones needing supplier clarification. This drives your GSTR-2B + ITC claim.",
  },
  {
    title: "GSTR-1 Filing + GSTR-1A Corrections",
    day: "Day 8-10",
    text: "GSTR-1 filed by Day 10 (well before the 11th deadline). If buyer or supplier reports an error post-filing (within the same month), GSTR-1A is filed as last-minute amendment before GSTR-3B (Supreme / Supreme+ included). Reach-out to buyers / suppliers for any contested invoices.",
  },
  {
    title: "GSTR-2B Auto-Generation + Purchase Register Reconciliation",
    day: "Day 11-14",
    text: "On Day 14, GST portal auto-generates your GSTR-2B (the read-only ITC statement). We reconcile GSTR-2B vs your Purchase Register (Supreme / Supreme+): matched invoices (eligible ITC), unmatched invoices (your supplier hasn't filed - chase), excess invoices (booking errors).",
  },
  {
    title: "GSTR-3B Drafting + Tax Liability Computation",
    day: "Day 15-18",
    text: "GSTR-3B drafted - Tables 3.1, 3.2 (auto-populated, hard-locked from GSTR-1 / GSTR-1A / IFF), Table 4 (ITC manually populated for now), Tables 5, 6.1 (tax payable + paid). Tax challan computed - cash ledger vs credit ledger optimisation. Reconciliation against your books finalised.",
  },
  {
    title: "GSTR-3B Filing + Tax Payment",
    day: "Day 19-20",
    text: "GSTR-3B filed and tax paid by Day 20 (Day 22 / Day 24 for QRMP filers depending on State). PMT-06 challan generated and paid via net banking / UPI / NEFT / RTGS. Filing acknowledgement archived. Cash + credit ledger updated.",
  },
  {
    title: "Monthly Compliance Dashboard + Challan delivered",
    day: "Day 21-30",
    text: "Monthly compliance dashboard updated - filings filed, tax paid, ITC claimed, ledger balances, IMS pending. Quarterly: GST council briefing. Annual (Sep-Dec): GSTR-9 + GSTR-9C cycle (Supreme+). Challan and Acknowledgement delivered via mail.",
  },
];

const GstFilingElegibility = () => {
  return (
    <section className="opcelg-wrapper">
      <h2 className="opcelg-heading">
        Steps for GST Return Filing in India
      </h2>
      <p className="opcelg-subheading">
        Eight steps, repeated every filing period. Reconciled, reviewed, and filed before the due date — every time.
      </p>

      <div className="opcelg-timeline">
        <div className="opcelg-timeline-line" />

        {steps.map((step, index) => (
          <div
            key={index}
            className={`opcelg-timeline-item ${index % 2 === 0 ? "left" : "right"} ${index === 0 ? "first" : ""} ${index === steps.length - 1 ? "last" : ""}`}
          >
            <div className="opcelg-timeline-dot">{index + 1}</div>

            <div className="opcelg-timeline-card">
              <h4>
                {step.title}
                {step.day && <span className="opcelg-day-tag">{step.day}</span>}
              </h4>
              <p>{step.text}</p>
            </div>
          </div>
        ))}
      </div>
    </section>
  );
};

export default GstFilingElegibility;
