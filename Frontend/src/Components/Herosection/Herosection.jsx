import React from 'react'
import { Link } from 'react-router-dom'
import {
  FaBuilding, FaShieldAlt, FaPercent, FaFileAlt, FaRegistered, FaSync,
  FaSearch, FaStar
} from 'react-icons/fa'
import { FcGoogle } from 'react-icons/fc'
import './Herosection.css'
import heroIllustration from '../../assets/hero-photo.webp.webp'

const serviceCards = [
  { icon: <FaBuilding />, title: 'Business Registration', text: 'Start your business with ease', href: '/private-limited-company-registration-in-india' },
  { icon: <FaShieldAlt />, title: 'Compliance', text: 'Stay compliant, stay secure', href: '/annual-filing-company' },
  { icon: <FaPercent />, title: 'GST Registration', text: 'Hassle-free GST registration', href: '/gst-registration' },
  { icon: <FaFileAlt />, title: 'ITR Filing', text: 'File returns with confidence', href: '/itr-individual' },
  { icon: <FaRegistered />, title: 'Trademark', text: 'Protect your brand identity', href: '/trademark/application' },
  { icon: <FaSync />, title: 'Returns', text: 'Timely filing, zero hassle', href: '/gst-return-filing' },
]

const Herosection = () => {
  return (
    <section className="hs-hero" aria-label="Hero — Business Compliance">
      <div className="hs-hero__container">

        {/* LEFT — Photo */}
        <div className="hs-hero__photo-col" aria-hidden="true">
          <div className="hs-photo-wrap">
            <img src={heroIllustration} alt="Legal Terminus professionals" className="hs-hero-img" />
          </div>
        </div>

        {/* CENTER — Main content */}
        <div className="hs-hero__center">

          {/* Rating badges */}
          <div className="hs-ratings" aria-label="Our ratings">
            <div className="hs-rating-badge">
              <FcGoogle size={26} aria-hidden="true" />
              <div className="hs-rating-text">
                <span className="hs-rating-score">4.9/5</span>
                <span className="hs-rating-label">Google Reviews</span>
              </div>
            </div>
            <div className="hs-rating-sep" aria-hidden="true" />
            <div className="hs-rating-badge">
              <FaStar className="hs-tp-star" aria-hidden="true" />
              <div className="hs-rating-text">
                <span className="hs-rating-score">4.4/5</span>
                <span className="hs-rating-label">Trustpilot</span>
              </div>
            </div>
          </div>

          {/* Headline */}
          <h1 className="hs-hero__title">
            <span className="hs-title-dark">Build Your Business with Passion.</span>
            <span className="hs-title-green">Run It Smarter with Legal Terminus.</span>
          </h1>

          <p className="hs-hero__subtitle">
            Your business, our expertise. We make legal, tax and compliance simple, fast and stress-free.
          </p>

          {/* Search bar */}
          <div className="hs-search-wrap" role="search">
            <input
              className="hs-search-input"
              type="text"
              placeholder="Type your compliance needs or ask us anything..."
              aria-label="Search compliance services"
            />
            <button className="hs-search-btn" type="button" aria-label="Search">
              <FaSearch />
            </button>
          </div>

          {/* CTA buttons — unchanged */}
          <div className="hs-hero__actions" role="group" aria-label="Hero actions">
            <a className="hs-btn hs-btn--primary" href="/contact/us" aria-label="Contact us">Contact Us</a>
            <a className="hs-btn hs-btn--ghost" href="/#services" aria-label="View services">Services</a>
          </div>

        </div>

        {/* RIGHT — Service cards */}
        <div className="hs-hero__cards-col">
          <div className="hs-scards-grid">
            {serviceCards.map(card => (
              <Link to={card.href} className="hs-scard" key={card.title}>
                <div className="hs-scard__icon" aria-hidden="true">{card.icon}</div>
                <div className="hs-scard__body">
                  <div className="hs-scard__title">{card.title}</div>
                  <div className="hs-scard__text">{card.text}</div>
                </div>
              </Link>
            ))}
          </div>
        </div>

      </div>
    </section>
  )
}

export default Herosection
