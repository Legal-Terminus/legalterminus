import React, { useState } from "react";
import "./TrustFAQ.css"; 

const faqs = [
  {
    question: "What is the validity criteria of a Trust?",
    answer:(
    <div>
      <p><strong>Before proceeding to trust registration, you should know whether your trust is a valid trust. The state public trust laws do not state any essential ingredients of a valid trust. However, the Indian Trusts Act, 1882 which governs private trust states that a valid trust must:</strong></p>
      <ul>
        <li>Have a lawful purpose.</li>
        <li>Be for a beneficiary.</li>
        <li>Contain a property as its subject-matter.</li>
        <li>Such property must be transferable to the beneficiary.</li>
        <li>Be the creation of a person who is competent to contract.</li>
        <li>Have a written and signed document for immovable property.</li>
        <li>Appoint at least two trustees</li>
        <li>Have one settler.</li>
        <li>Be for an object (religious or charitable).</li>
        <li>Have two witnesses.</li>
      </ul>
    </div>
  ),
},
  {
    question: "How many persons are required to register a Public Trust?",
    answer:
      "Minimum of 3 members are required to form a Public Trust.",
  },
  {
    question: "What are some basic/ key documents required to register a Trust in India?",
    answer:(
    <div>
      <ul>
        <li>PAN Card (All the Members)</li>
        <li>ID Proof (All the Members) (Passport/ Voter ID/ Aadhar Card/ Driving License)</li>
        <li>Address Proof (All the Members) (Telephone Bill/ Mobile Bill/ Savings Bank Statement)</li>
        <li>Passport size Photograph (All the Members)</li>
        <li>All the documents mentioned above in point no 1 to 3 need to be self-signed by the respective proposed directors/ members/ shareholders All the utility bills or bank statements shall be less than 2 months old</li>
      </ul>
    </div>
  ),
  },
  {
    question: "What is the procedure to register a Trust in India?",
    answer:(
    <div>
      <p><strong>The broad process of registering a Trust involves following steps:</strong></p>
      <ul>
        <li>STEP 1 : Provision of requisite mentioned documents/information to us</li>
        <li>STEP 2 : Validating the documents/ information and processing the same</li>
        <li>STEP 3 : Filing of application and submission of the same</li>
        <li>STEP 4 : Payment of appropriate government fee as applicable</li>
        <li>STEP 5 : Processing of the application and issuance of registration certificate</li>
      </ul>
    </div>
  ),
  },
  {
    question: "What is the time period within which a Trust can be registered?",
    answer:
      "The process of registration of trust can take anywhere between 7 to 10 working days, subject to submission of correct information and complete documentation.",
  },
  {
    question: "How Legal Terminus can help you to register a Trust in India?",
    answer:
      "Legal Terminus can help you with to register a Trust for you, as and when required, in a hassle-free manner within a reasonable time span and for competitive professional fee. To know more, please book a telephonic appointment with one of our consultants free of charge.",
  },
];

const FaqTrust = () => {
  const [activeIndex, setActiveIndex] = useState(0);

  const toggleFaq = (index) => {
    setActiveIndex((prev) => (prev === index ? -1 : index));
  };

  return (
    <section className="trustfaq-section">
      <div className="trustfaq-container">
        {/* Left side – static text */}
        <div className="trustfaq-left">
          <h2 className="trustfaq-title">Trust Registration FAQ&apos;s</h2>

          <p className="trustfaq-intro">
            To help you get clarity, we&apos;ve answered the most common
            questions on trust registration in India — from documents and
            timelines to tax benefits and foreign trustees. Browse through the
            FAQs on the right to understand each step clearly before you
            register your trust.
          </p>
        </div>

        {/* Right side – scrollable Q&A list */}
        <div className="trustfaq-right">
          <div className="trustfaq-list">
            {faqs.map((item, index) => {
              const isActive = index === activeIndex;
              return (
                <div
                  key={index}
                  className={`trustfaq-item ${isActive ? "active" : ""}`}
                >
                  <button
                    type="button"
                    className="trustfaq-question"
                    onClick={() => toggleFaq(index)}
                  >
                    <span>{item.question}</span>
                    <span className={`trustfaq-icon ${isActive ? "open" : ""}`}>
                      ▾
                    </span>
                  </button>
                  {isActive && (
                    <div className="trustfaq-answer">
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

export default FaqTrust;
