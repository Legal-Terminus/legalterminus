import React from "react";
import "./EsiRetZolvitPremium.css";
import premiumIllustration from "../../assets/lt-companys.svg";

const EsiRetZolvitPremium = () => {
  return (
    <section className="opczp-section">
      <div className="opczp-container">
        <div className="opczp-card">

          <div className="opczp-top-row">

            <div className="opczp-illustration-wrapper">
              <img
                src={premiumIllustration}
                alt="ESI Return Filing by Legal Terminus"
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
                  ESI Return Filing may look simple — upload the contribution details, generate the challan, and make the payment. But even a small delay or employee-data error can create bigger compliance issues later. Late filing may attract interest and penalties, incorrect employee records can affect medical benefits, and missed employee additions or exits can create problems during inspections or claim processing.
                </p>
                <p className="opczp-subtitle" style={{ marginTop: "12px" }}>
                  With LT Priority, your ESI Return Filing is handled on a priority basis by a dedicated compliance team that ensures faster processing, timely filing, and smooth monthly coordination.
                </p>
              </header>

              <section className="opczp-section-block">
                <h3 className="opczp-label">What you get</h3>
                <ul className="opczp-list opczp-features-list">
                  <li className="opczp-list-item">
                    <span className="opczp-list-icon">⚡</span>
                    Priority processing and faster monthly filing support.
                  </li>
                  <li className="opczp-list-item">
                    <span className="opczp-list-icon">📅</span>
                    ESI contribution filing before the 15th of every month (subject to timely data sharing).
                  </li>
                  <li className="opczp-list-item">
                    <span className="opczp-list-icon">👤</span>
                    Employee addition, exit marking, and IP record updates handled properly.
                  </li>
                  <li className="opczp-list-item">
                    <span className="opczp-list-icon">📄</span>
                    Monthly contribution preparation, challan generation, and filing support.
                  </li>
                  <li className="opczp-list-item">
                    <span className="opczp-list-icon">✅</span>
                    Proper handling of employee wage-limit changes as per ESIC rules.
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
                  15TH OF NEXT MONTH IS A HARD DEADLINE: ESI dues for any month must be deposited by the 15th of NEXT month per Regulation 31. Section 39(5)(a) INTEREST @ 12% p.a. kicks in from the 16th — calculated daily. Section 85B DAMAGES are graded by delay (5% for &lt;2 months / 10% for 2–4 / 15% for 4–6 / 25% for &gt;6). For a ₹5 lakh ESI dues delayed 3 months: ₹15,000 interest + ₹12,500 damages = ₹27,500 statutory hit. Don't slip.
                </li>
                <li className="opczp-note-item">
                  WAGE CEILING ₹21,000 IS THE COVERAGE THRESHOLD: ESI covers employees with GROSS WAGES UP TO ₹21,000 / month (₹25,000 for differently-abled). Employees earning above this are NOT covered. BUT — if an employee's wage CROSSES ₹21,000 MID-CONTRIBUTION-PERIOD, ESI deduction CONTINUES till the end of that period (30 Sep OR 31 Mar) per Regulation 22. Coverage stops from the next contribution period if wage continues above the ceiling.
                </li>
                <li className="opczp-note-item">
                  10 EMPLOYEES TRIGGERS COVERAGE: In most States, an establishment employing 10 OR MORE PERSONS becomes coverable under the ESI Act (some States have a 20+ threshold). Once registered, the employer must file MONTHLY contributions regardless of whether the subsequent employee count falls below 10. Voluntary coverage is also available.
                </li>
                <li className="opczp-note-item">
                  IP NUMBER + KYC ARE EMPLOYEE-CRITICAL: Every covered employee gets an IP (Insured Person) Number on the ESIC portal at addition. Correct DOB, Aadhaar, and Bank account linkage are crucial — any error blocks the IP's medical / sickness / maternity / disablement benefits later. We do clean addition first time.
                </li>
              </ul>
            </div>

            <div className="opczp-cta-row">
              <a
                href="#esiret-consult-form"
                className="opczp-cta-btn"
                onClick={(e) => {
                  e.preventDefault();
                  document.getElementById("esiret-consult-form")?.scrollIntoView({ behavior: "smooth" });
                }}
              >
                Consult an ESI Compliance Expert
              </a>
            </div>
          </div>

        </div>
      </div>
    </section>
  );
};

export default EsiRetZolvitPremium;
