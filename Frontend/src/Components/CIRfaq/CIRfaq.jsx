import React, { useState } from "react";
import "./CIRfaq.css";

const faqs = [
  {
    question: "What is the procedure to change the Registered office of the LLP?",
    answer:(
    <div>
      <p><strong>The procedure of change in registered office of LLP can be categorized as follows:  Change of Address within same City</strong></p>
      <ul>
        <li>1. Preparation and filing resolution for change of registered office address</li>
        <li>2. Preparation and filing Form 15 with necessary attachments</li>
        <li>3. Preparation and filing of supplementary LLP Agreement</li>
        <li>4. Preparation and filing of Form 3</li>
      </ul>
    <p>Change of Address within same State</p>
    <br></br>

       <ul>
        <li>5. If the provision for change of registered office address is not mentioned in the LLP Agreement, then consent of all the partners is required for such change</li>
        <li>6. Preparation and filing resolution for change of registered office address</li>
        <li>7. Preparation and filing Form 15 with necessary attachments</li>
        <li>8. Preparation and filing of supplementary LLP Agreement</li>
        <li>9. Preparation and filing of Form 3</li>
    <p>Change of Address within same State, but from one ROC to another ROC</p>
        <br></br>

        <li>10. If the provision for change of registered office address is not mentioned in the LLP Agreement, then consent of all the partners are required for such change</li>
        <li>11. Preparation and filing resolution for change of registered office address</li>
        <li>12. Preparation and filing Form 15 with necessary attachments before the new ROC</li>
        <li>13. Preparation and filing of supplementary LLP Agreement</li>
        <li>14. Preparation and filing of Form 3</li>
        <p>Change of Address in different State</p>
        <br></br>

        <li>15. If the provision for change of registered office address is not mentioned in the LLP Agreement, then consent of all the partners are required for such change</li>
        <li>16. Consent of Secured Creditors</li>
        <li>17. Public Notice to be published in One English & One Vernacular Newspaper</li>
        <li>18. Preparation and filing resolution for change of registered office address</li>
        <li>19. Preparation and filing Form 15 with necessary attachments before the ROC of the proposed state</li>
        <li>20. Preparation and filing of supplementary LLP Agreement</li>
        <li>21. Preparation and filing of Form 3</li>
        <p>Appropriate Government fees is payable depending upon the contribution of the LLP.</p>
        <br></br>
      </ul>
    </div>
  ),
},
  {
    question: "What is the time period within which the process of change of registered office takes place?",
    answer:
      "The process of change in registered office of an LLP can take anywhere between 1 week to 3 months, subject to submission of correct information and complete documentation.",
  },
  {
    question: "How Legal Terminus can help you with change in Registered Office Address of the LLP?",
    answer:
      "Legal Terminus can help you with change in Registered Office Address of your LLP in a hassle-free manner within a reasonable time span and for competitive professional fees. To know more, please book a telephonic appointment with one of our consultants free of charge.",
  },
];

const FaqPvt = () => {
  const [activeIndex, setActiveIndex] = useState(0);

  const toggleFaq = (index) => {
    setActiveIndex((prev) => (prev === index ? -1 : index));
  };

  return (
    <section className="faq-section">
      <div className="faq-container">
        {/* Left side – static text */}
        <div className="faq-left">
          <h2 className="faq-title">Change in Registered Office Address (LLP) FAQ's</h2>

          <p className="faq-intro">
            Here, we’ve answered the most common questions about Changing in Registered Office Address covering documents, steps, and what happens after registration. These FAQs will help you understand everything clearly and move ahead with confidence.
          </p>

          <p className="faq-intro">
            
          </p>
        </div>

        {/* Right side – scrollable Q&A list */}
        <div className="faq-right">
          <div className="faq-list">
            {faqs.map((item, index) => {
              const isActive = index === activeIndex;
              return (
                <div
                  key={index}
                  className={`faq-item ${isActive ? "active" : ""}`}
                >
                  <button
                    type="button"
                    className="faq-question"
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

export default FaqPvt;
