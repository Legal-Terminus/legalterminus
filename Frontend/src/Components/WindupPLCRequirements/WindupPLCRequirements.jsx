import React from "react";
import "./WindupPLCRequirements.css";

const WindupPLCRequirements = () => {
  return (
    <section className="Windup-PLC-req-section">
      <div className="Windup-PLC-req-container">
        {/* Heading + intro */}
        <header className="Windup-PLC-req-header">
          <h2 className="Windup-PLC-req-title">
            Benefits of Private Limited Company Registration in India
          </h2>
          <p className="Windup-PLC-req-subtitle">
            The Ministry of Corporate Affairs (MCA) manages the company registration process in India. It includes registering the business with the Registrar of Companies (RoC) and obtaining a Digital Signature Certificate (DSC) and Director Identification Number (DIN).


          </p>
        </header>

        {/* Cards */}
        <div className="Windup-PLC-req-grid">
          {/* 1 */}
          <article className="Windup-PLC-req-card">
            <h3 className="Windup-PLC-req-card-title">Separate Legal Identity</h3>
            <div className="Windup-PLC-req-card-underline" />
            <p className="Windup-PLC-req-card-text">
Once registered, a company becomes its own legal entity. It can own property, sign contracts, and operate separately from its owners.

            </p>
          </article>

          {/* 2 */}
          <article className="Windup-PLC-req-card">
            <h3 className="Windup-PLC-req-card-title">Limited Liability Protection</h3>
            <div className="Windup-PLC-req-card-underline" />
            <p className="Windup-PLC-req-card-text">
              The personal assets of shareholders are safe from company debts and risks, ensuring financial protection.
            </p>
          </article>

          {/* 3 */}
          <article className="Windup-PLC-req-card">
            <h3 className="Windup-PLC-req-card-title">
              Access to Government Schemes
            </h3>
            <div className="Windup-PLC-req-card-underline" />
            <p className="Windup-PLC-req-card-text">
              Registered companies can benefit from government schemes like Startup India for tax benefits and easier compliance, and Make in India for incentives and support for manufacturing businesses.
            </p>
          </article>

          {/* 4 */}
          <article className="Windup-PLC-req-card">
            <h3 className="Windup-PLC-req-card-title">
              Increased Credibility
            </h3>
            <div className="Windup-PLC-req-card-underline" />
            <p className="Windup-PLC-req-card-text">
              A registered company is more trusted by investors, clients, and vendors, making it easier to get funding and partnerships.
            </p>
          </article>
        </div>
      </div>
    </section>
  );
};

export default WindupPLCRequirements;
