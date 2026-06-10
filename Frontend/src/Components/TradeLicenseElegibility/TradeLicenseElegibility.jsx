import React from "react";
import "./TradeLicenseElegibility.css";

const steps = [
  {
    title: "Discovery & City / Category Identification",
    day: "Day 0",
    text:
      "30-min call with our municipal-compliance specialist to confirm: business activity, exact trade category (general / food / industrial / hazardous / hospitality / health / entertainment), city + zone of premises (commercial / residential / industrial / mixed-use), premises area in sq ft, entity type, and the list of adjacent licenses (FSSAI / Fire / Pollution / S&E).",
  },
  {
    title: "Municipal Portal Account Setup",
    day: "Day 1",
    text:
      "Account creation on the relevant Corporation's portal — MCD (mcdonline.nic.in), BMC (portal.mcgm.gov.in), BBMP (bbmp.gov.in), GCC (chennaicorporation.gov.in), GHMC (ghmc.gov.in), KMC (kmcgov.in), or other city ULB portal. KYC + entity profile configured.",
  },
  {
    title: "Document Collection",
    day: "Day 1-3",
    text:
      "Personalised checklist: PAN, entity Certificate of Incorporation / Partnership Deed, premises proof (rent agreement + ownership document / sale deed), latest property tax receipt, owner's NOC (for rented premises), electricity bill, authorised signatory KYC, recent photographs of premises (interior + exterior + signage), and trade-specific NOC (Fire / Pollution / Police / FSSAI where applicable).",
  },
  {
    title: "Application Drafting + Fee Computation",
    day: "Day 3-5",
    text:
      "Application drafted with the correct trade category code, premises area, zone classification, declared activity, and supporting annexures. Municipal fee computed per the Corporation's current tariff (varies by city / category / area).",
  },
  {
    title: "Municipal Fee Payment + Portal Submission",
    day: "Day 5-6",
    text:
      "You pay the municipal fee via the Corporation's online payment gateway. Application + all annexures uploaded. Acknowledgement with application number + timestamp captured.",
  },
  {
    title: "Inspection (Category-Dependent)",
    day: "Day 6-15",
    text:
      "For general trade in metros: many cities now auto-approve low-risk categories without physical inspection. For food / industrial / hazardous / hospitality / health: mandatory physical inspection by Municipal Health Officer / Fire Department / Sanitation Officer / Industrial Officer.",
  },
  {
    title: "Query Reply + Inspector Report",
    day: "Day 10-20",
    text:
      "If any queries / observations are raised by the Corporation or inspector, they are addressed within 7 days and we resubmit the application.",
  },
  {
    title: "Trade License Certificate + Renewal Calendar Handover",
    day: "Day 12-30",
    text:
      "Trade License Certificate issued by the Corporation — downloadable from the portal + posted to registered address (in some cities). We deliver: certificate PDF + annual renewal calendar (90 / 30 / 7-day reminders) + post-issuance support pack + (where applicable) compliance map showing adjacent linked licenses + their renewal cycles.",
  },
];

const TradeLicenseElegibility = () => {
  return (
    <section className="tradeelg-wrapper">
      <h2 className="tradeelg-heading">
        Steps For Trade License Registration in India
      </h2>
      <p className="tradeelg-subheading">
        Eight steps. 10-15 working days for general trade categories in metros;
        20-30 days for inspection-linked categories (food / industrial /
        hazardous / hospitality / health).
      </p>

      <div className="tradeelg-timeline">
        <div className="tradeelg-timeline-line" />

        {steps.map((step, index) => (
          <div
            key={index}
            className={`tradeelg-timeline-item ${
              index % 2 === 0 ? "left" : "right"
            } ${index === 0 ? "first" : ""} ${
              index === steps.length - 1 ? "last" : ""
            }`}
          >
            <div className="tradeelg-timeline-dot">{index + 1}</div>

            <div className="tradeelg-timeline-card">
              <h4>
                {step.title}
                {step.day && <span className="tradeelg-day-tag">{step.day}</span>}
              </h4>
              <p>{step.text}</p>
            </div>
          </div>
        ))}
      </div>
    </section>
  );
};

export default TradeLicenseElegibility;
