import React from "react";
import "./IacapTermCondition.css";

const IacapTermCondition = () => {
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
              Professional Fee Only: All quoted prices cover professional services — AOA review, drafting of resolutions, the altered MOA capital clause, and filing of Form SH-7. They are exclusive of MCA government fees, stamp duty, and other out-of-pocket costs.
            </li>
            <li className="opctc-item">
              Government Fees &amp; Stamp Duty Payable Separately: The MCA fee and state stamp duty on the increased capital, and any MGT-14/PAS-3 fees, are calculated on the amount of the increase and reimbursed at actuals. These can be substantial for a large increase.
            </li>
            <li className="opctc-item">
              GST on Our Fee: All quoted prices are exclusive of GST @ 18%, charged at checkout.
            </li>
            <li className="opctc-item">
              Articles Must Permit the Increase: The company's Articles of Association must authorise an increase in authorised capital. If they do not, the AOA must first be amended by a special resolution (filed in Form MGT-14) — included only in the plan that specifies it and otherwise quoted separately.
            </li>
            <li className="opctc-item">
              Resolution Requirement: Increasing authorised capital under Section 61 requires an ordinary resolution of the members at a general meeting (unless the Articles require a special resolution). The MOA capital clause is altered accordingly, and the change takes effect on filing with the ROC.
            </li>
            <li className="opctc-item">
              30-Day Filing Deadline: Form SH-7 must be filed with the ROC within 30 days of passing the resolution. Timely filing depends on the client providing signed resolutions and confirming the stamp-duty payment promptly. Late filing attracts additional MCA fees.
            </li>
            <li className="opctc-item">
              Authorised vs Paid-Up Capital: Increasing authorised capital only raises the ceiling up to which shares can be issued — it does not by itself bring money into the company. Actual funds come only when shares are allotted (a separate step, included in the relevant plan).
            </li>
            <li className="opctc-item">
              Share Allotment Scope: Issue of fresh shares (rights, preferential, or private placement) and filing of Form PAS-3 are included only in the plan that specifies them, and may involve valuation requirements assessed separately.
            </li>
            <li className="opctc-item">
              Out-of-Scope Items: Reduction of capital, buy-back, share transfer, securities valuation reports, FEMA/RBI filings for foreign investment, and any tax advisory are not included and quoted separately.
            </li>
          </ol>
        </div>
      </div>
    </section>
  );
};

export default IacapTermCondition;
