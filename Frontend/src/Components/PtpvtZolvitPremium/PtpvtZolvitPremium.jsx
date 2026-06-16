import React from "react";
import "./PtpvtZolvitPremium.css";
import premiumIllustration from "../../assets/lt-companys.svg";

const PtpvtZolvitPremium = () => {
  return (
    <section className="opczp-section">
      <div className="opczp-container">
        <div className="opczp-card">

          <div className="opczp-top-row">

            <div className="opczp-illustration-wrapper">
              <img
                src={premiumIllustration}
                alt="Partnership Firm to Private Limited Conversion by Legal Terminus"
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
                  Converting a partnership firm to a Pvt Ltd is a statutory Section 366 process, not a simple incorporation — URC-1, the URC-2 newspaper notice, the Registrar of Firms' NOC, creditor consents, and a CA-certified statement of accounts all have to line up, and the partners' capital must map cleanly into share capital. Priority is what happens when a specialist runs the conversion and the cap-table setup as one coordinated project.
                </p>
              </header>

              <section className="opczp-section-block">
                <h3 className="opczp-label">What you get</h3>
                <ul className="opczp-list opczp-features-list">
                  <li className="opczp-list-item">
                    <span className="opczp-list-icon">⚡</span>
                    Partner-to-shareholder mapping and a clean cap table — so the firm's capital converts into share capital correctly.
                  </li>
                  <li className="opczp-list-item">
                    <span className="opczp-list-icon">✅</span>
                    A complete URC-1 pack — CA-certified statement of accounts, registered partnership deed, latest ITR, list of creditors with consent — prepared to the ROC's standard.
                  </li>
                  <li className="opczp-list-item">
                    <span className="opczp-list-icon">✅</span>
                    The URC-2 newspaper notice and the NOC from the Registrar of Firms obtained and the objection window managed.
                  </li>
                  <li className="opczp-list-item">
                    <span className="opczp-list-icon">🔄</span>
                    GST, bank, Udyam, and licence migration to the company — and the firm's assets and contracts transferred cleanly.
                  </li>
                  <li className="opczp-list-item">
                    <span className="opczp-list-icon">📑</span>
                    An investor-ready cap table with an ESOP pool option and a first-year compliance calendar — AOC-4, MGT-7, audit, board meetings.
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
                  All partners must become shareholders. On conversion every partner of the firm becomes a shareholder of the company, with their capital mapped into share capital. A Pvt Ltd needs at least two directors and two shareholders — which a firm with two or more partners already satisfies.
                </li>
                <li className="opczp-note-item">
                  Registration of the firm helps. A firm registered with the Registrar of Firms makes the conversion smoother; an NOC from the Registrar of Firms and from secured creditors must be obtained before the URC-1 conversion is filed. We secure these so the application isn't held up.
                </li>
                <li className="opczp-note-item">
                  The newspaper notice and objection window are mandatory. A URC-2 advertisement inviting objections runs in an English and a vernacular newspaper, followed by a statutory objection period. We draft, publish, and manage any objections.
                </li>
                <li className="opczp-note-item">
                  Liability and compliance change. A partnership has unlimited liability and light compliance; a Pvt Ltd gives limited liability but must be audited every year and file AOC-4 and MGT-7. We set up the calendar so the new structure is an asset, not a surprise.
                </li>
              </ul>
            </div>

            <div className="opczp-cta-row">
              <a
                href="#ptpvt-consult-form"
                className="opczp-cta-btn"
                onClick={(e) => {
                  e.preventDefault();
                  document.getElementById("ptpvt-consult-form")?.scrollIntoView({ behavior: "smooth" });
                }}
              >
                Consult a Conversion Expert
              </a>
            </div>
          </div>

        </div>
      </div>
    </section>
  );
};

export default PtpvtZolvitPremium;
