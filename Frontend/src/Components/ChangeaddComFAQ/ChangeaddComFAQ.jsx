import React, { useState } from "react";
import "./ChangeaddComFAQ";

const faqs = [
  {
    question: "What is the procedure to change the Registered office of the Company?",
    answer:(
    <div>
      <p>The procedure of change in the registered office of the Company can be categorized as follows:
         Change of Address within the same City</p>
      <ol>
        <li>1. Board Resolution for change of registered office address</li>
        <li>2. Form INC22 is to be filed with necessary attachments</li>
        <p>Change of Address within the same State</p>
      </ol>
    </div>
  ),
},
  {
    question: "What are the documents required for change in registered office address of the company?",
    answer:(
    <div>
      <p>The following basic documents are required for change in registered office address of the company</p>
      <ol>
        <li>1. Rent Agreement</li>
        <li>2. Electricity Bill or Gas Bill</li>
        <li>3. NOC from the Owner</li>
        <li>4. Ownership proof in case it is owned by the company</li>
      </ol>
    </div>
  ),
},
  {
    question: "What is the time period within which the process of change of Registered office takes place?",
    answer:
      "The complete process takes around 1 week to 3 months depending upon the change in registered office as mentioned above.",
  },
  {
    question:
      "How Legal Terminus can help you with change in Registered office Address of the Company?",
    answer:
      "Legal Terminus can help you with change in Registered office Address of the Company in a hassle-free manner within a reasonable time span and competitive Professional fees. To know more please book a telephonic appointment with one of our consultants for free.",
  },
];

const ChangeaddComFAQ = () => {
  const [activeIndex, setActiveIndex] = useState(0);

  const toggleFaq = (index) => {
    setActiveIndex((prev) => (prev === index ? -1 : index));
  };

  return (
    <section className="Change-add-com-Faq-section">
      <div className="Change-add-com-Faq-container">
        {/* Left side – static text */}
        <div className="Change-add-com-Faq-left">
          <h2 className="Change-add-com-Faq-title">Changing in Registered Office Address FAQ's</h2>

          <p className="Change-add-com-Faq-intro">
            Here, we’ve answered the most common questions about changing in Registered Office Address covering documents, steps, and what happens after registration. These FAQs will help you understand everything clearly and move ahead with confidence.
          </p>

          <p className="Change-add-com-Faq-intro">
            
          </p>
        </div>

        {/* Right side – scrollable Q&A list */}
        <div className="Change-add-com-Faq-right">
          <div className="Change-add-com-Faq-list">
            {faqs.map((item, index) => {
              const isActive = index === activeIndex;
              return (
                <div
                  key={index}
                  className={`Change-add-com-Faq-item ${isActive ? "active" : ""}`}
                >
                  <button
                    type="button"
                    className="Change-add-com-Faq-question"
                    onClick={() => toggleFaq(index)}
                  >
                    <span>{item.question}</span>
                    <span className={`Change-add-com-Faq-icon ${isActive ? "open" : ""}`}>
                      ▾
                    </span>
                  </button>
                  {isActive && (
                   <div className={`Change-add-com-Faq-answer ${isActive ? "open" : ""}`}>
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

export default ChangeaddComFAQ;
