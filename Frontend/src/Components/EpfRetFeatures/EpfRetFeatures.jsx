import React from "react";
import "./EpfRetFeatures.css";

const types = [
  {
    number: "01",
    title: "Employee Addition (Form 11 New Joinee Processing)",
    text: "When a new employee joins, we process Form 11 (Member self-declaration) — capturing previous PF history, existing UAN if any, KYC documents, nominee details. Uploaded to the EPF portal at joining. Determines whether contributions start (covered employee) or excluded employee status applies.",
  },
  {
    number: "02",
    title: "KYC Seeding (Aadhaar + PAN + Bank to UAN)",
    text: "KYC linkage of each member's UAN with Aadhaar + PAN + Bank account (with IFSC). Mandatory for any future PF withdrawal / transfer / pension / EDLI insurance claim. We drive completion + clear seeding errors monthly so members face no blockers when they need their PF.",
  },
  {
    number: "03",
    title: "Form 5A — Annual Return by Owners / Partners / Directors",
    text: "Form 5A is the annual return capturing the ownership + management structure of the establishment — owners, partners, directors, authorised signatories. Filed on the EPF portal once per FY (and amended on changes). Outdated / non-filed Form 5A flags the establishment for EPFO verification.",
  },
  {
    number: "04",
    title: "eSign Approval Workflow Coordination",
    text: "Every ECR + portal submission requires digital approval by an AUTHORISED SIGNATORY using DSC or Aadhaar-based e-Sign. We coordinate the eSign workflow each month — prep the form, route it to your signatory, confirm successful approval, then submit. No fumbling at the portal.",
  },
  {
    number: "05",
    title: "ECR Statement Preparation (Member-Wise Wages + Contributions)",
    text: "The Electronic Challan-cum-Return is generated from your monthly wage register: member-wise wages, EPS 8.33% capped portion, EPF 3.67% balance, EDLI 0.5%, Admin charges 0.5%, total challan amount. We validate every member's wage data, compute the contributions, and prepare the ECR file in EPFO portal format.",
  },
  {
    number: "06",
    title: "ECR Upload on EPF Portal",
    text: "ECR file uploaded on the EPFO Unified Portal. Portal validates the file. Challan amount confirmed. Done before the 15th-of-next-month deadline. We file on time, every month.",
  },
  {
    number: "07",
    title: "Acknowledgement (TRRN) Delivery to Client",
    text: "Once ECR is uploaded, the portal generates a TRRN (Temporary Return Reference Number) — the acknowledgement of filing + the reference for payment. We deliver the TRRN to you the same day with payment instructions. Clear paper-trail for every month's filing.",
  },
  {
    number: "08",
    title: "EPF Contribution Payment Coordination",
    text: "We coordinate the payment of the PF contribution to EPFO using the TRRN — via Internet Banking (SBI / HDFC / ICICI / Axis / Kotak / other empanelled banks) OR NEFT / RTGS. We track payment confirmation + share the FINAL PF CHALLAN once EPFO reconciles. Payment treated as deposited on the date of credit to EPFO.",
  },
];

const EpfRetFeatures = () => {
  return (
    <section className="opc-features-section">
      <div className="opc-features-container">

        <h2 className="opc-features-title">Types of EPF Return Filing in India</h2>

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

export default EpfRetFeatures;
