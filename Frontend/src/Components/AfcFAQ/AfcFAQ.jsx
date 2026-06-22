import React, { useState } from "react";
import "./AfcFAQ.css";

const faqs = [
  {
    question: "What are the annual compliances mandatory for every company in India?",
    answer:
      "Every Private Limited Company, OPC, and Small Company must complete annual ROC and Income Tax compliances such as AOC-4 (Financial Statements), MGT-7 / MGT-7A (Annual Return), ADT-1, DPT-3 (if applicable), MSME-1 (if applicable), ITR-6, and statutory audit compliances. Each filing has separate due dates and penalties for delay.",
  },
  {
    question: "Which of your plans is suitable for my company?",
    answer:
      "ELEMENTAL is suitable if you already have audited financials and only need filing support. ENRICHED is ideal if you also require secretarial document preparation such as Board Report, AGM Notice, resolutions, and related ROC documentation. SUPREME is designed for businesses looking for complete annual compliance support including bookkeeping, financial statement preparation, and audit coordination.",
  },
  {
    question: "Is statutory audit mandatory for every company?",
    answer:
      "Yes. Under the Companies Act, 2013, statutory audit is mandatory for every company, irrespective of turnover, business activity, or profit level. Even inactive or zero-revenue companies are generally required to complete annual audit compliances.",
  },
  {
    question: "What happens if company annual filings are delayed?",
    answer:
      "Delayed filings can result in heavy additional fees, penalties, notices from MCA, and in serious cases, Director Disqualification under Section 164(2) of the Companies Act, 2013.",
  },
  {
    question: "What is Director Disqualification under Section 164(2)?",
    answer:
      "If a company fails to file annual returns or financial statements for three consecutive financial years, its Directors may become disqualified from acting as Directors in any company for five years.",
  },
  {
    question: "What is the due date for holding the Annual General Meeting (AGM)?",
    answer:
      "Most companies are required to hold their AGM on or before 30 September every year, subject to applicable legal provisions and extensions, if any.",
  },
  {
    question: "What is the difference between AOC-4 and MGT-7?",
    answer:
      "AOC-4 is used for filing the company's financial statements, while MGT-7 / MGT-7A is used for filing the company's annual return containing shareholding, director, and management details.",
  },
  {
    question: "What is DIR-3 KYC and why is it important?",
    answer:
      "DIR-3 KYC is an annual KYC compliance for Directors holding DIN. Non-filing may lead to DIN deactivation and a late penalty from MCA.",
  },
  {
    question: "Is annual filing mandatory even if the company has no business activity?",
    answer:
      "Yes. Even inactive companies are required to complete annual ROC filings, Income Tax filings, and statutory audit compliances unless legally struck off or converted into Dormant status.",
  },
  {
    question: "What is MSME-1 filing?",
    answer:
      "MSME-1 is a half-yearly return required for companies having outstanding payments to MSME suppliers beyond the prescribed time limit under MSME laws.",
  },
  {
    question: "What is DPT-3 filing?",
    answer:
      "DPT-3 is a yearly ROC filing related to outstanding loans, advances, or non-deposit transactions received by the company.",
  },
  {
    question: "What is the difference between MGT-7 and MGT-7A?",
    answer:
      "MGT-7A is a simplified annual return applicable to OPCs and Small Companies, while MGT-7 applies to other companies.",
  },
  {
    question: "What documents are generally required for Company Annual Filing?",
    answer:
      "Commonly required documents include bank statements, sales and purchase records, expense details, GST returns, auditor-related documents, DSCs of Directors, and previous year compliance records.",
  },
  {
    question: "Can Legal Terminus coordinate with our existing CA or auditor?",
    answer:
      "Yes. We can work together with your existing Chartered Accountant, auditor, or internal accounts team for smooth annual compliance coordination.",
  },
  {
    question: "What is ITR-6?",
    answer:
      "ITR-6 is the Income Tax Return form applicable to companies other than companies claiming exemption under Section 11.",
  },
  {
    question: "Can annual filings be completed completely online?",
    answer:
      "Yes. Most ROC and Income Tax annual compliances are completed online through the official MCA and Income Tax portals.",
  },
  {
    question: "Why is timely annual filing important for companies?",
    answer:
      "Timely filing helps maintain legal compliance, avoid penalties, maintain Director eligibility, improve business credibility, and support banking, funding, and tender eligibility.",
  },
  {
    question: "Can a newly incorporated company also have annual filing compliances?",
    answer:
      "Yes. Even newly incorporated companies are required to comply with applicable annual ROC and tax filings based on their date of incorporation and financial year.",
  },
  {
    question: "What if one Director's DSC has expired?",
    answer:
      "ROC forms cannot be filed without valid DSCs. We can assist in coordinating DSC creation for Directors wherever required.",
  },
  {
    question: "Can annual filing penalties be waived?",
    answer:
      "Generally, late fees under MCA are system-generated and mandatory. Waivers are available only if specifically announced by the Government through special schemes.",
  },
  {
    question: "Do Small Companies get any compliance benefits?",
    answer:
      "Yes. Small Companies enjoy certain procedural relaxations and simplified annual return requirements under the Companies Act.",
  },
  {
    question: "Can a company change its auditor during the year?",
    answer:
      "Yes. Auditor changes are possible subject to compliance with applicable provisions of the Companies Act and ROC filings.",
  },
  {
    question: "Is bookkeeping mandatory for company annual filing?",
    answer:
      "Yes. Proper books of accounts are necessary for preparation of financial statements, audit, and annual filings.",
  },
  {
    question: "What happens after annual filing is completed?",
    answer:
      "After successful filing, acknowledgement challans and filed forms are generated from MCA and Income Tax portals for record purposes.",
  },
  {
    question: "Why should companies avoid last-minute annual filing?",
    answer:
      "Last-minute filing increases the risk of technical issues, server error, DSC problems, missing documents, late fees, and filing errors.",
  },
  {
    question: "How can Legal Terminus help with Company Annual Filing?",
    answer:
      "Legal Terminus provides end-to-end support for company annual compliances including ROC filings, Income Tax filings, secretarial documentation, compliance tracking, audit coordination, and regular status updates to help businesses stay compliant smoothly and professionally throughout the year.",
  },
];

const AfcFAQ = () => {
  const [activeIndex, setActiveIndex] = useState(0);

  const toggleFaq = (index) => {
    setActiveIndex((prev) => (prev === index ? -1 : index));
  };

  return (
    <section className="opcfaq-section">
      <div className="opcfaq-container">

        <div className="opcfaq-header">
          <h2 className="opcfaq-title">Company Annual Filing — FAQs</h2>
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

export default AfcFAQ;
