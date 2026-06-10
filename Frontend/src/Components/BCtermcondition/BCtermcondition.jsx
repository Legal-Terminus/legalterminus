import React from "react";
import "./BCtermcondition.css";

const BCTermCondition = () => {
  return (
    <section className="opctc-section">
      <div className="opctc-container">
        <div className="opctc-card">
          <h2 className="opctc-title">TERMS &amp; CONDITIONS</h2>

          <p className="opctc-subtitle">
            By subscribing to the above plans, you agree to abide by our following additional terms and conditions
          </p>

          <ol className="opctc-list">
            <li className="opctc-item">
              GS1 India is the Sole Authorized Issuer: GS1 India is the only authorized representative of GS1 Global in India — promoted by the Ministry of Commerce &amp; Industry along with CII, FICCI, ASSOCHAM, FIEO and other apex Chambers. Barcodes / GTINs issued by GS1 India are globally unique and accepted across retail / supply-chain / customs systems worldwide. Any third-party 'cheap barcode' issued outside GS1 India is NOT a GS1 barcode and will fail at modern trade, exports, and major e-commerce gateways.
            </li>
            <li className="opctc-item">
              GS1 India Fee Structure: Total fee payable to GS1 India = Registration Fee + Annual Subscription Fee + 18% GST + Rs.3,000 Security Deposit (refundable; security deposit is NIL for 10-year tenure). Fees depend on: (a) annual sales turnover slab, (b) barcode pack size (100 / 1,000 / 10,000 / 1,00,000), (c) tenure (1 / 2 / 3 / 5 / 10 years). Per the GS1 India GCP Fee Structure effective 1 October 2025. All amounts billed at actuals per the official GS1 India tariff.
            </li>
            <li className="opctc-item">
              GST on Our Fee: All quoted prices are exclusive of GST @ 18%, charged at checkout.
            </li>
            <li className="opctc-item">
              Pack Size Logic: 100 GTINs cover ~100 unique SKUs (each colour / size / variant = separate GTIN). 1,000 GTINs for mid-size FMCG / D2C / cosmetics catalogues. 10,000 for large manufacturers / retail private labels. 1,00,000 for enterprises with vast SKU portfolios (electronics, pharma, apparel). We right-size in the discovery call — over-buying inflates GS1 fees; under-buying creates expansion pain.
            </li>
            <li className="opctc-item">
              MSME 80% Reimbursement Scheme: Micro-manufacturing enterprises (with valid Udyam Registration) qualify for 80% reimbursement of GS1 India one-time Registration Fee + Annual Subscription Fee for the first 3 years, claimed in one go — maximum Rs.50,650 per Ministry of MSME guidelines. Valid only for the 100 and 1,000 barcode packs.
            </li>
            <li className="opctc-item">
              Security Deposit (Rs.3,000): Refundable security deposit is held by GS1 India for 1–5 year tenures (waived for 10-year tenure). Refundable on surrender of the GCP after settling all subscription dues. Held by GS1 India directly — we coordinate but do not hold client money.
            </li>
            <li className="opctc-item">
              Membership Renewal: GS1 India membership is renewable per the same fee schedule. We send 90/60/30-day renewal reminders (Enriched / Supreme tiers). Lapsed membership invalidates your GTINs — reactivation may require re-payment of registration fee and may trigger GTIN renumbering in extreme cases.
            </li>
            <li className="opctc-item">
              Refund Policy: Full refund of our professional fee (less Rs.499 documentation handling) is available if the GS1 India application is not submitted within 7 working days from receipt of all required information + GS1 India fee. GS1 India fees already paid are subject to GS1 India's own refund policy and are NOT refundable through us.
            </li>
            <li className="opctc-item">
              Out-of-Scope Items: Barcode artwork design / print-ready files, label printing, GS1 India audits / verifications, product photography for DataKart, GS1 SmartConsumer app onboarding, DGFT / customs barcode compliance audits, pharma 2D barcode hardware / printing setup, ISBN / ISSN registration, and litigation / dispute resolution with GS1 India are NOT included in the base plan.
            </li>
            <li className="opctc-item">
              Statutory Mandates: Specific industries have additional barcoding obligations: (a) Top 300 pharma brands — 2D barcode / QR code mandatory since 1 Aug 2023 per DCGI Order; (b) Export consignments under DGFT — SSCC at carton / pallet level; (c) PDS / mid-day meal / institutional supplies — GS1 GTIN per State / Central tender clauses. These compliance overlays are handled within Supreme tier.
            </li>
          </ol>
        </div>
      </div>
    </section>
  );
};

export default BCTermCondition;
