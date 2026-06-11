import React from "react";
import "./TmarkZolvitPremium.css";
import premiumIllustration from "../../assets/lt-companys.svg";

const TmarkZolvitPremium = () => {
  return (
    <section className="opczp-section">
      <div className="opczp-container">
        <div className="opczp-card">

          <div className="opczp-top-row">

            <div className="opczp-illustration-wrapper">
              <img
                src={premiumIllustration}
                alt="Trademark Application by Legal Terminus"
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
                  A trademark looks like one form — but a weak search, a wrong class, or a generic mark leads to objections, oppositions, and months of delay. Priority is what happens when a trademark attorney owns your application from search to registration certificate.
                </p>
              </header>

              <section className="opczp-section-block">
                <h3 className="opczp-label">What you get</h3>
                <ul className="opczp-list opczp-features-list">
                  <li className="opczp-list-item">
                    <span className="opczp-list-icon">⚡</span>
                    A thorough trademark search across the public register and phonetic/visual look-alikes, so you file a mark that can actually survive examination.
                  </li>
                  <li className="opczp-list-item">
                    <span className="opczp-list-icon">✅</span>
                    Correct class selection across the 45 Nice classes — covering your real goods/services so your protection isn't full of gaps.
                  </li>
                  <li className="opczp-list-item">
                    <span className="opczp-list-icon">✅</span>
                    Attorney-drafted TM-A with the right specification and applicant details, reducing the chance of a Section 9/11 objection.
                  </li>
                  <li className="opczp-list-item">
                    <span className="opczp-list-icon">🔄</span>
                    Examination report tracking and a strong, citation-backed objection reply drafted by an expert — not a template.
                  </li>
                  <li className="opczp-list-item">
                    <span className="opczp-list-icon">📑</span>
                    Status updates at every stage — filed, examined, published, registered — with the application number and certificate delivered to you.
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
                  Search before you file. The most common reason trademarks fail is an existing identical or deceptively similar mark. A proper search up front saves you the government fee, the months of delay, and the heartbreak of rebranding later.
                </li>
                <li className="opczp-note-item">
                  Class selection is permanent. Your protection extends only to the classes you file in, and classes cannot be added to an existing application. Choosing the right class — or classes — at filing is critical to genuinely covering your business.
                </li>
                <li className="opczp-note-item">
                  Distinctiveness wins. Generic or purely descriptive marks attract objections under Section 9. Invented, arbitrary, or suggestive marks are far stronger. We advise on the strength of your mark before you commit to it.
                </li>
                <li className="opczp-note-item">
                  ™ now, ® later. You can use ™ the moment you file, signalling your claim. The ® symbol — and the strongest legal protection — comes only after registration, which typically takes several months to over a year if smooth.
                </li>
              </ul>
            </div>

            <div className="opczp-cta-row">
              <a
                href="#tmark-consult-form"
                className="opczp-cta-btn"
                onClick={(e) => {
                  e.preventDefault();
                  document.getElementById("tmark-consult-form")?.scrollIntoView({ behavior: "smooth" });
                }}
              >
                Consult a Trademark Expert
              </a>
            </div>
          </div>

        </div>
      </div>
    </section>
  );
};

export default TmarkZolvitPremium;
