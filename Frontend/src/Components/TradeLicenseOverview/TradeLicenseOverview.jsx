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
              Why Choose Trade License Registration in India
            </h2>
            <p className="trade-intro-text">
              Trade License is issued by the local municipal corporation to a person/organization in order to commence business activity/operations. This license empowers an organization only to carry on the business activity for which it is granted and it does not empower any transfer of property. The license can be issued to an individual having no criminal record, has attained the age of 18 and wishes to carry on a legal business activity. Below are some frequently asked questions related to trade license registration:
            </p>
          </div>
        </div>
      </section>

      {/* ===========================
          SECTION 2 — GOVERNING ACT
      ============================ */}
      <section className="trade-act-section">
        <div className="trade-act-container">
          <h3 className="trade-act-title">Municipal Trade License Regulation</h3>
          <div className="trade-act-card">
            <p className="trade-act-text">
              As per local municipal rules, every business involved in trade or commercial activity must obtain a valid Trade License before starting operations.
            </p>

            <p className="trade-act-point">
              <span className="trade-act-point-label">(a)</span>
              Grants legal permission to run the business within municipal/city limits;
            </p>

            <p className="trade-act-point">
              <span className="trade-act-point-label">(b)</span>
              Ensures the business follows basic health, safety, and environmental guidelines; and
            </p>

            <p className="trade-act-point">
              <span className="trade-act-point-label">(c)</span>
              Helps maintain fair business practices while protecting public interest.
            </p>
          </div>
        </div>
      </section>
    </div>
  );
};

export default TradeLicenseOverview;
