import React from "react";
import "../OPCTermCondition/OPCTermCondition.css";

const OLWFTermCondition = () => {
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
              <strong>Government Fee:</strong> OLWF Registration fee is payable to the Odisha Labour Welfare Board (typically Rs.0 – Rs.500 per current state notification) — billed at actuals. Our professional fee covers advisory, Form A drafting, Welfare Commissioner liaison, worker mapping, and post-registration support.
            </li>
            <li className="opctc-item">
              <strong>GST on Our Fee:</strong> All quoted prices are exclusive of GST @ 18%, charged at checkout.
            </li>
            <li className="opctc-item">
              <strong>Contribution Rates Are State-Notified:</strong> Both employer and employee contributions under OLWF are nominal per-worker amounts notified by the Odisha Labour Welfare Board. These rates may change from time to time by state notification. We share the current applicable rates on the discovery call. Contributions are paid half-yearly (typically by 15 January and 15 July).
            </li>
            <li className="opctc-item">
              <strong>Mandatory Coverage Threshold:</strong> OLWF Registration is mandatory under the Odisha Labour Welfare Fund Act, 1996 for establishments in Odisha employing 5 or more workers. Coverage extends to all employees / workers as defined under the Act (subject to wage / category exclusions per state notification). The discovery call covers eligibility specific to your establishment type.
            </li>
            <li className="opctc-item">
              <strong>Odisha-Only Scope:</strong> OLWF is a state-specific registration applicable only to establishments located in or operating within Odisha. If you have branches in multiple states, each state has its own Labour Welfare Fund (e.g., Karnataka KLWF, Maharashtra MLWF, Tamil Nadu TLWF) — we cover only the Odisha registration under this service.
            </li>
            <li className="opctc-item">
              <strong>Worker Capacity per Plan:</strong> Elemental covers worker mapping for up to 10 workers. Enriched up to 25 workers. Supreme up to 50 workers. Additional workers beyond plan limits are billed at Rs.99 per worker mapping.
            </li>
            <li className="opctc-item">
              <strong>Refund Policy:</strong> Full refund of professional fee (less Rs.999 documentation handling) is available if OLWF application is not filed within 7 working days from receipt of complete documents. Government fee and any costs if already paid to the Welfare Board are non-refundable.
            </li>
            <li className="opctc-item">
              <strong>Half-Yearly Compliance Out-of-Scope:</strong> Plans do not include ongoing half-yearly contribution filing beyond the included tier scope (Elemental: 0 cycles; Enriched: 1 cycle; Supreme: 2 cycles in first year). Welfare Inspector visits / inquiries, worker grievance handling, individual benefit claims, and prosecution defence are not included.
            </li>
            <li className="opctc-item">
              <strong>Out-of-Scope Items:</strong> Labour Welfare Fund registrations of other states (Karnataka, Maharashtra, Tamil Nadu, Delhi etc.), Building & Other Construction Workers (BOCW) Welfare Cess, Odisha Shops & Commercial Establishments Act registration, Odisha Factories Act registration, ESI, EPF, Professional Tax, and any worker-side benefit claims (scholarships, medical reimbursements, housing scheme applications, funeral assistance) are not included under this service and are not offered by us as scope for OLWF service.
            </li>
          </ol>
        </div>
      </div>
    </section>
  );
};

export default OLWFTermCondition;
