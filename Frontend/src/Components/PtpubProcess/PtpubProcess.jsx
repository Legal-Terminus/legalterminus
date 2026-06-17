import React from "react";
import "./PtpubProcess.css";

const steps = [
  {
    title: "Eligibility & Cap-Table Review",
    day: "Day 0",
    text: "60-min call with our expert to confirm you meet — or can meet — the public-company minimums: at least 7 members and 3 directors. We review the current shareholding, the AOA restrictions to be removed, authorised capital, and map the conversion plan end to end.",
  },
  {
    title: "Board Meeting & Notice of EGM",
    day: "Day 1–3",
    text: "We prepare the board resolution approving the conversion and fixing the date for the Extraordinary General Meeting (EGM). The EGM notice, explanatory statement under Section 102, and the proposed altered MOA & AOA are drafted and circulated to members.",
  },
  {
    title: "Special Resolution at EGM",
    day: "Day 7–10",
    text: "Members pass a special resolution (75% majority) under Section 14 to convert the company into a Public Limited Company — altering the MOA name clause (removing 'Private') and the AOA to delete the restrictions on membership, share transfer, and public invitation.",
  },
  {
    title: "Inducting Members / Directors (if needed)",
    day: "Day 7–12",
    text: "If the company has fewer than 7 members or 3 directors, we onboard the additional members and appoint the required directors (with DSC and DIN) so the statutory minimum is met before the conversion is filed.",
  },
  {
    title: "MGT-14 Filing",
    day: "Day 10–15",
    text: "Form MGT-14 is filed with the ROC within 30 days of the special resolution, attaching the certified resolution, the explanatory statement, and the altered MOA & AOA. This records the resolution on the MCA register.",
  },
  {
    title: "INC-27 Conversion Application",
    day: "Day 15–20",
    text: "Form INC-27 — the application for conversion of a private company into a public company — is filed with the ROC along with the minutes of the EGM, the list of members and directors, and the amended charter documents.",
  },
  {
    title: "ROC Scrutiny & Clarifications",
    day: "Day 20–30",
    text: "The Registrar reviews MGT-14 and INC-27. If a deficiency is raised (typically MOA/AOA wording or member-count proof), we file a re-submission promptly so the application stays on track.",
  },
  {
    title: "Fresh Certificate of Incorporation",
    day: "Day 30–45",
    text: "On approval, the ROC issues a fresh Certificate of Incorporation in the new name with 'Limited' (dropping 'Private'). The CIN is updated and the company is now a Public Limited Company.",
  },
  {
    title: "Post-Conversion Updates",
    day: "Day 45–60",
    text: "We update PAN, TAN, GST, bank records, and licences to the new name, issue revised share certificates, refresh the statutory registers, and hand over a post-conversion compliance calendar covering the heavier public-company governance.",
  },
];

const ConversionProcess = () => {
  return (
    <section className="pv-gst-wrapper">
      <h2 className="pv-gst-heading">
        Steps to Convert a Private Limited into a Public Limited Company
      </h2>
      <p className="pv-gst-subheading">
        From your first call to the fresh Certificate of Incorporation — here's exactly what happens, step by step.
      </p>

      <div className="pv-timeline">
        <div className="pv-timeline-line" />

        {steps.map((step, index) => (
          <div
            key={index}
            className={`pv-timeline-item ${
              index % 2 === 0 ? "left" : "right"
            } ${index === 0 ? "first" : ""} ${
              index === steps.length - 1 ? "last" : ""
            }`}
          >
            <div className="pv-timeline-dot">{index + 1}</div>

            <div className="pv-timeline-card">
              <h4>
                {step.title}
                {step.day && <span className="pv-day-tag">{step.day}</span>}
              </h4>
              <p>{step.text}</p>
            </div>
          </div>
        ))}
      </div>
    </section>
  );
};

export default ConversionProcess;
