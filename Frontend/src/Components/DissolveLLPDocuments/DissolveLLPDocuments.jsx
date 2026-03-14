import React from "react";
import "./DissolveLLPDocuments.css";

const items = [
  { id: "01", title: "Research", icon: "🔍" },
  { id: "02", title: "Ideation", icon: "💡" },
  { id: "03", title: "Development", icon: "⚙️" },
  { id: "04", title: "Documentation", icon: "📝" },
  { id: "05", title: "Collaboration", icon: "🤝" },
  { id: "06", title: "Analysis", icon: "📊" },
];

export default function DissolveLLPDocuments() {
  return (
    <section className="zigzag-section">
      <div className="zigzag-header">
        <h2>Dissolve LLP Registration Process</h2>
      </div>

      <div className="zigzag-wrapper">

        {/* Curved SVG Line */}
        <svg className="zigzag-line" viewBox="0 0 1200 400">
          <path
            d="M0,200 C200,50 400,350 600,200 C800,50 1000,350 1200,200"
            fill="none"
            stroke="url(#gradientLine)"
            strokeWidth="4"
          />
          <defs>
            <linearGradient id="gradientLine" x1="0%" y1="0%" x2="100%" y2="0%">
              <stop offset="0%" stopColor="#6366f1" />
              <stop offset="50%" stopColor="#06b6d4" />
              <stop offset="100%" stopColor="#22c55e" />
            </linearGradient>
          </defs>
        </svg>

        {items.map((item, index) => (
          <div
            key={item.id}
            className={`zigzag-step ${
              index % 2 === 0 ? "top" : "bottom"
            }`}
          >
            <div className={`zigzag-circle color-${index}`}>
              <span className="zigzag-icon">{item.icon}</span>
              <span className="zigzag-id">{item.id}</span>
            </div>
            <h4>{item.title}</h4>
          </div>
        ))}

      </div>
    </section>
  );
}
