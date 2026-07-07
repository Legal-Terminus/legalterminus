import React from 'react'
import { Link } from 'react-router-dom'
import './HomePdfToolsCta.css'

const HomePdfToolsCta = () => {
  return (
    <section className="hpt-cta">
      <div className="hpt-cta-inner">
        <div className="hpt-cta-text">
          <span className="hpt-cta-badge">100% Free</span>
          <h2>All-in-One PDF Tools</h2>
          <p>
            Merge, split, compress, convert, OCR &amp; rotate your PDFs instantly —
            free and right in your browser. No sign-up required.
          </p>
        </div>
        <Link to="/pdf-tools" className="hpt-cta-btn">
          Open PDF Tools
          <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
            <path d="M5 12h14" />
            <path d="m12 5 7 7-7 7" />
          </svg>
        </Link>
      </div>
    </section>
  )
}

export default HomePdfToolsCta
