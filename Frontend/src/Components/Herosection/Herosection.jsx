import React, { useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { FcGoogle } from 'react-icons/fc'
import {
  FaStar,
  FaSearch,
  FaBuilding,
  FaShieldAlt,
  FaPercent,
  FaFileInvoiceDollar,
  FaRegistered,
  FaFileAlt,
} from 'react-icons/fa'
import './Herosection.css'
import heroPhoto from '../../assets/hero-photo.webp.webp'

// Right-column quick links — each shortcut maps to its real service page.
// Order is row-by-row (left col, right col) to mirror the reference layout.
const SERVICES = [
  {
    icon: <FaBuilding />,
    title: 'Business Registration',
    text: 'Start your business with ease',
    to: '/private-limited-company-registration-in-india',
  },
  {
    icon: <FaShieldAlt />,
    title: 'Compliance',
    text: 'Stay compliant, stay secure',
    to: '/annual-filing-company',
  },
  {
    icon: <FaPercent />,
    title: 'GST Registration',
    text: 'Hassle-free GST registration',
    to: '/gst-registration',
  },
  {
    icon: <FaFileInvoiceDollar />,
    title: 'ITR Filing',
    text: 'File returns with confidence',
    to: '/itr-individual',
  },
  {
    icon: <FaRegistered />,
    title: 'Trademark',
    text: 'Protect your brand identity',
    to: '/trademark/application',
  },
  {
    icon: <FaFileAlt />,
    title: 'Returns',
    text: 'Timely filing, zero hassle',
    to: '/gst-return-filing',
  },
]

const Herosection = () => {
  const navigate = useNavigate()
  const [query, setQuery] = useState('')

  const handleSearch = (e) => {
    e.preventDefault()
    const q = query.trim()
    if (!q) return
    // Send compliance/"ask us anything" queries to the contact page.
    navigate(`/contact/us?q=${encodeURIComponent(q)}`)
  }

  return (
    <section className="hs-hero" aria-label="Hero — Build your business with Legal Terminus">
      <div className="hs-hero__container">

        {/* LEFT — Photo */}
        <div className="hs-hero__photo-col">
          <div className="hs-photo-wrap">
            <img
              className="hs-hero-img"
              src={heroPhoto}
              alt="Legal Terminus experts helping a business owner stay compliant"
              loading="eager"
              width="600"
              height="600"
            />
          </div>
        </div>

        {/* CENTER — Ratings, headline, search */}
        <div className="hs-hero__center">
          <div className="hs-ratings" aria-label="Customer ratings">
            <div className="hs-rating-badge">
              <FcGoogle className="hs-rating-logo" aria-hidden="true" />
              <span className="hs-rating-line">
                <strong>4.9/5</strong> Google Reviews
              </span>
            </div>
            <span className="hs-rating-sep" aria-hidden="true" />
            <div className="hs-rating-badge">
              <FaStar className="hs-tp-star" aria-hidden="true" />
              <span className="hs-rating-line">
                <strong>4.4/5</strong> Trustpilot
              </span>
            </div>
          </div>

          <h1 className="hs-hero__title">
            <span className="hs-title-dark">Build Your Business with Passion.</span>
            <span className="hs-title-green">Run It Smarter with Legal Terminus.</span>
          </h1>

          <p className="hs-hero__subtitle">
            Your business, our expertise. We make legal, tax and
            compliance simple, fast and stress-free.
          </p>

          <form className="hs-search-wrap" onSubmit={handleSearch} role="search">
            <input
              className="hs-search-input"
              type="text"
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              placeholder="Type your compliance needs or ask us anything..."
              aria-label="Search compliance needs"
            />
            <button className="hs-search-btn" type="submit" aria-label="Search">
              <FaSearch />
            </button>
          </form>
        </div>

        {/* RIGHT — Service quick links */}
        <div className="hs-hero__cards-col">
          <div className="hs-scards-grid">
            {SERVICES.map((s) => (
              <Link key={s.title} className="hs-scard" to={s.to}>
                <span className="hs-scard__icon" aria-hidden="true">{s.icon}</span>
                <span className="hs-scard__body">
                  <span className="hs-scard__title">{s.title}</span>
                  <span className="hs-scard__text">{s.text}</span>
                </span>
              </Link>
            ))}
          </div>
        </div>

      </div>
    </section>
  )
}

export default Herosection
