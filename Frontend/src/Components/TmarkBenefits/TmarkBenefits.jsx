import React from "react";
import "./TmarkBenefits.css";

const TmarkBenefits = () => {
  return (
    <section className="opcben-section">
      <div className="opcben-container">
        <header className="opcben-header">
          <h2 className="opcben-title">
            Benefits of Registering Your Trademark
          </h2>
          <p className="opcben-subtitle">
            A registered trademark turns your brand from a vulnerable name into legally protected, valuable property — giving you exclusive rights, enforcement power, and a real business asset.
          </p>
        </header>

        <div className="opcben-grid">
          <article className="opcben-card">
            <h3 className="opcben-card-title">Exclusive Nationwide Rights</h3>
            <div className="opcben-card-underline" />
            <p className="opcben-card-text">
              Registration gives you the exclusive right to use your mark across India for the goods or services in your class, and the legal power to stop anyone else from using an identical or deceptively similar mark in the same space.
            </p>
          </article>

          <article className="opcben-card">
            <h3 className="opcben-card-title">Strong Legal Protection</h3>
            <div className="opcben-card-underline" />
            <p className="opcben-card-text">
              A registered mark lets you file an infringement suit — a far stronger and easier remedy than a passing-off action available to unregistered brands. It is treated as prima facie proof of ownership, putting you on solid legal footing in any dispute.
            </p>
          </article>

          <article className="opcben-card">
            <h3 className="opcben-card-title">A Valuable Business Asset</h3>
            <div className="opcben-card-underline" />
            <p className="opcben-card-text">
              A trademark is intellectual property you own. It can be licensed for royalties, franchised, used as collateral, or sold — and it adds to the valuation of your company during fundraising, partnerships, or acquisition.
            </p>
          </article>

          <article className="opcben-card">
            <h3 className="opcben-card-title">Builds Trust &amp; Brand Value</h3>
            <div className="opcben-card-underline" />
            <p className="opcben-card-text">
              The ™ and ® symbols signal that your brand is established and protected, building customer confidence and goodwill. Over time, a registered trademark becomes the legal anchor for your reputation and the value you've built.
            </p>
          </article>

          <article className="opcben-card">
            <h3 className="opcben-card-title">E-Commerce &amp; Marketplace Protection</h3>
            <div className="opcben-card-underline" />
            <p className="opcben-card-text">
              Amazon Brand Registry, Flipkart, and other marketplaces require a registered (or applied-for) trademark to unlock brand-protection tools that block counterfeiters and listing hijackers — essential for any serious online seller.
            </p>
          </article>

          <article className="opcben-card">
            <h3 className="opcben-card-title">Long Validity, Renewable Forever</h3>
            <div className="opcben-card-underline" />
            <p className="opcben-card-text">
              A registered trademark is valid for 10 years and can be renewed indefinitely in 10-year blocks. Unlike many assets, a well-maintained trademark can protect and grow in value for as long as your brand exists.
            </p>
          </article>
        </div>
      </div>
    </section>
  );
};

export default TmarkBenefits;
