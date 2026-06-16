import React from "react";
import "./LtopvtBenefits.css";

const benefits = [
  {
    title: "VC + Angel Funding Eligibility",
    text: "VCs + angels DO NOT INVEST in LLPs — there's no instrument to invest into (LLPs cannot issue equity shares, preference shares, CCPS, or CCDs). Every term sheet you'll ever sign assumes a Pvt Ltd. If external funding is on the 12–24 month roadmap, Pvt Ltd is the prerequisite. Conversion is the FIRST GATE before the first round.",
  },
  {
    title: "Section 115BAA — 22% vs 30% LLP Tax",
    text: "LLPs are taxed at 30% flat (plus surcharge + cess) — no concessional rate available. Domestic Pvt Ltd companies can opt for a 22% effective tax rate under Section 115BAA via Form 10-IC. For profitable LLPs, the rate cut alone justifies conversion — on ₹1 crore profit, the tax saving is approx ₹8 lakh / year. Plus Section 115BAB (new manufacturing — 15% rate) where applicable.",
  },
  {
    title: "ESOPs + Sweat Equity Ready",
    text: "LLPs CANNOT issue ESOPs — Section 62(1)(b) of the Companies Act applies only to companies. Pvt Ltd unlocks the full employee-equity + capital-raising toolkit: ESOPs (Section 62), Sweat Equity (Section 54), preferential allotment (Section 62), private placement (Section 42), rights issue. Critical for retaining + attracting senior talent at scaling startups.",
  },
  {
    title: "Share Classes + Convertible Instruments",
    text: "LLPs have only ONE class of partners' interest — no preference, no CCD / CCPS / CCDS. Pvt Ltd allows multiple share classes: equity, preference (cumulative / non-cumulative / convertible / participating), differential voting rights, treasury shares. Investors demand convertibles + preference rights — LLPs simply cannot offer these.",
  },
  {
    title: "DPIIT Startup India + Section 80-IAC Tax Holiday",
    text: "Both LLP and Pvt Ltd are DPIIT-eligible — but Pvt Ltd is the format VCs + angels prefer for follow-on rounds. Section 80-IAC's 3-CONSECUTIVE-YEAR tax holiday + Section 56(2)(viib) angel-tax exemption are available to both — but Pvt Ltd gets the bigger ecosystem benefit. The Supreme tier files DPIIT recognition post-conversion.",
  },
  {
    title: "Brand Credibility + IPO / M&A Optionality",
    text: "Pvt Ltd is recognised globally as the corporate vehicle for serious businesses. Banks underwrite working capital + term loans more readily to a Pvt Ltd. Government tenders, PSU contracts, modern trade chains, and enterprise procurement routinely insist on Pvt Ltd at vendor due-diligence. Long-term: only a Pvt Ltd can convert to a Public Ltd for IPO listing on stock exchanges; LLPs cannot list.",
  },
];

const LtopvtBenefits = () => {
  return (
    <section className="opcben-section">
      <div className="opcben-container">
        <header className="opcben-header">
          <h2 className="opcben-title">
            Benefits of Converting LLP to a Pvt Ltd
          </h2>
          <p className="opcben-subtitle">
            Pvt Ltd is not just an 'incorporated LLP'. It's the structural upgrade that unlocks equity fundraising, ESOPs, share classes, and concessional tax. Here's what matters:
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

export default LtopvtBenefits;
