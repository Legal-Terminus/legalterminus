import React from "react";
import "./FoodLicenseBenefits.css";

const benefits = [
  {
    title: "Legal Right to Operate",
    text: "An FSSAI license is the statutory authorisation to carry on a food business under Section 31 of the FSS Act, 2006. Without it, operations are illegal and attract Section 63 penalties (imprisonment up to 6 months + fine up to ₹5 lakh). With it — and a disciplined renewal calendar — you operate openly.",
  },
  {
    title: "4-Tier Plan = Right Fit for Your FBO",
    text: "We've split Basic Registration into Elemental (tea stall + hawker) + Enriched (other Basic) so the simplest cases pay the simplest price. State Licence stays Supreme; Central Licence is Supreme Plus. Pay for what you actually need — no over-paying for unnecessary FSMP / HACCP overhead if you're a hawker; no under-quoting if you're an importer.",
  },
  {
    title: "Compliance Relief from the 2026 Slab Hike",
    text: "The revised slabs (Basic up to ₹1.5 Cr; State up to ₹50 Cr) mean many small / mid FBOs drop down one tier — lower documentation, lower government fees, lighter oversight. A unit doing ₹50 lakh turnover that earlier needed a State License (₹2,000–5,000/year) now fits into Basic (₹100/year).",
  },
  {
    title: "Renewal Discipline Built-In",
    text: "FSSAI licences are issued for 1–5 years (applicant's choice). Renewal must be filed BEFORE expiry — the 180-day pre-expiry window is the sweet spot. Late renewal attracts ₹100/day penalty (no cap); beyond 180 days post-expiry the licence can be cancelled. Our plans include a renewal-reminder calendar with 90 / 30 / 7-day pre-expiry alerts so the renewal never slips — the cheapest insurance you can buy against business disruption.",
  },
  {
    title: "Marketplace + B2B + Tender Access",
    text: "Swiggy, Zomato, Amazon Food, BigBasket, Blinkit, Zepto, modern trade chains, government tenders, institutional catering, and large B2B buyers ALL require valid FSSAI at onboarding (with the right category — e-commerce needs Central per FSSAI 2017 Order). No license = no listing = no revenue.",
  },
  {
    title: "Investor + Funding Readiness",
    text: "Venture investors and lenders in the food / FMCG / restaurant / cloud kitchen space treat valid FSSAI licensing as table stakes. Due diligence will flag a missing or wrong-category licence + expired-licence-on-record as deal-killers or material risk. A disciplined renewal calendar + clean annual returns (Form D1) + risk-based-inspection readiness = strong DD posture.",
  },
];

const FoodLicenseBenefits = () => {
  return (
    <section className="opcben-section">
      <div className="opcben-container">
        <header className="opcben-header">
          <h2 className="opcben-title">
            Benefits of Food License Registration in India
          </h2>
          <p className="opcben-subtitle">
            FSSAI license isn't just a sticker on the wall — it's a business enabler. Here's what matters in the 2026 reform-era regime:
          </p>
        </header>

        <div className="opcben-grid">
          {benefits.map((benefit, i) => (
            <article className="opcben-card" key={i}>
              <h3 className="opcben-card-title">{benefit.title}</h3>
              <div className="opcben-card-underline" />
              <p className="opcben-card-text">{benefit.text}</p>
            </article>
          ))}
        </div>
      </div>
    </section>
  );
};

export default FoodLicenseBenefits;
