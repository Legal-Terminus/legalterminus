import React from "react";
import "./PvtltdTermsCondition.css";

const TermsConditions = () => {
  return (
    <section className="pvtltd-tc-section">
      <div className="pvtltd-tc-container">
        {/* Heading */}
        <h2 className="pvtltd-tc-title">TERMS &amp; CONDITIONS</h2>

        {/* Sub heading */}
        <p className="pvtltd-tc-subtitle">
          By subscribing to any of the above plans, you agree to the following terms. No fine print, no nasty surprises — just transparency.
        </p>

        {/* List */}
        <ol className="pvtltd-tc-list">
          <li className="pvtltd-tc-item">
            Stamp Duty is state-specific and shall be charged at actuals over and above the plan price.
          </li>

          <li className="pvtltd-tc-item">
            The above professional fees are valid for Authorised Capital up to ₹15 Lakhs, where the government filing fee is at minimum. For Authorised Capital above ₹15 Lakhs, additional government fees will apply and shall be charged at actuals.
          </li>

          <li className="pvtltd-tc-item">
            The plan fee covers name reservation for up to 4 proposed names. If all 4 names are rejected by the MCA/RoC, an additional filing fee will be charged for re-submission.
          </li>

          <li className="pvtltd-tc-item">
            Audit fees are NOT part of our professional fees and shall be paid directly by the client to the appointed Statutory Auditor. (This is legally mandated and non-negotiable as per the Companies Act, 2013.)
          </li>

          <li className="pvtltd-tc-item">
            18% GST is applicable on all professional fees as per prevailing tax laws.
          </li>

           <li className="pvtltd-tc-item">
            Government fees, stamp duty, and Digital Signature Certificate (DSC) charges are payable at actuals and are not included in any plan.
          </li>

           <li className="pvtltd-tc-item">
            If any Director or Shareholder is a Foreign National or Non-Resident Indian (NRI), the incorporation fee shall be determined on a case-to-case basis and confirmed prior to engagement.
          </li>

           <li className="pvtltd-tc-item">
            In case your requirements exceed the scope of any listed plan, our team will be happy to customise a package just for you — just reach out.
          </li>

          <li className="pvtltd-tc-item">
            Supreme Plan fees cover compliance for the 1st Financial Year only. Subsequent years will be quoted separately.
          </li>

          <li className="pvtltd-tc-item">
            Commencement of Business (Form INC-20A) must be filed within 180 days of the date of incorporation. Failure to do so may attract penalties under Section 11 of the Companies Act, 2013. We will remind you, but timely document and payment submission from the client is essential.
          </li>
        </ol>
      </div>
    </section>
  );
};

export default TermsConditions;
