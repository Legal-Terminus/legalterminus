import React from "react";
import "../OPCElegibility/OPCElegibility.css";

const steps = [
  {
    title: "Eligibility & State Applicability Check",
    day: "Day 0",
    text: "30-min consultation to confirm: which states PT applies in for your business, whether you need an RC (employer), EC (self-employed), or both, your employee headcount, salary slabs, and whether any exemptions apply to your industry or entity type.",
  },
  {
    title: "Document Collection",
    day: "Day 1",
    text: "Share your KYC documents, business registration proof, employee list (for RC), and address proof. This is your only job at the start — we handle everything from here. Complete checklist shared on Day 0 call.",
  },
  {
    title: "Application Preparation",
    day: "Day 1–2",
    text: "We prepare your PT registration application per state-specific formats. Each state has a different form, supporting document list, and portal process — Maharashtra uses Mahavat, Karnataka uses PT Online, West Bengal uses WBPTAX. We handle all portals.",
  },
  {
    title: "Application Filing on State Portal",
    day: "Day 2–3",
    text: "Application filed on the state PT department portal. Some states issue immediate provisional RC; others take 3–7 working days for manual processing. We track status and follow up on your behalf.",
  },
  {
    title: "Registration Certificate (RC/EC) Delivery",
    day: "Day 3–7",
    text: "RC or EC issued by the state PT authority. Certificate contains your PT registration number, applicable slabs, and return due dates. We deliver the certificate and brief you on monthly/quarterly obligations.",
  },
  {
    title: "Challan Setup & Slab Mapping",
    day: "Day 5–7",
    text: "We map your employee salary structure to the correct PT slabs, set up the challan payment process, and share a monthly deduction template (Excel) so your HR/payroll team can calculate accurately every month.",
  },
  {
    title: "First Return Filing",
    day: "Day 7–10",
    text: "First PT return filed for the month of registration. Return includes headcount, salary bands, PT deducted, and challan reference number. We file once you share the challan payment acknowledgement.",
  },
  {
    title: "Compliance Calendar & Ongoing Support",
    day: "Ongoing",
    text: "You receive a 12-month PT compliance calendar with state-specific due dates, WhatsApp reminders 7 days and 2 days before each deadline, and a dedicated point of contact for queries. Annual renewal (where applicable) is flagged in advance.",
  },
];

const ProfTaxProcess = () => {
  return (
    <section className="opcelg-wrapper">
      <h2 className="opcelg-heading">
        Steps for Professional Tax Registration &amp; Compliance in India
      </h2>
      <p className="opcelg-subheading">
        Eight steps. 3–7 working days for registration (assuming clean documents and a state portal with online processing).
      </p>

      <div className="opcelg-timeline">
        <div className="opcelg-timeline-line" />

        {steps.map((step, index) => (
          <div
            key={index}
            className={`opcelg-timeline-item ${
              index % 2 === 0 ? "left" : "right"
            } ${index === 0 ? "first" : ""} ${
              index === steps.length - 1 ? "last" : ""
            }`}
          >
            <div className="opcelg-timeline-dot">{index + 1}</div>

            <div className="opcelg-timeline-card">
              <h4>
                {step.title}
                {step.day && <span className="opcelg-day-tag">{step.day}</span>}
              </h4>
              <p>{step.text}</p>
            </div>
          </div>
        ))}
      </div>
    </section>
  );
};

export default ProfTaxProcess;
