import React, { useState } from "react";
import "./TradeLicenseFAQ.css";

const faqs = [
  {
    question: "Is Trade License mandatory for all business organizations?",
    answer:
      "The Trade License is mandatory for all business operations who carry on the business activity under any municipal limit.",
  },
  {
    question: "What is the validity of license?",
    answer:
      "A license granted shall be valid for a period of 1 year.",
  },
  {
    question: "What is the due date of renewal of license?",
    answer:
      "The renewal of license shall be completed at before 31st March of every year.",
  },
  {
    question: "What if we do not renew the license before 31st March?",
    answer:
      "The renewal can be done with the penalty as may be levied by the respective municipal corporation.",
  },
  {
    question: "What are the documents required for Trade license?",
    answer: (
      <div>
        <ol>
          <li>Address Proof (preferably Electricity Bill) of premise(s) from where the business to be carried on in Odisha</li>
          <li>Copy of PAN &Registration certificate of the organisation</li>
          <li>Proof of possession of premises (Rental Agreement/ Utility Bill)</li>
          <li>Copy of PAN of all the Directors/partners/proprietor</li>
          <li>Copy of Address proof of all the Directors/partners/proprietor</li>
          <li>Bank details & Bank Statement of the organisation of last 2 Months (from which it operates)</li>
          <li>PAN, photo & Address proof of the person authorized to represent at the Trade License Department</li>
          <li>Authorization letter for the above</li>
          <li>Details of business activity to be carried out by the applicant</li>
          <li>Email id & Mobile number</li>
          <li>Commercial Holding tax Receipt</li>
        </ol>
      </div>
    ),
  },
  {
    question: "What is the time period within which the Trade License can be obtained?",
    answer:
      "The process of obtaining Trade License can take anywhere between 07 to 10 working days, subject to submission of correct information and complete documentation in metro cities and in case of non-metro cities it takes relatively longer time period to obtain the license.",
  },
  {
    question: "What is the procedure to obtain Trade License?",
    answer: (
      <div>
        <p>
          The broad process of obtaining Trade Licenseinvolves following steps:
        </p>
        <ol>
          <li>STEP 1: Provide the above-mentioned documents/information of your organization to one of our consultants.</li>
          <li>STEP 2: Our consultant will process the above documents/ information and validate the same.</li>
          <li>STEP 3: The application for Trade License shall be filled online or offline as the case may be.</li>
          <li>STEP 4: The application shall be submitted with required attachments.</li>
          <li>STEP 5: The department shall process the application and issue a registration certificate</li>
        </ol>
      </div>
    ),
  },
  {
    question: "How Legal Terminus can help you to obtain Trade License?",
    answer:
      "Legal Terminus can help you with obtaining Trade License for your organization, as and when required, in a hassle-free manner within a reasonable time span and for competitive professional fee. To know more, please book a telephonic appointment with one of our consultants free of charge.",
  },
];

const TradeLicenseFAQ = () => {
  const [activeIndex, setActiveIndex] = useState(0);

  const toggleFaq = (index) => {
    setActiveIndex((prev) => (prev === index ? -1 : index));
  };

  return (
    <section className="tradefaq-section">
      <div className="tradefaq-container">

        <div className="tradefaq-header">
          <h2 className="tradefaq-title">Trade License Registration FAQ&apos;s</h2>
          <p className="tradefaq-intro">
            Here, we’ve answered some of the most common questions about Trade
            License registration, process, and documentation to guide you
            through every step confidently.
          </p>
        </div>

        <div className="tradefaq-list">
          {faqs.map((item, index) => {
            const isActive = index === activeIndex;
            return (
              <div
                key={index}
                className={`tradefaq-item ${isActive ? "active" : ""}`}
              >
                <button
                  type="button"
                  className="tradefaq-question"
                  onClick={() => toggleFaq(index)}
                >
                  <span>{item.question}</span>
                  <span className={`tradefaq-icon ${isActive ? "open" : ""}`}>▾</span>
                </button>
                <div className={`tradefaq-answer ${isActive ? "open" : ""}`}>
                  <div className="tradefaq-answer-content">{item.answer}</div>
                </div>
              </div>
            );
          })}
        </div>

      </div>
    </section>
  );
};

export default TradeLicenseFAQ;
