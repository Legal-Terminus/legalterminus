import React from "react";
import "./LlptoPriRequirementsTab.css";

const RequirementsLlp = () => {
  return (
    <section className="LLP-to-PLC-req-section">
      <div className="LLP-to-PLC-req-container">
        {/* Heading + intro */}
        <header className="LLP-to-PLC-req-header">
          <h2 className="LLP-to-PLC-req-title">
            Benefits of Conversion of LLP to Private Limited Company
          </h2>
          <p className="LLP-to-PLC-req-subtitle">
            Converting an LLP into a Private Limited Company gives your business several practical advantages:
          </p>
        </header>

        {/* Cards */}
        <div className="LLP-to-PLC-req-grid">
          {/* 1 */}
          <article className="LLP-to-PLC-req-card">
            <h3 className="LLP-to-PLC-req-card-title">Easy Business Growth:</h3>
            <div className="LLP-to-PLC-req-card-underline" />
            <p className="LLP-to-PLC-req-card-text">
            A Private Limited structure is more suitable for expanding operations and scaling your business smoothly.
            </p>
          </article>

          {/* 2 */}
          <article className="LLP-to-PLC-req-card">
            <h3 className="LLP-to-PLC-req-card-title">Better Funding Opportunities:</h3>
            <div className="LLP-to-PLC-req-card-underline" />
            <p className="LLP-to-PLC-req-card-text">
              It becomes easier to raise money from investors, venture capitalists, or banks, as investors can buy shares in the company.
            </p>
          </article>

          {/* 3 */}
          <article className="LLP-to-PLC-req-card">
            <h3 className="LLP-to-PLC-req-card-title">
              Flexible Share Options:
            </h3>
            <div className="LLP-to-PLC-req-card-underline" />
            <p className="LLP-to-PLC-req-card-text">
              You can issue shares anytime to raise funds and also offer shares to employees as rewards through ESOPs.
            </p>
          </article>

          {/* 4 */}
          <article className="LLP-to-PLC-req-card">
            <h3 className="LLP-to-PLC-req-card-title">
              Lower Tax Option:
            </h3>
            <div className="LLP-to-PLC-req-card-underline" />
            <p className="LLP-to-PLC-req-card-text">
              Private Limited Companies can opt for a lower corporate tax rate (around 22%–25%), compared to the 30% flat tax rate generally applicable to LLPs.
            </p>
          </article>
        </div>
      </div>
    </section>
  );
};

export default RequirementsLlp;
