import React from "react";
import "./FoodLicenseGovtCosts.css";

const rows = [
  {
    category: "Basic Registration (Form A) — Elemental",
    eligibility: "Petty Retailer of snacks / tea shops + Hawker / Mobile food vendor",
    fee: "₹100",
  },
  {
    category: "Basic Registration (Form A) — Enriched",
    eligibility: "Other Petty FBOs — T/O up to ₹1.5 crore",
    fee: "₹100",
  },
  {
    category: "State License — Manufacturer / Re-labeler / Re-packer",
    eligibility: "₹1.5 Cr – ₹50 Cr",
    fee: "₹5,000",
  },
  {
    category: "State License — Hotel (3-star and below)",
    eligibility: "₹1.5 Cr – ₹50 Cr",
    fee: "₹5,000",
  },
  {
    category: "State License — Restaurant / Club / Caterer",
    eligibility: "₹1.5 Cr – ₹50 Cr",
    fee: "₹5,000",
  },
  {
    category: "State License — Storage / Wholesaler / Distributor / Retailer / Transporter",
    eligibility: "₹1.5 Cr – ₹50 Cr",
    fee: "₹5,000",
  },
  {
    category: "Central License",
    eligibility: "Turnover > ₹50 crore OR compulsory-Central category (importer / exporter / e-commerce / multi-state / 5-star / ports / airports / railways) — irrespective of turnover",
    fee: "₹7,500",
  },
];

const FoodLicenseGovtCosts = () => {
  return (
    <section className="opc-govtcosts-section">
      <div className="opc-govtcosts-container">
        <h2 className="opc-govtcosts-title">
          Indicative Government Fees
          <span className="opc-govtcosts-badge">Billed at Actuals</span>
        </h2>
        <p className="opc-govtcosts-subtitle">
          FSSAI government fees per the revised 2026 slabs — charged over and above our professional fee and billed at actuals on the FoSCoS portal.
        </p>

        <div className="opc-govtcosts-table-wrapper">
          <table className="opc-govtcosts-table">
            <thead>
              <tr>
                <th>FSSAI Category (Revised 2026)</th>
                <th>Eligibility (Turnover / Scale)</th>
                <th>Government Fee per Year</th>
              </tr>
            </thead>
            <tbody>
              {rows.map((row, i) => (
                <tr key={i}>
                  <td>{row.category}</td>
                  <td>{row.eligibility}</td>
                  <td className="opc-govtcosts-range">{row.fee}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </section>
  );
};

export default FoodLicenseGovtCosts;
