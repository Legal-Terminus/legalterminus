import React, { useState } from "react";
import "./LlptoPriFAQ.css"; // keep your existing CSS file

const faqs = [
  {
    question: "What are the benefits of the conversion of Limited Liability Partnership (LLP) into a company?",
    answer:(
    <div>
      <ul>
        <li>1. The base rate of income tax in case of an LLP is 30%, whereas for private limited companies, the base rate of tax is 22%</li>
        <li>2. A private limited company has a separate legal identity as compared to a LLP.</li>
        <li>3. There is a separation of ownership and management in a private limited company, whereas in Limited Liability Partnership (LLP), the partners are owners and the managers of the LLP.</li>
        <li>4. The venture capitalist prefers corporate structures over LLP structures.</li>
        <li>5. Due to stringent compliances and disclosures under various laws, Companies enjoy a high degree of creditworthiness as compared to LLPs</li>
      </ul>
    </div>
  ),
},
  {
    question: "What are some key/ basic documents required for conversion of a Limited Liability Partnership (LLP) into a company?",
    answer:(
    <div>
      <ul>
        <li>1. Particulars of members along with the proposed shareholding ratio</li>
        <li>2. Declaration of two or more directors verifying the particulars of all members</li>
        <li>3. Affidavit from all the partners for dissolution of the firm</li>
        <li>4. Copy of the LLP Agreement</li>
        <li>5. Copy of Newspaper advertisement in prescribed format</li>
        <li>6. Relevant certification from a CA/CS/CWA; etc.</li>
        <li>7. Consent of majority of members</li>
        <li>8. No objection certificate from the concerned Registrar of companies</li>
        <li>9. Certificate of registration of LLP</li>
        <li>10. Statement of accounts of the existing entity, prepared not later than 15 days preceding the date of application duly certified by auditor</li>
        <li>11. Undertaking by the proposed directors for compliance with requirements of Indian Stamp Act, 1899</li>
        <li>12. A copy of latest Income Tax Return of the firm</li>
        <li>13. Declaration/particulars as per DIR 8, DIR 2, 16(1), INC 9</li>
        <li>14. Bank Statement with current transactions</li>
        <li>15. KYC documents</li>
        <li>16. Electricity Bill, Rent Agreement, NOC by the owner of Registered office</li>
        <li>17. Dissolution Deed</li>
        <li>18. NOC unsecured creditors & secured creditors</li>
      </ul>
    </div>
  ),
},
  {
    question: "What is the procedure for conversion a Limited Liability Partnership (LLP) into a company?",
    answer:(
    <div>
      <ul>
        <li>1. Preparation of DSC and DIN of all proposed Directors</li>
        <li>2. Preparation and Filing of name application through web form RUN through MCA portal.</li>
        <li>3. Preparation and filing of E form URC 1, E form spice, E form Spice MOA & E form Spice AOA</li>
        <li>4. Appropriate Government fees is payable depending upon the authorized capital of the company.</li>
        <li>5. Issuance of Certificate of incorporation along with PAN and TAN.</li>
      </ul>
    </div>
  ),
},
  {
    question: "What is the time period within which the Conversion of LLP into a Company can be completed?",
    answer:
      "The process of Conversion of Partnership Firm into a LLP can take anywhere between 40 to 50 working days, subject to submission of correct information and complete documentation.",
  },
  {
    question: "How Legal Terminus can help you to convert a Limited Liability Partnership (LLP) into a private limited company?",
    answer:
      "Legal Terminus can help you with Conversion of Partnership Firm into a LLP in a hassle-free manner within a reasonable time span and competitive Professional fees. To know more please book a telephonic appointment with one of our consultants for free.",
  },
];

const FaqLLP = () => {
  // default closed (-1) so no answer opens automatically, but you can set 0 if you prefer open first
  const [activeIndex, setActiveIndex] = useState(-1);

  const toggleFaq = (index) => {
    setActiveIndex((prev) => (prev === index ? -1 : index));
  };

  return (
    <section className="LLP-to-PLC-section">
      <div className="LLP-to-PLC-container">
        {/* Left side – static text */}
        <div className="LLP-to-PLC-left">
          <h2 className="LLP-to-PLC-title">Conversion of LLP into Limited Liability Partnership FAQ's</h2>

          <p className="LLP-to-PLC-intro">
            Explore answers to common questions about Conversion of Limited Liability Partnership (LLP)  into Private Limited Company covering key benefits, eligibility, compliance requirements, partner roles, and comparison with other business structures to help you choose the best option for your needs.
          </p>
        </div>

        {/* Right side – scrollable Q&A list */}
        <div className="LLP-to-PLC-right">
          <div className="LLP-to-PLC-list">
            {faqs.map((item, index) => {
              const isActive = index === activeIndex;
              return (
                <div
                  key={index}
                  className={`LLP-to-PLC-item ${isActive ? "active" : ""}`}
                >
                  <button
                    type="button"
                    className="LLP-to-PLC-question"
                    onClick={() => toggleFaq(index)}
                    aria-expanded={isActive}
                    aria-controls={`LLP-to-PLC-answer-${index}`}
                  >
                    <span>{item.question}</span>
                    <span className={`LLP-to-PLC-icon ${isActive ? "open" : ""}`} aria-hidden>
                      ▾
                    </span>
                  </button>
                  {isActive && (
                    <div
                      id={`LLP-to-PLC-answer-${index}`}
                      className="LLP-to-PLC-answer"
                      role="region"
                      aria-labelledby={`LLP-to-PLC-question-${index}`}
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

export default FaqLLP;
