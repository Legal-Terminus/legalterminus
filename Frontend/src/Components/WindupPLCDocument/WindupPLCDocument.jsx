import React from "react";
import "./WindupPLCDocument.css";

const steps = [
  {
    title: "KYC Documents",
    desc: "PAN and Aadhaar of all proposed directors and shareholders along with address proof.",
    color: "gradient-blue",
  },
  {
    title: "Passport Photograph",
    desc: "Recent passport size photographs of all proposed directors and shareholders.",
    color: "gradient-green",
  },
  {
    title: "Electricity Bill",
    desc: "Latest electricity bill of the registered office address.",
    color: "gradient-yellow",
  },
  {
    title: "Rent Agreement",
    desc: "Duly notarised rent agreement (if office is rented).",
    color: "gradient-pink",
  },
  {
    title: "No Objection Certificate",
    desc: "NOC from the owner allowing use of premises as registered office.",
    color: "gradient-purple",
  },
];

const WindupPLCDocument = () => {
  return (
    <section className="doc-section">
      <div className="doc-wrapper">
         <div className="line l1"></div>

        <div className="doc-center">
          <h2>DOCUMENT</h2>
          <p>PROCESS STEPS</p>
        </div> 
        <div className="line l1"></div>
<div className="line l2"></div>
<div className="line l3"></div>
<div className="line l4"></div>
<div className="line l5"></div>


        {steps.map((step, index) => (
          <div key={index} className={`doc-card ${step.color} pos-${index}`}>
            <h4>{step.title}</h4>
            <p>{step.desc}</p>
          </div>
        ))}

      </div>
    </section>
  );
};

export default WindupPLCDocument;
