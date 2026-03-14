import React from "react";
import "./PRFlandpricing.css";

const PricingSection = () => {
  return (
    <section className="prf-pricingsection">
      <div className="prf-pricingcontainer">
        
        {/* Upper part */}
        <header className="prf-pricingheader">
          <h2 className="prf-pricingtitle">CHOOSE YOUR PLAN</h2>
          <p className="prf-pricingsubtitle">
            Register your company with pocket-friendly prices
          </p>
        </header>

        {/* Cards */}
        <div className="prf-pricingcards">

          {/* Elemental */}
          <article className="prf-pricingcard">
            <div>
              <div className="prf-pricingheader">
                <div className="prf-pricingname">Elemental</div>
                <div className="prf-pricingold-price">₹5,999</div>
                <div className="prf-pricingprice">₹3,999</div>
                <div className="prf-pricingmeta">Excluding gov fee</div>
              </div>

              <div className="prf-pricingbody">
                <ul className="prf-pricinglist">
                  <li className="prf-pricinglist-item">Search Report of Name Availability</li>
                  <li className="prf-pricinglist-item">1 RUN Name Approval Certificate</li>
                  <li className="prf-pricinglist-item">Director Identification Number for 2 Individuals</li>
                  <li className="prf-pricinglist-item">Certificate of Incorporation</li>
                  <li className="prf-pricinglist-item">E-PAN</li>
                  <li className="prf-pricinglist-item">E-TAN</li>
                  <li className="prf-pricinglist-item">E-MOA</li>
                  <li className="prf-pricinglist-item">E-AOA</li>
                  <li className="prf-pricinglist-item">Documents for Bank Account Opening</li>
                  <li className="prf-pricinglist-item">Documents for 1st Auditor Appointment</li>
                  <li className="prf-pricinglist-item">EPF Registrations</li>
                  <li className="prf-pricinglist-item">ESI Registrations</li>
                </ul>
              </div>
            </div>

            <div className="prf-pricingfooter">
              <button className="prf-pricingbutton">Buy Now</button>
            </div>
          </article>

          {/* Enriched */}
          <article className="prf-pricingcard">
            <div>
              <div className="prf-pricingheader">
                <div className="prf-pricingname">Enriched</div>
                <div className="prf-pricingold-price">₹7,999</div>
                <div className="prf-pricingprice">₹5,999</div>
                <div className="prf-pricingmeta">
                  Excluding gov fee <span className="popular">(Popular)</span>
                </div>
              </div>

              <div className="prf-pricingbody">
                <ul className="prf-pricinglist">
                  <li className="prf-pricinglist-item">Elemental Plan Plus</li>
                  <li className="prf-pricinglist-item">Share Certificate</li>
                  <li className="prf-pricinglist-item">Commencement of Business</li>
                  <li className="prf-pricinglist-item">Udyam/MSME Registration</li>
                </ul>
              </div>
            </div>

            <div className="prf-pricingfooter">
              <button className="prf-pricingbutton">Buy Now</button>
            </div>
          </article>

          {/* Supreme */}
          <article className="prf-pricingcard">
            <div>
              <div className="prf-pricingheader">
                <div className="prf-pricingname">Supreme</div>
                <div className="prf-pricingold-price">₹29,999</div>
                <div className="prf-pricingprice">₹24,999</div>
                <div className="prf-pricingmeta">Excluding gov fee</div>
              </div>

              <div className="prf-pricingbody">
                <ul className="prf-pricinglist">
                  <li className="prf-pricinglist-item">Enriched Plan Plus</li>
                  <li className="prf-pricinglist-item">Income tax filing of Company</li>
                  <li className="prf-pricinglist-item">Preparation of Directors Report</li>
                  <li className="prf-pricinglist-item">Preparation of Annual Return</li>
                  <li className="prf-pricinglist-item">Preparation of Auditor Appointment Paperwork</li>
                  <li className="prf-pricinglist-item">Preparation of List of Share Holders</li>
                  <li className="prf-pricinglist-item">Preparation of Notice of AGM</li>
                  <li className="prf-pricinglist-item">Preparation of Notice of BM</li>
                  <li className="prf-pricinglist-item">Preparation of Extracts of AGM</li>
                  <li className="prf-pricinglist-item">Filing of AOC - 4 (Financial Statements)</li>
                  <li className="prf-pricinglist-item">Filing of MGT - 7 (Annual Return)</li>
                  <li className="prf-pricinglist-item">Filing of ADT - 1 (Auditor Appointment)</li>
                  <li className="prf-pricinglist-item">Minutes of Board Meeting for 1st FY</li>
                  <li className="prf-pricinglist-item">Minutes of General Meeting for 1st FY</li>
                  <li className="prf-pricinglist-item">Maintenance of Statutory E- Registers</li>
                  <li className="prf-pricinglist-item">Filing of DPT - 3 Annual (If Applicable)</li>
                  <li className="prf-pricinglist-item">Filing of MSME - 1 (If Applicable) for 1st FY</li>
                  <li className="prf-pricinglist-item">DIR KYC (2 Directors)</li>
                  <li className="prf-pricinglist-item">Income Tax Filing of 2 Directors</li>
                  <li className="prf-pricinglist-item">Audit fees are excluded and to be paid directly to Auditor</li>
                </ul>
              </div>
            </div>

            <div className="prf-pricingfooter">
              <button className="prf-pricingbutton">Buy Now</button>
            </div>
          </article>

        </div>
      </div>
    </section>
  );
};

export default PricingSection;
