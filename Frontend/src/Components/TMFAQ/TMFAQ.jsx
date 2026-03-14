import React, { useState } from "react";
import "./TMFAQ.css";

const faqs = [
  {
    question: "When can an application for renewal be made?",
    answer:
      "The application for renewal of Trademark can be made at any time within 1 year before the expiry of the Trademark concerned along with the applicable government fees. The renewal application will be filed in Form TM – R.",
  },
  {
    question: "Can a renewal application be filed post the date of expiry of such trademark?",
    answer:
      "The renewal application can be filed upto 6 months after the date of expiry of such trademark along with payment of applicable late fees/ Surcharge. In case an application is not made within 6 months from the expiry of any Trademark, such a trademark is liable to be removed from the Trademark registry. The trademark holder can apply for restoration of the Trademark with prescribed fees upto 1 Year from the date of such expiry.",
  },
  {
    question: "What if the renewal/ restoration application is not filed even after expiry of the Trademark and a period of 1 Year has elapsed?",
    answer:
      "In such a case, the owner of the Trademark will necessarily require to file a fresh Trademark Application.",
  },
  {
    question:
      "What are some key/ basic documents required for filing renewal applications?",
    answer:(
    <ul>
      <li>1. Power of Attorney</li>
      <li>2. TM Registration Certificate</li>
      <li>3. KYC of the Applicant (Proprietor of the registered Trademark)</li>
    </ul>
  ),
},
  {
    question: "How Legal Terminus can help you with renewal of your registered Trademark?",
    answer:
      "Legal Terminus can help you with obtaining renewal of TM registration for your organization, as and when required, in a hassle-free manner within a reasonable time span and for competitive professional fee. To know more, please book a telephonic appointment with one of our consultants free of charge.",
  },
];

const FaqPvt = () => {
  const [activeIndex, setActiveIndex] = useState(0);

  const toggleFaq = (index) => {
    setActiveIndex((prev) => (prev === index ? -1 : index));
  };

  return (
    <section className="Tm-faq-section">
      <div className="Tm-faq-container">
        {/* Left side – static text */}
        <div className="Tm-faq-left">
          <h2 className="Tm-faq-title">Trademark Renewal in India FAQ's</h2>

          <p className="Tm-faq-intro">
            Find simple and clear answers to common questions about trademark renewal, including renewal timeline, fees, grace period, and consequences of non-renewal.
          </p>

          <p className="Tm-faq-intro">
            
          </p>
        </div>

        {/* Right side – scrollable Q&A list */}
        <div className="Tm-faq-right">
          <div className="Tm-faq-list">
            {faqs.map((item, index) => {
              const isActive = index === activeIndex;
              return (
                <div
                  key={index}
                  className={`Tm-faq-item ${isActive ? "active" : ""}`}
                >
                  <button
                    type="button"
                    className="Tm-faq-question"
                    onClick={() => toggleFaq(index)}
                  >
                    <span>{item.question}</span>
                    <span className={`Tm-faq-icon ${isActive ? "open" : ""}`}>
                      ▾
                    </span>
                  </button>
                  {isActive && (
                   <div className={`Tm-faq-answer ${isActive ? "open" : ""}`}>
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
