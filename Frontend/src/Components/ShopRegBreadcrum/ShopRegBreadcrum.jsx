import React from "react";
import "../Breadcrum/Breadcrum.css";
import ConsultationForm from "../ConsultationForm/ConsultationForm";

const ShopRegBreadcrum = () => {
  return (
    <section className="lt-public-hero">
      <div className="lt-public-container">

        {/* LEFT CONTENT */}
        <div className="lt-public-content">

          <span className="lt-public-tag">
            Shop &amp; Commercial Establishments Registration
          </span>

          <h1 className="lt-public-title">
            Shop &amp; Commercial Establishments Registration
            <span className="lt-title-india"> in India</span>
            <br />
            <span className="lt-public-subtitle">Fast, Secure &amp; 100% Online</span>
          </h1>

          <p className="lt-public-description">
            The Shop &amp; Commercial Establishments Act is a state-level labour law that mandates every shop, office, hotel, restaurant, warehouse, and place of public entertainment to register with the local government authority. The registration certificate is your business's first official identity — required for opening a current bank account, obtaining GST, applying for trade licences, and qualifying for MSME / Udyam benefits. Government fee in Odisha is capped at ₹600 per branch per year. Registration is 100% online in most states.
          </p>

          <div className="lt-public-features">
            <div className="lt-feature-item">State Government Certificate</div>
            <div className="lt-feature-item">Legal Business Identity</div>
            <div className="lt-feature-item">Labour Law Compliance</div>
            <div className="lt-feature-item">Bank Account &amp; GST Ready</div>
          </div>

          <div className="lt-public-highlights">
            <div>
              <h3>500+</h3>
              <p>Establishments registered</p>
            </div>
            <div>
              <h3>All States</h3>
              <p>Pan-India coverage</p>
            </div>
            <div>
              <h3>7+</h3>
              <p>Years of Legal Expertise</p>
            </div>
          </div>

        </div>

        {/* RIGHT FORM */}
        <div id="shop-consult-form">
          <ConsultationForm
            source="shop-establishment"
            subtitle="Talk to our Shop & Establishment registration expert"
          />
        </div>

      </div>
    </section>
  );
};

export default ShopRegBreadcrum;
