import React from "react";
import "./TrademarktoOppositionOverview.css";
import tradeIllustration from "../../assets/whypvt-imp1.svg";

const TradeLicenseOverview = () => {
  return (
    <div className="tlo-wrapper">

      {/* ===========================
          SECTION 1 — INTRO
      ============================ */}
      <section className="tlo-intro-section">
        <div className="tlo-intro-container">

          <div className="tlo-intro-illustration-wrap">
            <img
              src={tradeIllustration}
              alt="Trade License illustration"
              className="tlo-intro-illustration"
            />
          </div>

          <div className="tlo-intro-content">
            <h2 className="tlo-intro-title">
              Why Choose Trademark Opposition
            </h2>

            <p className="tlo-intro-text">
              Trademark Opposition is an important step to protect your brand identity. If a similar or identical trademark is published in the Trademark Journal, you have the legal right to oppose it. This process allows you to prevent other businesses from registering a mark that may create confusion or affect your brand reputation.
              <br /><br />
              Filing a trademark opposition helps protect your existing trademark rights and ensures that no conflicting brand names are registered. It also maintains the uniqueness of your brand in the market. By taking timely action, businesses can avoid future legal disputes and protect their brand value and credibility.
            </p>
          </div>
        </div>
      </section>

      {/* ===========================
          SECTION 2 — GOVERNING ACT
      ============================ */}
      <section className="tlo-act-section">
        <div className="tlo-act-container">
          <div className="tlo-act-card">
            <h3 className="tlo-act-title">Municipal Trade License Act</h3>

            <p className="tlo-act-text">
              As per the local municipal regulations, every business entity engaged in trade or
              commerce must obtain a valid Trade License before commencing operations.
            </p>

            <p className="tlo-act-point">
              <span className="tlo-act-point-label">(a)</span>
              Provides legal approval to operate within city limits under applicable laws;
            </p>

            <p className="tlo-act-point">
              <span className="tlo-act-point-label">(b)</span>
              Ensures business activities adhere to health, safety, and environmental standards; and
            </p>

            <p className="tlo-act-point">
              <span className="tlo-act-point-label">(c)</span>
              Protects public interest while promoting fair and ethical business practices.
            </p>
          </div>
        </div>
      </section>
    </div>
  );
};

export default TradeLicenseOverview;
