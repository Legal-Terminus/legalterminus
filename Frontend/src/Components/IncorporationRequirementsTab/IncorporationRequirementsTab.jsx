import React from "react";
import "./IncorporationRequirementsTab.css";

const benefits = [
  {
    title: "100% Parent Control",
    text: "The parent owns 100% of the WOS economically — every share, every vote, every dividend. The 1-share nominee in a Pvt Ltd is a structural formality (held under Section 187 declaration of nominee shareholding). Strategic decisions, board composition, exit — all sit with the parent.",
  },
  {
    title: "Limited Liability for Parent",
    text: "The parent's liability is limited to its investment in the WOS. Creditors of the WOS cannot pierce the corporate veil to chase the parent's other assets, except in narrow fraud / undercapitalisation cases. Critical for ring-fencing high-risk verticals or new market bets.",
  },
  {
    title: "Section 115BAA — 22% Concessional Tax",
    text: "Domestic WOS Pvt Ltd companies (Indian-parent or foreign-parent) can opt for 22% tax under Section 115BAA. Effective rate ~25.17% with surcharge + cess. New manufacturing companies can qualify for Section 115BAB (15%). Massive long-term tax saving — same rate as standalone Pvt Ltd.",
  },
  {
    title: "Clean Group Structure & Consolidation",
    text: "Indian-parent groups get a clean Section 129 consolidation perimeter — financials roll up cleanly to the holding company. Foreign-parent MNCs get a single-entity Indian P&L for global consolidation. Either way, the WOS is the cleanest balance-sheet vehicle for sub-aggregation.",
  },
  {
    title: "Easy Capital Injection",
    text: "Indian-parent: capital injected via fresh share allotment + Form PAS-3 filing. Foreign-parent: inward remittance via AD-Bank + share allotment + FC-GPR. Both routes are well-established and predictable. No public markets, no investor approvals, no valuation disputes — the parent decides.",
  },
  {
    title: "Strategic Optionality (Sale, Spin-off, IPO)",
    text: "Because WOS is a separate legal entity with clean ownership, it's straightforward to sell (share-sale exit), spin-off (transfer to another group entity), or IPO (convert to Public Ltd). Group restructuring is dramatically harder if the same business sits as a 'division' inside a parent.",
  },
];

const IncorporationRequirementsTab = () => {
  return (
    <section className="incorp-req-section">
      <div className="incorp-req-container">

        {/* ================= HEADER ================= */}
        <header className="incorp-req-header">
          <h2 className="incorp-req-title">
            Benefits of Incorporation Of Wholly Owned Subsidiary in India
          </h2>
          <p className="incorp-req-subtitle">
            WOS isn't just a structural choice — it's a strategic instrument. Whether your parent is Indian or foreign, here's what genuinely matters once you're past Day 1:
          </p>
        </header>

        {/* ================= CARDS ================= */}
        <div className="incorp-req-grid">
          {benefits.map((benefit, i) => (
            <article className="incorp-req-card" key={i}>
              <h3 className="incorp-req-card-title">{benefit.title}</h3>
              <div className="incorp-req-card-underline" />
              <p className="incorp-req-card-text">{benefit.text}</p>
            </article>
          ))}
        </div>

      </div>
    </section>
  );
};

export default IncorporationRequirementsTab;
