import React from "react";
import "./BCtypes.css";

const types = [
  {
    number: "01",
    title: "EAN-13 Barcode",
    text: "The most widely used barcode in India and globally. EAN-13 encodes a 13-digit GTIN and is mandatory for all retail products sold in supermarkets, modern trade, and e-commerce platforms like Amazon and Flipkart. The prefix '890' identifies the product as registered through GS1 India.",
  },
  {
    number: "02",
    title: "UPC-A Barcode",
    text: "A 12-digit barcode primarily used for retail products exported to the USA, Canada, UK, and Australia. If you sell on Amazon.com or international retail chains, your products require UPC-A barcodes. GS1 India can issue GTINs compatible with UPC-A encoding.",
  },
  {
    number: "03",
    title: "GS1-128 & ITF-14 (Logistics Barcodes)",
    text: "Used for labelling cartons, pallets, and outer packaging in the supply chain. GS1-128 encodes additional data like batch number, expiry date, and serial number. ITF-14 is used on corrugated cartons (outer packaging). Both are mandatory for B2B logistics and distribution networks.",
  },
  {
    number: "04",
    title: "GS1 DataMatrix & Databar (Regulated Products)",
    text: "GS1 DataMatrix is a 2D barcode mandated for pharmaceutical products, medical devices, and fresh food under track-and-trace regulations. Databar is used for variable-measure items (fresh produce, deli products) where weight or price changes at every scan. Both can encode serial numbers and expiry dates.",
  },
];

const BCtypes = () => {
  return (
    <section className="opc-features-section">
      <div className="opc-features-container">

        <h2 className="opc-features-title">Types of GS1 Barcodes for Product Registration in India</h2>

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
