import React from "react";
import "./BCrequirment.css";

const BCBenefits = () => {
  return (
    <section className="opcben-section">
      <div className="opcben-container">
        <header className="opcben-header">
          <h2 className="opcben-title">
            Benefits of GS1 Barcode Registration in India
          </h2>
          <p className="opcben-subtitle">
            A GS1 barcode isn't a sticker — it's your product's passport to global retail. Here's what matters:
          </p>
        </header>

        <div className="opcben-grid">
          <article className="opcben-card">
            <h3 className="opcben-card-title">Modern Trade + E-Commerce Access</h3>
            <div className="opcben-card-underline" />
            <p className="opcben-card-text">
              Amazon, Flipkart, BigBasket, Blinkit, Zepto, Reliance Retail, DMart, More, Spencer's, Vishal Mega Mart — all require valid GS1 GTIN at product onboarding. No GTIN = no listing = no shelf space. The single most important supply-chain prerequisite for any consumer brand in India.
            </p>
          </article>

          <article className="opcben-card">
            <h3 className="opcben-card-title">Globally Unique Identification</h3>
            <div className="opcben-card-underline" />
            <p className="opcben-card-text">
              GS1 India GTINs are globally unique across 117+ countries and millions of trading partners. Your product is identifiable everywhere from a corner shop in Delhi to a Walmart in California. Critical for exports — DGFT and overseas customers accept only GS1 GTINs.
            </p>
          </article>

          <article className="opcben-card">
            <h3 className="opcben-card-title">MSME 80% Reimbursement</h3>
            <div className="opcben-card-underline" />
            <p className="opcben-card-text">
              Udyam-registered micro-manufacturers qualify for 80% reimbursement of GS1 India Registration + Annual Subscription fees for the first 3 years — up to Rs.50,650 in one go (Ministry of MSME). For a 100-barcode pack: effective cost drops from ~Rs.48k+ to under Rs.10k for the first 3 years. We file the claim for you.
            </p>
          </article>

          <article className="opcben-card">
            <h3 className="opcben-card-title">Supply Chain Traceability</h3>
            <div className="opcben-card-underline" />
            <p className="opcben-card-text">
              GTIN + GLN + SSCC together enable end-to-end traceability — from manufacturer to warehouse to retail shelf to consumer. Essential for food recalls (FSSAI), pharma serialisation (DCGI), institutional supplies (Government tenders), and modern 3PL logistics.
            </p>
          </article>

          <article className="opcben-card">
            <h3 className="opcben-card-title">DataKart — National Product Catalogue</h3>
            <div className="opcben-card-underline" />
            <p className="opcben-card-text">
              GS1 India runs DataKart, India's authoritative product information catalogue. Your product's GTIN + image + nutritional info is shared with onboarded retailers and the GS1 SmartConsumer app. Modern trade chains increasingly require DataKart presence.
            </p>
          </article>

          <article className="opcben-card">
            <h3 className="opcben-card-title">Export + DGFT Compliance</h3>
            <div className="opcben-card-underline" />
            <p className="opcben-card-text">
              Export consignments under DGFT increasingly require SSCC at carton / pallet level for shipment tracking. Customs systems globally read GS1 barcodes. International buyers (especially in EU, UK, US, Middle East) demand GS1 GTIN as a basic onboarding requirement. Supreme tier covers SSCC + export advisory.
            </p>
          </article>
        </div>
      </div>
    </section>
  );
};

export default BCBenefits;
