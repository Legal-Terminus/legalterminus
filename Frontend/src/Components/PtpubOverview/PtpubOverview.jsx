import React from "react";
import "./PtpubOverview.css";

import pvtIllustration from "../../assets/whypvt-imp.svg";

const PtpubOverview = () => {
  return (
    <div className="pvt-full-wrapper">

      {/* ===========================
          INTRO
      ============================ */}
      <section className="pvt-intro-section">
        <div className="pvt-intro-container">
          {/* Illustration */}
          <div className="pvt-intro-illustration-wrap">
            <img
              src={pvtIllustration}
              alt="Private to Public Limited conversion illustration"
              className="pvt-intro-illustration"
            />
          </div>

          {/* Text */}
          <div className="pvt-intro-content">
            <h2 className="pvt-intro-title">
              Why Convert a Private Limited Company into a Public Limited Company
            </h2>
            <p className="pvt-intro-text">
              A Private Limited Company is built for a closely held group — it caps membership at 200, restricts share transfers through its articles, and is barred from inviting the public to subscribe to its shares. That works beautifully until you need to raise real capital. A Public Limited Company removes all three limits: there is no upper ceiling on members, shares are freely transferable under Section 58, and the company can raise money from the public through a public issue, rights issue, or — eventually — an IPO on the NSE / BSE.
              <br /><br />
              Converting does not start a new company. Under Section 14 and Section 18 of the Companies Act, 2013, your existing company passes a special resolution, alters its MOA and AOA to drop the private restrictions, and files MGT-14 and INC-27 with the ROC. The company must have at least 7 members and 3 directors at the time of conversion. On approval, the word "Private" is removed from the name and a fresh Certificate of Incorporation is issued — the same business, the same history, now structured for public capital and listing optionality.
            </p>
          </div>
        </div>
      </section>


      {/* ===========================
          PRIVATE vs PUBLIC
      ============================ */}
      <section className="pub-compare-section">
        <div className="pub-compare-container">
          <h2 className="pub-compare-title">Private Limited vs Public Limited: What Changes on Conversion</h2>
          <p className="pub-compare-subtitle">
            Conversion is a deliberate trade — you take on heavier governance in exchange for unrestricted membership, freely transferable shares, and access to public capital. Here is exactly what shifts when a Private Limited becomes a Public Limited Company.
          </p>
          <div className="pub-compare-table-wrapper">
            <table className="pub-compare-table">
              <thead>
                <tr>
                  <th>Parameter</th>
                  <th>Private Limited (Before)</th>
                  <th>Public Limited (After)</th>
                </tr>
              </thead>
              <tbody>
                <tr>
                  <td>Minimum Members</td>
                  <td>2</td>
                  <td>7</td>
                </tr>
                <tr>
                  <td>Minimum Directors</td>
                  <td>2</td>
                  <td>3</td>
                </tr>
                <tr>
                  <td>Maximum Members</td>
                  <td>200</td>
                  <td>No limit</td>
                </tr>
                <tr>
                  <td>Share Transfer</td>
                  <td>Restricted by AOA</td>
                  <td>Freely transferable (Sec 58)</td>
                </tr>
                <tr>
                  <td>Public Fundraising</td>
                  <td>Prohibited</td>
                  <td>IPO / FPO / rights / public issue</td>
                </tr>
                <tr>
                  <td>Name Ending</td>
                  <td>"Private Limited"</td>
                  <td>"Limited"</td>
                </tr>
                <tr>
                  <td>Compliance Load</td>
                  <td>Lighter</td>
                  <td>Heavier (more meetings, disclosures)</td>
                </tr>
              </tbody>
            </table>
          </div>
        </div>
      </section>

    </div>
  );
};

export default PtpubOverview;
