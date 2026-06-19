import React from "react";
import "./TmexrBenefits.css";

const benefits = [
  {
    title: "Your Application Stays Alive — No Abandonment",
    text: "Under RULE 29 of the Trade Marks Rules, 2017, an application without a reply within 30 days is DEEMED ABANDONED. Filing a timely reply keeps your application LIVE on the Register's books + preserves all the work that went into the original application (mark search, classification, filing fee, the months of wait). The reply is what stops the clock running out on your trademark.",
  },
  {
    title: "Path to Acceptance + Journal Publication",
    text: "A reasoned, well-drafted reply that satisfies the Examiner moves your application to ACCEPTANCE — which means PUBLICATION in the Trade Marks Journal under Section 20. Once published, the 4-month public opposition window opens; if no opposition is filed (or any opposition is successfully countered), your trademark proceeds to REGISTRATION + a 10-year Certificate. The reply is the first door; acceptance is the next; publication is the bridge to registration.",
  },
  {
    title: "Unlocks Statutory Trademark Protection",
    text: "A successful reply leading to registration unlocks the full statutory protection bundle: SECTION 28 — exclusive right to use the trademark in respect of the registered goods / services; SECTION 29 — infringement remedies (injunction + damages + account of profits + delivery up); SECTION 31 — presumption of validity (the registered mark is presumed valid in any court proceeding); + the legal standing to enforce your brand against copycats. Without a reply, none of this is available — you're stuck with weaker common-law passing-off rights only.",
  },
  {
    title: "Preserves Your Priority Date + Brand Seniority",
    text: "Your trademark application has a PRIORITY DATE — the date you originally filed. This date defines who got there first in any future conflict. Abandonment means LOSING THAT PRIORITY DATE permanently — even if you refile later, the new priority date is the new filing date (potentially years later). A successful reply preserves your original priority + the brand seniority that compounds over decades.",
  },
  {
    title: "Unlocks Brand Registry + Customs + Marketplace Protection",
    text: "An active trademark application progressing toward registration is the gateway to: AMAZON BRAND REGISTRY + Flipkart Brand Centre + Meesho + Myntra + Nykaa + ONDC + Shopify brand-protection programmes (all of which require an active registered TM); INDIAN CUSTOMS RECORDAL under the IPR Imported Goods Enforcement Rules 2007 (border-protection against infringing imports); + standing to file OPPOSITIONS against later copycat applications. Abandonment locks you out of all of these.",
  },
  {
    title: "Saves Re-Application Cost + the 12–18 Month Wait",
    text: "If your application abandons, the only path to protect the same mark is a FRESH APPLICATION — which means: (a) paying the application fee again (₹4,500 or ₹9,000 per class), (b) waiting another 12–18 months for the full examination cycle, (c) facing the SAME OBJECTIONS again from the same Registry (the Examiner's database knows your previous mark), (d) losing your original priority date in the interim. A successful reply costs you a fraction of this + keeps your application moving.",
  },
];

const TmexrBenefits = () => {
  return (
    <section className="opcben-section">
      <div className="opcben-container">
        <header className="opcben-header">
          <h2 className="opcben-title">
            Benefits of Reply of Examination Report
          </h2>
          <p className="opcben-subtitle">
            A well-handled Examination Report reply is the difference between your application being REGISTERED (and protected for 10 years) versus being REFUSED or ABANDONED. Here's what we deliver beyond the form-filling:
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

export default TmexrBenefits;
