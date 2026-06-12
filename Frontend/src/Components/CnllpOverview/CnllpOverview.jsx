import React from "react";
import "./CnllpOverview.css";
import illustration from "../../assets/whypvt-imp1.svg";

const CnllpOverview = () => {
  return (
    <div className="opc-full-wrapper">

      <section className="opc-intro-section">
        <div className="opc-intro-container">
          <div className="opc-intro-illustration-wrap">
            <img
              src={illustration}
              alt="Change LLP Name illustration"
              className="opc-intro-illustration"
            />
          </div>

          <div className="opc-intro-content">
            <h2 className="opc-intro-title">
              Why Change Your LLP's Name
            </h2>
            <p className="opc-intro-text">
              An LLP's name is its public identity — on every invoice, contract, bank account, and licence. Over time, that name may stop fitting: you rebrand, you pivot into a new line of business, a partner whose name was in the title exits, or you receive a notice that the name is too similar to an existing company or trademark. The LLP Act, 2008 lets you change the name by reserving a new one through RUN-LLP, amending the LLP agreement, and filing Form 5 and Form 3 with the ROC to obtain a fresh Certificate of Incorporation.
              <br /><br />
              Importantly, changing the name does not change the LLP itself. The LLPIN, the entity's history, its assets, contracts, and liabilities all continue unchanged — only the name on them is updated. That means a name change is a clean, low-risk way to modernise your brand without losing your track record. The key is doing it correctly: choosing a compliant, conflict-free name, amending the agreement, and then carrying the new name through to PAN, GST, the bank, and every licence so nothing is left out of sync.
            </p>
          </div>
        </div>
      </section>

      <section className="opc-compare-section">
        <div className="opc-compare-container">
          <h2 className="opc-compare-title">Proper Name Change vs Informal Rebrand: The Honest Comparison</h2>
          <p className="opc-compare-subtitle">
            What changes when you update the LLP name officially versus just using a new name informally:
          </p>
          <div className="opc-compare-table-wrapper">
            <table className="opc-compare-table">
              <thead>
                <tr>
                  <th>Parameter</th>
                  <th>Official Name Change</th>
                  <th>Informal / Trade Name Only</th>
                </tr>
              </thead>
              <tbody>
                <tr><td>Legal Name on Record</td><td>Updated at the MCA</td><td>Still the old name</td></tr>
                <tr><td>Certificate of Incorporation</td><td>Fresh COI with new name</td><td>Unchanged</td></tr>
                <tr><td>LLP Agreement</td><td>Amended &amp; filed (Form 3)</td><td>Out of step with reality</td></tr>
                <tr><td>Invoices &amp; Contracts</td><td>Valid in the new name</td><td>Name mismatch risk</td></tr>
                <tr><td>Bank / PAN / GST</td><td>Updated &amp; consistent</td><td>Mismatch &amp; rejection risk</td></tr>
                <tr><td>Entity Continuity</td><td>LLPIN &amp; history preserved</td><td>Confusion over identity</td></tr>
                <tr><td>Brand Protection</td><td>Conflict-checked name</td><td>Possible trademark dispute</td></tr>
              </tbody>
            </table>
          </div>
        </div>
      </section>

    </div>
  );
};

export default CnllpOverview;
