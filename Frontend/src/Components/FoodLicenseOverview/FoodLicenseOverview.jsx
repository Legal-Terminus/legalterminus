import React from "react";
import "./FoodLicenseOverview.css";
import illustration from "../../assets/whypvt-imp1.svg";

const tierMapping = [
  { plan: "ELEMENTAL (₹999)", category: "Basic Registration (Form A)", eligibility: "Petty Retailer of snacks / tea shops + Hawker (itinerant / mobile food vendor) ONLY" },
  { plan: "ENRICHED (₹2,999)", category: "Basic Registration (Form A)", eligibility: "OTHER Petty FBOs — home bakers, kirana food sellers, tiffin services, small caterers, small manufacturers etc. — T/O up to ₹1.5 crore" },
  { plan: "SUPREME (₹3,999)", category: "State Licence (Form B)", eligibility: "Restaurants, mid manufacturers, distributors, hotels (3-star and below), storage, transporters — T/O ₹1.5 Cr to ₹50 Cr" },
  { plan: "SUPREME PLUS (₹7,999)", category: "Central Licence (Form B)", eligibility: "T/O > ₹50 Cr OR compulsory-Central category — importers, exporters, e-commerce FBOs, multi-state operators, 5-star hotels, ports / airports / railways — IRRESPECTIVE of turnover" },
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
            FSSAI Tier Mapping: Basic vs State vs Central + Our 4 Plans
          </h2>
          <p className="opc-urc-forms-subtitle">
            Here's how our 4 plans map to the FSSAI categorisation under the FSS (Licensing and Registration of Food Businesses) Amendment Regulations 2026:
          </p>
          <div className="opc-urc-forms-table-wrapper">
            <table className="opc-urc-forms-table">
              <thead>
                <tr>
                  <th>Plan</th>
                  <th>FSSAI Category + Form</th>
                  <th>Eligibility / Who It's For</th>
                </tr>
              </thead>
              <tbody>
                {tierMapping.map((row, i) => (
                  <tr key={i}>
                    <td className="opc-urc-forms-form">{row.plan}</td>
                    <td>{row.category}</td>
                    <td>{row.eligibility}</td>
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
