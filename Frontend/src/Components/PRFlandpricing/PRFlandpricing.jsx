import React, { useState } from "react";
import "./PRFlandpricing.css";
import CheckoutModal from "../ProCheckoutModal/ProCheckoutModal";


const PLANS = [
  {
    id: "elemental",
    name: "Elemental",
    price: 2499,
    services: [
      "Partnership Deed drafting (standard template)",
      "Notarisation coordination",
      "Stamp duty calculation (state-specific)",
      "Firm PAN application",
      "Firm TAN application",
      "Bank account opening documents preparation",
    ],
  },
  {
    id: "enriched",
    name: "Enriched",
    price: 5499,
    services: [
      "Everything in Elemental",
      "Custom Partnership Deed (profit share, exit, IP, dispute)",
      "GSTIN allotment (1 state, optional)",
      "MSME / Udyam registration coordination",
    ],
  },
  {
    id: "supreme",
    name: "Supreme",
    price: 8999,
    services: [
      "Everything in Enriched",
      "Form 1 (RoF Application in IGR) preparation & filing",
      "Affidavit & verification drafting",
      "RoF coordination through Certificate of Registration",
      "Trademark search + Class application (1 class, govt fee extra)",
    ],
  },
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
              Register your partnership firm with pocket-friendly prices
            </p>
          </header>

          {/* Cards */}
          <div className="prf-pricingcards">

            {/* Elemental */}
            <article className="prf-pricingcard">
              <div>
                <div className="prf-planheader">
                  <div className="prf-pricingname">Elemental</div>
                  <div className="prf-pricingold-price">₹3,499</div>
                  <div className="prf-pricingprice">{PLANS[0].price.toLocaleString("en-IN")}</div>
                  <div className="prf-pricingmeta">+ Govt. fees &amp; GST extra</div>
                </div>

                <div className="prf-pricingbody">
                  <ul className="prf-pricinglist">
                    <li className="prf-pricinglist-item">Partnership Deed drafting (standard template)</li>
                    <li className="prf-pricinglist-item">Notarisation coordination</li>
                    <li className="prf-pricinglist-item">Stamp duty calculation (state-specific)</li>
                    <li className="prf-pricinglist-item">Firm PAN application</li>
                    <li className="prf-pricinglist-item">Firm TAN application</li>
                    <li className="prf-pricinglist-item">Bank account opening documents preparation</li>
                  </ul>
                </div>
              </div>

              <div className="prf-pricingfooter">
                <button className="prf-pricingbutton" onClick={() => setActivePlan(PLANS[0])}>Buy Now</button>
              </div>
            </article>

            {/* Enriched */}
            <article className="prf-pricingcard prf-card--popular">
              <div className="prf-popular-badge">★ MOST POPULAR</div>
              <div>
                <div className="prf-planheader">
                  <div className="prf-pricingname">Enriched</div>
                  <div className="prf-pricingold-price">₹6,499</div>
                  <div className="prf-pricingprice">{PLANS[1].price.toLocaleString("en-IN")}</div>
                  <div className="prf-pricingmeta">+ Govt. fees &amp; GST extra</div>
                </div>

                <div className="prf-pricingbody">
                  <ul className="prf-pricinglist">
                    <li className="prf-pricinglist-item">Everything in Elemental</li>
                    <li className="prf-pricinglist-item">Custom Partnership Deed (profit share, exit, IP, dispute)</li>
                    <li className="prf-pricinglist-item">GSTIN allotment (1 state, optional)</li>
                    <li className="prf-pricinglist-item">MSME / Udyam registration coordination</li>
                  </ul>
                </div>
              </div>

              <div className="prf-pricingfooter">
                <button className="prf-pricingbutton" onClick={() => setActivePlan(PLANS[1])}>Buy Now</button>
              </div>
            </article>

            {/* Supreme */}
            <article className="prf-pricingcard prf-card--fullservice">
              <div className="prf-fullservice-badge">✦ FULL-SERVICE</div>
              <div>
                <div className="prf-planheader">
                  <div className="prf-pricingname">Supreme</div>
                  <div className="prf-pricingold-price">₹11,999</div>
                  <div className="prf-pricingprice">{PLANS[2].price.toLocaleString("en-IN")}</div>
                  <div className="prf-pricingmeta">+ Govt. fees &amp; GST extra</div>
                </div>

                <div className="prf-pricingbody">
                  <ul className="prf-pricinglist">
                    <li className="prf-pricinglist-item">Everything in Enriched</li>
                    <li className="prf-pricinglist-item">Form 1 (RoF Application in IGR) preparation &amp; filing</li>
                    <li className="prf-pricinglist-item">Affidavit &amp; verification drafting</li>
                    <li className="prf-pricinglist-item">RoF coordination through Certificate of Registration</li>
                    <li className="prf-pricinglist-item">Trademark search + Class application (1 class, govt fee extra)</li>
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
        <CheckoutModal plan={activePlan} onClose={() => setActivePlan(null)} source="professional-tax" />
      )}
    </>
  );
};

export default PricingSection;
