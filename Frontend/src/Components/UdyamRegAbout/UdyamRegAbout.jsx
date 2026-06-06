import React from "react";
import "./UdyamRegAbout.css";
import udyamIllustration from "../../assets/whypvt-imp1.svg";

const UdyamRegAbout = () => {
  return (
    <div className="udyam-full-wrapper">

      <section className="udyam-intro-section">
        <div className="udyam-intro-container">

          <div className="udyam-intro-illustration-wrap">
            <img
              src={udyamIllustration}
              alt="Udyam MSME Registration illustration"
              className="udyam-intro-illustration"
            />
          </div>

          <div className="udyam-intro-content">
            <h2 className="udyam-intro-title">
              What is Udyam / MSME Registration?
            </h2>
            <p className="udyam-intro-text">
              Udyam Registration is the official MSME registration issued by the Ministry of Micro, Small &amp; Medium Enterprises (MoMSME), Government of India. Launched on 1 July 2020 as the successor to the Udyog Aadhaar system, it replaced all earlier registrations (EM-I / EM-II / UAM) and is now the only valid MSME certificate recognised for government schemes, bank priority lending, and tender participation.
            </p>
            <p className="udyam-intro-text">
              MSMEs are the backbone of the Indian economy — contributing approximately 29% to GDP, employing over 11 crore people, and accounting for nearly 50% of total exports. Udyam Registration translates this economic significance into tangible business benefits: collateral-free loans, trademark fee waivers, delayed payment protections, and access to over 50 central and state government schemes. One self-declaration. One certificate. Lifetime validity.
            </p>
          </div>
        </div>
      </section>

      <section className="udyam-compare-section">
        <div className="udyam-compare-container">
          <h2 className="udyam-compare-title">Udyam vs Udyog Aadhaar vs Shops Act: What's Different</h2>
          <p className="udyam-compare-subtitle">
            Many business owners confuse these registrations. Here's the honest comparison:
          </p>
          <div className="udyam-compare-table-wrapper">
            <table className="udyam-compare-table">
              <thead>
                <tr>
                  <th>Parameter</th>
                  <th>Udyam Registration</th>
                  <th>Udyog Aadhaar (old)</th>
                  <th>Shops &amp; Est. Act</th>
                </tr>
              </thead>
              <tbody>
                <tr><td>Issued by</td><td>MoMSME (Central Govt)</td><td>MoMSME (Central Govt)</td><td>State Government</td></tr>
                <tr><td>Status</td><td>Active (current)</td><td>Discontinued (2020)</td><td>Active (state-specific)</td></tr>
                <tr><td>Basis</td><td>PAN + Aadhaar OTP</td><td>Aadhaar self-declaration</td><td>Business premises</td></tr>
                <tr><td>MSME Loans</td><td>Yes — Priority Sector</td><td>No longer valid</td><td>No</td></tr>
                <tr><td>Trademark Fee Waiver</td><td>Yes — 50% subsidy</td><td>No longer accepted</td><td>No</td></tr>
                <tr><td>Government Tenders</td><td>Eligible (EMD waiver)</td><td>No longer accepted</td><td>Not applicable</td></tr>
                <tr><td>Annual Update Required</td><td>Yes (ITR-based)</td><td>N/A</td><td>Renewal varies by state</td></tr>
                <tr><td>Government Fee</td><td>NIL</td><td>NIL (discontinued)</td><td>State-based fee</td></tr>
              </tbody>
            </table>
          </div>
        </div>
      </section>

    </div>
  );
};

export default UdyamRegAbout;
