import React from "react";
import "../OpcZolvitPremium/OpcZolvitPremium.css";
import premiumIllustration from "../../assets/lt-companys.svg";

const CroPriority = () => {
  return (
    <section className="opczp-section">
      <div className="opczp-container">
        <div className="opczp-card">

          <div className="opczp-top-row">

            <div className="opczp-illustration-wrapper">
              <img
                src={premiumIllustration}
                alt="Company Registration Consultancy in Odisha by Legal Terminus"
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
                  Registering a company is more than filling one form — choosing the right structure,
                  reserving a name that gets approved, getting DSCs and DINs in order, drafting the MOA &amp;
                  AOA, and filing SPICe+ correctly all have to line up before the Certificate of
                  Incorporation is issued. Priority is what happens when a Bhubaneswar-based specialist
                  owns your incorporation file, front to back, with zero handoffs.
                </p>
              </header>

              <section className="opczp-section-block">
                <h3 className="opczp-label">What you get</h3>
                <ul className="opczp-list opczp-features-list">
                  <li className="opczp-list-item">
                    <span className="opczp-list-icon">⚡</span>
                    The right entity recommended for your business — Private Limited, OPC, LLP or Public Limited.
                  </li>
                  <li className="opczp-list-item">
                    <span className="opczp-list-icon">✅</span>
                    Name reservation, DSC &amp; DIN, and a clean MOA &amp; AOA prepared to MCA standards.
                  </li>
                  <li className="opczp-list-item">
                    <span className="opczp-list-icon">📑</span>
                    SPICe+ (INC-32), AGILE-PRO &amp; INC-9 filed end to end, with PAN, TAN, EPF &amp; ESI together.
                  </li>
                  <li className="opczp-list-item">
                    <span className="opczp-list-icon">🏦</span>
                    Bank account opening documents, auditor appointment, and the Certificate of Incorporation.
                  </li>
                  <li className="opczp-list-item">
                    <span className="opczp-list-icon">🤝</span>
                    A local office visit option in Bhubaneswar and a free consultation before you commit.
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
                  Choose the right structure first. A Private Limited suits most growth businesses, an OPC
                  suits a solo founder, and an LLP suits a low-compliance partnership. We help you decide
                  before any fee is paid.
                </li>
                <li className="opczp-note-item">
                  Documentation drives the timeline. Self-attested PAN, ID and address proofs, and a valid
                  registered-office proof (with NOC and a recent utility bill) keep the filing on track —
                  most incorporations complete in 10 to 15 working days.
                </li>
                <li className="opczp-note-item">
                  Government fees are separate. Stamp duty, DSC, and MCA fees are billed at actuals; the
                  authorized-capital fee is relaxed up to ₹15,00,000.
                </li>
                <li className="opczp-note-item">
                  Compliance starts at incorporation. INC-20A (commencement), auditor appointment, and
                  the first-year filings follow — our Supreme plan sets up the full first-year calendar.
                </li>
              </ul>
            </div>

            <div className="opczp-cta-row">
              <a
                href="#cro-consult-form"
                className="opczp-cta-btn"
                onClick={(e) => {
                  e.preventDefault();
                  document.getElementById("cro-consult-form")?.scrollIntoView({ behavior: "smooth" });
                }}
              >
                Consult a Company Registration Expert
              </a>
            </div>
          </div>

        </div>
      </div>
    </section>
  );
};

export default CroPriority;
