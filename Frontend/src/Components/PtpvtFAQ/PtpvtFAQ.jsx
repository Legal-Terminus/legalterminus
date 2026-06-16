import React, { useState } from "react";
import "./PtpvtFAQ.css";

const faqs = [
  {
    q: "Can a Partnership Firm be converted into a Private Limited Company?",
    a: "Yes. A Partnership Firm can be converted into a Private Limited Company under Section 366 of the Companies Act, 2013 through the URC-1 conversion process. The conversion is completed by filing Form URC-1, publishing Form URC-2 newspaper advertisement, and filing SPICe+ forms on the MCA portal. Both registered and unregistered partnership firms can apply, though registered firms usually face fewer procedural issues.",
  },
  {
    q: "What is the difference between fresh Pvt Ltd registration and Partnership to Pvt Ltd Conversion?",
    a: "Fresh incorporation is for starting a completely new company. Partnership to Private Limited Conversion is meant for an already existing business that wants to continue operations under a corporate structure. Conversion involves additional legal steps such as newspaper publication, partner consents, audited financial statements, creditor approvals, and business transition formalities.",
  },
  {
    q: "What is Form URC-1?",
    a: "Form URC-1 is the main application used for converting an existing business entity into a company under Section 366 of the Companies Act, 2013. It includes details of partners, assets, liabilities, creditors, financial statements, declarations, and the proposed company structure.",
  },
  {
    q: "Why is Form URC-2 newspaper publication mandatory?",
    a: "Form URC-2 is a public notice published in one English and one regional-language newspaper. It informs creditors and the public about the proposed conversion and allows them to raise objections within 21 days. This is a mandatory legal requirement before filing URC-1.",
  },
  {
    q: "Do all partners become shareholders in the Private Limited Company?",
    a: "Generally, yes. The partners of the firm become shareholders of the new company in proportion to their capital contribution or agreed shareholding structure. This helps maintain smooth continuity of ownership and business control.",
  },
  {
    q: "What happens to the Partnership Firm after conversion?",
    a: "Once the Certificate of Incorporation is issued, the Private Limited Company becomes the legal successor of the business. The old Partnership Firm is dissolved, and its assets, liabilities, contracts, and business operations are transferred to the company.",
  },
  {
    q: "Is Partnership Firm registration mandatory before conversion?",
    a: "Legally, both registered and unregistered firms can apply for conversion. However, a registered partnership firm usually gets smoother approval and fewer ROC queries. If your firm is not registered, we may recommend partnership registration first for a cleaner conversion process.",
  },
  {
    q: "How long does Partnership to Private Limited Conversion take?",
    a: "In most cases, the complete conversion process takes around 35 to 50 working days. The timeline depends on document readiness, newspaper publication, objection period, and ROC processing time.",
  },
  {
    q: "What documents are required for Partnership to Pvt Ltd Conversion?",
    a: "Commonly required documents include:\n• Partnership Deed\n• PAN and Aadhaar of partners\n• Address proof of business\n• Audited financial statements\n• List of creditors and liabilities\n• NOCs and partner consents\n• Passport-size photographs\n• Bank statement and utility bill",
  },
  {
    q: "What happens to GST, bank accounts, and licenses after conversion?",
    a: "The old Partnership Firm registrations are updated or migrated to the new Private Limited Company. This may include GST registration, bank account changes, FSSAI license, Trade License, MSME / Udyam, and other business registrations.",
  },
  {
    q: "Will the business name remain the same after conversion?",
    a: "Usually, yes. Subject to MCA name approval, the existing brand or business name can continue with 'Private Limited' added at the end.",
  },
  {
    q: "What are the benefits of converting into a Private Limited Company?",
    a: "Some major benefits include:\n• Limited liability protection\n• Separate legal identity\n• Better credibility with clients and investors\n• Easier fundraising and bank finance\n• Business continuity\n• Structured ownership and governance\n• Better scalability for future growth",
  },
  {
    q: "Can the converted company raise investment in future?",
    a: "Yes. A Private Limited Company is the preferred structure for investors, venture capital firms, and startup funding. It also allows issuance of shares, ESOPs, and structured investment agreements.",
  },
  {
    q: "Is there any tax benefit after conversion?",
    a: "Private Limited Companies may opt for concessional corporate tax rates under applicable provisions of the Income-tax Act, subject to eligibility and compliance requirements. Proper structuring during conversion is important for smooth tax treatment.",
  },
  {
    q: "How can Legal Terminus help with Partnership to Private Limited Conversion?",
    a: "Legal Terminus provides complete end-to-end support for Partnership to Private Limited Conversion — from eligibility review and document preparation to newspaper publication, URC-1 filing, SPICe+ incorporation, and post-conversion compliance support. Our team also assists with GST migration, bank account updates, business license transition, and overall compliance planning to ensure smooth business continuity after conversion.",
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
                <p style={{ whiteSpace: "pre-line" }}>{faq.a}</p>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default PtpvtFAQ;
