import React from "react";
import "./SocietyCompanyTabs.css";
import "../IECGovtCosts/IECGovtCosts.css";
import pvtIllustration from "../../assets/whypvt-imp.svg";

const comparisonRows = [
  { param: "Governing Law", society: "Societies Registration Act 1860 + state Acts", trust: "Indian Trusts Act 1882 / state PTAs", sec8: "Companies Act 2013" },
  { param: "Registered With", society: "Registrar of Societies (state)", trust: "Sub-Registrar / Charity Commissioner", sec8: "MCA / RoC" },
  { param: "Governance Model", society: "Member-driven (democratic)", trust: "Founder/Trustee-driven", sec8: "Board/Director-driven" },
  { param: "Min Members", society: "7 members", trust: "2 trustees", sec8: "2 directors + 2 subs" },
  { param: "Setup Cost (Total)", society: "Rs.6K - Rs.14K", trust: "Rs.5K - Rs.15K", sec8: "Rs.15K - Rs.30K" },
  { param: "Setup Time", society: "15 - 20 days", trust: "15 - 22 days", sec8: "20 - 25 days" },
  { param: "Office Bearers Election", society: "Periodic (per Rules)", trust: "N/A", sec8: "Board-appointed" },
  { param: "Annual ROC / MCA Filings", society: "None (state filing only)", trust: "None", sec8: "MGT-7 + AOC-4 + DIR-3 + ADT-1" },
  { param: "Donor Credibility", society: "Medium", trust: "Medium-High", sec8: "Highest" },
  { param: "12A / 80G / CSR-1 / FCRA", society: "Eligible (separate filings)", trust: "Eligible (separate filings)", sec8: "Eligible (separate filings)" },
];

const SocietyCompanyTabs = () => {
  return (
    <div className="society-company-wrapper">

      {/* ===========================
          INTRO SECTION
      ============================ */}
      <section className="society-intro-section">
        <div className="society-intro-container">

          {/* Illustration */}
          <div className="society-intro-illustration-wrap">
            <img
              src={pvtIllustration}
              alt="Why choose Society Registration"
              className="society-intro-illustration"
            />
          </div>

          {/* Content */}
          <div className="society-intro-content">
            <h2 className="society-intro-title">
              Why Choose a Society
            </h2>

            <p className="society-intro-text">
              Society Registration in India is one of the most popular legal structures for non-profit organizations, educational institutions, cultural associations, welfare groups, clubs, and member-based organizations. Registered under the Societies Registration Act, 1860, a Society is formed by a group of individuals working together for a common social, charitable, educational, scientific, literary, religious, or professional objective. It provides legal recognition to the organization and enables it to open bank accounts, hold property, receive donations, and enter into agreements.
            </p>
            <p className="society-intro-text" style={{ marginTop: "14px" }}>
              A Society is ideal for organizations that prefer a democratic and member-driven structure with collective decision-making. It is widely used by NGOs, welfare associations, educational groups, cultural organizations, resident welfare associations (RWAs), trade associations, and community initiatives. Compared to a Section 8 Company, Society Registration is generally more affordable and easier to manage while still offering strong credibility for social and non-profit activities.
            </p>
          </div>

        </div>
      </section>

      {/* ===========================
          COMPARISON TABLE
      ============================ */}
      <section className="iec-govtcosts-section">
        <div className="iec-govtcosts-container">
          <h2 className="iec-govtcosts-title">
            Society vs Trust vs Section 8 Company: The Deep Dive
          </h2>
          <p className="iec-govtcosts-subtitle">
            Three non-profit structures, three different governance philosophies. Here's the honest 2026 comparison:
          </p>

          <div className="iec-govtcosts-table-wrapper">
            <table className="iec-govtcosts-table">
              <thead>
                <tr>
                  <th>Parameter</th>
                  <th>Society</th>
                  <th>Trust</th>
                  <th>Section 8 Co.</th>
                </tr>
              </thead>
              <tbody>
                {comparisonRows.map((row, i) => (
                  <tr key={i}>
                    <td>{row.param}</td>
                    <td>{row.society}</td>
                    <td>{row.trust}</td>
                    <td>{row.sec8}</td>
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

export default SocietyCompanyTabs;
