import React from "react";
import "./TrademarkImportance.css";

const Check = () => (
  <svg viewBox="0 0 24 24" width="16" height="16" fill="none" aria-hidden="true">
    <path d="M20 6L9 17l-5-5" stroke="currentColor" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round" />
  </svg>
);

const POINTS = [
  {
    title: "Protect Your Brand",
    text: "A trademark stops others from copying or using your brand name or logo without permission, keeping your business unique.",
  },
  {
    title: "Legal Rights",
    text: "Registering your trademark online gives you legal rights in India and other countries.",
  },
  {
    title: "Build Value",
    text: "A trademark adds value to your business by strengthening your brand's reputation and recognition.",
  },
  {
    title: "Attract Customers",
    text: "A registered trademark makes your brand easy to identify, helping to bring in loyal and new customers.",
  },
  {
    title: "Take Legal Action",
    text: "If someone uses your trademark without permission, you can take legal steps to stop them.",
  },
  {
    title: "Long-Term Protection",
    text: "Trademarks are valid for ten years and can be renewed, offering long-term security.",
  },
  {
    title: "Expand Your Reach",
    text: "With trademark registration, your business can grow and gain more recognition over time.",
  },
  {
    title: "Global Safety",
    text: "You can register your trademark internationally to protect it in other countries.",
  },
];

const TrademarkImportance = () => {
  return (
    <section className="tmimp-section">
      <div className="tmimp-container">
        <h2 className="tmimp-heading">Why is Trademark Registration Important?</h2>
        <p className="tmimp-intro">
          Trademark registration is essential because it protects your brand, helps it stand out, and
          builds trust with your customers. Here's why it matters:
        </p>

        <div className="tmimp-grid">
          {POINTS.map((p) => (
            <div className="tmimp-card" key={p.title}>
              <span className="tmimp-icon" aria-hidden="true">
                <Check />
              </span>
              <h3 className="tmimp-card-title">{p.title}</h3>
              <p className="tmimp-card-text">{p.text}</p>
            </div>
          ))}
        </div>

        <p className="tmimp-closing">
          Registering your trademark is an investment in your brand's future and success.
        </p>
      </div>
    </section>
  );
};

export default TrademarkImportance;
