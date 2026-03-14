import React, { useState } from "react";
import "./CICfaq.css";

const faqs = [
  {
    question: "What is the procedure to change the name of a company?",
    answer:(
    <div>
      <ul>
        <li>1. Conduct a Board Meeting and pass a resolution for change of name</li>
        <li>2. Check availability of proposed name and file reservation of name through web form RUN</li>
        <li>3. Conduct an Extra-ordinary General Meeting and pass a Special Resolution therein</li>
        <li>4. Preparation and filing of form MGT 14 with ROC within prescribed timeline</li>
        <li>5. Preparation and filing of form INC 24 with ROC within prescribed timeline</li>
        <li>6. Issuance of revised certificate of incorporation with new/ revised name</li>

        <p><strong>Appropriate Government fees is payable depending upon the authorized capital of the company.</strong></p>
      </ul>
    </div>
  ),
},
  {
    question: "What are some key/ basic documents required for changing the name of a company?",
    answer:(
    <div>
      <p><strong>Required Documents:</strong></p>
      <ul>
        <li>1. Active Digital Signature Certificate of the authorized director</li>
        <li>2. Amended Memorandum of Association and Articles of Association of the company</li>
        <li>3. Original certificate of incorporation of the company</li>
        <li>4. PAN of the company; etc.</li>
      </ul>
    </div>
  ),
},
  {
    question: "What is the time period within which the process of change of Name takes place?",
    answer:
      "The process of change in name takes around 2 weeks, subject to submission of correct information and complete documentation.",
  },
  {
    question:
      "How Legal Terminus can help you with change in Name of the Company?",
    answer:
      "Legal Terminus can help you with changing the name of your Company in a hassle-free manner within a reasonable time span and for competitive professional fees. To know more, please book a telephonic appointment with one of our consultants free of charge.",
  },
];

const FaqPvt = () => {
  const [activeIndex, setActiveIndex] = useState(0);

  const toggleFaq = (index) => {
    setActiveIndex((prev) => (prev === index ? -1 : index));
  };

  return (
    <section className="faqq-section">
      <div className="faqq-container">
        {/* Left side – static text */}
        <div className="faqq-left">
          <h2 className="faqq-title">Changing in Company Name FAQ's</h2>

          <p className="faqq-intro">
            Here, we’ve answered the most common questions about Changing in Company Name covering documents, steps, and what happens after registration. These FAQs will help you understand everything clearly and move ahead with confidence.
          </p>

          <p className="faqq-intro">
            
          </p>
        </div>

        {/* Right side – scrollable Q&A list */}
        <div className="faqq-right">
          <div className="faqq-list">
            {faqs.map((item, index) => {
              const isActive = index === activeIndex;
              return (
                <div
                  key={index}
                  className={`faqq-item ${isActive ? "active" : ""}`}
                >
                  <button
                    type="button"
                    className="faqq-question"
                    onClick={() => toggleFaq(index)}
                  >
                    <span>{item.question}</span>
                    <span className={`faqq-icon ${isActive ? "open" : ""}`}>
                      ▾
                    </span>
                  </button>
                  {isActive && (
                   <div className={`faqq-answer ${isActive ? "open" : ""}`}>
                    <p>{item.answer}</p>
                  </div>

                  )}
                </div>
              );
            })}
          </div>
        </div>
      </div>
    </section>
  );
};

export default FaqPvt;
