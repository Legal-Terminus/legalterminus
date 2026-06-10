import React from "react";
import "./FoodLicenseTermCondition.css";

const FoodLicenseTermCondition = () => {
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
              Professional Fee Only: All quoted prices are exclusive of FSSAI government fees, statutory levies, and out-of-pocket costs. Our fee covers professional services — application preparation, FoSCoS portal filing, document coordination, and compliance support.
            </li>
            <li className="opctc-item">
              Government Fees Payable Separately: FSSAI registration/license fees (₹100/year for Basic; ₹2,000–₹5,000/year for State; ₹7,500+/year for Central) are payable to FSSAI / Central or State licensing authority and reimbursed at actuals based on official FSSAI tariff.
            </li>
            <li className="opctc-item">
              GST on Our Fee: All quoted prices are exclusive of GST @ 18%, charged at checkout.
            </li>
            <li className="opctc-item">
              License Type Eligibility: The correct license type (Basic, State, or Central) is determined by your annual turnover, business type, and scale of operations. Legal Terminus confirms the applicable license type during the discovery call before filing.
            </li>
            <li className="opctc-item">
              Mandatory for All Food Businesses: Any entity manufacturing, processing, storing, distributing, transporting, or retailing food products — including restaurants, cloud kitchens, home bakers, importers, exporters, and food e-commerce operators — is required to obtain FSSAI registration or license before commencing operations.
            </li>
            <li className="opctc-item">
              Inspection by FSSAI: For State and Central licenses, FSSAI may conduct a physical inspection of the premises. Legal Terminus will prepare your documentation and coordinate responses, but cannot guarantee inspection outcomes or timelines, which are within FSSAI's discretion.
            </li>
            <li className="opctc-item">
              Renewal Obligation: FSSAI license/registration must be renewed before expiry (at least 30 days prior). Late renewal attracts a penalty of ₹100/day. Legal Terminus includes renewal reminders in State and Central plans but is not liable for lapses due to client non-responsiveness.
            </li>
            <li className="opctc-item">
              Refund Policy: Full refund of professional fee (less ₹499 documentation handling) is available if the FoSCoS application is not filed within 7 working days from receipt of all required documents. Government fees already paid are subject to FSSAI's own refund policy and are not refundable through us.
            </li>
            <li className="opctc-item">
              Out-of-Scope Items: FSSAI audit defence, food safety lab testing, product recall management, post-license modifications, food label design under FSSAI Labelling Regulations 2020, and sectoral permits (AGMARK, BIS, APEDA) are not included and quoted separately.
            </li>
          </ol>
        </div>
      </div>
    </section>
  );
};

export default FoodLicenseTermCondition;
