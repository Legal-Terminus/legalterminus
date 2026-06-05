import React from "react";
import "./LLPTypes.css";

const types = [
  { number: "01", title: "Standard LLP", text: "The default structure for most two-partner firms. Two designated partners (one resident in India), no minimum capital, profit share defined in the LLP Agreement. Most used by SMEs, consultancies, and trading firms." },
  { number: "02", title: "Small LLP (Statutory)", text: "Contribution ≤ ₹25L AND turnover ≤ ₹40L (both must be met). Recognised under Section 2(1)(ta) post-2021 amendment. Reduced filing fees (50% lower), no mandatory audit, simpler annual return. The smart starting structure for bootstrapped partnerships." },
  { number: "03", title: "Foreign LLP", text: "An LLP with one or more foreign partners. Allowed under FDI auto route in most sectors (LLPs in the agriculture and real estate sectors are restricted). FEMA / RBI reporting via FC-GPR + FLA Return is mandatory. Higher compliance scope." },
  { number: "04", title: "Professional Services LLP", text: "Designed for chartered accountants, company secretaries, lawyers, doctors, architects, and consultants. Object clause focuses on professional services. Often qualifies as a Small LLP and benefits from compliance relaxations." },
  { number: "05", title: "Investment / Holding LLP", text: "Used as an investment vehicle by HNIs, family offices, and PE/VC managers. Holds securities / property / strategic stakes. Note: cannot conduct NBFC activities; investments must be passive holdings, not lending." },
  { number: "06", title: "Conversion LLP", text: "An LLP formed by converting an existing Partnership Firm (Form 17), Pvt Ltd (Form 18), or Unlisted Public Company (Form 18). Common path for reducing tax / compliance load. Conversion preserves PAN, contracts, and licences subject to clearances." },
];

const LLPTypes = () => (
  <section className="llp-types-section">
    <div className="llp-types-container">
      <h2 className="llp-types-title">Types of Limited Liability Partnership in India</h2>
      <div className="llp-types-cards">
        {types.map((type) => (
          <div className="llp-types-card" key={type.number}>
            <div className="llp-types-number">{type.number}</div>
            <h3 className="llp-types-card-title">{type.title}</h3>
            <p className="llp-types-card-text">{type.text}</p>
          </div>
        ))}
      </div>
    </div>
  </section>
);

export default LLPTypes;
