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
              Government Fee: There is no government fee for EPF Registration under the EPFO portal. Our professional fee covers advisory, establishment profile preparation, Form 5A drafting, portal filing, DSC coordination, UAN activation guidance, and post-registration support.
            </li>
            <li className="pvtltd-tc-item">
              GST on Our Fee: All quoted prices are exclusive of GST @ 18%, which will be charged at checkout. Once your business GSTIN is active, the GST component paid on our services may be eligible for input tax credit, subject to applicable GST provisions.
            </li>
            <li className="pvtltd-tc-item">
              DSC Charges: A valid Class 3 Digital Signature Certificate (DSC) is mandatory for EPF Registration and related filings on the EPFO portal. If you do not already possess a valid DSC, it will be arranged separately at actual cost (currently ₹1,499 + GST per signatory).
            </li>
            <li className="pvtltd-tc-item">
              Mandatory Registration Trigger: EPF Registration becomes mandatory under Section 1(3)(a) of the Employees' Provident Funds &amp; Miscellaneous Provisions Act, 1952 when an establishment employs 20 or more employees. Certain notified establishments may be covered at a lower employee threshold under Section 1(3)(b). Once registered, EPF coverage generally continues even if the employee count subsequently falls below the prescribed limit.
            </li>
            <li className="pvtltd-tc-item">
              Voluntary Registration: Establishments employing fewer than 20 employees may voluntarily seek EPF coverage under Section 1(4) of the Act with the consent of the employer and the majority of employees. Voluntary coverage is often adopted to improve employee benefits and attract talent. Once approved, EPF compliance becomes mandatory.
            </li>
            <li className="pvtltd-tc-item">
              Wage Threshold for EPF Coverage: Employees drawing Basic Salary plus Dearness Allowance up to ₹15,000 per month are mandatorily covered under EPF. Employees earning above this threshold may be enrolled subject to applicable EPFO rules and declarations. Employer contribution towards the Employees' Pension Scheme (EPS) is generally restricted to the statutory wage ceiling unless otherwise permitted under applicable regulations.
            </li>
            <li className="pvtltd-tc-item">
              Free EPF Update Support (1 Year): Every EPF Registration plan includes one year of professional support for routine updates and modifications, including authorized signatory changes, establishment address updates, branch additions, employee strength corrections, and DSC remapping. The support period is calculated from the date of issuance of the EPF Establishment Code.
            </li>
            <li className="pvtltd-tc-item">
              Monthly Compliance Not Included: The registration package covers only the EPF Registration process. It does not include monthly ECR filing, contribution calculations, challan generation, payment processing, employee onboarding, UAN management, grievance handling, EPFO inspections, or litigation-related matters. Such services are available separately under our Payroll &amp; EPF Compliance plans.
            </li>
            <li className="pvtltd-tc-item">
              Information &amp; Documentation Responsibility: The employer is responsible for providing accurate establishment details, employee information, PAN, address proof, bank details, and other documents required for registration. Any delay arising from incomplete, inaccurate, or inconsistent information may impact processing timelines.
            </li>
            <li className="pvtltd-tc-item">
              Out-of-Scope Items: Section 17 exempted trust setup, international worker (IW) PF compliance, higher-pension-scheme (HPS) application for individual employees, exempt establishment audit, Section 14B damages representation, EPFO inspections and inquiries, and conversion from exempted to unexempted trust are not included and quoted separately on request.
            </li>
          </ol>

        </div>
      </div>
    </section>
  );
};

export default EPFRegTermsCondition;
