import React from "react";
import "./PFRtermscondition.css";

const TermsConditions = () => {
  return (
    <section className="pfr-tc-section">
      <div className="pfr-tc-container">
        <div className="pfr-tc-card">
          {/* Heading */}
          <h2 className="pfr-tc-title">TERMS &amp; CONDITIONS</h2>

          {/* Sub heading */}
          <p className="pfr-tc-subtitle">
            By subscribing to the above plans, you agree to abide by our following
            additional terms and conditions
          </p>

          {/* List */}
          <ol className="pfr-tc-list">
            <li className="pfr-tc-item">
              Professional Fee Only: All quoted prices are exclusive of stamp duty, RoF registration fee, notarisation charges, affidavit stamp paper, and other out-of-pocket costs. Our fee covers professional services — Deed drafting, advisory, RoF filing coordination, PAN/TAN application, and post-registration handover.
            </li>
            <li className="pfr-tc-item">
              Stamp Duty Variability: Stamp duty on the Partnership Deed is a state subject and varies by state and partner contribution. Maharashtra typically ₹500 flat for capital up to ₹50,000 (escalating thereafter). Tamil Nadu ₹300 flat. Karnataka and Gujarat use slab structures up to ₹5,000+. We compute the exact figure upfront based on your state and capital.
            </li>
            <li className="pfr-tc-item">
              Registrar of Firm Fees: Registrar of Firms registration fee varies by state — typically ₹200 – ₹1,000. This is payable to the State Government and reimbursed at actuals. Not applicable if you opt for the Elemental (unregistered firm) plan.
            </li>
            <li className="pfr-tc-item">
              GST on Our Fee: All quoted prices are exclusive of GST @ 18%, charged at checkout.
            </li>
            <li className="pfr-tc-item">
              Partner Limits:
              <ul className="pfr-tc-sublist">
                <li>Minimum 2 partners required</li>
                <li>Maximum 50 partners allowed</li>
                <li>Partners can be: Individuals (Indian or NRI), Companies, LLPs, or other entities (subject to legal conditions)</li>
              </ul>
            </li>
            <li className="pfr-tc-item">
              Optional Registration: Registration of a Partnership Firm under Section 58 of the Indian Partnership Act, 1932 is OPTIONAL — not mandatory. However, an unregistered firm cannot sue third parties or partners for enforcement of contractual rights (Section 69). We strongly recommend registration; the Elemental tier is for clients who explicitly choose otherwise.
            </li>
            <li className="pfr-tc-item">
              Refund Policy: Full refund of professional fee (less ₹999 documentation handling) is available if the Partnership Deed is not finalised within 3 working days from receipt of partner inputs. Stamp duty and notarization costs if already paid are non-refundable.
            </li>
            <li className="pfr-tc-item">
              Resubmission by RoF: One free resubmission of Form 1 in case of objections from documentation drafted by us. Resubmissions arising from partner-side changes (e.g., revised contribution, address updates, Deed clause changes post-filing) are billed at ₹999 + GST.
            </li>
            <li className="pfr-tc-item">
              Out-of-Scope Items: Foreign partner FEMA / RBI compliance, change of partner post-registration, dissolution / reconstitution Deed drafting, registered office shifting, conversion to LLP / Pvt Ltd, sectoral licences (FSSAI, IEC, RBI, etc.), and annual filings are not included and quoted separately.
            </li>
            <li className="pfr-tc-item">
              Post-Registration Compliance: Plans do not include statutory audits (mandatory if turnover &gt; ₹1 crore under Section 44AB of the Income Tax Act), monthly GSTR filings, ITR-5 filing, or Deed amendments. These are billed under our Annual Compliance retainer.
            </li>
          </ol>
        </div>
      </div>
    </section>
  );
};

export default TermsConditions;
