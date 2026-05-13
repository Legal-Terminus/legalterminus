import React from "react";
import { FaRegFileAlt, FaCreditCard, FaHeadset, FaEnvelope } from "react-icons/fa";
import "./WorkingProcessPro.css";

const steps = [
  {
    no: "01",
    title: "Application",
    text: "Fill out the application form",
    icon: <FaRegFileAlt />,
  },
  {
    no: "02",
    title: "Payment",
    text: "Complete the online payment",
    icon: <FaCreditCard />,
  },
  {
    no: "03",
    title: "Processing",
    text: "Our executive processes your application",
    icon: <FaHeadset />,
  },
  {
    no: "04",
    title: "Confirmation",
    text: "Receive confirmation via email",
    icon: <FaEnvelope />,
  },
];

const WorkingProcessPro = () => {
  return (
    <section className="WPI-section">
      <div className="WPI-header">
        <span className="WPI-badge">Legal Terminus</span>
        <h2 className="WPI-title">Our Working Process</h2>
        <p className="WPI-subtitle">Simple &amp; Transparent</p>
      </div>

      <div className="WPI-steps">
        {steps.map((step, index) => (
          <div className="WPI-step" key={index}>
            <div className="WPI-icon-wrap">
              {step.icon}
              <span className="WPI-no">{step.no}</span>
            </div>
            {index < steps.length - 1 && <div className="WPI-connector" />}
            <h4 className="WPI-step-title">{step.title}</h4>
            <p className="WPI-step-text">{step.text}</p>
          </div>
        ))}
      </div>
    </section>
  );
};

export default WorkingProcessPro;
