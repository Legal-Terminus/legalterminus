import React from "react";
import "./TMApplicaTandC.css";

const TermsConditions = () => {
  return (
    <section className="TM-Renewal-tc-section">
      <div className="TM-Renewal-tc-container">
        {/* Heading */}
        <h2 className="TM-Renewal-tc-title">TERMS &amp; CONDITIONS</h2>

        <p className="TM-Renewal-tc-subtitle">
          By subscribing to the above plans, you agree to abide by our following additional terms and conditions
        </p>

        {/* List */}
        <ol className="TM-Renewal-tc-list">
          <li className="TM-Renewal-tc-item">
           Government fees for trademark registration are ₹4,500 per class (online) for Individuals, Sole Proprietors, and MSMEs/Startups, and ₹9,000 per class (online) for Companies, LLPs, and other entities. Physical filing attracts ₹5,000 and ₹10,000 per class respectively, as prescribed under the Trade Marks Act, 1999.</li>
          
          <li className="TM-Renewal-tc-item">
            The above fees apply to a single trademark in a single class. Multi-class applications will attract additional professional and government fees for each additional class.
          </li>

          <li className="TM-Renewal-tc-item">
            GST at 18% is applicable on professional fees.
          </li>

          <li className="TM-Renewal-tc-item">
            The above plan includes up to 5 trademark name searches. In case all submitted name options are rejected during the trademark search process, additional fees may apply for further searches.
          </li>

          <li className="TM-Renewal-tc-item">
            Government fees shall be payable at actuals, over and above the professional fees.
          </li>

          <li className="TM-Renewal-tc-item">
            If the trademark application receives an objection from the Trademark Examiner, handling of the Reply to Examination Report (including Show Cause Hearing, if applicable) is included only under the Enriched and Supreme plans.
          </li>

          <li className="TM-Renewal-tc-item">
            Opposition proceedings initiated by third parties after journal publication are covered only under the Supreme plan. Legal representation beyond one hearing will be subject to additional charges.
          </li>

          <li className="TM-Renewal-tc-item">
            Trademark renewal after 10 years is not included in any of the above plans and will be quoted separately.
          </li>

          <li className="TM-Renewal-tc-item">
            In case the applicant is a Foreign National or NRI, fees shall be determined upon mutual discussion.
          </li>

          <li className="TM-Renewal-tc-item">
            In case a prior use claim is made (i.e., any use date claimed before the date of filing), an additional fee of ₹2,500/- (+18% GST) shall be applicable under each plan. This is due to the additional effort involved, including drafting of affidavits and compilation of supporting evidence.
          </li>
        </ol>
      </div>
    </section>
  );
};

export default TermsConditions;
