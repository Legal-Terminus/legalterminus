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
              What is Trademark Opposition?
            </h2>
            <p className="opc-intro-text">
              Once a trademark application clears examination, it is advertised in the Trademark Journal — and a 4-month window opens during which any third party who believes the mark conflicts with their rights can challenge it by filing a Notice of Opposition (Form TM-O). It is the public's chance to stop a confusing or conflicting mark from being registered. Opposition has two sides: filing one to block a copycat, and defending your own application when someone opposes it.
              <br /><br />
              The proceeding is governed by strict timelines under the Trade Marks Act, 1999. After a Notice of Opposition, the applicant must file a Counter-Statement within 2 months — miss it and the application is abandoned. Both sides then file evidence by affidavit across fixed stages, after which the Registrar hears the matter and decides. Opposition is the battleground where brand rights are genuinely contested, and the side with timely action and strong evidence usually prevails.
            </p>
          </div>
        </div>
      </section>

      <section className="opc-compare-section">
        <div className="opc-compare-container">
          <h2 className="opc-compare-title">Acting on Opposition vs Ignoring It: The Honest Comparison</h2>
          <p className="opc-compare-subtitle">
            What happens when you engage with an opposition properly versus letting the deadline pass:
          </p>
          <div className="opc-compare-table-wrapper">
            <table className="opc-compare-table">
              <thead>
                <tr>
                  <th>Parameter</th>
                  <th>Acted On Time &amp; Properly</th>
                  <th>Ignored / Missed Deadline</th>
                </tr>
              </thead>
              <tbody>
                <tr><td>If You Are Opposed</td><td>Counter-statement filed — case continues</td><td>Application abandoned</td></tr>
                <tr><td>If You Oppose a Copycat</td><td>Conflicting mark can be blocked</td><td>Copycat proceeds to registration</td></tr>
                <tr><td>Evidence</td><td>Affidavits filed at each stage</td><td>Treated as having no evidence</td></tr>
                <tr><td>Hearing</td><td>Represented &amp; argued</td><td>Decided ex-parte against you</td></tr>
                <tr><td>Brand Rights</td><td>Defended / asserted</td><td>Lost or diluted</td></tr>
                <tr><td>Cost of Inaction</td><td>Fee + professional cost</td><td>Refile, rebrand or litigate later</td></tr>
                <tr><td>Path to ®</td><td>Stays open</td><td>Closed for that application</td></tr>
              </tbody>
            </table>
          </div>
        </div>
      </section>

    </div>
  );
};

export default TmoppOverview;
