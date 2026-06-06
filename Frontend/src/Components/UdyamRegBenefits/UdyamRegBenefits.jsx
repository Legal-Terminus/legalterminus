import React from "react";
import "./UdyamRegBenefits.css";

const benefits = [
  {
    num: "01",
    title: "Section 43B(h) — 45-Day Payment Protection",
    desc: "Your B2B customers MUST pay you within 45 days of invoice (or earlier as agreed). Failure = they cannot claim the expense as a deduction in their income tax. Effective FY 2023-24, this rule alone has shifted SME-side cashflow significantly. Only Udyam-registered businesses get this protection.",
  },
  {
    num: "02",
    title: "CGTMSE — Collateral-Free Loans up to Rs.5 cr",
    desc: "Credit Guarantee Fund Trust covers up to 85% of your loan from participating banks. You don't need to pledge property. Processing fee 1–1.5%, guarantee fee 0.75–1.5% annual. Massive working-capital unlock for businesses with limited collateral.",
  },
  {
    num: "03",
    title: "Government Tender Preference",
    desc: "Exemption from Earnest Money Deposit (EMD) on most government tenders. Reservation: 25% of central government procurement is reserved for MSMEs (with a sub-quota of 4% for SC/ST and 3% for women-led MSMEs). GeM marketplace access. Real revenue, not just paperwork.",
  },
  {
    num: "04",
    title: "Subsidies & Reimbursements",
    desc: "Patent registration: 50% subsidy up to Rs.1L. Trademark registration: 50% subsidy. ISO 9001 / 14001 / 22000: reimbursement up to Rs.75K. Bar coding, Energy audit, Lean Manufacturing — all subsidy-eligible. Subsidy claims via the MSME Office in your state.",
  },
  {
    num: "05",
    title: "Priority Sector Lending + Lower Interest",
    desc: "Banks must lend a fixed % of their portfolio to priority sectors, including MSMEs. This means your loan applications get faster turnaround, lower interest rates (typically 1–2% below regular SME rates), and softer collateral terms. Mudra loans up to Rs.10L (Tarun) / Rs.20L (Tarun Plus) explicitly target MSMEs.",
  },
  {
    num: "06",
    title: "Lifetime Validity, No Renewal",
    desc: "Udyam Registration has lifetime validity once issued. No annual renewal, no fees, no compliance. Classification (Micro / Small / Medium) auto-updates each year based on your ITR + GSTR data. Set it once, forget the renewal calendar.",
  },
];

const UdyamRegBenefits = () => {
  return (
    <section className="req-section">
      <div className="req-container">
        <header className="req-header">
          <h2 className="req-title">Benefits of Udyam / MSMEs Registration</h2>
          <p className="req-subtitle">
            Udyam isn't a vanity certificate — it's a key that unlocks specific, rupee-quantifiable benefits. Here's what genuinely matters once you're past Day 1:
          </p>
        </header>

        <div className="req-grid">
          {benefits.map((item, index) => (
            <article className="req-card" key={index}>
              <h3 className="req-card-title">{item.title}</h3>
              <div className="req-card-underline" />
              <p className="req-card-text">{item.desc}</p>
            </article>
          ))}
        </div>
      </div>
    </section>
  );
};

export default UdyamRegBenefits;
