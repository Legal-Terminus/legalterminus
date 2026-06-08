import React from "react";
import "../PvtltdCompanyTab/PvtltdCompanyTab.css";
import "../IECGovtCosts/IECGovtCosts.css";
import pvtIllustration from "../../assets/whypvt-imp1.svg";

const eligibilityRows = [
  {
    parameter: "Entity Type",
    criterion: "Pvt Ltd / OPC / LLP / Registered Partnership / Cooperative Society",
    notes: "Sole proprietorship not eligible",
  },
  {
    parameter: "Age Cap",
    criterion: "Up to 10 years from incorporation",
    notes: "Calculated from COI / Partnership Deed date",
  },
  {
    parameter: "Turnover Cap",
    criterion: "Up to Rs.200 crore in any FY (Rs.300 cr for Deep Tech)",
    notes: "Past + current FY both checked",
  },
  {
    parameter: "Innovation Test",
    criterion: "Product / process / service innovation OR scalable model",
    notes: "Subjective; DPIIT screens applications",
  },
  {
    parameter: "Sec 80-IAC Tax Holiday",
    criterion: "3 years tax-free out of first 10 years",
    notes: "Separate IMB application; ~30-40% approval rate",
  },
  {
    parameter: "Sec 56(2)(viib) Angel Tax",
    criterion: "Exempt for DPIIT-recognised startups",
    notes: "ABOLISHED from FY 2025-26 (Finance Act 2024) - no Form 2 or exemption filing needed for new fundraises",
  },
  {
    parameter: "Patent Fee Rebate",
    criterion: "80% rebate on government fee",
    notes: "From Rs.8K to Rs.1,600 for individual filing",
  },
  {
    parameter: "Trademark Fee Rebate",
    criterion: "50% rebate on government fee",
    notes: "From Rs.9,000 to Rs.4,500 per class",
  },
  {
    parameter: "Self-Certification",
    criterion: "9 labour + 3 environment laws",
    notes: "Self-certify compliance for first 5 years",
  },
  {
    parameter: "SIDBI Fund-of-Funds",
    criterion: "Rs.10,000 crore corpus access (indirect)",
    notes: "Via SEBI-registered VC / AIF investors",
  },
];

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
              Why Get DPIIT Startup Recognition
            </h2>
            <p className="pvt-intro-text">
              Startup India is a flagship initiative of the Government of India designed to promote innovation, entrepreneurship, and startup growth. Eligible Private Limited Companies, LLPs, and Registered Partnership Firms can obtain DPIIT Startup Recognition, which serves as an official recognition of their innovative and scalable business model. The recognition process is completely online and does not involve any government filing fee.
            </p>
            <p className="pvt-intro-text" style={{ marginTop: "20px" }}>
              DPIIT-recognized startups can access various government benefits, including funding opportunities, intellectual property support, easier compliance procedures, and participation in Startup India initiatives. Recognized startups may also be eligible to apply for tax exemptions under Section 80-IAC, subject to approval, along with benefits such as patent and trademark fee rebates, GeM portal access, and support schemes offered through Startup India and SIDBI. DPIIT recognition helps startups build credibility, attract investors, and accelerate business growth.
            </p>
          </div>
        </div>
      </section>

      <section className="iec-govtcosts-section">
        <div className="iec-govtcosts-container">
          <h2 className="iec-govtcosts-title">
            Eligibility &amp; Benefits Stack: The Deep Dive
          </h2>
          <p className="iec-govtcosts-subtitle">
            Here's the 2026 picture of eligibility criteria and the benefit stack that DPIIT recognition unlocks:
          </p>

          <div className="iec-govtcosts-table-wrapper">
            <table className="iec-govtcosts-table">
              <thead>
                <tr>
                  <th>Parameter</th>
                  <th>Criterion / Benefit</th>
                  <th>Notes</th>
                </tr>
              </thead>
              <tbody>
                {eligibilityRows.map((row, i) => (
                  <tr key={i}>
                    <td>{row.parameter}</td>
                    <td className="iec-govtcosts-range">{row.criterion}</td>
                    <td>{row.notes}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </section>

    </div>
  );
};

export default StartupIndiaOverview;
