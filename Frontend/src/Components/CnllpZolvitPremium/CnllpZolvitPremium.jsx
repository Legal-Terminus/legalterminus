import React from "react";
import "./CnllpZolvitPremium.css";
import premiumIllustration from "../../assets/lt-companys.svg";

const CnllpZolvitPremium = () => {
  return (
    <section className="opczp-section">
      <div className="opczp-container">
        <div className="opczp-card">

          <div className="opczp-top-row">

            <div className="opczp-illustration-wrapper">
              <img
                src={premiumIllustration}
                alt="LLP Name Change by Legal Terminus"
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
                  Changing an LLP's name looks like one form — but a name that clashes with an existing mark gets rejected, a missing supplementary agreement stalls Form 3, and updates left undone leave your PAN, GST, and bank out of sync. Priority is what happens when a compliance expert owns the change from name search to the last record updated.
                </p>
              </header>

              <section className="opczp-section-block">
                <h3 className="opczp-label">What you get</h3>
                <ul className="opczp-list opczp-features-list">
                  <li className="opczp-list-item">
                    <span className="opczp-list-icon">⚡</span>
                    A proper name availability and guideline check up front — including a trademark look-up — so RUN-LLP doesn't bounce your application.
                  </li>
                  <li className="opczp-list-item">
                    <span className="opczp-list-icon">✅</span>
                    Correctly drafted partners' consent and supplementary LLP agreement, executed and stamped so Form 3 sails through.
                  </li>
                  <li className="opczp-list-item">
                    <span className="opczp-list-icon">✅</span>
                    Form 5 and Form 3 filed within their deadlines, with the fresh Certificate of Incorporation tracked to issuance.
                  </li>
                  <li className="opczp-list-item">
                    <span className="opczp-list-icon">🔄</span>
                    PAN, GST, bank, and licences updated to the new name so nothing is left pointing at the old one.
                  </li>
                  <li className="opczp-list-item">
                    <span className="opczp-list-icon">📑</span>
                    A clean change file — fresh COI, updated agreement, and all amended registrations — so your rebrand is complete on every record.
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
                  Name approval is not guaranteed. The new name must follow LLP naming rules and not clash with an existing company, LLP, or trademark. A proper search before you apply is the difference between a one-shot approval and repeated rejections.
                </li>
                <li className="opczp-note-item">
                  The LLP agreement must be amended. A name change isn't complete without a supplementary LLP agreement recording the new name, executed by all partners and filed in Form 3. Skipping this leaves the LLP's constitution out of step with the register.
                </li>
                <li className="opczp-note-item">
                  Your legal identity continues. Changing the name does not create a new LLP — the LLPIN, rights, contracts, and liabilities all continue unchanged. Existing agreements remain valid; only the name on them needs updating.
                </li>
                <li className="opczp-note-item">
                  Update everything downstream. After the fresh COI, the new name must flow to PAN, GST, bank accounts, licences, invoices, and signage. Leaving any of these on the old name causes mismatches and compliance friction later.
                </li>
              </ul>
            </div>

            <div className="opczp-cta-row">
              <a
                href="#cnllp-consult-form"
                className="opczp-cta-btn"
                onClick={(e) => {
                  e.preventDefault();
                  document.getElementById("cnllp-consult-form")?.scrollIntoView({ behavior: "smooth" });
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

export default CnllpZolvitPremium;
