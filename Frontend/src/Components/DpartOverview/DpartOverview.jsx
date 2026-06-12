import React from "react";
import "./DpartOverview.css";
import illustration from "../../assets/whypvt-imp1.svg";

const DpartOverview = () => {
  return (
    <div className="opc-full-wrapper">

      <section className="opc-intro-section">
        <div className="opc-intro-container">
          <div className="opc-intro-illustration-wrap">
            <img
              src={illustration}
              alt="Dissolve Partnership Firm illustration"
              className="opc-intro-illustration"
            />
          </div>

          <div className="opc-intro-content">
            <h2 className="opc-intro-title">
              Why Formally Dissolve a Partnership Firm
            </h2>
            <p className="opc-intro-text">
              Dissolution of a partnership firm means the complete winding-up of the business — the relationship between all the partners comes to an end, the firm's assets are realised, its liabilities are paid off, and any surplus is distributed among the partners. It is different from a partner merely retiring: dissolution closes the firm itself. The process is governed by the Indian Partnership Act, 1932, and centres on a properly drafted dissolution deed and a clean settlement of accounts under Section 48.
              <br /><br />
              Walking away without a formal dissolution is risky. Until a public notice is given, partners can remain liable to outsiders who still believe the firm is operating, and a firm's PAN, GST, and licences keep generating compliance obligations long after the business has stopped. Worse, a vague or absent settlement of accounts is the single biggest source of bitter disputes between former partners. A formal dissolution settles who owes what, ends each partner's liability cleanly, and closes the firm on record — protecting relationships and finances alike.
            </p>
          </div>
        </div>
      </section>

      <section className="opc-compare-section">
        <div className="opc-compare-container">
          <h2 className="opc-compare-title">Formal Dissolution vs Just Walking Away: The Honest Comparison</h2>
          <p className="opc-compare-subtitle">
            What happens when you dissolve a firm properly versus simply stopping the business:
          </p>
          <div className="opc-compare-table-wrapper">
            <table className="opc-compare-table">
              <thead>
                <tr>
                  <th>Parameter</th>
                  <th>Formally Dissolved</th>
                  <th>Just Walked Away</th>
                </tr>
              </thead>
              <tbody>
                <tr><td>Settlement of Accounts</td><td>Documented &amp; final</td><td>Open — a future dispute</td></tr>
                <tr><td>Partner Liability to Outsiders</td><td>Ends with public notice</td><td>Continues until notice given</td></tr>
                <tr><td>PAN / GST / Licences</td><td>Surrendered &amp; closed</td><td>Keep generating notices</td></tr>
                <tr><td>Mutual Release</td><td>Signed by all partners</td><td>None — claims can resurface</td></tr>
                <tr><td>Registrar of Firms</td><td>Notice of dissolution filed</td><td>Records still show firm active</td></tr>
                <tr><td>Tax Closure</td><td>Final return filed</td><td>Non-filing notices &amp; penalty</td></tr>
                <tr><td>Relationships</td><td>Clean, dispute-free exit</td><td>Bitter, litigation-prone</td></tr>
              </tbody>
            </table>
          </div>
        </div>
      </section>

    </div>
  );
};

export default DpartOverview;
