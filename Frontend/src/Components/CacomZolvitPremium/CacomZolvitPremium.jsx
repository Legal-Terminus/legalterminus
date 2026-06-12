import React from "react";
import "./CacomZolvitPremium.css";
import premiumIllustration from "../../assets/lt-companys.svg";

const CacomZolvitPremium = () => {
  return (
    <section className="opczp-section">
      <div className="opczp-container">
        <div className="opczp-card">

          <div className="opczp-top-row">

            <div className="opczp-illustration-wrapper">
              <img
                src={premiumIllustration}
                alt="Change of Registered Office by Legal Terminus"
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
                  Changing a registered office looks like one form — but the right process depends entirely on how far you're moving, a missed special resolution stalls the filing, and an out-of-date address means MCA and tax notices go to the wrong place. Priority is what happens when a compliance expert maps the correct route and owns it from resolution to updated record.
                </p>
              </header>

              <section className="opczp-section-block">
                <h3 className="opczp-label">What you get</h3>
                <ul className="opczp-list opczp-features-list">
                  <li className="opczp-list-item">
                    <span className="opczp-list-icon">⚡</span>
                    The correct route mapped up front — within city, within state, or state-to-state — so you file exactly what the law needs and nothing more.
                  </li>
                  <li className="opczp-list-item">
                    <span className="opczp-list-icon">✅</span>
                    Properly drafted board and special resolutions, EGM notices, and MGT-14 where required — the paperwork that makes INC-22 go through.
                  </li>
                  <li className="opczp-list-item">
                    <span className="opczp-list-icon">✅</span>
                    Verified address proof and NOC so the new office isn't rejected on a documentation defect.
                  </li>
                  <li className="opczp-list-item">
                    <span className="opczp-list-icon">🔄</span>
                    Regional Director application, advertisement, and dual-ROC coordination handled end-to-end for a state change.
                  </li>
                  <li className="opczp-list-item">
                    <span className="opczp-list-icon">📑</span>
                    PAN, GST, bank, and licences updated to the new address so every official record agrees and no notice goes astray.
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
                  The process scales with the distance. A shift within the same city needs only a board resolution and INC-22; moving across ROC jurisdiction adds a special resolution and RD approval; and a state change adds an MOA alteration, newspaper advertisement, and a full Regional Director application. Getting the route right from the start avoids wasted filings.
                </li>
                <li className="opczp-note-item">
                  File within 30 days. Form INC-22 must be filed within 30 days of the change of registered office. Delay attracts additional MCA fees, so the resolutions, address proof, and NOC should be ready before the move is finalised.
                </li>
                <li className="opczp-note-item">
                  Address proof must be clean. A utility bill not older than two months, a valid rent agreement or ownership proof, and an owner's NOC are essential. A stale or mismatched document is a common reason for INC-22 rejection.
                </li>
                <li className="opczp-note-item">
                  Update everything downstream. After the MCA record changes, the new address must flow to PAN, GST, bank, and licences. An old address left on these means statutory and tax notices keep going to a place you've left.
                </li>
              </ul>
            </div>

            <div className="opczp-cta-row">
              <a
                href="#cacom-consult-form"
                className="opczp-cta-btn"
                onClick={(e) => {
                  e.preventDefault();
                  document.getElementById("cacom-consult-form")?.scrollIntoView({ behavior: "smooth" });
                }}
              >
                Consult a Compliance Expert
              </a>
            </div>
          </div>

        </div>
      </div>
    </section>
  );
};

export default CacomZolvitPremium;
