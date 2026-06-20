import React, { useState } from "react";
import "./PubpvtFAQ.css";

const faqs = [
  {
    q: "Can a Public Limited Company be converted into a Private Limited Company?",
    a: "Yes. Under Section 14 read with Section 18 of the Companies Act, 2013, a Public Limited Company can be converted into a Private Limited Company by passing a special resolution, altering its MOA and AOA, and obtaining the approval of the Regional Director. It is a conversion of the same entity — not a fresh incorporation.",
  },
  {
    q: "Is Regional Director (RD) approval required for the conversion?",
    a: "Yes. Since the relevant power rests with the Central Government, the conversion of a public company into a private company requires approval of the Regional Director on Form RD-1. The special resolution alone does not complete the conversion — the RD's order is mandatory.",
  },
  {
    q: "How many members and directors are needed after conversion?",
    a: "A Private Limited Company needs a minimum of 2 members and 2 directors, with a maximum of 200 members. If your Public Limited Company has more directors or a wide member base, the structure is rationalised to fit the private-company requirements as part of the conversion.",
  },
  {
    q: "Which forms are filed for the conversion?",
    a: "The key filings are: MGT-14 (to record the special resolution, within 30 days), RD-1 (application to the Regional Director), INC-25A (newspaper advertisement / public notice), and INC-28 (to file the RD's approval order with the ROC). The ROC then issues a fresh Certificate of Incorporation.",
  },
  {
    q: "What changes in the MOA and AOA on conversion?",
    a: "The articles are altered to add the three defining features of a private company under Section 2(68) — a cap of 200 members, a restriction on the transfer of shares, and a prohibition on inviting the public to subscribe. The MOA name clause is altered to add the word 'Private'.",
  },
  {
    q: "Why is a newspaper advertisement and creditor notice required?",
    a: "The conversion process requires a public notice in Form INC-25A in an English and a vernacular newspaper, and individual intimation to creditors, the ROC, and the Regional Director, inviting objections. This protects creditors and stakeholders before the RD approves the conversion.",
  },
  {
    q: "Does the company get a new name and CIN?",
    a: "Yes. On conversion the word 'Private' is added, so the name ends with 'Private Limited'. The ROC issues a fresh Certificate of Incorporation and the CIN is updated. PAN, GST, bank, and licence records must then be updated to the new name.",
  },
  {
    q: "How long does the Public to Private conversion take?",
    a: "Because it involves Regional Director approval and an objection window, conversion typically takes around 45 to 75 working days, depending on the RD's processing, document readiness, and whether any objections are raised by creditors or regulators.",
  },
  {
    q: "Does the business continue without interruption after conversion?",
    a: "Yes. Conversion does not create a new company — the same legal entity continues with its history, PAN, contracts, assets, and liabilities intact. Only the structure, articles, and name change, so operations carry on seamlessly.",
  },
];

const PubpvtFAQ = () => {
  const [activeIndex, setActiveIndex] = useState(null);

  const toggle = (index) => {
    setActiveIndex(activeIndex === index ? null : index);
  };

  return (
    <section className="opcfaq-section" id="faq">
      <div className="opcfaq-container">
        <h2 className="opcfaq-title">Public Limited to Private Limited — FAQs</h2>
        <p className="opcfaq-subtitle">
          Everything you need to know about converting your Public Limited Company into a Private Limited Company
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

export default PubpvtFAQ;
