import React, { useState } from "react";
import "./PtoopcFAQ.css";

const faqs = [
  {
    question: "Q. What is Proprietorship Firm to OPC Conversion?",
    answer:
      "Proprietorship Firm to OPC Conversion is the process of converting an existing sole proprietorship business into a One Person Company (OPC) under the Companies Act, 2013. This helps the business owner get limited liability protection, a separate legal identity, better credibility, and improved business continuity while still retaining 100% ownership.",
  },
  {
    question: "Q. How is OPC conversion different from fresh OPC registration?",
    answer:
      "A fresh OPC registration is for starting a completely new business. A Proprietorship to OPC Conversion is done when an already running proprietorship business is shifted into an OPC structure. The conversion process involves additional legal steps such as newspaper publication, creditor consent, business continuity documentation, and MCA approval.",
  },
  {
    question: "Q. What is Form URC-1?",
    answer:
      "Form URC-1 is the main MCA application form used for converting an existing proprietorship business into a company under Section 366 of the Companies Act, 2013. It includes details such as business information, financial statements, creditor details, declarations, and supporting documents.",
  },
  {
    question: "Q. Why is newspaper publication required during conversion?",
    answer:
      "Before conversion, a public notice is published in newspapers to invite objections, if any, from creditors or the public. This is a mandatory legal requirement under the conversion process and helps ensure transparency.",
  },
  {
    question: "Q. How long does Proprietorship to OPC Conversion take?",
    answer:
      "In most cases, the complete conversion process takes around 35 to 50 working days, depending on document readiness, newspaper publication timeline, MCA processing, and approval stages.",
  },
  {
    question: "Q. What is included in your pricing?",
    answer:
      "Our professional fee covers consultation, eligibility review, drafting and filing of MCA forms, newspaper publication coordination, document preparation, and incorporation support. Government fees, stamp duty, DSC charges, and newspaper advertisement charges are billed separately at actuals.",
  },
  {
    question: "Q. Why is OPC conversion costlier than fresh OPC registration?",
    answer:
      "Conversion involves additional legal and compliance work such as: Newspaper publication, Creditor consent handling, Financial statement preparation, URC-1 documentation, Business migration support. This makes the process more detailed than a normal OPC incorporation.",
  },
  {
    question: "Q. Who is eligible for Proprietorship to OPC Conversion?",
    answer:
      "An Indian citizen who runs a proprietorship business and satisfies the OPC eligibility conditions under the Companies Act can apply for conversion. The applicant should not already own another OPC and must meet the applicable residency requirements.",
  },
  {
    question: "Q. Is nominee appointment mandatory in an OPC?",
    answer:
      "Yes. Every OPC must appoint one nominee who will take over the company in case of death or incapacity of the owner. The nominee's consent is filed with MCA during incorporation.",
  },
  {
    question: "Q. What happens to my GST registration after conversion?",
    answer:
      "Since the OPC gets a new PAN, a fresh GST registration is usually required in the name of the OPC. Existing GST-related credits and business transitions can also be handled properly during the migration process.",
  },
  {
    question: "Q. Can I transfer my business assets and liabilities to the OPC?",
    answer:
      "Yes. Business assets, liabilities, licenses, contracts, and operational activities can be transferred to the OPC as part of the conversion process, subject to proper documentation and compliance requirements.",
  },
  {
    question: "Q. Will my existing business name remain the same?",
    answer:
      "In most cases, yes — subject to MCA name approval rules. The legal name will include the suffix \"(OPC) Private Limited\", while your brand or trade name can generally continue as before.",
  },
  {
    question: "Q. Can I transfer my trademark to the OPC?",
    answer:
      "Yes. If the trademark is currently owned by the proprietor personally, it can be legally assigned to the OPC through the trademark assignment process.",
  },
  {
    question: "Q. Are there tax benefits in converting to an OPC?",
    answer:
      "An OPC provides better business structuring and separation between personal and business finances. In certain cases, tax exemptions may also be available during business transfer, subject to conditions under the Income Tax Act. Specific tax advice depends on the nature of the business and assets involved.",
  },
  {
    question: "Q. What documents are required for Proprietorship to OPC Conversion?",
    answer:
      "Common documents include: PAN & Aadhaar of proprietor, Business address proof, Bank statement, Proprietorship proof (GST, MSME, Shop License, etc.), Financial statements, Creditor details (if applicable), Passport-size photographs, Utility bill of registered office. Additional documents may be required depending on the business activity.",
  },
  {
    question: "Q. What are the benefits of converting into an OPC?",
    answer:
      "Major benefits include: Limited liability protection, Separate legal identity, Better business credibility, Easier banking and funding opportunities, Perpetual succession, Structured compliance framework, Improved brand image for clients and vendors.",
  },
  {
    question: "Q. How can Legal Terminus help with Proprietorship Firm to OPC Conversion?",
    answer:
      "Legal Terminus provides complete support for Proprietorship Firm to OPC Conversion across India. Our team handles eligibility assessment, MCA filings, newspaper publication, URC-1 documentation, nominee compliance, and incorporation support from start to finish. We also assist with GST migration, bank account transition, business license updates, and post-incorporation compliance guidance — helping business owners smoothly move from a proprietorship structure to a legally recognised corporate entity.",
  },
];

const PtoopcFAQ = () => {
  const [activeIndex, setActiveIndex] = useState(0);

  const toggleFaq = (index) => {
    setActiveIndex((prev) => (prev === index ? -1 : index));
  };

  return (
    <section className="opcfaq-section" id="faq">
      <div className="opcfaq-container">

        <div className="opcfaq-header">
          <h2 className="opcfaq-title">Proprietorship to OPC — FAQs</h2>
          <p className="opcfaq-intro">
            Got questions? We've got answers — straight, no-BS, legally accurate.
          </p>
        </div>

        <div className="opcfaq-list">
          {faqs.map((item, index) => {
            const isActive = index === activeIndex;
            return (
              <div
                key={index}
                className={`opcfaq-item ${isActive ? "active" : ""}`}
              >
                <button
                  type="button"
                  className="opcfaq-question"
                  onClick={() => toggleFaq(index)}
                >
                  <span>{item.question}</span>
                  <span className={`opcfaq-icon ${isActive ? "open" : ""}`}>▾</span>
                </button>
                <div className={`opcfaq-answer ${isActive ? "open" : ""}`}>
                  <div className="opcfaq-answer-content">{item.answer}</div>
                </div>
              </div>
            );
          })}
        </div>

      </div>
    </section>
  );
};

export default PtoopcFAQ;
