import React, { useState } from "react";
import "../OPCFAQ/OPCFAQ.css";

const faqs = [
  {
    q: "How many members are required to form a Private Limited Company?",
    a: "A minimum of two persons are required to form a Private Limited Company, and a maximum of up to 200 persons can be members of a single Private Limited Company.",
  },
  {
    q: "How many directors does a Private Limited Company need?",
    a: "A minimum of two directors are required in a Private Limited Company, with an upper cap of up to 15 directors. At least one director must be a resident of India.",
  },
  {
    q: "Who are the directors of a company?",
    a: "Directors are officers of the company responsible for managing the company and making the decisions about its operation on a day-to-day basis, for the benefit of the shareholders.",
  },
  {
    q: "Who are the shareholders of a company?",
    a: "Shareholders are the owners of companies limited by shares. As the beneficial owners of a limited company, they are not involved in its day-to-day management or financial affairs.",
  },
  {
    q: "Is there a minimum capital requirement to register a company?",
    a: "No. A Private Limited Company can be incorporated with any amount of capital — there is no lower or upper limit on the capital. Government fees are relaxed for authorized capital up to ₹15,00,000.",
  },
  {
    q: "What are the basic documents needed for company registration?",
    a: "You need the PAN card of all directors/shareholders, ID proof (Passport/Voter ID/Aadhaar/Driving Licence), address proof (utility bill or bank statement, not older than 2 months), passport-size photographs, a rent agreement for the registered office, the latest electricity bill, and an NOC from the property owner.",
  },
  {
    q: "What is the procedure to register a Private Limited Company?",
    a: "It is a 7-step process: document submission, company name & objects finalisation, name reservation, obtaining Digital Signature Certificates, incorporation document preparation (MOA, AOA, SPICe+), final form upload and fee payment, and issuance of the Certificate of Incorporation.",
  },
  {
    q: "How long does company incorporation take?",
    a: "Incorporating a company can take anywhere between 10 to 15 working days, subject to submission of correct information and complete documentation.",
  },
  {
    q: "How does Legal Terminus assist with company registration in Odisha?",
    a: "Legal Terminus provides hassle-free incorporation within a reasonable timeframe at competitive, transparent fees. We are based in Bhubaneswar, offer 100% online assistance with a local office visit option, and provide a free telephonic consultation to understand your requirements before you commit.",
  },
];

const CroFAQ = () => {
  const [activeIndex, setActiveIndex] = useState(null);

  const toggle = (index) => {
    setActiveIndex(activeIndex === index ? null : index);
  };

  return (
    <section className="opcfaq-section" id="faq">
      <div className="opcfaq-container">
        <h2 className="opcfaq-title">Company Registration in Odisha — FAQs</h2>
        <p className="opcfaq-subtitle">
          Everything you need to know about registering your company in Bhubaneswar and across Odisha
        </p>

        <div className="opcfaq-list">
          {faqs.map((faq, index) => (
            <div
              className={`opcfaq-item ${activeIndex === index ? "active" : ""}`}
              key={index}
            >
              <button
                className="opcfaq-question"
                onClick={() => toggle(index)}
                aria-expanded={activeIndex === index}
              >
                <span>{faq.q}</span>
                <span className="opcfaq-icon">{activeIndex === index ? "−" : "+"}</span>
              </button>
              <div className="opcfaq-answer">
                <p>{faq.a}</p>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default CroFAQ;
