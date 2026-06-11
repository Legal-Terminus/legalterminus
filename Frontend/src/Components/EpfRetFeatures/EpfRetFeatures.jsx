import React from "react";
import "./EpfRetFeatures.css";

const types = [
  {
    number: "01",
    title: "Monthly ECR Filing",
    text: "The Electronic Challan-cum-Return (ECR) is the core monthly filing. Uploaded on the EPFO Unified Portal, it declares each member's UAN, wages, and contributions for the month. Once the ECR is uploaded and verified, a challan (TRRN) is generated and the dues are paid online — all by the 15th of the following month.",
  },
  {
    number: "02",
    title: "UAN & KYC Management",
    text: "Every member needs a Universal Account Number (UAN), generated for new joiners and seeded with KYC — Aadhaar, PAN, and bank details — and approved by the employer. Accurate UAN/KYC is what lets contributions reflect correctly in the member's passbook and enables smooth withdrawals, advances, and transfers.",
  },
  {
    number: "03",
    title: "Annual Return & Reconciliation",
    text: "While most reporting is now monthly via ECR, employers maintain member-wise annual reconciliation of contributions (historically Forms 3A and 6A). This involves tallying twelve months of deposits against wages, resolving mismatches, and ensuring each member's annual statement is accurate for audit and settlement.",
  },
];

const EpfRetFeatures = () => {
  return (
    <section className="opc-features-section">
      <div className="opc-features-container">

        <h2 className="opc-features-title">Key Components of EPF Return Filing</h2>

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
