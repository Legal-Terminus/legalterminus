import React, { useState } from "react";
import "./ChangeaddComFAQ.css";

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

const ChangeaddComFAQ= () => {
  const [activeIndex, setActiveIndex] = useState(0);

  const toggleFaq = (index) => {
    setActiveIndex((prev) => (prev === index ? -1 : index));
  };

  return (
    <section className="change-faqsection">
      <div className="change-faqcontainer">
        {/* Left side – static text */}
        <div className="change-faqleft">
          <h2 className="change-faqtitle">Private Limited Company Registration FAQ&apos;s</h2>

          <p className="change-faqintro">
            Starting a Private Limited Company in India is an important step for any business owner. With the right support, the process can be simple and stress-free.

<br/><br/>
Here, we’ve answered the most common questions about company registration—covering documents, steps, and what happens after registration. These FAQs will help you understand everything clearly and move ahead with confidence.

          </p>

          <p className="change-faqintro">
            
          </p>
        </div>

        {/* Right side – scrollable Q&A list */}
        <div className="change-faqright">
          <div className="change-faqlist">
            {faqs.map((item, index) => {
              const isActive = index === activeIndex;
              return (
                <div
                  key={index}
                  className={`faq-item ${isActive ? "active" : ""}`}
                >
                  <button
                    type="button"
                    className="change-faqquestion"
                    onClick={() => toggleFaq(index)}
                  >
                    <span>{item.question}</span>
                    <span className={`faq-icon ${isActive ? "open" : ""}`}>
                      ▾
                    </span>
                  </button>
                  {isActive && (
                   <div className={`faq-answer ${isActive ? "open" : ""}`}>
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
