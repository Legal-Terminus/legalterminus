import React, { useState } from "react";
import "./ISOfaq.css";

const faqs = [
  {
    question: "Is ISO Certification mandatory for all business organizations?",
    answer:
      "ISO Certification is not a mandatory requirement for any organization. However, it provides a significant competitive advantage, improves quality management, and is often required by enterprise clients and government tenders.",
  },
  {
    question: "Can an organization obtain multiple ISO Certifications?",
    answer:
      "Yes, an organization can obtain multiple ISO Certifications as per its requirements. For example, a company can hold ISO 9001 (Quality Management), ISO 14001 (Environmental), and ISO 27001 (Information Security) simultaneously.",
  },
  {
    question: "What is the validity of ISO Certificates?",
    answer:
      "The validity of an ISO Certificate generally ranges from 1 to 3 years depending on the certifying body. Certificates require annual surveillance audits and a recertification audit at the end of the validity period to maintain the certification.",
  },
  {
    question: "What are the documents required for ISO Certification?",
    answer: (
      <div>
        <ol>
          <li>Any registration proof of the organization (GST, MSME, CIN, etc.)</li>
          <li>One Letter Head of the Organization</li>
          <li>One or more Sale or Purchase Invoices of the organization</li>
          <li>Details of business activity and processes</li>
          <li>Any existing quality/process documentation (if available)</li>
        </ol>
      </div>
    ),
  },
  {
    question: "What is the time period within which ISO Certification can be obtained?",
    answer:
      "The process of obtaining ISO Certification typically takes 7 to 10 working days from submission of correct information and complete documentation. Complex certifications like ISO 27001 may take longer depending on the size and complexity of the organization.",
  },
  {
    question: "What is the procedure to obtain ISO Certification?",
    answer: (
      <div>
        <p>The broad process of obtaining ISO Certification involves the following steps:</p>
        <ol>
          <li>STEP 1: Share your organization details and documents with our ISO consultant.</li>
          <li>STEP 2: Our consultant reviews, validates, and prepares the application.</li>
          <li>STEP 3: Application is filed with the relevant certifying body.</li>
          <li>STEP 4: Certifying body reviews the application and may conduct an audit.</li>
          <li>STEP 5: ISO Certificate is issued after successful review/audit.</li>
        </ol>
      </div>
    ),
  },
  {
    question: "How can Legal Terminus help you obtain ISO Certification?",
    answer:
      "Legal Terminus handles the complete ISO certification process — from document preparation and application filing to follow-up with the certifying body. We ensure a smooth, hassle-free process within a competitive professional fee. Contact us for a free consultation.",
  },
];

const FaqISO = () => {
  const [activeIndex, setActiveIndex] = useState(0);

  const toggleFaq = (index) => {
    setActiveIndex((prev) => (prev === index ? -1 : index));
  };

  return (
    <section className="isofaq-section">
      <div className="isofaq-container">

        {/* Centered heading & subheading */}
        <div className="isofaq-header">
          <h2 className="isofaq-title">ISO Certification — FAQs</h2>
          <p className="isofaq-intro">
            Got questions? We've got answers — straight, no-BS, legally accurate.
          </p>
        </div>

        {/* Full-width FAQ accordion */}
        <div className="isofaq-list">
          {faqs.map((item, index) => {
            const isActive = index === activeIndex;
            return (
              <div
                key={index}
                className={`isofaq-item ${isActive ? "active" : ""}`}
              >
                <button
                  type="button"
                  className="isofaq-question"
                  onClick={() => toggleFaq(index)}
                >
                  <span>{item.question}</span>
                  <span className={`isofaq-icon ${isActive ? "open" : ""}`}>▾</span>
                </button>
                <div className={`isofaq-answer ${isActive ? "open" : ""}`}>
                  <div className="isofaq-answer-content">{item.answer}</div>
                </div>
              </div>
            );
          })}
        </div>

      </div>
    </section>
  );
};

export default FaqISO;
