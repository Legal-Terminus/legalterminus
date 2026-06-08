import React from "react";
import "../PvtltdProcess/PvtltdProcess.css";

const steps = [
  {
    title: "Discovery & State Check",
    day: "Day 0",
    text: "30-min call with our state-labour expert to confirm: state(s) of operation, establishment type (shop / office / restaurant / cinema etc.), employee count, business activity, address, and existing registrations (PAN / GST / MSME). We map state-specific SHOP & ESTABLISHMENT requirements and fee slab.",
  },
  {
    title: "Documents Collection",
    day: "Day 1–2",
    text: "Entity PAN, COI / Partnership Deed / Trade Licence / Proprietorship proof, address proof (electricity bill, rent agreement, NoC), photograph of establishment, authorised signatory's Aadhaar + PAN, employee list summary.",
  },
  {
    title: "State Portal Registration",
    day: "Day 2",
    text: "Create user account on the State Labour Department portal (state-specific URL — Maharashtra: aaplesarkar.mahaonline.gov.in, Karnataka: shopsce.karnataka.gov.in, Delhi: labourcis.nic.in etc.). Email + mobile OTP verification.",
  },
  {
    title: "State-Specific Form Filing",
    day: "Day 2–3",
    text: "Application form filed (Form A / Form 1 / LM-1 / LM-2 depending on state). Establishment details, employer details, employee count, working hours, weekly off schedule, holiday list. DSC-signed where required.",
  },
  {
    title: "Government Fee Payment",
    day: "Day 3",
    text: "State government fee paid online via the portal (net banking / debit card / UPI). Receipt auto-generated. Fee slab depends on employee count + establishment type per state schedule.",
  },
  {
    title: "Inspector Verification (Some States)",
    day: "Day 4–7",
    text: "Some states (e.g., Tamil Nadu, West Bengal) require Inspector visit for physical verification of the establishment before issuing the Certificate. Inspector is typically allocated within 3–5 working days.",
  },
  {
    title: "Registration Certificate Issuance",
    day: "Day 5–10",
    text: "State Labour Department issues the Registration Certificate (Gumasta / SHOP & ESTABLISHMENT Cert / Trade Licence / etc.) — PDF downloadable from the portal. Some states still issue physical certificates by post.",
  },
  {
    title: "Onboarding Kit + Renewal Calendar",
    day: "Day 7–10",
    text: "We deliver: Registration Certificate, state-specific renewal calendar (lifetime / 1-year / 3-year / 5-year depending on state), statutory register templates (Enriched / Supreme), display-board template, 1-year free-update tracker.",
  },
];

const ShopRegProcess = () => {
  return (
    <section className="pvtltd-gst-wrapper">
      <h2 className="gst-heading">
        Steps for Shop &amp; Establishment Registration in India
      </h2>
      <p className="pv-gst-subheading">
        Eight steps. 5–10 working days end-to-end (state-dependent). Some states issue certificates same-day post-payment; others take 7–10 days for Inspector clearance.
      </p>

      <div className="pvtltd-timeline">
        <div className="pvtltd-timeline-line" />

        {steps.map((step, index) => (
          <div
            key={index}
            className={`pvtltd-timeline-item ${index % 2 === 0 ? "left" : "right"} ${index === 0 ? "first" : ""} ${index === steps.length - 1 ? "last" : ""}`}
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

export default ShopRegProcess;
