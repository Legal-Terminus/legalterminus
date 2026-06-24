import { useRef, useState, useEffect } from 'react'
import './Media.css'

/**
 * Media coverage videos.
 * Replace each `videoId` with the real YouTube video ID
 * (the part after `watch?v=` or `youtu.be/`).
 */
const mediaCoverage = [
  { channel: 'Darbar TV',        videoId: 'dQw4w9WgXcQ' },
  { channel: 'Daily News',       videoId: 'ysz5PUM2z2A' },
  { channel: 'Chandrama Khabar', videoId: 'jNQXAC9IVRw' },
  { channel: 'EN Odisha',        videoId: 'oHg5SJYRHA0' },
  { channel: 'Utkal Bharat',     videoId: 'kJQP7kiw5Fk' },
  { channel: 'Pratigyan Live',   videoId: 'fJ9rUzIMcZQ' },
]

/* Loads the YouTube iframe only once the card scrolls into view */
function LazyVideo({ videoId, title }) {
  const ref = useRef(null)
  const [visible, setVisible] = useState(false)

  useEffect(() => {
    const node = ref.current
    if (!node) return
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setVisible(true)
          observer.unobserve(entry.target)
        }
      },
      { rootMargin: '120px' }
    )
    observer.observe(node)
    return () => observer.disconnect()
  }, [])

  return (
    <div ref={ref} className="mc-video">
      {visible ? (
        <iframe
          src={`https://www.youtube.com/embed/${videoId}`}
          title={title}
          frameBorder="0"
          allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share"
          allowFullScreen
        />
      ) : (
        <div className="mc-video-placeholder" aria-hidden="true" />
      )}
    </div>
  )
}

export default function Media() {
  return (
    <div className="media-page">
      <section className="media-banner">
        <h1>Media & Press</h1>
        <p>Legal Terminus in the News and Media</p>
      </section>

      <div className="media-container">
        <section className="media-coverage">
          <h2>Media Coverage</h2>
          <p className="media-coverage-sub">
            Watch Legal Terminus featured across leading news channels.
          </p>
          <div className="mc-grid">
            {mediaCoverage.map((item) => (
              <article className="mc-card" key={item.channel}>
                <LazyVideo videoId={item.videoId} title={item.channel} />
                <h3 className="mc-channel">{item.channel}</h3>
              </article>
            ))}
          </div>
        </section>

        <section className="media-about">
          <h2>About Legal Terminus</h2>
          <p>
            Legal Terminus is a leading online consultancy platform dedicated to making legal and compliance services 
            accessible and affordable for businesses of all sizes. With offices across India and a team of experienced consultants, 
            we've served thousands of clients in their business journey.
          </p>
        </section>

        <section className="media-contact">
          <h2>Media Inquiries</h2>
          <div className="contact-info">
            <div className="contact-card">
              <h3>Press Contact</h3>
              <p>For media inquiries, interviews, or press releases, please contact:</p>
              <p>
                <strong>Email:</strong> <a href="mailto:admin@legalterminus.com">admin@legalterminus.com</a>
              </p>
            </div>
            <div className="contact-card">
              <h3>Office Address</h3>
              <p>
                Legal Terminus<br/>
                Multiple Offices across India<br/>
                Delhi | Uttar Pradesh | Madhya Pradesh | Odisha
              </p>
            </div>
          </div>
        </section>

        <section className="media-social">
          <h2>Follow Us</h2>
          <div className="social-links">
            <a href="https://www.facebook.com/LegalTerminusofficial" target="_blank" rel="noopener noreferrer" className="social-btn">
              <span>Facebook</span>
            </a>
            <a href="https://www.instagram.com/legalterminus/" target="_blank" rel="noopener noreferrer" className="social-btn">
              <span>Instagram</span>
            </a>
            <a href="https://twitter.com/legalterminus" target="_blank" rel="noopener noreferrer" className="social-btn">
              <span>Twitter</span>
            </a>
            <a href="https://www.youtube.com/@LegalTerminus" target="_blank" rel="noopener noreferrer" className="social-btn">
              <span>YouTube</span>
            </a>
            <a href="https://www.linkedin.com/company/legalterminus/" target="_blank" rel="noopener noreferrer" className="social-btn">
              <span>LinkedIn</span>
            </a>
          </div>
        </section>

        <section className="media-services">
          <h2>Our Services</h2>
          <div className="services-grid">
            <div className="service-item">
              <h3>Company Registration</h3>
              <p>Pvt Ltd, OPC, LLP, Partnership, and more</p>
            </div>
            <div className="service-item">
              <h3>Compliance Services</h3>
              <p>ITR filing, Annual filing, GST returns</p>
            </div>
            <div className="service-item">
              <h3>Registration Services</h3>
              <p>GST, MSME, PF, ESIC, Startup registrations</p>
            </div>
            <div className="service-item">
              <h3>Trademark Services</h3>
              <p>Registration, renewal, and opposition support</p>
            </div>
          </div>
        </section>

        <section className="media-contact-us">
          <h2>Get in Touch</h2>
          <div className="contact-methods">
            <div className="method">
              <h3>📞 Phone</h3>
              <a href="tel:+918280045432">+91 8280 045 432</a>
            </div>
            <div className="method">
              <h3>💬 WhatsApp</h3>
              <a href="https://wa.me/918280008183" target="_blank" rel="noopener noreferrer">+91 8280 008 183</a>
            </div>
            <div className="method">
              <h3>✉️ Email</h3>
              <a href="mailto:admin@legalterminus.com">admin@legalterminus.com</a>
            </div>
          </div>
        </section>
      </div>
    </div>
  )
}
