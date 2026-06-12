import React from "react";
import "./DpartElegibility.css";

const steps = [
  {
    title: "Decision & Mode of Dissolution",
    day: "Step 1",
    text: "The partners decide to dissolve the firm and we confirm the applicable mode — by mutual agreement, by notice (partnership at will), on a contingency, or otherwise. We review the existing partnership deed to apply any agreed dissolution terms.",
  },
  {
    title: "Settlement of Accounts",
    day: "Step 2",
    text: "We prepare the settlement of accounts under Section 48 — the firm's assets are applied to pay outside debts first, then partners' loans and capital, with any surplus shared in the profit-sharing ratio. Capital, goodwill, and outstanding figures are finalised.",
  },
  {
    title: "Drafting the Dissolution Deed",
    day: "Step 3",
    text: "We draft a comprehensive dissolution deed recording the date of dissolution, the settlement, allocation of assets and liabilities, mutual releases, and indemnities. The deed is stamped per state stamp duty and signed by all partners.",
  },
  {
    title: "Public Notice of Dissolution",
    day: "Step 4",
    text: "A public notice of dissolution is published (typically in newspapers) so that third parties are informed and partners are protected from liability for future acts. For a registered firm, a notice of dissolution is filed with the Registrar of Firms.",
  },
  {
    title: "Surrender of Registrations",
    day: "Step 5",
    text: "We coordinate the cancellation/surrender of the firm's GST, PAN, Udyam, Shops &amp; Establishment, and any other licences, and assist in closing the firm's bank account after the settlement is complete.",
  },
  {
    title: "Final Return & Closure File",
    day: "Step 6",
    text: "The firm's final income tax return is filed, and we hand over a complete closure file — the executed dissolution deed, public notice, Registrar acknowledgement, and surrender confirmations — so every partner has a clean, dispute-proof record.",
  },
];

const DpartElegibility = () => {
  return (
    <section className="opcelg-wrapper">
      <h2 className="opcelg-heading">
        Partnership Firm Dissolution Process — Step by Step
      </h2>
      <p className="opcelg-subheading">
        Six steps from decision to closure. Accounts settled, deed executed, notice given, and registrations surrendered cleanly.
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

export default DpartElegibility;
