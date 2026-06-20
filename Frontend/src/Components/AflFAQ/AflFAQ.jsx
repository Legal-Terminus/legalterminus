import React, { useState } from "react";
import "./AflFAQ.css";

const faqs = [
  {
    question: "Do all LLPs need to file Form LLP-11 and Form LLP-8 every year?",
    answer:
      "Yes. Every LLP registered under the LLP Act, 2008 must file both Form LLP-11 (Annual Return) and Form LLP-8 (Statement of Account & Solvency) every financial year, even if there is no business activity or turnover during the year.",
  },
  {
    question: "What is the due date for LLP annual filing?",
    answer:
      "The major LLP annual filing due dates are:\n• 📄 Form LLP-11 – On or before 30 May\n• 📊 Form LLP-8 – On or before 30 October\n• 💼 LLP Income Tax Return (ITR-5) – 31 July / 31 October, depending on audit applicability\nTimely filing helps avoid additional late fees and penalties.",
  },
  {
    question: "Is LLP annual filing mandatory for inactive or zero-turnover LLPs?",
    answer:
      "Yes. LLP annual filing is compulsory even if the LLP has:\n• No business activity\n• Zero turnover\n• No bank transactions\n• No income during the year\nThere is currently no \"dormant LLP\" concept under the LLP Act.",
  },
  {
    question: "What happens if LLP annual filing is not completed on time?",
    answer:
      "Delayed filing may lead to:\n• Additional government late fees\n• Penalties on the LLP and Designated Partners\n• Compliance notices from MCA or Income Tax Department\n• Difficulty in closing the LLP in future\n• Problems in banking, loans, tenders, or funding activities",
  },
  {
    question: "What is Form LLP-11?",
    answer:
      "Form LLP-11 is the Annual Return of the LLP filed with the Ministry of Corporate Affairs (MCA). It contains basic details such as:\n• LLP partner details\n• Business activities\n• Contribution structure\n• Compliance information\nIt must be filed every year, regardless of turnover.",
  },
  {
    question: "What is Form LLP-8?",
    answer:
      "Form LLP-8 is the Statement of Account & Solvency of the LLP. It includes:\n• Financial position of the LLP\n• Statement of solvency\n• Basic financial details\n• Declaration by Designated Partners\nThis form is mandatory for all LLPs every financial year.",
  },
  {
    question: "What is the difference between audited and non-audited LLPs?",
    answer:
      "An LLP generally requires statutory audit if:\n• Annual turnover exceeds ₹40 lakh, OR\n• Contribution exceeds ₹25 lakh\nIf both limits remain below the threshold, audit may not be mandatory under the LLP Act.",
  },
  {
    question: "Can Legal Terminus help with bookkeeping and financial statement preparation?",
    answer:
      "Yes. Legal Terminus can assist eligible LLPs with:\n• 📚 Bookkeeping\n• 📄 Profit & Loss preparation\n• 📊 Balance Sheet preparation\n• 💼 Income Tax computation\n• Annual compliance coordination\nThis helps ensure smoother and more accurate annual filing.",
  },
  {
    question: "Is DSC mandatory for LLP annual filing?",
    answer:
      "Yes. Valid DSCs (Digital Signature Certificates) of Designated Partners are mandatory for filing LLP forms on the MCA portal.\nIf required, Legal Terminus can also coordinate DSC procurement or renewal through authorised DSC service providers.",
  },
  {
    question: "Can LLP annual filing be done online?",
    answer:
      "Yes. LLP annual filings are completed online through the official MCA and Income Tax portals using authorised digital signatures and e-filing systems.",
  },
  {
    question: "What documents are generally required for LLP annual filing?",
    answer:
      "Commonly required documents include:\n• Bank statements\n• Sales and purchase details\n• Expense records\n• Partner contribution details\n• PAN of LLP\n• DSC of Designated Partners\n• Previous financial statements and compliance records\nAdditional documents may be required depending on the LLP's business and audit applicability.",
  },
  {
    question: "What is a Small LLP?",
    answer:
      "An LLP is generally treated as a Small LLP if:\n• Contribution does not exceed ₹25 lakh, AND\n• Turnover does not exceed ₹40 lakh\nSmall LLPs benefit from lower additional filing fees and certain compliance relaxations.",
  },
  {
    question: "Can an LLP file annual returns after the due date?",
    answer:
      "Yes. Delayed filing is possible, but additional late fees and penalties will apply based on the period of delay and LLP category.\nEarly compliance is always recommended to avoid unnecessary costs.",
  },
  {
    question: "Does LLP annual filing include Income Tax Return filing?",
    answer:
      "Yes. LLP annual compliance generally includes filing the LLP Income Tax Return (ITR-5) along with MCA annual forms.\nHowever, audit-related filings may require additional documentation and professional certification.",
  },
  {
    question: "Can Designated Partners be personally liable for non-compliance?",
    answer:
      "Yes. Under the LLP Act, Designated Partners are responsible for ensuring timely compliance of the LLP. Continuous non-compliance may lead to penalties and legal exposure for the LLP and its Designated Partners.",
  },
  {
    question: "Can Legal Terminus help if previous LLP filings are pending?",
    answer:
      "Yes. Legal Terminus can review pending LLP compliances, calculate applicable late fees, and assist in completing overdue annual filings and regularising the LLP's compliance status.",
  },
  {
    question: "How can Legal Terminus help with LLP Annual Filing?",
    answer:
      "Legal Terminus provides end-to-end support for LLP annual compliance, including Form LLP-11 filing, Form LLP-8 filing, Income Tax Return filing, bookkeeping support, DSC coordination, and audit coordination wherever applicable.\n\nOur team focuses on timely filing, proper compliance management, regular reminders, and professional support to help LLPs avoid penalties and maintain smooth legal compliance throughout the year.",
  },
];

const AflFAQ = () => {
  const [activeIndex, setActiveIndex] = useState(0);

  const toggleFaq = (index) => {
    setActiveIndex((prev) => (prev === index ? -1 : index));
  };

  return (
    <section className="opcfaq-section">
      <div className="opcfaq-container">

        <div className="opcfaq-header">
          <h2 className="opcfaq-title">LLP Annual Filing — FAQs</h2>
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

export default AflFAQ;
