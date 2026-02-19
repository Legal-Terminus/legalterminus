import React, { useState } from "react";
import "./DissolvePrivateFAQ.css"; 

const faqs = [
  {
    question: "What are the advantages of winding up of a non-operational company?",
    answer:
      "The company becomes exempted from undertaking various applicable and onerous compliance. The company and its directors may avoid hefty penalties arising due to various non-compliance.",
  },
  {
    question: "What are certain pre-conditions for filing application for winding up a company?",
    answer:(
    <div>
      <ul>
        <li>1. Completion of all pending compliance</li>
        <li>2. Disposing off all assets and settling all liabilities</li>
        <li>3. Nil transaction in company’s bank account(s)for at least three months</li>
      </ul>
    </div>
  ),
},
  {
    question: "What are some key/ basic documents required for strike off a Company?",
    answer:(
    <div>
      <ul>
        <li>1. Consent letter from all shareholders and directors</li>
        <li>2. Affidavit from all the directors</li>
        <li>3. Indemnity bond from all directors</li>
        <li>4. PAN card of Company</li>
        <li>5. PAN card of all the directors.</li>
        <li>6. Aadhar card of all the directors</li>
        <li>7. Special resolution passed by the company for the winding up</li>
        <li>8. Application to ROC for winding up</li>
        <li>9. Statement of asset and liabilities duly certified by the Chartered Accountant</li>
        <li>10. Latest Income tax return filed by the company</li>
        <li>11. Closure letter of all the Bank accounts operated by the Company.</li>
        <li>12. All the registration Certificates obtained</li>
      </ul>
    </div>
  ),
},
  {
    question: "What is the procedure to winding up a Company voluntarily?",
    answer:(
    <div>
      <ul>
        <li>1. Convene a Board meeting and pass a resolution for winding up a company</li>
        <li>2. Issue a notice for calling General Meeting to take the approval of shareholders of the company</li>
        <li>3. In General meeting pass a special resolution for winding up</li>
        <li>4. Take the NOC from the creditor of the company</li>
        <li>5. File the application along with the respective documents as mentioned above to the registrar of companies</li>
      </ul>
      <p><strong>Appropriate Government fees is payable depending upon the authorized capital of the company.</strong></p>
    </div>
  ),
},
  {
    question: "What is the time period within which the process of winding up can be completed?",
    answer:
      "The time period required for winding up of Company shall depend upon various factor, however, based on our past experience it takes around 3 to 6 months to obtain a closure certificate from the department.",
  },
  {
    question: "How Legal Terminus can help you to wind up your Company?",
    answer:
      "Legal Terminus can help you with winding up in a hassle-free manner within a reasonable time span and competitive Professional fees. To know more please book a telephonic appointment with one of our consultants for free.",
  },
];

const DissolvePrivateFAQ = () => {
  const [activeIndex, setActiveIndex] = useState(0);

  const toggleFaq = (index) => {
    setActiveIndex((prev) => (prev === index ? -1 : index));
  };

  return (
    <section className="Dissolve-section">
      <div className="Dissolve-container">
        {/* Left side – static text */}
        <div className="Dissolve-left">
          <h2 className="Dissolve-title">Dissolve a Private Limited Company FAQ's&apos;s</h2>

          <p className="Dissolve-intro">
            Here, we’ve answered the most common questions about Dissolve a Private Limited Company covering documents, steps, and what happens after registration.
          </p>
        </div>

        {/* Right side – scrollable Q&A list */}
        <div className="Dissolve-right">
          <div className="Dissolve-list">
            {faqs.map((item, index) => {
              const isActive = index === activeIndex;
              return (
                <div
                  key={index}
                  className={`Dissolve-item ${isActive ? "active" : ""}`}
                >
                  <button
                    type="button"
                    className="Dissolve-question"
                    onClick={() => toggleFaq(index)}
                  >
                    <span>{item.question}</span>
                    <span className={`Dissolve-icon ${isActive ? "open" : ""}`}>
                      ▾
                    </span>
                  </button>
                  {isActive && (
                    <div className="Dissolve-answer">
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

export default DissolvePrivateFAQ;
