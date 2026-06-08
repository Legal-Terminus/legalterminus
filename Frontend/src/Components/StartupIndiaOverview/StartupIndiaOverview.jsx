import React from "react";
import "../PvtltdCompanyTab/PvtltdCompanyTab.css";
import pvtIllustration from "../../assets/whypvt-imp1.svg";

const StartupIndiaOverview = () => {
  return (
    <div className="pvt-full-wrapper">

      <section className="pvt-intro-section">
        <div className="pvt-intro-container">
          <div className="pvt-intro-illustration-wrap">
            <img
              src={pvtIllustration}
              alt="Startup India DPIIT Recognition illustration"
              className="pvt-intro-illustration"
            />
          </div>

          <div className="pvt-intro-content">
            <h2 className="pvt-intro-title">
              Why Get Startup India (DPIIT) Recognition
            </h2>
            <p className="pvt-intro-text">
              DPIIT recognition transforms your startup from a regular business into a legally-privileged entity. The most impactful benefit is the Section 80-IAC income tax holiday — 3 full years of zero income tax out of your first 10 years of operation, subject to IMB approval. Add the angel tax exemption (Section 56(2)(viib)) and you can raise equity funding from Indian investors at any valuation above FMV without triggering a 30% tax on the "excess" premium. These two clauses alone can save crores in a single fundraise.
            </p>
            <p className="pvt-intro-text">
              Beyond tax, DPIIT recognition gives you self-certification under 6 labour laws and 3 environment laws — no inspector visits for 3-5 years. Patent filing fees drop 80%. You get priority in government tender reservations and easier access to SIDBI's Fund of Funds. The recognition is free (no government fee), takes 2-4 weeks, and is the single highest-ROI filing any early-stage Indian startup can make.
            </p>
          </div>
        </div>
      </section>

      <section className="pvt-compare-section">
        <div className="pvt-compare-container">
          <h2 className="pvt-compare-title">DPIIT-Recognised vs. Unrecognised Startup: The Real Difference</h2>
          <p className="pvt-compare-subtitle">
            Here's what you're leaving on the table if you skip DPIIT recognition:
          </p>
          <div className="pvt-compare-table-wrapper">
            <table className="pvt-compare-table">
              <thead>
                <tr>
                  <th>Parameter</th>
                  <th>DPIIT Recognised Startup</th>
                  <th>Unrecognised Startup</th>
                </tr>
              </thead>
              <tbody>
                <tr>
                  <td>Income Tax</td>
                  <td>0% for 3 of first 10 years (80-IAC, IMB approval)</td>
                  <td>22–30% from Day 1</td>
                </tr>
                <tr>
                  <td>Angel Tax (Sec 56(2)(viib))</td>
                  <td>Exempt after filing Form 2 with DPIIT</td>
                  <td>30% tax on premium above FMV on Indian investor rounds</td>
                </tr>
                <tr>
                  <td>Patent Filing Fee</td>
                  <td>80% rebate on government fee</td>
                  <td>Full fee — up to ₹1.5L for a complete patent</td>
                </tr>
                <tr>
                  <td>Labour Law Compliance</td>
                  <td>Self-certification under 6 laws — no inspector visits</td>
                  <td>Full compliance inspections from Day 1</td>
                </tr>
                <tr>
                  <td>Government Tenders</td>
                  <td>Priority access &amp; relaxed prior experience norms</td>
                  <td>Standard rules — no relaxation</td>
                </tr>
                <tr>
                  <td>SIDBI Fund of Funds</td>
                  <td>Eligible for VC investment via SEBI-registered AIFs</td>
                  <td>Not eligible</td>
                </tr>
                <tr>
                  <td>Credit Guarantee Scheme</td>
                  <td>CGSS covers up to ₹10 crore per borrower</td>
                  <td>Not eligible for DPIIT-linked guarantee schemes</td>
                </tr>
                <tr>
                  <td>Government Fee</td>
                  <td>Nil (no fee for DPIIT recognition)</td>
                  <td>N/A</td>
                </tr>
              </tbody>
            </table>
          </div>
        </div>
      </section>

    </div>
  );
};

export default StartupIndiaOverview;
