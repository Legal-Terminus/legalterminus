import { useState } from "react";
import "./IECPlans.css";
import CheckoutModal from "../ProCheckoutModal/ProCheckoutModal";

const PLANS = [
  { id: "elemental", name: "Elemental", price: 1499, services: [] },
  { id: "enriched",  name: "Enriched",  price: 2999, services: [] },
  { id: "supreme",   name: "Supreme",   price: 4999, services: [] },
];

const elementalFeatures = [
  "IEC application on DGFT portal (dgft.gov.in)",
  "Form ANF 2A filing",
  "Aadhaar OTP + DSC coordination",
  "Document validation + upload",
  "IEC certificate delivery in 1-2 working days",
  "Annual update reminder (every April-June)",
];

const enrichedFeatures = [
  "All features of Elemental Plan",
  "ICEGATE registration assistance",
  "ICEGATE ID & password activation support",
  "Digital Signature (DSC) mapping on ICEGATE",
  "Importer/Exporter profile configuration support",
  "Basic guidance for customs portal access",
  "Email support for ICEGATE login issues",
];

const supremeFeatures = [
  "All features of Enriched Plan",
  "AD Code registration on ICEGATE portal",
  "Coordination for bank-issued AD Code letter",
  "Port-wise AD Code submission support",
  "Document validation & customs portal upload",
  "Assistance in activation of AD Code at customs location",
  "Priority processing & dedicated compliance support",
];

const IECPlans = () => {
  const [activePlan, setActivePlan] = useState(null);

  return (
    <>
      <section className="iec-pricing-section">
        <div className="iecpricing-container">

          <header className="iecpricing-header">
            <h2 className="iecpricing-title">CHOOSE YOUR PLAN</h2>
            <p className="iecpricing-subtitle">
              Register your importer exporter code with pocket friendly-prices
            </p>
          </header>

          <div className="iecpricing-cards">

            {/* Elemental */}
            <article className="iecplan-card">
              <div>
                <div className="iecplan-header">
                  <div className="iecplan-name">Elemental</div>
                  <div className="iecplan-plan-badge">NORMAL</div>
                  <div className="iecplan-old-price">₹1,999</div>
                  <div className="iecplan-price">₹{PLANS[0].price.toLocaleString("en-IN")}</div>
                  <div className="iecplan-meta">+ Govt. fees &amp; GST extra</div>
                </div>
                <div className="iecplan-body">
                  <ul className="iecplan-list">
                    {elementalFeatures.map((f, i) => (
                      <li className="iecplan-list-item" key={i}>{f}</li>
                    ))}
                  </ul>
                </div>
              </div>
              <div className="iecplan-footer">
                <button className="iecplan-button" onClick={() => setActivePlan(PLANS[0])}>Buy Now</button>
              </div>
            </article>

            {/* Enriched */}
            <article className="iecplan-card iecplan-card--popular">
              <div>
                <div className="iecplan-header">
                  <div className="iecplan-name">Enriched</div>
                  <div className="iecplan-plan-badge iecplan-plan-badge--popular">MOST POPULAR</div>
                  <div className="iecplan-old-price">₹3,999</div>
                  <div className="iecplan-price">₹{PLANS[1].price.toLocaleString("en-IN")}</div>
                  <div className="iecplan-meta">+ Govt. fees &amp; GST extra</div>
                </div>
                <div className="iecplan-body">
                  <ul className="iecplan-list">
                    {enrichedFeatures.map((f, i) => (
                      <li className="iecplan-list-item" key={i}>{f}</li>
                    ))}
                  </ul>
                </div>
              </div>
              <div className="iecplan-footer">
                <button className="iecplan-button" onClick={() => setActivePlan(PLANS[1])}>Buy Now</button>
              </div>
            </article>

            {/* Supreme */}
            <article className="iecplan-card">
              <div>
                <div className="iecplan-header">
                  <div className="iecplan-name">Supreme</div>
                  <div className="iecplan-plan-badge iecplan-plan-badge--full">FULL-SERVICE</div>
                  <div className="iecplan-old-price">₹5,499</div>
                  <div className="iecplan-price">₹{PLANS[2].price.toLocaleString("en-IN")}</div>
                  <div className="iecplan-meta">+ Govt. fees &amp; GST extra</div>
                </div>
                <div className="iecplan-body">
                  <ul className="iecplan-list">
                    {supremeFeatures.map((f, i) => (
                      <li className="iecplan-list-item" key={i}>{f}</li>
                    ))}
                  </ul>
                </div>
              </div>
              <div className="iecplan-footer">
                <button className="iecplan-button" onClick={() => setActivePlan(PLANS[2])}>Buy Now</button>
              </div>
            </article>

          </div>
        </div>
      </section>

      {activePlan && (
        <CheckoutModal plan={activePlan} onClose={() => setActivePlan(null)} source="iec-registration" />
      )}
    </>
  );
};

export default IECPlans;
