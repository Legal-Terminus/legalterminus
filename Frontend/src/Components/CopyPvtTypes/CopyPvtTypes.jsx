import React from "react";
import "./CopyPvtTypes.css";

const types = [
  {
    number: "01",
    title: "Standard Pvt Ltd",
    text: "The default for most businesses. 2 directors, 2 shareholders, no minimum capital, no foreign investment overlay. The structure 95% of Indian startups choose at incorporation. Eligible for Section 115BAA (22% tax) and Startup India benefits.",
  },
  {
    number: "02",
    title: "Pvt Ltd with Foreign Direct Investment",
    text: "An Indian Pvt Ltd with one or more foreign shareholders. Allowed under FDI auto route in most sectors. Triggers FEMA reporting (FC-GPR within 30 days of share allotment, FLA Return annually). Higher compliance scope but unlocks foreign capital.",
  },
  {
    number: "03",
    title: "Holding Pvt Ltd",
    text: "A Pvt Ltd that controls (≥ 50% voting / board) one or more subsidiary companies. Requires consolidated financial statements, related-party-transaction disclosure under Section 188, and a longer audit perimeter. Common for HoldCo / OpCo structures.",
  },
  {
    number: "04",
    title: "Subsidiary Pvt Ltd",
    text: "A Pvt Ltd where ≥ 50% of paid-up capital is held by another company. Treated as 'subsidiary' under Section 2(87). Restricted from holding shares in its own holding company. Common for Indian arms of MNCs.",
  },
  {
    number: "05",
    title: "Pvt Ltd with Section 8 Object (Convertible)",
    text: "A standard Pvt Ltd that operates with a not-for-profit-leaning object clause, structured for convertibility into a Section 8 Company later. Useful for founders unsure between commercial and impact / charitable structures.",
  },
  {
    number: "06",
    title: "Nidhi Company",
    text: "A Private Limited Company incorporated to cultivate the habit of thrift among members and extend loans at reasonable rates. Governed by Nidhi Rules, 2014. Must achieve a minimum of 200 members and ₹10 Lakh net owned funds within one year of incorporation. Restricted from conducting chit fund, hire-purchase, or insurance business.",
  },
];

const CopyPvtTypes = () => {
  return (
    <section className="cpvt-section">
      <div className="cpvt-container">

        <h2 className="cpvt-title">Types of Private Limited Companies in India</h2>

        <div className="cpvt-cards">
          {types.map((type) => (
            <div className="cpvt-card" key={type.number}>
              <div className="cpvt-number">{type.number}</div>
              <h3 className="cpvt-card-title">
                {type.title}
                {type.subtitle && (
                  <span className="cpvt-card-subtitle"> ({type.subtitle})</span>
                )}
              </h3>
              <p className="cpvt-card-text">{type.text}</p>
            </div>
          ))}
        </div>

        <p className="cpvt-note">
          <strong>Note:</strong> For most founders and first-time entrepreneurs, the Standard Pvt Ltd is the right call. If your structure involves foreign shareholders, a holding arrangement, or a social mission, <strong>Book a Free Consultation</strong> and we'll help you decide.
        </p>

      </div>
    </section>
  );
};

export default CopyPvtTypes;
