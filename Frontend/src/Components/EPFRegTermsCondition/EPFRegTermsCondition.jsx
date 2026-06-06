import React from "react";
import "../PvtltdTermsCondition/PvtltdTermsCondition.css";

const EPFRegTermsCondition = () => {
  return (
    <section className="pvtltd-tc-section">
      <div className="pvtltd-tc-container">
        <div className="pvtltd-tc-card">

          <h2 className="pvtltd-tc-title">TERMS &amp; CONDITIONS</h2>

          <p className="pvtltd-tc-subtitle">
            By subscribing to any of the above plans, you agree to the following terms and conditions. Please read them carefully before proceeding.
          </p>

          <ol className="pvtltd-tc-list">
            <li className="pvtltd-tc-item">
              EPF registration is subject to verification of all submitted documents by EPFO authorities. Incomplete or incorrect documentation will delay the process and may require resubmission at the client's cost.
            </li>
            <li className="pvtltd-tc-item">
              The registration timeline of 7–15 working days is an estimate based on current EPFO portal workload and document accuracy. Actual timelines may vary and are beyond the control of Legal Terminus.
            </li>
            <li className="pvtltd-tc-item">
              18% GST is applicable on all professional and consultancy fees charged by Legal Terminus Private Limited. Government fees, if any, shall be communicated separately and charged at actuals.
            </li>
            <li className="pvtltd-tc-item">
              EPF contributions — employer: 12% of basic wages, employee: 12% of basic wages — are mandatory statutory obligations and must be deposited by the 15th of every month. These obligations are the employer's sole responsibility and are not managed by Legal Terminus under the base registration fee.
            </li>
            <li className="pvtltd-tc-item">
              Non-registration or delayed registration for eligible establishments (20 or more employees) attracts penalty under Section 14 of the EPF Act and interest under Section 7Q. Legal Terminus is not liable for penalties arising from the employer's failure to disclose the correct employee headcount at the time of engagement.
            </li>
            <li className="pvtltd-tc-item">
              UAN generation and activation is contingent on valid Aadhaar linkage and completed KYC of employees. Delays arising from employees' KYC non-compliance are outside Legal Terminus's control.
            </li>
            <li className="pvtltd-tc-item">
              Monthly ECR (Electronic Challan-cum-Return) filing is the employer's ongoing statutory obligation. It is not included in the base EPF registration fee unless explicitly specified in the selected plan.
            </li>
            <li className="pvtltd-tc-item">
              ESI (Employees' State Insurance) registration is a separate obligation applicable to establishments with 10 or more employees in notified industries or areas. It is not covered under EPF registration plans unless specified.
            </li>
            <li className="pvtltd-tc-item">
              Legal Terminus does not guarantee approval of EPF registration applications — all approvals are at the sole discretion of EPFO authorities. In the event of rejection, Legal Terminus will assist with resubmission at a nominal reprocessing charge to be communicated at that time.
            </li>
            <li className="pvtltd-tc-item">
              Legal Terminus Private Limited is a private consultancy firm and is not affiliated with EPFO, ESIC, or any government authority. All government allotments are issued directly by the respective departments. Our fees are exclusively for consultancy, documentation, and application support services.
            </li>
          </ol>

        </div>
      </div>
    </section>
  );
};

export default EPFRegTermsCondition;
