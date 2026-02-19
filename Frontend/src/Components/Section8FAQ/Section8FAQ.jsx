import React, { useState } from "react";
import "./Section8FAQ.css";

const faqs = [
  {
    question: "How many persons are required to form a Sec 8 company?",
    answer:
      "Minimum two persons are required to form a Sec 8 Company if it incorporated as a Private Limited Company and minimum 7 persons are required if is incorporated as Public Company. Further, a maximum number of up to 200 persons can be a member of a single Sec 8 Company if it is incorporated as Public company and there is no maximum limit of members if it is incorporated as Public company.",
  },
  {
    question: "How many Directors are required to form a Sec 8 company?",
    answer:
      "Minimum two directors are required in a Sec 8 Company if is incorporated as private limited and minimum 3 directors are required if it incorporated as public limited company.",
  },
  {
    question: "Who are Directors of the company?",
    answer:
      "Directors are officers of the company who are responsible for managing the company and making the decisions as to its operation on a day to day basis, for the benefit of the shareholders.",
  },
  {
    question: "What is a company shareholder?",
    answer:
      "Shareholders are the owners of companies limited by shares. As the beneficial owners of a limited company, they are not involved in day-to-day management or financial affairs. They are also called 'members' and they agree to become part of a company by taking a minimum of one share in it. The quantity of shares held by each person represents how much of the business they own.",
  },
  {
    question: "How much capital is required to form a Sec 8 company?",
    answer:
      "The Sec 8 company can be incorporated with any amount of capital and there is no lower or upper limit to it, if it is incorporated as Private Limited company. However, minimum of Rs. 5,00,000/- capital shall be required to incorporate a Sec 8 Company as a Public Limited Company.",
  },
  {
    question: "What documents are required to incorporate a Private Limited Company?",
    answer:(
    <div>
      <ul>
        <li>PAN Card (All the Proposed Directors and/or Shareholders)</li>
        <li>ID Proof (All the Proposed Directors and/or Shareholders)(Passport/ Voter ID/ Aadhar Card/ Driving License)</li>
        <li>Address Proof (All the Proposed Directors and/or Shareholders)(Telephone Bill/ Mobile Bill/ Savings Bank Statement)</li>
        <li>Passport size Photograph (All the Proposed Directors and/or Shareholders)</li>
        <li>Rent Agreement (For proposed company Address)</li>
        <li>Electricity bill</li>
        <li>A permission letter from the owner about use of his premises for registered office of the proposed company. All the documents mentioned above in point no 1 to 3 need to be self-signed by the respective proposed directors/ members/ shareholders *All the utility bills or bank statements shall be less the 2 months old</li>
      </ul>
    </div>
  ),
},
  {
    question: "What is the procedure to register a Sec 8 Company?",
    answer:(
    <div>
      <p><strong>The broad process of registering a Sec 8 Company involves following steps:</strong></p>
      <ul>
        <li>STEP 1: Provision of requisite mentioned documents/information to us</li>
        <li>STEP 2: Validating the documents/ information and processing the same</li>
        <li>STEP 3: Filing of application and submission of the same in online manner</li>
        <li>STEP 4: Payment of appropriate government fee as applicable</li>
        <li>STEP 5: Processing of the application and issuance of registration certificate</li>
      </ul>
    </div>
  ),
  },
  {
    question: "What is the time period within which a Sec 8 Company can be incorporated?",
    answer:
      "The process of incorporating a Sec 8 Company can take anywhere between 10 to 15 working days, subject to submission of correct information and complete documentation.",
  },
  {
    question: "How Legal Terminus can help you incorporate a Sec 8 Company in India?",
    answer:
      "Legal Terminus can help you with incorporation of Sec 8 Company for you, as and when required, in a hassle-free manner within a reasonable time span and for competitive professional fee. To know more, please book a telephonic appointment with one of our consultants free of charge.",
  },
];

const Section8FAQ = () => {
  const [activeIndex, setActiveIndex] = useState(0);

  const toggleFaq = (index) => {
    setActiveIndex((prev) => (prev === index ? -1 : index));
  };

  return (
    <section className="s8faq-section">
      <div className="s8faq-container">

        {/* LEFT */}
        <div className="s8faq-left">
          <h2 className="s8faq-title">
            Incorporation Company Registration FAQ&apos;s
          </h2>

          <p className="s8faq-intro">
            Starting a Section 8 Company Registration in India is an important step for
            any business owner. With the right support, the process can be simple
            and stress-free.
            <br /><br />
            Below are answers to the most common questions related to section 8 company
            registration.
          </p>
        </div>

        {/* RIGHT */}
        <div className="s8faq-right">
          <div className="s8faq-list">
            {faqs.map((item, index) => {
              const isActive = index === activeIndex;
              return (
                <div
                  key={index}
                  className={`s8faq-item ${isActive ? "active" : ""}`}
                >
                  <button
                    className="s8faq-question"
                    onClick={() => toggleFaq(index)}
                  >
                    <span>{item.question}</span>
                    <span className={`s8faq-icon ${isActive ? "open" : ""}`}>
                      ▾
                    </span>
                  </button>

                  <div
                    className={`s8faq-answer ${
                      isActive ? "open" : ""
                    }`}
                  >
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

export default Section8FAQ;
