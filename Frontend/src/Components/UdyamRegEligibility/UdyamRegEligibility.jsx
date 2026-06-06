import React from "react";
import "./UdyamRegEligibility.css";

const categories = [
  {
    type: "Micro Enterprise",
    investment: "Up to ₹1 Crore",
    turnover: "Up to ₹5 Crore",
    color: "#22c55e",
  },
  {
    type: "Small Enterprise",
    investment: "Up to ₹10 Crore",
    turnover: "Up to ₹50 Crore",
    color: "#3b82f6",
  },
  {
    type: "Medium Enterprise",
    investment: "Up to ₹50 Crore",
    turnover: "Up to ₹250 Crore",
    color: "#f59e0b",
  },
];

const UdyamRegEligibility = () => {
  return (
    <section className="pvt-compare-section udyam-eligibility-section">
      <div className="pvt-compare-container">
        <header className="pvt-compare-header">
          <h2 className="pvt-compare-title">Udyam Eligibility Criteria (2025–26)</h2>
          <p className="pvt-compare-subtitle">
            The MSME classification is based on annual investment in plant &amp; machinery and annual turnover. All entities —
            manufacturing or service — use the same thresholds.
          </p>
        </header>

        <div className="udyam-eligibility-cards">
          {categories.map((cat, i) => (
            <div className="udyam-eligibility-card" key={i} style={{ borderTopColor: cat.color }}>
              <h3 className="udyam-eligibility-card-title" style={{ color: cat.color }}>{cat.type}</h3>
              <div className="udyam-eligibility-row">
                <span className="udyam-eligibility-label">Investment</span>
                <span className="udyam-eligibility-value">{cat.investment}</span>
              </div>
              <div className="udyam-eligibility-divider" />
              <div className="udyam-eligibility-row">
                <span className="udyam-eligibility-label">Annual Turnover</span>
                <span className="udyam-eligibility-value">{cat.turnover}</span>
              </div>
            </div>
          ))}
        </div>

        <div className="udyam-eligibility-notes">
          <p><strong>Note 1:</strong> Both investment AND turnover criteria must be satisfied simultaneously.</p>
          <p><strong>Note 2:</strong> Udyam Registration is open to Proprietorships, Partnerships, LLPs, Private Limited Companies, and other legal entities.</p>
          <p><strong>Note 3:</strong> Self-declaration on the Udyam portal is sufficient — no document upload required at the time of registration.</p>
        </div>
      </div>
    </section>
  );
};

export default UdyamRegEligibility;
