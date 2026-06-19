import React from "react";
import "./TmoppOverview.css";
import illustration from "../../assets/whypvt-imp1.svg";

const TmoppOverview = () => {
  return (
    <div className="opc-full-wrapper">

      <section className="opc-intro-section">
        <div className="opc-intro-container">
          <div className="opc-intro-illustration-wrap">
            <img
              src={illustration}
              alt="Trademark Opposition illustration"
              className="opc-intro-illustration"
            />
          </div>

          <div className="opc-intro-content">
            <h2 className="opc-intro-title">
              Why Trademark Opposition Matters
            </h2>
            <p className="opc-intro-text">
              Trademark Opposition arises when a trademark application is published in the Trade Marks Journal and a third party challenges its registration within the prescribed 4-month opposition period. It is the final opportunity to object to a trademark before it becomes registered, helping brand owners prevent similar or conflicting marks from gaining legal protection.
              <br /><br />
              The opposition process involves notices, counter statements, evidence submissions, and hearings before the Trade Marks Registry. Missing a deadline, especially for filing a Counter Statement, can lead to automatic abandonment of the application. Therefore, timely tracking, proper legal drafting, and continuous follow-up are essential throughout the opposition proceedings.
            </p>
          </div>
        </div>
      </section>

      <section className="opc-compare-section">
        <div className="opc-compare-container">
          <h2 className="opc-compare-title">Opposition Lifecycle — Stages + Timeline Summary</h2>
          <p className="opc-compare-subtitle">
            The full journey from journal publication to the Registrar's order, with the governing rule and statutory deadline at each stage:
          </p>
          <div className="opc-compare-table-wrapper">
            <table className="opc-compare-table">
              <thead>
                <tr>
                  <th>Stage</th>
                  <th>Rule / Section</th>
                  <th>Timeline / Deadline</th>
                </tr>
              </thead>
              <tbody>
                <tr><td>TM application accepted + Journal published</td><td>Section 20</td><td>Starts the opposition window</td></tr>
                <tr><td>File Notice of Opposition (Form TM-O)</td><td>Section 21(1) / Rule 42</td><td>Within 4 MONTHS of Journal publication (NO EXTENSION)</td></tr>
                <tr><td>Service of opposition notice on applicant</td><td>Rule 43</td><td>By Registrar</td></tr>
                <tr><td>File Counter Statement (Form TM-O)</td><td>Rule 44</td><td>Within 2 MONTHS of notice receipt (NO EXTENSION)</td></tr>
                <tr><td>Opposer's evidence affidavit</td><td>Rule 45</td><td>Within 2 MONTHS of counter statement</td></tr>
                <tr><td>Applicant's evidence affidavit</td><td>Rule 46</td><td>Within 2 MONTHS of opposer's evidence</td></tr>
                <tr><td>Opposer's reply evidence</td><td>Rule 47</td><td>Within 1 MONTH + 1 month extension</td></tr>
                <tr><td>Final Hearing (online video conference)</td><td>Rule 50</td><td>Scheduled by Registrar; max 2 adjournments</td></tr>
                <tr><td>Registrar's Order</td><td>Section 21(5)</td><td>30-90 days post-hearing</td></tr>
              </tbody>
            </table>
          </div>
        </div>
      </section>

    </div>
  );
};

export default TmoppOverview;
