import React from "react";
import "./FoodLicenseBreadcrum.css";
import "../OPCBreadcrum/OPCBreadcrum.css";
import ConsultationForm from '../ConsultationForm/ConsultationForm';

const FoodLicenseBreadcrum = () => {
  return (
    <section className="lt-public-hero">
      <div className="lt-public-container">

        <div className="lt-public-content">

          <span className="lt-public-tag">
            Food License Registration
          </span>

          <h1 className="lt-public-title">
            Food License Registration
            <span className="lt-title-india"> in India</span>
            <br />
            <span className="lt-title-tagline">Start Your Food Business with FSSAI</span>
          </h1>

          <p className="lt-public-description">
            Food License Registration in India is mandatory for every Food Business Operator (FBO) involved in manufacturing, storing, distributing, transporting, or selling food products. Whether you run a restaurant, cloud kitchen, bakery, food stall, café, home kitchen, catering business, food manufacturing unit, or import/export business, obtaining an FSSAI License under the Food Safety and Standards Act, 2006 is essential for legal operations in India.
            <br /><br />
            We help you choose and file the correct FSSAI category — Basic Registration, State License, or Central License — based on your business type and annual turnover through the official FoSCoS portal (https://foscos.fssai.gov.in). Our team handles documentation, application filing, and complete support until your 14-digit FSSAI License number is issued.
          </p>

          <div className="lt-public-features">
            <div className="lt-feature-item">FoSCoS Filed</div>
            <div className="lt-feature-item">14-Digit License</div>
            <div className="lt-feature-item">Renewal Calendar</div>
            <div className="lt-feature-item">All FBO Categories</div>
          </div>

          <div className="lt-public-highlights">
            <div>
              <h3>3,200+</h3>
              <p>Food licenses filed</p>
            </div>
            <div>
              <h3>All 3 Categories</h3>
              <p>Basic + State + Central</p>
            </div>
            <div>
              <h3>7+</h3>
              <p>Years of Legal Expertise</p>
            </div>
          </div>

        </div>

        <div id="fl-consult-form">
          <ConsultationForm
            source="food-license-fssai"
            subtitle="Talk to our FSSAI registration expert"
          />
        </div>

      </div>
    </section>
  );
};

export default FoodLicenseBreadcrum;
