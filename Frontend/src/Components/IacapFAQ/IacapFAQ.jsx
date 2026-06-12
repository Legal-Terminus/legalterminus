import React, { useState } from "react";
import "./IacapFAQ.css";

const faqs = [
  {
    question: "What is authorised share capital?",
    answer:
      "Authorised capital is the maximum amount of share capital a company is permitted to issue to its shareholders, as stated in the capital clause of its Memorandum of Association. A company can issue paid-up shares only up to this ceiling. To issue shares beyond it, the authorised capital must first be increased.",
  },
  {
    question: "What is the difference between authorised and paid-up capital?",
    answer:
      "Authorised capital is the upper limit set in the MOA, while paid-up capital is the amount of shares actually issued to and paid for by shareholders. Paid-up capital can never exceed authorised capital. Increasing authorised capital raises the ceiling; it does not itself bring in money — that happens only when shares are allotted.",
  },
  {
    question: "When do I need to increase the authorised capital?",
    answer:
      "You need to increase it whenever you want to issue new shares that would take paid-up capital above the current authorised limit — for example, to onboard investors, infuse promoter funds, convert loans into equity, issue ESOPs, or strengthen the balance sheet for loans and tenders. If the new issue fits within the existing limit, no increase is needed.",
  },
  {
    question: "What is the procedure to increase authorised capital?",
    answer:
      "Under Section 61 of the Companies Act, 2013, the Articles must permit the increase (if not, they are amended first), the board approves and calls a general meeting, the members pass a resolution to increase the capital and alter the MOA capital clause, and Form SH-7 is filed with the ROC within 30 days along with the fee and stamp duty on the increase.",
  },
  {
    question: "Which form is filed to increase authorised capital?",
    answer:
      "Form SH-7 — the notice to the Registrar for alteration of share capital — is filed within 30 days of passing the resolution, with the altered MOA and the resolution attached. If the Articles had to be amended to permit the increase, Form MGT-14 is also filed for that special resolution.",
  },
  {
    question: "What does it cost to increase authorised capital?",
    answer:
      "The professional fee is separate from the government cost. The major government cost is the MCA fee plus state stamp duty calculated on the amount of the increase (not a flat fee), so a larger increase costs more. We compute the exact fee and stamp duty up front and bill them at actuals.",
  },
  {
    question: "Is a special resolution or an ordinary resolution required?",
    answer:
      "Increasing authorised capital under Section 61 generally requires an ordinary resolution of the members, unless the company's Articles specifically require a special resolution. However, if the Articles do not permit an increase at all, they must first be amended by a special resolution (filed via Form MGT-14) before the increase can be carried out.",
  },
  {
    question: "Do I have to issue shares immediately after increasing capital?",
    answer:
      "No. Increasing authorised capital simply raises the ceiling up to which shares can be issued. You can allot the new shares whenever you are ready — when an investor comes in, a loan is converted, or funds are infused. The allotment is a separate step involving a board resolution, payment, and filing of Form PAS-3.",
  },
  {
    question: "How does Legal Terminus help increase authorised capital?",
    answer:
      "We check the AOA, draft the board and members' resolutions, EGM notice, and the altered MOA capital clause, compute the MCA fee and stamp duty on the increase, file Form SH-7 (and MGT-14 if the AOA needs amendment) within the deadline, and — where included — handle the subsequent share allotment and Form PAS-3. Book a free consultation to get started.",
  },
];

const IacapFAQ = () => {
  const [activeIndex, setActiveIndex] = useState(0);

  const toggleFaq = (index) => {
    setActiveIndex((prev) => (prev === index ? -1 : index));
  };

  return (
    <section className="opcfaq-section">
      <div className="opcfaq-container">

        <div className="opcfaq-header">
          <h2 className="opcfaq-title">Increase Authorised Capital — FAQs</h2>
          <p className="opcfaq-intro">
            Got questions? We've got answers — straight, no-BS, legally accurate.
          </p>
        </div>

        <div className="opcfaq-list">
          {faqs.map((item, index) => {
            const isActive = index === activeIndex;
            return (
              <div
                key={index}
                className={`opcfaq-item ${isActive ? "active" : ""}`}
              >
                <button
                  type="button"
                  className="opcfaq-question"
                  onClick={() => toggleFaq(index)}
                >
                  <span>{item.question}</span>
                  <span className={`opcfaq-icon ${isActive ? "open" : ""}`}>▾</span>
                </button>
                <div className={`opcfaq-answer ${isActive ? "open" : ""}`}>
                  <div className="opcfaq-answer-content">{item.answer}</div>
                </div>
              </div>
            );
          })}
        </div>

      </div>
    </section>
  );
};

export default IacapFAQ;
