import React from "react";
import "./UdyamRegWhy.css";

const reasons = [
  {
    icon: "⚡",
    title: "Same-Day Filing",
    desc: "We file your Udyam registration on the same day you share your details. No queues, no delays — your certificate is issued by the Ministry of MSME within hours.",
  },
  {
    icon: "🎯",
    title: "Correct NIC Code, Always",
    desc: "NIC code errors are the #1 reason for MSME classification disputes. Our experts map your primary activity to the exact correct NIC code the first time.",
  },
  {
    icon: "🔒",
    title: "100% Secure & Compliant",
    desc: "Your Aadhaar and PAN details are handled with complete confidentiality. We use official government portals only — no third-party intermediaries.",
  },
  {
    icon: "🏆",
    title: "7+ Years of MSME Experience",
    desc: "With over 10,000 Udyam registrations filed across all 28 states and 8 union territories, we understand the nuances of MSME compliance better than anyone.",
  },
  {
    icon: "📞",
    title: "Post-Registration Support",
    desc: "Questions after registration? Need to update your Udyam details? Our team is available for guidance on amendments, renewals, and MSME scheme applications.",
  },
];

const UdyamRegWhy = () => {
  return (
    <section className="udyam-why-section">
      <div className="udyam-why-container">
        <header className="udyam-why-header">
          <h2 className="udyam-why-title">Why Choose Legal Terminus for Udyam Registration?</h2>
          <p className="udyam-why-subtitle">
            Thousands of Indian businesses trust us for their Udyam MSME registration. Here is why.
          </p>
        </header>
        <div className="udyam-why-grid">
          {reasons.map((item, i) => (
            <article className="udyam-why-card" key={i}>
              <div className="udyam-why-icon">{item.icon}</div>
              <h3 className="udyam-why-card-title">{item.title}</h3>
              <div className="udyam-why-underline" />
              <p className="udyam-why-card-text">{item.desc}</p>
            </article>
          ))}
        </div>
      </div>
    </section>
  );
};

export default UdyamRegWhy;
