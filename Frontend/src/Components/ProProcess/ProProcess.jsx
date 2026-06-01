import React from "react";
import "./ProProcess.css";

const steps = [
  {
    title: "Discovery & Registration Map",
    day: "Day 0",
    text: "30-min call with our CA to confirm: business activity, projected turnover, state of operation, marketplace plans, food / import-export needs, and tax-regime preference. We map the exact registrations you need — no over-registering, no gaps.",
  },
  {
    title: "PAN + Aadhaar Verification",
    day: "Day 0–1",
    text: "Confirm proprietor's PAN-Aadhaar linkage status. If not linked, we get it done first (without it, GST and bank account both fail).",
  },
  {
    title: "MSME / Udyam Registration",
    day: "Day 1",
    text: "Filed online at udyamregistration.gov.in. Free, instant. Registration number issued within 24 hours. Eligibility for MSME loan schemes, government tenders, and protection under the MSMED Act, 2006.",
  },
  {
    title: "Shop & Establishment Act Registration",
    day: "Day 1–10",
    text: "Filed with the State Labour Department. Required for any commercial premises (including home-office). Issued in 7–15 working days depending on state.",
  },
  {
    title: "GST Registration (If Applicable)",
    day: "Day 1–7",
    text: "Filed at gst.gov.in if turnover threshold is crossed (₹40L goods / ₹20L services) OR if you're an e-commerce operator / inter-state supplier under Section 24. Voluntary registration available for ITC benefits. ARN issued instantly; GSTIN in 3–7 days.",
  },
  {
    title: "Trade Licence + Professional Tax + Sectoral",
    day: "Day 3–15",
    text: "Trade Licence from municipal corporation (where applicable). Professional Tax registration with State Government. Sectoral licences (FSSAI, IEC, drug, BIS, AYUSH) as relevant. Timelines vary 7–30 days.",
  },
  {
    title: "Onboarding Kit & Tax-Regime Setup",
    day: "Day 10–15",
    text: "We deliver: All registration certificates in one PDF, statutory compliance checklist, 90-day compliance calendar, ITR-3 vs ITR-4 (presumptive) recommendation, GSTR rhythm calendar, marketplace seller onboarding kit (if requested).",
  },
];

const GSTProcess = () => {
  return (
    <section className="pvtltd-gst-wrapper">
      <h2 className="gst-heading">
        Steps for Proprietorship Firm Registration in India
      </h2>
      <p className="pv-gst-subheading">
        Eight steps. 5 – 15 working days end-to-end depending on the registration stack you choose.
      </p>

      <div className="pvtltd-timeline">
        <div className="pvtltd-timeline-line" />

        {steps.map((step, index) => (
          <div
            key={index}
            className={`pvtltd-timeline-item ${
              index % 2 === 0 ? "left" : "right"
            } ${index === 0 ? "first" : ""} ${
              index === steps.length - 1 ? "last" : ""
            }`}
          >
            <div className="pvtltd-timeline-dot">{index + 1}</div>

            <div className="pvtltd-timeline-card">
              <h4>
                {step.title}
                {step.day && <span className="pvtltd-day-tag">{step.day}</span>}
              </h4>
              <p>{step.text}</p>
            </div>
          </div>
        ))}
      </div>
    </section>
  );
};

export default GSTProcess;
