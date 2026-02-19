import React from "react";
import "./Section8Document.css";

const steps = [
  { id: "01", title: "Step One", color: "#ff4d6d" },
  { id: "02", title: "Step Two", color: "#ff8c00" },
  { id: "03", title: "Step Three", color: "#ffc107" },
  { id: "04", title: "Step Four", color: "#7cb342" },
  { id: "05", title: "Step Five", color: "#26a69a" },
  { id: "06", title: "Step Six", color: "#42a5f5" },
  { id: "07", title: "Step Seven", color: "#8e24aa" },
];

export default function Section8Document() {
  return (
    <section className="Section8Document">
      <h2 className="Section8Document-heading">
        Documents Required For Section 8 Company Registration in India
      </h2>

      <div className="Section8Document-wrapper">
        <div className="Section8Document-center">
          <h3>Document </h3>
          <span>Required</span>
        </div>

        {steps.map((step, i) => (
          <div
            key={step.id}
            className="Section8Document-step"
            style={{ "--i": i, "--clr": step.color }}
          >
            <div className="Section8Document-card">
              <span className="Section8Document-badge">
                STEP {step.id}
              </span>
              <h4>{step.title}</h4>
              <p>Lorem ipsum dolor sit amet consectetur adipisicing elit.</p>
            </div>
          </div>
        ))}
      </div>
    </section>
  );
}
