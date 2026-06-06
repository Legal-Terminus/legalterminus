import React from "react";
import "./IncorporationPvtTypes.css";

const types = [
  {
    number: "01",
    title: "Indian-Parent WOS (Operating Subsidiary)",
    subtitle: "Indian-Parent",
    text: "Indian holding company sets up a 100%-owned operating subsidiary for a specific vertical, brand, or geography. No FDI / FEMA scope. Typical use: spinning off a new business line, ring-fencing a high-risk activity, or setting up a separate legal vehicle for an M&A target.",
  },
  {
    number: "02",
    title: "Indian-Parent Step-Down Subsidiary",
    subtitle: "HoldCo / OpCo",
    text: "An Indian WOS that itself owns one or more further subsidiaries (parent → WOS-1 → WOS-2). Common in HoldCo/OpCo structures, multi-vertical conglomerates, and family business reorganisation. Triggers consolidated financials at WOS-1 under Section 129.",
  },
  {
    number: "03",
    title: "Indian-Parent IP / Royalty WOS",
    subtitle: "IP / Royalty",
    text: "Indian holding company creates a WOS to hold patents, trademarks, software, or other intangible assets — licensed back to parent / group entities for royalty. Transfer pricing under domestic TP rules (Section 92BA). Cleaner audit perimeter for IP-heavy groups.",
  },
  {
    number: "04",
    title: "Foreign-Parent Operating WOS (Standard)",
    subtitle: "Most Common",
    text: "The most common foreign-entry structure. MNC parent + 1 nominee, 2 directors (1 resident), 100% FDI under auto route in most sectors. Used by tech, manufacturing, and services MNCs setting up India operations. Eligible for Section 115BAA (22% tax).",
  },
  {
    number: "05",
    title: "Foreign-Parent WOS in Restricted FDI Sector",
    subtitle: "Approval Route",
    text: "Foreign-parent WOS in sectors with FDI caps or government-approval-route (single-brand retail, multi-brand retail, banking 74%, insurance 74%, defence). Requires DPIIT / FIPB approval (approval route) or compliance with sectoral conditions (auto with caveats).",
  },
  {
    number: "06",
    title: "Foreign-Parent WOS for R&D / Captive Services",
    subtitle: "Captive / R&D",
    text: "Common structure for offshore captive centres serving the parent — IT, BPO, KPO, R&D. Eligible for Section 115BAA (22%). Transfer pricing under safe harbour rules (Rule 10TD). STPI / SEZ overlay possible for tax holiday in eligible cases.",
  },
];

const IncorporationPvtTypes = () => {
  return (
    <section className="incorp-types-section">
      <div className="incorp-types-container">

        <h2 className="incorp-types-title">Types of Wholly Owned Subsidiary in India</h2>

        <div className="incorp-types-cards">
          {types.map((type) => (
            <div className="incorp-types-card" key={type.number}>
              <div className="incorp-types-number">{type.number}</div>
              <h3 className="incorp-types-card-title">{type.title}</h3>
              <p className="incorp-types-card-text">{type.text}</p>
            </div>
          ))}
        </div>

      </div>
    </section>
  );
};

export default IncorporationPvtTypes;
