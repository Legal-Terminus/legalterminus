import React from "react";
import "./BCcompany.css";
import illustration from "../../assets/whypvt-imp.svg";

const BCcompany = () => {
  return (
    <div className="opc-full-wrapper">

      {/* SECTION 1 — INTRO */}
      <section className="opc-intro-section">
        <div className="opc-intro-container">
          <div className="opc-intro-illustration-wrap">
            <img
              src={illustration}
              alt="GS1 Barcode Registration illustration"
              className="opc-intro-illustration"
            />
          </div>

          <div className="opc-intro-content">
            <h2 className="opc-intro-title">
              Why GS1 Barcode Registration Matters for Your Business
            </h2>
            <p className="opc-intro-text">
              A barcode is not just a black-and-white stripe on your product — it is a globally unique digital identity issued by GS1 India, the only authorised body in India under the GS1 global network. Before you can list products on Amazon, Flipkart, Reliance Smart, or export to international retail chains, your products must carry a GS1-standard barcode with a valid Company Prefix linked to your GSTIN.
              <br /><br />
              Without GS1 registration, your products cannot be scanned at Point of Sale (POS) systems, cannot be accepted by major e-commerce marketplaces, and are ineligible for supply chain tracking across supermarkets and distributors. The GS1 Company Prefix also ensures that your barcode is globally unique — no two products in the world share the same GTIN, preventing product identity fraud and enabling authentic product verification.
            </p>
          </div>
        </div>
      </section>

      {/* SECTION 2 — COMPARISON TABLE */}
      <section className="opc-compare-section">
        <div className="opc-compare-container">
          <h2 className="opc-compare-title">GS1 Registered vs Unregistered: The Honest Comparison</h2>
          <p className="opc-compare-subtitle">
            What happens when you sell without a valid GS1 barcode:
          </p>
          <div className="opc-compare-table-wrapper">
            <table className="opc-compare-table">
              <thead>
                <tr>
                  <th>Parameter</th>
                  <th>GS1 Registered</th>
                  <th>No GS1 / Fake Barcode</th>
                </tr>
              </thead>
              <tbody>
                <tr><td>Amazon / Flipkart Listing</td><td>Accepted — GTIN verified</td><td>Rejected or suppressed</td></tr>
                <tr><td>Supermarket / Retail POS</td><td>Scans correctly at checkout</td><td>Scan error — product unsellable</td></tr>
                <tr><td>Global Uniqueness</td><td>100% unique GTIN worldwide</td><td>Risk of GTIN collision / fraud</td></tr>
                <tr><td>Export / International Trade</td><td>Accepted by all GS1-compliant chains</td><td>Rejected by importers and customs</td></tr>
                <tr><td>Supply Chain Tracking</td><td>Full track &amp; trace capability</td><td>No traceability — manual errors</td></tr>
                <tr><td>Annual Renewal</td><td>Required — keeps GTIN active</td><td>N/A — barcodes may be deactivated</td></tr>
                <tr><td>Setup Cost (typical)</td><td>₹10,000 – ₹25,000 / year</td><td>₹500 – ₹2,000 (illegal / non-GS1)</td></tr>
              </tbody>
            </table>
          </div>
        </div>
      </section>

    </div>
  );
};

export default BCcompany;
