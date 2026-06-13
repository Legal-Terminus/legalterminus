import React from "react";
import "./PtoopcBreadcrum.css";
import "../OPCBreadcrum/OPCBreadcrum.css";
import ConsultationForm from '../ConsultationForm/ConsultationForm';

const PtoopcBreadcrum = () => {
  return (
    <section className="lt-public-hero">
      <div className="lt-public-container">

        <div className="lt-public-content">

          <span className="lt-public-tag">
            Proprietorship to OPC Conversion
          </span>

          <h1 className="lt-public-title">
            Convert Proprietorship to OPC
            <span className="lt-title-india"> in India</span>
            <br />
            <span className="lt-title-tagline">Stay Solo, Gain Limited Liability</span>
          </h1>

          <p className="lt-public-description">
            Run your business alone but want a corporate shield? Legal Terminus converts your sole proprietorship into a One Person Company (OPC) under the Companies Act, 2013 — incorporating a fresh OPC through SPICe+, with your nominee on record (Form INC-3), and transferring the proprietorship's assets and liabilities through a takeover agreement. You keep full control as the single owner, but gain limited liability and a separate legal identity. Our professional fee starts at ₹6,999 + GST. Government fees &amp; stamp duty are billed separately at actuals.
          </p>

          <div className="lt-public-features">
            <div className="lt-feature-item">Single Owner Keeps Full Control</div>
            <div className="lt-feature-item">Limited Liability &amp; Separate Legal Entity</div>
            <div className="lt-feature-item">SPICe+ Incorporation + Nominee (INC-3)</div>
            <div className="lt-feature-item">Business Takeover &amp; Registration Transfer</div>
          </div>

          <div className="lt-public-highlights">
            <div>
              <h3>3,000+</h3>
              <p>Conversions handled</p>
            </div>
            <div>
              <h3>100% Online</h3>
              <p>End-to-end MCA filing</p>
            </div>
            <div>
              <h3>7+</h3>
              <p>Years of Compliance Expertise</p>
            </div>
          </div>

        </div>

        <div id="ptoopc-consult-form">
          <ConsultationForm
            source="proprietorship-to-opc"
            subtitle="Talk to our OPC conversion expert"
          />
        </div>

      </div>
    </section>
  );
};

export default PtoopcBreadcrum;
