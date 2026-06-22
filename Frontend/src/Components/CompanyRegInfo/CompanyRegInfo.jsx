import React from "react";
import "./CompanyRegInfo.css";

/**
 * Two-column informational section (heading on top, text + illustration below).
 *
 * Props:
 *   title       {string}    - section heading
 *   paragraphs  {string[]}  - body paragraphs
 *   image       {string}    - illustration src
 *   imageAlt    {string}
 *   reverse     {boolean}   - place the illustration on the left instead of right
 */
const CompanyRegInfo = ({ title, paragraphs = [], image, imageAlt = "", reverse = false }) => {
  return (
    <section className="crinfo-section">
      <div className="crinfo-container">
        <h2 className="crinfo-title">{title}</h2>

        <div className={`crinfo-row${reverse ? " crinfo-row--reverse" : ""}`}>
          <div className="crinfo-text">
            {paragraphs.map((p, i) => (
              <p key={i}>{p}</p>
            ))}
          </div>

          <div className="crinfo-img-wrap">
            <span className="crinfo-img-blob" aria-hidden="true" />
            <img className="crinfo-img" src={image} alt={imageAlt} loading="lazy" />
          </div>
        </div>
      </div>
    </section>
  );
};

export default CompanyRegInfo;
