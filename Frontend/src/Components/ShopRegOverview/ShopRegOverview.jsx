import React from "react";
import "../PvtltdCompanyTab/PvtltdCompanyTab.css";
import shopIllustration from "../../assets/whypvt-imp1.svg";

const ShopRegOverview = () => {
  return (
    <div className="pvt-full-wrapper">

      {/* INTRO SECTION */}
      <section className="pvt-intro-section">
        <div className="pvt-intro-container">
          <div className="pvt-intro-illustration-wrap">
            <img
              src={shopIllustration}
              alt="Shop and Establishment Registration illustration"
              className="pvt-intro-illustration"
            />
          </div>
          <div className="pvt-intro-content">
            <h2 className="pvt-intro-title">
              Why Register Your Shop / Establishment
            </h2>
            <p className="pvt-intro-text">
              Shop &amp; Establishment Registration is the foundational state-labour registration that establishes your commercial premises is legally compliant with the state's labour laws on working hours, weekly off, annual leave, holidays, wage payment, health &amp; safety, and conditions of employment. Each state has its own Shop &amp; Establishment Act — the foundational law from which most other state labour compliance flows. Whether you're a one-person consultancy, a 200-employee IT firm, a kirana shop, or a chain of restaurants — if you have a commercial premise, Shop &amp; Establishment Registration is the starting point.
            </p>
            <p className="pvt-intro-text">
              Beyond statutory compliance, SHOP &amp; ESTABLISHMENT Registration is the de-facto first proof banks demand for opening a current account, marketplaces require for seller onboarding, and clients ask for in vendor KYC. The Registration Certificate (called Gumasta in Maharashtra, SHOP &amp; ESTABLISHMENT Certificate elsewhere) is one of the most-asked-for documents in Indian commercial KYC. Without it, you're effectively locked out of formal business operations — and even small businesses end up needing it on Day 1.
            </p>
          </div>
        </div>
      </section>

      {/* STATE ACTS TABLE */}
      <section className="pvt-compare-section">
        <div className="pvt-compare-container">
          <h2 className="pvt-compare-title">Shop &amp; Establishment Acts Across Major States: The Deep Dive</h2>
          <p className="pvt-compare-subtitle">
            Each state has its own SHOP &amp; ESTABLISHMENT Act — here's the 2026 snapshot for the most common states we file in:
          </p>
          <div className="pvt-compare-table-wrapper">
            <table className="pvt-compare-table">
              <thead>
                <tr>
                  <th>State</th>
                  <th>Governing Act</th>
                  <th>Trigger</th>
                  <th>Renewal Cycle</th>
                </tr>
              </thead>
              <tbody>
                <tr>
                  <td>Maharashtra</td>
                  <td>Shops &amp; Establishments Act 2017</td>
                  <td>1+ employee</td>
                  <td>Lifetime (one-time)</td>
                </tr>
                <tr>
                  <td>Karnataka</td>
                  <td>S&amp;CE Act 1961</td>
                  <td>1+ employee</td>
                  <td>5 years</td>
                </tr>
                <tr>
                  <td>Delhi</td>
                  <td>SHOP &amp; ESTABLISHMENT Act 1954</td>
                  <td>1+ employee</td>
                  <td>Annual</td>
                </tr>
                <tr>
                  <td>Tamil Nadu</td>
                  <td>SHOP &amp; ESTABLISHMENT Act 1947</td>
                  <td>1+ employee</td>
                  <td>Annual</td>
                </tr>
                <tr>
                  <td>Telangana</td>
                  <td>SHOP &amp; ESTABLISHMENT Act 1988</td>
                  <td>1+ employee</td>
                  <td>Annual</td>
                </tr>
                <tr>
                  <td>Odisha</td>
                  <td>S&amp;CE Act 1956</td>
                  <td>1+ employee</td>
                  <td>3 years</td>
                </tr>
                <tr>
                  <td>Gujarat</td>
                  <td>SHOP &amp; ESTABLISHMENT Act 2019 (replaced 1948 Act)</td>
                  <td>1+ employee</td>
                  <td>1–3 years</td>
                </tr>
                <tr>
                  <td>West Bengal</td>
                  <td>SHOP &amp; ESTABLISHMENT Act 1963</td>
                  <td>1+ employee</td>
                  <td>Annual</td>
                </tr>
              </tbody>
            </table>
          </div>
        </div>
      </section>

    </div>
  );
};

export default ShopRegOverview;
