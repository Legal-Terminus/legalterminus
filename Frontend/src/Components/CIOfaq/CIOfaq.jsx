import React, { useState } from "react";
import "./CIOfaq.css";

const faqs = [
  {
    question: "What may be certain potential reasons behind change in an LLP’s object(s)?",
    answer:(
    <div>
      <p><strong>An existing LLP may need to change its objects for various reasons. For instance:</strong></p>
      <ul>
        <li>1. Existing business may become illegal due to change in law;</li>
        <li>2. The partners wish to add or amend one or more business lines voluntarily;</li>
        <li>3. One or more of the objects is/ are no longer required; etc.</li>
      </ul>
    </div>
  ),
},
  {
    question: "What is the procedure to change the objects of an LLP?",
    answer:(
    <div>
      <ul>
        <li>1. Passing the resolution for change in the objects of the LLP</li>
        <li>2. Preparation and execution of supplementary LLP Agreement depicting such change</li>
        <li>3. Preparation and filing E-form 3 for change in LLP Agreement</li>
        <li>4. Appropriate Government fees is payable depending upon the contribution of the LLP.</li>
      </ul>
    </div>
  ),
},
  {
    question: "What is the time limit for filing documents in respect of any such change in the objects?",
    answer:
      "In terms of the extant provisions of the law, the relevant documents and e-forms in respect of any change in objects of an LLP should filed with the MCA within 30 days.",
  },
  {
    question:
      "What is a company sWhat is the time period within which the process of change of objects takes place?",
    answer:
      "The process of change in object of the LLP takes around 1 week, subject to submission of correct information and complete documentation.",
  },
  {
    question: "How Legal Terminus can help you with change in object of the LLP?",
    answer:
      "Legal Terminus can help you with changing the objects of LLP, as and when required, in a hassle-free manner within a reasonable time span and for competitive professional fees. To know more, please book a telephonic appointment with one of our consultants free of charge.",
  },
];

const FaqPvt = () => {
  const [activeIndex, setActiveIndex] = useState(0);

  const toggleFaq = (index) => {
    setActiveIndex((prev) => (prev === index ? -1 : index));
  };

  return (
    <section className="faa-section">
      <div className="faa-container">
        {/* Left side – static text */}
        <div className="faa-left">
          <h2 className="faa-title">Changing in Object of your LLP FAQ's</h2>

          <p className="faa-intro">
            Here, we’ve answered the most common questions about Changing in Objects of LLP covering documents, steps, and what happens after registration. These FAQs will help you understand everything clearly and move ahead with confidence.
          </p>

          <p className="faa-intro">
            
          </p>
        </div>

        {/* Right side – scrollable Q&A list */}
        <div className="faa-right">
          <div className="faa-list">
            {faqs.map((item, index) => {
              const isActive = index === activeIndex;
              return (
                <div
                  key={index}
                  className={`faa-item ${isActive ? "active" : ""}`}
                >
                  <button
                    type="button"
                    className="faa-question"
                    onClick={() => toggleFaq(index)}
                  >
                    <span>{item.question}</span>
                    <span className={`faa-icon ${isActive ? "open" : ""}`}>
                      ▾
                    </span>
                  </button>
                  {isActive && (
                   <div className={`faa-answer ${isActive ? "open" : ""}`}>
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
