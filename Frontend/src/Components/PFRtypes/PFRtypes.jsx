import React from "react";
import "./PFRtypes.css";

const types = [
  {
    number: "01",
    title: "Registered Partnership Firm",
    text: "Filed under Section 58 with the Registrar of Firms. Recommended for any firm that intends to enter contracts, recover dues, or face disputes. Section 69 grants the right to sue third parties and partners. Most professional firms register.",
  },
  {
    number: "02",
    title: "Unregistered Partnership Firm",
    text: "A firm that operates without RoF / IGR registration. Legally valid and perfectly common, but loses the right to sue under Section 69. Suitable only for short-term ventures, family arrangements, or low-dispute trading where you don't expect to need court enforcement.",
  },
  {
    number: "03",
    title: "Partnership at Will",
    text: "Defined under Section 7. The Deed does not specify a duration or termination event. Any partner can dissolve the firm by giving written notice to other partners. Default category for most general firms unless duration is fixed.",
  },
  {
    number: "04",
    title: "Particular Partnership",
    text: "Defined under Section 8. Formed for a specific project, undertaking, or fixed duration (e.g., constructing a building, completing a contract). Auto-dissolves on completion of the venture or end of the term — no notice required.",
  },
  {
    number: "05",
    title: "Family Partnership Firm",
    text: "A firm where all partners are members of the same Hindu Undivided Family (HUF) or extended family. Tax planning angle: profit can be distributed across family members in their respective slabs, not just at the firm's flat 30%. Drafting requires care to satisfy IT department scrutiny.",
  },
  {
    number: "06",
    title: "Professional Services Firm",
    text: "Designed for professionals — chartered accountants, doctors, lawyers, architects, consultants. Eligible for Section 44ADA presumptive taxation (50% of receipts treated as income, no audit if receipts ≤ ₹75L). Often the most tax-efficient structure for solo + 1 professional set-ups.",
  },
];

const PFRTypes = () => {
  return (
    <section className="pfr-types-section">
      <div className="pfr-types-container">

        <h2 className="pfr-types-title">Types of Partnership Firm Registration</h2>

        <div className="pfr-types-cards">
          {types.map((type) => (
            <div className="pfr-types-card" key={type.number}>
              <div className="pfr-types-number">{type.number}</div>
              <h3 className="pfr-types-card-title">{type.title}</h3>
              <p className="pfr-types-card-text">{type.text}</p>
            </div>
          ))}
        </div>

      </div>
    </section>
  );
};

export default PFRTypes;
