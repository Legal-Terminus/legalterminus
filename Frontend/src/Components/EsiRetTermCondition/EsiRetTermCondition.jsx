import React from "react";
import "./EsiRetTermCondition.css";

const EsiRetTermCondition = () => {
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
              Monthly Subscription Model: Our ESI Return Filing plans are MONTHLY SUBSCRIPTIONS (annual option also available at discount) — no lock-in, cancellable with 10 days' notice. Each month's subscription covers the 7 deliverables: employee addition in ESI portal, employee exit marking in ESI portal, monthly ESI return filing (Contribution upload), ESI contribution payment coordination, challan emailed to client, contribution history emailed to client, and the filing-by-15th guarantee.
            </li>
            <li className="opctc-item">
              Plan Eligibility — 3 Tiers (Based on Employee Count): (a) ELEMENTAL (₹999/mo OR ₹10,500/yr) — UP TO 10 EMPLOYEES; (b) ENRICHED (₹1,999/mo OR ₹21,500/yr) — 10 TO 25 EMPLOYEES; (c) SUPREME (₹2,999/mo OR ₹31,500/yr) — 25 TO 50 EMPLOYEES. Annual subscription offers a discount over 12 monthly payments. ESTABLISHMENTS WITH MORE THAN 50 EMPLOYEES: please contact us for a CUSTOM ENTERPRISE PLAN.
            </li>
            <li className="opctc-item">
              Statutory Anchor: ESI compliance is governed by the EMPLOYEES' STATE INSURANCE ACT, 1948 + ESI (Central) Rules 1950 + ESI (General) Regulations 1950. The CODE ON SOCIAL SECURITY, 2020 (notified into force 21 November 2025) consolidates ESI + other social-security legislations; ESI sub-Rules under the Code are being phased in State-by-State. The existing ESI Act 1948 framework + ESIC portal CONTINUES during the transition.
            </li>
            <li className="opctc-item">
              Statutory ESI Contribution Structure: WAGE CEILING is ₹21,000 PER MONTH (₹25,000 for differently-abled employees). EMPLOYEE contribution = 0.75% of gross wages. EMPLOYER contribution = 3.25% of gross wages. TOTAL = 4% of gross wages (revised from 6.5% w.e.f. 1 July 2019 per Notification G.S.R.423(E)). Both contributions deposited to ESIC by 15TH OF NEXT MONTH. Coverage stops when employee's wages cross ₹21,000 ceiling — SUBJECT TO mid-period continuation rule (if wage crosses mid-contribution-period, deduction continues till end of that period — 30 Sep or 31 Mar).
            </li>
            <li className="opctc-item">
              Late-Fee Zero Promise (Conditional): We file ESI Contribution by 15th OF NEXT MONTH provided client provides the monthly wage register + new joinee / exit data by DAY 7 of the next month. If client provides data late, ESI may be filed late + Section 39(5)(a) interest (12% p.a.) + Section 85B damages (5%–25% p.a. per delay band) become client's liability.
            </li>
            <li className="opctc-item">
              Half-Yearly Return of Contributions (Out-of-Scope of Monthly Plans): ESIC has historically required a Return of Contributions on a half-yearly basis — FORM 5 for April–September period (due 11 NOVEMBER) and FORM 6 for October–March period (due 12 MAY). With ESIC's online portal migration, monthly Contribution uploads largely serve the half-yearly return purpose. Where explicit half-yearly Return of Contributions filing is mandated by your jurisdictional ESIC office, it is separately quoted at ₹2,499 per half-year.
            </li>
            <li className="opctc-item">
              GST on Our Fee: All quoted prices are exclusive of GST @ 18%, charged at checkout.
            </li>
            <li className="opctc-item">
              Refund Policy: Pro-rated refund of unused months is available on cancellation with 10 days' notice (less ₹499 closure fee). For the first month: full refund if no filing has been performed; partial refund proportionate to filings done. Government penalties / interest / damages paid via portal are non-refundable.
            </li>
            <li className="opctc-item">
              Out-of-Scope Items: Our base plans cover the 7 deliverables listed above. NOT INCLUDED: ESIC inspection support / defence (Section 45A determination), Section 85 criminal prosecution defence, IP medical-benefit / sickness-benefit / maternity-benefit / disablement-benefit claim processing for individual members, Form 11 (Accident Report) processing, ESI Court / ESIC Appellate Tribunal matters, multi-state / multi-branch coordination, contractor employee ESI compliance (Principal Employer liability under Section 40), fresh ESIC Registration (separate LT service), Code on Social Security 2020 transition advisory. These are quoted separately as needed.
            </li>
            <li className="opctc-item">
              Establishment-Level Responsibilities: Client is responsible for: maintaining monthly wage register + payroll, providing accurate gross-wage data for each employee, sharing new-joinee details (name + DOB + Aadhaar + PAN + Bank + photo) within 7 days of joining, sharing exit information (last working day + reason) for each member leaving, MAKING THE ESI CONTRIBUTION PAYMENT to ESIC via authorised banking channel using the challan we share, and intimating any change in establishment particulars promptly.
            </li>
            <li className="opctc-item">
              Engagement Effective Date: Our subscription begins from the month immediately following onboarding. Onboarding (which is one-time + included) covers: existing employee data audit, existing IP / ESI Number verification, portal access setup with our team as authorised representative, and historical filing review (last 3 months). Catch-up filings for pre-onboarding months (if any) are separately quoted.
            </li>
          </ol>
        </div>
      </div>
    </section>
  );
};

export default EsiRetTermCondition;
