import React from "react";
import "./ProTermsCondition.css";

const TermsConditions = () => {
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
              Professional Fee Only: All quoted prices are exclusive of government fees, licence charges, and out-of-pocket costs. Our fee covers professional services — advisory, registration filing, follow-up, and post-setup handover. Government and licence costs are billed separately at actuals with prior approval.
            </li>
            <li className="pvtltd-tc-item">
              No Single Registration: A 'Proprietorship Firm' has no central registration in India — there is no single Act under which it is registered. Identity is established through a combination of registrations: MSME (Udyam), GST (if applicable), Shop &amp; Establishment Act, Trade Licence, etc. Plans cover the registrations listed; additional registrations are quoted separately.
            </li>
            <li className="pvtltd-tc-item">
              Government &amp; Licence Fees Separate: MSME registration is FREE. GST government fee is NIL. Shop &amp; Establishment Act registration: ₹100 – ₹4,000 depending on state. Trade Licence: ₹500 – ₹5,000 depending on municipality and activity. All payable at actuals.
            </li>
            <li className="pvtltd-tc-item">
              GST on Our Fee: All quoted prices are exclusive of GST @ 18%, charged at checkout.
            </li>
            <li className="pvtltd-tc-item">
              Single Owner: A Proprietorship Firm has exactly ONE owner — the proprietor. There are no partners, no co-owners, no shareholders. The firm's PAN remains the proprietor's individual PAN; there is no separate firm PAN.
            </li>
            <li className="pvtltd-tc-item">
              Unlimited Liability Disclosure: A proprietorship is NOT a separate legal entity from the proprietor. The proprietor is personally liable for all debts, liabilities, and legal obligations of the business. Personal assets are NOT insulated. Clients seeking liability protection should consider OPC, LLP, or Pvt Ltd structures — we will flag this on the discovery call.
            </li>
            <li className="pvtltd-tc-item">
              Refund Policy: Full refund of professional fee (less ₹999 documentation handling) is available if the first registration application (typically MSME) is not filed within 5 working days from receipt of complete documents. Government fees, licence fees, and stamp paper costs already paid are non-refundable.
            </li>
            <li className="pvtltd-tc-item">
              Re-application by Authority: One free re-application per registration (e.g., GST query, Shop &amp; Est rejection) is included if the deficiency arises from documentation drafted by us. Re-applications arising from client-side changes are billed separately.
            </li>
            <li className="pvtltd-tc-item">
              Out-of-Scope Items: Specific sectoral licences beyond the chosen plan (RBI, SEBI, IRDAI, drug licence, AYUSH, BIS, telecom etc.), trademark registration beyond Supreme tier, foreign trade compliance beyond IEC, conversion to Pvt Ltd / LLP / OPC, and registered office shifting are not included and quoted separately on request.
            </li>
          </ol>

        </div>
      </div>
    </section>
  );
};

export default TermsConditions;
