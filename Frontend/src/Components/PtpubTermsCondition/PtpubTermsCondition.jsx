import React from "react";
import "./PtpubTermsCondition.css";

const TermsConditions = () => {
  return (
    <section className="publicltd-tc-section">
      <div className="publicltd-tc-container">
        <div className="publicltd-tc-card">

          {/* Heading */}
          <h2 className="publicltd-tc-title">TERMS &amp; CONDITIONS</h2>

          {/* Sub heading */}
          <p className="publicltd-tc-subtitle">
            By subscribing to the above plans, you agree to abide by our following additional terms and conditions
          </p>

          {/* List */}
          <ol className="publicltd-tc-list">
            <li className="publicltd-tc-item">
              Professional Fee Only: All quoted prices are exclusive of government fees, statutory levies, and out-of-pocket costs. The fee covers our professional services — eligibility review, board & EGM documentation, special resolution and MOA/AOA alteration drafting, and MGT-14 / INC-27 filing. Government costs are billed separately at actuals with prior approval.
            </li>
            <li className="publicltd-tc-item">
              Government Fees Payable Separately: ROC filing fees for MGT-14 and INC-27, and state stamp duty on the altered MOA/AOA (where applicable) are payable to MCA / state government and reimbursed at actuals.
            </li>
            <li className="publicltd-tc-item">
              DSC &amp; DIN Charges: Class 3 Digital Signature Certificate (DSC) procurement is billed at ₹1,999 + 18% GST per person for directors signing the conversion forms. DIN for any newly appointed director is charged at ₹500 government fee each.
            </li>
            <li className="publicltd-tc-item">
              GST on Our Fee: All quoted prices are exclusive of GST @ 18%, charged at checkout. The GST component is eligible for input tax credit once your GSTIN is active.
            </li>
            <li className="publicltd-tc-item">
              Minimum Members &amp; Directors: A Public Limited Company requires a minimum of 7 members and 3 directors under Section 3(1)(a) and Section 149 of the Companies Act, 2013. If your company falls short, inducting the additional members / directors is included only in the plan that specifies it; their DSC and DIN charges apply.
            </li>
            <li className="publicltd-tc-item">
              Special Resolution &amp; Filing Timeline: The conversion requires a special resolution in a general meeting and alteration of the MOA &amp; AOA under Section 14. Form MGT-14 must be filed within 30 days of the resolution and INC-27 thereafter. Timely approval of documents by the client is essential to meet these timelines.
            </li>
            <li className="publicltd-tc-item">
              New Name &amp; Certificate: On conversion the word "Private" is removed from the name and a fresh Certificate of Incorporation is issued. The CIN changes accordingly; PAN, GST, bank, and licence records must then be updated to the new name (included only in the plan that specifies it).
            </li>
            <li className="publicltd-tc-item">
              Out-of-Scope Items: Sectoral approvals (RBI, SEBI, IRDAI), listing / IPO advisory, foreign director apostille / notarisation, registered office shifting, increase of authorised capital, and resolution of pre-existing disputes or dues are not included and quoted separately on request.
            </li>
            <li className="publicltd-tc-item">
              Supreme Plan fees cover compliance for the 1st Financial Year only. Subsequent years will be quoted separately.
            </li>
            <li className="publicltd-tc-item">
              Post-Conversion Compliance: A Public Limited Company has heavier compliance than a Private Limited — more board meetings, audit-committee thresholds, and event-based filings. We will remind you, but timely document and payment submission from the client is essential.
            </li>
          </ol>

        </div>
      </div>
    </section>
  );
};

export default TermsConditions;
