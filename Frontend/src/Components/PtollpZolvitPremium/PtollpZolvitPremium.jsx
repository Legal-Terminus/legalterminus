import React from "react";
import "./PtollpZolvitPremium.css";
import premiumIllustration from "../../assets/lt-companys.svg";

const PtollpZolvitPremium = () => {
  return (
    <section className="opczp-section">
      <div className="opczp-container">
        <div className="opczp-card">

          <div className="opczp-top-row">

            <div className="opczp-illustration-wrapper">
              <img
                src={premiumIllustration}
                alt="Partnership to LLP Conversion by Legal Terminus"
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
                  Partnership-to-LLP is a clean statutory conversion — but only if the eligibility boxes are ticked: every partner carries over, ITRs are current, no security interest subsists, and the CA-certified statement is in order. Miss one and the ROC rejects Form 17. Priority is what happens when a specialist runs the conversion and the LLP agreement together.
                </p>
              </header>

              <section className="opczp-section-block">
                <h3 className="opczp-label">What you get</h3>
                <ul className="opczp-list opczp-features-list">
                  <li className="opczp-list-item">
                    <span className="opczp-list-icon">⚡</span>
                    An upfront eligibility check — partner carry-over, ITR status, security interest, creditor consent — so Form 17 isn't bounced.
                  </li>
                  <li className="opczp-list-item">
                    <span className="opczp-list-icon">✅</span>
                    DSC/DPIN for the designated partners, name reservation, and the FiLLiP + Form 17 application prepared correctly.
                  </li>
                  <li className="opczp-list-item">
                    <span className="opczp-list-icon">✅</span>
                    A CA-certified statement of assets &amp; liabilities and creditor consent compiled to the ROC's standard.
                  </li>
                  <li className="opczp-list-item">
                    <span className="opczp-list-icon">🔄</span>
                    A tailored LLP agreement filed in Form 3 within 30 days, the Registrar of Firms intimated, and PAN/GST/bank updated.
                  </li>
                  <li className="opczp-list-item">
                    <span className="opczp-list-icon">📑</span>
                    A first-year compliance calendar — Form 8, Form 11, ITR-5 — so the LLP starts life fully compliant.
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
                  Everything vests automatically. The big advantage of the Section 55 route is that on conversion all the firm's assets, liabilities, and contracts pass to the LLP by operation of law — no separate transfer deed or stamp duty on each asset. The firm is deemed dissolved.
                </li>
                <li className="opczp-note-item">
                  All partners — and only them — carry over. Every partner of the firm must become a partner of the LLP, and no outsider can be added during conversion. New partners can join only after the LLP is incorporated, through a supplementary agreement.
                </li>
                <li className="opczp-note-item">
                  Eligibility is strict. ITRs must be up to date, there must be no subsisting charge on assets (or secured creditors must consent), and all creditors' consent is needed. We verify each condition before filing so the application proceeds cleanly.
                </li>
                <li className="opczp-note-item">
                  Compliance is lighter than a company. An LLP needs only Form 11 and Form 8 annually and an audit only above turnover/contribution thresholds — materially lighter than a Pvt Ltd, while still giving limited liability and a separate legal identity.
                </li>
              </ul>
            </div>

            <div className="opczp-cta-row">
              <a
                href="#ptollp-consult-form"
                className="opczp-cta-btn"
                onClick={(e) => {
                  e.preventDefault();
                  document.getElementById("ptollp-consult-form")?.scrollIntoView({ behavior: "smooth" });
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

export default PtollpZolvitPremium;
