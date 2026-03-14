import React, { useState } from "react";
import "./DissolveLLPFAQ.css";

const faqs = [
  {
    question:
      "What are the advantages of winding up of a non-operational LLP?",
    answer:
      "The LLP becomes exempted from undertaking various applicable and onerous compliance. The LLP and its Designated Partners/ Partners may avoid hefty penalties arising due to various non-compliance.",
  },
  {
    question:
      "What are certain pre-conditions for filing application for winding up a company?",
    answer:(
    <div>
      <ul>
        <li>1. Completion of all pending compliance</li>
        <li>2. Disposing off all assets and settling all liabilities</li>
        <li>3. Nil transaction in company’s bank account(s) for at least three months</li>
      </ul>
    </div>
  ),
},
  {
    question: "What are the documents required for strike off of an LLP?",
    answer:(
    <div>
      <ul>
        <li>Consent letter from all Designated Partners or Partners</li>
        <li>Affidavit from all the Designated Partners or Partners</li>
        <li>Indemnity bond from all Designated Partners or Partners</li>
        <li>PAN card of LLP</li>
        <li>PAN card of all Designated Partners or Partners</li>
        <li>Aadhar card of all the Designated Partners or Partners</li>
        <li>Resolution passed by the LLP for the winding up</li>
        <li>Application to ROC for winding up</li>
        <li>Statement of asset and liabilities duly certified by the Chartered Accountant</li>
        <li>Latest Income tax return filed by the LLP</li>
        <li>Closure letter of all the Bank accounts operated by the LLP</li>
        <li>All the registration Certificates obtained</li>
      </ul>
    </div>
  ),
},
  {
    question: "What is the procedure to winding up an LLP voluntarily?",
    answer:(
    <div>
      <p><strong>Required Documents:</strong></p>
      <ul>
        <li>The LLP has to cease all its commercial activities and close its bank account</li>
        <li>Affidavit to be prepared by the Designated Partners and Partners</li>
        <li>Obtain CA certificate for Nil Assets & Nil Liabilities</li>
        <li>File the application along with the respective documents as mentioned above to the registrar of companies in form LLP 24</li>
        <li>Appropriate Government fees is payable depending upon the contribution of the LLP.</li>
      </ul>
    </div>
  ),
},
  {
    question:
      "What is the time period within which the process of winding up takes place?",
    answer:
      "The time period required for winding up of LLP shall depend upon various factor, however, based on our past experience it takes around 3 to 6 months to obtain a closure certificate from the department.",
  },
  {
    question:
      "How Legal Terminus can help you to wind up your LLP?",
    answer:
      "Legal Terminus can help you with winding up in a hassle-free manner within a reasonable time span and competitive Professional fees. To know more please book a telephonic appointment with one of our consultants for free.",
  },
];

const DissolveLLPFAQ = () => {
  const [activeIndex, setActiveIndex] = useState(0);

  const toggleFaq = (index) => {
    setActiveIndex((prev) => (prev === index ? -1 : index));
  };

  return (
    <section className="Dissllp-societys-section">
      <div className="Dissllp-societys-container">
        {/* LEFT */}
        <div className="Dissllp-societys-left">
          <h2 className="Dissllp-societys-title">
            Dissolve a Limited Liability Partnership FAQ's&apos;s
          </h2>

          <p className="Dissllp-societys-intro">
            Here, we’ve answered the most common questions about Dissolve a Limited Liability Partnership covering documents, steps, and what happens after registration.
          </p>
        </div>

        {/* Right side – scrollable Q&A list */}
        <div className="Diss-llp-faq-right">
          <div className="Diss-llp-faq-list">
            {faqs.map((item, index) => {
              const isActive = index === activeIndex;
              return (
                <div
                  key={index}
                  className={`faq-item ${isActive ? "active" : ""}`}
                >
                  <button
                    type="button"
                    className="Diss-llp-faq-question"
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

export default DissolveLLPFAQ;
