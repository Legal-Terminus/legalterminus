import React, { useState } from "react";
import "./PritoLlpFAQ.css";

const faqs = [
  {
    question: "What is the reason behind Change in contribution of an LLP?",
    answer:(
    <div>
      <p><strong>An LLP may need to change (enhance) its initial Contribution for one or more of the following reasons:</strong></p>
      <ul>
        <li>1. Infusion of additional capital (first point in 42)</li>
        <li>2. Removal of an existing Partner</li>
        <li>3. Enhancement of borrowing capacity/ limits</li>
      </ul>
    </div>
  ),
},
  {
    question: "What are some key/ basic documents required for change in contribution of an LLP?",
    answer:(
    <div>
      <ul>
        <li>1. Existing/ original LLP Agreement</li>
        <li>2. New Contribution ratio amongst the partners</li>
        <li>3. DSC of any one Designated Partner; etc.</li>
      </ul>
    </div>
  ),
},
  {
    question: "What is the procedure for increasingthe contribution of an LLP?",
    answer:(
    <div>
      <p><strong>Required Documents:</strong></p>
      <ul>
        <li>1. Preparation of a supplementary LLP Agreement on Stamp Paper of appropriate value</li>
        <li>2. Preparation and Filing of E-form 3 within 30 days of preparation of Supplementary Agreement</li>
        <li>3. Appropriate Government fees is payable depending upon the contribution of the LLP.</li>
      </ul>
    </div>
  ),
},
  {
    question:
      "What is the time period within which the process of change of contribution takes place?",
    answer:
      "The process of change in existing contribution of an LLP takes around 1 week, subject to submission of correct information and complete documentation.",
  },
  {
    question: "How Legal Terminus can help you with change in Contribution in your LLP?",
    answer:
      "Legal Terminus can help you with changing the name of your LLP in a hassle-free manner within a reasonable time span and for competitive professional fees. To know more, please book a telephonic appointment with one of our consultants free of charge.",
  },
];

const FaqPvt = () => {
  const [activeIndex, setActiveIndex] = useState(0);

  const toggleFaq = (index) => {
    setActiveIndex((prev) => (prev === index ? -1 : index));
  };

  return (
    <section className="PLC-to-LLP-faqsection">
      <div className="PLC-to-LLP-faqcontainer">
        {/* Left side – static text */}
        <div className="PLC-to-LLP-faqleft">
          <h2 className="PLC-to-LLP-faqtitle">Conversion of Partnership into Limited Liability Partnership FAQ's&apos;s</h2>

          <p className="PLC-to-LLP-faqintro">
          Here, we’ve answered the most common questions about Conversion of Private Limited Company into Limited Liability Partnership covering documents, steps, and what happens.
          </p>

          <p className="PLC-to-LLP-faqintro">
            
          </p>
        </div>

        {/* Right side – scrollable Q&A list */}
        <div className="PLC-to-LLP-faqright">
          <div className="PLC-to-LLP-faqlist">
            {faqs.map((item, index) => {
              const isActive = index === activeIndex;
              return (
                <div
                  key={index}
                  className={`PLC-to-LLP-faqitem ${isActive ? "active" : ""}`}
                >
                  <button
                    type="button"
                    className="PLC-to-LLP-faqquestion"
                    onClick={() => toggleFaq(index)}
                  >
                    <span>{item.question}</span>
                    <span className={`PLC-to-LLP-faqicon ${isActive ? "open" : ""}`}>
                      ▾
                    </span>
                  </button>
                  {isActive && (
                   <div className={`PLC-to-LLP-faqanswer ${isActive ? "open" : ""}`}>
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
