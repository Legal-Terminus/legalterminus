import { useRef, useState, useEffect } from 'react'
import './Media.css'
import news1 from '../../assets/NewsPaper.webp'
import news2 from '../../assets/NewsPaper2.webp'
import news3 from '../../assets/NewsPaper3.webp'

/* Newspaper clippings for the auto-scrolling Print Media strip */
const printMedia = [
  { src: news1, alt: 'Legal Terminus in Janamata Parikrama' },
  { src: news2, alt: 'Legal Terminus newspaper coverage' },
  { src: news3, alt: 'Legal Terminus newspaper coverage' },
]

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
        <div className="media-banner-content">
          <span className="media-banner-badge">Newsroom</span>
          <h1>Media &amp; Press</h1>
          <p>Legal Terminus in the News and Media</p>
          <span className="media-banner-divider" aria-hidden="true"></span>
        </div>
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

        {/* Print Media — auto-scrolling newspaper clippings */}
        <section className="media-print">
          <h2 className="media-print-title">Print Media</h2>
          <div className="pm-marquee">
            <div className="pm-track">
              {[...printMedia, ...printMedia].map((item, i) => (
                <div className="pm-slide" key={i}>
                  <img src={item.src} alt={item.alt} draggable="false" loading="lazy" />
                </div>
              ))}
            </div>
          </div>
        </section>
      </div>
    </div>
  )
}
