import "./FoodLicensePlans.css";
import CheckoutModal from "../ProCheckoutModal/ProCheckoutModal";


const PLANS = [
  { id: "elemental", name: "Elemental", price: 1499, services: [] },
  { id: "enriched", name: "Enriched", price: 3999, services: [] },
  { id: "supreme", name: "Supreme", price: 7999, services: [] }
];

const FoodLicensePlans = () => {
  const [activePlan, setActivePlan] = useState(null);

  return (

    <>
    <section className="foodlicense-pricing-section">
      <div className="foodlicensepricing-container">
        
        {/* Upper part */}
        <header className="foodlicensepricing-header">
          <h2 className="foodlicensepricing-title">CHOOSE YOUR PLAN</h2>
          <p className="foodlicensepricing-subtitle">
            Register your food license with pocket friendly-prices
          </p>
        </header>

        {/* Cards */}
        <div className="foodlicensepricing-cards">

          {/* Elemental */}
          <article className="foodlicenseplan-card">
            <div>
              <div className="foodlicenseplan-header">
                <div className="foodlicenseplan-name">Elemental</div>
                <div className="foodlicenseplan-price">₹1,499</div>
                <div className="foodlicenseplan-meta">Excluding gov fee</div>
              </div>

              <div className="foodlicenseplan-body">
                <ul className="foodlicenseplan-list">
                  <li className="foodlicenseplan-list-item">For Food Business Operators whose Annual turnover less than 12 Lakhs</li>
                </ul>
              </div>
            </div>

            <div className="foodlicenseplan-footer">
              <button className="foodlicenseplan-button" onClick={() => setActivePlan(PLANS[0])}>Buy Now</button>
            </div>
          </article>

          {/* Enriched */}
          <article className="foodlicenseplan-card">
            <div>
              <div className="foodlicenseplan-header">
                <div className="foodlicenseplan-name">Enriched</div>
                <div className="foodlicenseplan-price">₹3,999</div>
                <div className="foodlicenseplan-meta">
                  Excluding gov fee <span className="popular">(Popular)</span>
                </div>
              </div>

              <div className="foodlicenseplan-body">
                <ul className="foodlicenseplan-list">
                  <li className="foodlicenseplan-list-item">For Food Business Operators whose Annual turnover more than 12 Lakhs & less than 20 Cr</li>
                </ul>
              </div>
            </div>

            <div className="foodlicenseplan-footer">
              <button className="foodlicenseplan-button" onClick={() => setActivePlan(PLANS[1])}>Buy Now</button>
            </div>
          </article>

          {/* Supreme */}
          <article className="foodlicenseplan-card">
            <div>
              <div className="foodlicenseplan-header">
                <div className="foodlicenseplan-name">Supreme</div>
                <div className="foodlicenseplan-price">₹7,999</div>
                <div className="foodlicenseplan-meta">Excluding gov fee</div>
              </div>

              <div className="foodlicenseplan-body">
                <ul className="foodlicenseplan-list">
                  <li className="foodlicenseplan-list-item">For Food Business Operators whose Annual turnover more than 20 Cr</li>
                </ul>
              </div>
            </div>

            <div className="foodlicenseplan-footer">
              <button className="foodlicenseplan-button" onClick={() => setActivePlan(PLANS[2])}>Buy Now</button>
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

export default FoodLicensePlans;
