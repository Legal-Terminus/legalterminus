import React from "react";
import "./TradeLicenseTermCondition.css";

const TradeLicenseTermCondition = () => {
  return (
    <section className="tradetc-section">
      <div className="tradetc-container">
        <div className="tradetc-card">
          {/* Heading */}
          <h2 className="tradetc-title">TERMS &amp; CONDITIONS</h2>

          {/* Sub heading */}
          <p className="tradetc-subtitle">
            By subscribing to the above plans, you agree to abide by our following additional terms and conditions
          </p>

          {/* List */}
          <ol className="tradetc-list">
            <li className="tradetc-item">
              <strong>Municipal Government Fees:</strong> Trade License government fees are decided by the respective Municipal Corporation or Urban Local Body of your city. The fee depends on factors such as business activity, premises size, trade category, and local municipal rules. We share the exact government fee after reviewing your business details.
            </li>

            <li className="tradetc-item">
              <strong>Applicable Municipal Laws:</strong> Trade Licenses are governed by the respective State Municipal Acts and local municipal bye-laws. Since every city has its own rules, document requirements, inspection process, and fee structure may differ from one municipal authority to another.
            </li>

            <li className="tradetc-item">
              <strong>GST on Professional Fees:</strong> All our professional fees are exclusive of GST @ 18%.
            </li>

            <li className="tradetc-item">
              <strong>License Validity &amp; Renewal:</strong> In most cities, Trade Licenses are valid for one financial year and require annual renewal. Delay in renewal may attract late fees, penalties, or cancellation by the municipal authority. We provide renewal reminders and guidance as per your selected plan.
            </li>

            <li className="tradetc-item">
              <strong>Scope of Service:</strong> Our service covers Trade License application drafting, document support, municipal portal filing, coordination, and basic query handling. The number of licenses, amendments, and renewal support depends on the selected plan. Additional filings or amendments may be charged separately.
            </li>

            <li className="tradetc-item">
              <strong>Trade License vs Shop &amp; Establishment Registration:</strong> Trade License and Shop &amp; Establishment Registration are different compliances. Trade License is issued by the Municipal Corporation, while Shop &amp; Establishment Registration is issued by the Labour Department under state labour laws. Depending on your business type and location, both registrations may be required.
            </li>

            <li className="tradetc-item">
              <strong>Refund Policy:</strong> Full refund of professional fee (less Rs.499 documentation handling) is available if the trade license application is not submitted within 5 working days from receipt of all required information + municipal fee. Municipal fees already paid to the Corporation are non-refundable as per municipal bye-laws.
            </li>

            <li className="tradetc-item">
              <strong>Services Not Included:</strong> The base service does not include Fire NOC, Pollution Control approvals, Factory License, FSSAI License, GST Registration, Shop &amp; Establishment Registration, building approval, environmental clearances, litigation support, or appeal handling unless specifically mentioned in your selected plan.
            </li>

            <li className="tradetc-item">
              <strong>Inspection-Based Approvals:</strong> Certain businesses such as restaurants, hotels, manufacturing units, clinics, food establishments, and hazardous trades may require physical inspection by municipal officials before approval. Inspection timelines are controlled by the respective municipal authority. Any correction or compliance requirement identified during inspection must be completed by the applicant.
            </li>
          </ol>
        </div>
      </div>
    </section>
  );
};

export default TradeLicenseTermCondition;
