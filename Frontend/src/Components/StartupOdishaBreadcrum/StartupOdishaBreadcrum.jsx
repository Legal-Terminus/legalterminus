import React from "react";
import "../Breadcrum/Breadcrum.css";
import ConsultationForm from "../ConsultationForm/ConsultationForm";

const StartupOdishaBreadcrum = () => {
  return (
    <section className="lt-public-hero">
      <div className="lt-public-container">

        <div className="lt-public-content">

          <span className="lt-public-tag">
            Startup Odisha Registration
          </span>

          <h1 className="lt-public-title">
            Startup Odisha Registration
            <br />
            <span className="lt-public-subtitle" style={{ fontSize: "38px" }}>Grow with Startup Odisha</span>
          </h1>

          <p className="lt-public-description">
            Startup Odisha Recognition is an official recognition issued by the Government of Odisha under the Startup Odisha initiative to support innovative and growth-oriented startups in the state. Recognized startups may become eligible for various state-level benefits, startup support schemes, mentoring opportunities, networking programs, and other incentives offered under the Odisha Startup Policy.
          </p>

          <p className="lt-public-description" style={{ marginTop: "12px" }}>
            We provide complete assistance for Startup Odisha registration, including eligibility review, startup profile drafting, document support, and application filing on the Startup Odisha portal.
          </p>

          <div className="lt-public-features">
            <div className="lt-feature-item">7-10 Day Recognition</div>
            <div className="lt-feature-item">Odisha-Cell Reviewed</div>
            <div className="lt-feature-item">Access Startup Odisha Schemes</div>
            <div className="lt-feature-item">Fully Online Registration Process</div>
          </div>

          <div className="lt-public-highlights">
            <div>
              <h3>500+</h3>
              <p>Startup Odisha applications filed</p>
            </div>
            <div>
              <h3>All 30 Districts</h3>
              <p>of Odisha covered</p>
            </div>
            <div>
              <h3>7+</h3>
              <p>Years of Legal Expertise</p>
            </div>
          </div>

        </div>

        <div id="startup-odisha-consult-form">
          <ConsultationForm
            source="startup-odisha"
            subtitle="Talk to our Startup Odisha Registration expert"
          />
        </div>

      </div>
    </section>
  );
};

export default StartupOdishaBreadcrum;
