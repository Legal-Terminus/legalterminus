import React from "react";
import "../PvtltdTermsCondition/PvtltdTermsCondition.css";

const ESICRegTermsCondition = () => {
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
              Government Fee: There is no government fee for ESIC Registration under the ESIC portal. Our professional fee covers advisory, establishment profile preparation, Form-1 filing, DSC coordination, employee IP number guidance, and post-registration support.
            </li>
            <li className="pvtltd-tc-item">
              GST on Our Fee: All quoted prices are exclusive of GST @ 18%, which will be charged at checkout. Once your business GSTIN is active, the GST component paid on our services may be eligible for input tax credit, subject to applicable GST provisions.
            </li>
            <li className="pvtltd-tc-item">
              DSC Charges: A valid Digital Signature Certificate (DSC) is required for ESIC portal filing. If you do not already possess one, it will be arranged separately at actual cost (currently ₹1,499 + GST per signatory).
            </li>
            <li className="pvtltd-tc-item">
              Mandatory Registration Trigger: ESIC Registration becomes mandatory under the Employees' State Insurance Act, 1948 when an establishment employs 10 or more employees (in most states and notified industries). Certain states may have a 20-employee threshold. Once registered, ESIC coverage continues irrespective of subsequent headcount reduction.
            </li>
            <li className="pvtltd-tc-item">
              Wage Ceiling for ESIC Coverage: Employees drawing gross wages up to ₹21,000 per month (₹25,000 for persons with disabilities) are covered under ESIC. Employees earning above this threshold are not covered and do not contribute to ESIC.
            </li>
            <li className="pvtltd-tc-item">
              Employee IP Numbers: Generation of employee Insurance Numbers (IP Numbers) depends on Aadhaar-linked mobile verification for each employee. Delays arising from employees' KYC non-compliance or Aadhaar-bank mismatches are outside Legal Terminus's control.
            </li>
            <li className="pvtltd-tc-item">
              Monthly Compliance Not Included: The registration package covers only the ESIC Registration process. It does not include monthly ESI return filing, contribution calculations, challan generation, employee onboarding, grievance handling, or ESIC inspections. Such services are available separately.
            </li>
            <li className="pvtltd-tc-item">
              Free ESIC Update Support (1 Year — Supreme Plan): The Supreme plan includes one year of support for routine updates such as authorised signatory changes, address updates, employee additions, and DSC remapping. Support period begins from the date of Employer Code allotment.
            </li>
            <li className="pvtltd-tc-item">
              Information &amp; Documentation Responsibility: The employer is responsible for providing accurate establishment details, employee information, and other documents required for registration. Delays from incomplete or inaccurate information may impact processing timelines.
            </li>
            <li className="pvtltd-tc-item">
              Out-of-Scope Items: ESIC court matters, recovery proceedings, inspection representation, Section 85 prosecution defence, exempted establishment applications, and international worker compliance are not included and quoted separately on request.
            </li>
          </ol>

        </div>
      </div>
    </section>
  );
};

export default ESICRegTermsCondition;
