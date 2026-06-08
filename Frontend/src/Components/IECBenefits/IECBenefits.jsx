import React from "react";
import "./IECBenefits.css";

const IECBenefits = () => {
  return (
    <section className="iecben-section">
      <div className="iecben-container">
        <header className="iecben-header">
          <h2 className="iecben-title">
            Benefits of IEC Registration in India
          </h2>
          <p className="iecben-subtitle">
            IEC isn't a strategic choice - it's a mandatory gateway. But the downstream unlocks are where the real value sits. Here's what genuinely matters:
          </p>
        </header>

        <div className="iecben-grid">
          <article className="iecben-card">
            <h3 className="iecben-card-title">Mandatory for Any Cross-Border Trade</h3>
            <div className="iecben-card-underline" />
            <p className="iecben-card-text">
              Without IEC, you legally cannot export goods, import goods, export services billed in foreign currency, or receive foreign-currency payments. Customs will reject your shipping bills, banks will reject your FIRC. IEC is the first thing every international business does.
            </p>
          </article>

          <article className="iecben-card">
            <h3 className="iecben-card-title">Foreign Exchange Compliance</h3>
            <div className="iecben-card-underline" />
            <p className="iecben-card-text">
              Banks need your IEC to credit Foreign Inward Remittance Certificates (FIRC) for export receipts and to release Bank Realisation Certificates (BRC) confirming proceeds. Without IEC, foreign-currency receipts get held up in the bank's suspense account.
            </p>
          </article>

          <article className="iecben-card">
            <h3 className="iecben-card-title">Export Incentive Access</h3>
            <div className="iecben-card-underline" />
            <p className="iecben-card-text">
              RoDTEP (Remission of Duties &amp; Taxes on Exported Products), Advance Authorisation (duty-free input imports), EPCG (capital goods at concessional duty), Duty Drawback - all require valid IEC. The schemes that actually move the needle on export profitability all start with IEC.
            </p>
          </article>

          <article className="iecben-card">
            <h3 className="iecben-card-title">Customs Clearance via ICEGATE</h3>
            <div className="iecben-card-underline" />
            <p className="iecben-card-text">
              Shipping bills (exports) and bills of entry (imports) on the ICEGATE customs portal require IEC + AD Code linkage. Without IEC, your shipment sits at port. With IEC, you (or your Customs House Agent) can file documents and clear cargo in hours.
            </p>
          </article>

          <article className="iecben-card">
            <h3 className="iecben-card-title">Lifetime Validity, No Renewal</h3>
            <div className="iecben-card-underline" />
            <p className="iecben-card-text">
              Once issued, IEC has lifetime validity - no renewal, no expiry. The only ongoing requirement is the FREE annual update in April-June every year (confirming details are current). This is the most low-friction lifelong registration in India.
            </p>
          </article>

          <article className="iecben-card">
            <h3 className="iecben-card-title">Foundational for RCMC + Export Promotion</h3>
            <div className="iecben-card-underline" />
            <p className="iecben-card-text">
              Export Promotion Councils (FIEO, EEPC, APEDA, EPCH, GJEPC etc.) issue RCMC (Registration-cum-Membership Certificate) only to IEC holders. RCMC unlocks tender preferences, trade-show subsidies, market-development assistance, and DGFT incentive schemes.
            </p>
          </article>
        </div>
      </div>
    </section>
  );
};

export default IECBenefits;
