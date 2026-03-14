import React from "react";
import "./AddRequirementsTab.css";

const AddRequirementsTab = () => {
  return (
    <section className="Add-reqsection">
      <div className="Add-reqcontainer">
        {/* Heading + intro */}
        <header className="Add-reqheader">
          <h2 className="Add-reqtitle">
            Benefits of Add Or Remove A Director (Company)
          </h2>
          <p className="Add-reqsubtitle">
            Adding or removing a director ensures effective governance, regulatory compliance, and better decision-making. It helps strengthen leadership and align the company with its growth objectives.
          </p>
        </header>

        {/* Cards */}
        <div className="Add-reqgrid">
          {/* 1 */}
          <article className="Add-reqcard">
            <h3 className="Add-reqcard-title">Brings New Skills and Expertise</h3>
            <div className="Add-reqcard-underline" />
            <p className="Add-reqcard-text">
              Adding a director can bring valuable knowledge in areas like finance, technology, or management, helping the company grow and make better decisions.
            </p>
          </article>

          {/* 2 */}
          <article className="Add-reqcard">
            <h3 className="Add-reqcard-title">Improves Board Performance</h3>
            <div className="Add-reqcard-underline" />
            <p className="Add-reqcard-text">
               Removing an inactive or non-performing director helps keep the board strong, responsible, and aligned with the company’s goals.</p>
          </article>

          {/* 3 */}
          <article className="Add-reqcard">
            <h3 className="Add-reqcard-title">
              Ensures Legal Compliance
            </h3>
            <div className="Add-reqcard-underline" />
            <p className="Add-reqcard-text">
              It helps the company maintain the required minimum number of directors as per law, avoiding penalties or legal issues.</p>
          </article>

          {/* 4 */}
          <article className="Add-reqcard">
            <h3 className="Add-reqcard-title">
              Better Management and Work Distribution
            </h3>
            <div className="Add-reqcard-underline" />
            <p className="Add-reqcard-text">
              Appointing new directors helps share responsibilities effectively, especially when the company is expanding or handling more operations.
            </p>
          </article>
        </div>
      </div>
    </section>
  );
};

export default AddRequirementsTab;
