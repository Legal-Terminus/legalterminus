import React from 'react'
import './Herosection.css'
import right3danimation from '../../assets/Hero-Video.mp4'

const TAGS = [
  'Startup Registration',
  'NGO Registration',
  'Trademark Registration',
  'Government License',
  'Government Registration',
  'Return Filing',
  'More +'
]

const Herosection = () => {

  return (
    <section className="hs-hero" aria-label="Hero — Business Compliance">
      <div className="hs-hero__container">

        {/* LEFT */}
        <div className="hs-hero__left">
          {/* Two-line title — refined layout */}
          <h1 className="hs-hero__title" aria-level="1">
            <span className="hs-hero__line hs-hero__line--top">
              <span className="hs-hero__emph">Empower Your</span>
              <span className="hs-hero__strong"> Business</span>
            </span>

            <span className="hs-hero__line hs-hero__line--bottom">
              <span className="hs-hero__accent-pill">Business Compliance &amp; Management</span>
              <span className="hs-hero__subtext"> — Made Easy With Us</span>
            </span>
          </h1>

          <p className="hs-hero__subtitle">
            Simple, reliable compliance services for startups and established enterprises fast onboarding,
            expert support and end-to-end management so you can focus on growth.
          </p>

          <div className="hs-hero__actions" role="group" aria-label="Hero actions">
            <a className="hs-btn hs-btn--primary" href="/contact" aria-label="Contact us">Contact Us</a>
            <a className="hs-btn hs-btn--ghost" href="/services" aria-label="View services">Services</a>
          </div>

          {/* Gap intentionally maintained between actions and tags */}
          <div id="recommended" className="hs-hero__tags" role="list" aria-label="Popular services">
            {TAGS.map(tag => (
              <button
                key={tag}
                className={`hs-tag ${tag === 'GST Registration' ? 'hs-tag--highlight' : ''}`}
                role="listitem"
                type="button"
                aria-pressed={tag === 'GST Registration'}
              >
                {tag}
              </button>
            ))}
          </div>
        </div>

        {/* RIGHT */}
        <div className="hs-hero__right" aria-hidden="false">
          <div className="hs-video-card">
            <video
              src={right3danimation}
              autoPlay
              muted
              loop
              playsInline
              width="600"
              height="400"
              className="hs-video-card__media"
            />
        
          </div>
        </div>

      </div>
    </section>
  )
}

export default Herosection
