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
              Why Get Udyam Registered
            </h2>
            <p className="udyam-intro-text">
              Udyam Registration is the official MSME identity issued by the Ministry of MSME under the MSMED Act, 2006. It replaced the older Udyog Aadhaar Memorandum (UAM) system in July 2020 and is now mandatory for any business that wants to access MSME-specific benefits — and there are real benefits, not just ceremonial ones. Section 43B(h) of the Income Tax Act (effective FY 2023-24) makes it MANDATORY for your B2B customers to pay you within 45 days if you have a valid Udyam — failure means they cannot claim the expense as a tax deduction. That alone has rewritten payment behaviour across SME India.
            </p>
            <p className="udyam-intro-text">
              Beyond Section 43B(h): CGTMSE-backed collateral-free loans up to Rs.5 cr, priority sector lending at softer rates, exemption from earnest money deposit on government tenders, GeM marketplace access, subsidies on patent / trademark / ISO certification, concessional electricity in some states, MSME Samadhaan portal for delayed payment recovery. The certificate is free; the network of benefits it unlocks is genuinely substantial.
            </p>
          </div>
        </div>
      </section>

      <section className="udyam-compare-section">
        <div className="udyam-compare-container">
          <h2 className="udyam-compare-title">MSME Classification (FY 2025-26): The Deep Dive</h2>
          <p className="udyam-compare-subtitle">
            Per the Budget 2025 amendment to the MSMED Act, the classification thresholds were enhanced effective 1 April 2025. Both investment AND turnover conditions must be met for a category — crossing either limit pushes the enterprise into the next category.
          </p>
          <div className="udyam-compare-table-wrapper">
            <table className="udyam-compare-table">
              <thead>
                <tr>
                  <th>Category</th>
                  <th>Investment in P&amp;M / Equipment</th>
                  <th>Turnover</th>
                  <th>Sector</th>
                </tr>
              </thead>
              <tbody>
                <tr>
                  <td>Micro</td>
                  <td>Up to Rs.2.5 crore</td>
                  <td>Up to Rs.10 crore</td>
                  <td>Manufacturing + Service + Trading</td>
                </tr>
                <tr>
                  <td>Small</td>
                  <td>Up to Rs.25 crore</td>
                  <td>Up to Rs.100 crore</td>
                  <td>Manufacturing + Service + Trading</td>
                </tr>
                <tr>
                  <td>Medium</td>
                  <td>Up to Rs.125 crore</td>
                  <td>Up to Rs.500 crore</td>
                  <td>Manufacturing + Service + Trading</td>
                </tr>
                <tr>
                  <td>Above Medium</td>
                  <td>&gt; Rs.125 crore</td>
                  <td>&gt; Rs.500 crore</td>
                  <td>Not eligible for MSME benefits</td>
                </tr>
              </tbody>
            </table>
          </div>
        </div>
      </section>

    </div>
  );
};

export default UdyamRegAbout;
