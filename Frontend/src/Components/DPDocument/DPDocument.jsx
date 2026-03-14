import React from "react";
import "./DPDocument.css";

const steps = [
  { id: "01", title: "Research", icon: "🔍" },
  { id: "02", title: "Ideation", icon: "💡" },
  { id: "03", title: "Development", icon: "⚙️" },
  { id: "04", title: "Documentation", icon: "📝" },
  { id: "05", title: "Collaboration", icon: "🤝" },
  { id: "06", title: "Analysis", icon: "📊" },
];

export default function DPDocument() {
  return (
    <section className="perfect-circle-section">
      <div className="perfect-header">
        <h2>Dissolve Partnership Registration Process</h2>
      </div>

      <div className="perfect-wrapper">

        <div className="main-circle">
          <h3>PROCESS</h3>
          <span>6 Steps</span>
        </div>

        {steps.map((step, index) => (
          <div
            key={step.id}
            className="orbit-item"
            style={{ "--i": index }}
          >
            <div className="orbit-circle">
              <span className="orbit-icon">{step.icon}</span>
              <small>{step.id}</small>
            </div>
            <p>{step.title}</p>
          </div>
        ))}

      </div>
    </section>
  );
}
