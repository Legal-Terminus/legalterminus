import React, { Suspense, useState } from "react";
import ConsultationForm from "../../Components/ConsultationForm/ConsultationForm";
import CutPrice from "../../Components/CutPrice/CutPrice";
import { usePlans, PAYMENTS_ENABLED } from "../../utils/pricing";
import premiumIllustration from "../../assets/lt-company.svg";
import introIllustration from "../../assets/whypvt-imp.svg";
import typesIllustration from "../../assets/whypvt-imp1.svg";

// The same section family as every other service page ("Add or Remove a
// Director" is the Theme C reference, src/Pages/Add). The markup reuses that
// page's class names so src/theme/families.css styles it with no new fan-out.
import "../../Components/AddBreadcrum/AddBreadcrum.css";
import "../../Components/AddPlanandPricing/AddPlanandPricing.css";
import "../../Components/AddTermsCondition/AddTermsCondition.css";
import "../../Components/AddZolvitPremium/AddZolvitPremium.css";
import "../../Components/AddTabs/AddTabs.css";
import "../../Components/AddCompanyTab/AddCompanyTab.css";
import "../../Components/AddTypes/AddTypes.css";
import "../../Components/AddRequirementsTab/AddRequirementsTab.css";
import "../../Components/AddProcess/AddProcess.css";
import "../../Components/AddFAQ/AddFAQ.css";

const CheckoutModal = React.lazy(() => import("../../Components/ProCheckoutModal/ProCheckoutModal"));
const ConsultationModal = React.lazy(() => import("../../Components/ConsultationModal/ConsultationModal"));

/**
 * Technology Services — software development sold by Legal Terminus and
 * delivered by its technology partner, Infynia Labs (https://infynialabs.com).
 * The services a company needs right after incorporation: a website, a payment
 * gateway, business email, an online store.
 */
export const INFYNIA_URL = "https://infynialabs.com/";
const SOURCE = "technology-services";

// E24-S01: prices come from the server catalogue (Website Prices in the
// portal, product key "technology-services"); these are the fallback. Only
// the two priced plans are in the catalogue: Supreme is custom, priced on
// request, and goes to the consultation form rather than the checkout.
const DEFAULT_PLANS = [
  { id: "elemental", name: "Elemental", price: 14999, services: ["Business website (up to 5 pages)", "Domain and hosting setup (1 year)", "Business email on your domain (up to 5 users)", "Google Business Profile"] },
  { id: "enriched", name: "Enriched", price: 29999, services: ["Everything in Elemental", "Payment gateway integration", "Contact and enquiry forms with lead alerts", "Basic SEO and Google Analytics", "30 days of post-launch support"] },
];
const CUSTOM_PLAN = {
  name: "Supreme",
  services: ["Everything in Enriched", "Online store, booking system or mobile app", "Custom software and automation", "GST-compliant invoicing", "Ongoing support plan"],
};

const TABS = [
  { label: "Why Choose Us", id: "company" },
  { label: "Services", id: "types" },
  { label: "Benefits", id: "requirements" },
  { label: "Process & Steps", id: "process" },
  { label: "FAQ's", id: "faq" },
];

const SERVICES = [
  { title: "Website Design & Development", text: "A fast, mobile-friendly website for your company — from a single landing page to a full business site — with your domain, hosting and SSL set up and handed over in your name." },
  { title: "Payment Gateway Integration", text: "Accept UPI, cards and net banking on your website or app. We handle the gateway onboarding (Razorpay, PayU, PhonePe, Cashfree), the integration and the testing, so your first payment just works." },
  { title: "Business Email & Google Workspace", text: "Email on your own domain (you@yourcompany.com), shared calendars and drive — set up, secured and handed over with your team already added." },
  { title: "Online Store", text: "Sell online with a store that has products, cart, checkout, shipping and GST-compliant invoices built in, on Shopify, WooCommerce or a custom build." },
  { title: "Mobile App Development", text: "An Android or iOS app for your customers or your field team, published to the Play Store and App Store under your company's account." },
  { title: "Custom Software & Automation", text: "Billing, CRM, bookings, dashboards or an internal tool built around how your business works — and integrations between the tools you already use." },
];

const BENEFITS = [
  { title: "End-to-End, Owned by Legal Terminus", text: "From the first call to launch and support, Legal Terminus owns the engagement — the scope, the timeline, the quality and the handover — exactly as it does for your compliance work. You never chase a third party." },
  { title: "AI-Native, Fast Development and Deployment", text: "Legal Terminus along with Infynia Labs builds with AI-native tooling at every stage — design, code, testing and deployment — so a business website goes live in days, not months, and changes after launch are just as quick." },
  { title: "One Partner for Compliance and Technology", text: "Your consultant already knows your company, its directors and its timelines. Technology work is coordinated through the same relationship, with one point of contact." },
  { title: "Built by Legal Terminus together with Infynia Labs", text: "Delivery is by Legal Terminus together with Infynia Labs — a software company that builds web, mobile and cloud products — including the platform Legal Terminus itself runs on." },
  { title: "Fixed Scope, Fixed Price", text: "Every project starts with a written scope and a price you approve before any work begins. Changes are quoted before they are made." },
  { title: "Everything in Your Name", text: "Domains, hosting, gateway and store accounts are opened under your company, so you own them from day one and nothing is tied to a vendor." },
];

const STEPS = [
  { title: "Step 1 – Requirement Discussion", text: "Share your requirement through the form or on a call with your Legal Terminus consultant — the same person who handled your registration." },
  { title: "Step 2 – Scope & Quotation", text: "Legal Terminus reviews the requirement and you receive a written scope, timeline and fixed price. No work starts until you approve it." },
  { title: "Step 3 – Content & Accounts", text: "You share your logo, content and documents; we open the domain, hosting, email and payment-gateway accounts in your company's name." },
  { title: "Step 4 – Design Approval", text: "You review the design on a preview link and approve it before development begins." },
  { title: "Step 5 – Build & Testing", text: "The Legal Terminus team builds and tests it on every screen size, with a test payment end to end where a gateway is involved." },
  { title: "Step 6 – Launch & Handover", text: "The site or app goes live and everything — code, logins, domain — is handed over to you with a short walkthrough." },
  { title: "Step 7 – Support", text: "Post-launch support for the period in your plan, with optional monthly support after that." },
];

const FAQS = [
  { question: "How much does it cost?", answer: "The Elemental and Enriched plans above are fixed-price packages you can buy online. Supreme is custom — an app, custom software, a larger store — and is priced on request after a short scoping call. You receive the price in writing before any work starts." },
  { question: "How long does a website take?", answer: "A standard business website is usually live within two to three weeks of receiving your content and approving the design. Online stores and apps take longer and are planned with milestones." },
  { question: "Do I need a registered company first?", answer: "No, but most clients take these services right after registration — a domain, email and payment gateway are typically opened in the company's name, so having the incorporation certificate and PAN ready makes setup faster." },
  { question: "What if I already have a website?", answer: "We can add to it — a payment gateway, a store, business email or a redesign — rather than starting over. Mention the current site in the form and the quote will be for the change you need." },
  { question: "Will I own the website, domain and accounts?", answer: "Yes. Every account is opened in your company's name and the logins are handed over at launch. Hosting and domain renewals are payable to the provider at actuals." },
  { question: "What is included in post-launch support?", answer: "Fixes to anything that was built, small content changes and help with the accounts set up for you, for the period in your plan. Larger changes are quoted separately." },
  { question: "How can Legal Terminus help?", answer: "Legal Terminus arranges the whole thing through the consultant you already work with, so your compliance and your technology are handled together. Book a free consultation to get started." },
];

const PlanCard = ({ plan, popular, onBuy }) => (
  <article className="Add-pp-card">
    <div>
      <div className="Add-pp-header">
        <div className="Add-pp-name">{plan.name}</div>
        <CutPrice plan={plan} />
        <div className="Add-pp-price">{plan.price.toLocaleString("en-IN")}</div>
        <div className="Add-pp-meta">
          Professional fee {popular && <span className="popular">(Popular)</span>}
        </div>
      </div>
      <div className="Add-pp-body">
        <ul className="Add-pp-list">
          {plan.services.map((s) => (
            <li key={s} className="Add-pp-list-item">{s}</li>
          ))}
        </ul>
      </div>
    </div>
    {PAYMENTS_ENABLED && (
      <div className="Add-pp-footer">
        <button className="Add-pp-button" onClick={() => onBuy(plan)}>Buy Now</button>
      </div>
    )}
  </article>
);

const TechServices = () => {
  const PLANS = usePlans(SOURCE, DEFAULT_PLANS);
  const [activePlan, setActivePlan] = useState(null);
  const [showConsult, setShowConsult] = useState(false);
  // #243: the firm does not want this page to send visitors to infynialabs.com for
  // the portfolio. A visitor asks for it instead, through the consultation form.
  const [showPortfolio, setShowPortfolio] = useState(false);
  const [activeTab, setActiveTab] = useState(0);
  const [activeFaq, setActiveFaq] = useState(0);

  const goTo = (index, id) => {
    setActiveTab(index);
    document.getElementById(id)?.scrollIntoView({ behavior: "smooth", block: "start" });
  };

  return (
    <div>
      {/* Hero */}
      <section className="Add-public-hero">
        <div className="Add-public-container">
          <div className="Add-public-content">
            <span className="Add-public-tag">Along with Infynia Labs</span>
            <h1 className="Add-public-title">Technology Services For Your New Business</h1>
            <p className="Add-public-description">
              Take your business online with complete technology solutions, including website
              development, payment gateway integration, professional business email, online stores and
              custom software. Legal Terminus along with Infynia Labs, brings you everything under one
              roof with seamless coordination and a single point of contact. Packages start at just
              ₹14,999/-.
            </p>
            <div className="Add-public-features">
              <div className="Add-feature-item"> Website, Domain & Business Email</div>
              <div className="Add-feature-item"> Payment Gateway Integration</div>
              <div className="Add-feature-item"> Online Store & Custom Software</div>
              <div className="Add-feature-item"> Everything Opened In Your Company's Name</div>
            </div>
            <div className="Add-public-highlights">
              <div>
                <h3>Complete Solutions</h3>
                <p>Managed by Legal Terminus</p>
              </div>
              <div>
                <h3>Smart Technology</h3>
                <p>Powered by AI</p>
              </div>
              <div>
                <h3>Transparent Pricing</h3>
                <p>Clear Scope &amp; Fixed Cost</p>
              </div>
            </div>
          </div>
          <ConsultationForm source={SOURCE} subtitle="Talk to our technology consultant" />
        </div>
      </section>

      {/* Plans */}
      <div id="plans">
        <section className="Add-pp-Add-pp-section">
          <div className="Add-pp-container">
            <header className="Add-pp-header">
              <h2 className="Add-pp-Add-pp-title">CHOOSE YOUR PLAN</h2>
              <p className="Add-pp-subtitle">Technology packages for new businesses with pocket friendly-prices</p>
            </header>
            <div className="Add-pp-cards">
              <PlanCard plan={PLANS[0]} onBuy={setActivePlan} />
              <PlanCard plan={PLANS[1]} popular onBuy={setActivePlan} />
              {/* Supreme is custom: no catalogue price, no checkout — a quote request. */}
              <article className="Add-pp-card">
                <div>
                  <div className="Add-pp-header">
                    <div className="Add-pp-name">{CUSTOM_PLAN.name}</div>
                    <div className="Add-pp-price" style={{ fontSize: "1.5rem" }}>Custom</div>
                    <div className="Add-pp-meta">Pricing on request</div>
                  </div>
                  <div className="Add-pp-body">
                    <ul className="Add-pp-list">
                      {CUSTOM_PLAN.services.map((s) => (
                        <li key={s} className="Add-pp-list-item">{s}</li>
                      ))}
                    </ul>
                  </div>
                </div>
                <div className="Add-pp-footer">
                  <button className="Add-pp-button" type="button" onClick={() => setShowConsult(true)}>Request a Quote</button>
                </div>
              </article>
            </div>
            <div className="consult-cta-row">
              <button type="button" className="consult-cta-button" onClick={() => setShowConsult(true)}>
                📅 Book Free Consultation
              </button>
            </div>
          </div>
        </section>
      </div>

      {/* Terms */}
      <section className="Add-tc-section">
        <div className="Add-tc-container">
          <h2 className="Add-tc-title">TERMS &amp; CONDITIONS</h2>
          <ol className="Add-tc-list">
            <li className="Add-tc-item">18% GST applicable on professional fee.</li>
            <li className="Add-tc-item">Domain, hosting, email and payment-gateway charges are payable to the respective provider as per actuals and are not included unless stated in the plan.</li>
            <li className="Add-tc-item">Services are delivered by Legal Terminus along with Infynia Labs.</li>
            <li className="Add-tc-item">In case the above plans do not qualify your requirements, kindly contact our executive, we shall be happy to customize a plan for you.</li>
          </ol>
        </div>
      </section>

      {/* Priority block */}
      <div id="premium">
        <section className="Add-zp-section">
          <div className="Add-zp-container">
            <div className="Add-zp-card">
              <div className="Add-zp-illustration-wrapper">
                <img src={premiumIllustration} alt="Technology services by Legal Terminus and Infynia Labs" className="Add-zp-illustration" />
              </div>
              <div className="Add-zp-content">
                <header className="Add-zp-header">
                  <h2 className="Add-zp-title">
                    Legal Terminus <span className="Add-zp-title-highlight">Priority</span> <span className="Add-zp-title-icon">💻</span>
                  </h2>
                  <p className="Add-zp-subtitle">
                    Get your business online the same way you got it registered — through one consultant, with a
                    written scope, a fixed price and a team that builds it properly.
                  </p>
                </header>
                <section className="Add-zp-section-block">
                  <h3 className="Add-zp-label">What You Get:</h3>
                  <ul className="Add-zp-list Add-zp-features-list">
                    <li className="Add-zp-list-item"><span className="Add-zp-list-icon">🧑‍💻</span>End-to-end delivery by Legal Terminus, together with the Infynia Labs team, covering design, development and setup, coordinated by your dedicated consultant.</li>
                    <li className="Add-zp-list-item"><span className="Add-zp-list-icon">⚡</span>AI-native development and deployment — a business website live in days, and changes after launch just as fast.</li>
                    <li className="Add-zp-list-item"><span className="Add-zp-list-icon">📑</span>A written scope and timeline before work starts, a preview link at every stage, and a walkthrough with all logins at handover.</li>
                  </ul>
                </section>
                <section className="Add-zp-section-block">
                  <h3 className="Add-zp-label">Important Notes:</h3>
                  <div className="Add-zp-note-box">
                    <ul className="Add-zp-note-list">
                      <li className="Add-zp-note-item">Payment gateways and business email are opened in the company's name, so keep the incorporation certificate, PAN and bank details ready.</li>
                      <li className="Add-zp-note-item">To explore Infynia Labs' capabilities, visit{" "}
                        <a href={INFYNIA_URL} target="_blank" rel="noopener noreferrer">infynialabs.com</a>; to see their past work,{" "}
                        {/* #243: the portfolio is requested here, not opened on infynialabs.com */}
                        <button type="button" className="Add-zp-note-link" onClick={() => setShowPortfolio(true)}>request the portfolio</button>.
                      </li>
                    </ul>
                  </div>
                </section>
                <div className="Add-zp-cta-row" style={{ display: "flex", flexWrap: "wrap", gap: 12 }}>
                  <button className="Add-zp-cta-btn" type="button" onClick={() => setShowConsult(true)}>
                    Consult a Technology Expert
                  </button>
                  <button className="Add-zp-cta-btn" type="button" onClick={() => setShowPortfolio(true)}>
                    Request Portfolio
                  </button>
                </div>
              </div>
            </div>
          </div>
        </section>
      </div>

      {/* Section tabs */}
      <section className="Add-tab-tabs-section">
        <div className="Add-tab-tabs-container">
          <div className="Add-tab-tabs-card">
            <div className="Add-tab-tabs-list">
              {TABS.map((tab, index) => (
                <button key={tab.id} type="button" className={`Add-tab-tab ${index === activeTab ? "active" : ""}`} onClick={() => goTo(index, tab.id)}>
                  {tab.label}
                </button>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* Why choose */}
      <div id="company">
        <div className="Add-com-tabfull-wrapper">
          <section className="Add-com-tabintro-section">
            <div className="Add-com-tabintro-container">
              <div className="Add-com-tabintro-illustration-wrap">
                <img src={introIllustration} alt="Technology services illustration" className="Add-com-tabintro-illustration" />
              </div>
              <div className="Add-com-tabintro-content">
                <h2 className="Add-com-tabintro-title">Why Choose Technology Services From Legal Terminus</h2>
                <p className="Add-com-tabintro-text">
                  A newly registered company needs a few things almost immediately: a website, a professional
                  email on its own domain, a way to accept payments and, often, an online store or booking system.
                  Legal Terminus, together with Infynia Labs, provides all these technology solutions end to end
                  while maintaining the same commitment to service and coordination as its compliance offerings.
                  The consultant who handled your company registration remains your single point of contact for
                  your technology requirements as well. With combined expertise in AI-powered development, design
                  and deployment, Legal Terminus along with Infynia Labs help businesses launch faster, with a
                  business website ready in days rather than months. Every project begins with a clearly defined
                  scope and transparent pricing, all accounts are created in your company's name, and you get one
                  reliable point of contact for both your compliance and technology needs.
                </p>
              </div>
            </div>
          </section>
        </div>
      </div>

      {/* Services */}
      <div id="types">
        <section className="Add-typestypes-section">
          <div className="Add-typestypes-container">
            <div className="Add-typestypes-illustration-wrap">
              <img src={typesIllustration} alt="Types of technology services" className="Add-typestypes-illustration" />
            </div>
            <div className="Add-typestypes-content">
              <h2 className="Add-typestypes-title">Technology Services We Offer</h2>
              {SERVICES.map((s) => (
                <div key={s.title} className="Add-typestypes-block">
                  <h3 className="Add-typestypes-subtitle">{s.title}</h3>
                  <p className="Add-typestypes-text">{s.text}</p>
                </div>
              ))}
            </div>
          </div>
        </section>
      </div>

      {/* Benefits */}
      <div id="requirements">
        <section className="Add-reqsection">
          <div className="Add-reqcontainer">
            <header className="Add-reqheader">
              <h2 className="Add-reqtitle">Benefits of Taking Technology Services Through Legal Terminus</h2>
              <p className="Add-reqsubtitle">
                The same relationship, the same standards and the same accountability you already have for your
                compliance — now for the technology your business runs on.
              </p>
            </header>
            <div className="Add-reqgrid">
              {BENEFITS.map((b) => (
                <article key={b.title} className="Add-reqcard">
                  <h3 className="Add-reqcard-title">{b.title}</h3>
                  <div className="Add-reqcard-underline" />
                  <p className="Add-reqcard-text">{b.text}</p>
                </article>
              ))}
            </div>
          </div>
        </section>
      </div>

      {/* Process */}
      <div id="process">
        <section className="Add-Process-gst-wrapper">
          <h2 className="Add-Process-heading">Steps For Getting Your Business Online</h2>
          <p className="Add-Process-subheading">The broad process of a technology project with Legal Terminus involves the following steps:</p>
          <div className="Add-Process-timeline">
            <div className="Add-Process-timeline-line" />
            {STEPS.map((step, index) => (
              <div key={step.title} className={`Add-Process-timeline-item ${index % 2 === 0 ? "left" : "right"}`}>
                <div className="Add-Process-timeline-dot">{index + 1}</div>
                <div className="Add-Process-timeline-card">
                  <h4>{step.title}</h4>
                  <p>{step.text}</p>
                </div>
              </div>
            ))}
          </div>
        </section>
      </div>

      {/* FAQ */}
      <div id="faq">
        <section className="Add-section">
          <div className="Add-container">
            <div className="Add-header">
              <h2 className="Add-title">Technology Services — FAQ's</h2>
              <p className="Add-intro">
                Here, we've answered the most common questions about taking website, payment gateway and software
                services through Legal Terminus — covering who builds it, what it costs and what you own at the end.
              </p>
            </div>
            <div className="Add-list">
              {FAQS.map((item, index) => {
                const isActive = index === activeFaq;
                return (
                  <div key={item.question} className={`Add-item ${isActive ? "active" : ""}`}>
                    <button type="button" className="Add-question" onClick={() => setActiveFaq(isActive ? -1 : index)}>
                      <span>{item.question}</span>
                      <span className={`Add-icon ${isActive ? "open" : ""}`}>▾</span>
                    </button>
                    <div className={`Add-answer ${isActive ? "open" : ""}`}>
                      <div className="Add-answer-content">{item.answer}</div>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        </section>
      </div>

      <Suspense fallback={null}>
        {/* The literal source is what scripts/build-pricing-catalog.py keys the product by. */}
        {activePlan && <CheckoutModal plan={activePlan} onClose={() => setActivePlan(null)} source="technology-services" />}
        <ConsultationModal open={showConsult} onClose={() => setShowConsult(false)} source={SOURCE} />
        <ConsultationModal
          open={showPortfolio}
          onClose={() => setShowPortfolio(false)}
          source={SOURCE}
          title="Request Portfolio"
          subtitle="Share your details and we will send you examples of our work"
          request="Portfolio request"
          submitLabel="Request Portfolio"
        />
      </Suspense>
    </div>
  );
};

export default TechServices;
