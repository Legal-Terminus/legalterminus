import React from "react";
import { FaRegFileAlt, FaCreditCard, FaHeadset, FaEnvelope, FaSearch, FaLaptop, FaChartLine } from "react-icons/fa";
import "./WorkingProcessPro.css";
import { THEME_C } from "../../utils/theme";

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

// Theme C (#209, the firm's review of 13 Oct, Home 6): the four steps the firm
// wrote, word for word. The live site keeps the four above until the redesign
// is released.
const STEPS_C = [
  {
    no: "01",
    title: "Choose Your Service",
    text: "Explore our services and select the legal or compliance service you need.",
    icon: <FaSearch />,
  },
  {
    no: "02",
    title: "Complete Your Application & Payment",
    text: "Submit the required details and complete the payment to get started.",
    icon: <FaCreditCard />,
  },
  {
    no: "03",
    title: "Access Your Client Portal",
    text: "Access your dedicated client portal to track work status, check pending requirements, upload documents, and stay updated on your application.",
    icon: <FaLaptop />,
  },
  {
    no: "04",
    title: "Track Progress & Manage Your Work",
    text: "View work history, access important documents, receive updates, and monitor the progress of your service from your portal.",
    icon: <FaChartLine />,
  },
];

const WorkingProcessPro = () => {
  const list = THEME_C ? STEPS_C : steps;
  return (
    <section className="WPI-section">
      <div className="WPI-header">
        <span className="WPI-badge">Legal Terminus</span>
        <h2 className="WPI-title">Our Working Process</h2>
        <p className="WPI-subtitle">Simple &amp; Transparent</p>
      </div>

      <div className="WPI-steps">
        {list.map((step, index) => (
          <div className="WPI-step" key={index}>
            <div className="WPI-icon-wrap">
              {step.icon}
              <span className="WPI-no">{step.no}</span>
            </div>
            {index < list.length - 1 && <div className="WPI-connector" />}
            <h4 className="WPI-step-title">{step.title}</h4>
            <p className="WPI-step-text">{step.text}</p>
          </div>
        ))}
      </div>
    </section>
  );
};

export default WorkingProcessPro;
