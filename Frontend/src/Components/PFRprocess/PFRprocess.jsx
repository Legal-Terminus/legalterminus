import React from "react";
import "./PFRprocess.css";

const steps = [
  {
    title: "Discovery & Deed Inputs",
    day: "Day 0",
    text: "30-min call with our lawyer to capture: number of partners, capital contributions, profit-sharing ratio, management roles, registered office state, business activity, and whether you want a registered or unregistered firm.",
  },
  {
    title: "Stamp Duty Calculation",
    day: "Day 0–1",
    text: "We calculate the exact stamp duty payable on your Deed based on your state and capital contribution. You buy the stamp paper (or pay e-stamp duty online) — we provide the exact denomination.",
  },
  {
    title: "Partnership Deed Drafting",
    day: "Day 1–3",
    text: "Custom Deed drafted: contribution schedule, profit-sharing, management rights, decision thresholds, exit clauses, IP assignment, dispute resolution, dissolution triggers. Two rounds of revision included.",
  },
  {
    title: "Notarisation of Deed",
    day: "Day 4–5",
    text: "All partners sign the Deed in the presence of two witnesses. Notary public attests. We coordinate the notary visit; you sign physically.",
  },
  {
    title: "Firm PAN Application",
    day: "Day 5–6",
    text: "Firm PAN application filed via NSDL using the notarised Deed. Allotted within 7 working days. Required for opening the bank account.",
  },
  {
    title: "Form 1 (RoF Application) — Registered Firms Only",
    day: "Day 6–8",
    text: "Application for Registration filed in Form 1 with the Registrar of Firms in your state. Includes affidavit, notarised Deed, partner KYC, and proof of registered office.",
  },
  {
    title: "RoF Verification & Approval",
    day: "Day 8–14",
    text: "RoF verifies the application — typically 5–10 working days, varies by state (Maharashtra and Karnataka faster; some northern states slower). Queries are answered within 24 hours by us.",
  },
  {
    title: "Certificate of Registration & Onboarding",
    day: "Day 12–15",
    text: "Certificate of Registration issued by the RoF (for registered firms). Firm PAN delivered. We hand over: stamped Deed + PAN + Certificate + statutory checklist + 90-day compliance calendar (GST + IT + audit thresholds).",
  },
];

const PFRProcess = () => {
  return (
    <section className="pfr-process-wrapper">
      <h2 className="pfr-process-heading">
        Steps For Partnership Firm Registration In India
      </h2>
      <p className="pfr-process-subheading">
        Eight steps. 7–15 working days end-to-end (faster for unregistered firms; longer for states with backlogged RoF offices).
      </p>

      <div className="pfr-process-timeline">
        <div className="pfr-process-line" />

        {steps.map((step, index) => (
          <div
            key={index}
            className={`pfr-process-item ${index % 2 === 0 ? "left" : "right"} ${index === 0 ? "first" : ""} ${index === steps.length - 1 ? "last" : ""}`}
          >
            <div className="pfr-process-dot">{index + 1}</div>
            <div className="pfr-process-card">
              <h4>
                {step.title}
                {step.day && <span className="pfr-process-day-tag">{step.day}</span>}
              </h4>
              <p>{step.text}</p>
            </div>
          </div>
        ))}
      </div>
    </section>
  );
};

export default PFRProcess;
