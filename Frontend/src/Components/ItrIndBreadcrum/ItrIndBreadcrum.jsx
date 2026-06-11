import React from "react";
import "./ItrIndBreadcrum.css";
import "../OPCBreadcrum/OPCBreadcrum.css";
import ConsultationForm from '../ConsultationForm/ConsultationForm';

const ItrIndBreadcrum = () => {
  return (
    <section className="lt-public-hero">
      <div className="lt-public-container">

        <div className="lt-public-content">

          <span className="lt-public-tag">
            Individual Income Tax Return Filing
          </span>

          <h1 className="lt-public-title">
            ITR Filing for Individuals
            <span className="lt-title-india"> in India</span>
            <br />
            <span className="lt-title-tagline">Expert-Assisted, Accurate &amp; 100% Online</span>
          </h1>

          <p className="lt-public-description">
            Legal Terminus handles your personal income tax return end-to-end — ITR-1 (Sahaj), ITR-2, ITR-3, and ITR-4 (Sugam). We pick the right form and tax regime, claim every eligible deduction, reconcile with Form 16, 26AS &amp; AIS, and e-file with verification so your refund comes through faster and you stay fully compliant. Our professional fee starts at ₹499 + GST.
          </p>

          <div className="lt-public-features">
            <div className="lt-feature-item">Salary, House Property &amp; Capital Gains</div>
            <div className="lt-feature-item">Old vs New Tax Regime Comparison</div>
            <div className="lt-feature-item">Form 16 / 26AS / AIS Reconciliation</div>
            <div className="lt-feature-item">Maximum Refund &amp; Deduction Optimisation</div>
          </div>

          <div className="lt-public-highlights">
            <div>
              <h3>25,000+</h3>
              <p>Returns filed</p>
            </div>
            <div>
              <h3>100% Online</h3>
              <p>Expert-assisted e-filing</p>
            </div>
            <div>
              <h3>7+</h3>
              <p>Years of Tax Expertise</p>
            </div>
          </div>

        </div>

        <div id="itrind-consult-form">
          <ConsultationForm
            source="itr-individual"
            subtitle="Talk to our personal ITR filing expert"
          />
        </div>

      </div>
    </section>
  );
};

export default ItrIndBreadcrum;
