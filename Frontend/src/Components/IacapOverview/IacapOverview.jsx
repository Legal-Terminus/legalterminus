import React from "react";
import "./IacapOverview.css";
import illustration from "../../assets/whypvt-imp1.svg";

const IacapOverview = () => {
  return (
    <div className="opc-full-wrapper">

      <section className="opc-intro-section">
        <div className="opc-intro-container">
          <div className="opc-intro-illustration-wrap">
            <img
              src={illustration}
              alt="Increase Authorised Capital illustration"
              className="opc-intro-illustration"
            />
          </div>

          <div className="opc-intro-content">
            <h2 className="opc-intro-title">
              Why Increase Your Authorised Capital
            </h2>
            <p className="opc-intro-text">
              Authorised capital is the maximum amount of share capital a company is allowed to issue to its shareholders, as stated in the capital clause of its Memorandum of Association. A company can issue (paid-up) shares only up to this ceiling. So when you want to bring in new investors, raise fresh funds, or convert loans into equity beyond your current limit, you must first increase the authorised capital under Section 61 of the Companies Act, 2013 — by passing a resolution and altering the MOA's capital clause.
              <br /><br />
              The process is straightforward but precise: the Articles of Association must permit the increase (if not, they are amended first), the board approves and calls a general meeting, the members pass the resolution, and Form SH-7 is filed with the Registrar within 30 days along with the government fee and stamp duty calculated on the amount of the increase. Once registered, the company has the headroom to allot new shares. Getting it right is what lets you raise capital smoothly when an investment or expansion opportunity arrives — without scrambling at the last minute.
            </p>
          </div>
        </div>
      </section>

      <section className="opc-compare-section">
        <div className="opc-compare-container">
          <h2 className="opc-compare-title">Increasing Capital vs Hitting the Ceiling: The Honest Comparison</h2>
          <p className="opc-compare-subtitle">
            What changes when you raise your authorised capital ahead of time versus being capped at the old limit:
          </p>
          <div className="opc-compare-table-wrapper">
            <table className="opc-compare-table">
              <thead>
                <tr>
                  <th>Parameter</th>
                  <th>Capital Increased</th>
                  <th>Stuck at Old Limit</th>
                </tr>
              </thead>
              <tbody>
                <tr><td>Room to Issue Shares</td><td>Headroom available</td><td>Capped — cannot allot more</td></tr>
                <tr><td>New Investment</td><td>Ready to onboard investors</td><td>Deal stalls until increase done</td></tr>
                <tr><td>Loan-to-Equity Conversion</td><td>Possible</td><td>Blocked beyond the ceiling</td></tr>
                <tr><td>Fundraise Timing</td><td>Move fast on opportunity</td><td>Weeks of delay &amp; risk</td></tr>
                <tr><td>Investor Confidence</td><td>Cap table ready</td><td>Last-minute compliance scramble</td></tr>
                <tr><td>Company Continuity</td><td>CIN &amp; history unchanged</td><td>Same, but constrained</td></tr>
                <tr><td>Cost</td><td>Fee + stamp duty on increase</td><td>Lost deal / opportunity cost</td></tr>
              </tbody>
            </table>
          </div>
        </div>
      </section>

    </div>
  );
};

export default IacapOverview;
