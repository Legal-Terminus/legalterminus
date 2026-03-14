import React from "react";
import "./TrademarktoOppositionFeatures.css";
import featuresIllustration from "../../assets/tradelicense.jpg";

const TradeLicenseFeatures = () => {
  return (
    <section className="tlfx-section">
      <div className="tlfx-container">

        {/* Left graphic */}
        <div className="tlfx-illustration-wrap">
          <img
            src={featuresIllustration}
            alt="Types of Trade License"
            className="tlfx-illustration"
          />
        </div>

        {/* Right content */}
        <div className="tlfx-content">
          <h2 className="tlfx-title">
            Types of Trademark Opposition
          </h2>

          <p className="tlfx-intro">
            Trade Licenses can be registered in different categories based on the
            nature of business, operations, and applicable municipal regulations.
            Choosing the right type ensures legal compliance, smooth operations,
            and long-term business credibility.
          </p>

          <div className="tlfx-block">
            <h3 className="tlfx-subtitle">
              Shop and Establishment License
            </h3>
            <p className="tlfx-text">
              This is the most common form of trade license required for small
              shops, commercial establishments, and local service providers.
              It ensures that the business follows state-specific labor and
              operational regulations.
            </p>
          </div>

          <div className="tlfx-block">
            <h3 className="tlfx-subtitle">
              Industrial Trade License
            </h3>
            <p className="tlfx-text">
              This license is issued to manufacturing and production-based
              businesses operating within industrial zones. It ensures that the
              establishment meets environmental and safety norms.
            </p>
          </div>

          <div className="tlfx-block">
            <h3 className="tlfx-subtitle">
              Food and Health Trade License
            </h3>
            <p className="tlfx-text">
              Businesses involved in food processing, restaurants, and public
              health services require this license. It ensures compliance with
              hygiene, safety, and public health standards regulated by local
              authorities.
            </p>
          </div>

        </div>
      </div>
    </section>
  );
};

export default TradeLicenseFeatures;
