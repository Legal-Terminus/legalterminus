import React, { useState } from "react";
import "./LtopvtFAQ.css";

const faqs = [
  {
    q: "Can an LLP be converted into a Private Limited Company?",
    a: "Yes. An LLP can be registered as a Private Limited Company under Section 366 of the Companies Act, 2013 (Companies Authorised to Register) read with the Companies (Authorised to Register) Rules, 2014. Form URC-1 is filed along with SPICe+, and on approval the company is incorporated under Section 367 while the LLP is dissolved.",
  },
  {
    q: "How many partners are needed to convert an LLP into a Private Limited Company?",
    a: "A Private Limited Company requires a minimum of two shareholders and two directors. Since an LLP also has at least two partners, an LLP with two or more partners can convert directly — all partners become shareholders of the new company.",
  },
  {
    q: "What happens to the partners on conversion?",
    a: "All partners of the LLP become shareholders of the Private Limited Company. Their capital contribution is mapped into the share capital, and the cap table of the new company is built from the existing partner structure. Those who will manage the company are also appointed as directors.",
  },
  {
    q: "Why is the URC-2 newspaper advertisement required?",
    a: "Conversion under Section 366 requires a public notice in Form URC-2, published in one English and one vernacular newspaper, inviting objections to the conversion. This is a statutory safeguard so that creditors and the public can raise concerns before the company is registered.",
  },
  {
    q: "Is a No-Objection Certificate from the Registrar needed?",
    a: "Yes. A No-Objection Certificate from the Registrar where the LLP is registered must be obtained and filed with Form URC-1, along with the CA-certified statement of accounts, the latest LLP agreement, and the consent of creditors.",
  },
  {
    q: "Does the business continue without interruption after conversion?",
    a: "Yes. Through the Section 366 route the LLP's business, assets, and contracts carry into the new company and operations continue seamlessly. There is no need to wind up the LLP separately — it is dissolved automatically once the company is registered.",
  },
  {
    q: "What are the main benefits of converting an LLP to a Private Limited Company?",
    a: "A Private Limited Company can raise equity from angels, VCs, and PE funds, issue ESOPs to employees, and offer transferable shares — none of which an LLP can do. It also carries greater credibility with investors and large customers and can pursue Startup India recognition and concessional tax under Section 115BAA.",
  },
  {
    q: "How long does the LLP to Private Limited conversion take?",
    a: "Depending on document readiness, the newspaper advertisement window, and ROC processing, conversion typically takes around 25 to 40 working days. Pending LLP filings (Form 8 / Form 11) and creditor consents are the most common factors that affect the timeline.",
  },
  {
    q: "Will the company keep the same name and PAN as the LLP?",
    a: "The company can usually retain the LLP's name with 'Private Limited' added, subject to MCA approval through SPICe+. However, the new company receives a fresh CIN, PAN, and TAN — the LLP's LLPIN and PAN do not carry over, so GST and other registrations are updated to the new entity.",
  },
];

const LtopvtFAQ = () => {
  const [activeIndex, setActiveIndex] = useState(null);

  const toggle = (index) => {
    setActiveIndex(activeIndex === index ? null : index);
  };

  return (
    <section className="opcfaq-section" id="faq">
      <div className="opcfaq-container">
        <h2 className="opcfaq-title">LLP to Private Limited — FAQs</h2>
        <p className="opcfaq-subtitle">
          Everything you need to know about converting your LLP into a Private Limited Company
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

export default LtopvtFAQ;
