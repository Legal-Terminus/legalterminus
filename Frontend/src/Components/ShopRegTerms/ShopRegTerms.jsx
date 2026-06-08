import React from "react";
import "../PvtltdTermsCondition/PvtltdTermsCondition.css";

const ShopRegTerms = () => {
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
              Government Fee — State-Specific: Shop &amp; Establishment Registration is a STATE-LEVEL registration. Government fees vary widely by state (₹50 to ₹5,000+) and depend on employee count, establishment type, and state's fee schedule. Fees are payable directly to the State Labour Department and reimbursed at actuals. Our professional fee covers advisory, application drafting, portal filing, and post-registration support.
            </li>
            <li className="pvtltd-tc-item">
              GST on Our Fee: All quoted prices are exclusive of GST @ 18%, charged at checkout.
            </li>
            <li className="pvtltd-tc-item">
              DSC Charges: Class 3 DSC may be required for digital signing depending on the state portal. Billed at ₹1,999 + GST at actuals if needed.
            </li>
            <li className="pvtltd-tc-item">
              Mandatory Registration Trigger: SHOP &amp; ESTABLISHMENT Registration is mandatory under the respective State Shops &amp; Commercial Establishments Act. The threshold and timing vary by state — some states (e.g., Maharashtra) trigger registration from 1 employee, others from 10+ employees. Registration is typically required within 30 days of establishment commencing operations. We confirm state-specific triggers on the discovery call.
            </li>
            <li className="pvtltd-tc-item">
              State Coverage Per Plan: All plans cover ONE state. Each state has its own Act, form, fee, and validity period — they are NOT interchangeable.
            </li>
            <li className="pvtltd-tc-item">
              Validity &amp; Renewal: SHOP &amp; ESTABLISHMENT Registration validity varies by state. Maharashtra (Gumasta): lifetime (one-time fee). Karnataka: 5 years. Delhi: annual renewal. Tamil Nadu: annual renewal. Odisha: 3 years. Plan accordingly — we share state-specific renewal cycles on the discovery call. Free renewal-filing reminder included.
            </li>
            <li className="pvtltd-tc-item">
              Refund Policy: Full refund of professional fee (less ₹999 documentation handling) is available if SHOP &amp; ESTABLISHMENT application is not filed within 7 working days from receipt of complete documents. Government fees already paid to the State Labour Department are non-refundable.
            </li>
            <li className="pvtltd-tc-item">
              Statutory Compliance Out-of-Scope: Plans do NOT include ongoing compliance — register maintenance, leave card maintenance, weekly off scheduling, wage register filing, monthly / quarterly returns where applicable, Inspector visit defence beyond initial briefing, labour court matters, or worker grievance handling. These are billed under our state-labour Compliance retainer.
            </li>
            <li className="pvtltd-tc-item">
              Out-of-Scope Items: Trade Licence (separate municipal registration in some states), Factory Licence (Factories Act 1948 — separate registration for factories), Professional Tax registration, ESIC, EPF, Labour Welfare Fund (LWF), Pollution Control Board NOC, FSSAI, Drug Licence, BIS registration, and any worker-side benefit claims are NOT included under this service. We can advise on adjacent registrations on the discovery call.
            </li>
          </ol>

        </div>
      </div>
    </section>
  );
};

export default ShopRegTerms;
