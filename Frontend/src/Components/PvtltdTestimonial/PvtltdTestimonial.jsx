import React, { useRef, useState, useEffect } from "react";
import "./PvtltdTestimonial.css";

const GOOGLE_REVIEW_URL = "https://share.google/vpPPXcq7hegJilJvt";

const testimonials = [
  {
    name: "Kirti Ranjan Sahu",
    role: "Proprietor of Keshab Jewellers",
    text: "Very professional and efficient ITR filing services. Thank you.",
    rating: 5,
  },
  {
    name: "Gobinda Chandra Mishra",
    role: "Influencer",
    text: "Best ITR filing service provider.",
    rating: 5,
  },
  {
    name: "Babaji Samal",
    role: "MD, AppsSys Technosoft",
    text: "This year I went through the company incorporation in Bhubaneswar by Legal Terminus. Their service is exceptional. I would highly recommend.",
    rating: 5,
  },
  {
    name: "Pritam Rath",
    role: "Director at Stabdha Utility Insights - Private Limited",
    text: "Working with Legal Terminus for our annual compliances has been a seamless experience. Highly recommend their services!",
    rating: 5,
  },
  {
    name: "Siddharth Mohanty",
    role: "Entrepreneur, Bhubaneswar",
    text: "Excellent guidance throughout the company registration process. Very knowledgeable team and quick turnaround.",
    rating: 5,
  },
  {
    name: "Priya Agarwal",
    role: "Director, StartupOdisha",
    text: "Their attention to detail and prompt responses made our compliance process completely stress-free. Highly recommend!",
    rating: 5,
  },
];

const AVATAR_COLORS = [
  "#4285F4", "#34A853", "#EA4335", "#FBBC05", "#9C27B0", "#00BCD4",
];

const GoogleG = ({ size = 18 }) => (
  <svg viewBox="0 0 24 24" width={size} height={size} aria-hidden="true" style={{ flexShrink: 0 }}>
    <path fill="#4285F4" d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z" />
    <path fill="#34A853" d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" />
    <path fill="#FBBC05" d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z" />
    <path fill="#EA4335" d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z" />
  </svg>
);

const StarRow = ({ rating }) => (
  <div className="gt-stars">
    {[1, 2, 3, 4, 5].map((s) => (
      <span key={s} className={s <= rating ? "gt-star filled" : "gt-star empty"}>&#9733;</span>
    ))}
  </div>
);

const TRUNCATE_LIMIT = 120;

const ReviewCard = ({ t, idx }) => {
  const [expanded, setExpanded] = useState(false);
  const isLong = t.text.length > TRUNCATE_LIMIT;
  const displayText = isLong && !expanded ? t.text.slice(0, TRUNCATE_LIMIT).trimEnd() + "..." : t.text;

  return (
    <article className="gt-card">
      <div className="gt-card-top">
        <div className="gt-avatar" style={{ background: AVATAR_COLORS[idx % AVATAR_COLORS.length] }}>
          {t.name.charAt(0)}
        </div>
        <div className="gt-card-identity">
          <h3 className="gt-name">{t.name}</h3>
          <StarRow rating={t.rating} />
        </div>
      </div>

      <p className="gt-role">{t.role}</p>

      <p className="gt-text">
        {displayText}
        {isLong && !expanded && (
          <a
            href={GOOGLE_REVIEW_URL}
            target="_blank"
            rel="noopener noreferrer"
            className="gt-read-more"
          >
            {" "}Read more
          </a>
        )}
      </p>

      <div className="gt-card-footer">
        <div className="gt-posted-badge">
          <GoogleG size={14} />
          <span className="gt-posted-text">Posted on Google</span>
        </div>
      </div>
    </article>
  );
};

const GoogleTestimonials = () => {
  const sliderRef = useRef(null);
  const [isPaused, setIsPaused] = useState(false);

  const getStep = () => {
    const container = sliderRef.current;
    if (!container) return 300;
    const card = container.querySelector(".gt-card");
    return card ? card.getBoundingClientRect().width + 20 : 300;
  };

  const scrollNext = () => {
    const container = sliderRef.current;
    if (!container) return;
    const maxScroll = container.scrollWidth - container.clientWidth;
    if (container.scrollLeft >= maxScroll - 4) {
      container.scrollTo({ left: 0, behavior: "smooth" });
    } else {
      container.scrollBy({ left: getStep(), behavior: "smooth" });
    }
  };

  const scrollPrev = () => {
    const container = sliderRef.current;
    if (!container) return;
    container.scrollBy({ left: -getStep(), behavior: "smooth" });
  };

  useEffect(() => {
    if (isPaused) return;
    const id = setInterval(scrollNext, 3500);
    return () => clearInterval(id);
  }, [isPaused]);

  return (
    <section className="gt-section">
      <div className="gt-container">

        {/* Section header row */}
        <div className="gt-section-header">
          <div className="gt-header-left">
            <div className="gt-brand-label">
              <GoogleG size={22} />
              <span className="gt-brand-text">Google Reviews</span>
            </div>
            <div className="gt-overall">
              <span className="gt-overall-score">4.9</span>
              <div>
                <div className="gt-overall-stars">&#9733;&#9733;&#9733;&#9733;&#9733;</div>
                <p className="gt-review-count">Based on 6+ reviews</p>
              </div>
            </div>
          </div>

          <div className="gt-header-right">
            <button
              className="gt-arrow"
              aria-label="Previous"
              onClick={() => { setIsPaused(true); scrollPrev(); setTimeout(() => setIsPaused(false), 800); }}
            >&#8249;</button>
            <button
              className="gt-arrow"
              aria-label="Next"
              onClick={() => { setIsPaused(true); scrollNext(); setTimeout(() => setIsPaused(false), 800); }}
            >&#8250;</button>
          </div>
        </div>

        {/* Heading */}
        <h2 className="gt-heading">What Our Clients Say</h2>

        {/* Slider */}
        <div
          className="gt-slider"
          ref={sliderRef}
          onMouseEnter={() => setIsPaused(true)}
          onMouseLeave={() => setIsPaused(false)}
        >
          {testimonials.map((t, idx) => (
            <ReviewCard key={idx} t={t} idx={idx} />
          ))}
        </div>

        {/* Write + See all */}
        <div className="gt-footer-row">
          <a href={GOOGLE_REVIEW_URL} target="_blank" rel="noopener noreferrer" className="gt-see-all-link">
            <GoogleG size={14} />
            See all reviews on Google
          </a>
          <a href={GOOGLE_REVIEW_URL} target="_blank" rel="noopener noreferrer" className="gt-write-btn">
            Write a Review &#8599;
          </a>
        </div>

      </div>
    </section>
  );
};

export default GoogleTestimonials;
