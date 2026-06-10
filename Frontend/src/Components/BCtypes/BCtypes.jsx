import React from "react";
import "./BCtypes.css";

const types = [
  {
    number: "01",
    title: "EAN-13 / GTIN-13 (Standard Product Barcode)",
    text: "The 13-digit linear barcode printed on consumer-facing product packaging worldwide. Default GTIN format issued by GS1 India for retail products. Scannable at every POS system globally. Covered under all plans — Elemental / Enriched / Supreme.",
  },
  {
    number: "02",
    title: "GTIN-14 (Outer Carton / Case Barcode)",
    text: "14-digit GTIN for shipping cases / cartons / multipacks (encoded as ITF-14 or GS1-128 barcode). Used by distributors, wholesalers, and modern trade chains for case-level scanning. Allocated from your GCP — we configure in Enriched / Supreme.",
  },
  {
    number: "03",
    title: "GTIN-8 (Small Item Barcode)",
    text: "8-digit GTIN for items too small for EAN-13 (e.g., small cosmetics, candies, single-use sachets). Allocated by GS1 India on application basis only — we file the GTIN-8 request in Enriched / Supreme tier where required.",
  },
  {
    number: "04",
    title: "GLN (Global Location Number)",
    text: "13-digit identifier for physical locations — factories, warehouses, distribution centres, branches, retail stores. Required for advanced supply chain traceability, EDI integration, and export logistics. Configured in Supreme tier for multi-location operators.",
  },
  {
    number: "05",
    title: "SSCC (Serial Shipping Container Code)",
    text: "18-digit unique identifier for each logistics unit (pallet, container) — tracks individual shipments end-to-end. Mandatory for export consignments under DGFT, modern trade DC operations, and 3PL logistics. Supreme tier.",
  },
  {
    number: "06",
    title: "2D Barcodes / QR Codes (GS1 DataMatrix, QR Code)",
    text: "Compact 2D codes encoding GTIN + additional data (batch, expiry, serial number). Already mandatory for Top 300 pharma brands in India since 1 Aug 2023 per DCGI Order. GS1 Sunrise 2027 will move retail globally to 2D / QR codes — Supreme tier includes transition advisory and DCGI compliance handling.",
  },
];

const BCtypes = () => {
  return (
    <section className="opc-features-section">
      <div className="opc-features-container">

        <h2 className="opc-features-title">Types of GS1 Barcode Registration in India</h2>

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

export default BCtypes;
