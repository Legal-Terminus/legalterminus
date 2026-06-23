import React from "react";
import "./TrademarkRights.css";

const Check = () => (
  <svg viewBox="0 0 24 24" width="16" height="16" fill="none" aria-hidden="true">
    <path d="M20 6L9 17l-5-5" stroke="currentColor" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round" />
  </svg>
);

const RIGHTS = [
  {
    title: "Enforcement and Legal Protections Against Infringement",
    text: "Enforcing trademark rights is crucial for maintaining the economic value of a trademark and protecting business interests.",
  },
  {
    title: "Control Over Licensing and Assignment",
    text: "Registered trademark owners have control over the licensing and assignment of their trademarks. This enables them to authorize others to use their trademarks under specified conditions without losing their ownership rights.",
  },
  {
    title: "Prevention of Unfair Competition",
    text: "Trademark registration helps prevent unfair competition by prohibiting competitors from using similar distinguishing signs that can confuse consumers. This right helps maintain the uniqueness of the brand and ensures fair market competition.",
  },
  {
    title: "Enhancement of Business Value",
    text: "Registered trademark significantly enhance the value of a business, transforming them into recognizable symbols of quality and trust.",
  },
];

const TrademarkRights = () => {
  return (
    <section className="tmr-section">
      <div className="tmr-container">
        <h2 className="tmr-heading">Understanding Rights of a Registered Trademark User</h2>
        <p className="tmr-intro">
          The registration of a trademark grants its owner specific legal rights that are crucial for
          protecting their brand. Owning a registered trademark does not just allow the owner to use the
          mark; it primarily provides the legal authority to prevent others from using the same or a
          confusingly similar mark on related goods or services. This protection is essential for
          maintaining the uniqueness of a brand in a competitive market. These rights are confined within
          the territorial bounds of the country where the trademark is registered.
        </p>

        <div className="tmr-grid">
          {RIGHTS.map((r) => (
            <div className="tmr-card" key={r.title}>
              <span className="tmr-icon" aria-hidden="true">
                <Check />
              </span>
              <div className="tmr-body">
                <h3 className="tmr-title">{r.title}</h3>
                <p className="tmr-text">{r.text}</p>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default TrademarkRights;
