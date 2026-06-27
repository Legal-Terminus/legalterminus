import React from "react";
import "./ItrIndFeatures.css";

const types = [
  {
    number: "01",
    title: "Salaried Junior Professional - Income up to Rs.5L",
    text: "You're early in your career - salary income up to Rs.5 lakh + bank interest. Under New Regime, NIL tax + you can claim TDS refund. ITR-1 (Sahaj) filing covers everything. Most affordable + fastest filing scenario.",
  },
  {
    number: "02",
    title: "Salaried Mid-Career - Income up to Rs.10L",
    text: "Your salary + bank interest + maybe one let-out rental property put you in the Rs.5-10L income bracket. Under New Regime still NIL tax (rebate covers up to Rs.12L). Under Old Regime ~Rs.1L tax. We optimise regime selection. ITR-1 filing.",
  },
  {
    number: "03",
    title: "Salaried Senior Professional - Income > Rs.10L",
    text: "Senior management or specialist earning above Rs.10 lakh annually. New Regime slabs (10%/15%/20%) kick in above Rs.10L. Old Regime 30% above Rs.10L. We optimise + advise on tax-saving strategies. ITR-1 if income up to Rs.50L; ITR-2 if above.",
  },
  {
    number: "04",
    title: "Stock Trader / Property Seller - Capital Gains",
    text: "You've sold stocks / mutual funds / property during the FY. STCG on equity = 20% (Section 111A); LTCG on equity above Rs.1.25 lakh = 12.5% (Section 112A); LTCG on property = 12.5% without indexation. ITR-2 mandatory. We compute gains + claim carry-forward losses (8 years).",
  },
  {
    number: "05",
    title: "Resident with Foreign Income - Dividends / Interest / Royalty",
    text: "You're a Resident Indian earning income from abroad - foreign dividends, interest from overseas bank accounts, royalties from foreign IP, salary for services outside India. Schedule FA disclosure mandatory + Form 67 for Foreign Tax Credit claim + Black Money Act compliance. ITR-2.",
  },
  {
    number: "06",
    title: "NRI / RNOR with India-Source Income + DTAA",
    text: "You're an NRI / RNOR earning India-source income (rental, capital gains, dividends, NRO interest) AND foreign income subject to DTAA. Residential status determination under Section 6. TRC facilitation. DTAA treaty application + Form 67 FTC. End-to-end multi-jurisdiction handling.",
  },
];

const ItrIndFeatures = () => {
  return (
    <section className="opc-features-section">
      <div className="opc-features-container">

        <h2 className="opc-features-title">Types of Individual Income Tax Returns in India</h2>

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

export default ItrIndFeatures;
