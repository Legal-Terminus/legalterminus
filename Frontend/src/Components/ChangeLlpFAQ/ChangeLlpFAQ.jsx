import React, { useState } from "react";
import "./ChangeLlpFAQ.css";

const faqs = [
  {
    question: "What is the procedure to change the name of an LLP?",
    answer:(
    <div>
      <ul>
        <li>If the provision for change of Name is not mentioned in the LLP Agreement, then consent of all the partners is required for such change</li>
        <li>Passing the resolution for change in Name of the LLP</li>
        <li>Preparation and filing of RUN LLP form for Name availability</li>
        <li>Preparation and filing ofE-form LLP-5</li>
        <li>Preparation and execution of Supplementary LLP Agreement for such change</li>
        <li>Preparation and filing of e form LLP-3 for registration of such change in Supplementary LLP Agreement</li>
      <p><strong>Appropriate Government fees is payable depending upon the contribution of the LLP.</strong></p>
      </ul>
    </div>
  ),
},
  {
    question: "What is the expected time frame to effect such change?",
    answer:
      "In terms of the extant provisions of the law, the relevant documents and e-forms in respect of any change in name of an LLP should filed with the MCA within 30 days of such change.",
  },
  {
    question: "What is the time period within which the process of change of Name takes place?",
    answer:
      "The process of change in name takes around 2 weeks, subject to submission of correct information and complete documentation.",
  },
  {
    question: "How Legal Terminus can help you with changing the Name of your LLP?",
    answer:
      "Legal Terminus can help you with changing the name of your LLP in a hassle-free manner within a reasonable time span and for competitive professional fees. To know more, please book a telephonic appointment with one of our consultants free of charge.",
  },
];

const ChangeLlpFAQ= () => {
  const [activeIndex, setActiveIndex] = useState(0);

  const toggleFaq = (index) => {
    setActiveIndex((prev) => (prev === index ? -1 : index));
  };

  return (
    <section className="ChangeLlp-section">
      <div className="ChangeLlp-container">
        {/* Left side – static text */}
        <div className="ChangeLlp-left">
          <h2 className="ChangeLlp-title">Change in LLP Name FAQ's</h2>

          <p className="ChangeLlp-intro">
            Here, we’ve answered the most common questions about changing in LLP Name covering documents, steps, and what happens after registration. These FAQs will help you understand everything clearly and move ahead with confidence.
          </p>

          <p className="ChangeLlp-intro">
            
          </p>
        </div>

        {/* Right side – scrollable Q&A list */}
        <div className="ChangeLlp-right">
          <div className="ChangeLlp-list">
            {faqs.map((item, index) => {
              const isActive = index === activeIndex;
              return (
                <div
                  key={index}
                  className={`ChangeLlp-item ${isActive ? "active" : ""}`}
                >
                  <button
                    type="button"
                    className="ChangeLlp-question"
                    onClick={() => toggleFaq(index)}
                  >
                    <span>{item.question}</span>
                    <span className={`ChangeLlp-icon ${isActive ? "open" : ""}`}>
                      ▾
                    </span>
                  </button>
                  {isActive && (
                   <div className={`ChangeLlp-answer ${isActive ? "open" : ""}`}>
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

export default ChangeLlpFAQ;
