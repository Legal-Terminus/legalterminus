import React, { useState } from "react";
import "./LtopvtFAQ.css";

const faqs = [
  {
    q: "Can an LLP be converted into a Private Limited Company?",
    a: "Yes. An LLP can be converted into a Private Limited Company under Part I of Chapter XXI (Sections 366–374) of the Companies Act, 2013 through the URC-1 process. Since the LLP Act, 2008 does not provide a direct LLP-to-company conversion route, this is the legally accepted method used across India.",
  },
  {
    q: "Why do businesses convert an LLP into a Private Limited Company?",
    a: "Most businesses convert when they want to raise investment, issue ESOPs, on-board investors, improve corporate credibility, or scale operations. Investors and venture capital firms generally prefer Private Limited Companies because they support equity shares, preference shares, and structured fundraising.",
  },
  {
    q: "Is my LLP required to be active before conversion?",
    a: "Yes. Your LLP must be active and compliant on the MCA portal. Annual filings like Form 8 and Form 11 should be up to date before starting the conversion process. Pending filings or non-compliance can delay or reject the application.",
  },
  {
    q: "What is Form URC-1?",
    a: "Form URC-1 is the main application used for converting an existing LLP into a company under Section 366 of the Companies Act, 2013. It includes details such as partner information, audited financial statements, creditor details, declarations, and incorporation documents.",
  },
  {
    q: "What is Form URC-2?",
    a: "Form URC-2 is the mandatory public notice published in newspapers before conversion. The notice is published in one English newspaper and one regional language newspaper, inviting objections from creditors or the public. A 21-day waiting period is compulsory before filing URC-1.",
  },
  {
    q: "How many directors and shareholders are required after conversion?",
    a: "A Private Limited Company must have at least:\n• 2 Directors\n• 2 Shareholders\n\nIn many cases, existing LLP partners become both the first shareholders and directors of the new company.",
  },
  {
    q: "What happens to the LLP's assets and liabilities after conversion?",
    a: "After conversion, all assets, liabilities, contracts, licenses, and business operations are transferred to the new Private Limited Company. The company becomes the legal successor of the LLP.",
  },
  {
    q: "Will the LLP automatically close after conversion?",
    a: "Yes. Once the Certificate of Incorporation is issued, the LLP is treated as dissolved under the Companies Act framework. However, certain procedural filings and intimation to the LLP Registrar may still be required for proper closure and record updates.",
  },
  {
    q: "What happens to the LLP partners' capital contribution?",
    a: "The capital contribution of LLP partners is usually converted into share capital of the new Private Limited Company in the agreed ratio. This helps maintain ownership continuity after conversion.",
  },
  {
    q: "How long does LLP to Pvt Ltd Company Conversion take?",
    a: "Normally, the complete process takes around 35–60 working days depending on:\n• LLP compliance status\n• Newspaper publication timeline\n• MCA approvals\n• Availability of partner and creditor documents",
  },
  {
    q: "What documents are generally required for conversion?",
    a: "Common documents include:\n• LLP Incorporation Certificate\n• LLP Agreement\n• PAN of LLP\n• Partner PAN & Aadhaar\n• Address proof\n• Audited financial statements\n• List of creditors with consent\n• NOC from partners\n• Registered office proof",
  },
  {
    q: "What happens to GST after conversion?",
    a: "The LLP's GST registration is usually surrendered after transfer of business, and a fresh GST registration is obtained in the name of the new Private Limited Company. Input Tax Credit transfer can also be planned properly during transition.",
  },
  {
    q: "Is there any tax benefit after conversion?",
    a: "Yes. Eligible domestic Private Limited Companies may opt for the concessional 22% corporate tax regime under Section 115BAA of the Income-tax Act, subject to conditions.",
  },
  {
    q: "Can the new company raise funding after conversion?",
    a: "Yes. A Private Limited Company is the preferred structure for:\n• Angel investment\n• Venture capital\n• ESOPs\n• Equity fundraising\n• Startup recognition\n\nThis is one of the biggest reasons businesses shift from an LLP to a Pvt Ltd structure.",
  },
  {
    q: "Can the company continue using the same brand name?",
    a: "Usually yes, subject to MCA name approval and trademark availability. Your business brand can continue while the legal structure changes from LLP to Private Limited Company.",
  },
  {
    q: "Do I need to transfer licenses and registrations after conversion?",
    a: "Yes. Registrations like:\n• GST\n• MSME / Udyam\n• FSSAI\n• Trade License\n• Shop & Establishment\n• Import Export Code (IEC)\n• Bank accounts\nmay need to be updated or migrated to the new company.",
  },
  {
    q: "Is a physical office inspection required?",
    a: "Generally, no physical inspection is required in normal cases. However, MCA or other departments may ask for additional verification or clarification if needed.",
  },
  {
    q: "Can an LLP with pending loans or creditors be converted?",
    a: "Yes, but creditor consent or NOC is generally required before conversion. Proper disclosure of liabilities is important to avoid future disputes.",
  },
  {
    q: "How can Legal Terminus help with LLP to Pvt Ltd Company Conversion?",
    a: "Legal Terminus manages the complete LLP to Pvt Ltd Company Conversion process from start to finish. Our team handles eligibility checks, pending LLP compliance review, drafting and publication of Form URC-2, preparation and filing of Form URC-1, SPICe+ incorporation filing, PAN/TAN application, GST and license migration support, and post-conversion compliance guidance. We also help with shareholder structuring, capital mapping, and business transition planning so your conversion is smooth, compliant, and investor-ready.",
  },
];

const LtopvtFAQ = () => {
  const [activeIndex, setActiveIndex] = useState(0);

  const toggle = (index) => {
    setActiveIndex((prev) => (prev === index ? -1 : index));
  };

  return (
    <section className="opcfaq-section" id="faq">
      <div className="opcfaq-container">

        <div className="opcfaq-header">
          <h2 className="opcfaq-title">LLP to Private Limited — FAQs</h2>
          <p className="opcfaq-intro">
            Everything you need to know about converting your LLP into a Private Limited Company
          </p>
        </div>

        <div className="opcfaq-list">
          {faqs.map((faq, index) => {
            const isActive = index === activeIndex;
            return (
              <div
                key={index}
                className={`opcfaq-item ${isActive ? "active" : ""}`}
              >
                <button
                  type="button"
                  className="opcfaq-question"
                  onClick={() => toggle(index)}
                  aria-expanded={isActive}
                >
                  <span>{faq.q}</span>
                  <span className={`opcfaq-icon ${isActive ? "open" : ""}`}>▾</span>
                </button>
                <div className={`opcfaq-answer ${isActive ? "open" : ""}`}>
                  <div className="opcfaq-answer-content" style={{ whiteSpace: "pre-line" }}>{faq.a}</div>
                </div>
              </div>
            );
          })}
        </div>

      </div>
    </section>
  );
};

export default LtopvtFAQ;
