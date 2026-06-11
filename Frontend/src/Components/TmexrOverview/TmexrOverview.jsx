import React from "react";
import "./TmexrOverview.css";
import illustration from "../../assets/whypvt-imp1.svg";

const TmexrOverview = () => {
  return (
    <div className="opc-full-wrapper">

      <section className="opc-intro-section">
        <div className="opc-intro-container">
          <div className="opc-intro-illustration-wrap">
            <img
              src={illustration}
              alt="Trademark Examination Reply illustration"
              className="opc-intro-illustration"
            />
          </div>

          <div className="opc-intro-content">
            <h2 className="opc-intro-title">
              What is a Trademark Examination Report Reply?
            </h2>
            <p className="opc-intro-text">
              After you file a trademark application, the Trade Marks Registry examines it and may issue an examination report raising objections — most commonly under Section 9 (the mark is descriptive, generic, or non-distinctive) or Section 11 (it is identical or deceptively similar to an existing mark). The examination report reply is your formal, written response defending the mark, addressing each objection with legal arguments, evidence, and case-law citations.
              <br /><br />
              This is the most decisive stage of the whole registration journey. The reply must be filed within 30 days of receiving the report — miss it, and your application is treated as abandoned, costing you the filing fee, the priority date, and the mark itself. A strong, well-argued reply can convert an objection into acceptance and journal publication; a weak or templated one often leads to refusal. Getting the reply right is what turns a filed application into a registered trademark.
            </p>
          </div>
        </div>
      </section>

      <section className="opc-compare-section">
        <div className="opc-compare-container">
          <h2 className="opc-compare-title">Strong Reply vs Weak / No Reply: The Honest Comparison</h2>
          <p className="opc-compare-subtitle">
            What happens to your application depending on how the examination objection is handled:
          </p>
          <div className="opc-compare-table-wrapper">
            <table className="opc-compare-table">
              <thead>
                <tr>
                  <th>Parameter</th>
                  <th>Strong, Timely Reply</th>
                  <th>Weak / No Reply</th>
                </tr>
              </thead>
              <tbody>
                <tr><td>Application Status</td><td>Proceeds toward acceptance</td><td>Abandoned / refused</td></tr>
                <tr><td>Filing Fee &amp; Priority</td><td>Preserved</td><td>Lost entirely</td></tr>
                <tr><td>Argument Quality</td><td>Tailored, case-law backed</td><td>Generic, easily rejected</td></tr>
                <tr><td>Section 9 Objection</td><td>Met with evidence of use</td><td>Left unanswered</td></tr>
                <tr><td>Section 11 Objection</td><td>Marks distinguished / consent</td><td>Treated as conceded</td></tr>
                <tr><td>Hearing Outcome</td><td>Prepared &amp; represented</td><td>Unattended → refusal</td></tr>
                <tr><td>Path to ®</td><td>Open</td><td>Closed — must refile</td></tr>
              </tbody>
            </table>
          </div>
        </div>
      </section>

    </div>
  );
};

export default TmexrOverview;
