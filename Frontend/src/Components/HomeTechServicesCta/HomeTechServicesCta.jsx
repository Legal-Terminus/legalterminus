import React from 'react'
import { Link } from 'react-router-dom'
import '../HomePdfToolsCta/HomePdfToolsCta.css'
import './HomeTechServicesCta.css'

/**
 * Home-page tile for Technology Services, placed just above the PDF tools tile.
 * It reuses the PDF tile's layout (hpt-*) in a light variant (hpt-cta--tech),
 * so the two banners read as a pair without looking identical.
 */
const HomeTechServicesCta = () => {
  return (
    <section className="hpt-cta hpt-cta--tech" aria-labelledby="hts-title">
      <div className="hpt-cta-inner">
        <div className="hpt-cta-text">
          <span className="hpt-cta-badge">New · with Infynia Labs</span>
          <h2 id="hts-title">Technology Services for Your Business</h2>
          <p>
            Website, payment gateway, business email, online store and apps —
            built AI-native and fast, with Legal Terminus owning it end to end.
          </p>
        </div>
        <Link to="/technology-services" className="hpt-cta-btn">
          Explore Technology Services
          <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
            <path d="M5 12h14" />
            <path d="m12 5 7 7-7 7" />
          </svg>
        </Link>
      </div>
    </section>
  )
}

export default HomeTechServicesCta
