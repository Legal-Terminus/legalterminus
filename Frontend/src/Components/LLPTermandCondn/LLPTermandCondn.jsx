import React from "react";
import "./LLPTermandCondn.css";

const TermsConditions = () => {
  return (
    <section className="llp-tc-section">
      <div className="llp-tc-container">
        <div className="llp-tc-card">
        {/* Heading */}
        <h2 className="llp-tc-title">TERMS &amp; CONDITIONS</h2>

        {/* Sub heading */}
        <p className="llp-tc-subtitle">
          By subscribing to the above plans, you agree to abide by our following additional terms and conditions
        </p>

        {/* List */}
        <ol className="llp-tc-list">
          <li className="llp-tc-item">
            Professional Fee Only: All quoted prices are exclusive of government fees, statutory levies, and out-of-pocket costs. Our fee covers professional services — advisory, LLP Agreement drafting, FiLLiP filing, Form 3 coordination, and post-incorporation handover. Government costs are billed separately at actuals with prior approval.
          </li>
          <li className="llp-tc-item">
            Government Fees Payable Separately: FiLLiP filing fee (₹500 – ₹5,000 slab-based on capital), RUN-LLP name reservation (₹200 – ₹1,000 per attempt), state stamp duty on LLP Agreement (₹500 – ₹5,000), and Form 3 filing fee (₹50 – ₹200) are payable to MCA / state government and reimbursed at actuals.
          </li>
          <li className="llp-tc-item">
            DSC &amp; DPIN Charges: Class 3 DSC is billed at ₹1,999 + GST per designated partner. DPIN (now unified with DIN) is auto-applied via FiLLiP at ₹500 each (govt fee). DSC and DPIN for additional designated partners beyond the plan limits are billed separately.
          </li>
          <li className="llp-tc-item">
            GSTIN is active, the GST component is fully eligible for input tax credit.
          </li>
          <li className="llp-tc-item">
            Designated Partners: An LLP requires a minimum of 2 designated partners under Section 7 of the LLP Act, 2008, with at least 1 being resident in India (stayed 120+ days in the preceding FY post-2021 amendment). There is no upper limit on the number of partners. Only natural persons can be designated partners.
          </li>
          <li className="llp-tc-item">
            Name Approval: RUN-LLP name reservation includes 2 attempts within our professional fee. Government fees are payable per attempt. The name must end with 'LLP' or 'Limited Liability Partnership'. We pre-screen names against MCA, IPR, and trademark databases.
          </li>
          <li className="llp-tc-item">
            Form 3 Filing Deadline: The LLP Agreement must be filed in Form 3 within 30 days of incorporation. Late filing attracts penalty of ₹100 per day with no upper cap (LLP Amendment Act, 2021). We file within 7 working days of incorporation as standard practice.
          </li>
          <li className="llp-tc-item">
            Refund Policy: Full refund of professional fee (less ₹1,499 documentation handling) is available if FiLLiP is not filed within 7 working days from receipt of complete documents. Government fees and DSC charges already paid are non-refundable.
          </li>
          <li className="llp-tc-item">
            Document Submission: All documents must be provided as per the checklist shared at the time of engagement. Any delay in document submission may affect the overall turnaround time.
          </li>
          <li className="llp-tc-item">
            Out-of-Scope Items: Foreign LLP (FDI) compliance, FEMA / RBI reporting for foreign partners, change of designated partner post-incorporation, registered office shifting, conversion to / from Pvt Ltd, sectoral licences (FSSAI, IEC, RBI), and annual filings (Form 8, Form 11, ITR-5, DIR-3 KYC) are not included and quoted separately.
          </li>
        </ol>
        </div>
      </div>
    </section>
  );
};

export default TermsConditions;
