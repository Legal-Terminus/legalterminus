import React from "react";
import "./PtoopcTermCondition.css";

const PtoopcTermCondition = () => {
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
              Professional Fee Only: All quoted prices cover professional services — DSC/DIN, name reservation, MOA/AOA and nominee-consent drafting, SPICe+ incorporation, and the takeover agreement. They are exclusive of MCA government fees, stamp duty, and other out-of-pocket costs.
            </li>
            <li className="opctc-item">
              Government Fees &amp; Stamp Duty Payable Separately: MCA incorporation fees, DSC charges, and state stamp duty on the MOA/AOA and the takeover agreement are payable to the authorities and reimbursed at actuals.
            </li>
            <li className="opctc-item">
              GST on Our Fee: All quoted prices are exclusive of GST @ 18%, charged at checkout.
            </li>
            <li className="opctc-item">
              Nature of Conversion: A sole proprietorship is not a separate legal entity, so it cannot be 'converted' by statute. Legally, a fresh One Person Company is incorporated and the proprietorship's business, assets, and liabilities are transferred to it through a takeover/transfer agreement. The proprietorship is then discontinued.
            </li>
            <li className="opctc-item">
              OPC Eligibility: Only a natural person who is an Indian citizen and resident in India can incorporate and be a member of an OPC. A nominee (also an Indian citizen/resident) must be named, who takes over in the event of the member's death or incapacity. A person can be a member of only one OPC at a time.
            </li>
            <li className="opctc-item">
              Activity Restrictions: An OPC cannot carry out Non-Banking Financial Investment activities, including investment in securities of any body corporate. The intended business activity must be permissible for an OPC; we confirm this before incorporation.
            </li>
            <li className="opctc-item">
              Transfer &amp; Tax Considerations: Transfer of business assets to the OPC may have tax, GST, and stamp-duty implications. The client is responsible for the correctness of asset/liability figures, and any capital gains or tax matters are assessed and handled separately.
            </li>
            <li className="opctc-item">
              Post-Conversion Compliance: An OPC is a company and must comply with annual ROC filings (AOC-4, MGT-7A), maintain statutory records, and have its accounts audited — a higher compliance level than a proprietorship. First-year compliance is included only in the plan that specifies it.
            </li>
            <li className="opctc-item">
              Out-of-Scope Items: Detailed business valuation reports, resolution of pre-existing proprietorship disputes or dues, trademark registration, and ongoing accounting/bookkeeping are not included and quoted separately.
            </li>
          </ol>
        </div>
      </div>
    </section>
  );
};

export default PtoopcTermCondition;
