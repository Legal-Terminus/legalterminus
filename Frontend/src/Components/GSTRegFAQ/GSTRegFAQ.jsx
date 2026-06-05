import React, { useState } from "react";
import "./GSTRegFAQ.css";

const faqs = [
  {
    question: "Is GST registration really free? Why am I paying you?",
    answer: "The government fee is genuinely ₹0 — that's verified under Rule 8 of the CGST Rules. What you pay us is for advisory (Regular vs Composition, multi-state vs ISD), document drafting, error-free portal filing, and post-registration support. The DIY route is technically possible but the average application gets a REG-03 query — and a wrongly-classified scheme costs you years of penalty exposure.",
  },
  {
    question: "What's the turnover threshold for mandatory GST registration in 2026?",
    answer: (
      <span>
        ₹40 lakhs aggregate annual turnover for businesses dealing in goods (in normal category states).<br /><br />
        ₹20 lakhs for service providers in normal category states, and for both goods + services in special category states (Mizoram, Tripura, Manipur, Nagaland).<br /><br />
        Section 24 of the CGST Act overrides these thresholds for inter-state suppliers, e-commerce operators, casual / non-resident taxable persons, and reverse-charge liable entities — they must register from day one.
      </span>
    ),
  },
  {
    question: "How long does GST registration actually take in 2026?",
    answer: "Officially, 3–7 working days from ARN generation under Rule 9. With clean documentation and Aadhaar e-KYC done first time, our average turnaround is 5 working days. If physical verification is triggered (rare since 2024 reforms), expect 21–30 days.",
  },
  {
    question: "What's the penalty if I don't register when I should have?",
    answer: "Under Section 122 of the CGST Act, the penalty is 10% of the tax due or ₹10,000 — whichever is higher. If the non-registration is treated as deliberate evasion, the penalty climbs to 100% of the tax due, plus interest at 18% p.a. on the unpaid tax. Add prosecution risk under Section 132 for amounts above ₹2 crore.",
  },
  {
    question: "Should I opt for Composition Scheme or Regular?",
    answer: "Depends on three things: your turnover (Composition cap is ₹1.5 cr), your customer mix (B2C-heavy = Composition friendly; B2B = Regular wins because clients want ITC), and your input tax footprint (high inputs = Regular saves more via ITC). We help you choose the right option based on your business model.",
  },
  {
    question: "Can I register under GST voluntarily if I'm below the threshold?",
    answer: "Yes. Even if your turnover is below the threshold, you can opt for voluntary registration. Voluntary registration unlocks ITC on inputs, makes you eligible for B2B contracts and marketplace listings, and costs nothing extra in compliance compared to mandatory registration. The catch: once registered, you're locked into the same monthly / quarterly filing rhythm as everyone else.",
  },
  {
    question: "What's changed for GST registration in 2026 specifically?",
    answer: (
      <span>
        Five things: (1) Aadhaar e-KYC is now non-negotiable, (2) bank account validation must be completed within 30 days of registration to avoid suspension, (3) ISD registration is mandatory since 1 April 2025 if you have multiple GSTINs receiving common input services, (4) e-invoice IRN must be generated within 30 days of invoice date for taxpayers with AATO ≥ ₹10 cr, and (5) returns older than 3 years are now time-barred from filing.
      </span>
    ),
  },
  {
    question: "Do I need a separate GSTIN for each state I operate in?",
    answer: "Yes. GST is a state-level registration — one GSTIN per state where you have a business presence (office, warehouse, branch). Same PAN, different GSTINs.",
  },
  {
    question: "What is an HSN code and why does the GST officer care?",
    answer: "HSN (Harmonised System of Nomenclature) is the international product classification code that determines your GST rate. Pick the wrong HSN and you'll either over-charge (lose customers) or under-charge (Section 122 penalty + interest on the differential). At LT, our experts vet your HSN mapping against the latest CBIC rate notifications before filing.",
  },
  {
    question: "How can Legal Terminus help me with GST registration?",
    answer: "We handle the complete GST registration process — from consultation to final approval. Our team ensures accurate filing, minimizes chances of rejection, and provides end-to-end support until your GSTIN is issued.",
  },
];

const GSTRegFAQ = () => {
  const [activeIndex, setActiveIndex] = useState(0);

  const toggleFaq = (index) => {
    setActiveIndex((prev) => (prev === index ? -1 : index));
  };

  return (
    <section className="faq-section">
      <div className="faq-container">

        <div className="faq-header">
          <h2 className="faq-title">GST Registration — FAQs</h2>
          <p className="faq-intro">
            Common questions about GST registration eligibility, documents, timelines, and compliance — answered honestly.
          </p>
        </div>

        <div className="faq-list">
          {faqs.map((item, index) => {
            const isActive = index === activeIndex;
            return (
              <div key={index} className={`faq-item ${isActive ? "active" : ""}`}>
                <button
                  type="button"
                  className="faq-question"
                  onClick={() => toggleFaq(index)}
                >
                  <span>{item.question}</span>
                  <span className={`faq-icon ${isActive ? "open" : ""}`}>▾</span>
                </button>
                <div className={`faq-answer ${isActive ? "open" : ""}`}>
                  <div className="faq-answer-content">{item.answer}</div>
                </div>
              </div>
            );
          })}
        </div>

      </div>
    </section>
  );
};

export default GSTRegFAQ;
