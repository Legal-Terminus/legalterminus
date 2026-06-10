import React from "react";
import "./TradeLicenseBenefits.css";

const TradeLicenseBenefits = () => {
  return (
    <section className="tradeben-section">
      <div className="tradeben-container">
        {/* Heading + intro */}
        <header className="tradeben-header">
          <h2 className="tradeben-title">
            Benefits of Trade License Registration in India
          </h2>
          <p className="tradeben-subtitle">
            Trade License is not bureaucratic friction — it&apos;s the civic green-light that unlocks your premises. Here&apos;s what matters:
          </p>
        </header>

        {/* Cards */}
        <div className="tradeben-grid">
          {/* 1 */}
          <article className="tradeben-card">
            <h3 className="tradeben-card-title">Legal Right to Operate from the Premises</h3>
            <div className="tradeben-card-underline" />
            <p className="tradeben-card-text">
              The Trade License is the Municipal Corporation&apos;s express authorisation that your activity is permitted at that premises + zone. Without it, the Corporation can SEAL your premises any time, refuse / disconnect utility connections, and prosecute under the State Municipal Act.
            </p>
          </article>

          {/* 2 */}
          <article className="tradeben-card">
            <h3 className="tradeben-card-title">Utility Connection Eligibility</h3>
            <div className="tradeben-card-underline" />
            <p className="tradeben-card-text">
              Commercial electricity, water, and sewerage connections in most cities require either a valid Trade License at application OR are tied to it for tariff / category determination. No Trade License = either no commercial connection or higher-tariff domestic connection (which itself may be illegal for business use).
            </p>
          </article>

          {/* 3 */}
          <article className="tradeben-card">
            <h3 className="tradeben-card-title">Brand + Premises Credibility</h3>
            <div className="tradeben-card-underline" />
            <p className="tradeben-card-text">
              Modern landlords + co-working operators + property managers REQUIRE valid Trade License before lease execution / renewal. B2B clients, government tender authorities, modern-trade buyers, and large customers conducting vendor due-diligence routinely ask for the trade license copy.
            </p>
          </article>

          {/* 4 */}
          <article className="tradeben-card">
            <h3 className="tradeben-card-title">Investor + Loan Readiness</h3>
            <div className="tradeben-card-underline" />
            <p className="tradeben-card-text">
              Banks, NBFCs, and investors evaluate Trade License compliance as part of standard due-diligence on the business premises. A missing or lapsed license is a deal-killer for working capital loans, MSME credit, and venture funding. Renewed Trade License = compliance discipline signal.
            </p>
          </article>

          {/* 5 */}
          <article className="tradeben-card">
            <h3 className="tradeben-card-title">Avoid Civic Penalties + Sealing Risk</h3>
            <div className="tradeben-card-underline" />
            <p className="tradeben-card-text">
              Operating without Trade License = per-day penalty + sealing risk + utility disconnection + prosecution. Cost of compliance (Rs.500-Rs.50,000/year) is a fraction of the cost of non-compliance (revenue loss from sealing alone runs into lakhs / week for retail / restaurants).
            </p>
          </article>

          {/* 6 */}
          <article className="tradeben-card">
            <h3 className="tradeben-card-title">Co-ordination with Adjacent Compliances</h3>
            <div className="tradeben-card-underline" />
            <p className="tradeben-card-text">
              The Trade License often anchors a wider compliance stack — Fire NOC, Pollution NOC, FSSAI, Shop &amp; Estd. Holding a valid Trade License simplifies the others (most ask for the Trade License number / copy as supporting evidence). Supreme tier co-ordinates the full stack so nothing slips.
            </p>
          </article>
        </div>
      </div>
    </section>
  );
};

export default TradeLicenseBenefits;
