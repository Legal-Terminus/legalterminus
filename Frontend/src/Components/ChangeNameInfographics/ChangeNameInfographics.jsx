import React from "react";
import {
  FaBriefcase,
  FaProjectDiagram,
  FaCogs,
  FaChartBar,
  FaChartLine,
  FaUsers,
} from "react-icons/fa";

import "./ChangeNameInfographics.css";

const ChangeNameInfographics = () => {
  const data = [
    {
      id: "01",
      title: "FIRST OPTION",
      text: "Lorem ipsum dolor sit amet, consectetur adipiscing elit.",
      icon: <FaBriefcase />,
      color: "yellow",
    },
    {
      id: "02",
      title: "SECOND OPTION",
      text: "Lorem ipsum dolor sit amet, consectetur adipiscing elit.",
      icon: <FaProjectDiagram />,
      color: "orange",
    },
    {
      id: "03",
      title: "THIRD OPTION",
      text: "Lorem ipsum dolor sit amet, consectetur adipiscing elit.",
      icon: <FaCogs />,
      color: "pink",
    },
    {
      id: "04",
      title: "FOURTH OPTION",
      text: "Lorem ipsum dolor sit amet, consectetur adipiscing elit.",
      icon: <FaChartBar />,
      color: "purple",
    },
    {
      id: "05",
      title: "FIFTH OPTION",
      text: "Lorem ipsum dolor sit amet, consectetur adipiscing elit.",
      icon: <FaChartLine />,
      color: "blue",
    },
    {
      id: "06",
      title: "SIXTH OPTION",
      text: "Lorem ipsum dolor sit amet, consectetur adipiscing elit.",
      icon: <FaUsers />,
      color: "green",
    },
  ];

  return (
    <section className="ChangeNameInfographics-wrapper">
      <div className="ChangeNameInfographics-header">
        <h2>INFOGRAPHIC</h2>
        <div className="ChangeNameInfographics-dots">
          <span className="yellow"></span>
          <span className="orange"></span>
          <span className="pink"></span>
          <span className="purple"></span>
          <span className="blue"></span>
          <span className="green"></span>
        </div>
        <p>Lorem ipsum dolor sit amet, consectetur adipiscing elit.</p>
      </div>

      <div className="ChangeNameInfographics-grid">
        {data.map((item, i) => (
          <div
            key={i}
            className={`ChangeNameInfographics-card ${item.color}`}
          >
            <div className="ChangeNameInfographics-icon">{item.icon}</div>

            <h3 className="ChangeNameInfographics-number">{item.id}</h3>

            <h4 className="ChangeNameInfographics-title">{item.title}</h4>

            <p className="ChangeNameInfographics-text">{item.text}</p>
          </div>
        ))}
      </div>

      <div className="ChangeNameInfographics-timeline">
        {data.map((_, i) => (
          <span key={i}></span>
        ))}
      </div>
    </section>
  );
};

export default ChangeNameInfographics;