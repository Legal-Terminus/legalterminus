import React, { useState } from "react";
import "../PvtltdFAQ/PvtltdFAQ.css";

const faqs = [
  {
    question: "What is a Wholly Owned Subsidiary (WOS)?",
    answer:
      "A Wholly Owned Subsidiary (WOS) is a company in which 100% ownership and control remain with a single parent company. The parent company may be Indian or foreign. The subsidiary operates as a separate legal entity with its own directors, bank account, statutory compliance, and financial records, while the parent company retains complete ownership of shares.",
  },
  {
    question: "Can an Indian company also create a Wholly Owned Subsidiary?",
    answer:
      "Yes. Both Indian and foreign companies can establish a Wholly Owned Subsidiary in India. Indian companies commonly use WOS structures for expansion, new business verticals, asset protection, or group restructuring, while foreign companies use it to establish their business presence in India.",
  },
  {
    question: "What is the difference between an Indian-parent WOS and a Foreign-parent WOS?",
    answer:
      "The incorporation process under the Companies Act remains largely similar for both structures. However, foreign-parent subsidiaries also require compliance under FEMA and RBI regulations, including foreign investment reporting, apostille/notarisation of documents, and banking compliance.",
  },
  {
    question: "What is the minimum shareholder requirement for a WOS?",
    answer:
      "Under the Companies Act, a Private Limited Company must have at least two shareholders. Therefore, even in a Wholly Owned Subsidiary structure, one share is usually held by a nominee shareholder on behalf of the parent company, while the parent company retains beneficial ownership and full control.",
  },
  {
    question: "Is a resident director mandatory for a WOS in India?",
    answer:
      "Yes. Every company registered in India must have at least one resident director who has stayed in India for the prescribed period under the Companies Act. This requirement applies to both Indian-parent and foreign-parent subsidiaries.",
  },
  {
    question: "What is FC-GPR and when is it applicable?",
    answer:
      "FC-GPR is an RBI reporting requirement applicable when a foreign investor invests in an Indian company. It is generally required for foreign-parent Wholly Owned Subsidiaries after share allotment. Indian-parent subsidiaries do not require FC-GPR filing.",
  },
  {
    question: "How long does Wholly Owned Subsidiary registration take?",
    answer:
      "An Indian-parent WOS generally takes around 10–15 working days, while a foreign-parent WOS may take around 20–30 working days depending on document readiness, apostille timelines, and regulatory approvals.",
  },
  {
    question: "What are the annual compliance requirements for a WOS?",
    answer:
      "A Wholly Owned Subsidiary must comply with regular company compliances such as ROC filings, annual returns, statutory audit, board meetings, Income Tax filings, and other applicable legal requirements. Foreign-owned subsidiaries may also have additional FEMA and RBI reporting obligations.",
  },
  {
    question: "Can a foreign company own 100% shares in an Indian subsidiary?",
    answer:
      "Yes. Foreign companies can own 100% shares in many sectors under the automatic route, subject to applicable FEMA and FDI regulations. Certain sectors may require government approval or may have investment restrictions.",
  },
  {
    question: "What documents are generally required for WOS registration?",
    answer:
      "The required documents generally include parent company incorporation documents, board resolution, identity and address proof of directors/shareholders, registered office proof, and KYC documents. Foreign documents may require notarisation and apostille depending on the country of origin.",
  },
  {
    question: "How can Legal Terminus help with Wholly Owned Subsidiary registration?",
    answer:
      "Legal Terminus provides complete assistance for Wholly Owned Subsidiary registration in India, including company incorporation, document drafting, FEMA-related support, RBI reporting assistance, and post-incorporation compliance guidance. We assist both Indian and foreign parent companies with transparent pricing and dedicated professional support throughout the registration process.",
  },
];

const IncorporationFAQ = () => {
  const [activeIndex, setActiveIndex] = useState(0);

  const toggleFaq = (index) => {
    setActiveIndex((prev) => (prev === index ? -1 : index));
  };

  return (
    <section className="faq-section">
      <div className="faq-container">

        <div className="faq-header">
          <h2 className="faq-title">Incorporation Of Wholly Owned Subsidiary — FAQs</h2>
          <p className="faq-intro">
            Got questions? We've got answers — straight, no-BS, legally accurate.
          </p>
        </div>

        <div className="faq-list">
          {faqs.map((item, index) => {
            const isActive = index === activeIndex;
            return (
              <div
                key={index}
                className={`faq-item ${isActive ? "active" : ""}`}
              >
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

export default IncorporationFAQ;
