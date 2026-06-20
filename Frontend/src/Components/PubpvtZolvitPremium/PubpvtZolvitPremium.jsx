import React from "react";
import "./PubpvtZolvitPremium.css";
import premiumIllustration from "../../assets/lt-companys.svg";

const PubpvtZolvitPremium = () => {
  return (
    <section className="opczp-section">
      <div className="opczp-container">
        <div className="opczp-card">

          <div className="opczp-top-row">

            <div className="opczp-illustration-wrapper">
              <img
                src={premiumIllustration}
                alt="Public Limited to Private Limited Conversion by Legal Terminus"
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
                  Converting a Public Limited into a Private Limited is a Regional Director–approved process, not an internal resolution — a special resolution, an MOA/AOA rewrite to add the private restrictions, a newspaper notice, creditor and regulator intimation, and the RD-1 application all have to line up before INC-28 closes it out. Priority is what happens when a specialist owns the conversion file, front to back, with zero handoffs.
                </p>
              </header>

              <section className="opczp-section-block">
                <h3 className="opczp-label">What you get</h3>
                <ul className="opczp-list opczp-features-list">
                  <li className="opczp-list-item">
                    <span className="opczp-list-icon">⚡</span>
                    A clean special resolution + altered MOA/AOA adding the private-company restrictions, ready for your EGM.
                  </li>
                  <li className="opczp-list-item">
                    <span className="opczp-list-icon">✅</span>
                    The Form RD-1 application to the Regional Director prepared and filed to the Central Government's standard.
                  </li>
                  <li className="opczp-list-item">
                    <span className="opczp-list-icon">📰</span>
                    The INC-25A newspaper notice and individual creditor / ROC / RD intimations drafted and managed.
                  </li>
                  <li className="opczp-list-item">
                    <span className="opczp-list-icon">🔄</span>
                    INC-28 filing of the RD order, the fresh Certificate of Incorporation, and PAN / GST / bank / licence updates.
                  </li>
                  <li className="opczp-list-item">
                    <span className="opczp-list-icon">📑</span>
                    A leaner private-company compliance calendar — fewer board meetings and disclosures than a public company.
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
                  Regional Director approval is essential. The conversion is effective only once the Regional Director approves Form RD-1 — the special resolution alone does not complete it. We prepare the application so it isn't held up.
                </li>
                <li className="opczp-note-item">
                  The newspaper notice and objection window are mandatory. A Form INC-25A advertisement plus individual notice to creditors, the ROC, and the RD invites objections. We draft, publish, serve, and manage any objections raised.
                </li>
                <li className="opczp-note-item">
                  The articles must add the private restrictions. The AOA is altered to cap members at 200, restrict share transfers, and prohibit public invitation, and the name gains "Private". A minimum of 2 directors and 2 members must be satisfied.
                </li>
                <li className="opczp-note-item">
                  Compliance gets lighter — plan the transition. A private company has fewer board meetings and disclosures than a public company. We hand over a calendar so the leaner structure is set up correctly from day one.
                </li>
              </ul>
            </div>

            <div className="opczp-cta-row">
              <a
                href="#pubpvt-consult-form"
                className="opczp-cta-btn"
                onClick={(e) => {
                  e.preventDefault();
                  document.getElementById("pubpvt-consult-form")?.scrollIntoView({ behavior: "smooth" });
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

export default PubpvtZolvitPremium;
