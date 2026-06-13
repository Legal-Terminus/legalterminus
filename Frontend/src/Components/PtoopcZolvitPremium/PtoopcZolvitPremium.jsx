import React from "react";
import "./PtoopcZolvitPremium.css";
import premiumIllustration from "../../assets/lt-companys.svg";

const PtoopcZolvitPremium = () => {
  return (
    <section className="opczp-section">
      <div className="opczp-container">
        <div className="opczp-card">

          <div className="opczp-top-row">

            <div className="opczp-illustration-wrapper">
              <img
                src={premiumIllustration}
                alt="Proprietorship to OPC Conversion by Legal Terminus"
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
                  This isn't a one-form conversion — it's incorporating a new OPC and cleanly moving your whole business into it. Get the nominee, the takeover agreement, or the registration migration wrong, and you end up with a company that doesn't actually hold your business. Priority is what happens when an expert runs the incorporation and the transition together, end-to-end.
                </p>
              </header>

              <section className="opczp-section-block">
                <h3 className="opczp-label">What you get</h3>
                <ul className="opczp-list opczp-features-list">
                  <li className="opczp-list-item">
                    <span className="opczp-list-icon">⚡</span>
                    A clean OPC incorporation through SPICe+ — DSC, name, MOA/AOA, and the nominee's INC-3 consent handled correctly the first time.
                  </li>
                  <li className="opczp-list-item">
                    <span className="opczp-list-icon">✅</span>
                    A properly drafted takeover agreement that actually transfers your proprietorship's assets, liabilities, and contracts into the OPC.
                  </li>
                  <li className="opczp-list-item">
                    <span className="opczp-list-icon">✅</span>
                    GST, bank, Udyam, and licence migration so the new company — not the old proprietorship — holds every registration.
                  </li>
                  <li className="opczp-list-item">
                    <span className="opczp-list-icon">🔄</span>
                    Old proprietorship registrations surrendered so you aren't left filing for two entities.
                  </li>
                  <li className="opczp-list-item">
                    <span className="opczp-list-icon">📑</span>
                    A first-year compliance calendar — AOC-4, MGT-7A, ITR, and audit — so the OPC starts life fully compliant.
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
                  It's incorporation, not statutory conversion. A proprietorship has no separate legal identity, so you incorporate a fresh OPC and transfer the business into it via a takeover agreement. Missing that transfer step leaves the business legally with the proprietor, not the company.
                </li>
                <li className="opczp-note-item">
                  A nominee is mandatory. Every OPC must name a nominee (an Indian citizen and resident) in Form INC-3, who steps in if the sole member dies or becomes incapacitated. Choosing and documenting the nominee correctly is essential to incorporation.
                </li>
                <li className="opczp-note-item">
                  Compliance steps up. Unlike a proprietorship, an OPC must file annual ROC returns, maintain statutory records, and get its accounts audited every year. We set up a calendar so the higher compliance is handled, not a surprise.
                </li>
                <li className="opczp-note-item">
                  Migrate every registration. GST, bank accounts, Udyam, IEC, and trade licences must move to the OPC's name, and the proprietorship's versions surrendered. Leaving any behind causes mismatches and duplicate filings.
                </li>
              </ul>
            </div>

            <div className="opczp-cta-row">
              <a
                href="#ptoopc-consult-form"
                className="opczp-cta-btn"
                onClick={(e) => {
                  e.preventDefault();
                  document.getElementById("ptoopc-consult-form")?.scrollIntoView({ behavior: "smooth" });
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

export default PtoopcZolvitPremium;
