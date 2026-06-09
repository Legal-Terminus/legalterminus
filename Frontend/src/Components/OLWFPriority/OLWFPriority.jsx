import React from "react";
import "../OpcZolvitPremium/OpcZolvitPremium.css";
import premiumIllustration from "../../assets/lt-companys.svg";

const OLWFPriority = () => {
  return (
    <section className="opczp-section">
      <div className="opczp-container">
        <div className="opczp-card">

          <div className="opczp-top-row">

            <div className="opczp-illustration-wrapper">
              <img
                src={premiumIllustration}
                alt="OLWF Registration by Legal Terminus"
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
                  ODISHA LABOUR WELFARE FUND (OLWF) Registration may look simple, but incorrect employee classification, delayed registration, or missed contributions can create compliance issues and unnecessary notices from the Labour Department. Proper registration and timely contribution filing help establishments stay compliant under the Odisha Labour Welfare Fund Act.
                  <br /><br />
                  With LT Priority, your OLWF Registration is handled on a fast-track basis with dedicated professional support, priority filing, and continuous coordination throughout the process.
                </p>
              </header>

              <section className="opczp-section-block">
                <h3 className="opczp-label">What you get</h3>
                <ul className="opczp-list opczp-features-list">
                  <li className="opczp-list-item">
                    <span className="opczp-list-icon">⚡</span>
                    Priority processing for faster OLWF Registration and Establishment Code allotment
                  </li>
                  <li className="opczp-list-item">
                    <span className="opczp-list-icon">📑</span>
                    Professional review of employee details, establishment category, and contribution applicability
                  </li>
                  <li className="opczp-list-item">
                    <span className="opczp-list-icon">✅</span>
                    Senior compliance expert verification before filing submission
                  </li>
                  <li className="opczp-list-item">
                    <span className="opczp-list-icon">📲</span>
                    Real-time updates and dedicated support during the registration process
                  </li>
                  <li className="opczp-list-item">
                    <span className="opczp-list-icon">💼</span>
                    Guidance for first contribution filing included in Enriched &amp; Supreme Plans
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
                  OLWF is state-specific. If you operate only in Odisha — this is the only LWF you need. If you operate in multiple states — you need separate LWF registrations in each state (Karnataka KLWF, Maharashtra MLWF, etc.). We cover only the Odisha registration under this service.
                </li>
                <li className="opczp-note-item">
                  OLWF contribution rates are not the same as ESIC / EPF / Professional Tax. OLWF is a low-rate, half-yearly, nominal-amount contribution funding worker welfare schemes — not a high-rate payroll deduction. Don't confuse it with social security contributions.
                </li>
                <li className="opczp-note-item">
                  Missed registration / contribution leads to Welfare Inspector visits, recovery proceedings, and small per-day penalties. Individually small; collectively (across multiple half-years missed) they add up. Keep the calendar straight.
                </li>
                <li className="opczp-note-item">
                  OLWF benefits (scholarships for workers' children, medical assistance, housing scheme, funeral assistance) are paid by the Fund to individual workers — not to the employer. As employer, your role is registration + contribution + worker enrolment. Worker-side benefit claims are out of our scope.
                </li>
              </ul>
            </div>

            <div className="opczp-cta-row">
              <a
                href="#opc-consult-form"
                className="opczp-cta-btn"
                onClick={(e) => {
                  e.preventDefault();
                  document.getElementById("opc-consult-form")?.scrollIntoView({ behavior: "smooth" });
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

export default OLWFPriority;
