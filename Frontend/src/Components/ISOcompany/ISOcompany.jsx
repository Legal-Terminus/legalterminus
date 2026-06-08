import React from "react";
import "../PvtltdCompanyTab/PvtltdCompanyTab.css";
import pvtIllustration from "../../assets/whypvt-imp.svg";

const ISOCompany = () => {
  return (
    <div className="pvt-full-wrapper">

      {/* INTRO SECTION */}
      <section className="pvt-intro-section">
        <div className="pvt-intro-container">
          <div className="pvt-intro-illustration-wrap">
            <img
              src={pvtIllustration}
              alt="ISO Certification illustration"
              className="pvt-intro-illustration"
            />
          </div>
          <div className="pvt-intro-content">
            <h2 className="pvt-intro-title">Why Get ISO Certified</h2>
            <p className="pvt-intro-text">
              ISO Certification is an internationally recognized standard that demonstrates your business follows structured processes, quality controls, and continuous improvement practices. It helps build trust among customers, suppliers, investors, and regulatory authorities.
            </p>
            <p className="pvt-intro-text">
              For businesses in India, ISO Certification offers several advantages, including:
            </p>
            <p className="pvt-intro-text">
              ✔ Eligibility for Government and PSU Tenders<br />
              ✔ Improved Business Credibility<br />
              ✔ Enterprise Vendor Registration<br />
              ✔ Better Export and Global Business Opportunities<br />
              ✔ Competitive Advantage on GeM and Other Marketplaces
            </p>
          </div>
        </div>
      </section>

      {/* ISO STANDARDS TABLE */}
      <section className="pvt-compare-section">
        <div className="pvt-compare-container">
          <h2 className="pvt-compare-title">Major ISO Standards in India: The Deep Dive</h2>
          <p className="pvt-compare-subtitle">
            Not every business needs every standard. Here's the 2026 picture of the most-deployed ISO standards in India and who they fit:
          </p>
          <div className="pvt-compare-table-wrapper">
            <table className="pvt-compare-table">
              <thead>
                <tr>
                  <th>Standard</th>
                  <th>Full Name</th>
                  <th>Best Fit For</th>
                </tr>
              </thead>
              <tbody>
                <tr>
                  <td>ISO 9001:2015</td>
                  <td>Quality Management Systems</td>
                  <td>All businesses; mandatory for most government tenders</td>
                </tr>
                <tr>
                  <td>ISO 14001:2015</td>
                  <td>Environmental Management Systems</td>
                  <td>Manufacturing, chemicals, energy, real estate</td>
                </tr>
                <tr>
                  <td>ISO 45001:2018</td>
                  <td>Occupational Health &amp; Safety MS</td>
                  <td>Manufacturing, construction, mining, factories</td>
                </tr>
                <tr>
                  <td>ISO 22000:2018</td>
                  <td>Food Safety Management Systems</td>
                  <td>Food businesses (often with FSSAI)</td>
                </tr>
                <tr>
                  <td>ISO 27001:2022</td>
                  <td>Information Security MS</td>
                  <td>IT services, SaaS, BPO, data-handling businesses</td>
                </tr>
                <tr>
                  <td>ISO 13485:2016</td>
                  <td>Medical Devices QMS</td>
                  <td>Medical device manufacturers / distributors</td>
                </tr>
                <tr>
                  <td>ISO 50001:2018</td>
                  <td>Energy Management Systems</td>
                  <td>Energy-intensive industries; sustainability-focused</td>
                </tr>
                <tr>
                  <td>ISO 37001:2016</td>
                  <td>Anti-Bribery MS</td>
                  <td>Government contractors, financial services, large corporates</td>
                </tr>
              </tbody>
            </table>
          </div>
        </div>
      </section>

    </div>
  );
};

export default ISOCompany;
