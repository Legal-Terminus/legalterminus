import React from "react";
import "./CocomTermCondition.css";

const CocomTermCondition = () => {
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
              Professional Fee Only: All quoted prices cover professional services — drafting of the new object clause, board and special resolutions, and filing of Form MGT-14. They are exclusive of MCA government fees, stamp duty, and out-of-pocket costs.
            </li>
            <li className="opctc-item">
              Government Fees Payable Separately: The MCA fee for Form MGT-14, stamp duty on the altered MOA, and any late-filing fees are payable to the authorities and reimbursed at actuals per the official MCA schedule.
            </li>
            <li className="opctc-item">
              GST on Our Fee: All quoted prices are exclusive of GST @ 18%, charged at checkout.
            </li>
            <li className="opctc-item">
              Special Resolution Required: A change of object clause is an alteration of the Memorandum of Association under Section 13 of the Companies Act, 2013, and requires a special resolution passed by at least 75% of the members at a general meeting. The change is not effective until the resolution is duly passed and filed.
            </li>
            <li className="opctc-item">
              30-Day Filing Deadline: Form MGT-14 must be filed with the ROC within 30 days of passing the special resolution. Timely filing depends on the client providing signed resolutions and documents promptly. Late filing attracts additional MCA fees.
            </li>
            <li className="opctc-item">
              Companies with Public Money: Where the company has raised money from the public through a prospectus and has unutilised amounts, additional conditions under Section 13(8) apply — including a special resolution, newspaper publication, and an exit offer to dissenting shareholders. Such cases are assessed and quoted separately.
            </li>
            <li className="opctc-item">
              Lawful Objects Only: The new or amended objects must be lawful and not contrary to the provisions of any law. The client is responsible for confirming that the intended business activity is permissible and for obtaining any sector-specific approvals or licences required to carry it on.
            </li>
            <li className="opctc-item">
              Consequential Changes: A change of objects may require updating the company name (if it is tied to the old objects), GST registration, and sector licences. These consequential changes are included only in the plan that specifies them and are otherwise quoted separately.
            </li>
            <li className="opctc-item">
              Out-of-Scope Items: Regulatory approvals from RBI, SEBI, IRDAI, or other authorities, capital restructuring, drafting of new business agreements, and litigation are not included and quoted separately.
            </li>
          </ol>
        </div>
      </div>
    </section>
  );
};

export default CocomTermCondition;
