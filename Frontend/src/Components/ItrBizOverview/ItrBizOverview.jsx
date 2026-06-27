import React from "react";
import "./ItrBizOverview.css";
import illustration from "../../assets/whypvt-imp1.svg";

const formMatrix = [
  { entity: "PROPRIETOR (Individual / HUF)", regular: "ITR-3", presumptive: "ITR-4 (Sugam) - if T/o up to Rs.2 Cr" },
  { entity: "PARTNERSHIP FIRM", regular: "ITR-5", presumptive: "ITR-4 (Sugam) - if T/o up to Rs.2 Cr (eligible)" },
  { entity: "Section 44AA Books Required?", regular: "YES (if income > Rs.1.2L or T/o > Rs.10L)", presumptive: "NO (Section 44AA exemption)" },
  { entity: "Tax Rate", regular: "Slab rates (proprietor) / Flat 30% (PF)", presumptive: "Same - applied on deemed profit" },
  { entity: "Partner Remuneration / Interest (PF)", regular: "Section 40(b) deductible to firm", presumptive: "NOT deductible under presumptive (post 2016)" },
  { entity: "Section 194T TDS on partner payments (PF)", regular: "Applicable (FY 2025-26 onwards)", presumptive: "Applicable" },
];

const ItrBizOverview = () => {
  return (
    <div className="opc-full-wrapper">

      <section className="opc-intro-section">
        <div className="opc-intro-container">
          <div className="opc-intro-illustration-wrap">
            <img
              src={illustration}
              alt="Business Income Tax Return Filing illustration"
              className="opc-intro-illustration"
            />
          </div>

          <div className="opc-intro-content">
            <h2 className="opc-intro-title">
              Why Business ITR Filing Matters
            </h2>
            <p className="opc-intro-text">
              A Sole Proprietorship and a Partnership Firm are taxed differently under the Income Tax Act, making it essential to choose the correct ITR form and tax treatment. Proprietorship income is taxed as the owner's personal income through ITR-3 or ITR-4, while a Partnership Firm is treated as a separate taxable entity and generally files its return through ITR-5 or ITR-4, subject to applicable tax provisions and compliance requirements.
              <br /><br />
              At Legal Terminus, we provide affordable Business ITR Filing services for both Proprietorships and Partnership Firms, including return filing, financial statement preparation, bookkeeping, and compliance support. Our experts ensure accurate filing, timely submissions, and complete assistance to keep your business tax-compliant and hassle-free.
            </p>
          </div>
        </div>
      </section>

      <section className="opc-compare-section">
        <div className="opc-compare-container">
          <h2 className="opc-compare-title">ITR Form Selection Matrix - Proprietor + Partnership Firm</h2>
          <div className="opc-compare-table-wrapper">
            <table className="opc-compare-table">
              <thead>
                <tr>
                  <th>Entity Type</th>
                  <th>Regular Books</th>
                  <th>Presumptive Scheme (Sec 44AD/44ADA/44AE)</th>
                </tr>
              </thead>
              <tbody>
                {formMatrix.map((row, i) => (
                  <tr key={i}>
                    <td>{row.entity}</td>
                    <td>{row.regular}</td>
                    <td>{row.presumptive}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </section>

    </div>
  );
};

export default ItrBizOverview;
