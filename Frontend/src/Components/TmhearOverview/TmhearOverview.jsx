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
          <h2 className="opc-compare-title">Represented vs Unrepresented / Absent: The Honest Comparison</h2>
          <p className="opc-compare-subtitle">
            What happens to your application depending on how the hearing is handled:
          </p>
          <div className="opc-compare-table-wrapper">
            <table className="opc-compare-table">
              <thead>
                <tr>
                  <th>Parameter</th>
                  <th>Prepared &amp; Represented</th>
                  <th>Unprepared / Absent</th>
                </tr>
              </thead>
              <tbody>
                <tr><td>Your Side of the Case</td><td>Argued clearly before the Officer</td><td>Not heard / weakly put</td></tr>
                <tr><td>Written Submissions</td><td>Filed in advance, framing the case</td><td>Missing or last-minute</td></tr>
                <tr><td>Evidence</td><td>Organised &amp; presented</td><td>Unstructured or ignored</td></tr>
                <tr><td>If You Are Absent</td><td>Attorney appears for you</td><td>Decided ex-parte against you</td></tr>
                <tr><td>Likely Outcome</td><td>Best chance of acceptance</td><td>Refusal / abandonment</td></tr>
                <tr><td>Next Steps</td><td>Advised on review / appeal</td><td>Left guessing</td></tr>
                <tr><td>Path to ®</td><td>Stays open</td><td>Closed for that application</td></tr>
              </tbody>
            </table>
          </div>
        </div>
      </section>

    </div>
  );
};

export default TmhearOverview;
