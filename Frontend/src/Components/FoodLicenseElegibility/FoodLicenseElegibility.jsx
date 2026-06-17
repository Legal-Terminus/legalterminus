import React from "react";
import "./FoodLicenseElegibility.css";

const steps = [
  {
    title: "Discovery & Tier Determination",
    day: "Day 0",
    text: "30-min call with our food-law specialist to confirm: FBO type (Petty Retailer of snacks / tea shops / Hawker / other Petty FBO / Restaurant / Manufacturer / Importer / Exporter / E-commerce / Multi-state / 5-star hotel), annual turnover (mapped against revised 2026 slabs), production capacity (for manufacturers), geographic scope, and compulsory-Central triggers. Output: correct plan tier (Elemental / Enriched / Supreme / Supreme Plus) + government fee estimate.",
  },
  {
    title: "FoSCoS Account Setup",
    day: "Day 1",
    text: "Create FBO account on the FoSCoS portal (https://foscos.fssai.gov.in) with PAN-linked details. Verify mobile + email OTP. Configure KOB / Product Category Mapping.",
  },
  {
    title: "Documents Collection",
    day: "Day 1–5",
    text: "Personalised checklist per tier. Elemental: ID, address, photograph, activity declaration. Enriched: add product list, premises proof, food category list. Supreme: add water test report, NOC, blueprint, equipment list, source of raw material. Supreme Plus: add IEC (for importers / exporters), FSMP, HACCP plan, recall plan, authority letter.",
  },
  {
    title: "Application Drafting (Form A / Form B)",
    day: "Day 5–7",
    text: "Form A (Elemental + Enriched) or Form B (Supreme / Supreme Plus) drafted with full annexures. FSMP + HACCP plan (Supreme / Supreme Plus). Premises blueprint + flow diagram review (Supreme / Supreme Plus). Cross-verified against FSS Regulations Schedule 4 hygiene requirements.",
  },
  {
    title: "Government Fee Payment",
    day: "Day 7",
    text: "Per-year government fee computed (₹100 Elemental / Enriched; ₹2,000–5,000 Supreme; ₹7,500 Supreme Plus per category × chosen years). You make the payment online via the FoSCoS portal payment gateway or via our coordination.",
  },
  {
    title: "FoSCoS Submission",
    day: "Day 7–8",
    text: "Application + annexures uploaded to FoSCoS. Digital filing acknowledged with timestamp + application reference number.",
  },
  {
    title: "Departmental Inspection + Query Reply",
    day: "Day 10–45",
    text: "For State License: a risk-based inspection by the Designated Officer may be conducted. For Central License: mandatory pre-license inspection by the Central Licensing Authority. Any queries / objections raised on FoSCoS are responded to within 30 days.",
  },
  {
    title: "License Issuance + Renewal Calendar Delivery",
    day: "Day 10 / 30 / 45–60",
    text: "FSSAI License / Registration Certificate issued with 1–5 YEAR VALIDITY (per applicant's choice at filing). We deliver: License PDF + 14-digit license number + Food Safety Display Board template + RENEWAL-REMINDER CALENDAR (90 / 30 / 7-day pre-expiry alerts) + Form D1 annual return calendar (Supreme / Supreme Plus) + onboarding kit with FSSAI logo + labelling guidance. (Day 10 Elemental + Enriched / Day 30 Supreme / Day 45–60 Supreme Plus.)",
  },
];

const FoodLicenseElegibility = () => {
  return (
    <section className="opcelg-wrapper">
      <h2 className="opcelg-heading">
        Steps for FSSAI Food License Registration in India
      </h2>
      <p className="opcelg-subheading">
        Eight steps. Timelines vary by tier: Elemental + Enriched (Basic Registration) in 7–10 working days; Supreme (State License) in 30 working days; Supreme Plus (Central License) in 45–60 working days (subject to FSSAI inspection cycle). Once granted, the licence is valid for the 1–5 year tenure chosen at filing — subject to renewal before expiry + risk-based inspection compliance.
      </p>

      <div className="opcelg-timeline">
        <div className="opcelg-timeline-line" />

        {steps.map((step, index) => (
          <div
            key={index}
            className={`opcelg-timeline-item ${index % 2 === 0 ? "left" : "right"} ${index === 0 ? "first" : ""} ${index === steps.length - 1 ? "last" : ""}`}
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

export default FoodLicenseElegibility;
