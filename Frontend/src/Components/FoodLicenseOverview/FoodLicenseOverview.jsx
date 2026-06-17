import React from "react";
import "./FoodLicenseOverview.css";
import illustration from "../../assets/whypvt-imp1.svg";

const categoryFees = [
  { category: "Basic Registration (Form A) — Elemental", eligibility: "Petty Retailer of snacks / tea shops + Hawker / Mobile food vendor", fee: "₹100" },
  { category: "Basic Registration (Form A) — Enriched", eligibility: "Other Petty FBOs — T/O up to ₹1.5 crore", fee: "₹100" },
  { category: "State License — Manufacturer / Re-labeler / Re-packer", eligibility: "₹1.5 Cr – ₹50 Cr", fee: "₹5,000" },
  { category: "State License — Hotel (3-star and below)", eligibility: "₹1.5 Cr – ₹50 Cr", fee: "₹5,000" },
  { category: "State License — Restaurant / Club / Caterer", eligibility: "₹1.5 Cr – ₹50 Cr", fee: "₹5,000" },
  { category: "State License — Storage / Wholesaler / Distributor / Retailer / Transporter", eligibility: "₹1.5 Cr – ₹50 Cr", fee: "₹5,000" },
  { category: "Central License", eligibility: "Turnover > ₹50 crore OR compulsory-Central category (importer / exporter / e-commerce / multi-state / 5-star / ports / airports / railways) — irrespective of turnover", fee: "₹7,500" },
];

const planComparison = [
  { param: "Form", elemental: "Form A", enriched: "Form A", supreme: "Form B", supremePlus: "Form B" },
  { param: "Govt Fee / Year", elemental: "₹100", enriched: "₹100", supreme: "₹2,000 – ₹5,000", supremePlus: "₹7,500" },
  { param: "Issuing Authority", elemental: "Designated Officer (state)", enriched: "Designated Officer (state)", supreme: "State Licensing Authority", supremePlus: "Central Licensing Authority" },
  { param: "Validity", elemental: "1–5 years; renewable", enriched: "1–5 years; renewable", supreme: "1–5 years; renewable", supremePlus: "1–5 years; renewable" },
  { param: "Annual Return", elemental: "Not required", enriched: "Not required", supreme: "FBOs engaged in manufacturing, importing, exporting, relabeling, or repacking", supremePlus: "FBOs engaged in manufacturing, importing, exporting, relabeling, or repacking" },
  { param: "Premises Inspection", elemental: "Risk-based", enriched: "Risk-based", supreme: "Risk-based", supremePlus: "Mandatory pre-license + risk-based ongoing" },
  { param: "FSMP / HACCP", elemental: "Not required", enriched: "Not required", supreme: "Recommended", supremePlus: "Mandatory" },
];

const FoodLicenseOverview = () => {
  return (
    <div className="opc-full-wrapper">

      <section className="opc-intro-section">
        <div className="opc-intro-container">
          <div className="opc-intro-illustration-wrap">
            <img
              src={illustration}
              alt="FSSAI Food License Registration illustration"
              className="opc-intro-illustration"
            />
          </div>

          <div className="opc-intro-content">
            <h2 className="opc-intro-title">
              Why You Need an FSSAI License
            </h2>
            <p className="opc-intro-text">
              An FSSAI License or Registration is mandatory for every food business in India under the Food Safety and Standards Act, 2006. Businesses involved in manufacturing, storing, transporting, distributing, selling, or serving food must obtain the appropriate FSSAI approval through the FoSCoS portal. Depending on your business type and turnover, you may require Basic Registration, a State License, or a Central License.
              <br /><br />
              An FSSAI License ensures legal compliance, builds customer trust, and enhances business credibility. It is often required for food delivery platforms, retail partnerships, exports, and government tenders. Operating without a valid FSSAI License may result in penalties and legal action.
            </p>
          </div>
        </div>
      </section>

      <section className="opc-urc-forms-section">
        <div className="opc-urc-forms-container">
          <h2 className="opc-urc-forms-title">
            FSSAI Categories + Government Fees (Revised 2026)
          </h2>
          <p className="opc-urc-forms-subtitle">
            The right category depends on your FBO type and annual turnover. Government fees are billed at actuals on the FoSCoS portal.
          </p>
          <div className="opc-urc-forms-table-wrapper">
            <table className="opc-urc-forms-table">
              <thead>
                <tr>
                  <th>FSSAI Category (Revised 2026)</th>
                  <th>Eligibility (Turnover / Scale)</th>
                  <th>Government Fee per Year</th>
                </tr>
              </thead>
              <tbody>
                {categoryFees.map((row, i) => (
                  <tr key={i}>
                    <td className="opc-urc-forms-form">{row.category}</td>
                    <td>{row.eligibility}</td>
                    <td>{row.fee}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </section>

      <section className="opc-compare-section">
        <div className="opc-compare-container">
          <h2 className="opc-compare-title">Govt Fee + Validity Comparison Across the 4 Plans</h2>
          <p className="opc-compare-subtitle">
            How the four FSSAI plans compare on form, fee, authority, validity, and compliance:
          </p>
          <div className="opc-compare-table-wrapper">
            <table className="opc-compare-table">
              <thead>
                <tr>
                  <th>Parameter</th>
                  <th>Elemental</th>
                  <th>Enriched</th>
                  <th>Supreme</th>
                  <th>Supreme Plus</th>
                </tr>
              </thead>
              <tbody>
                {planComparison.map((row, i) => (
                  <tr key={i}>
                    <td>{row.param}</td>
                    <td>{row.elemental}</td>
                    <td>{row.enriched}</td>
                    <td>{row.supreme}</td>
                    <td>{row.supremePlus}</td>
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

export default FoodLicenseOverview;
