import React from "react";
import "./IECTermCondition.css";

const IECTermCondition = () => {
  return (
    <section className="iectc-section">
      <div className="iectc-container">
        <div className="iectc-card">
        {/* Heading */}
        <h2 className="iectc-title">TERMS &amp; CONDITIONS</h2>

        {/* Sub heading */}
        <p className="iectc-subtitle">
          By subscribing to any of the above plans, you agree to the following terms and conditions. Please read them carefully before proceeding.
        </p>

        {/* List */}
        <ol className="iectc-list">
          <li className="iectc-item">
            Government Fee: DGFT application fee for IEC is Rs.500 (one-time, no renewal). This is payable directly to DGFT through the online portal at the time of filing. Our fee is in addition to this. Annual update of IEC (mandatory in April-June every year) is FREE - no government fee.
          </li>

          <li className="iectc-item">
            GST on Our Fee: All quoted prices are exclusive of GST @ 18%, charged at checkout.
          </li>

          <li className="iectc-item">
            DSC Charges: Class 3 Digital Signature Certificate is required for entities (Pvt Ltd / LLP / Partnership / Trust / Society). Billed at Rs.1,999 + GST per signatory at actuals. Proprietorships can complete IEC application via Aadhaar OTP without DSC.
          </li>

          <li className="iectc-item">
            One IEC per PAN: As per the DGFT Notification of 1 July 2017, IEC is now PAN-based - one PAN can have only ONE IEC. The IEC number issued is the same as your PAN. Multiple IEC under different names but same PAN are not permitted.
          </li>

          <li className="iectc-item">
            Mandatory Annual Update (April-June): Every IEC holder MUST update IEC details online between 1 April and 30 June each year - even if there are no changes. Failure to update leads to automatic DEACTIVATION of the IEC. Reactivation is possible by completing the update; no penalty fee, but no exports / imports possible during deactivated period.
          </li>

          <li className="iectc-item">
            Refund Policy: Full refund (less Rs.599 documentation handling) is available if the application is not filed within 2 working days from receipt of complete documents. Once IEC number is generated, no refund is payable as the work is substantively complete. DGFT govt fee is non-refundable in any case.
          </li>

          <li className="iectc-item">
            Resubmission by DGFT: One free resubmission in case of DGFT objections that arise from documentation drafted by us. Resubmissions arising from client-side changes (incorrect PAN-Aadhaar mismatch, invalid bank account, address proof issues) are billed at Rs.499 + GST per resubmission.
          </li>

          <li className="iectc-item">
            Service Exporter Note: Service exporters (IT, consulting, design, BPO etc.) ALSO require IEC if they receive payment in foreign currency. Exception: services delivered to Indian residents but billed in INR don't require IEC. We confirm scope on the discovery call.
          </li>

          <li className="iectc-item">
            Out-of-Scope Items: Customs clearance (handled by Customs House Agent), shipping bill / bill of entry filing on ICEGATE, EPCG licence application, Advance Authorisation application, SEZ / STPI registration, Duty Drawback claims beyond first advisory call, MEIS legacy claims, IEC re-issuance after surrender / cancellation, and DGFT inspector visits are not included and quoted separately on request.
          </li>
        </ol>
        </div>
      </div>
    </section>
  );
};

export default IECTermCondition;
