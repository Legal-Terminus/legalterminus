// FILE: Faq.jsx
import React, { useState, useMemo } from "react";
import { AiOutlinePlus, AiOutlineMinus, AiOutlineSearch } from "react-icons/ai";
import { motion, AnimatePresence } from "framer-motion";
import "./Faq.css";
import img from "../../assets/Blog-2.webp";

const QA = [
  {
    q: "What Is Private Limited Company Registration in India?",
    a:
      "A Private Limited Company (Pvt Ltd) is a privately held entity with up to 200 shareholders. It offers limited liability, separate legal status, perpetual succession, and business credibility, governed by the Companies Act, 2013 under the Ministry of Corporate Affairs."
  },
  {
    q: "How to Register a Private Limited Company Step-By-Step?",
    a:
      "To register a Private Limited Company, obtain DSC for all directors, apply for DIN, reserve the company name via SPICe+ Part A, file SPICe+ Part B for incorporation and statutory registrations, then receive the Certificate of Incorporation along with PAN and TAN."
  },
  {
    q: "How Much Does It Cost to Register a Private Limited Company in India?",
    a:
      "Government filing fees range from about ₹1,000 to ₹2,000 based on capital, while DSCs cost ₹500–₹1,500 per director. Including professional charges, the total cost of registering a Private Limited Company usually falls between ₹6,000 and ₹15,000."
  },
  {
    q: "Can I Register a Private Limited Company Online Without Visiting Any Office?",
    a:
      "Yes, the complete registration process—covering DSC, DIN, name reservation, SPICe+ filing, and PAN/TAN issuance—can be done entirely online via the MCA portal, without any physical visits, if all digital documents are correctly prepared and uploaded."
  },
  {
    q: "What Is the Spice+ Form and Why Is It Important?",
    a:
      "SPICe+ (“Simplified Proforma for Incorporating Company Electronically Plus”) is an online form introduced in February 2020, combining 10–11 services like name approval, incorporation, DIN, PAN, TAN, EPFO, and ESIC into a single process, reducing time, cost, and paperwork."
  },
  {
    q: "Is a Digital Signature Certificate (DSC) Mandatory for Private Limited Company Registration?",
    a:
      "Yes, Class III DSCs are mandatory. All proposed directors must digitally sign incorporation forms using their DSCs when filing through the MCA portal. Without them, SPICe+ and other required e-forms cannot be authenticated or submitted for registration.\n\nFor Directors and Shareholders: PAN card, Aadhaar/Passport, and address proof (utility bill or bank statement).\nFor the Company: Digital Signature Certificate (DSC), MoA, AoA, and registered office proof.\nFor Corporate Shareholders: Board resolution and incorporation certificate."
  },
  {
    q: "Who Is Eligible to Register a Private Limited Company in India?",
    a:
      "Any individual or entity aged 18 or above can register, requiring at least two directors (one Indian resident), two shareholders, a registered office in India, unique name approval, and DSCs and DINs for all proposed directors."
  },
  {
    q: "What Are the Minimum Requirements for Private Limited Company Registration?",
    a:
      "A Private Limited Company requires at least two directors (one Indian resident), two shareholders, a registered office in India, DSCs and DINs, a unique name, and MoA/AoA documents, with no minimum capital requirement after the 2015 reforms."
  },
  {
    q: "Can a Salaried Person Become a Director of a Private Limited Company?",
    a:
      "Yes, a salaried person can become a director of a Private Limited Company unless restricted by their employment contract. Indian law imposes no general prohibition on salaried individuals holding directorships."
  },
  {
    q: "Can a Private Limited Company Operate Multiple Businesses?",
    a:
      "Yes, a Private Limited Company can operate multiple businesses if its Memorandum of Association (MoA) lists all intended activities. As long as these fall within the approved scope and comply with regulations, running diverse ventures is permitted."
  },
  {
    q: "What Documents Are Required for Private Limited Company Registration?",
    a:
      "Documents required include PAN, Aadhaar (or passport for foreign nationals), address proof, passport-sized photo, DSC, DIN details, MoA and AoA, proof of registered office (utility bill/rent agreement with NOC), plus declarations like INC-9 and DIR-2."
  },
  {
    q: "How to Choose and Reserve a Name for a Private Limited Company in India?",
    a:
      "Select a unique, compliant name by avoiding identical or trademarked terms, then check its availability via MCA’s SPICe+ Part A. Reserve it by submitting proposed names through SPICe+, following naming rules, including the required “Private Limited” suffix."
  },
  {
    q: "How to Avoid Name Rejection and Delays in Private Limited Company Registration?",
    a:
      "Ensure the company name is clear by avoiding generic terms, existing trademarks, or restricted words. Follow MCA naming rules, propose two options in SPICe+, verify availability beforehand."
  },
  {
    q: "What Should I Do After My Private Limited Company Is Registered?",
    a:
      "After registration, obtain the Certificate of Incorporation, PAN, and TAN, open a business bank account, issue share certificates, appoint the first statutory auditor within 30 days, and apply for GST registration if applicable."
  },
  {
    q: "What Are the Annual Compliance Requirements for a Private Limited Company?",
    a:
      "A Private Limited Company must maintain statutory registers, hold board meetings, conduct an AGM, file Annual Return (MGT-7) and Financial Statements (AOC-4), appoint auditors (ADT-1), complete Director KYC (DIR-3 KYC), and submit forms like DPT-3 and MSME-1 as applicable."
  },
  {
    q: "What Are the Penalties for Not Meeting Annual Compliance in a Private Limited Company?",
    a:
      "Non-compliance can lead to severe penalties: delayed ROC filings incur ₹100 per day without limit, prolonged default may cause director disqualification or company strike-off, and inaccurate statutory registers can also attract fines."
  },
  {
    q: "Is GST Registration Mandatory for a Private Limited Company?",
    a:
      "GST registration is mandatory only when annual turnover exceeds ₹20 lakh (₹10 lakh in special category states)."
  },
  {
    q: "What Are the Key Advantages of Registering as a Private Limited Company?",
    a:
      "Private Limited Companies offer limited liability, separate legal entity status, perpetual succession, enhanced credibility, ease of raising funds, tax benefits, and flexibility in ownership."
  },
  {
    q: "What Are the Disadvantages of Registering as a Private Limited Company?",
    a:
      "More compliance, higher cost, mandatory disclosures, limited access to public funding, max 200 members, and more complex winding-up process."
  },
  {
    q: "How Does Limited Liability Work In a Private Limited Company?",
    a:
      "Shareholders are liable only up to their share capital. Personal assets remain protected except in cases of fraud."
  },
  {
    q: "What Is the Difference Between a Director and a Shareholder?",
    a:
      "Shareholders own the company; directors manage operations. A person can be both, but the roles differ legally."
  },
  {
    q: "Can a Private Limited Company Raise Funds From the Public?",
    a:
      "No, they cannot invite the public to subscribe to shares or issue a public prospectus. Only private funding is allowed."
  },
  {
    q: "Can a Private Limited Company Be Converted Into Another Business Structure?",
    a:
      "Yes. It can convert into an LLP or Public Limited Company by fulfilling legal conditions and filing required ROC forms."
  },
  {
    q: "Can I Change My Company’s Registered Office After Registration?",
    a:
      "Yes. File MGT-14 and INC-22 (plus INC-23 for state change), notify stakeholders, and update statutory records."
  },
  {
    q: "Can Foreign Nationals or NRIs Be Directors in a Private Limited Company?",
    a:
      "Yes, with DIN & DSC. However, one director must be a resident of India staying 182+ days in the previous year."
  },
  {
    q: "What is the Corporate Identification Number (CIN)?",
    a:
      "CIN is a unique 21-character alphanumeric code identifying company type, state, industry, and year of incorporation."
  }
];

const Faq = () => {
  const [openIndex, setOpenIndex] = useState(0);
  const [query, setQuery] = useState("");

  const toggle = (idx) => {
    setOpenIndex((prev) => (prev === idx ? -1 : idx));
  };

  const filtered = useMemo(() => {
    if (!query.trim()) return QA;
    const q = query.toLowerCase();
    return QA.filter(
      (item) =>
        item.q.toLowerCase().includes(q) ||
        item.a.toLowerCase().includes(q)
    );
  }, [query]);

  return (
    <section className="incorption-faq-container">
      <div className="incorption-faq-inner">

        {/* LEFT SIDE — unchanged layout */}
        <div className="incorption-faq-left">
          <div className="incorption-faq-left-card">
            <h1 className="incorption-faq-title">Company Registration FAQ's</h1>

            <p className="incorption-faq-lead">
              Starting a Private Limited Company is a big milestone for any entrepreneur.
            </p>

            <p className="incorption-faq-paragraph">
              These FAQs help you understand the registration steps with full clarity.
            </p>

            <div className="incorption-faq-stats">
              <div className="stat"><div className="stat-num">7k+</div><div className="stat-label">Queries answered</div></div>
              <div className="stat"><div className="stat-num">50%</div><div className="stat-label">Avg. savings</div></div>
              <div className="stat"><div className="stat-num">1–2w</div><div className="stat-label">Processing time</div></div>
            </div>

            <div className="incorption-faq-visual">
              <img src={img} alt="Illustration" className="incorption-faq-hero-image" />
            </div>
          </div>
        </div>

        {/* RIGHT SIDE — FAQ stays on right */}
        <aside className="incorption-faq-right">
          <div className="incorption-faq-right-scroll">
            <div className="incorption-faq-right-inner">

              {/* SEARCH BAR ONLY (buttons removed) */}
              <div className="incorption-faq-controls">
                <div className="incorption-faq-search">
                  <AiOutlineSearch className="incorption-faq-search-icon" />
                  <input
                    className="incorption-faq-search-input"
                    placeholder="Search questions..."
                    value={query}
                    onChange={(e) => setQuery(e.target.value)}
                  />
                </div>
              </div>

              {/* FAQ LIST */}
              <div className="incorption-faq-list">
                {filtered.length === 0 && (
                  <div className="incorption-faq-empty">No results found for “{query}”.</div>
                )}

                {filtered.map((item, idx) => {
                  const isOpen = openIndex === idx;
                  const stableKey = item.q.slice(0, 40);
                  return (
                    <div key={stableKey} className={`incorption-faq-card ${isOpen ? "open" : ""}`}>
                      <button className="incorption-faq-question" onClick={() => toggle(idx)}>
                        <span className="incorption-faq-qtext">{item.q}</span>
                        <span className="incorption-faq-icon">
                          {isOpen ? <AiOutlineMinus /> : <AiOutlinePlus />}
                        </span>
                      </button>

                      <AnimatePresence>
                        {isOpen && (
                          <motion.div
                            className="incorption-faq-answer-wrap"
                            initial={{ height: 0, opacity: 0 }}
                            animate={{ height: "auto", opacity: 1 }}
                            exit={{ height: 0, opacity: 0 }}
                            transition={{ duration: 0.25 }}
                          >
                            <div className="incorption-faq-answer">
                              {item.a.split("\n\n").map((para, i) => (
                                <p key={`${stableKey}-p${i}`}>{para}</p>
                              ))}
                            </div>
                          </motion.div>
                        )}
                      </AnimatePresence>
                    </div>
                  );
                })}
              </div>

            </div>
          </div>
        </aside>

      </div>
    </section>
  );
};

export default Faq;
