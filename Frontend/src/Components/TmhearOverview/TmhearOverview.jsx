import React from "react";
import "./TmhearOverview.css";
import illustration from "../../assets/whypvt-imp1.svg";

const TmhearOverview = () => {
  return (
    <div className="opc-full-wrapper">

      <section className="opc-intro-section">
        <div className="opc-intro-container">
          <div className="opc-intro-illustration-wrap">
            <img
              src={illustration}
              alt="Trademark Hearing illustration"
              className="opc-intro-illustration"
            />
          </div>

          <div className="opc-intro-content">
            <h2 className="opc-intro-title">
              What is a Trademark Hearing?
            </h2>
            <p className="opc-intro-text">
              A trademark hearing is an oral proceeding before a Hearing Officer at the Trade Marks Registry, where you get to argue your case face-to-face (now usually by video conference). It arises in two situations: a show-cause hearing, when the Examiner is not satisfied by your written reply to the examination report and wants to hear you before deciding; and an opposition hearing, when your application has been opposed and both sides argue the matter after the evidence stages.
              <br /><br />
              The hearing is frequently the final, decisive step before a mark is accepted or refused. The Hearing Officer will test the objection or opposition against your arguments and evidence, and then pass a reasoned order. Walking in with well-drafted written submissions, organised evidence, and an attorney who can argue the law makes the difference between acceptance and refusal. Equally, simply not attending almost always results in the application being refused or treated as abandoned ex-parte.
            </p>
          </div>
        </div>
      </section>

      <section className="opc-compare-section">
        <div className="opc-compare-container">
          <h2 className="opc-compare-title">Hearing Types + Triggering Conditions Summary</h2>
          <p className="opc-compare-subtitle">
            The four hearing types before the Trade Marks Registry, what triggers each, and the governing rule or section:
          </p>
          <div className="opc-compare-table-wrapper">
            <table className="opc-compare-table">
              <thead>
                <tr>
                  <th>Hearing Type</th>
                  <th>Triggering Stage</th>
                  <th>Governing Rule / Section</th>
                </tr>
              </thead>
              <tbody>
                <tr><td>Show Cause Hearing</td><td>Examiner not persuaded by Reply to Examination Report</td><td>Rule 33 (15-day min notice)</td></tr>
                <tr><td>Opposition Final Hearing</td><td>Opposition pleadings + evidence stages closed</td><td>Rule 50 (max 2 adjournments)</td></tr>
                <tr><td>Rectification Hearing</td><td>Rectification / cancellation petition filed</td><td>Sections 47 / 57</td></tr>
                <tr><td>Renewal / Restoration Hearing</td><td>Contested renewal / restoration matter</td><td>Section 25 / Rule 60</td></tr>
                <tr><td>Hearing format (2026)</td><td>Online video conference (default)</td><td>Physical only on request</td></tr>
                <tr><td>Hearing Officer</td><td>Senior Examiner / Asst Registrar / Registrar</td><td>Depending on matter type</td></tr>
              </tbody>
            </table>
          </div>
        </div>
      </section>

    </div>
  );
};

export default TmhearOverview;
