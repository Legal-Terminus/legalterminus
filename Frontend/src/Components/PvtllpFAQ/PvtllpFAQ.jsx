import React, { useState } from "react";
import "./PvtllpFAQ.css";

const faqs = [
  {
    q: "Can a Private Limited Company be converted into an LLP?",
    a: "Yes. A Private Limited Company can be converted into an LLP under Section 56 and the Third Schedule of the LLP Act, 2008. The conversion is done by filing Form 18 (the conversion application and statement) together with FiLLiP for incorporation. After approval, Form 14 intimation is filed with the Registrar of Companies and the LLP agreement is filed in Form 3.",
  },
  {
    q: "Why do companies convert from Private Limited to LLP?",
    a: "Mainly to cut compliance and cost. An LLP has no mandatory annual audit until turnover crosses ₹40 lakh or contribution ₹25 lakh, files only Form 8 and Form 11 each year, has no board-meeting formalities, and attracts no dividend distribution tax. For a profitable, owner-run business with no plans to raise equity, an LLP is a lighter, cheaper structure with the same limited liability.",
  },
  {
    q: "What are the key conditions for the conversion?",
    a: "There must be no security interest (charge) subsisting on the company's assets at the time of application, all annual ROC filings and income-tax returns must be up to date, all shareholders of the company must become partners of the LLP (and no one else), and the consent of all shareholders and secured creditors must be obtained.",
  },
  {
    q: "What happens to the shareholders on conversion?",
    a: "All shareholders of the company become partners of the LLP, with their shareholding mapped into capital contribution. No outside person can be added as a partner during the conversion. The LLP must have at least two designated partners holding a DPIN.",
  },
  {
    q: "Can a company with a loan or charge convert to an LLP?",
    a: "Not until the charge is cleared. The Third Schedule requires that no security interest subsists on the company's assets at the time of application. Any secured loan or charge must first be satisfied (and recorded via Form CHG-4), or a No-Objection Certificate obtained from the charge-holder, before Form 18 can be filed.",
  },
  {
    q: "Is the conversion taxable?",
    a: "The conversion is tax-neutral only if the conditions under Section 47(xiiib) of the Income-tax Act are satisfied — these include limits on turnover in the preceding years, continuity of the shareholders' profit-sharing for a set period, and conditions on assets and accumulated profits. If these are not met, capital-gains tax may apply, so we review eligibility before filing.",
  },
  {
    q: "Does the business continue without interruption after conversion?",
    a: "Yes. On conversion, all the assets, liabilities, contracts, and licences of the company vest in the LLP by operation of law, and the business continues seamlessly. The company is deemed dissolved once Form 14 intimation is filed with the Registrar of Companies.",
  },
  {
    q: "How long does the Private Limited to LLP conversion take?",
    a: "Depending on document readiness, charge clearance, and ROC processing, conversion typically takes around 25 to 40 working days. Pending ROC or income-tax filings and any subsisting charges are the most common factors that affect the timeline.",
  },
  {
    q: "Will the LLP keep the same name and PAN as the company?",
    a: "The LLP can usually retain the company's name with 'LLP' added, subject to MCA approval. However, the LLP receives a fresh LLPIN, PAN, and TAN — the company's CIN and PAN do not carry over, so GST and other registrations are updated to the new LLP.",
  },
];

const PvtllpFAQ = () => {
  const [activeIndex, setActiveIndex] = useState(null);

  const toggle = (index) => {
    setActiveIndex(activeIndex === index ? null : index);
  };

  return (
    <section className="opcfaq-section" id="faq">
      <div className="opcfaq-container">
        <h2 className="opcfaq-title">Private Limited to LLP — FAQs</h2>
        <p className="opcfaq-subtitle">
          Everything you need to know about converting your Private Limited Company into an LLP
        </p>

        <div className="opcfaq-list">
          {faqs.map((faq, index) => (
            <div
              className={`opcfaq-item ${activeIndex === index ? "active" : ""}`}
              key={index}
            >
              <button
                className="opcfaq-question"
                onClick={() => toggle(index)}
                aria-expanded={activeIndex === index}
              >
                <span>{faq.q}</span>
                <span className="opcfaq-icon">{activeIndex === index ? "−" : "+"}</span>
              </button>
              <div className="opcfaq-answer">
                <p>{faq.a}</p>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default PvtllpFAQ;
