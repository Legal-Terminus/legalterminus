import React from "react";
import "./EpfRetTermCondition.css";

const EpfRetTermCondition = () => {
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
              Monthly Subscription Model: Our EPF Return Filing plans are MONTHLY SUBSCRIPTIONS — billed monthly, no lock-in, cancellable with 30 days' notice. Each month's subscription covers the 8 deliverables: employee addition (Form 11 new joinee processing), KYC seeding (Aadhaar + PAN + Bank linkage to UAN), Form 5A annual filing (owners / partners / directors), eSign approval coordination, ECR statement preparation, ECR upload on EPF portal, acknowledgement (TRRN) delivery to client, and EPF contribution payment coordination.
            </li>
            <li className="opctc-item">
              Plan Eligibility — 3 Tiers (Based on Employee Count): (a) ELEMENTAL (₹999/mo OR ₹10,500/yr) — up to 10 employees; (b) ENRICHED (₹1,999/mo OR ₹21,500/yr) — 10 to 25 employees; (c) SUPREME (₹2,999/mo OR ₹31,500/yr) — 25 to 50 employees. Annual subscription offers a discount over 12 monthly payments. ESTABLISHMENTS WITH MORE THAN 50 EMPLOYEES: please contact us for a CUSTOM ENTERPRISE PLAN — quoted based on employee count, branches, and compliance complexity.
            </li>
            <li className="opctc-item">
              Statutory Anchor: EPF compliance is governed by the EMPLOYEES' PROVIDENT FUNDS AND MISCELLANEOUS PROVISIONS ACT, 1952 + EMPLOYEES' PROVIDENT FUND SCHEME, 1952 + EPS 1995 + EDLI 1976. The CODE ON SOCIAL SECURITY, 2020 (notified into force 21 November 2025) consolidates these legislations; EPF sub-Rules under the Code are being phased in State-by-State. The existing EPF & MP Act 1952 framework + Unified Portal CONTINUES during the transition.
            </li>
            <li className="opctc-item">
              Statutory EPF Contribution Structure: EMPLOYEE 12% of Basic + DA. EMPLOYER 12% of Basic + DA split as EPS 8.33% (capped at wages ₹15,000 = ₹1,250 / month) + EPF 3.67% (balance). EDLI 0.5% of wages (capped at ₹15,000 wage = ₹75 / month / employee). Admin Charges 0.5% (min ₹500 / month / establishment). All contributions are payable to EPFO by the 15th of next month. Wage ceiling ₹15,000 (proposed revision to ₹21,000 pending Government notification).
            </li>
            <li className="opctc-item">
              Late-Fee Zero Promise (Conditional): We file ECR by the 15th of next month provided the client provides the monthly wage register + new-joinee / KYC data by DAY 7 of the next month. If the client provides data late, ECR may be filed late + Section 7Q interest (12% p.a.) + Section 14B damages (5%–25% p.a. per delay band) become the client's liability.
            </li>
            <li className="opctc-item">
              GST on Our Fee: All quoted prices are exclusive of GST @ 18%, charged at checkout.
            </li>
            <li className="opctc-item">
              Refund Policy: Pro-rated refund of unused months is available on cancellation with 30 days' notice (less ₹499 closure fee). For the first month: full refund if no filing has been performed; partial refund proportionate to filings done. Government penalties / interest / damages paid via portal are non-refundable.
            </li>
            <li className="opctc-item">
              Out-of-Scope Items: Our base plans cover the 8 deliverables listed above. NOT INCLUDED: member withdrawal forms (Form 19 / 10C / 31 / 10D), member grievance redressal, EPFO inspection support / defence, Section 7A / 7B / 7-I assessment proceedings, Section 14 criminal prosecution defence, multi-state / multi-branch coordination, contractor PF compliance under Section 8A, Trust-managed PF (Para 27A exempted establishments), Higher Pension option processing per SC judgement, Code on Social Security 2020 transition advisory, fresh EPF Registration of new establishment, EPF Code transfer / amendment, EPFAT (Appellate Tribunal) matters. These are quoted separately as needed.
            </li>
            <li className="opctc-item">
              Establishment-Level Responsibilities: Client is responsible for: maintaining monthly wage register + payroll, providing accurate basic + DA breakdown for each employee, sharing new-joinee KYC documents (Aadhaar + PAN + Bank passbook copy) within 7 days of joining, authorising employer DSC / eSign for portal filings, making the PF contribution payment to EPFO via authorised banking channel using the TRRN we share, and intimating any member exit / change in establishment particulars promptly.
            </li>
            <li className="opctc-item">
              Engagement Effective Date: Our subscription begins from the month immediately following onboarding. Onboarding (which is one-time + included) covers: existing employee data audit, UAN verification, existing KYC status check, portal access setup with our team as authorised representative, and historical filing review (last 3 months). Catch-up filings for pre-onboarding months (if any) are separately quoted.
            </li>
          </ol>
        </div>
      </div>
    </section>
  );
};

export default EpfRetTermCondition;
