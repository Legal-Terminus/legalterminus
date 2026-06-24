import React from "react";
import "./TrademarkWhyChooseUs.css";

const IconBell = () => (
  <svg viewBox="0 0 24 24" width="24" height="24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
    <path d="M18 8a6 6 0 0 0-12 0c0 7-3 9-3 9h18s-3-2-3-9" />
    <path d="M13.73 21a2 2 0 0 1-3.46 0" />
  </svg>
);
const IconSearch = () => (
  <svg viewBox="0 0 24 24" width="24" height="24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
    <circle cx="11" cy="11" r="7" />
    <line x1="21" y1="21" x2="16.65" y2="16.65" />
  </svg>
);
const IconBadge = () => (
  <svg viewBox="0 0 24 24" width="24" height="24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
    <circle cx="12" cy="8" r="6" />
    <path d="M15.5 13.5 17 22l-5-3-5 3 1.5-8.5" />
  </svg>
);
const IconUsers = () => (
  <svg viewBox="0 0 24 24" width="24" height="24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
    <path d="M17 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2" />
    <circle cx="9" cy="7" r="4" />
    <path d="M23 21v-2a4 4 0 0 0-3-3.87" />
    <path d="M16 3.13a4 4 0 0 1 0 7.75" />
  </svg>
);
const IconStar = () => (
  <svg viewBox="0 0 24 24" width="24" height="24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
    <polygon points="12 2 15.09 8.26 22 9.27 17 14.14 18.18 21.02 12 17.77 5.82 21.02 7 14.14 2 9.27 8.91 8.26 12 2" />
  </svg>
);
const IconShield = () => (
  <svg viewBox="0 0 24 24" width="24" height="24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
    <path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z" />
    <path d="m9 12 2 2 4-4" />
  </svg>
);

const ITEMS = [
  {
    icon: <IconBell />,
    title: "Excellent Reminder Policy",
    text: "We ensure you never miss important trademark renewal or legal deadlines with our timely reminder service, keeping your business protected.",
  },
  {
    icon: <IconSearch />,
    title: "Free Search with Probability",
    text: "Get a quick, no-cost trademark search with a probability score to assess the likelihood of successful registration, helping you make informed decisions.",
  },
  {
    icon: <IconBadge />,
    title: "1000+ Trademarks Registered",
    text: "With years of expertise, we've successfully registered over 1,000+ trademarks, building trust with businesses across India.",
  },
  {
    icon: <IconUsers />,
    title: "5000+ Happy Clients",
    text: "Over 5000+ clients have trusted us with their trademark and legal needs, thanks to our reliable services and customer-first approach.",
  },
  {
    icon: <IconStar />,
    title: "Leading TM Consultant in Odisha",
    text: "As a leading trademark consultant in Odisha, we offer expert advice and efficient services for protecting your intellectual property.",
  },
  {
    icon: <IconShield />,
    title: "1000+ Litigation Cases Managed",
    text: "Our extensive experience managing over 1,000+ litigation cases ensures you're in safe hands when facing legal disputes.",
  },
];

const TrademarkWhyChooseUs = () => {
  return (
    <section className="tmwcu-section">
      <div className="tmwcu-container">
        <h2 className="tmwcu-heading">Why Choose Legal Terminus for Trademark Registration?</h2>
        <p className="tmwcu-intro">
          Registering your trademark protects your brand, builds customer trust, and makes your
          business stand out in a competitive market. Here's how we can help:
        </p>

        <div className="tmwcu-grid">
          {ITEMS.map((item) => (
            <div className="tmwcu-card" key={item.title}>
              <span className="tmwcu-icon" aria-hidden="true">{item.icon}</span>
              <h3 className="tmwcu-title">{item.title}</h3>
              <p className="tmwcu-text">{item.text}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default TrademarkWhyChooseUs;
