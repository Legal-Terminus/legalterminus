import React, { useState } from "react";
import "./Legalhelp.css";

const TABS = [
  { id: "all", label: "All Services" },
  { id: "startup", label: "Startup Registration" },
  { id: "ngo", label: "NGO Registration" },
  { id: "government", label: "Government Registration" },
  { id: "trademark", label: "Trademark Registration" },
  { id: "returnfiling", label: "Return Filing" },
  { id: "licenses", label: "Government Licenses" },
];

const CARDS = [
  {
    id: 1,
    category: "startup",
    title: "Private Limited Registration in India",
    excerpt:
      "Start your company in India with expert guidance at an affordable cost. Our consultants support you at every step to make the process smooth and hassle-free.",
  },
  {
    id: 2,
    category: "startup",
    title: "Incorporation of Wholly Owned Subsidiary in India",
    excerpt:
      "Legal Terminus can help you with Incorporation of Wholly Owned Subsidiary (WOS) in India, as and when required, in a hassle-free manner within a reasonable time span. We provide expert assistance to meet your business setup needs in India.",
  },
  {
    id: 3,
    category: "startup",
    title: "Public Limited Company Registration in India",
    excerpt:
      "Legal Terminus can assist you with the public limited company registration in India for you, as and when required, ensuring a hassle-free process within a reasonable timeframe.",
  },
  {
    id: 4,
    category: "startup",
    title: "One Person Company Registration in India",
    excerpt:
      "Legal Terminus can assist you with the one person company (OPC) registration in India. We ensure a hassle-free process completed within a reasonable timeframe.",
  },
  {
    id: 5,
    category: "startup",
    title: "Limited Liability Partnership Registration in India",
    excerpt:
      "Legal Terminus can assist you with the Limited Liability Partnership (LLP) Registration in India. We ensure a hassle-free process completed within a reasonable timeframe.",
  },
  {
    id: 6,
    category: "startup",
    title: "Partnership Firm Registration in India",
    excerpt:
      "Legal Terminus can assist you with partnership firm registration in India. We ensure a hassle-free process completed within a reasonable timeframe.",
  },
  {
    id: 7,
    category: "startup",
    title: "Proprietorship Firm Registration in India",
    excerpt:
      "Legal Terminus can help you in Sole proprietorship firms registration in India, as and when required. We provide hassle-free services within a reasonable timeframe. Whether you need help with the proprietorship company registration process, we’ve got you covered.",
  },
  {
    id: 8,
    category: "ngo",
    title: "Non-profit Company/Sec-8 Company Registration in India",
    excerpt:
      "Legal Terminus can help you with the section 8 company registration in India, also known as non-profit organizations. Our services ensure a hassle-free process, completed within a reasonable timeframe. Trust us to streamline your section 8 company registration in India, making the process efficient and seamless.",
  },
  {
    id: 9,
    category: "ngo",
    title: "Trust Registration in India",
    excerpt:
      "Legal Terminus can help you with trust registration in India, ensuring a hassle-free process within a reasonable timeframe. Trust registration services are offered promptly and efficiently to meet your needs.",
  },
  {
    id: 10,
    category: "ngo",
    title: "Society Registration in India",
    excerpt:
      "Legal Terminus can help you with society registration in India, offering hassle-free services within a reasonable timeframe. We assist with society registration promptly and efficiently to meet your requirements.",
  },
  {
    id: 11,
    category: "government",
    title: "GST Registration in India",
    excerpt:
      "Legal Terminus can help you with GST registration in India, offering hassle-free services within a reasonable timeframe. We assist with GST registration promptly and efficiently to meet your organization’s needs.",
  },
  {
    id: 12,
    category: "government",
    title: "Udyam Registration in India",
    excerpt:
      "Legal Terminus can assist you with obtaining Udyam registration in India for your organization, seamlessly and efficiently. Our services ensure a hassle-free process within a reasonable timeframe.",
  },
  {
    id: 13,
    category: "government",
    title: "EPF Registration in India",
    excerpt:
      "Legal Terminus can assist you with obtaining EPF registration in India for your organization, seamlessly and efficiently. Our services ensure a hassle-free process within a reasonable timeframe.",
  },
  {
    id: 14,
    category: "government",
    title: "ESIC Registration in India",
    excerpt:
      "Legal Terminus can assist you with obtaining ESIC registration in India for your organization, seamlessly and efficiently. Our services ensure a hassle-free process within a reasonable timeframe.",
  },
  {
    id: 15,
    category: "government",
    title: "Professional Tax Registrationa",
    excerpt:
      "Legal Terminus can help you with obtaining Professional Tax Registration for your organization, as and when required, in a hassle-free manner within a reasonable time span.",
  },
  {
    id: 16,
    category: "government",
    title: "Shop & Commercial Establishment Registration in India",
    excerpt:
      "Legal Terminus can help you with obtaining shop establishment registration in India for your organization, as and when required, in a hassle-free manner within a reasonable time span.",
  },
  {
    id: 17,
    category: "government",
    title: "Odisha Labour Welfare Fund Registration",
    excerpt:
      "Legal Terminus can help you with Odisha Labour Welfare Fund (OLWF) Registration for your organization, as and when required, in a hassle-free manner within a reasonable time span.",
  },
  {
    id: 18,
    category: "government",
    title: "Startup India Registration",
    excerpt:
      "Legal Terminus can help you with Startup India registration, offering hassle-free services within a reasonable timeframe and guided by expert professionals. We ensure a smooth and efficient registration process tailored to meet your startup’s specific requirements.",
  },
  {
    id: 19,
    category: "government",
    title: "Startup Odisha Registration",
    excerpt:
      "Legal Terminus offers expert assistance with Startup Odisha registration, ensuring a hassle-free process tailored to your organization’s needs. Our team provides comprehensive support to navigate the registration procedure efficiently and effectively.",
  },
  {
    id: 20,
    category: "trademark",
    title: "Trademark Application",
    excerpt:
      "Legal Terminus can help you with the filing of an application for trademark registration for your organisation, as and when required, in a hassle-free manner. We are offering seamless services for trademark registration in India. We ensure a smooth process within a reasonable timeframe.",
  },
  {
    id: 21,
    category: "trademark",
    title: "Trademark Renewal",
    excerpt:
      "Legal Terminus can help you with obtaining Trademark Renewal in India for your organization, as and when required, in a hassle-free manner within a reasonable time span.",
  },
  {
    id: 22,
    category: "trademark",
    title: "Reply of Examination Report",
    excerpt:
      "Legal Terminus can help you with filing a reply to examination report trademark for your organization, as and when required, in a hassle-free manner within a reasonable time span.",
  },
  {
    id: 23,
    category: "trademark",
    title: "Trademark Opposition",
    excerpt:
      "Legal Terminus can help you with the process of the Trademark Opposition in India for your organization, as and when required, in a hassle-free manner within a reasonable time span.",
  },
  {
    id: 24,
    category: "trademark",
    title: "Trademark Hearing",
    excerpt:
      "Legal Terminus can help you with the process of the Trademark Opposition in India for your organization, as and when required, in a hassle-free manner within a reasonable time span.",
  },
  {
    id: 25,
    category: "returnfiling",
    title: "GST Return Filing",
    excerpt:
      "Legal Terminus can help you with GST return filing for your organization, within due date, in a hassle-free manner within a reasonable time span.",
  },
  {
    id: 26,
    category: "returnfiling",
    title: "ITR Filing (Business)",
    excerpt:
      "Legal Terminus can help you with the filing of Income Tax Return for you or your organization, within the due date, in a hassle-free manner within a reasonable time span.",
  },
  {
    id: 27,
    category: "returnfiling",
    title: "ITR Filing (Company)",
    excerpt:
      "Legal Terminus can help you with Income Tax Return Filing for you or your organization, within the due date, in a hassle-free manner within a reasonable time span.",
  },
  {
    id: 28,
    category: "returnfiling",
    title: "Annual Filing (Company)",
    excerpt:
      "Legal Terminus can help you with annual filing for your organization, within due date, in a hassle-free manner within a reasonable time span.",
  },
  {
    id: 29,
    category: "returnfiling",
    title: "Annual Filing (LLP)",
    excerpt:
      "Legal Terminus can help you with annual filing for your organization, within due date, in a hassle-free manner within a reasonable time span.",
  },
  {
    id: 30,
    category: "returnfiling",
    title: "EPF Return Filing",
    excerpt:
      "Legal Terminus can help you with EPF return filing for your organization, within due date, in a hassle-free manner within a reasonable time span.",
  },
  {
    id: 31,
    category: "returnfiling",
    title: "ESI Return Filing",
    excerpt:
      "Legal Terminus can help you with ESI return filing for your organization, within due date, in a hassle-free manner within a reasonable time span.",
  },
  {
    id: 32,
    category: "returnfiling",
    title: "Professional Tax Return Filing",
    excerpt:
      "Legal Terminus can help you with filing of Professional Tax return for your organization, within due date, in a hassle-free manner within a reasonable time span.",
  },
  {
    id: 33,
    category: "licenses",
    title: "Importer Exporter Code Registration",
    excerpt:
      "Legal Terminus can help you with the Importer Exporter Code Registration for your organization, as and when required, in a hassle-free manner within a reasonable time span.",
  },
  {
    id: 34,
    category: "licenses",
    title: "Food License Registration",
    excerpt:
      "Legal Terminus can help you with obtaining Food License and Registration for your organization, as and when required, in a hassle-free manner within a reasonable time span.",
  },
   {
    id: 35,
    category: "licenses",
    title: "Trade License Registration",
    excerpt:
      "Legal Terminus can help you with the Trade License Registration for your organization, as and when required, in a hassle-free manner within a reasonable time span.",
  },
  {
    id: 36,
    category: "licenses",
    title: "Labour License Registration",
    excerpt:
      "Legal Terminus can help you with Labour License Registration for your organization, as and when required, in a hassle-free manner within a reasonable time span.",
  },
  {
    id: 37,
    category: "licenses",
    title: "Bar Code Registration",
    excerpt:
      "Legal Terminus can help you with obtaining bar code registration for your organization, as and when required, in a hassle-free manner within a reasonable time span.",
  },
  {
    id: 38,
    category: "licenses",
    title: "ISO Certificate in India",
    excerpt:
      "Legal Terminus can help you with obtaining ISO certification in India for your organization, as and when required, in a hassle-free manner within a reasonable time span.",
  },
];

const Icon = ({ type = "bar" }) => {
  if (type === "bar") {
    return (
      <svg width="18" height="18" viewBox="0 0 24 24" aria-hidden="true">
        <rect x="3" y="5" width="4" height="14" rx="1" fill="currentColor" />
        <rect x="10" y="9" width="4" height="10" rx="1" fill="currentColor" />
        <rect x="17" y="2" width="4" height="17" rx="1" fill="currentColor" />
      </svg>
    );
  }
  return (
    <svg width="18" height="18" viewBox="0 0 24 24" aria-hidden="true">
      <path d="M6 2h7l5 5v15a1 1 0 0 1-1 1H6a1 1 0 0 1-1-1V3a1 1 0 0 1 1-1z" fill="currentColor" />
    </svg>
  );
};

const Legalhelp = () => {
  // default to "all" so content is always visible on load
  const [active, setActive] = useState("all");

  const filteredCards = active === "all" ? CARDS : CARDS.filter((c) => c.category === active);

  return (
    <section id="services" className="lh-root" aria-labelledby="lh-heading">
      <div className="lh-inner">
        <h2 id="lh-heading" className="lh-title">
          Your Trusted Partner for Legal & Compliance Services
        </h2>

        {/* green underline like screenshot */}
        <div className="lh-underline" aria-hidden="true" />

        <p className="lh-sub">
          Legal Terminus mainly helps entrepreneurs, startups, and small to medium businesses with essential legal and business needs. We provide easy support for business registration, government approvals, tax filings, trademark and IP services, and other compliance requirements—so you can run your business smoothly without legal confusion.

        </p>

        <div className="lh-grid">
          {/* LEFT: Tabs */}
          <nav className="lh-left" aria-label="Service categories">
            <ul className="lh-tabs" role="list">
              {TABS.map((t) => (
                <li key={t.id} className="lh-tabs__item">
                  <button
                    className={`lh-tab ${active === t.id ? "is-active" : ""}`}
                    onClick={() => setActive(t.id)}
                    aria-pressed={active === t.id}
                    aria-selected={active === t.id}
                  >
                    <span className="lh-tab__icon" aria-hidden="true">
                      <Icon type="bar" />
                    </span>
                    <span className="lh-tab__label">{t.label}</span>
                  </button>
                </li>
              ))}
            </ul>

            {/* accent stays inside the gap to avoid overlapping right content */}
            <div className="lh-left__accent" aria-hidden="true" />
          </nav>

          {/* RIGHT: Cards */}
          <div className="lh-right" role="region" aria-live="polite">
            <div className="lh-cards">
              {filteredCards.length ? (
                filteredCards.map((card) => (
                  <article key={card.id} className="lh-card" tabIndex={0}>
                    <div className="lh-card__media" aria-hidden="true">
                      <div className="lh-media__badge">
                        <Icon type="doc" />
                      </div>
                    </div>

                    <div className="lh-card__body">
                      <h3 className="lh-card__title">{card.title}</h3>
                      <div className="lh-hr" />
                      <p className="lh-card__excerpt">{card.excerpt}</p>

                      <div className="lh-card__cta">
                        <button className="lh-cta" aria-label={`Read more about ${card.title}`}>
                          <svg width="18" height="18" viewBox="0 0 24 24" aria-hidden="true">
                            <path d="M5 12h14M13 5l7 7-7 7" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" fill="none"/>
                          </svg>
                        </button>
                      </div>
                    </div>
                  </article>
                ))
              ) : (
                <div className="lh-empty">No services available for this category.</div>
              )}
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default Legalhelp;
