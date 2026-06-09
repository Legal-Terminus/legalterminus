import React from "react";
import "../OPCTermCondition/OPCTermCondition.css";

const ProfTaxTermCondition = () => {
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
              Professional Fee Only: All quoted prices are exclusive of government fees, state levies, challan amounts, and out-of-pocket costs. Our fee covers professional services — eligibility check, registration application preparation, portal filing, certificate delivery, and return filing coordination.
            </li>
            <li className="opctc-item">
              State Applicability: Professional Tax is not levied in all states. As of 2026, PT applies in Maharashtra, Karnataka, Andhra Pradesh, Telangana, Tamil Nadu, West Bengal, Gujarat, Meghalaya, Assam, Odisha, and a few others. We verify your state's applicability before filing. If PT is not applicable, a refund less ₹499 processing fee will be issued.
            </li>
            <li className="opctc-item">
              Employer Obligation: As an employer, you are responsible for deducting Professional Tax from employee salaries per the applicable slab and remitting the challan to the state government on or before the due date. Our fee covers the filing support — the challan payment is your direct obligation to the state.
            </li>
            <li className="opctc-item">
              GST on Our Fee: All quoted prices are exclusive of GST @ 18%, charged at checkout.
            </li>
            <li className="opctc-item">
              Return Filing Scope: Return filing plans cover the filing of PT returns for the number of months or years specified in the plan. Challan payments are not included — you remit directly to the state portal. We file the return form once you share the payment acknowledgement.
            </li>
            <li className="opctc-item">
              Employee Headcount Changes: Variations in employee count (joining / exit) must be communicated to us before the monthly filing deadline. Retrospective headcount changes that trigger revised returns will be charged additionally at ₹499 per revision.
            </li>
            <li className="opctc-item">
              Multi-State Registrations: Each state registration is treated as a separate engagement. The Supreme plan includes up to 3 states. Additional state registrations are quoted separately based on state-specific requirements.
            </li>
            <li className="opctc-item">
              Refund Policy: Full refund of professional fee (less ₹499 documentation handling) is available if PT registration application is not filed within 5 working days from receipt of complete documents and information. Post-filing refunds are not applicable.
            </li>
            <li className="opctc-item">
              Penalty Notices: Response to penalty or demand notices is included only in the Enriched and Supreme plans (1 notice and unlimited respectively). Notices arising from client-side errors (incorrect data submitted, missed payment) may be handled at additional cost.
            </li>
          </ol>
        </div>
      </div>
    </section>
  );
};

export default ProfTaxTermCondition;
