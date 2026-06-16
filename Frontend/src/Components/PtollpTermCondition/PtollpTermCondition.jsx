import React from "react";
import "./PtollpTermCondition.css";

const PtollpTermCondition = () => {
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
              Professional Fee Only: All quoted prices cover professional services — DSC/DPIN, name reservation, Form 17 and FiLLiP filing, and LLP agreement drafting. They are exclusive of MCA government fees, stamp duty, and other out-of-pocket costs.
            </li>
            <li className="opctc-item">
              Government Fees Payable Separately: MCA fees for FiLLiP, Form 17, and Form 3, DSC charges, and state stamp duty on the LLP agreement are payable to the authorities and reimbursed at actuals per the official MCA schedule.
            </li>
            <li className="opctc-item">
              GST on Our Fee: All quoted prices are exclusive of GST @ 18%, charged at checkout.
            </li>
            <li className="opctc-item">
              Section 55 Conversion Route: A partnership firm is converted into an LLP under Section 55 and the Second Schedule of the LLP Act, 2008. On conversion, all the firm's assets, liabilities, rights, privileges, and obligations vest in the LLP by operation of law, and the firm is deemed dissolved.
            </li>
            <li className="opctc-item">
              All Partners Carry Over: All partners of the firm — and no one else — must become partners of the LLP on conversion. At least two designated partners are required, each with a DPIN/DIN and DSC. New partners can be admitted only after the LLP is formed.
            </li>
            <li className="opctc-item">
              Eligibility Conditions: Conversion requires that the income-tax returns of the firm are up to date, there is no security interest subsisting on the firm's assets at the time of application (or the secured creditors' consent is obtained), and the consent of all partners and creditors is in place. We confirm these before filing.
            </li>
            <li className="opctc-item">
              Statement of Assets &amp; Liabilities: The application requires a statement of assets and liabilities of the firm certified by a Chartered Accountant in practice, and a list of all creditors with their consent. The partners are responsible for the accuracy of these financial details.
            </li>
            <li className="opctc-item">
              Post-Conversion Steps: The LLP agreement must be filed in Form 3 within 30 days of conversion, the Registrar of Firms intimated, and PAN, GST, bank, and licences updated to the LLP's name. Items beyond the chosen plan's scope are quoted separately.
            </li>
            <li className="opctc-item">
              Out-of-Scope Items: Detailed valuation, resolution of pre-existing firm disputes or dues, tax assessments/litigation, FDI/FEMA filings, trademark assignment, and ongoing accounting/bookkeeping are not included and quoted separately.
            </li>
          </ol>
        </div>
      </div>
    </section>
  );
};

export default PtollpTermCondition;
