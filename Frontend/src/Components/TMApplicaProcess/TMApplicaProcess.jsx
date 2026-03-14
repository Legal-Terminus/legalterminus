import React from "react";
import "./TMApplicaProcess.css";

const steps = [
  {
    title: "Step 1 – Document Submission & Trademark Search",
    text:
      "Share your brand name/logo and business details with us. We conduct a comprehensive trademark search on the IP India portal to check for existing similar marks — minimising your risk of rejection.",
  },
  {
    title: "Step 2 – Trademark Class Selection",
    text:
      "Based on your goods/services, we identify the correct trademark class(es) under the Nice Classification system. You'll be advised on single-class vs multi-class filing strategy.",
  },
  {
    title: "Step 3 – Drafting & Filing Form TM-A",
    text:
      "We prepare and file your application through Form TM-A on the official IP India portal (ipindia.gov.in). You get your application number immediately upon successful submission.",
  },
  {
    title: "Step 4 – Vienna Codification (if applicable)",
    text:
      "For logo/device marks, the Trademark Registry assigns a Vienna Code to classify the graphical elements.",
  },
  {
    title: "Step 5 – Examination by Trademark Registry",
    text:
      "The Trademark Examiner reviews the application within 19–20 months (this timelines varies and depends on the backlog with the department). They check for conflicts with existing marks, absolute and relative grounds for refusal under the Trade Marks Act, 1999.",
  },
  {
    title: "Step 6 – Reply to Examination Report (if required)",
    text:
      "If objections are raised, we file a detailed legal reply within 30 days. If needed, we represent you at the Show Cause Hearing before the Examiner. (Included in Enriched & Supreme plans.)",
  },
  {
    title: "Step 7 – Publication in the Trademark Journal",
    text:
      "Once accepted, the mark is published in the weekly Trademark Journal. It remains open for opposition by any third party for 4 months from the date of publication.",
  },
  {
    title: "Step 8 – Registration Certificate",
    text:
      "If no opposition is filed (or opposition is decided in your favour), the Trademark Office issues your Certificate of Registration. Your brand is now officially protected with the ® symbol.",
  },
];

const GSTProcess = () => {
  return (
    <section className="Tm-Application-gst-wrapper">
     <h2 className="TM-Applica-doc-heading">
        Steps for Trademark Registration in India
      </h2>
      <p className="Tm-Application-gst-subheading">
        The broad process of registering a trademark involves the following steps:
      </p>

      <div className="Tm-Application-timeline">
        <div className="Tm-Application-timeline-line" />

        {steps.map((step, index) => (
          <div
            key={index}
            className={`pvtltd-timeline-item ${
              index % 2 === 0 ? "left" : "right"
            }`}
          >
            <div className="Tm-Application-timeline-dot">{index + 1}</div>

            <div className="Tm-Application-timeline-card">
              <h4>{step.title}</h4>
              <p>{step.text}</p>
            </div>
          </div>
        ))}
      </div>
    </section>
  );
};

export default GSTProcess;
