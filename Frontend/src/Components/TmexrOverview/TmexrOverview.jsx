import React from "react";
import "./TmexrOverview.css";
import illustration from "../../assets/whypvt-imp1.svg";

const objectionCategories = [
  { type: "Descriptive / Generic / Lacking Distinctiveness", basis: "Section 9(1)(a)/(b)/(c)", strategy: "Cite acquired distinctiveness; market evidence; visual / stylistic distinctiveness; prior use claim" },
  { type: "Deceptive / Scandalous / Hurts Religious Sentiment", basis: "Section 9(2)", strategy: "Cite mark interpretation context; intended use; cultural neutrality" },
  { type: "Similar to Earlier Registered Mark", basis: "Section 11(1)", strategy: "Distinguish phonetically / visually / structurally; class / goods difference; co-existence agreements" },
  { type: "Similar to Well-Known Mark", basis: "Section 11(2)", strategy: "Demonstrate no likelihood of dilution / unfair advantage; class distance" },
  { type: "Procedural / Documentation Defects", basis: "Rule 23", strategy: "File missing documents; correct via Form TM-M (₹900); affidavits as needed" },
  { type: "Compliance with Trade Marks Rules", basis: "Rule 33 / 41", strategy: "Address procedural compliance; certification / classification corrections" },
];

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
              Why Reply to Examination Report Matters
            </h2>
            <p className="opc-intro-text">
              After a trademark application is filed, the Trade Marks Registry may raise objections under Section 9 (descriptive, non-distinctive, or generic marks) or Section 11 (similarity with existing trademarks). These objections are issued through an Examination Report, and the applicant is generally required to submit a reply within 30 days.
              <br /><br />
              A Reply to Examination Report is a legal response explaining why the trademark should be registered. A well-drafted reply supported by legal arguments, prior use details, and relevant evidence can help move the application toward acceptance. Missing the deadline or filing an inadequate response may lead to abandonment of the application or a Show Cause Hearing, making timely action and proper drafting essential.
            </p>
          </div>
        </div>
      </section>

      <section className="opc-compare-section">
        <div className="opc-compare-container">
          <h2 className="opc-compare-title">Examination Report — Objection Categories Summary</h2>
          <p className="opc-compare-subtitle">
            The objection categories you may see in an Examination Report — and how each is typically answered:
          </p>
          <div className="opc-compare-table-wrapper">
            <table className="opc-compare-table">
              <thead>
                <tr>
                  <th>Objection Type</th>
                  <th>Statutory Basis</th>
                  <th>Typical Reply Strategy</th>
                </tr>
              </thead>
              <tbody>
                {objectionCategories.map((row, i) => (
                  <tr key={i}>
                    <td>{row.type}</td>
                    <td>{row.basis}</td>
                    <td>{row.strategy}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </section>

    </div>
  );
};

export default TmexrOverview;
