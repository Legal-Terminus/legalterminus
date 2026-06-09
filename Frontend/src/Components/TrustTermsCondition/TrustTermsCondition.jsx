import React from "react";
import "./TrustTermsCondition.css";

const items = [
  "Government Fee: Stamp duty on Trust Deed (Rs.500 - Rs.5,000 state-specific), Sub-Registrar / Charity Commissioner filing fee (Rs.100 - Rs.1,500), and notarisation (Rs.100 - Rs.500) are payable to the respective state authorities and reimbursed at actuals. Our fee covers professional services - Trust Deed drafting, advisory, registration coordination, (Enriched) 12A + 80G filing, and (Supreme) UDYAM + GST.",
  "GST on Our Fee: All quoted prices are exclusive of GST @ 18%, charged at checkout.",
  "State Variation - Public Trust Acts: Maharashtra (Maharashtra Public Trusts Act 1950 / earlier Bombay PTA), Gujarat, and Madhya Pradesh have their own Public Trusts Acts administered by the Charity Commissioner. Other states route Trust registration through the Sub-Registrar's office under the Registration Act, 1908. We confirm state-specific process on the discovery call.",
  "Trust Structure: Minimum 2 trustees (no maximum). Settlor (Author of the Trust) initiates; settlor may also be a trustee. Beneficiaries can be specific (Private Trust) or the public at large (Public Charitable Trust). At least one trustee should be a resident in India.",
  "12A / 80G / NGO Darpan / CSR-1 / FCRA: These are SEPARATE registrations under the Income Tax Act, MCA CSR rules, and FCRA respectively - NOT automatic with Trust registration. The Enriched tier includes 12A + 80G applications. CSR-1 + Darpan ID + FCRA are quoted separately. (FCRA registration ITSELF takes 6-12 months and requires 3 years of trust existence + Rs.15 lakh annual charitable spend).",
  "Refund Policy: Full refund of professional fee (less Rs.1,999 documentation handling) is available if Trust Deed is not finalised within 7 working days from receipt of complete trustee + settlor inputs. Stamp duty and notarization costs if already paid are non-refundable.",
  "Out-of-Scope Items: NGO Darpan registration, CSR-1 filing, FCRA application, Conversion of existing Society / Section 8 Company to Trust (or vice versa), foreign trustee KYC + apostille, registered office shifting, Trust Deed amendments (beyond first registration), trust property registration / transfer, beneficiary changes, and any benefit / scheme applications (12A renewal beyond first 5 years, FCRA renewal, government grant applications, etc.) are not included and quoted separately.",
  "Post-Registration Compliance: Plans do not include statutory audits (mandatory if income > Rs.50,000 - varies by state), ITR-7 annual filing, Form 10B audit report (for 12A entities), Form CSR-2 filings, ROC / Charity Commissioner annual returns, or trustee remuneration approvals. These are billed under our Annual Compliance retainer for non-profits.",
  "Out-of-Scope - Grants / Benefits: We do NOT offer application support for government grants, CSR funds, foreign donations through FCRA, public donation campaigns, or any benefit claim applications under central / state schemes. Our scope is the foundational registrations only. For grant / benefit applications, please engage a specialist or apply directly to the respective authority once registered.",
];

const TrustTermsCondition = () => {
  return (
    <section className="trust-tc-section">
      <div className="trust-tc-container">
        <div className="trust-tc-card">

          <h2 className="trust-tc-title">TERMS &amp; CONDITIONS</h2>

          <p className="trust-tc-subtitle">
            By subscribing to the above plans, you agree to abide by our following
            additional terms and conditions
          </p>

          <ol className="trust-tc-list">
            {items.map((item, i) => (
              <li key={i} className="trust-tc-item">{item}</li>
            ))}
          </ol>

        </div>
      </div>
    </section>
  );
};

export default TrustTermsCondition;
