import React from "react";
import "./OPCTermCondition.css";

const OPCTermCondition = () => {
  return (
    <section className="opctc-section">
      <div className="opctc-container">
        <div className="opctc-card">
          {/* Heading */}
          <h2 className="opctc-title">TERMS &amp; CONDITIONS</h2>

          {/* Sub heading */}
          <p className="opctc-subtitle">
            By subscribing to the above plans, you agree to abide by our following additional terms and conditions
          </p>

          {/* List */}
          <ol className="opctc-list">
            <li className="opctc-item">
              Professional Fee Only: All quoted prices are exclusive of government fees, statutory levies, and out-of-pocket costs. Our fee covers professional services — advisory, MOA/AOA drafting, nominee onboarding, SPICe+ filing, AGILE-PRO-S coordination, and post-incorporation handover.
            </li>
            <li className="opctc-item">
              Government Fees Payable Separately: RUN name reservation fee (₹1,000 per attempt), SPICe+ filing fee, and state stamp duty on MOA/AOA (₹500 – ₹5,000 typical for OPC) are payable to MCA / state government and reimbursed at actuals.
            </li>
            <li className="opctc-item">
              DSC &amp; DIN Charges: Class 3 DSC is billed at ₹1,999 + GST per person. OPC requires DSC for the sole director (mandatory) and the nominee (for digital INC-3 signing). DIN for the sole director is auto-applied via SPICe+.
            </li>
            <li className="opctc-item">
              GST on Our Fee: All quoted prices are exclusive of GST @ 18%, charged at checkout.
            </li>
            <li className="opctc-item">
              Eligibility Restrictions: As per Rule 3 of the Companies (Incorporation) Rules, 2014, only a natural person who is an Indian citizen (resident or NRI, post-2021 amendment) is eligible to incorporate or be a nominee in an OPC. A person can be a member or nominee of only one OPC at a time. Bodies corporate, LLPs, trusts, and foreign nationals are not eligible.
            </li>
            <li className="opctc-item">
              Restricted Business Activities: OPCs cannot be incorporated or converted into a company carrying out Non-Banking Financial Investment activities, including investment in securities of any body corporate. Banking, insurance, and NBFC activities are also restricted.
            </li>
            <li className="opctc-item">
              Name Approval: SPICe+ Part A name reservation includes 2 attempts within our professional fee. RUN government fees are payable per attempt (₹1,000 each). The name must end with '(OPC) Private Limited' as per Rule 8 of the Companies (Incorporation) Rules. We pre-screen names against MCA, IPR, and trademark databases.
            </li>
            <li className="opctc-item">
              Refund Policy: Full refund of professional fee (less ₹1,499 documentation handling) is available if SPICe+ Part B is not filed within 7 working days from receipt of complete documents and information. Government fees and DSC charges which already paid are non-refundable.
            </li>
            <li className="opctc-item">
              Out-of-Scope Items: NRI subscriber additional KYC, registered office shifting, voluntary conversion to Pvt Ltd / Public Ltd, change of nominee post-incorporation, FEMA / FDI compliance for NRI directors and sectoral licenses (FSSAI, IEC, RBI, etc.) are not included and quoted separately.
            </li>
          </ol>
        </div>
      </div>
    </section>
  );
};

export default OPCTermCondition;
