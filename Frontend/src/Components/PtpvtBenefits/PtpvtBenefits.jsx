import React from "react";
import "./PtpvtBenefits.css";

const benefits = [
  {
    title: "Investor-Ready Structure (VC + Angels)",
    text: "Every VC term sheet you'll ever sign assumes a Pvt Ltd. Share classes, preference rights, anti-dilution, drag-along, tag-along, board observer seats — all written into your AOA. Angels, family offices, and VCs DO NOT touch partnership firms but DO invest in a Pvt Ltd via convertible debentures, CCPS, or equity rounds. If you're aiming for external funding in 12–24 months, Pvt Ltd is the prerequisite.",
  },
  {
    title: "Section 115BAA — 22% vs 30% Partnership Tax",
    text: "Partnership Firms are taxed at 30% flat (plus surcharge + cess) — no concessional rate available. Domestic Pvt Ltd companies can opt for a 22% effective tax rate under Section 115BAA (vs 25.17% default for T/O up to ₹400 cr or 30% above). Filed via Form 10-IC. For profitable firms, the rate cut alone justifies conversion — on ₹1 crore profit, the tax saving is approx ₹8 lakh / year.",
  },
  {
    title: "Limited Liability + Joint-Several Relief",
    text: "In a Partnership Firm, EVERY PARTNER is JOINTLY + SEVERALLY liable for ALL the firm's debts + the acts of OTHER PARTNERS (Section 25 Partnership Act). One partner's mis-step can drain another's personal assets. In a Pvt Ltd, each shareholder's liability is LIMITED to their unpaid share capital. The Pvt Ltd contracts in its own name. Joint-several liability disappears.",
  },
  {
    title: "Perpetual Succession + Partner-Exit Resilience",
    text: "Partnership Firms RECONSTITUTE or DISSOLVE on any partner exit / death / insolvency (Sections 40–44 Partnership Act). Each partner change is a tax + legal event. A Pvt Ltd continues seamlessly — shareholders / directors can change without the company dissolving. Shareholder exits happen via share transfer + Section 56 procedures; the company itself is unaffected.",
  },
  {
    title: "ESOPs + Sweat Equity Ready",
    text: "Section 62(1)(b) of the Companies Act makes ESOPs cleanly issuable by a Pvt Ltd. Sweat equity (Section 54), preferential allotment (Section 62), private placement (Section 42), and rights issues are all available. Pvt Ltd unlocks the full employee-equity + capital-raising toolkit. Partnership firms cannot issue ESOPs.",
  },
  {
    title: "DPIIT Startup India + Section 80-IAC + Section 366 Continuity",
    text: "DPIIT Startup India recognition + Section 80-IAC's 3-CONSECUTIVE-YEAR tax holiday (any 3 out of the first 10 years) + Section 56(2)(viib) angel-tax exemption are available to Pvt Ltd (and Partnership Firms / LLPs). Conversion via URC-1 preserves statutory continuity — the Pvt Ltd inherits the firm's business via the Section 366 mechanism. Government tenders, PSU contracts, modern trade chains, and B2B onboarding routinely insist on Pvt Ltd at vendor due-diligence.",
  },
];

const PtpvtBenefits = () => {
  return (
    <section className="opcben-section">
      <div className="opcben-container">
        <header className="opcben-header">
          <h2 className="opcben-title">
            Benefits of Converting Partnership Firm to a Pvt Ltd
          </h2>
          <p className="opcben-subtitle">
            Pvt Ltd is not just an 'incorporated partnership'. It's the structural upgrade with material legal, financial, tax, and fundraising benefits. Here's what matters:
          </p>
        </header>

        <div className="opcben-grid">
          {benefits.map((benefit, i) => (
            <article className="opcben-card" key={i}>
              <h3 className="opcben-card-title">{benefit.title}</h3>
              <div className="opcben-card-underline" />
              <p className="opcben-card-text">{benefit.text}</p>
            </article>
          ))}
        </div>
      </div>
    </section>
  );
};

export default PtpvtBenefits;
