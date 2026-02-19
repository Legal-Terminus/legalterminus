import React, { useState } from "react";
import "./PartnershipLLPFAQ.css";

const faqs = [
  {
    question: "What are some key benefits/ reasons of the conversion of partnership firm into a LLP?",
    answer:(
    <div>
      <ul>
        <li>1. The liability of the members or the directors are limited in case of LLP whereas in case of partnership firm the liabilities are unlimited</li>
        <li>2. The LLP is more transparent structure of business as compared to partnership firm</li>
        <li>3. The benefit of startup recognition under the startup India scheme of the government of India can be availed by a LLP and not by any partnership firm.</li>
        <li>4. The LLP has a separate legal identity as compared to a partnership firm.</li>
        <li>5. The venture capitalist gets attracted to invest in a LLP.</li>
      </ul>
    </div>
  ),
},
  {
    question: "What are some key/ basic documents required for conversion of a partnership firm into a LLP?",
    answer:(
    <div>
      <ul>
        <li>1. Details of proposed Designated Partners/Partners</li>
        <li>2. Consent of all partners</li>
        <li>3. Statement of consent of partner of the partnership firm</li>
        <li>4. Copy of latest Income Tax Return</li>
        <li>5. List of all Creditors along with their consent for conversion</li>
        <li>6. List of certified liability and assets</li>
        <li>7. Relevant certification from a CA/CS/CWA; etc.</li>
        <li>8. Bank Statement with current transactions</li>
        <li>9. KYC Documents</li>
        <li>10. Electricity Bill, Rent Agreement&NOC by the owner of Registered office</li>
        <li>11. Dissolution Deed</li>
        <li>12. NOC from the Registrar of firms</li>
      </ul>
    </div>
  ),
},
  {
    question: "What is the time period within which the conversion a partnership firm into a LLP can be completed?",
    answer:
      "The process of Conversion of partnership firm into a LLP can take anywhere between 40 to 50 working days, subject to submission of correct information and complete documentation.",
  },
  {
    question: "How Legal Terminus can help you to convert a partnership firm into an LLP?",
    answer:
      "Legal Terminus can help you with conversion in a hassle-free manner within a reasonable time span and competitive Professional fees. To know more please book a telephonic appointment with one of our consultants for free.",
  },
];

const PartnershipLLPFAQ = () => {
  const [activeIndex, setActiveIndex] = useState(0);

  const toggleFaq = (index) => {
    setActiveIndex((prev) => (prev === index ? -1 : index));
  };

  return (
    <section className="partnership-llp-faq-section">
      <div className="partnership-llp-faq-container">
        {/* Left side */}
        <div className="partnership-llp-faq-left">
          <h2 className="partnership-llp-faq-title">
            Conversion of Partnership into Limited Liability Partnership FAQ's&apos;s
          </h2>

          <p className="partnership-llp-faq-intro">
            Here, we’ve answered the most common questions about Conversion of Partnership into Limited Liability Partnership covering documents, steps, and what happens.
          </p>
        </div>

        {/* Right side */}
        <div className="partnership-llp-faq-right">
          <div className="partnership-llp-faq-list">
            {faqs.map((item, index) => {
              const isActive = index === activeIndex;
              return (
                <div
                  key={index}
                  className={`partnership-llp-faq-item ${isActive ? "active" : ""}`}
                >
                  <button
                    type="button"
                    className="partnership-llp-faq-question"
                    onClick={() => toggleFaq(index)}
                  >
                    <span>{item.question}</span>
                    <span
                      className={`partnership-llp-faq-icon ${isActive ? "open" : ""}`}
                    >
                      ▾
                    </span>
                  </button>

                  {isActive && (
                    <div
                      className={`partnership-llp-faq-answer ${isActive ? "open" : ""}`}
                    >
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

export default PartnershipLLPFAQ;
