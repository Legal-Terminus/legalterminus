import React, { useRef, useEffect } from "react";
import "./PvtltdTestimonial.css";

const GOOGLE_REVIEW_URL = "https://share.google/vpPPXcq7hegJilJvt";

const AVATAR_COLORS = ["#4285F4", "#EA4335", "#34A853", "#FBBC05"];

const testimonials = [
  {
    name: "Kirti Ranjan Sahu",
    role: "Proprietor of Keshab Jewellers",
    text: "Very professional and efficient ITR filing services. Thank you.",
    rating: 5,
    initial: "K",
  },
  {
    name: "Gobinda Chandra Mishra",
    role: "Influencer",
    text: "Best ITR filing service provider.",
    rating: 5,
    initial: "G",
  },
  {
    name: "Babaji Samal",
    role: "MD, AppsSys Technosoft",
    text: "This year I went through the company incorporation in Bhubaneswar by Legal Terminus. Their service is exceptional. I would highly recommend.",
    rating: 5,
    initial: "B",
  },
  {
    name: "Pritam Rath",
    role: "Director at Stabdha Utility Insights – Private Limited",
    text: "Working with Legal Terminus for our annual compliances has been a seamless experience. Highly recommend their services!",
    rating: 5,
    initial: "P",
  },
];

const GoogleG = ({ size = 20 }) => (
  <svg viewBox="0 0 24 24" width={size} height={size} aria-hidden="true">
    <path fill="#4285F4" d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z" />
    <path fill="#34A853" d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" />
    <path fill="#FBBC05" d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z" />
    <path fill="#EA4335" d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z" />
  </svg>
);

const StarRow = ({ rating }) => (
  <div className="gt-stars">
    {[1, 2, 3, 4, 5].map((s) => (
      <span key={s} className={s <= rating ? "gt-star filled" : "gt-star empty"}>★</span>
    ))}
  </div>
);

const GoogleTestimonials = () => {
  const sliderRef = useRef(null);
  const intervalRef = useRef(null);

  const getCardWidth = () => {
    const container = sliderRef.current;
    if (!container) return 300;
    const card = container.querySelector(".gt-card");
    return card ? card.offsetWidth + 20 : 300;
  };

  const startAutoScroll = () => {
    intervalRef.current = setInterval(() => {
      const container = sliderRef.current;
      if (!container) return;
      const maxScroll = container.scrollWidth - container.clientWidth;
      if (container.scrollLeft >= maxScroll - 5) {
        container.scrollTo({ left: 0, behavior: "smooth" });
      } else {
        container.scrollBy({ left: getCardWidth(), behavior: "smooth" });
      }
    }, 3200);
  };

  const stopAutoScroll = () => {
    if (intervalRef.current) clearInterval(intervalRef.current);
  };

  useEffect(() => {
    startAutoScroll();
    return () => stopAutoScroll();
  }, []);

  const handleScroll = (direction) => {
    stopAutoScroll();
    const container = sliderRef.current;
    if (!container) return;
    container.scrollBy({ left: direction === "next" ? getCardWidth() : -getCardWidth(), behavior: "smooth" });
    startAutoScroll();
  };

  return (
    <section className="gt-section">
      <div className="gt-container">

        {/* ── Google-branded header ── */}
        <div className="gt-brand-header">
          <div className="gt-brand-left">
            <div className="gt-brand-label">
              <GoogleG size={28} />
              <span className="gt-brand-text">Google Reviews</span>
            </div>
            <div className="gt-overall">
              <span className="gt-overall-score">4.8</span>
              <div>
                <div className="gt-overall-stars">★★★★★</div>
                <p className="gt-review-count">Based on 4+ reviews</p>
              </div>
            </div>
          </div>
          <a
            href={GOOGLE_REVIEW_URL}
            target="_blank"
            rel="noopener noreferrer"
            className="gt-write-btn"
          >
            Write a Review ↗
          </a>
        </div>

        <h2 className="gt-heading">What Our Clients Say</h2>

        {/* ── Slider ── */}
        <div className="gt-slider-wrapper">
          <button className="gt-side-arrow gt-left" aria-label="Previous" onClick={() => handleScroll("prev")}>&#10094;</button>

          <div
            className="gt-slider"
            ref={sliderRef}
            onMouseEnter={stopAutoScroll}
            onMouseLeave={startAutoScroll}
          >
            {testimonials.map((t, idx) => (
              <article className="gt-card" key={idx}>
                {/* Top row: avatar + name + org */}
                <div className="gt-card-top">
                  <div
                    className="gt-avatar"
                    style={{ background: AVATAR_COLORS[idx % AVATAR_COLORS.length] }}
                  >
                    {t.initial}
                  </div>
                  <div className="gt-card-meta">
                    <h3 className="gt-name">{t.name}</h3>
                    <p className="gt-role">{t.role}</p>
                  </div>
                </div>

                {/* Review text */}
                <p className="gt-text">{t.text}</p>

                {/* Bottom: stars + Google G */}
                <div className="gt-card-bottom">
                  <StarRow rating={t.rating} />
                  <GoogleG size={16} />
                </div>
              </article>
            ))}
          </div>

          <button className="gt-side-arrow gt-right" aria-label="Next" onClick={() => handleScroll("next")}>&#10095;</button>
        </div>

        {/* ── See all link ── */}
        <div className="gt-see-all">
          <a href={GOOGLE_REVIEW_URL} target="_blank" rel="noopener noreferrer" className="gt-see-all-link">
            <GoogleG size={16} />
            See all reviews on Google
          </a>
        </div>

      </div>
    </section>
  );
};

export default GoogleTestimonials;
