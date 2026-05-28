import React from "react";
import "./LLPPlanandPrice.css";

const LLPPlanandPrice = () => {
  return (
    <section className="LLP-Plan-Price-section">
      <div className="LLP-Plan-pricing-container">

        {/* Upper part */}
        <header className="LLP-Plan-pricing-header">
          <h2 className="LLP-Plan-Price-title">CHOOSE YOUR PLAN</h2>
          <p className="LLP-Plan-pricing-subtitle">
            Register your LLP with pocket-friendly prices
          </p>
        </header>

        {/* Cards */}
        <div className="LLP-Plan-pricing-cards">

          {/* Elemental */}
          <article className="LLP-Plan--card">
            <div>
              <div className="LLP-Plan--header">
                <div className="LLP-Plan--name">Elemental</div>
                <div className="LLP-Plan--old-price">₹5,999</div>
                <div className="LLP-Plan--price">₹3,999</div>
                <div className="LLP-Plan--meta">Excluding gov fee</div>
              </div>

              <div className="LLP-Plan--body">
                <ul className="LLP-Plan--list">
                  <li className="LLP-Plan--list-item">Search Report of Name Availability</li>
                  <li className="LLP-Plan--list-item">1 RUN Name Approval Certificate</li>
                  <li className="LLP-Plan--list-item">DPIN for 2 Designated Partners</li>
                  <li className="LLP-Plan--list-item">Certificate of Incorporation</li>
                  <li className="LLP-Plan--list-item">E-PAN</li>
                  <li className="LLP-Plan--list-item">E-TAN</li>
                  <li className="LLP-Plan--list-item">LLP Agreement Drafting</li>
                  <li className="LLP-Plan--list-item">Documents for Bank Account Opening</li>
                  <li className="LLP-Plan--list-item">EPF Registration</li>
                  <li className="LLP-Plan--list-item">ESI Registration</li>
                </ul>
              </div>
            </div>

            <div className="LLP-Plan--footer">
              <button className="LLP-Plan--button">Buy Now</button>
            </div>
          </article>

          {/* Enriched */}
          <article className="LLP-Plan--card">
            <div>
              <div className="LLP-Plan--header">
                <div className="LLP-Plan--name">Enriched</div>
                <div className="LLP-Plan--old-price">₹9,999</div>
                <div className="LLP-Plan--price">₹7,999</div>
                <div className="LLP-Plan--meta">
                  Excluding gov fee <span className="popular">(Popular)</span>
                </div>
              </div>

              <div className="LLP-Plan--body">
                <ul className="LLP-Plan--list">
                  <li className="LLP-Plan--list-item">Elemental Plan Plus</li>
                  <li className="LLP-Plan--list-item">LLP Agreement Execution &amp; Filing</li>
                  <li className="LLP-Plan--list-item">Udyam / MSME Registration</li>
                  <li className="LLP-Plan--list-item">GST Registration</li>
                  <li className="LLP-Plan--list-item">Commencement of Business Certificate</li>
                </ul>
              </div>
            </div>

            <div className="LLP-Plan--footer">
              <button className="LLP-Plan--button">Buy Now</button>
            </div>
          </article>

          {/* Supreme */}
          <article className="LLP-Plan--card">
            <div>
              <div className="LLP-Plan--header">
                <div className="LLP-Plan--name">Supreme</div>
                <div className="LLP-Plan--old-price">₹29,999</div>
                <div className="LLP-Plan--price">₹24,999</div>
                <div className="LLP-Plan--meta">Excluding gov fee</div>
              </div>

              <div className="LLP-Plan--body">
                <ul className="LLP-Plan--list">
                  <li className="LLP-Plan--list-item">Enriched Plan Plus</li>
                  <li className="LLP-Plan--list-item">Income Tax Filing of LLP</li>
                  <li className="LLP-Plan--list-item">Preparation of Annual Return</li>
                  <li className="LLP-Plan--list-item">Preparation of Partners Report</li>
                  <li className="LLP-Plan--list-item">Filing of LLP Form 8 (Statement of Accounts)</li>
                  <li className="LLP-Plan--list-item">Filing of LLP Form 11 (Annual Return)</li>
                  <li className="LLP-Plan--list-item">Preparation of Auditor Appointment Paperwork</li>
                  <li className="LLP-Plan--list-item">Minutes of Partners Meeting for 1st FY</li>
                  <li className="LLP-Plan--list-item">Maintenance of Statutory E-Registers</li>
                  <li className="LLP-Plan--list-item">DIR KYC (2 Designated Partners)</li>
                  <li className="LLP-Plan--list-item">Income Tax Filing of 2 Designated Partners</li>
                  <li className="LLP-Plan--list-item">Audit fees excluded — payable directly to Auditor</li>
                </ul>
              </div>
            </div>

            <div className="LLP-Plan--footer">
              <button className="LLP-Plan--button">Buy Now</button>
            </div>
          </article>

        </div>
      </div>
    </section>
  );
};

export default LLPPlanandPrice;
