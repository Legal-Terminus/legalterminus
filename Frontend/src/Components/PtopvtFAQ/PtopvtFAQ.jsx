import React, { useState } from "react";
import "./PtopvtFAQ.css";

const faqs = [
  {
    question: "What is Proprietorship to Private Limited Conversion?",
    answer:
      "Proprietorship to Private Limited Conversion is the process of converting an existing sole proprietorship business into a Private Limited Company under the Companies Act, 2013. This helps the business get a separate legal identity, limited liability protection, better business credibility, and easier access to funding and investment opportunities.",
  },
  {
    question: "How is Proprietorship to Private Limited Conversion different from fresh Pvt Ltd registration?",
    answer:
      "Fresh Private Limited registration is for starting a completely new company. Proprietorship to Private Limited Conversion is used when an existing business wants to continue operations under a Private Limited Company structure.\n\nThe conversion process is more detailed because it involves:\n• Transfer of the existing business\n• Creditor and member consents\n• Newspaper publication\n• Financial documents\n• Statutory filings under Section 366 of the Companies Act",
  },
  {
    question: "What is Form URC-1?",
    answer:
      "Form URC-1 is the main application filed with the MCA for converting an existing proprietorship into a company under Section 366 of the Companies Act, 2013.\n\nIt includes:\n• Audited financial statements\n• List of creditors\n• Consent documents\n• Declaration of solvency\n• Proposed MOA & AOA\n• Other statutory declarations",
  },
  {
    question: "What is Form URC-2 and why is it important?",
    answer:
      "Form URC-2 is the mandatory public notice published in newspapers before conversion.\n\nThe notice must be published in:\n• One English newspaper, and\n• One regional language newspaper\n\nA 21-day objection period is provided for creditors or the public before filing the final conversion application.",
  },
  {
    question: "Why do I need 2 directors and 2 shareholders for a Private Limited Company?",
    answer:
      "As per the Companies Act, 2013, a Private Limited Company must have:\n• Minimum 2 Directors, and\n• Minimum 2 Shareholders\n\nThe second shareholder can hold a very small percentage of shares while the founder retains operational control. One person can be the Director as well as Shareholder of the company.",
  },
  {
    question: "How long does Proprietorship to Private Limited Conversion take?",
    answer:
      "In most cases, the complete conversion process takes around 35–50 working days, depending on:\n• Document readiness\n• Newspaper publication timeline\n• ROC approval\n• Government processing speed",
  },
  {
    question: "What documents are required for conversion?",
    answer:
      "Common documents include:\n• PAN & Aadhaar of directors / shareholders\n• Address proof\n• Proprietorship business proof\n• GST certificate\n• Bank statement\n• Audited financial statements\n• NOC from creditors\n• Utility bill of registered office\n• Passport-size photographs\n\nAdditional documents may be required based on the business activity.",
  },
  {
    question: "What happens to my GST registration after conversion?",
    answer:
      "The proprietorship GST registration is usually cancelled after business transfer, and a new GST registration is obtained in the name of the Private Limited Company. Input Tax Credit (ITC) can also be transferred properly during the transition process.",
  },
  {
    question: "Can I keep the same business name after conversion?",
    answer:
      "Yes, in most cases the brand or business name can continue, subject to MCA name approval guidelines. The legal suffix 'Private Limited' will be added to the company name.\n\nExample: ABC Traders → ABC Traders Private Limited",
  },
  {
    question: "Can I transfer my trademark, licenses, and contracts to the new company?",
    answer:
      "Yes. Existing trademark, GST, FSSAI, Trade License, Shop & Establishment License, vendor agreements, and customer contracts can be transferred or updated in the name of the Private Limited Company.",
  },
  {
    question: "What are the benefits of converting into a Private Limited Company?",
    answer:
      "Major benefits include:\n• Limited liability protection\n• Separate legal identity\n• Better brand credibility\n• Easier bank funding\n• Startup India eligibility\n• Investor readiness\n• ESOP and equity structure\n• Better tax planning opportunities\n• Business continuity and succession",
  },
  {
    question: "Is statutory audit mandatory after conversion?",
    answer:
      "Yes. Every Private Limited Company must conduct a statutory audit every financial year, regardless of turnover. Annual ROC filings are also mandatory.",
  },
  {
    question: "Can a Private Limited Company raise investment?",
    answer:
      "Yes. A Private Limited Company is the preferred structure for angel investment, venture capital, startup funding, ESOPs, and equity participation. Most investors prefer investing only in Private Limited Companies.",
  },
  {
    question: "What is Section 115BAA?",
    answer:
      "Section 115BAA of the Income Tax Act allows eligible domestic companies to opt for a concessional corporate tax rate of 22%, subject to certain conditions. This benefit is available only to companies and not to proprietorship firms.",
  },
  {
    question: "Can I convert my proprietorship if I have loans or creditors?",
    answer:
      "Yes, but creditor consent or NOC may be required during the conversion process. Proper disclosure of liabilities is mandatory while filing URC-1.",
  },
  {
    question: "Is there any tax exemption available during conversion?",
    answer:
      "Yes, certain conditions under Section 47(xiv) of the Income Tax Act may help avoid capital gains tax during business transfer, provided the conversion is structured correctly.",
  },
  {
    question: "What happens to the existing bank account?",
    answer:
      "A new current account is opened in the name of the Private Limited Company. Existing business balances, assets, and operations are then shifted to the company structure.",
  },
  {
    question: "Can I convert my proprietorship into OPC instead of Pvt Ltd?",
    answer:
      "Yes. If you want complete ownership and do not plan external investment immediately, an OPC may be suitable.\n\nIf you plan startup funding, co-founders, ESOPs, or future investors, then a Private Limited Company is generally the better structure.",
  },
  {
    question: "How can Legal Terminus help with Proprietorship to Private Limited Conversion?",
    answer:
      "Legal Terminus provides complete end-to-end support for Proprietorship to Private Limited Conversion, including eligibility review, URC-1 and URC-2 filing, newspaper publication, documentation, MCA filing, DSC support, incorporation, GST transition, bank account assistance, license migration, and post-incorporation compliance support. Our team ensures the conversion is handled professionally with proper legal documentation and smooth business continuity.",
  },
];

const PtopvtFAQ = () => {
  const [activeIndex, setActiveIndex] = useState(0);

  const toggleFaq = (index) => {
    setActiveIndex((prev) => (prev === index ? -1 : index));
  };

  return (
    <section className="opcfaq-section">
      <div className="opcfaq-container">

        <div className="opcfaq-header">
          <h2 className="opcfaq-title">Proprietorship to Private Limited — FAQs</h2>
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
                  <div className="opcfaq-answer-content" style={{ whiteSpace: "pre-line" }}>{item.answer}</div>
                </div>
              </div>
            );
          })}
        </div>

      </div>
    </section>
  );
};

export default PtopvtFAQ;
