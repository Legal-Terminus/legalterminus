import React from "react";
import "./CnllpTermCondition.css";

const CnllpTermCondition = () => {
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
              Professional Fee Only: All quoted prices cover professional services — name availability check, drafting of partners' consent and the supplementary LLP agreement, and filing of Form 5 and Form 3. They are exclusive of MCA government fees, stamp duty, and out-of-pocket costs.
            </li>
            <li className="opctc-item">
              Government Fees Payable Separately: The RUN-LLP reservation fee, Form 5 and Form 3 filing fees, and state stamp duty are payable to the authorities and reimbursed at actuals per the official MCA schedule.
            </li>
            <li className="opctc-item">
              GST on Our Fee: All quoted prices are exclusive of GST @ 18%, charged at checkout.
            </li>
            <li className="opctc-item">
              Name Approval is at MCA's Discretion: The proposed new name must comply with the LLP naming guidelines and must not be identical or too similar to an existing company, LLP, or registered trademark. Approval of the name through RUN-LLP rests entirely with the MCA, and we cannot guarantee that a particular name will be accepted.
            </li>
            <li className="opctc-item">
              Consent of All Partners: A change of name requires the consent of all partners and an amendment to the LLP agreement. The supplementary agreement must be executed and stamped before Form 3 is filed.
            </li>
            <li className="opctc-item">
              Filing Timeline: Form 5 should be filed within 30 days of the partners' decision to change the name, and Form 3 within 30 days of executing the supplementary agreement. Timely filing depends on the client providing signed documents promptly.
            </li>
            <li className="opctc-item">
              Post-Approval Updates: A change of name does not affect the LLP's existing rights, liabilities, or contracts. After the fresh Certificate of Incorporation is issued, the new name must be updated on PAN, GST, bank, licences, signage, and stationery — included only in the plan that specifies it.
            </li>
            <li className="opctc-item">
              Valid DSC &amp; DPIN Required: E-filing requires active Digital Signature Certificates of the designated partners with valid DPIN/DIN. Procuring or renewing a DSC, where not in the chosen plan, is quoted separately.
            </li>
            <li className="opctc-item">
              Out-of-Scope Items: Trademark prosecution beyond a basic application, change of registered office or partners, conversion of the LLP, and dispute resolution between partners are not included and quoted separately.
            </li>
          </ol>
        </div>
      </div>
    </section>
  );
};

export default CnllpTermCondition;
