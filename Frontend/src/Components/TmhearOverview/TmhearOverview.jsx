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
              Why Trademark Hearing Matters
            </h2>
            <p className="opc-intro-text">
              A Trademark Hearing is an important stage in the trademark registration process where the applicant gets an opportunity to present and defend their case before the Trade Marks Registry. Proper preparation, legal arguments, and timely appearance are crucial, as even a strong application can be refused if the hearing is not handled effectively.
              <br /><br />
              Trademark hearings may arise in cases such as Show Cause Hearings, Opposition Hearings, Rectification/Cancellation matters, and Renewal or Restoration disputes. Today, most hearings are conducted online through video conferencing, making attendance convenient across India. At Legal Terminus, we provide complete assistance with hearing preparation, representation, legal submissions, and post-hearing follow-up to help protect your trademark rights.
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
