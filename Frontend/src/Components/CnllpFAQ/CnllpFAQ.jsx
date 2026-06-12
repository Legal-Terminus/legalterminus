import React, { useState } from "react";
import "./CnllpFAQ.css";

const faqs = [
  {
    question: "Can an LLP change its name after registration?",
    answer:
      "Yes. Under the LLP Act, 2008, an LLP can change its name at any time with the consent of all partners. The new name is reserved through the RUN-LLP service, the LLP agreement is amended by a supplementary agreement, and Form 5 and Form 3 are filed with the ROC. On approval, a fresh Certificate of Incorporation is issued in the new name.",
  },
  {
    question: "Does changing the name create a new LLP?",
    answer:
      "No. A change of name does not create a new entity or affect the LLP's continuity. The LLPIN, the LLP's history, its assets, contracts, rights, and liabilities all continue unchanged — only the name on the records is updated. Existing agreements remain valid in the new name.",
  },
  {
    question: "Which forms are filed for an LLP name change?",
    answer:
      "Two main forms are filed: Form 5 (notice for change of name) intimates the ROC of the new name, and Form 3 records the supplementary LLP agreement reflecting the change. The new name must first be reserved through RUN-LLP before these forms are filed.",
  },
  {
    question: "How is the new name approved?",
    answer:
      "The proposed name is submitted through RUN-LLP, where the Registrar checks it against existing companies, LLPs, and trademarks and against the naming guidelines. It must not be identical or deceptively similar to an existing name or a registered trademark and must end with 'LLP' or 'Limited Liability Partnership'. Approval is at the MCA's discretion, so a prior search is important.",
  },
  {
    question: "Do all partners need to agree to the name change?",
    answer:
      "Yes. A change of name requires the consent of all partners, as it involves amending the LLP agreement. A supplementary LLP agreement recording the new name must be executed and signed by every partner and then filed with the ROC in Form 3.",
  },
  {
    question: "What happens to the LLP agreement when the name changes?",
    answer:
      "The LLP agreement must be amended to reflect the new name through a supplementary agreement, executed by all partners and stamped per the applicable state stamp duty. This supplementary agreement is filed in Form 3 so the MCA record of the LLP's constitution stays consistent with the new name.",
  },
  {
    question: "What needs to be updated after the name change?",
    answer:
      "Once the fresh Certificate of Incorporation is issued, the new name should be updated on the LLP's PAN, GST registration, bank account, Udyam, and any other licences, as well as on letterheads, invoices, signage, and statutory displays. Leaving any of these on the old name can cause mismatches and compliance issues.",
  },
  {
    question: "How long does an LLP name change take?",
    answer:
      "Timelines depend on name approval and ROC processing, but a typical name change is completed within a few weeks — name reservation through RUN-LLP, then filing Form 5 and Form 3 and obtaining the fresh COI. Downstream updates to PAN, GST, and bank follow once the new COI is issued.",
  },
  {
    question: "How does Legal Terminus help change my LLP's name?",
    answer:
      "We check name availability against the MCA and trademark databases, reserve the name through RUN-LLP, draft the partners' consent and supplementary LLP agreement, file Form 5 and Form 3, obtain the fresh Certificate of Incorporation, and then help update PAN, GST, bank, and licences — handing you a clean, fully-updated change. Book a free consultation to get started.",
  },
];

const CnllpFAQ = () => {
  const [activeIndex, setActiveIndex] = useState(0);

  const toggleFaq = (index) => {
    setActiveIndex((prev) => (prev === index ? -1 : index));
  };

  return (
    <section className="opcfaq-section">
      <div className="opcfaq-container">

        <div className="opcfaq-header">
          <h2 className="opcfaq-title">Change LLP Name — FAQs</h2>
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

export default CnllpFAQ;
