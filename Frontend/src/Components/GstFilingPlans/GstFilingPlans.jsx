import { useState } from "react";
import "./GstFilingPlans.css";
import CheckoutModal from "../ProCheckoutModal/ProCheckoutModal";
import ConsultationModal from "../ConsultationModal/ConsultationModal";

const PLANS = [
  {
    id: "elemental",
    name: "Elemental",
    oldPrice: 799,
    price: 499,
    period: "/ month",
    services: [
      "Transactions Nil in the month",
      "Annual T/O up to Rs.50 lakh",
      "Nil GSTR-1 + Nil GSTR-3B filing",
      "Due-date reminder + tracking",
      "Filed on https://www.gst.gov.in",
      "Quarterly compliance summary",
      "QRMP scheme advisory + opt-in",
      "Late-fee zero promise",
      "1 GSTIN included",
      "Govt late fees at actuals (we file on time)",
    ],
  },
  {
    id: "enriched",
    name: "Enriched",
    badge: "★ STARTER",
    oldPrice: 1499,
    price: 999,
    period: "/ month",
    services: [
      "Up to 100 outward + inward invoices / month",
      "Annual T/O up to Rs.50 lakh OR Nil filer with T/O Rs.50 lakh - Rs.5 Cr",
      "GSTR-1 monthly filing (or QRMP quarterly)",
      "GSTR-3B monthly filing (hard-locked auto-pop)",
      "Tax challan computation (CGST / SGST / IGST)",
      "GSTR-2B download + basic ITC check",
      "Due-date reminder + tracking",
      "Monthly compliance summary",
      "QRMP scheme advisory",
      "1 GSTIN included",
      "Late-fee zero promise",
    ],
  },
  {
    id: "supreme",
    name: "Supreme",
    badge: "★ MOST POPULAR",
    popular: true,
    oldPrice: 2999,
    price: 1999,
    period: "/ month",
    services: [
      "Up to 100 invoices / month OR contractor / multi-services T/O up to Rs.2 Cr",
      "GSTR-1 + GSTR-3B monthly filing",
      "Invoice Management System (IMS) - accept / reject / pend workflow",
      "GSTR-2B vs Purchase Register reconciliation (ITC accuracy)",
      "GSTR-1A last-minute amendment (errors caught pre-3B)",
      "ITC eligibility review + Rule 36(4) / 38 / 42 / 43 compliance",
      "GSTR-3B hard-lock pre-check (data integrity before filing)",
      "Cash vs credit ledger optimisation",
      "Monthly compliance dashboard",
      "1 GSTIN included",
      "Free portal support for 12-month subscription",
    ],
  },
  {
    id: "supreme-plus",
    name: "Supreme+",
    badge: "✦ HIGH-VOLUME",
    oldPrice: 4499,
    price: 2999,
    period: "/ month",
    services: [
      "Above 100 invoices / month OR contractor with multi-services",
      "Annual T/O Rs.2 crore to Rs.5 crore",
      "Everything in Supreme (extended capacity)",
      "Senior CA + GST counsel-led monthly review",
      "GSTR-9 (Annual Return) included",
      "GSTR-9C (Reconciliation Statement) - if T/O above Rs.5 Cr (separate add-on)",
      "E-way bill generation + monthly e-way bill register",
      "E-invoice (IRN) advisory (turnover > Rs.5 crore threshold watch)",
      "TDS / TCS GST compliance (GSTR-7 / GSTR-8) where applicable",
      "Department notice + reply handling (1 / year free)",
      "Quarterly GST council update briefing",
      "1 GSTIN; additional GSTIN at Rs.1,499 / month each",
    ],
  },
];

const GstFilingPlans = () => {
  const [activePlan, setActivePlan] = useState(null);
  // #133: payment (Buy Now → CheckoutModal) is paused; the shared "Book Free
  // Consultation" button below opens the consultation popup instead.
  const [showConsult, setShowConsult] = useState(false);

  return (
    <>
      <section className="opc-pricing-section">
        <div className="opcpricing-container">

          <header className="opcpricing-header">
            <h2 className="opcpricing-title">CHOOSE YOUR PLAN</h2>
            <p className="opcpricing-subtitle">
              File your GST returns on time at pocket-friendly prices
            </p>
          </header>

          <div className="opcpricing-cards gstf-pricing-cards">
            {PLANS.map((plan) => (
              <article
                key={plan.id}
                className={`opcplan-card${plan.popular ? " opcplan-card--popular" : ""}`}
              >
                <div>
                  <div className="opcplan-header">
                    {plan.badge && (
                      <div className={`opcplan-badge${plan.popular ? " opcplan-badge--popular" : ""}`}>
                        {plan.badge}
                      </div>
                    )}
                    <div className="opcplan-name">{plan.name}</div>
                    <div className="opcplan-old-price">₹{plan.oldPrice.toLocaleString("en-IN")}</div>
                    <div className="opcplan-price">
                      ₹{plan.price.toLocaleString("en-IN")}
                      <span style={{ fontSize: "0.5em", fontWeight: 500 }}> {plan.period}</span>
                    </div>
                    <div className="opcplan-meta">+ Govt. fees &amp; GST extra</div>
                  </div>

                  <div className="opcplan-body">
                    <ul className="opcplan-list">
                      {plan.services.map((s, i) => (
                        <li key={i} className="opcplan-list-item">{s}</li>
                      ))}
                    </ul>
                  </div>
                </div>

                {/* #133: per-card "Buy Now" hidden while payment is paused. Kept in
                    place (not deleted) so it can be re-enabled later. */}
                {false && (
                <div className="opcplan-footer">
                  <button
                    className={`opcplan-button${plan.popular ? " opcplan-button--popular" : ""}`}
                    onClick={() => setActivePlan(plan)}
                  >
                    Buy Now
                  </button>
                </div>
                )}
              </article>
            ))}
          </div>

          {/* #133: one shared CTA below the plans — opens the consultation popup. */}
          <div className="consult-cta-row">
            <button
              type="button"
              className="consult-cta-button"
              onClick={() => setShowConsult(true)}
            >
              📅 Book Free Consultation
            </button>
          </div>

        </div>
      </section>

      {activePlan && (
        <CheckoutModal plan={activePlan} onClose={() => setActivePlan(null)} source="gst-return-filing" />
      )}

      <ConsultationModal
        open={showConsult}
        onClose={() => setShowConsult(false)}
        source="gst-return-filing"
      />
    </>
  );
};

export default GstFilingPlans;
