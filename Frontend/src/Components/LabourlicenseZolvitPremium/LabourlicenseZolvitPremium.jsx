import React from "react";
import "./LabourlicenseZolvitPremium.css";
import premiumIllustration from "../../assets/lt-companys.svg";

const LabourlicenseZolvitPremium = () => {
  return (
    <section className="opczp-section">
      <div className="opczp-container">
        <div className="opczp-card">

          <div className="opczp-top-row">

            <div className="opczp-illustration-wrapper">
              <img
                src={premiumIllustration}
                alt="Labour Licence (CLRA) Registration by Legal Terminus"
                className="opczp-illustration"
              />
            </div>

            <div className="opczp-content">

              <header className="opczp-header">
                <h2 className="opczp-title">
                  Legal Terminus{" "}
                  <span className="opczp-title-highlight">Priority</span>{" "}
                  <span className="opczp-title-icon">⚖</span>
                </h2>
                <p className="opczp-subtitle">
                  Labour License Registration may look straightforward under the new OSH Code framework, but proper compliance involves much more than filing an application. Contractor details, Principal Employer documentation, Form V certification, worker strength calculation, and welfare compliance all play an important role in smooth approval and future inspections. With LT Priority, your Labour License Registration is handled by experienced labour-law professionals who manage the process carefully from documentation to final approval — helping you avoid delays, rejection, and compliance issues.
                </p>
              </header>

              <section className="opczp-section-block">
                <h3 className="opczp-label">What you get</h3>
                <ul className="opczp-list opczp-features-list">
                  <li className="opczp-list-item">
                    <span className="opczp-list-icon">⚡</span>
                    Priority application processing and faster filing support
                  </li>
                  <li className="opczp-list-item">
                    <span className="opczp-list-icon">📑</span>
                    Proper drafting and verification of Form V and labour documents
                  </li>
                  <li className="opczp-list-item">
                    <span className="opczp-list-icon">🧑‍⚖️</span>
                    Senior labour-law expert review before submission
                  </li>
                  <li className="opczp-list-item">
                    <span className="opczp-list-icon">📅</span>
                    5-year compliance calendar with renewal and return reminders
                  </li>
                </ul>
              </section>

            </div>
          </div>

          <div className="opczp-bottom-full">
            <h3 className="opczp-label">Important Notes</h3>
            <div className="opczp-note-box">
              <ul className="opczp-note-list">
                <li className="opczp-note-item">
                  REFORM ALERT: OSH Code 2020 raised the threshold from 20 to 50 workers, extended license validity to 5 years, allowed single license for all establishments, and consolidated CLRA + ISMW + BOCW under one umbrella. Many businesses below 50 workers earlier needing license are now exempted. We audit your worker count carefully - intra-day variations matter.
                </li>
                <li className="opczp-note-item">
                  PRINCIPAL EMPLOYER + CONTRACTOR JOINT LIABILITY: If the contractor fails to pay wages or provide welfare facilities, the PRINCIPAL EMPLOYER bears the liability. Engaging an unlicensed contractor exposes the PE to the same penalty - up to Rs.1 lakh + repeat-offender Rs.2 lakh + imprisonment up to 6 months under OSH Code Chapter XIII. Always demand and verify the contractor's license + Form V chain.
                </li>
                <li className="opczp-note-item">
                  TRANSITION COMPLEXITY: In States where State Rules under OSH Code 2020 are not yet notified, the existing CLRA Act 1970 + corresponding State Rules continue to apply during transition. We track State-by-State notification status and apply the right regime at filing.
                </li>
                <li className="opczp-note-item">
                  Form V CERTIFICATE IS MANDATORY: Before a contractor can apply for License, the Principal Employer must issue Form V (Certificate by PE) confirming the engagement of contract labour. Our base plan co-drafts Form V from both sides (PE + Contractor) to ensure consistency and prevent downstream rejection.
                </li>
              </ul>
            </div>

            <div className="opczp-cta-row">
              <a
                href="#ll-consult-form"
                className="opczp-cta-btn"
                onClick={(e) => {
                  e.preventDefault();
                  document.getElementById("ll-consult-form")?.scrollIntoView({ behavior: "smooth" });
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

export default LabourlicenseZolvitPremium;
