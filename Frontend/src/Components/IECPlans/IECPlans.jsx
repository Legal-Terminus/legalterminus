import "./IECPlans.css";
import CheckoutModal from "../ProCheckoutModal/ProCheckoutModal";


const PLANS = [
  { id: "elemental", name: "Elemental", price: 3999, services: [] },
  { id: "elemental", name: "Elemental", price: 1999, services: [] },
  { id: "supreme", name: "Supreme", price: 24999, services: [] }
];

const IECPlans = () => {
  const [activePlan, setActivePlan] = useState(null);

  return (

    <>
    <section className="iec-pricing-section">
      <div className="iecpricing-container">
        
        {/* Upper part */}
        <header className="iecpricing-header">
          <h2 className="iecpricing-title">CHOOSE YOUR PLAN</h2>
          <p className="iecpricing-subtitle">
            Register your importer exporter code with pocket friendly-prices
          </p>
        </header>

        {/* Cards */}
        <div className="iecpricing-cards">

          {/* Elemental
          <article className="iecplan-card">
            <div>
              <div className="iecplan-header">
                <div className="iecplan-name">Elemental</div>
                <div className="iecplan-old-price">₹5,999</div>
                <div className="iecplan-price">{PLANS[0].price.toLocaleString("en-IN")}</div>
                <div className="iecplan-meta">Excluding gov fee</div>
              </div>

              <div className="iecplan-body">
                <ul className="iecplan-list">
                  <li className="iecplan-list-item">IEC Registration Application Filing</li>
                  <li className="iecplan-list-item">Assistance in DGFT Documentation</li>
                  <li className="iecplan-list-item">Certificate of IEC Code Issuance</li>
                  <li className="iecplan-list-item">PAN & Business Details Verification</li>
                  <li className="iecplan-list-item">Email & Mobile Verification Support</li>
                  <li className="iecplan-list-item">Lifetime Valid IEC Certificate</li>
                </ul>
              </div>
            </div>

            <div className="iecplan-footer">
              <button className="iecplan-button" onClick={() => setActivePlan(PLANS[0])}>Buy Now</button>
            </div>
          </article> */}

          {/* Enriched */}
          <article className="iecplan-card">
            <div>
              <div className="iecplan-header">
                <div className="iecplan-name">Elemental</div>
                <div className="iecplan-old-price">₹4,999</div>
                <div className="iecplan-price">{PLANS[1].price.toLocaleString("en-IN")}</div>
                <div className="iecplan-meta">
                  Excluding gov fee
                </div>
              </div>

              <div className="iecplan-body">
                <ul className="iecplan-list">
                  <li className="iecplan-list-item">Import Export Code Registration</li>
                </ul>
              </div>
            </div>

            <div className="iecplan-footer">
              <button className="iecplan-button" onClick={() => setActivePlan(PLANS[1])}>Buy Now</button>
            </div>
          </article>

          {/* Supreme
          <article className="iecplan-card">
            <div>
              <div className="iecplan-header">
                <div className="iecplan-name">Supreme</div>
                <div className="iecplan-old-price">₹29,999</div>
                <div className="iecplan-price">{PLANS[2].price.toLocaleString("en-IN")}</div>
                <div className="iecplan-meta">Excluding gov fee</div>
              </div>

              <div className="iecplan-body">
                <ul className="iecplan-list">
                  <li className="iecplan-list-item">Enriched Plan Plus</li>
                  <li className="iecplan-list-item">Annual IEC Renewal & Modifications</li>
                  <li className="iecplan-list-item">Import/Export Compliance Advisory</li>
                  <li className="iecplan-list-item">Business Setup Support for Export</li>
                  <li className="iecplan-list-item">Priority Customer Assistance</li>
                  <li className="iecplan-list-item">Dedicated Relationship Manager</li>
                </ul>
              </div>
            </div>

            <div className="iecplan-footer">
              <button className="iecplan-button" onClick={() => setActivePlan(PLANS[2])}>Buy Now</button>
            </div>
          </article> */}

        </div>
      </div>
    </section>


      {activePlan && (

        <CheckoutModal plan={activePlan} onClose={() => setActivePlan(null)} source="iec-registration" />

      )}

    </>

  );};

export default IECPlans;
