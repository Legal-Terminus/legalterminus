import React from "react";
import "./TmrnwFeatures.css";

const types = [
  {
    number: "01",
    title: "Standard On-Time Renewal",
    text: "Your trademark is approaching expiry (within 1 year before) OR you're filing within the validity period AND LT is already the agent of record. Cleanest case: we file Form TM-R + pay Govt fee + affix DSC + deliver Challan & Acknowledgement. Renewal Certificate in 30–60 days.",
  },
  {
    number: "02",
    title: "Renewal with Attorney Change",
    text: "You're switching to LT from a previous TM agent / IP firm. Before we can file the renewal, we complete the AGENT CHANGE PROCEDURE on the IP India portal: Form TM-48 Power of Attorney drafting + Authorisation Letter drafting + POA stamping + change-of-agent filing. Then we proceed with the standard renewal.",
  },
  {
    number: "03",
    title: "Renewal Bundled with Trademark Watch",
    text: "You want the full brand-protection stack — the renewal PLUS 12 MONTHS of Trademark Watch Services so you're alerted to similar marks filed in the Journal + opposition windows + lookalike domains + marketplace infringements. Includes Agent Change if needed.",
  },
  {
    number: "04",
    title: "Late Renewal with Surcharge (Add-on across all tiers)",
    text: "Renewal filed within 6 MONTHS AFTER expiry under Section 25(4) proviso. Adds a SURCHARGE of ₹4,500 per class to the standard renewal Govt fee (pass-through at actuals). The mark remains on the register during this 6-month grace period — no removal yet. Filed via Form TM-R — we handle the surcharge computation.",
  },
  {
    number: "05",
    title: "Restoration via Form TM-R + Form TM-18 (Add-on across all tiers)",
    text: "Renewal filed BETWEEN 6 AND 12 MONTHS post-expiry. The mark has been removed from the register but is restorable under Section 25(5) read with Rule 60. Requires Form TM-R + FORM TM-18 (Affidavit supporting the Statement of Case). At the REGISTRAR'S DISCRETION.",
  },
  {
    number: "06",
    title: "Multi-Class Renewal (Across all tiers)",
    text: "Your trademark is registered across multiple classes (e.g., Class 25 apparel + Class 35 retail + Class 9 software). All classes need separate renewal — each class is a separate filing fee. Additional classes beyond the first billed at ₹799 + GST per class (professional fee) + government fee per class (at actuals). We coordinate the full portfolio.",
  },
];

const TmrnwFeatures = () => {
  return (
    <section className="opc-features-section">
      <div className="opc-features-container">

        <h2 className="opc-features-title">Types of Trademark Renewal in India</h2>
        <p className="tmrnw-features-subtitle">
          Six common renewal scenarios we handle. Pick based on your trademark's current status + your existing agent setup. The plan that fits depends on the combination.
        </p>

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

export default TmrnwFeatures;
