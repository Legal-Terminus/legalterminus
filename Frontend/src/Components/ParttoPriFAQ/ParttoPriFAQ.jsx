import React, { useState } from "react";
import "./ParttoPriFAQ.css";

const faqs = [
  {
    question: "What are some key benefits/ reasons for conversion of a partnership firm into a company?",
    answer:(
    <div>
      <ul>
        <li>1. Investors prefer corporate structures over partnership firms.</li>
        <li>2. The liability of the members or the directors are limited in case of a company whereas in case of partnership firm the liabilities are unlimited.</li>
        <li>3. A company is more transparent structure of business as compared to partnership firm</li>
        <li>4. The benefit of startup recognition under the startup India scheme of the government of India can be availed by a company and not by any partnership firm.</li>
        <li>5. The company has a separate legal identity as compared to a partnership firm.</li>
        <li>6. There is a separation of ownership and management in a company, whereas in partnership firm, the partners are owners and the managers of the firm</li>
      </ul>
    </div>
  ),
},
  {
    question: "What are some key/ basic documents required for conversion of a partnership firm into a company",
    answer:(
    <div>
      <ul>
        <li>1. Particulars of members along with the proposed shareholding ratio</li>
        <li>2. Declaration of two or more directors verifying the particulars of all members</li>
        <li>3. Affidavit from all the partners for dissolution of the firm</li>
        <li>4. Copy of the Partnership Deed</li>
        <li>5. Copy of Newspaper advertisement in prescribed format</li>
        <li>6. Relevant certification from a CA/CS/CWA; etc</li>
        <li>7. Consent of majority of members</li>
        <li>8. No objection certificate from the concerned Registrar of Firms</li>
        <li>9. Statement of accounts of the existing entity, prepared not later than 15 days preceding the date of application duly certified by auditor</li>
        <li>10. Undertaking by the proposed directors for compliance with requirements of Indian Stamp Act, 1899</li>
        <li>11. A copy of latest Income Tax Return of the firm</li>
        <li>12. Declaration/particulars as per DIR 8, DIR 2,16(1), INC 9</li>
        <li>13. Bank Statement with current transactions</li>
        <li>14. KYC documents</li>
        <li>15. Electricity Bill, Rent Agreement, NOC by the owner of Registered office</li>
        <li>16. Dissolution Deed</li>
        <li>17. NOC unsecured creditors &secured creditors</li>
      </ul>
    </div>
  ),
},
  {
    question: "What is the procedure for conversion a partnership firm into a company?",
    answer:(
    <div>
      <p><strong>Required Documents:</strong></p>
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
    question:
      "What is the time period within which the Conversion of Partnership Firm in Company can be completed?",
    answer:
      "The process of Conversion of Partnership Firm in Company can take anywhere between 40 to 50 working days, subject to submission of correct information and complete documentation.",
  },
  {
    question: "How Legal Terminus can help you to convert a partnership firm into a company?",
    answer:
      "Legal Terminus can help you with Conversion of Partnership Firm in Company in a hassle-free manner within a reasonable time span and competitive Professional fees. To know more please book a telephonic appointment with one of our consultants for free.",
  },
];

const FaqPvt = () => {
  const [activeIndex, setActiveIndex] = useState(0);

  const toggleFaq = (index) => {
    setActiveIndex((prev) => (prev === index ? -1 : index));
  };

  return (
    <section className="Partnership-to-PLC-faqsection">
      <div className="Partnership-to-PLC-faqcontainer">
        {/* Left side – static text */}
        <div className="Partnership-to-PLC-faqleft">
          <h2 className="Partnership-to-PLC-faqtitle">Conversion of Partnership into Private Limited Company FAQ's&apos;s</h2>

          <p className="Partnership-to-PLC-faqintro">
            Here, we’ve answered the most common questions about Conversion of Partnership into Private Limited Company covering documents, steps, and what happens.
          </p>
          <p className="Partnership-to-PLC-faqintro">
            
          </p>
        </div>

        {/* Right side – scrollable Q&A list */}
        <div className="Partnership-to-PLC-faqright">
          <div className="Partnership-to-PLC-faqlist">
            {faqs.map((item, index) => {
              const isActive = index === activeIndex;
              return (
                <div
                  key={index}
                  className={`Partnership-to-PLC-faqitem ${isActive ? "active" : ""}`}
                >
                  <button
                    type="button"
                    className="Partnership-to-PLC-faqquestion"
                    onClick={() => toggleFaq(index)}
                  >
                    <span>{item.question}</span>
                    <span className={`Partnership-to-PLC-faqicon ${isActive ? "open" : ""}`}>
                      ▾
                    </span>
                  </button>
                  {isActive && (
                   <div className={`Partnership-to-PLC-faqanswer ${isActive ? "open" : ""}`}>
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
