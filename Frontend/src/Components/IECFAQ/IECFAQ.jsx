import React, { useState } from "react";
import "./IECFAQ.css";

const faqs = [
  {
    question: "What is IEC and who needs it?",
    answer:
      "IEC (Import Export Code) is a registration issued by DGFT for businesses or individuals involved in import or export activities. It is mandatory for importing goods, exporting goods, exporting services, or receiving foreign currency payments from outside India. The IEC number is generally the same as the PAN of the business or individual.",
  },
  {
    question: "Do service exporters need IEC?",
    answer:
      "Yes. If you receive payment in foreign currency for services provided to clients outside India, IEC is required. This includes IT services, software development, freelancing, consulting, digital marketing, design services, BPO, and other professional services. Banks often require IEC details to process foreign inward remittances smoothly.",
  },
  {
    question: "What is the total cost of IEC registration?",
    answer:
      "The DGFT government fee for IEC registration is ₹500. Professional fees depend on the plan selected by you. DSC charges, if required, are additional. We provide complete pricing details before starting the application process.",
  },
  {
    question: "How long does IEC registration take?",
    answer:
      "IEC registration is usually completed within 1–3 working days, subject to successful document verification and DGFT approval. Delays may occur due to PAN-Aadhaar mismatch, incorrect bank details, or incomplete documents.",
  },
  {
    question: "Is IEC PAN-based now? Can I have multiple IECs?",
    answer:
      "Only one IEC can be issued against one PAN. Separate business entities with different PANs require separate IEC registrations.",
  },
  {
    question: "What is the mandatory annual IEC update?",
    answer:
      "Every IEC holder MUST update their IEC details online at dgft.gov.in between 1 April and 30 June each year - even if there are no changes. The update is FREE (no govt fee). Failure to update by 30 June leads to AUTOMATIC DEACTIVATION of the IEC - no exports / imports / foreign-currency receipts possible until reactivated. Reactivation is done by simply completing the missed update; no penalty fee but no business possible during deactivated period. We send reminder + handle the update free for 1 year.",
  },
  {
    question: "What's the 1-year free IEC update support?",
    answer:
      "Every plan includes free professional support for 1 year for any update / change / correction to your IEC - the mandatory April-June annual update, address changes, bank account changes (very common), authorised signatory changes, branch additions, telephone / email updates. Counted from the date of IEC issuance. Beyond 1 year, updates are billed at Rs.499 per change.",
  },
  {
    question: "What is AD Code and is it the same as IEC?",
    answer:
      "No. IEC and AD Code are different. IEC is issued by DGFT, whereas AD Code is issued by your bank for customs and export transactions. AD Code registration on ICEGATE is required for export clearance and shipping bill processing. Enriched and Supreme plans include AD Code registration support.",
  },
  {
    question: "What's RoDTEP and how do I claim it?",
    answer:
      "RoDTEP (Remission of Duties and Taxes on Exported Products) is an export incentive scheme introduced by the Government of India. Eligible exporters can claim benefits on export transactions subject to product eligibility and correct documentation. Our Supreme plan includes basic RoDTEP guidance and first-claim support.",
  },
  {
    question: "How can Legal Terminus help me with IEC registration?",
    answer:
      "Legal Terminus provides complete assistance for IEC registration, document verification, DGFT filing, ICEGATE support, AD Code registration, and annual IEC updates. Our team helps businesses across India with fast processing, professional support, and end-to-end guidance for import-export compliance.",
  },
];

const IECFAQ = () => {
  const [activeIndex, setActiveIndex] = useState(0);

  const toggleFaq = (index) => {
    setActiveIndex((prev) => (prev === index ? -1 : index));
  };

  return (
    <section className="iecfaq-section">
      <div className="iecfaq-container">

        <div className="iecfaq-header">
          <h2 className="iecfaq-title">IEC Registration — FAQs</h2>
          <p className="iecfaq-intro">
            Got questions? We've got answers — straight, no-BS, legally accurate.
          </p>
        </div>

        <div className="iecfaq-list">
          {faqs.map((item, index) => {
            const isActive = index === activeIndex;
            return (
              <div
                key={index}
                className={`iecfaq-item ${isActive ? "active" : ""}`}
              >
                <button
                  type="button"
                  className="iecfaq-question"
                  onClick={() => toggleFaq(index)}
                >
                  <span>{item.question}</span>
                  <span className={`iecfaq-icon ${isActive ? "open" : ""}`}>▾</span>
                </button>
                <div className={`iecfaq-answer ${isActive ? "open" : ""}`}>
                  <div className="iecfaq-answer-content">{item.answer}</div>
                </div>
              </div>
            );
          })}
        </div>

      </div>
    </section>
  );
};

export default IECFAQ;
