import React, { useState } from "react";
import "./UdyamRegFAQ.css";

const faqs = [
  {
    q: "What is Udyam Registration and is it mandatory?",
    a: "Udyam Registration is the official government registration for Micro, Small, and Medium Enterprises (MSMEs) in India, issued by the Ministry of MSME. It is not mandatory for all businesses, but it is required to avail MSME benefits such as priority sector lending, government tender participation, and scheme subsidies.",
  },
  {
    q: "What are the MSME thresholds for 2025–26?",
    a: "Micro: Investment up to ₹1 Crore, Turnover up to ₹5 Crore. Small: Investment up to ₹10 Crore, Turnover up to ₹50 Crore. Medium: Investment up to ₹50 Crore, Turnover up to ₹250 Crore. Both investment and turnover must be within the limits simultaneously.",
  },
  {
    q: "Is there a government fee for Udyam Registration?",
    a: "No. The Government of India charges zero fee for Udyam Registration. Any platform charging a government fee is misrepresenting. Our professional service fee covers expert NIC code mapping, verification, and post-registration support.",
  },
  {
    q: "How long does Udyam Registration take?",
    a: "Once you share your details and complete Aadhaar OTP verification, the Udyam certificate is typically issued within the same business day. Legal Terminus files same-day for all clients who submit before 5:00 PM IST.",
  },
  {
    q: "Does Udyam Registration expire?",
    a: "No. Udyam Registration has lifetime validity. However, you are required to update your turnover and investment details annually on the Udyam portal based on your ITR filings to maintain accurate classification.",
  },
  {
    q: "Can a Pvt Ltd company or LLP get Udyam Registration?",
    a: "Yes. Udyam Registration is available to all legal entity types including Proprietorships, Partnership Firms, LLPs, Private Limited Companies, Public Limited Companies, co-operative societies, and Hindu Undivided Families (HUFs).",
  },
  {
    q: "What if my Aadhaar is not linked to my mobile number?",
    a: "The Udyam portal requires OTP-based Aadhaar authentication. If your mobile is not registered with UIDAI, you need to update it at an Aadhaar Seva Kendra before proceeding. Our team will guide you through this step.",
  },
  {
    q: "What is an NIC code and why does it matter?",
    a: "NIC (National Industrial Classification) code identifies your primary business activity. An incorrect NIC code can lead to classification disputes, missed scheme eligibility, or cancellation. Legal Terminus ensures the correct NIC code is mapped for your specific activity.",
  },
  {
    q: "Can I have multiple Udyam Registrations for different businesses?",
    a: "No. A single PAN can have only one Udyam Registration. However, if you have multiple business activities or locations under the same entity, they should all be covered under a single Udyam certificate.",
  },
  {
    q: "How does Legal Terminus help with Udyam Registration?",
    a: "We handle the entire process for you: reviewing your details, selecting the correct NIC code, completing Aadhaar OTP verification, filing on the government portal, and delivering your signed Udyam certificate. We also provide post-registration support for amendments and MSME scheme applications.",
  },
];

const UdyamRegFAQ = () => {
  const [open, setOpen] = useState(null);
  const toggle = (i) => setOpen(open === i ? null : i);

  return (
    <section className="faq-section">
      <div className="faq-container">
        <header className="faq-header">
          <h2 className="faq-title">Frequently Asked Questions</h2>
          <p className="faq-subtitle">Everything you need to know about Udyam / MSME Registration.</p>
        </header>
        <div className="faq-list">
          {faqs.map((item, i) => (
            <div className={`faq-item${open === i ? " faq-item--open" : ""}`} key={i}>
              <button className="faq-question" onClick={() => toggle(i)} aria-expanded={open === i}>
                <span>{item.q}</span>
                <span className="faq-icon">{open === i ? "−" : "+"}</span>
              </button>
              {open === i && <div className="faq-answer"><p>{item.a}</p></div>}
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default UdyamRegFAQ;
