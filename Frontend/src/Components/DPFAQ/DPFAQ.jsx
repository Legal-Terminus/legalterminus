import React, { useState } from "react";
import "./DPFAQ.css";

const faqs = [
  {
    question:
      "What are the situations where a court may intervene for dissolution of a partnership firm?",
    answer:(
    <div>
      <ul>
        <li>1. When one of the partners become of an unsound mind</li>
        <li>2. When a partner is guilty of misconduct</li>
        <li>3. When a partner is found guilty on the ground of breach of partnership agreement.</li>
        <li>4. When a partner has become permanently incapable of performing his duties as partner</li>
      </ul>
    </div>
  ),
},
  {
    question:
      "What are the situations where a dissolution of partnership firm occurs without intervention of a court?",
    answer:(
    <div>
      <ul>
        <li>1. Dissolution by mutual agreement (most popular way of dissolution)</li>
        <li>2. Where the partnership firm is formed for a particular period and after completion of such period the partner can dissolve the firm through a dissolution agreement.</li>
        <li>3. Where the partnership firm is formed for a particular purpose and after completion of such purpose the partner can dissolve the firm through a dissolution agreement.</li>
        <li>4. Where a partnership is at will, on the death of any partner the partnership firm gets dissolved.</li>
      </ul>
    </div>
  ),
},
  {
    question: "What is the procedure to voluntarily dissolve a partnership firm?",
    answer:(
    <div>
      <ul>
        <li>1. Settlement of all liabilities of the firm</li>
        <li>2. Transferring remaining balance (profit or loss) to partner’s accounts</li>
        <li>3. Closure of bank account of the firm</li>
        <li>4. Preparation and execution of a dissolution agreement</li>
        <li>5. Preparation and filing the income tax return of the firm upto the date of dissolution</li>
        <li>6. Surrendering all applicable registrations and obtaining NOCs/ closure certificates, as the case maybe</li>
      </ul>
    </div>
  ),
},
  {
    question:
      "What are the documents required for dissolution of partnership firm?",
    answer:(
    <div>
      <ul>
        <li>1. PAN card of partnership firm and all the partners.</li>
        <li>2. Original Partnership deed along with all supplementary deed if any.</li>
        <li>3. Closure letter of all the Bank accounts operated by the partnership firm.</li>
        <li>4. Address proof of all the partners.</li>
        <li>5. Rent agreement and utility bill of the address where the partnership firm is registered.</li>
        <li>6. Affidavit from all the partners for dissolution of the entity</li>
        <li>7. Financial Statement of the partnership firm of last 2 Financial year</li>
        <li>8. Financial Statement of partnership firm till the date of dissolution.</li>
        <li>9. All the registration Certificates obtained</li>
      </ul>
    </div>
  ),
},
{
    question:
      "What is the time period within which the process of dissolution can be completed?",
    answer:
      "The time period required for dissolution of Partnership Firm shall depend upon the number of registrations (govt.) obtained by the firm.",
  },
  {
    question:
      "What does the total fee involve for dissolution?",
    answer:
      "The fee shall depend upon various factors. Please book a free appointment with our consultant in order to have a clear understanding.",
  },
  {
    question: "How Legal Terminus can help you to dissolve your partnership firm?",
    answer:
      "Legal Terminus can help you with dissolution in a hassle-free manner within a reasonable time span and competitive Professional fees. To know more please book a telephonic appointment with one of our consultants for free.",
  },
];

const DPFAQ = () => {
  const [activeIndex, setActiveIndex] = useState(0);

  const toggleFaq = (index) => {
    setActiveIndex((prev) => (prev === index ? -1 : index));
  };

  return (
    <section className="DP-societys-section">
      <div className="DP-societys-container">
        {/* LEFT */}
        <div className="DP-societys-left">
          <h2 className="DP-societys-title">
            Dissolve a Partnership Firm FAQ's&apos;s
          </h2>

          <p className="DP-societys-intro">
            Here, we’ve answered the most common questions about Dissolve a Partnership Firm covering documents, steps, and what happens after registration.
          </p>
        </div>

        {/* RIGHT */}
        <div className="DP-societys-right">
          <div className="DP-societys-list">
            {faqs.map((item, index) => {
              const isActive = index === activeIndex;
              return (
                <div
                  key={index}
                  className={`DP-societys-item ${isActive ? "active" : ""}`}
                >
                  <button
                    className="DP-societys-question"
                    onClick={() => toggleFaq(index)}
                  >
                    <span>{item.question}</span>
                    <span className={`DP-societys-icon ${isActive ? "open" : ""}`}>
                      ▾
                    </span>
                  </button>

                  <div className={`DP-societys-answer ${isActive ? "open" : ""}`}>
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

export default DPFAQ;
