import React, { useState } from "react";
import "./SocietyFAQ.css";

const faqs = [
  {
    question:
      "What is a Society?",
    answer:(
    <div>
      <p><strong>Society registration in India takes place under The Societies Registration Act, 1860. A society is an entity that works for promoting any of the below-mentioned activities or purposes.</strong></p>
      <ul>
        <li>Science</li>
        <li>Art</li>
        <li>Literature</li>
        <li>Education</li>
        <li>Charity</li>
        <li>Public museums</li>
        <li>Libraries</li>
        <li>Creating military orphan funds etc.</li>
      </ul>
    </div>
  ),
},
  {
    question:
      "How many persons are required to register a Society?",
    answer:
      "Minimum of 7 members are required to form a Society.",
  },
  {
    question: "What are some basic/ key documents required to register a Society in India?",
    answer:(
    <div>
      <ul>
        <li>PAN Card (All the Members)</li>
        <li>ID Proof (All the Members) (Passport/ Voter ID/ Aadhar Card/ Driving License)</li>
        <li>Address Proof (All the Members& office of the proposed society) (Telephone Bill/ Mobile Bill/ Savings Bank Statement)</li>
        <li>Passport size Photograph (All the Members)</li>
        <li>All the documents mentioned above in point no 1 to 3 need to be self-signed by the respective proposed directors/ members/ shareholders All the utility bills or bank statements shall be less the 2 months old</li>
      </ul>
    </div>
  ),
},
  {
    question: "What is the procedure to register a Society in India?",
    answer:(
    <div>
      <p><strong>The broad process of registering a Society involves following steps:</strong></p>
      <ul>
        <li>STEP 1: Provision of requisite mentioned documents/information to us</li>
        <li>STEP 2: Validating the documents/ information and processing the same</li>
        <li>STEP 3: Filing of application and submission of the same</li>
        <li>STEP 4: Payment of appropriate government fee as applicable</li>
        <li>STEP 5: Processing of the application and issuance of registration certificate</li>
      </ul>
    </div>
  ),
},
  {
    question:
      "What is the time period within which a Society can be registered?",
    answer:
      "The process of registration of Society can take anywhere between 7 to 10 working days, subject to submission of correct information and complete documentation.",
  },
  {
    question:
      "How Legal Terminus can help you to register a Society in India?",
    answer:
      "Legal Terminus can help you with to register a Society for you, as and when required, in a hassle-free manner within a reasonable time span and for competitive professional fee. To know more, please book a telephonic appointment with one of our consultants free of charge. ",
  },
];

const SocietyFAQ = () => {
  const [activeIndex, setActiveIndex] = useState(0);

  const toggleFaq = (index) => {
    setActiveIndex((prev) => (prev === index ? -1 : index));
  };

  return (
    <section className="new-societys-section">
      <div className="new-societys-container">
        {/* LEFT */}
        <div className="new-societys-left">
          <h2 className="new-societys-title">
            Society Registration in India FAQ&apos;s
          </h2>

          <p className="new-societys-intro">
            Find clear and simple answers to the most common questions about society registration, documents required, process, fees, and benefits. This section helps you understand the basic requirements and steps before starting the registration process.
          </p>
        </div>

        {/* RIGHT */}
        <div className="new-societys-right">
          <div className="new-societys-list">
            {faqs.map((item, index) => {
              const isActive = index === activeIndex;
              return (
                <div
                  key={index}
                  className={`new-societys-item ${isActive ? "active" : ""}`}
                >
                  <button
                    className="new-societys-question"
                    onClick={() => toggleFaq(index)}
                  >
                    <span>{item.question}</span>
                    <span className={`new-societys-icon ${isActive ? "open" : ""}`}>
                      ▾
                    </span>
                  </button>

                  <div className={`new-societys-answer ${isActive ? "open" : ""}`}>
                    <p>{item.answer}</p>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      </div>
    </section>
  );
};

export default SocietyFAQ;
