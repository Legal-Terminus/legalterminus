import React from "react";
import "./TmhearFeatures.css";

const types = [
  {
    number: "01",
    title: "Show Cause Hearing — Post Examination Report Reply (Rule 33)",
    text: "After the applicant files reply to the Examination Report, if the Examiner is not satisfied, a Show Cause Hearing is scheduled with minimum 15 days notice. The applicant must show cause why the application should not be refused under Section 18(5). Most common hearing type in TM practice. Elemental tier covers attendance; Enriched / Supreme add brief drafting + adjournment management.",
  },
  {
    number: "02",
    title: "Opposition Final Hearing — Post Pleadings + Evidence (Rule 50)",
    text: "After opposition pleadings (Notice of Opposition + Counter Statement) and evidence stages (Rules 45 / 46 / 47) are closed, the Registrar schedules the Final Hearing under Rule 50. This is the deciding hearing — both parties argue + Hearing Officer issues a binding order under Section 21(5). Recommended Enriched / Supreme tier given the stakes.",
  },
  {
    number: "03",
    title: "Rectification / Cancellation Hearing (Section 47 / 57)",
    text: "In petitions to rectify the register (correct entries, modify limitations) or cancel a registered trademark (non-use, fraud, descriptive registration), hearings are scheduled before the Registrar. Section 47 covers non-use; Section 57 covers other rectification grounds. We attend, argue, and follow up till order. Supreme tier recommended for complex rectification matters.",
  },
  {
    number: "04",
    title: "Renewal / Restoration Hearing (Section 25)",
    text: "Rare but possible — in contested renewal / restoration matters (e.g., where the Registrar's office identifies issues with the renewal application or where restoration is opposed), a hearing may be convened. We represent the trademark owner + argue for renewal / restoration grant. Typically Elemental or Enriched tier sufficient.",
  },
  {
    number: "05",
    title: "Hearing After 1st Adjournment — Re-Hearing",
    text: "Where the initial hearing was adjourned (via Form TM-M ₹900) for valid reasons — witness availability, evidence finalisation, etc. — the re-hearing is the second appearance opportunity. Supreme tier covers UP TO 2 HEARINGS in one engagement (initial + re-hearing). Critical to attend the re-hearing fully prepared — beyond 2 adjournments, Hearing Officer typically proceeds ex-parte.",
  },
  {
    number: "06",
    title: "Multi-Party Opposition Hearing",
    text: "In oppositions where MULTIPLE parties have opposed the same application (e.g., 2-3 opposers concurrently), the Final Hearing typically consolidates all opposition matters together. Our representation covers your party + coordinates with other counsel where appropriate. Supreme tier recommended given the procedural complexity.",
  },
];

const TmhearFeatures = () => {
  return (
    <section className="opc-features-section">
      <div className="opc-features-container">

        <h2 className="opc-features-title">Types of Trademark Hearings in India</h2>

        <div className="opc-features-cards">
          {types.map((type) => (
            <div className="opc-features-card" key={type.number}>
              <div className="opc-features-number">{type.number}</div>
              <h3 className="opc-features-card-title">{type.title}</h3>
              <p className="opc-features-card-text">{type.text}</p>
            </div>
          ))}
        </div>

      </div>
    </section>
  );
};

export default TmhearFeatures;
