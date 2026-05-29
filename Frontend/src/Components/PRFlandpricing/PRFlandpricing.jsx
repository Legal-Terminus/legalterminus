import React, { useState } from "react";
import "./PRFlandpricing.css";
import CheckoutModal from "../ProCheckoutModal/ProCheckoutModal";


const PLANS = [
  { id: "elemental", name: "Elemental", price: 3999, services: ["Search Report of Name Availability", "1 RUN Name Approval Certificate", "Director Identification Number for 2 Individuals", "Certificate of Incorporation", "E-PAN", "E-TAN", "E-MOA", "E-AOA", "Documents for Bank Account Opening", "Documents for 1st Auditor Appointment", "EPF Registrations", "ESI Registrations"] },
  { id: "enriched", name: "Enriched", price: 5999, services: ["Elemental Plan Plus", "Share Certificate", "Commencement of Business", "Udyam/MSME Registration"] },
  { id: "supreme", name: "Supreme", price: 24999, services: ["Enriched Plan Plus", "Income tax filing of Company", "Preparation of Directors Report", "Preparation of Annual Return", "Preparation of Auditor Appointment Paperwork", "Preparation of List of Share Holders", "Preparation of Notice of AGM", "Preparation of Notice of BM", "Preparation of Extracts of AGM", "Filing of AOC - 4 (Financial Statements)", "Filing of MGT - 7 (Annual Return)", "Filing of ADT - 1 (Auditor Appointment)", "Minutes of Board Meeting for 1st FY", "Minutes of General Meeting for 1st FY", "Maintenance of Statutory E- Registers", "Filing of DPT - 3 Annual (If Applicable)", "Filing of MSME - 1 (If Applicable) for 1st FY", "DIR KYC (2 Directors)", "Income Tax Filing of 2 Directors", "Audit fees are excluded and to be paid directly to Auditor"] }
];

const PricingSection = () => {
  const [activePlan, setActivePlan] = useState(null);

  return (

    <>
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
              <div className="prf-planheader">
                <div className="prf-pricingname">Elemental</div>
                <div className="prf-pricingold-price">₹5,999</div>
                <div className="prf-pricingprice">{PLANS[0].price.toLocaleString("en-IN")}</div>
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
              <button className="prf-pricingbutton" onClick={() => setActivePlan(PLANS[0])}>Buy Now</button>
            </div>
          </article>

          {/* Enriched */}
          <article className="prf-pricingcard">
            <div>
              <div className="prf-planheader">
                <div className="prf-pricingname">Enriched</div>
                <div className="prf-pricingold-price">₹7,999</div>
                <div className="prf-pricingprice">{PLANS[1].price.toLocaleString("en-IN")}</div>
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
              <button className="prf-pricingbutton" onClick={() => setActivePlan(PLANS[1])}>Buy Now</button>
            </div>
          </article>

          {/* Supreme */}
          <article className="prf-pricingcard">
            <div>
              <div className="prf-planheader">
                <div className="prf-pricingname">Supreme</div>
                <div className="prf-pricingold-price">₹29,999</div>
                <div className="prf-pricingprice">{PLANS[2].price.toLocaleString("en-IN")}</div>
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
              <button className="prf-pricingbutton" onClick={() => setActivePlan(PLANS[2])}>Buy Now</button>
            </div>
          </article>

        </div>
      </div>
    </section>


      {activePlan && (

        <CheckoutModal plan={activePlan} onClose={() => setActivePlan(null)} />

      )}

    </>

  );};

export default PricingSection;
