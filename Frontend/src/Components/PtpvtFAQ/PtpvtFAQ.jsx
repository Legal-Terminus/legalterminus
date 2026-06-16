import React, { useState } from "react";
import "./PtpvtFAQ.css";

const faqs = [
  {
    q: "Can a partnership firm be converted into a Private Limited Company?",
    a: "Yes. A partnership firm can be registered as a Private Limited Company under Section 366 of the Companies Act, 2013 (Companies Authorised to Register) read with the Companies (Authorised to Register) Rules, 2014. Form URC-1 is filed along with SPICe+, and on approval the company is incorporated under Section 367 while the firm's business continues under the company.",
  },
  {
    q: "Does the partnership firm need to be registered to convert?",
    a: "A registered firm makes the conversion smoother, as the No-Objection Certificate from the Registrar of Firms can be obtained cleanly. While the rules allow conversion, a registered partnership deed and registration certificate from the Registrar of Firms are strongly recommended and usually required for a hassle-free URC-1 filing.",
  },
  {
    q: "How many partners are needed to convert a firm into a Private Limited Company?",
    a: "A Private Limited Company requires a minimum of two shareholders and two directors. Since a partnership firm also has at least two partners, a firm with two or more partners can convert directly — all partners become shareholders of the new company.",
  },
  {
    q: "What happens to the partners on conversion?",
    a: "All partners of the firm become shareholders of the Private Limited Company. Their capital is mapped into the share capital, and the cap table of the new company is built from the existing partner structure. Those who will manage the company are also appointed as directors.",
  },
  {
    q: "Why is the URC-2 newspaper advertisement required?",
    a: "Conversion under Section 366 requires a public notice in Form URC-2, published in one English and one vernacular newspaper, inviting objections to the conversion. This is a statutory safeguard so that creditors and the public can raise concerns before the company is registered.",
  },
  {
    q: "What is the biggest advantage of converting from a partnership to a company?",
    a: "Limited liability. In a partnership, partners are personally liable for the firm's debts without limit. As a Private Limited Company, liability is capped at each shareholder's shareholding, so personal assets are protected. The company also becomes a separate legal entity with perpetual succession and the ability to raise equity.",
  },
  {
    q: "Does the business continue without interruption after conversion?",
    a: "Yes. Through the Section 366 route the firm's business, assets, and contracts carry into the new company and operations continue seamlessly. There is no need to wind up the firm separately — the same business carries on under the company once it is registered.",
  },
  {
    q: "How long does the partnership to Private Limited conversion take?",
    a: "Depending on document readiness, the newspaper advertisement window, and ROC processing, conversion typically takes around 25 to 40 working days. Firm registration status, creditor consents, and the CA-certified statement of accounts are the most common factors that affect the timeline.",
  },
  {
    q: "Will the company keep the same name and PAN as the firm?",
    a: "The company can usually retain the firm's name with 'Private Limited' added, subject to MCA approval through SPICe+. However, the new company receives a fresh CIN, PAN, and TAN — the firm's PAN does not carry over, so GST and other registrations are updated to the new entity.",
  },
];

const PtpvtFAQ = () => {
  const [activeIndex, setActiveIndex] = useState(null);

  const toggle = (index) => {
    setActiveIndex(activeIndex === index ? null : index);
  };

  return (
    <section className="opcfaq-section" id="faq">
      <div className="opcfaq-container">
        <h2 className="opcfaq-title">Partnership to Private Limited — FAQs</h2>
        <p className="opcfaq-subtitle">
          Everything you need to know about converting your partnership firm into a Private Limited Company
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

export default PtpvtFAQ;
