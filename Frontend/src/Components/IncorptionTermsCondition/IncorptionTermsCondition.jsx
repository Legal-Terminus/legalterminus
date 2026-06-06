import React from "react";
import "./IncorporationTermsCondition.css";

const IncorporationTermsCondition = () => {
  return (
    <section className="incorp-tc-section">
      <div className="incorp-tc-container">
        <div className="incorp-tc-card">

          {/* ================= HEADING ================= */}
          <h2 className="incorp-tc-title">TERMS &amp; CONDITIONS</h2>

          {/* ================= SUBTITLE ================= */}
          <p className="incorp-tc-subtitle">
            By subscribing to any of the above plans, you agree to the following terms and conditions. Please read them carefully before proceeding.
          </p>

          {/* ================= LIST ================= */}
          <ol className="incorp-tc-list">
            <li className="incorp-tc-item">
              <strong>Professional Fee Only:</strong> All quoted prices are exclusive of government fees, statutory levies, apostille / notarisation costs, AD-Bank charges, and other out-of-pocket costs. Our fee covers professional services — advisory, MOA/AOA drafting, SPICe+ filing, FEMA / FC-GPR coordination (foreign-parent track only), and post-incorporation handover.
            </li>

            <li className="incorp-tc-item">
              <strong>Pricing Track Determined by Parent Type:</strong> Indian-parent WOS clients pay the Track A professional fee. Foreign-parent WOS clients pay the Track B professional fee (which absorbs FEMA, apostille, FC-GPR, AD-Bank coordination scope not present in Track A).
            </li>

            <li className="incorp-tc-item">
              <strong>Government Fees Payable Separately:</strong> RUN name reservation fee (₹1,000 per attempt), and state stamp duty on MOA/AOA (₹500 – ₹12,600+) — applicable to both tracks. FC-GPR filing fee on the RBI FIRMS portal is NIL (foreign-parent track only).
            </li>

            <li className="incorp-tc-item">
              <strong>Apostille &amp; Notarisation (Foreign-Parent Track Only):</strong> Foreign parent documents (Certificate of Incorporation, MOA/AOA, Board Resolution, POA, UBO declaration) must be apostilled in the parent's home jurisdiction (Hague Convention countries) or notarised + Indian embassy attested (non-Hague). Apostille / consulate charges typically ₹15,000 – ₹40,000 — client needs to do at their end.
            </li>

            <li className="incorp-tc-item">
              <strong>DSC, DIN &amp; AD-Bank Charges:</strong> Class 3 DSC at ₹1,999 + GST per person — required for 2 directors and the nominee shareholder (3 typical). DIN auto-applied via SPICe+ for 3 directors, more than 3 directors, it is at ₹500 each. AD-Bank FIRC + KYC pull-out fees ₹2,000 – ₹8,000 (foreign-parent track only).
            </li>

            <li className="incorp-tc-item">
              <strong>GST on Our Fee:</strong> All quoted prices are exclusive of GST @ 18%, charged at checkout.
            </li>

            <li className="incorp-tc-item">
              <strong>WOS Structure:</strong> A WOS Pvt Ltd requires the parent + 1 nominee shareholder (since Section 3(1)(b) of the Companies Act mandates a minimum of 2 shareholders). The nominee holds 1 share on behalf of the parent under a declaration of nominee shareholding (Section 187). Parent owns 99.99%+ economically; substantive control sits 100% with the parent.
            </li>

            <li className="incorp-tc-item">
              <strong>Resident Director:</strong> At least one director must be 'resident in India' under Section 149(3) — stayed 120+ days in the immediately preceding financial year.
            </li>

            <li className="incorp-tc-item">
              <strong>Sectoral FDI (Foreign-Parent Track Only):</strong> 100% FDI is permitted under the auto route in most sectors. Restricted sectors (banking 74%, insurance 74%, single-brand retail 100% with conditions, multi-brand retail 51%) and prohibited sectors (atomic energy, lottery, gambling, real estate trading) require government approval or are off-limits. Sectoral eligibility check is part of our discovery call.
            </li>

            <li className="incorp-tc-item">
              <strong>Out-of-Scope Items:</strong> ODI compliance for the parent (where applicable), transfer pricing study + Form 3CEB, branch / liaison / project office registration, Form FCA (External Commercial Borrowings), and annual statutory audit are not included and quoted separately.
            </li>
          </ol>

        </div>
      </div>
    </section>
  );
};

export default IncorporationTermsCondition;
