import React from "react";
import "./EsiRetBreadcrum.css";
import "../OPCBreadcrum/OPCBreadcrum.css";
import ConsultationForm from '../ConsultationForm/ConsultationForm';

const EsiRetBreadcrum = () => {
  return (
    <section className="lt-public-hero">
      <div className="lt-public-container">

        <div className="lt-public-content">

          <span className="lt-public-tag">
            ESI Return Filing
          </span>

          <h1 className="lt-public-title">
            ESI Return Filing
            <span className="lt-title-india"> in India</span>
            <br />
            <span className="lt-title-tagline">Filed by the 15th. Every month</span>
          </h1>

          <p className="lt-public-description">
            Managing ESI compliance every month can be time-consuming — especially when employee additions, exits, contribution calculations, and filing deadlines all need to be handled accurately. Legal Terminus makes the process simple. We manage your complete ESI Return Filing cycle, including employee registration, exit updates, monthly contribution filing, challan sharing, payment coordination, and compliance tracking — all filed before the due date on the official ESIC portal. Our focused team helps your business stay compliant while ensuring employees continue receiving uninterrupted ESI benefits. Plans start from ₹999 per month (or ₹10,500 yearly) + GST.
          </p>

          <div className="lt-public-features">
            <div className="lt-feature-item">Filed by 15th</div>
            <div className="lt-feature-item">Challan Mailed</div>
            <div className="lt-feature-item">History Shared</div>
            <div className="lt-feature-item">Payment Coordinated</div>
          </div>

          <div className="lt-public-highlights">
            <div>
              <h3>500+</h3>
              <p>Monthly ESI contributions filed</p>
            </div>
            <div>
              <h3>All Establishment Sizes</h3>
              <p>Up to 50 employees standard; 50+ custom</p>
            </div>
            <div>
              <h3>7+</h3>
              <p>Years of Compliance Expertise</p>
            </div>
          </div>

        </div>

        <div id="esiret-consult-form">
          <ConsultationForm
            source="esi-return"
            subtitle="Talk to our ESI compliance expert"
          />
        </div>

      </div>
    </section>
  );
};

export default EsiRetBreadcrum;
