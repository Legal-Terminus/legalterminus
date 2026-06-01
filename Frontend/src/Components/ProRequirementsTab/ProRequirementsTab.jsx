import React from "react";
import "./ProRequirementsTab.css";

const RequirementsPvt = () => {
  return (
    <section className="req-section">
      <div className="req-container">
        <header className="req-header">
          <h2 className="req-title">
            Benefits of Proprietorship Firm Registration in India
          </h2>
          <p className="req-subtitle">
            Registering a sole proprietorship in India is a great option for small businesses and individual entrepreneurs. Here are the key benefits:
          </p>
        </header>

        <div className="req-grid">
          <article className="req-card">
            <h3 className="req-card-title">Cheapest, Fastest Setup</h3>
            <div className="req-card-underline" />
            <p className="req-card-text">
              ₹500 – ₹3,000 total cost (govt + professional). 2 – 5 working days. No MCA, no DSC, no DIN, no MOA, no AOA. The lowest-friction way to go from idea to invoice in India.
            </p>
          </article>

          <article className="req-card">
            <h3 className="req-card-title">Slab-Rate Income Tax</h3>
            <div className="req-card-underline" />
            <p className="req-card-text">
              Proprietorship income is taxed at the proprietor's individual slab rates — meaning the first ₹3 lakh is tax-free (new regime), and rates start at 5%. Compare to LLP / Pvt Ltd which start at 22%-30% flat from rupee one.
            </p>
          </article>

          <article className="req-card">
            <h3 className="req-card-title">Section 44AD / 44ADA Presumptive Tax</h3>
            <div className="req-card-underline" />
            <p className="req-card-text">
              Eligible proprietors can declare income on a presumptive basis — 6%/8% of turnover (44AD) or 50% of receipts (44ADA). No books, no audit, no detailed P&amp;L. Massive simplification for receipts ≤ ₹2cr (44AD) or ≤ ₹75L (44ADA).
            </p>
          </article>

          <article className="req-card">
            <h3 className="req-card-title">Total Ownership &amp; Control</h3>
            <div className="req-card-underline" />
            <p className="req-card-text">
              100% of the business, 100% of the profits, 100% of the decisions. No board, no shareholders, no co-founders to consult. Pivot, pause, or shut down in days — no resolutions needed, no MCA filings to wind up.
            </p>
          </article>

          <article className="req-card">
            <h3 className="req-card-title">Minimal Compliance Load</h3>
            <div className="req-card-underline" />
            <p className="req-card-text">
              No MCA filings. No DIR-3 KYC. No annual return. Just income tax (ITR-3 or ITR-4 presumptive) + GSTR if registered + Shop &amp; Est renewal. Compliance cost ~₹15K-₹40K annually vs ₹50K-₹1L for Pvt Ltd.
            </p>
          </article>

          <article className="req-card">
            <h3 className="req-card-title">Easy Conversion When Scale Demands</h3>
            <div className="req-card-underline" />
            <p className="req-card-text">
              Proprietorship → Pvt Ltd via Part IX (Companies Act). Proprietorship → LLP via fresh LLP incorporation + asset transfer. Proprietorship → OPC via fresh OPC incorporation. Conversion is straightforward when you outgrow the unlimited-liability constraint.
            </p>
          </article>
        </div>
      </div>
    </section>
  );
};

export default RequirementsPvt;
