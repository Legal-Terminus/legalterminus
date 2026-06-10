import React from "react";
import "./BCtermcondition.css";

const BCTermCondition = () => {
  return (
    <section className="opctc-section">
      <div className="opctc-container">
        <h2 className="opctc-title">TERMS &amp; CONDITIONS</h2>
        <p className="opctc-subtitle">
          By subscribing to the above plans, you agree to abide by our following additional terms and conditions
        </p>
        <ol className="opctc-list">
          <li className="opctc-item">
            The fee mentioned above is our professional service fee only and does not include GS1 India's annual subscription fee, which is billed separately at actuals.
          </li>
          <li className="opctc-item">
            GS1 India assigns a unique Company Prefix upon successful registration. This prefix is non-transferable and linked to your GST Identification Number (GSTIN).
          </li>
          <li className="opctc-item">
            Annual renewal of your GS1 subscription with GS1 India is mandatory to keep your Company Prefix and associated GTINs active. Failure to renew results in deactivation of your barcodes.
          </li>
          <li className="opctc-item">
            The number of GTINs available under your Company Prefix depends on the prefix digit count selected. Legal Terminus will recommend the appropriate prefix tier based on your product count requirement.
          </li>
          <li className="opctc-item">
            Barcode images (EAN-13, UPC-A, ITF-14, etc.) are generated only after GS1 India officially issues your Company Prefix. Timeline is subject to GS1 India portal processing, typically 7–15 working days.
          </li>
          <li className="opctc-item">
            Product data entered on the GS1 India registry (GEPIR/GS1 Cloud) must be accurate and complete. Legal Terminus is not responsible for rejections or listing errors arising from incorrect information provided by the client.
          </li>
          <li className="opctc-item">
            GS1-standard barcodes are mandatory for listing on Amazon, Flipkart, Reliance Smart, and major retail supply chains. Non-GS1 barcodes may be rejected by these platforms without notice.
          </li>
          <li className="opctc-item">
            Barcode scan performance at retailer or supply chain systems depends on correct printing specifications (bar width, quiet zones, contrast). Legal Terminus provides barcode image files in standard formats but does not guarantee scan results in all print environments.
          </li>
          <li className="opctc-item">
            Refunds are not applicable once GS1 India registration has been initiated and payment to GS1 India has been made on the client's behalf.
          </li>
        </ol>
      </div>
    </section>
  );
};

export default BCTermCondition;
