import React from "react";
import "../ProFOPCZolvitPremium/ProFOPCZolvitPremium.css";
import premiumIllustration from "../../assets/lt-company.svg";

const ZolvitPremium = () => {
  return (
    <section className="profopc-zp-section">
      <div className="profopc-zp-container">
        <div className="profopc-zp-card">

          <div className="profopc-zp-illustration-wrapper">
            <img
              src={premiumIllustration}
              alt="Public to Private Limited Conversion by Legal Terminus"
              className="profopc-zp-illustration"
            />
          </div>

          <div className="profopc-zp-content">

            <header className="profopc-zp-header">
              <h2 className="profopc-zp-title">
                Legal Terminus{" "}
                <span className="profopc-zp-title-highlight">Priority</span>{" "}
                <span className="profopc-zp-title-icon">⚖</span>
              </h2>
              <p className="profopc-zp-subtitle">
                Public to Private Limited Conversion may look like a simple name change, but it involves multiple legal and compliance steps under the Companies Act, 2013. Special resolution, alteration of the Articles, creditor notices, newspaper publication and approval of the Regional Director all play an important role in smooth conversion and future compliance.
                <br /><br />
                With LT Priority, your Public to Private Limited Conversion is handled by experienced company law professionals who carefully manage the complete process — from the Section 14 eligibility review to the final RD order and post-conversion compliance support.
              </p>
            </header>

            <section className="profopc-zp-section-block">
              <h3 className="profopc-zp-label">What you get</h3>
              <ul className="profopc-zp-list profopc-zp-features-list">
                <li className="profopc-zp-list-item">
                  <span className="profopc-zp-list-icon">⚡</span>
                  Priority processing and faster filing support throughout the conversion process
                </li>
                <li className="profopc-zp-list-item">
                  <span className="profopc-zp-list-icon">📑</span>
                  Proper drafting and handling of the special resolution, MGT-14, INC-25A and RD-1 filings
                </li>
                <li className="profopc-zp-list-item">
                  <span className="profopc-zp-list-icon">🛡</span>
                  Senior Company Secretary review before final submission to the Regional Director
                </li>
                <li className="profopc-zp-list-item">
                  <span className="profopc-zp-list-icon">📲</span>
                  Dedicated coordination and real-time status updates during the process
                </li>
                <li className="profopc-zp-list-item">
                  <span className="profopc-zp-list-icon">📅</span>
                  Post-conversion compliance guidance and annual filing reminders
                </li>
              </ul>
            </section>

            <section className="profopc-zp-section-block">
              <h3 className="profopc-zp-label">Important Notes</h3>
              <div className="profopc-zp-note-box">
                <ul className="profopc-zp-note-list">
                  <li className="profopc-zp-note-item">
                    INC-25A newspaper advertisement and individual creditor notices MUST be issued at least 21 days BEFORE filing the RD-1 application - this is a hard statutory waiting period. Plan your timeline: Special Resolution -> MGT-14 (30 days) -> INC-25A + notices (Day 0) -> 21-day objection window -> RD-1 filing (within 60 days of the resolution). Skip this window, and the Regional Director can return the application.
                  </li>
                  <li className="profopc-zp-note-item">
                    PRIVATE COMPANY LIMITS: After conversion, the company must keep its members within a maximum of 200, restrict share transfers in its Articles, and never invite the public to subscribe to its securities. A minimum of 2 members and 2 directors must be maintained at all times.
                  </li>
                  <li className="profopc-zp-note-item">
                    NO PENDING DEFAULTS: The Regional Director expects a clean compliance record - pending annual filings, unpaid deposits or unresolved charges can delay or block the order. We review your MCA master data and flag any pending items before filing RD-1.
                  </li>
                  <li className="profopc-zp-note-item">
                    CREDITOR / REGULATOR OBJECTIONS: The advertisement and notices invite objections from creditors, members and regulators. If material objections are received, the conversion may need a hearing, creditor settlement or other resolution before the RD passes the order. Most clean cases proceed without objections; problem cases can extend the timeline by 30-60 days.
                  </li>
                </ul>
              </div>
            </section>

            <div className="profopc-zp-cta-row">
              <button className="profopc-zp-cta-btn">
                Consult a Legal Expert
              </button>
            </div>

          </div>
        </div>
      </div>
    </section>
  );
};

export default ZolvitPremium;
