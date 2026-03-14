import React, { useState } from "react";
import "./IncreaseFAQ.css";

const faqs = [
  {
    question: "What is the reason behind increase in the Authorized Capital of the Company?",
    answer:(
    <div>
      <p><strong>A Company may need to enhance its authorized capital for one or more of the following reasons:</strong></p>
      <ul>
        <li>1. Infusion of additional capital(either through existing shareholders or through other investors)</li>
        <li>2. Enhancement of borrowing capacity/ limits; etc.</li>
      </ul>
    </div>
  ),
},
  {
    question: "What is the procedure to Increase the Authorized Capital of a Company?",
    answer:(
    <div>
      <ul>
        <li>1. Conduct a Board Meeting and pass a resolution for Increase of Authorized Capital</li>
        <li>2. Conduct an Extra-ordinary General Meeting and pass a Special Resolution</li>
        <li>3. Preparation and filing of form MGT 14 with ROC with in 30 days of passing Special Resolution</li>
        <li>4. Preparation and filing of form SH-7 within 30 days of passing of Special Resolution</li>
        <li>5. After due consideration of filed e-form, the ROC will approve the increase in Authorized Capital subject to completeness of the forms and documents</li>
      </ul>
            <p><strong>A Company may need to enhance its authorized capital for one or more of the following reasons:</strong></p>
    </div>
  ),
},
  {
    question: "What are some key/ basic documents required for Increase in Authorized Capital of the company?",
    answer:(
      <div>
        <ol>
          <li>1. Active Digital signature Certificate of the authorized director</li>
          <li>2. Amended Memorandum of Association of the company</li>
          <li>3. Original Certificate of Incorporation of the company</li>
        </ol>
      </div>
    ),
  },
  {
    question: "What is the time period within which the process of Increase of Authorized Capital takes place?",
    answer:
      "The process of Increase of Authorized Capital takes around 2 weeks, subject to submission of correct information and complete documentation.",
  },
  {
    question:
      "How Legal Terminus can help you with Increase in Authorized Capital of your Company?",
    answer:
      "Legal Terminus can help you with Increase in Authorized Capital of your company in a hassle-free manner within a reasonable time span and with competitive Professional fees. To know more please book a telephonic appointment with one of our consultants for free.",
  },
];

const IncreaseFAQ= () => {
  const [activeIndex, setActiveIndex] = useState(0);

  const toggleFaq = (index) => {
    setActiveIndex((prev) => (prev === index ? -1 : index));
  };

  return (
    <section className="Increase-section">
      <div className="Increase-container">
        {/* Left side – static text */}
        <div className="Increase-left">
          <h2 className="Increase-title">Increase in Authorised Capital (Company) FAQ's</h2>

          <p className="Increase-intro">
            Here, we’ve answered the most common questions about Increase in Authorised Capital (Company) covering documents, steps, and what happens after registration. These FAQs will help you understand everything clearly and move ahead with confidence.
          </p>

          <p className="Increase-intro">
            
          </p>
        </div>

        {/* Right side – scrollable Q&A list */}
        <div className="Increase-right">
          <div className="Increase-list">
            {faqs.map((item, index) => {
              const isActive = index === activeIndex;
              return (
                <div
                  key={index}
                  className={`Increase-item ${isActive ? "active" : ""}`}
                >
                  <button
                    type="button"
                    className="Increase-question"
                    onClick={() => toggleFaq(index)}
                  >
                    <span>{item.question}</span>
                    <span className={`Increase-icon ${isActive ? "open" : ""}`}>
                      ▾
                    </span>
                  </button>
                  {isActive && (
                   <div className={`Increase-answer ${isActive ? "open" : ""}`}>
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

export default IncreaseFAQ;
