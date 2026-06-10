import React from "react";
import "./TradeLicenseDocuments.css";
import {
  FaRegLightbulb,
  FaUsers,
  FaChartLine,
  FaCogs,
  FaGlobe,
  FaHandshake,
  FaHeart,
} from "react-icons/fa";

const steps = [
  {
    num: "01",
    title: "Planning",
    desc: "Strategize your trade operations effectively with a clear roadmap.",
    icon: <FaRegLightbulb />,
    colorClass: "color-1",
  },
  {
    num: "02",
    title: "Documentation",
    desc: "Organize and verify all trade-related documents efficiently.",
    icon: <FaUsers />,
    colorClass: "color-2",
  },
  {
    num: "03",
    title: "Application",
    desc: "Apply for Trade License with accurate and verified information.",
    icon: <FaChartLine />,
    colorClass: "color-3",
  },
  {
    num: "04",
    title: "Approval",
    desc: "Authorities verify and approve your Trade License request.",
    icon: <FaCogs />,
    colorClass: "color-4",
  },
  {
    num: "05",
    title: "Operational Start",
    desc: "Begin your business operations with full compliance.",
    icon: <FaGlobe />,
    colorClass: "color-5",
  },
  {
    num: "06",
    title: "Support",
    desc: "Access ongoing assistance and renewals for your license.",
    icon: <FaHandshake />,
    colorClass: "color-6",
  },
];

const TradeLicenseDocuments = () => {
  return (
    <section className="trade-doc-section">
      <div className="trade-doc-container">

        {/* Header */}
        <div className="trade-doc-header">
          <h2 className="trade-doc-title">Trade License Documents</h2>
        </div>

        {/* Intro card */}
        <div className="trade-doc-center">
          <div className="trade-doc-center-icon">
            <FaHeart />
          </div>
          <div className="trade-doc-content">
            <h3>TRADE LICENSE</h3>
          </div>
        </div>

        {/* Step cards */}
        <div className="trade-doc-grid">
          {steps.map((step, index) => (
            <div key={index} className={`trade-doc-item ${step.colorClass}`}>
              <div className="trade-doc-inner">
                <div className="trade-doc-item-top">
                  <div className="trade-doc-icon">{step.icon}</div>
                  <span className="trade-doc-num">{step.num}</span>
                </div>
                <h4 className="trade-doc-subtitle">{step.title}</h4>
                <p className="trade-doc-desc">{step.desc}</p>
              </div>
            </div>
          ))}
        </div>

      </div>
    </section>
  );
};

export default TradeLicenseDocuments;
