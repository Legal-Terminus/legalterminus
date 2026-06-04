import React from "react";
import "./PublicltdTermsCondition.css";

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
              <strong>Professional Fee Only:</strong> All quoted prices are exclusive of government fees, statutory levies, and out-of-pocket costs. The fee covers our professional services — advisory, MOA/AOA drafting, Documents Preparation, SPICe+ filing, AGILE-PRO-S coordination, and post-incorporation handover. Government costs are billed separately at actuals with prior approval.
            </li>
            <li className="publicltd-tc-item">
              <strong>Government Fees Payable Separately:</strong> RUN name reservation fee, SPICe+ filing fee and state stamp duty on MOA/AOA (₹500 – ₹12,600+ depending on state and capital) are payable to MCA / state government and reimbursed at actuals.
            </li>
            <li className="publicltd-tc-item">
              <strong>DSC &amp; DIN Charges:</strong> Class 3 Digital Signature Certificate (DSC) procurement is billed at ₹1,999 + 18% GST per person. A PLC requires DSC for all 3 directors and all 7 subscribers (10 minimum). DIN for first 3 directors is auto-applied via SPICe+, if the number of directors exceed 3 then a govt. fees of ₹500 for each director shall be applicable.
            </li>
            <li className="publicltd-tc-item">
              <strong>GST on Our Fee:</strong> All quoted prices are exclusive of GST @ 18%, charged at checkout. Once your company GSTIN is active, the GST component is fully eligible for input tax credit.
            </li>
            <li className="publicltd-tc-item">
              <strong>Subscribers &amp; Directors:</strong> A Public Limited Company requires a minimum of 7 subscribers to the MOA and 3 directors under Section 3(1)(a) and Section 149 of the Companies Act, 2013. Additional subscribers / directors beyond the statutory minimum can be added at no extra professional fee; only DSC and DIN charges apply.
            </li>
            <li className="publicltd-tc-item">
              <strong>Name Approval:</strong> SPICe+ Part A name reservation includes 2 attempts within our professional fee. RUN government fees are payable per attempt (₹1,000 each). We pre-screen names against MCA, IPR, and trademark databases to minimise rejection.
            </li>
            <li className="publicltd-tc-item">
              <strong>Refund Policy:</strong> Full refund of professional fee (less ₹1,999 documentation handling) is available if SPICe+ Part B is not filed within 10 working days from receipt of complete documents. Government fees and DSC charges already paid are non-refundable as they are issued by third parties.
            </li>
            <li className="publicltd-tc-item">
              <strong>Out-of-Scope Items:</strong> Specific approvals (RBI, SEBI, IRDAI, sectoral licences), foreign director apostille / notarisation, NRI / foreign subscriber additional KYC, registered office shifting, share capital alteration post-incorporation, and conversion from / to other entity types are not included and quoted separately on request.
            </li>
            <li className="publicltd-tc-item">
              Supreme Plan fees cover compliance for the 1st Financial Year only. Subsequent years will be quoted separately.
            </li>
            <li className="publicltd-tc-item">
              Commencement of Business (Form INC-20A) must be filed within 180 days of the date of incorporation. Failure to do so may attract penalties under Section 11 of the Companies Act, 2013. We will remind you, but timely document and payment submission from the client is essential.
            </li>
          </ol>

        </div>
      </div>
    </section>
  );
};

export default TermsConditions;
