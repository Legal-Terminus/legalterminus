import React from "react";
import "./ProPvtTypes.css";
import typesIllustration from "../../assets/pvtltd-types.png";

const PvtTypes = () => {
  return (
    <section className="pvt-types-section">
      <div className="pvt-types-container">

        <div className="pvt-types-illustration-wrap">
          <img
            src={typesIllustration}
            alt="Types of Proprietorship Firm"
            className="pvt-types-illustration"
          />
        </div>

        <div className="pvt-types-content">
          <h2 className="pvt-types-title">Types of Proprietorship Firm</h2>

          <div className="pvt-types-block">
            <h3 className="pvt-types-subtitle">Freelancer / Consultant Proprietorship</h3>
            <p className="pvt-types-text">
              For solo professionals — designers, developers, writers, consultants, marketers. Registration stack: MSME (Udyam) + Shop &amp; Est + GST (mandatory if turnover &gt; ₹20L services). Section 44ADA presumptive taxation typically applicable. Lowest cost, fastest setup.
            </p>
          </div>

          <div className="pvt-types-block">
            <h3 className="pvt-types-subtitle">E-commerce / Online Seller Proprietorship</h3>
            <p className="pvt-types-text">
              For Amazon / Flipkart / Meesho / Shopify sellers. Registration stack: MSME + Shop &amp; Est + GST (mandatory regardless of turnover for inter-state sellers under Section 24) + Trade Licence. Marketplace requires GSTIN matching bank + Aadhaar.
            </p>
          </div>

          <div className="pvt-types-block">
            <h3 className="pvt-types-subtitle">Trading / Retail Shop Proprietorship</h3>
            <p className="pvt-types-text">
              For brick-and-mortar shops, distributors, wholesalers. Registration stack: MSME + Shop &amp; Est + GST (if turnover &gt; ₹40L goods) + Trade Licence + Professional Tax. Section 44AD presumptive taxation typically applicable.
            </p>
          </div>

          <div className="pvt-types-block">
            <h3 className="pvt-types-subtitle">Manufacturing Proprietorship</h3>
            <p className="pvt-types-text">
              For micro-manufacturers, food processors, garment makers, artisans. Registration stack: MSME + Shop &amp; Est + GST + Trade Licence + Factory Licence (if applicable) + sectoral licences (BIS, FSSAI, drug).
            </p>
          </div>

          <div className="pvt-types-block">
            <h3 className="pvt-types-subtitle">Food Business Proprietorship</h3>
            <p className="pvt-types-text">
              For restaurants, cloud kitchens, food trucks, packaged food sellers. Registration stack: MSME + Shop &amp; Est + GST + FSSAI Basic / State / Central (turnover-based) + Trade Licence + Health Trade Licence (city-specific).
            </p>
          </div>

          <div className="pvt-types-block">
            <h3 className="pvt-types-subtitle">Professional Practice Proprietorship</h3>
            <p className="pvt-types-text">
              For doctors, CAs, lawyers, architects in solo practice. Registration stack: MSME + professional body registration (MCI / ICAI / BCI / COA) + GST (if turnover &gt; ₹20L) + Professional Tax. Section 44ADA presumptive (50% of receipts) typically applicable.
            </p>
          </div>

        </div>
      </div>
    </section>
  );
};

export default PvtTypes;
