import React from "react";
import "./ESICRegOverview.css";
import ConsultationForm from '../ConsultationForm/ConsultationForm';

const eligibleEntities = [
  "Newspaper Establishments",
  "Private Educational Institutes",
  "Motor Transportation Units",
  "Cinemas",
  "Restaurants & Hotels",
  "Shops & Commercial Establishments"
];

const ESIRegistration = () => {

  return (
    <section className="esi-section">
      <div className="esi-container">

        {/* LEFT CARD */}
        <div className="esi-card">
          <h2 className="esi-title">Overview of ESI Registration</h2>
          <p>
            The Employees' State Insurance Act, 1948 provides social security
            benefits such as medical care and income protection to workers.
          </p>

          <ul className="esi-points">
            <li><strong>Employer Contribution:</strong> 3.25%</li>
            <li><strong>Employee Contribution:</strong> 0.75%</li>
            <li><strong>Salary Limit:</strong> ₹21,000/month</li>
          </ul>
        </div>

        {/* MIDDLE CARD */}
        <div className="esi-card">
          <h2 className="esi-title">Eligible Entities</h2>

          <div className="esi-entity-grid">
            {eligibleEntities.map((item, index) => (
              <div key={index} className="esi-entity-box">
                {item}
              </div>
            ))}
          </div>

          <p className="esi-note">
            Registration is mandatory for establishments employing 10 or more
            employees (20 in some states).
          </p>
        </div>

        {/* RIGHT FORM */}
        <ConsultationForm
          source="esic-registration"
          subtitle="Get response within 1 hour"
          title="Book a Free Consultation"
        />

      </div>
    </section>
  );
};

export default ESIRegistration;
