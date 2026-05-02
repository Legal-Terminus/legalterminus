import React, { useState, memo } from "react";
import "./Premiumbusiness.css";

const PREMIUM_ICONS = [
  "M3 12c0-4.97 4.03-9 9-9s9 4.03 9 9-4.03 9-9 9S3 16.97 3 12zm8-5h2v6h3l-4 4-4-4h3V7z",
  "M12 2l3.09 6.26L22 9.27l-5 4.87L18.18 22 12 18.56 5.82 22 7 14.14 2 9.27l6.91-1.01L12 2z",
  "M12 2a9 9 0 100 18 9 9 0 000-18zm1 13H11v-2h2v2zm0-4H11V6h2v5z",
  "M4 4h16v3H4zM4 11h10v2H4zM4 15h16v5H4z",
  "M12 3C8.13 3 5 6.13 5 10c0 3.87 2.64 7.07 6 7.83V21l1-1 1 1v-3.17c3.36-.76 6-3.96 6-7.83 0-3.87-3.13-7-7-7z",
  "M12 1L3 5v6c0 5 3.58 9.74 9 11 5.42-1.26 9-6 9-11V5l-9-4z"
];

const SERVICES = [
  {
    title: "Company & Startup Registration",
    short: `We help you register Private Limited Companies, LLPs, OPCs, Partnerships, and Proprietorships. Our team handles everything—from name approval and company registration to DIN, DSC, PAN/TAN etc.`,
  },
  {
    title: "Licenses & Government Registrations",
    short: `Legal Terminus assists with FSSAI, Trade License, Labour Registration, Shop & Establishment, MSME/Udyam Registration, and other government registrations.`,
  },
  {
    title: "Trademark & Intellectual Property",
    short: `We provide Trademark Registration, handle objections and oppositions, manage renewals, and help safeguard your brand from misuse—ensuring your ideas stay protected.`,
  },
  {
    title: "Taxation & Compliance Services",
    short: `Legal Terminus offers GST Registration and Returns, Income Tax Filing, TDS compliance, ROC filings, annual compliances, and expert tax guidance handled by qualified professionals.`,
  },
  // {
  //   title: "Non-Profit Making Structures",
  //   short: `Legal Terminus helps you legally establish and manage Non-Profit company, Trusts and Societies Registration in India...`,
  //   full: `We guide you through the registration of Non-Profit Companies, Trusts, and Societies in India, including Section 8 Company setup and 12A & 80G certification. Legal Terminus also provides ongoing compliance and documentation support to ensure your non-profit runs smoothly and stays legally compliant.`
  // },
  // {
  //   title: "Legal Advisory & Documentation",
  //   short: `Get expert legal advice and professionally drafted documents tailored to your business needs...`,
  //   full: `Our experts provide contract drafting, agreement review, legal notices, business advice, and ongoing legal assistance—tailored to support startups and growing businesses.`
  // }
];


const PremiumIcon = memo(function PremiumIcon({ path, id }) {
  return (
    <svg
      className="pb-icon-svg"
      viewBox="0 0 24 24"
      role="img"
      aria-labelledby={`pb-icon-${id}`}
      xmlns="http://www.w3.org/2000/svg"
    >
      <defs>
        <linearGradient id={`g-${id}`} x1="0%" y1="0%" x2="100%" y2="100%">
          <stop offset="0%" stopColor="#4CAF50" />
          <stop offset="100%" stopColor="#45a049" />
        </linearGradient>
        <linearGradient id={`bg-${id}`} x1="0%" y1="0%" x2="100%" y2="100%">
          <stop offset="0%" stopColor="#f0f9f0" />
          <stop offset="100%" stopColor="#e6f4e6" />
        </linearGradient>
        <filter id={`b-${id}`} x="-30%" y="-30%" width="160%" height="160%">
          <feDropShadow dx="0" dy="6" stdDeviation="10" floodColor="#4CAF50" floodOpacity="0.08" />
        </filter>
      </defs>

      <g filter={`url(#b-${id})`}>
        <circle cx="12" cy="12" r="11" fill={`url(#bg-${id})`} />
      </g>

      <g transform="translate(2,2) scale(0.75)">
        <path d={path} fill={`url(#g-${id})`} />
      </g>

      <title id={`pb-icon-${id}`}>Service icon</title>
    </svg>
  );
});

export default function Premiumbusiness() {
  const [openIndex, setOpenIndex] = useState(null);

  function toggleIndex(i) {
    setOpenIndex((prev) => (prev === i ? null : i));
  }

  return (
    <section className="pb-section" aria-labelledby="pb-heading">
      <div className="pb-wrapper">
        <div className="pb-left">
          <div className="pb-left-content">
           <h3 id="pb-heading" className="pb-head">
              Legal Solutions Made <span className="highlight">Simple</span>
            </h3>


            <p className="pb-intro">
            Welcome to Legal Terminus Private Limited, your trusted partner for legal and business support in India. We help startups, businesses, NGOs, and enterprises with company registration, trademark filing, GST, FSSAI, and other legal requirements.
  <br /><br />
Legal Terminus makes legal work simple and stress-free. Our experienced team handles the complete process with care, honesty, and on-time delivery, so you don’t have to worry about paperwork or compliance. We work closely with you and explain everything in clear, simple terms.
  <br /><br />
With a strong focus on customer satisfaction and smart solutions, Legal Terminus supports you at every step—so you can focus on growing your business while we take care of the legal work.

          </p>


           {/* <div className="pb-stats">
              <div className="pb-stat">
                <span className="pb-stat-number">5K+</span>
                <span className="pb-stat-label">Clients Served</span>
              </div>
              <div className="pb-stat">
                <span className="pb-stat-number">500+</span>
                <span className="pb-stat-label">Legal Experts</span>
              </div>
              <div className="pb-stat">
                <span className="pb-stat-number">Pan India</span>
                <span className="pb-stat-label">Service Reach</span>
              </div>
            </div> */}


            <div className="pb-actions">
             <button className="pb-primary">
                  <span>View Legal Services</span>
                </button>

                <button className="pb-ghost pb-ghost--dark">
                  <span>Get Expert Consultation</span>
                </button>
            </div>
          </div>
        </div>

        <div className="pb-right">
          <div className="pb-card-grid" role="list">
            {SERVICES.map((s, i) => {
              const isOpen = openIndex === i;
              return (
                <article
                  key={s.title}
                  className={`pb-card ${isOpen ? "open" : ""}`}
                  role="listitem"
                  aria-labelledby={`title-${i}`}
                  tabIndex={0}
                  onKeyDown={(e) => {
                    if (e.key === 'Enter' || e.key === ' ') {
                      e.preventDefault();
                      toggleIndex(i);
                    }
                  }}
                >
                  <div className="pb-card-icon" aria-hidden="true">
                    <PremiumIcon path={PREMIUM_ICONS[i % PREMIUM_ICONS.length]} id={i} />
                  </div>

                  <div className="pb-card-body">
                    <div className="pb-card-top">
                      <div className="pb-card-title-wrapper">
                        <h3 id={`title-${i}`} className="pb-card-title">{s.title}</h3>
                        <span className="pb-card-index">0{i + 1}</span>
                      </div>
                      <p className="pb-card-desc">
                        {s.short}
                        <button
                          className="preminum-read-btn"
                          onClick={() => toggleIndex(i)}
                          aria-expanded={isOpen}
                          aria-controls={`panel-${i}`}
                          aria-label={isOpen ? `Show less about ${s.title}` : `Read more about ${s.title}`}
                        >
                          {/* {isOpen ? " Show less" : " Read more"} */}
                          <svg className="preminum-read-btn-icon" width="16" height="16" viewBox="0 0 24 24" fill="none">
                            <path d={isOpen ? "M18 15L12 9L6 15" : "M6 9L12 15L18 9"} stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                          </svg>
                        </button>
                      </p>
                    </div>

                    <div
                      id={`panel-${i}`}
                      className="pb-card-extras"
                      data-open={isOpen ? "true" : "false"}
                      aria-hidden={!isOpen}
                    >
                      {/* <div className="pb-card-full-wrapper">
                        <p className="pb-card-full">{s.full}</p>
                        <button className="pb-card-action">
                          Learn more
                          <svg width="14" height="14" viewBox="0 0 24 24" fill="none">
                            <path d="M5 12H19M19 12L12 5M19 12L12 19" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                          </svg>
                        </button>
                      </div> */}
                    </div>
                  </div>
                </article>
              );
            })}
          </div>
        </div>
      </div>
    </section>
  );
}