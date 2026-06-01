import React from "react";
import "./ProPvtTypes.css";

const types = [
  {
    number: "01",
    title: "Freelancer / Consultant Proprietorship",
    text: "For solo professionals — designers, developers, writers, consultants, marketers. Registration stack: MSME (Udyam) + Shop & Est + GST (mandatory if turnover > ₹20L services). Section 44ADA presumptive taxation typically applicable. Lowest cost, fastest setup.",
  },
  {
    number: "02",
    title: "E-commerce / Online Seller Proprietorship",
    text: "For Amazon / Flipkart / Meesho / Shopify sellers. Registration stack: MSME + Shop & Est + GST (mandatory regardless of turnover for inter-state sellers under Section 24) + Trade Licence. Marketplace requires GSTIN matching bank + Aadhaar.",
  },
  {
    number: "03",
    title: "Trading / Retail Shop Proprietorship",
    text: "For brick-and-mortar shops, distributors, wholesalers. Registration stack: MSME + Shop & Est + GST (if turnover > ₹40L goods) + Trade Licence + Professional Tax. Section 44AD presumptive taxation typically applicable.",
  },
  {
    number: "04",
    title: "Manufacturing Proprietorship",
    text: "For micro-manufacturers, food processors, garment makers, artisans. Registration stack: MSME + Shop & Est + GST + Trade Licence + Factory Licence (if applicable) + sectoral licences (BIS, FSSAI, drug).",
  },
  {
    number: "05",
    title: "Food Business Proprietorship",
    text: "For restaurants, cloud kitchens, food trucks, packaged food sellers. Registration stack: MSME + Shop & Est + GST + FSSAI Basic / State / Central (turnover-based) + Trade Licence + Health Trade Licence (city-specific).",
  },
  {
    number: "06",
    title: "Professional Practice Proprietorship",
    text: "For doctors, CAs, lawyers, architects in solo practice. Registration stack: MSME + professional body registration (MCI / ICAI / BCI / COA) + GST (if turnover > ₹20L) + Professional Tax. Section 44ADA presumptive (50% of receipts) typically applicable.",
  },
];

const PvtTypes = () => {
  return (
    <section className="opc-features-section">
      <div className="opc-features-container">

        <h2 className="opc-features-title">Types of Proprietorship Firm</h2>

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

export default PvtTypes;
