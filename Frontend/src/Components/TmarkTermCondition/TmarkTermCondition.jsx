import React from "react";
import "./TmarkTermCondition.css";

const TmarkTermCondition = () => {
  return (
    <section className="opctc-section">
      <div className="opctc-container">
        <div className="opctc-card">
          <h2 className="opctc-title">TERMS &amp; CONDITIONS</h2>

          <p className="opctc-subtitle">
            By subscribing to the above plans, you agree to abide by our following additional terms and conditions
          </p>

          <ol className="opctc-list">
            <li className="opctc-item">
              Professional Fee Only: All quoted prices cover professional services — trademark search, class selection, TM-A drafting, and filing. They are exclusive of government fees, statutory charges, and out-of-pocket costs.
            </li>
            <li className="opctc-item">
              Government Fees Payable Separately: The IP India filing fee (₹4,500 per class for individual/startup/MSME, ₹9,000 per class for others) is payable to the Trade Marks Registry and reimbursed at actuals per the official fee schedule.
            </li>
            <li className="opctc-item">
              GST on Our Fee: All quoted prices are exclusive of GST @ 18%, charged at checkout.
            </li>
            <li className="opctc-item">
              No Guarantee of Registration: Filing a trademark application does not guarantee registration. Acceptance depends on the Registry's examination, possible objections under Sections 9 and 11, and any third-party opposition — all of which are at the discretion of the Trade Marks Registry.
            </li>
            <li className="opctc-item">
              Search is Indicative: A trademark search reduces, but cannot eliminate, the risk of objection or opposition. The public register may not reflect very recent or unpublished applications, and similarity assessments are ultimately the Registrar's call.
            </li>
            <li className="opctc-item">
              Correct Applicant &amp; Class: Registration rights flow to the applicant named and the class(es) filed. The applicant is responsible for confirming the correct legal name, proprietor type, and the goods/services class before filing, as these cannot be changed later.
            </li>
            <li className="opctc-item">
              Examination &amp; Opposition Replies: Objection replies and opposition defence (where included) are limited to the scope of the chosen plan. Hearings, evidence affidavits, and protracted opposition proceedings are quoted separately.
            </li>
            <li className="opctc-item">
              Use of ™ and ®: The ™ symbol may be used from the date of filing. The ® symbol may be used only after the mark is registered and a registration certificate is issued. Misuse of ® before registration is the applicant's liability.
            </li>
            <li className="opctc-item">
              Out-of-Scope Items: Trademark assignment, rectification, renewal, infringement litigation, international (Madrid) filing, and copyright/design registration are not included and quoted separately.
            </li>
          </ol>
        </div>
      </div>
    </section>
  );
};

export default TmarkTermCondition;
