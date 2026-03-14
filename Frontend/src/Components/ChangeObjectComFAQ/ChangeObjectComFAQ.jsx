import React, { useState } from "react";
import "./ChangeObjectComFAQ.css";

const faqs = [
  {
    question: "What may be certain potential reasons behind change in objects of a company?",
    answer:(
    <div>
      <p><strong>An existing company may change the objects of the company for the following reasons:</strong></p>
      <ul>
        <li>1. The existing business becomes illegal due to change in law</li>
        <li>2. The partners of the Company wants to change the business voluntarily</li>
        <li>3. One of the objects mentioned is no longer required</li>
        <li>4. The partners want to add additional business object</li>
        <li>5. Any other reason requiring such change</li>
      </ul>
    </div>
  ),
},
  {
    question: "What is the procedure to change the objects of a company?",
    answer:(
    <div>
      <ul>
        <li>1. Passing a board resolution for changing the objects of the company</li>
        <li>2. Amending the MOA of the company</li>
        <li>3. Preparation and passing a Special Resolution in the Extra-ordinary General Meeting of the company</li>
        <li>4. Preparation and filing of E-form 14 for registration of such change</li>
        <li>5. In case of a public company, following additional procedure need to be followed</li>
        <li>6. Special Resolution needs to be published in one English and one vernacular newspaper in the place where the registered office of the company is situated.</li>
        <li>7. Such details shall also be placed on the website of the company.</li>
        <li>8. The dissenting shareholders shall be given an opportunity to exit by the promoters and shareholders having control.</li>
        <li>9. Appropriate Government fees is payable depending upon the authorized capital of the company.</li>
      </ul>
    </div>
  ),
},
  {
    question: "What is the time limit for filing documents in respect of any such change in the objects?",
    answer:
      "In terms of the extant provisions of the law, the relevant documents and e-forms in respect of any change in objects of a company should filed with the MCA within 30 days.",
  },
  {
    question:
      "What is the time period within which the process of change of objects takes place?",
    answer:
      "The process of change in object of the Company takes around 1-2 weeks, subject to submission of correct information and complete documentation.",
  },
  {
    question: "How Legal Terminus can help you with change in object of the company?",
    answer:
      "Legal Terminus can help you with changing the objects of your company, as and when required, in a hassle-free manner within a reasonable time span and for competitive professional fees. To know more, please book a telephonic appointment with one of our consultants free of charge.",
  },
];

const ChangeObjectComFAQ= () => {
  const [activeIndex, setActiveIndex] = useState(0);

  const toggleFaq = (index) => {
    setActiveIndex((prev) => (prev === index ? -1 : index));
  };

  return (
    <section className="Change-ob-com-faq-section">
      <div className="Change-ob-com-faq-container">
        {/* Left side – static text */}
        <div className="Change-ob-com-faq-left">
          <h2 className="Change-ob-com-faq-title">Changing in Company Object FAQ's</h2>

          <p className="Change-ob-com-faq-intro">
            Here, we’ve answered the most common questions about Changing in Company Object covering documents, steps, and what happens after registration. These FAQs will help you understand everything clearly and move ahead with confidence.
          </p>

          <p className="Change-ob-com-faq-intro">
            
          </p>
        </div>

        {/* Right side – scrollable Q&A list */}
        <div className="Change-ob-com-faq-right">
          <div className="Change-ob-com-faq-list">
            {faqs.map((item, index) => {
              const isActive = index === activeIndex;
              return (
                <div
                  key={index}
                  className={`Change-ob-com-faq-item ${isActive ? "active" : ""}`}
                >
                  <button
                    type="button"
                    className="Change-ob-com-faq-question"
                    onClick={() => toggleFaq(index)}
                  >
                    <span>{item.question}</span>
                    <span className={`Change-ob-com-faq-icon ${isActive ? "open" : ""}`}>
                      ▾
                    </span>
                  </button>
                  {isActive && (
                   <div className={`Change-ob-com-faq-answer ${isActive ? "open" : ""}`}>
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

export default ChangeObjectComFAQ;
