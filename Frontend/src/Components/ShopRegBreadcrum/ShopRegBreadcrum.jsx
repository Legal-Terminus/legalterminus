import React from "react";
import "../EPFRegBreadcrum/EPFRegBreadcrum.css";
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
            <span className="lt-public-subtitle">Quick &amp; Hassle-Free Shop Act Registration</span>
          </h1>

          <p className="lt-public-description">
            Shop &amp; Establishment Registration is one of the basic labour law registrations required for businesses operating from a commercial establishment in India, including shops, offices, restaurants, startups, IT companies, hotels, and other commercial entities. The registration is governed by the respective State Shop &amp; Establishment Act and helps businesses maintain legal compliance related to working hours, employee records, wages, leave policies, and workplace conditions.
            <br /><br />
            We provide complete assistance for Shop &amp; Establishment Registration, including application filing on the respective State Labour Department portal, document preparation, registration certificate support, and compliance guidance.
          </p>

          <div className="lt-public-features">
            <div className="lt-feature-item">Labour Compliance</div>
            <div className="lt-feature-item">Online Registration</div>
            <div className="lt-feature-item">Multi-State Support</div>
            <div className="lt-feature-item">Fast Processing</div>
          </div>

          <div className="lt-public-highlights">
            <div>
              <h3>4,000+</h3>
              <p>SHOP &amp; ESTABLISHMENT registrations filed</p>
            </div>
            <div>
              <h3>28 States + 8 UTs</h3>
              <p>all state portals covered</p>
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
