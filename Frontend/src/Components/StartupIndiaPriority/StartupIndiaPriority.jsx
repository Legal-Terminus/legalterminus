import React from "react";
import "../OpcZolvitPremium/OpcZolvitPremium.css";
import premiumIllustration from "../../assets/lt-company.svg";

const StartupIndiaPriority = () => {
  return (
    <section className="opczp-section">
      <div className="opczp-container">
        <div className="opczp-card">

          <div className="opczp-top-row">

            <div className="opczp-illustration-wrapper">
              <img
                src={premiumIllustration}
                alt="Startup India Registration by Legal Terminus"
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
                <p className="opczp-subtitle" style={{ textAlign: "left" }}>
                  LT Priority is designed for startups that want faster processing, priority handling, and dedicated professional support for their Startup India (DPIIT) Recognition application. While DPIIT recognition is an online process, many applications face delays or rejection due to weak business descriptions, improper documentation, or incorrect startup classification. With LT Priority, your application receives priority attention, faster coordination, and professional review before submission.
                </p>
              </header>

              <section className="opczp-section-block">
                <h3 className="opczp-label">What You Get</h3>
                <ul className="opczp-list opczp-features-list">
                  <li className="opczp-list-item">
                    <span className="opczp-list-icon">⚡</span>
                    Priority Application Filing – Faster drafting, review, submission and dedicated follow-up of your DPIIT application.
                  </li>
                  <li className="opczp-list-item">
                    <span className="opczp-list-icon">✅</span>
                    Expert Startup Profile Review – Business activity and innovation details professionally reviewed before filing.
                  </li>
                  <li className="opczp-list-item">
                    <span className="opczp-list-icon">📲</span>
                    Real-Time Updates &amp; Dedicated Assistance – Regular updates through Email and WhatsApp; direct support from assigned startup compliance professionals.
                  </li>
                  <li className="opczp-list-item">
                    <span className="opczp-list-icon">📑</span>
                    DSC &amp; Trademark Coordination Support (As per Selected Plan) – Additional assistance for Enriched and Supreme plan services.
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
                  Innovation pitch must be GENUINE. DPIIT screens out 'me-too' businesses dressed up as innovation. A reseller, a consultancy, a generic e-commerce store doesn't qualify - even with great revenue. We do a brutal honesty check before filing - weak applications get rejected by DPIIT.
                </li>
                <li className="opczp-note-item">
                  Section 80-IAC tax holiday is NOT automatic with DPIIT recognition. It's a SEPARATE IMB application with ~30-40% approval rate. The pitch needs sharp innovation framing, clear scalability metrics, and quantified employment / wealth creation impact. Enriched and Supreme tiers handle this.
                </li>
                <li className="opczp-note-item">
                  Angel Tax (Section 56(2)(viib)) has been ABOLISHED with effect from 1 April 2025 via Finance Act, 2024. It no longer applies to any startup fundraise from FY 2025-26 onwards - for all investors, domestic and foreign. No Form 2 filing or DPIIT exemption is needed for new rounds. If your startup has open assessment notices for AY 2024-25 or earlier, those must still be addressed separately.
                </li>
                <li className="opczp-note-item">
                  DPIIT eligibility caps: max 10 years from incorporation (20 years for Deep Tech), max Rs.200 cr turnover (Rs.300 cr for Deep Tech). Once you cross either, recognition lapses automatically - you cannot extend it. Plan your 80-IAC election year wisely within the eligibility window.
                </li>
              </ul>
            </div>

            <div className="opczp-cta-row">
              <a
                href="#startup-india-consult-form"
                className="opczp-cta-btn"
                onClick={(e) => {
                  e.preventDefault();
                  document.getElementById("startup-india-consult-form")?.scrollIntoView({ behavior: "smooth" });
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

export default StartupIndiaPriority;
