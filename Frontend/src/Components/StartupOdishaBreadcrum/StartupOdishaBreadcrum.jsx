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
            Startup Odisha
            <span className="lt-title-india"> Recognition</span>
            <br />
            <span className="lt-public-subtitle">Capital Subsidy · Mentorship · Incubation</span>
          </h1>

          <p className="lt-public-description">
            Startup Odisha is the Government of Odisha's flagship initiative under the Odisha Startup Policy 2022 to build a vibrant startup ecosystem within the state. Registered startups get access to capital subsidies up to ₹50 lakhs, subsidised office space in STPI &amp; incubation centres, mentorship from industry leaders, regulatory fast-track, and priority access to government procurement. The registration process is managed through the Startup Odisha portal and is 100% online. Eligible entities include Private Limited Companies, LLPs, and Partnership Firms registered or incorporated in Odisha.
          </p>

          <div className="lt-public-features">
            <div className="lt-feature-item">Capital Subsidy up to ₹50 Lakhs</div>
            <div className="lt-feature-item">Subsidised Incubation Office Space</div>
            <div className="lt-feature-item">Mentor Network Access</div>
            <div className="lt-feature-item">Priority Government Procurement</div>
          </div>

          <div className="lt-public-highlights">
            <div>
              <h3>200+</h3>
              <p>Odisha startups supported</p>
            </div>
            <div>
              <h3>100% Online</h3>
              <p>Startup Odisha portal</p>
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
