import React from "react";
import "./PubpvtOverview.css";
import illustration from "../../assets/whypvt-imp1.svg";

const PubpvtOverview = () => {
  return (
    <div className="opc-full-wrapper">

      <section className="opc-intro-section">
        <div className="opc-intro-container">
          <div className="opc-intro-illustration-wrap">
            <img
              src={illustration}
              alt="Public Limited to Private Limited Conversion illustration"
              className="opc-intro-illustration"
            />
          </div>

          <div className="opc-intro-content">
            <h2 className="opc-intro-title">
              Why Convert a Public Limited Company into a Private Limited Company
            </h2>
            <p className="opc-intro-text">
              A Public Limited Company is built for raising capital from the public and for scale — but that comes with the heaviest compliance regime under the Companies Act: at least 7 members and 3 directors, more board meetings, broader disclosures, and audit-committee and other governance thresholds. For a business that is now closely held and no longer raising from the public, all of that is cost without benefit. Converting to a Private Limited Company strips it back — a tighter, owner-controlled structure with restricted share transfers, a capped membership, and far lighter compliance.
              <br /><br />
              The conversion is done under Section 14 read with Section 18 of the Companies Act, 2013. The company passes a special resolution, alters its MOA and AOA to add the private-company restrictions, and applies to the Regional Director for approval (Form RD-1) — with a newspaper notice (Form INC-25A) and individual intimation to creditors, the ROC, and the RD. On approval, the order is filed in INC-28, the word "Private" is added to the name, and a fresh Certificate of Incorporation is issued — the same business, now leaner and closely held.
            </p>
          </div>
        </div>
      </section>

      <section className="opc-compare-section">
        <div className="opc-compare-container">
          <h2 className="opc-compare-title">Public Limited vs Private Limited: What Changes on Conversion</h2>
          <p className="opc-compare-subtitle">
            Conversion trades public-capital access for a leaner, owner-controlled structure. Here is what shifts when a Public Limited becomes a Private Limited Company:
          </p>
          <div className="opc-compare-table-wrapper">
            <table className="opc-compare-table">
              <thead>
                <tr>
                  <th>Parameter</th>
                  <th>Public Limited (Before)</th>
                  <th>Private Limited (After)</th>
                </tr>
              </thead>
              <tbody>
                <tr><td>Minimum Members</td><td>7</td><td>2</td></tr>
                <tr><td>Minimum Directors</td><td>3</td><td>2</td></tr>
                <tr><td>Maximum Members</td><td>No limit</td><td>200</td></tr>
                <tr><td>Share Transfer</td><td>Freely transferable</td><td>Restricted by AOA</td></tr>
                <tr><td>Public Fundraising</td><td>IPO / FPO / public issue</td><td>Not permitted</td></tr>
                <tr><td>Name Ending</td><td>"Limited"</td><td>"Private Limited"</td></tr>
                <tr><td>Compliance Load</td><td>Heavier (more meetings &amp; disclosures)</td><td>Lighter</td></tr>
              </tbody>
            </table>
          </div>
        </div>
      </section>

    </div>
  );
};

export default PubpvtOverview;
