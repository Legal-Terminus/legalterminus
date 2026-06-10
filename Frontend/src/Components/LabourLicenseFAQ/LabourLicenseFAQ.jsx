import React, { useState } from "react";
import "./LabourLicenseFAQ.css";

const faqs = [
  {
    question: "Who needs a Labour Licence under the CLRA Act?",
    answer:
      "The Contract Labour (Regulation & Abolition) Act, 1970 applies to every establishment (the principal employer) and every contractor that engages 20 or more contract workmen on any day of the preceding 12 months. The principal employer must obtain a Certificate of Registration (RC) and the contractor must hold a Labour Licence. Some states have notified lower thresholds, so applicability is confirmed against the relevant state amendment.",
  },
  {
    question: "What is the difference between Principal Employer Registration and a Contractor Licence?",
    answer:
      "The Principal Employer Registration (Certificate of Registration / RC in Form I → certificate) is taken by the establishment that engages contract labour through contractors. The Contractor Licence (Form IV → Licence in Form VI) is taken by the contractor who actually supplies and employs the workmen. Both are required for a fully compliant engagement — the contractor's licence application even depends on Form V issued by the registered principal employer.",
  },
  {
    question: "Who is the 'Principal Employer' and who is the 'Contractor'?",
    answer:
      "The principal employer is the person responsible for the supervision and control of the establishment — the owner/occupier/manager of a factory, the head of a government office, or the person in charge of any other establishment. The contractor is the person who employs or supplies contract labour to the principal employer to carry out work.",
  },
  {
    question: "What is the validity of a labour licence?",
    answer:
      "A labour licence (and registration) is valid for a period of 1 year and must be renewed before expiry. Renewal applications can be filed up to 30 days before the date of expiry to ensure continuous compliance and to avoid the late-renewal surcharge.",
  },
  {
    question: "How long does it take to obtain a labour licence?",
    answer:
      "The Registering / Licensing Officer issues the registration or licence within about 30 working days of receiving a complete application. Timelines can extend if the department raises clarifications or schedules a worksite inspection — we respond to any query within 24 hours on your behalf to keep the file moving.",
  },
  {
    question: "What are the government fees for a labour licence?",
    answer:
      "CLRA fees are slab-based and vary by state. They typically include a one-time principal-employer registration fee, a per-workman contractor licence fee, and a refundable security deposit per workman. For a 50-workman engagement the total government outlay (fee + deposit) is usually ₹5,000–₹12,000, billed at actuals. These are over and above our professional fee.",
  },
  {
    question: "What is Form V and why is it needed?",
    answer:
      "Form V is a certificate issued by the principal employer confirming that the establishment is registered under the CLRA Act and that the principal employer has authorised the contractor to employ contract labour. The contractor must attach Form V to the licence application (Form IV) — without it the contractor licence cannot be granted. We coordinate Form V as part of our service.",
  },
  {
    question: "What happens if contract labour is engaged without registration or a licence?",
    answer:
      "Engaging contract labour without the required registration or licence is an offence under Sections 23 and 24 of the CLRA Act. Penalties include imprisonment up to 3 months and/or a fine up to ₹1,000, with an additional fine for each day the contravention continues. The principal employer may also inherit the contractor's wage, PF, and ESI liabilities.",
  },
  {
    question: "Does the licence need to be renewed and what are the registers to maintain?",
    answer:
      "Yes — the licence is renewed annually, before expiry. Alongside the licence, contractors and principal employers must maintain statutory registers and records such as the register of contractors, muster roll, wage register, register of workmen, and file half-yearly/annual returns. Our compliance plans include reminders and templates for these.",
  },
  {
    question: "How can Legal Terminus help me obtain a labour licence?",
    answer:
      "Legal Terminus handles the entire CLRA process end-to-end — applicability check, Form I/IV/V drafting, Form V coordination with the principal employer, security deposit calculation, department filing, query response, and certificate delivery — for a competitive professional fee. Book a free telephonic appointment with one of our consultants to get started.",
  },
];

const LabourLicenseFAQ = () => {
  const [activeIndex, setActiveIndex] = useState(0);

  const toggleFaq = (index) => {
    setActiveIndex((prev) => (prev === index ? -1 : index));
  };

  return (
    <section className="opcfaq-section">
      <div className="opcfaq-container">

        <div className="opcfaq-header">
          <h2 className="opcfaq-title">Labour Licence (CLRA) Registration — FAQs</h2>
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

export default LabourLicenseFAQ;
