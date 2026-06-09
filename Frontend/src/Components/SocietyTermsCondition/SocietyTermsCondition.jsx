import React from "react";
import "./SocietyTermsCondition.css";

const items = [
  "Government Fee - State-Specific: Registrar of Societies filing fee (Rs.50 - Rs.500), stamp paper for MoA + Rules (Rs.100 - Rs.500), and notarisation + affidavits (Rs.300 - Rs.1,000) are payable to the respective state authorities and reimbursed at actuals. Udyam and GST government fees are NIL. Our fee covers professional services - MoA / Rules drafting, advisory, filing coordination, and (Enriched / Supreme) Udyam + GST application filing.",
  "GST on Our Fee: All quoted prices are exclusive of GST @ 18%, charged at checkout.",
  "Scope - What's Included: This service covers application filing and registration only - (a) Society Registration (all tiers), (b) Udyam (MSME) Registration (Enriched / Supreme), (c) GST Registration in 1 state under Regular scheme (Supreme only). Society PAN application is included in all tiers.",
  "Minimum Members: Society Registration under the Societies Registration Act, 1860 requires a MINIMUM OF 7 MEMBERS at incorporation. Some states (e.g., Andhra Pradesh, Telangana) require members from different families. We confirm state-specific member rules on the discovery call. Members are typically also Founder Office Bearers (President, Secretary, Treasurer).",
  "State Variation: The Societies Registration Act 1860 is a CENTRAL Act adopted by all states - but many states (Karnataka 1960, TN 1975, MP 1973, AP / Telangana 2001, Rajasthan 1958 etc.) have their own State Societies Registration Acts with state-specific procedural variations. Society is registered ONE state at a time - the registered office address determines the state. We file in the state of your registered office.",
  "Annual Compliance: Most states require an annual list of office bearers (and members in some states) to be filed with the Registrar of Societies. Audited accounts may be required if income exceeds state-specific thresholds. The annual filing itself is NOT included in registration tiers and is billed under our Annual Compliance retainer.",
  "Refund Policy: Full refund of professional fee (less Rs.1,499 documentation handling) is available if MoA + Rules are not finalised within 7 working days from receipt of complete 7-member inputs. State government fees, stamp paper, and notarisation costs already paid are non-refundable.",
  "12A / 80G / CSR-1 / FCRA - Separate: Societies are eligible to apply for 12A (tax exemption), 80G (donor deduction), CSR-1 (CSR fund eligibility), and FCRA (foreign funding). These are SEPARATE registrations under the Income Tax Act / Companies Act / FCRA and are NOT included under this service. We file these as separate quoted engagements where requested.",
  "Out-of-Scope Items (Explicit List): 12A / 80G income tax registrations, CSR-1 filing with MCA, NGO Darpan registration with NITI Aayog, FCRA registration, conversion of Society to Section 8 Company or Trust, foreign-member KYC + apostille, multiple-state society registrations (each state requires separate filing), MoA / Rules amendments post-registration, annual compliance filings, audit, government grant applications, scheme benefit applications, and any tender / RFP preparation are NOT included under this service. We are happy to quote these separately on the discovery call.",
];

const SocietyTermsCondition = () => {
  return (
    <section className="socity-tc-section">
      <div className="socity-tc-container">
        <div className="socity-tc-card">

          <h2 className="socity-tc-title">TERMS &amp; CONDITIONS</h2>

          <p className="socity-tc-subtitle">
            By subscribing to the above plans, you agree to abide by our following
            additional terms and conditions
          </p>

          <ol className="socity-tc-list">
            {items.map((item, i) => (
              <li key={i} className="socity-tc-item">{item}</li>
            ))}
          </ol>

        </div>
      </div>
    </section>
  );
};

export default SocietyTermsCondition;
