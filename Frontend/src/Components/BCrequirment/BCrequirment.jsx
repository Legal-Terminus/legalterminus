import React from "react";
import "./BCrequirment.css";

const BCBenefits = () => {
  return (
    <section className="opcben-section">
      <div className="opcben-container">
        <header className="opcben-header">
          <h2 className="opcben-title">
            Benefits of GS1 Barcode Registration for Your Business
          </h2>
          <p className="opcben-subtitle">
            GS1 barcode registration is not just a compliance step — it opens your products to every major retail platform, supply chain, and export market in the world.
          </p>
        </header>

        <div className="opcben-grid">
          <article className="opcben-card">
            <h3 className="opcben-card-title">Mandatory for Amazon, Flipkart &amp; Retail Listing</h3>
            <div className="opcben-card-underline" />
            <p className="opcben-card-text">
              Amazon India, Flipkart, and most organised retail chains require a valid GS1 GTIN for every product listing. Without a GS1-registered barcode, your product catalogue cannot be listed, and existing listings may be suppressed or removed.
            </p>
          </article>

          <article className="opcben-card">
            <h3 className="opcben-card-title">Globally Unique Product Identity</h3>
            <div className="opcben-card-underline" />
            <p className="opcben-card-text">
              Each GS1 GTIN is unique across the entire world — no two products share the same barcode. This prevents product identity confusion, enables accurate billing at POS systems, and protects your brand from counterfeit product scanning.
            </p>
          </article>

          <article className="opcben-card">
            <h3 className="opcben-card-title">Streamlined Inventory &amp; Warehouse Management</h3>
            <div className="opcben-card-underline" />
            <p className="opcben-card-text">
              GS1 barcodes allow real-time tracking of stock levels, batch numbers, and expiry dates across your warehouse. Integration with ERP and WMS systems becomes seamless, reducing manual entry errors and enabling just-in-time restocking.
            </p>
          </article>

          <article className="opcben-card">
            <h3 className="opcben-card-title">Supply Chain Visibility &amp; Traceability</h3>
            <div className="opcben-card-underline" />
            <p className="opcben-card-text">
              GS1-128 and ITF-14 barcodes on outer packaging enable full track-and-trace from manufacturer to retailer. Distributors and logistics partners can scan carton-level codes to verify delivery, reducing disputes and theft in the supply chain.
            </p>
          </article>

          <article className="opcben-card">
            <h3 className="opcben-card-title">Export Readiness &amp; International Compliance</h3>
            <div className="opcben-card-underline" />
            <p className="opcben-card-text">
              GS1 is the global standard accepted in 115+ countries. A GS1-registered GTIN makes your products importable by foreign retailers and compliant with international trade regulations — essential for export to the EU, USA, Middle East, and South-East Asia.
            </p>
          </article>

          <article className="opcben-card">
            <h3 className="opcben-card-title">Anti-Counterfeiting &amp; Brand Protection</h3>
            <div className="opcben-card-underline" />
            <p className="opcben-card-text">
              GS1 barcodes can be serialised to create unique identifiers per product unit. Consumers and retailers can verify authenticity by scanning the barcode against the GS1 India registry (GEPIR), reducing the risk of counterfeit products reaching your customers.
            </p>
          </article>
        </div>
      </div>
    </section>
  );
};

export default BCBenefits;
