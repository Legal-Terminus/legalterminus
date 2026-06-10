import React from "react";
import "./TradeLicenseOverview.css";
import tradeIllustration from "../../assets/whypvt-imp1.svg"; // Replace with your actual image if needed

const TradeLicenseOverview = () => {
  return (
    <div className="trade-full-wrapper">

      {/* ===========================
          SECTION 1 — INTRO
      ============================ */}
      <section className="trade-intro-section">
        <div className="trade-intro-container">
          {/* Illustration */}
          <div className="trade-intro-illustration-wrap">
            <img
              src={tradeIllustration}
              alt="Trade License illustration"
              className="trade-intro-illustration"
            />
          </div>

          {/* Text */}
          <div className="trade-intro-content">
            <h2 className="trade-intro-title">
              Why You Need a Trade License
            </h2>
            <p className="trade-intro-text">
              A Trade License is an official approval issued by the Municipal Corporation or local authority that allows a business to operate legally from a specific location. It is commonly required for shops, offices, restaurants, clinics, factories, warehouses, and other commercial establishments to ensure compliance with local regulations and safety standards.
            </p>
            <p className="trade-intro-text">
              Operating without a valid Trade License may lead to penalties or regulatory issues. Since licensing requirements vary based on business activity and location, we help you identify the correct category, prepare the application, and obtain the license smoothly.
            </p>
          </div>
        </div>
      </section>
    </div>
  );
};

export default TradeLicenseOverview;
