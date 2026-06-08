import React from "react";
import "./ShopRegPriority.css";
import premiumIllustration from "../../assets/lt-company.svg";

const ShopRegPriority = () => {
  return (
    <section className="srp-section">
      <div className="srp-container">
        <div className="srp-card">

          <div className="srp-top-row">

            <div className="srp-illustration-wrapper">
              <img
                src={premiumIllustration}
                alt="Shop & Establishment Registration by Legal Terminus"
                className="srp-illustration"
              />
            </div>

            <div className="srp-content">
              <header className="srp-header">
                <h2 className="srp-title">
                  Legal Terminus{" "}
                  <span className="srp-title-highlight">Priority</span>{" "}
                  <span className="srp-title-icon">⚖</span>
                </h2>
                <p className="srp-subtitle">
                  A Shop &amp; Establishment Certificate is not just a formality — it is the first piece of official identity your business receives from the state government. It legitimises your premises, regulates working conditions for employees, and is the foundational document for GST, trade licences, and bank account opening. Priority is what happens when an expert files it right the first time and hands you a compliance calendar so you never miss a renewal.
                </p>
              </header>

              <section className="srp-section-block">
                <h3 className="srp-label">What you get</h3>
                <ul className="srp-list srp-features-list">
                  <li className="srp-list-item">
                    <span className="srp-list-icon">⚡</span>
                    Same-day document checklist and application initiation — no back-and-forth.
                  </li>
                  <li className="srp-list-item">
                    <span className="srp-list-icon">✅</span>
                    Expert reviewed documents with real-time feedback before submission.
                  </li>
                  <li className="srp-list-item">
                    <span className="srp-list-icon">🔄</span>
                    Real-time application status updates via mail and WhatsApp.
                  </li>
                  <li className="srp-list-item">
                    <span className="srp-list-icon">📑</span>
                    Post-registration kit: Certificate, compliance calendar, and renewal reminders.
                  </li>
                </ul>
              </section>
            </div>
          </div>

          <div className="srp-bottom-full">
            <h3 className="srp-label">Important Notes</h3>
            <div className="srp-note-box">
              <ul className="srp-note-list">
                <li className="srp-note-item">
                  <strong>State-specific law</strong> governs Shop &amp; Establishment registration — each state has its own Act (Odisha Shops &amp; Commercial Establishments Act, 1956 for Odisha). Procedure, fees, and renewal periods differ state by state.
                </li>
                <li className="srp-note-item">
                  <strong>Applicability</strong> covers every shop, commercial establishment, hotel, restaurant, theatre, and place of public entertainment, regardless of the number of employees. Exemptions (hospitals, educational institutions, government offices) vary by state rules.
                </li>
                <li className="srp-note-item">
                  <strong>Government fee</strong> is calculated based on the number of employees and the type of establishment. In Odisha it is capped at approximately ₹600 per year per branch.
                </li>
                <li className="srp-note-item">
                  <strong>Annual renewal</strong> is mandatory. Failure to renew attracts late fees and can result in cancellation. Set a calendar reminder or subscribe to our renewal reminder service.
                </li>
              </ul>
            </div>

            <div className="srp-cta-row">
              <a
                href="#shop-consult-form"
                className="srp-cta-btn"
                onClick={(e) => {
                  e.preventDefault();
                  document.getElementById("shop-consult-form")?.scrollIntoView({ behavior: "smooth" });
                }}
              >
                Consult a Legal Expert
              </a>
            </div>
          </div>

        </div>
      </div>
    </section>
  );
};

export default ShopRegPriority;
