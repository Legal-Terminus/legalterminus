import React from "react";
import "./ShopRegTerms.css";

const ShopRegTerms = () => {
  return (
    <section className="shopreg-tc-section">
      <div className="shopreg-tc-container">
        <div className="shopreg-tc-card">

          <h2 className="shopreg-tc-title">TERMS &amp; CONDITIONS</h2>

          <p className="shopreg-tc-subtitle">
            By subscribing to any of the above plans, you agree to the following terms and conditions. Please read them carefully before proceeding.
          </p>

          <ol className="shopreg-tc-list">
            <li className="shopreg-tc-item">
              The fee mentioned above does not include government fees, if any, which shall be payable over and above the professional fee mentioned. Government fees are charged at actuals as per the applicable state schedule.
            </li>

            <li className="shopreg-tc-item">
              Professional fees and government fees may vary from state to state. Kindly contact our executive to receive the best quotation as per your requirement and jurisdiction.
            </li>

            <li className="shopreg-tc-item">
              The plan fee is applicable per branch / establishment. Each branch located in a separate premises or different municipal limits will require a separate registration and will be charged accordingly.
            </li>

            <li className="shopreg-tc-item">
              Annual renewal of the Shop &amp; Establishment registration is mandatory under state law. Renewal fees are not included in the one-time registration plan fee and will be communicated separately before renewal.
            </li>

            <li className="shopreg-tc-item">
              18% GST is applicable on all professional and consultancy fees charged by Legal Terminus Private Limited.
            </li>

            <li className="shopreg-tc-item">
              A detailed document checklist specific to your state will be shared by our team immediately upon plan confirmation. Accuracy and completeness of the documents provided by the client are the client's responsibility.
            </li>

            <li className="shopreg-tc-item">
              In case of rejection or deficiency by the local authority, Legal Terminus will assist in resubmission at no additional charge, provided the rejection is not due to incorrect information or documents furnished by the client.
            </li>

            <li className="shopreg-tc-item">
              Legal Terminus Private Limited is a private consultancy firm and is not affiliated with any government authority. All registration certificates are issued directly by the respective state/local government authority. Our fees are exclusively for consultancy, documentation assistance, and application support services.
            </li>
          </ol>
        </div>
      </div>
    </section>
  );
};

export default ShopRegTerms;
