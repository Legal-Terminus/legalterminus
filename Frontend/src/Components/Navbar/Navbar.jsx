// NavbarAdvanced.jsx
import React, { useState, useEffect, useRef } from "react";
import {
  FaEnvelope,
  FaMapMarkerAlt,
  FaFacebookF,
  FaInstagram,
  FaTwitter,
  FaLinkedinIn,
  FaYoutube,
  FaWhatsapp,
  FaSearch,
  FaUser,
  FaTimes,
  FaPhone,
  FaChevronRight,
  FaArrowRight,
} from "react-icons/fa";
import "./Navbar.css";

const LOGO_GIF =
  "https://legalterminus.com/wp-content/uploads/2023/09/Legal-Terminus-LOGO-GIF_300-x-150.gif";

// ... same navData as before (kept for brevity) ...
const navData = [
  { id: "home", label: "Home", href: "/" },
  {
    id: "setup-business",
    label: "Setting Up a Business",
    children: [
      {
        id: "profit",
        label: "Profit Making Structure",
        items: [
          {
            label: "Private Limited Company Registration In India",
            href: "/private-limited-company-registration-in-india",
          },
          {
            label: "Incorporation Of Wholly Owned Subsidiary In India",
            href: "/incorption-registration-in-india",
          },
          {
            label: "Public Limited Company Registration In India",
            href: "/Public-Limited-Company-Registration-in-India",
          },
          {
            label: "One Person Company Registration In India",
            href: "/one-person-company",
          },
          {
            label: "Limited Liability Partnership Registration In India",
            href: "/llp",
          },
          {
            label: "Partnership Firm Registration In India",
            href: "/partnership",
          },
          {
            label: "Proprietorship Firm Registration In India",
            href: "/proprietorship",
          },
        ],
      },
      {
        id: "nonprofit",
        label: "Non-Profit Making Structures",
        items: [
          {
            label: "Non-Profit Company/ Sec-8 Company Registration In India",
            href: "/section-8",
          },
          { label: "Trust Registration In India", href: "/trust" },
          { label: "Society Registration In India", href: "/society" },
        ],
      },
    ],
  },
  {
    id: "registrations",
    label: "Registrations & Returns",
    children: [
      {
        id: "registrations-main",
        label: "Registrations",
        items: [
          { label: "GST Registration In India", href: "/gst-registration" },
          { label: "Udyam Registration In India", href: "/udyam" },
          { label: "EPF Registration In India", href: "/epf" },
          { label: "ESIC Registration In India", href: "/esic" },
          { label: "Professional Tax Registration", href: "/professional-tax" },
          {
            label: "Shop & Commercial Establishments Registration In India",
            href: "/shop-establishment",
          },
          {
            label: "Odisha Labour Welfare Fund (OLWF) Registration",
            href: "/olwf",
          },
          { label: "Startup India Registration", href: "/startup-india" },
          { label: "Startup Odisha Registration", href: "/startup-odisha" },
        ],
      },
      {
        id: "licenses",
        label: "License & Certifications",
        items: [
          { label: "Importer Exporter Code Registration", href: "/iec" },
          { label: "Food License And Registration", href: "/food-license" },
          { label: "Trade License Registration", href: "/trade-license" },
          { label: "Labour License Registration", href: "/labour-license" },
          { label: "Bar Code Registration", href: "/bar-code" },
          { label: "ISO Certification In India", href: "/iso" },
        ],
      },
      {
        id: "return-filing",
        label: "Return Filing",
        items: [
          { label: "GST Return Filing", href: "/gst-return-filing" },
          { label: "ITR Filing (Business)", href: "/itr-business" },
          { label: "ITR Filing (Individual)", href: "/itr-individual" },
          { label: "Annual Filing (Company)", href: "/annual-filing-company" },
          { label: "Annual Filing (LLP)", href: "/annual-filing-llp" },
          { label: "EPF Return Filing", href: "/epf-return" },
          { label: "ESI Return Filing", href: "/esi-return" },
          {
            label: "Professional Tax Return Filing",
            href: "/professional-tax-return",
          },
        ],
      },
    ],
  },
  {
    id: "event-compliances",
    label: "Event Based Compliances",
    children: [
      {
        id: "conversion",
        label: "Conversion In Form Of Business",
        items: [
          {
            label: "Proprietorship Firm To OPC Private Limited Company",
            href: "/conversion/proprietorship-to-opc",
          },
          {
            label: "Proprietorship Firm To Private Limited Company",
            href: "/conversion/proprietorship-to-private",
          },
          {
            label: "Partnership Firm To Limited Liability Partnership",
            href: "/conversion/partnership-to-llp",
          },
          {
            label: "Partnership Firm To Private Limited Company",
            href: "/conversion/partnership-to-private",
          },
          {
            label: "LLP To Private Limited Company",
            href: "/conversion/llp-to-private",
          },
          {
            label: "Private Limited Company To Limited Liability Partnership",
            href: "/conversion/private-to-llp",
          },
          {
            label: "Private Limited Company To Public Limited Company",
            href: "/conversion/private-to-public",
          },
          {
            label: "Public Limited Company To Private Limited Company",
            href: "/conversion/public-to-private",
          },
        ],
      },
      {
        id: "updation",
        label: "Updation Services",
        items: [
          { label: "Change In Name (LLP)", href: "/updation/change-name-llp" },
          {
            label: "Change In Registered Office Address (Company)",
            href: "/updation/change-address-company",
          },
          {
            label: "Change In Object (Company)",
            href: "/updation/change-object-company",
          },
          {
            label: "Increase In Authorised Capital (Company)",
            href: "/updation/increase-authorised-capital",
          },
          {
            label: "Add Or Remove A Director (Company)",
            href: "/updation/add-remove-director",
          },
          {
            label: "Change In Name (Company)",
            href: "/updation/change-name-company",
          },
          {
            label: "Change In Registered Office Address (LLP)",
            href: "/updation/change-address-llp",
          },
          {
            label: "Change In Object (LLP)",
            href: "/updation/change-object-llp",
          },
        ],
      },
      {
        id: "windup",
        label: "Windup Services",
        items: [
          {
            label: "Dissolve A Private Limited Company",
            href: "/windup/dissolve-private",
          },
          {
            label: "Dissolve A Limited Liability Partnership",
            href: "/windup/dissolve-llp",
          },
          {
            label: "Dissolve A Partnership Firm",
            href: "/windup/dissolve-partnership",
          },
        ],
      },
    ],
  },
  {
    id: "trademark",
    label: "Trademark",
    align: "left",
    children: [
      {
        id: "tm-services",
        label: "Registration And Compliance Services",
        items: [
          { label: "Trademark Application", href: "/trademark/application" },
          { label: "Trademark Renewal", href: "/trademark/renewal" },
          {
            label: "Reply Of Examination Report",
            href: "/trademark/exam-reply",
          },
          { label: "Trademark Opposition", href: "/trademark/opposition" },
          { label: "Trademark Hearing", href: "/trademark/hearing" },
        ],
      },
    ],
  },
  {
    id: "know-us",
    label: "Know Us",
    align: "left",
    children: [
      { label: "About Us", href: "/about" },
      { label: "Contact Us", href: "/contact/us" },
      { label: "Media", href: "/media" },
      { label: "Our Blog", href: "/blog" },
      {
        label: "Policies",
        href: "#policies",
        children: [
          { label: "Terms & Conditions", href: "/policies/terms" },
          { label: "Privacy Policy", href: "/policies/privacy" },
          { label: "Refund Policy", href: "/policies/refund" },
          {
            label: "Confidentiality Policy",
            href: "/policies/confidentiality",
          },
        ],
      },
    ],
  },
];

export default function NavbarAdvanced() {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  const [megaOpenFor, setMegaOpenFor] = useState(null);
  const [activeMegaTab, setActiveMegaTab] = useState(null);
  const [mobileExpanded, setMobileExpanded] = useState({});
  const [nestedOpenItem, setNestedOpenItem] = useState(null);

  // NEW refs & state for positioning the right panel to run parallel to the left item
  const leftColRef = useRef(null); // container for left column
  const megaLeftRefs = useRef({}); // map: catId -> DOM node of the left tab button
  const [rightPanelStyle, setRightPanelStyle] = useState({
    top: 0,
    left: null,
  });

  const drawerRef = useRef(null);
  const megaTimeoutRef = useRef(null);

  // MOBILE two-step state:
  const [mobileActiveSub, setMobileActiveSub] = useState(null);

  // HEADER ref + dynamic spacer for fixed header behavior
  const headerRef = useRef(null);
  const [headerHeight, setHeaderHeight] = useState(0);

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 10);
    window.addEventListener("scroll", onScroll);
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  // measure header height (on mount + resize + when scrolled or when menu opens)
  useEffect(() => {
    function measure() {
      const h = headerRef.current
        ? headerRef.current.getBoundingClientRect().height
        : 0;
      setHeaderHeight(Math.ceil(h));
      // set CSS var as well for any global use
      document.documentElement.style.setProperty(
        "--site-header-height",
        `${Math.ceil(h)}px`
      );
    }
    measure();
    window.addEventListener("resize", measure);
    return () => window.removeEventListener("resize", measure);
  }, [scrolled, isMenuOpen]);

  useEffect(() => {
    if (isMenuOpen) {
      document.body.classList.add("no-scroll");
      setTimeout(() => drawerRef.current?.focus(), 0);
    } else {
      document.body.classList.remove("no-scroll");
      setMobileExpanded({});
      setMobileActiveSub(null);
    }
    return () => document.body.classList.remove("no-scroll");
  }, [isMenuOpen]);

  useEffect(() => {
    function onKey(e) {
      if (e.key === "Escape") {
        setIsMenuOpen(false);
        setMegaOpenFor(null);
        setActiveMegaTab(null);
        setNestedOpenItem(null);
      }
    }
    function onClick(e) {
      if (
        isMenuOpen &&
        drawerRef.current &&
        !drawerRef.current.contains(e.target)
      ) {
        setIsMenuOpen(false);
      }
    }
    document.addEventListener("keydown", onKey);
    document.addEventListener("mousedown", onClick);
    return () => {
      document.removeEventListener("keydown", onKey);
      document.removeEventListener("mousedown", onClick);
    };
  }, [isMenuOpen]);

  const openMegaCompact = (id) => {
    clearTimeout(megaTimeoutRef.current);
    setMegaOpenFor(id);
    setActiveMegaTab(null);
    setNestedOpenItem(null);
  };

  const closeMegaDelayed = () => {
    clearTimeout(megaTimeoutRef.current);
    megaTimeoutRef.current = setTimeout(() => {
      setMegaOpenFor(null);
      setActiveMegaTab(null);
      setNestedOpenItem(null);
      setRightPanelStyle({ top: 0, left: null });
    }, 160);
  };

  // compute and set the right panel position so it lines up with the hovered left tab
  const showRightPanel = (tabId) => {
    setActiveMegaTab(tabId);
    setNestedOpenItem(null);

    const buttonEl = megaLeftRefs.current[tabId];
    const leftContainer = leftColRef.current;
    const outer =
      leftContainer?.closest(".mega-inner-compact") || leftContainer;

    const panelWidth = 360;
    const gap = 10;

    const topItem = navData.find((n) => n.id === megaOpenFor);
    const isLeftAligned = !!(topItem && topItem.align === "left");

    if (buttonEl && leftContainer && outer) {
      const btnRect = buttonEl.getBoundingClientRect();
      const leftRect = leftContainer.getBoundingClientRect();
      const outerRect = outer.getBoundingClientRect();

      const top = Math.round(btnRect.top - outerRect.top);

      let left;
      if (isLeftAligned) {
        left = Math.round(leftRect.left - outerRect.left - panelWidth - gap);
      } else {
        left = Math.round(leftRect.right - outerRect.left + gap);
      }

      setRightPanelStyle({ top, left });
    } else {
      setRightPanelStyle({ top: 0, left: null });
    }
  };

  useEffect(() => {
    function onResize() {
      if (activeMegaTab) {
        setTimeout(() => showRightPanel(activeMegaTab), 40);
      }
    }
    window.addEventListener("resize", onResize);
    return () => window.removeEventListener("resize", onResize);
  }, [activeMegaTab, megaOpenFor]);

  const nestedKey = (topId, catId, idx) =>
    `${topId}__${catId || "child"}__${idx}`;

  const openNested = (key) => setNestedOpenItem(key);
  const closeNested = () => setNestedOpenItem(null);

  const toggleMobileSection = (id) => {
    setMobileExpanded((prev) => {
      const newState = { ...prev, [id]: !prev[id] };
      if (!newState[id]) {
        if (mobileActiveSub && mobileActiveSub.startsWith(`${id}__`)) {
          setMobileActiveSub(null);
        }
      }
      return newState;
    });
  };

  const toggleMobileSub = (topId, catId) => {
    const key = `${topId}__${catId}`;
    setMobileActiveSub((prev) => (prev === key ? null : key));
  };

  return (
    <>
      {/* HEADER (fixed) */}
      <header
        ref={headerRef}
        className={`header-wrapper ${scrolled ? "scrolled" : ""} header-fixed`}
        aria-label="Site header"
        role="banner"
      >
        {/* TOP BAR */}
        <div className="topbar">
          <div className="topbar-inner">
            <div className="topbar-left">
              <div className="topbar-contact">
                <a
                  href="mailto:sales21@legalterminus.com"
                  className="topbar-link"
                >
                  <FaEnvelope className="topbar-icon" />
                  sales21@legalterminus.com
                </a>
                <span className="topbar-sep">|</span>
                <a href="tel:8280093456" className="topbar-link">
                  <FaPhone
                    className="topbar-icon"
                    style={{ transform: "rotate(90deg)" }}
                  />
                  8280093456
                </a>
              </div>
            </div>

            <div className="topbar-right">
              <div className="topbar-tag">
                Turning big ideas into great products!
              </div>
              <div className="topbar-socials">
                <a
                  className="social"
                  href="https://www.facebook.com/LegalTerminusofficial"
                  aria-label="Facebook"
                >
                  <FaFacebookF />
                </a>
                <a
                  className="social"
                  href="https://www.instagram.com/legalterminus/"
                  aria-label="Instagram"
                >
                  <FaInstagram />
                </a>
                <a
                  className="social"
                  href="https://twitter.com/legalterminus"
                  aria-label="Twitter"
                >
                  <FaTwitter />
                </a>
                <a className="social" href="#twitter" aria-label="Whatsapp">
                  <FaWhatsapp />
                </a>
                <a
                  className="social"
                  href="https://www.youtube.com/@LegalTerminus"
                  aria-label="youtube"
                >
                  <FaYoutube />
                </a>
                <a
                  className="social"
                  href="https://www.linkedin.com/company/legalterminus/"
                  aria-label="LinkedIn"
                >
                  <FaLinkedinIn />
                </a>
              </div>
            </div>
          </div>
        </div>

        {/* MAIN NAV */}
        <nav
          className="main-nav"
          role="navigation"
          aria-label="Main navigation"
        >
          <div className="nav-inner">
            <div className="nav-left">
              <a className="brand" href="/">
                <img
                  src={LOGO_GIF}
                  alt="Industrify Logo"
                  className={`brand-logo ${scrolled ? "small" : ""}`}
                  width={scrolled ? 160 : 200}
                  height={scrolled ? 45 : 55}
                />
              </a>
            </div>

            <div className="nav-center" aria-hidden={false}>
              <ul className="nav-list" role="menubar">
                {navData.map((it) => {
                  const hasMega =
                    Array.isArray(it.children) && it.children.length > 0;
                  return (
                    <li
                      key={it.id}
                      className="nav-list-item"
                      role="none"
                      onMouseEnter={() => hasMega && openMegaCompact(it.id)}
                      onMouseLeave={() => hasMega && closeMegaDelayed()}
                    >
                      {hasMega ? (
                        <button
                          className="nav-link nav-link-button"
                          aria-haspopup="true"
                          aria-expanded={megaOpenFor === it.id}
                          onFocus={() => openMegaCompact(it.id)}
                          onBlur={() => closeMegaDelayed()}
                        >
                          {it.label}
                        </button>
                      ) : (
                        <a role="menuitem" href={it.href} className="nav-link">
                          {it.label}
                        </a>
                      )}

                      {/* MEGA */}
                      {hasMega && (
                        <div
                          className={`mega-menu ${
                            megaOpenFor === it.id
                              ? activeMegaTab
                                ? "expanded"
                                : "compact"
                              : ""
                          } ${it.align === "left" ? "left-align" : ""}`}
                          onMouseEnter={() => openMegaCompact(it.id)}
                          onMouseLeave={() => closeMegaDelayed()}
                          aria-hidden={megaOpenFor !== it.id}
                        >
                          <div className="mega-inner-compact">
                            {Array.isArray(it.children) &&
                            it.children[0] &&
                            it.children[0].items ? (
                              /* CATEGORY MODE */
                              <>
                                <div
                                  className="mega-left-compact"
                                  role="tablist"
                                  aria-label={`${it.label} categories`}
                                  ref={leftColRef}
                                >
                                  {it.children.map((cat) => (
                                    <button
                                      key={cat.id}
                                      ref={(el) => {
                                        if (el)
                                          megaLeftRefs.current[cat.id] = el;
                                      }}
                                      className={`mega-tab-compact ${
                                        activeMegaTab === cat.id ? "active" : ""
                                      }`}
                                      onMouseEnter={() =>
                                        showRightPanel(cat.id)
                                      }
                                      onFocus={() => showRightPanel(cat.id)}
                                      onClick={() => showRightPanel(cat.id)}
                                      aria-selected={activeMegaTab === cat.id}
                                    >
                                      {it.align === "left" ? (
                                        <>
                                          <span>{cat.label}</span>
                                          <FaChevronRight
                                            className={`mini-left`}
                                          />
                                        </>
                                      ) : (
                                        <>
                                          <span>{cat.label}</span>
                                          <FaChevronRight className="mini-right" />
                                        </>
                                      )}
                                    </button>
                                  ))}
                                </div>

                                <div
                                  className={`mega-right-panel ${
                                    activeMegaTab ? "visible" : ""
                                  }`}
                                  role="region"
                                  aria-live="polite"
                                  style={{
                                    top:
                                      rightPanelStyle.top != null
                                        ? `${rightPanelStyle.top}px`
                                        : undefined,
                                    left:
                                      rightPanelStyle.left != null
                                        ? `${rightPanelStyle.left}px`
                                        : undefined,
                                  }}
                                >
                                  {it.children.map((cat) => (
                                    <div
                                      key={cat.id}
                                      className={`mega-col ${
                                        activeMegaTab === cat.id
                                          ? "visible"
                                          : ""
                                      }`}
                                    >
                                      <ul className="mega-links">
                                        {cat.items.map((item, idx) => {
                                          const key = nestedKey(
                                            it.id,
                                            cat.id,
                                            idx
                                          );
                                          const hasNested =
                                            !!item.children &&
                                            Array.isArray(item.children) &&
                                            item.children.length > 0;
                                          return (
                                            <li
                                              key={key}
                                              className="mega-link-row"
                                            >
                                              {hasNested ? (
                                                <button
                                                  className="mega-link nested-trigger"
                                                  type="button"
                                                  onMouseEnter={() =>
                                                    openNested(key)
                                                  }
                                                  onFocus={() =>
                                                    openNested(key)
                                                  }
                                                  onClick={() =>
                                                    openNested(key)
                                                  }
                                                  aria-haspopup="true"
                                                  aria-expanded={
                                                    nestedOpenItem === key
                                                  }
                                                >
                                                  <span>{item.label}</span>
                                                </button>
                                              ) : (
                                                <a
                                                  className="mega-link"
                                                  href={item.href}
                                                  onClick={() => {
                                                    setMegaOpenFor(null);
                                                    setActiveMegaTab(null);
                                                  }}
                                                >
                                                  <span>{item.label}</span>
                                                </a>
                                              )}

                                              {hasNested && (
                                                <div
                                                  className={`nested-panel ${
                                                    nestedOpenItem === key
                                                      ? "open"
                                                      : ""
                                                  }`}
                                                  onMouseEnter={() =>
                                                    openNested(key)
                                                  }
                                                  onMouseLeave={() =>
                                                    setTimeout(() => {
                                                      if (
                                                        nestedOpenItem === key
                                                      )
                                                        setNestedOpenItem(null);
                                                    }, 120)
                                                  }
                                                  aria-hidden={
                                                    nestedOpenItem !== key
                                                  }
                                                >
                                                  <ul className="nested-links">
                                                    {item.children.map(
                                                      (sub, sidx) => (
                                                        <li
                                                          key={`${key}__${sidx}`}
                                                        >
                                                          <a
                                                            href={sub.href}
                                                            onClick={() => {
                                                              setMegaOpenFor(
                                                                null
                                                              );
                                                              setActiveMegaTab(
                                                                null
                                                              );
                                                              setNestedOpenItem(
                                                                null
                                                              );
                                                            }}
                                                          >
                                                            {sub.label}
                                                          </a>
                                                        </li>
                                                      )
                                                    )}
                                                  </ul>
                                                </div>
                                              )}
                                            </li>
                                          );
                                        })}
                                      </ul>
                                    </div>
                                  ))}
                                </div>
                              </>
                            ) : (
                              /* DIRECT-CHILD MODE */
                              <>
                                <div
                                  className="mega-left-compact"
                                  role="tablist"
                                  aria-label={`${it.label} links`}
                                  ref={leftColRef}
                                >
                                  {it.children.map((child, idx) => {
                                    const key = nestedKey(it.id, null, idx);
                                    const hasNested =
                                      !!child.children &&
                                      Array.isArray(child.children) &&
                                      child.children.length > 0;

                                    return (
                                      <div
                                        key={key}
                                        style={{ position: "relative" }}
                                      >
                                        {!hasNested ? (
                                          <a
                                            href={child.href}
                                            className="mega-tab-compact"
                                            onClick={() => {
                                              setMegaOpenFor(null);
                                              setNestedOpenItem(null);
                                            }}
                                            style={{ textAlign: "left" }}
                                          >
                                            {child.label}
                                          </a>
                                        ) : (
                                          <button
                                            ref={(el) => {
                                              if (el)
                                                megaLeftRefs.current[key] = el;
                                            }}
                                            className={`mega-tab-compact ${
                                              nestedOpenItem === key
                                                ? "active"
                                                : ""
                                            }`}
                                            onMouseEnter={() => openNested(key)}
                                            onClick={() => openNested(key)}
                                          >
                                            {child.label}
                                            <FaChevronRight className="mini-right" />
                                          </button>
                                        )}

                                        {hasNested && (
                                          <div
                                            className={`nested-panel ${
                                              nestedOpenItem === key
                                                ? "open"
                                                : ""
                                            }`}
                                            onMouseEnter={() => openNested(key)}
                                            onMouseLeave={() =>
                                              setNestedOpenItem(null)
                                            }
                                          >
                                            <ul className="nested-links">
                                              {child.children.map((sub, si) => (
                                                <li key={si}>
                                                  <a
                                                    href={sub.href}
                                                    onClick={() => {
                                                      setMegaOpenFor(null);
                                                      setNestedOpenItem(null);
                                                    }}
                                                  >
                                                    {sub.label}
                                                  </a>
                                                </li>
                                              ))}
                                            </ul>
                                          </div>
                                        )}
                                      </div>
                                    );
                                  })}
                                </div>

                                <div className="mega-right-panel" />
                              </>
                            )}
                          </div>
                        </div>
                      )}
                    </li>
                  );
                })}
              </ul>
            </div>

            <div className="nav-right">
              <button
                className="icon-btn search-btn"
                aria-label="Search"
                onClick={() => alert("Implement search overlay")}
                title="Search"
              >
                <FaUser />
              </button>

              <button
                className={`menu-trigger ${isMenuOpen ? "open" : ""}`}
                aria-expanded={isMenuOpen}
                aria-controls="premium-drawer"
                onClick={() => setIsMenuOpen((s) => !s)}
              >
                <span className="menu-bar" />
                <span className="menu-bar" />
                <span className="menu-bar" />
              </button>
            </div>
          </div>
        </nav>

        {/* Drawer overlay */}
        <div
          className={`premium-drawer-overlay ${isMenuOpen ? "active" : ""}`}
          onClick={() => setIsMenuOpen(false)}
          aria-hidden={!isMenuOpen}
        />

        {/* MOBILE DRAWER */}
        <aside
          id="premium-drawer"
          ref={drawerRef}
          className={`premium-drawer ${isMenuOpen ? "open" : ""}`}
          aria-hidden={!isMenuOpen}
          tabIndex={-1}
        >
          <div className="premium-drawer-header">
            <div className="premium-drawer-brand">
              <img
                src={LOGO_GIF}
                alt="Industrify Logo"
                className="premium-drawer-logo"
                width={180}
                height={50}
              />
              <span className="premium-drawer-tagline">
                Excellence in Every Pixel
              </span>
            </div>

            <button
              className="premium-close-btn"
              onClick={() => setIsMenuOpen(false)}
              aria-label="Close menu"
            >
              <FaTimes />
            </button>
          </div>

          <div className="premium-drawer-content">
            <div className="drawer-about">
              <h3 className="drawer-about-title">About Us</h3>
              <p className="drawer-about-text">
                We must explain to you how all seds this mistakens idea off
                denouncing pleasures and praising pain was born and I will give
                you a completed accounts of the system and expound.
              </p>

              <div className="drawer-cta-wrap">
                <a
                  href="#contact"
                  className="drawer-cta"
                  onClick={() => setIsMenuOpen(false)}
                >
                  Get In Touch <FaArrowRight />
                </a>
              </div>
            </div>

            {/* Drawer navigation */}
            <nav aria-label="Drawer Navigation">
              <ul className="premium-nav-list">
                {navData.map((item) => {
                  const hasChildren = !!item.children;
                  return (
                    <li key={item.id} className="premium-nav-item">
                      {!hasChildren ? (
                        <a
                          className="premium-nav-link"
                          href={item.href}
                          onClick={() => setIsMenuOpen(false)}
                        >
                          <span className="premium-link-text">
                            {item.label}
                          </span>
                          <FaChevronRight className="premium-link-arrow" />
                        </a>
                      ) : (
                        <>
                          <button
                            className="premium-nav-link"
                            onClick={() => toggleMobileSection(item.id)}
                            aria-expanded={!!mobileExpanded[item.id]}
                          >
                            <span className="premium-link-text">
                              {item.label}
                            </span>
                            <FaChevronRight className="premium-link-arrow" />
                          </button>

                          <div
                            className={`premium-sublist ${
                              mobileExpanded[item.id] ? "expanded" : ""
                            }`}
                          >
                            {item.children.map((cat) => {
                              if (cat.items) {
                                const subKey = `${item.id}__${cat.id}`;
                                const isActiveSub = mobileActiveSub === subKey;
                                return (
                                  <div
                                    key={cat.id}
                                    className="premium-subsection"
                                  >
                                    <button
                                      className="premium-nav-link simple"
                                      onClick={() =>
                                        toggleMobileSub(item.id, cat.id)
                                      }
                                      aria-expanded={isActiveSub}
                                    >
                                      <span className="premium-link-text">
                                        <strong>{cat.label}</strong>
                                      </span>
                                      <FaChevronRight className="premium-link-arrow" />
                                    </button>

                                    <div
                                      className={`premium-sublist ${
                                        isActiveSub ? "expanded" : ""
                                      }`}
                                      style={{ paddingLeft: 12 }}
                                    >
                                      <ul className="premium-sublinks">
                                        {cat.items.map((sub, i) => (
                                          <li key={i}>
                                            <a
                                              href={sub.href}
                                              onClick={() => {
                                                setIsMenuOpen(false);
                                                setMobileActiveSub(null);
                                              }}
                                              className="premium-nav-link simple"
                                            >
                                              <span className="premium-link-text">
                                                {sub.label}
                                              </span>
                                              <FaChevronRight className="premium-link-arrow" />
                                            </a>
                                          </li>
                                        ))}
                                      </ul>
                                    </div>
                                  </div>
                                );
                              } else {
                                const hasInnerChildren =
                                  !!cat.children &&
                                  Array.isArray(cat.children) &&
                                  cat.children.length > 0;
                                return (
                                  <div
                                    key={cat.label}
                                    className="premium-subsection"
                                  >
                                    <a
                                      href={cat.href}
                                      onClick={() => setIsMenuOpen(false)}
                                      className="premium-nav-link simple"
                                    >
                                      <span className="premium-link-text">
                                        {cat.label}
                                      </span>
                                      <FaChevronRight className="premium-link-arrow" />
                                    </a>

                                    {hasInnerChildren && (
                                      <div style={{ marginLeft: 12 }}>
                                        {cat.children.map((c2, idx2) => (
                                          <a
                                            key={idx2}
                                            href={c2.href}
                                            onClick={() => setIsMenuOpen(false)}
                                            className="premium-nav-link simple"
                                            style={{ marginTop: 6 }}
                                          >
                                            <span className="premium-link-text">
                                              {c2.label}
                                            </span>
                                            <FaChevronRight className="premium-link-arrow" />
                                          </a>
                                        ))}
                                      </div>
                                    )}
                                  </div>
                                );
                              }
                            })}
                          </div>
                        </>
                      )}
                    </li>
                  );
                })}
              </ul>
            </nav>

            <div className="drawer-contact">
              <h4 className="drawer-contact-title">Contact Info</h4>

              <div className="drawer-contact-item">
                <FaMapMarkerAlt className="drawer-contact-icon" />
                <div className="drawer-contact-text">
                  Australia - 175 24th Street, Office 3567 Melbourn, EA 265
                </div>
              </div>

              <div className="drawer-contact-item">
                <FaPhone
                  className="drawer-contact-icon"
                  style={{ transform: "rotate(90deg)" }}
                />
                <div className="drawer-contact-text">8280093456</div>
              </div>

              <div className="drawer-contact-item">
                <FaEnvelope className="drawer-contact-icon" />
                <div className="drawer-contact-text">
                  sales21@legalterminus.com
                </div>
              </div>
            </div>

            <div className="premium-social-section">
              <div className="premium-social-grid">
                <a
                  className="premium-social-link"
                  href="https://www.facebook.com/LegalTerminusofficial"
                  aria-label="Facebook"
                >
                  <FaFacebookF />
                </a>
                <a
                  className="premium-social-link"
                  href="https://www.instagram.com/legalterminus/"
                  aria-label="Instagram"
                >
                  <FaInstagram />
                </a>
                <a
                  className="premium-social-link"
                  href="#twitter"
                  aria-label="Twitter"
                >
                  <FaTwitter />
                </a>
                <a
                  className="premium-social-link"
                  href="#linkedin"
                  aria-label="LinkedIn"
                >
                  <FaLinkedinIn />
                </a>
              </div>
            </div>
          </div>
        </aside>
      </header>

      {/* Spacer to keep document flow — height is the measured header height */}
      <div
        aria-hidden="true"
        style={{
          height: headerHeight ? `${headerHeight}px` : "auto",
          width: "100%",
        }}
      />
    </>
  );
}
