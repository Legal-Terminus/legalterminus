import React from "react";
import "./PubpvtElegibility.css";

const steps = [
  {
    title: "Eligibility & Cap-Table Review",
    day: "Step 1",
    text: "We confirm the company can satisfy the private-company conditions — at least 2 directors and 2 members, a maximum of 200 members, and the restrictions to be added to the articles. We map the existing shareholding and plan the conversion under Section 14 / 18.",
  },
  {
    title: "Board Meeting & Notice of EGM",
    day: "Step 2",
    text: "We prepare the board resolution approving the conversion and fixing the date for the Extraordinary General Meeting (EGM). The EGM notice, the explanatory statement under Section 102, and the proposed altered MOA & AOA are drafted and circulated to members.",
  },
  {
    title: "Special Resolution & MGT-14",
    day: "Step 3",
    text: "Members pass a special resolution (75% majority) to convert the company into a Private Limited Company — altering the MOA name clause (adding 'Private') and the AOA to add the membership cap, share-transfer restriction, and public-invitation bar. Form MGT-14 is filed with the ROC within 30 days.",
  },
  {
    title: "RD-1 Application + INC-25A Advertisement",
    day: "Step 4",
    text: "An application is filed with the Regional Director in Form RD-1. A public notice in Form INC-25A is advertised in an English and a vernacular newspaper, and individual notice is served on creditors, the ROC, and the RD inviting objections within the statutory window.",
  },
  {
    title: "RD Hearing & Approval",
    day: "Step 5",
    text: "The Regional Director reviews the application and any objections raised by creditors or regulators. We respond to queries and represent the application. On being satisfied, the RD passes an order approving the conversion.",
  },
  {
    title: "INC-28, Fresh COI & Migration",
    day: "Step 6",
    text: "The RD's order is filed with the ROC in Form INC-28. The ROC issues a fresh Certificate of Incorporation in the new name (with 'Private Limited') and the CIN is updated. We then update PAN, TAN, GST, bank records, and licences, refresh the registers, and set up the leaner private-company compliance calendar.",
  },
];

const PubpvtElegibility = () => {
  return (
    <section className="opcelg-wrapper">
      <h2 className="opcelg-heading">
        Public Limited to Private Limited Conversion — Step by Step
      </h2>
      <p className="opcelg-subheading">
        Six steps from eligibility review to a fresh Certificate of Incorporation — the special resolution, Regional Director approval, and records migration handled together.
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

export default PubpvtElegibility;
