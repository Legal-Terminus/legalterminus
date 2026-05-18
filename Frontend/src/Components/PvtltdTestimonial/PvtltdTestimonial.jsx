import React, { useState, useEffect } from "react";
import "./PvtltdTestimonial.css";

const GOOGLE_REVIEW_URL = "https://share.google/vpPPXcq7hegJilJvt";

const testimonials = [
  {
    name: "Sourav Sahoo",
    role: "",
    text: "I had an excellent experience with Legal Terminus Private Limited. They got my GST registration completed within just a couple of hours, and I even received my GST certificate the same day. The entire process was quick, smooth, and absolutely hassle-free. Their team is professional, responsive, and truly knows their work. If you're looking for fast and reliable GST or compliance services, I highly recommend Legal Terminus Private Limited.",
    rating: 5,
  },
  {
    name: "Hemant Sahoo",
    role: "",
    text: "I'm really happy I went with Legal Terminus. Not only was their pricing the most reasonable I found, but the team also supported me through the whole incorporation process. A touch more structure in their service would make them unbeatable, but honestly, for the price and the help, they deserve 5 stars.",
    rating: 5,
  },
  {
    name: "Dipti Ranjan Sahoo",
    role: "Director, Ephorsys Private Limited",
    text: "We are glad to share that our company Ephorsys Private Limited was successfully incorporated with the support of Legal Terminus. Their team provided excellent guidance throughout the entire process—from documentation to final approval. Everything was handled smoothly, professionally, and on time. Thank you, Legal Terminus, for making our incorporation journey hassle-free!",
    rating: 5,
  },
  {
    name: "Santanu Kumar Sahu",
    role: "",
    text: "Excellent service for company registration! The staff was very helpful, answered all my questions clearly, and made the entire process completely hassle-free. I'd definitely recommend them to anyone starting a new business.",
    rating: 5,
  },
  {
    name: "Debasish Sahu",
    role: "",
    text: "I am highly impressed with their refund policy. The process was completely transparent, hassle-free, and handled with professionalism. My refund was processed quickly without any complications.",
    rating: 5,
  },
  {
    name: "Pritam Rath",
    role: "Director, Stabdha Utility Insights Pvt. Ltd.",
    text: "Working with Legal Terminus for our annual compliances has been a seamless experience. Their knowledgeable team handled everything efficiently, ensuring we met all our regulatory requirements on time. We appreciate their proactive approach and clear communication. Highly recommend their services!",
    rating: 5,
  },
];

const AVATAR_COLORS = ["#4285F4", "#34A853", "#EA4335", "#FBBC05", "#9C27B0", "#00BCD4"];

const TRUNCATE = 110;

const GoogleGFull = ({ size = 34 }) => (
  <svg viewBox="0 0 24 24" width={size} height={size} aria-hidden="true" style={{ flexShrink: 0 }}>
    <path fill="#4285F4" d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z" />
    <path fill="#34A853" d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" />
    <path fill="#FBBC05" d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z" />
    <path fill="#EA4335" d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z" />
  </svg>
);

const Stars = ({ rating, size = "md" }) => (
  <div className={`gt-stars gt-stars--${size}`}>
    {[1, 2, 3, 4, 5].map((s) => (
      <span key={s} className={s <= rating ? "gt-star filled" : "gt-star empty"}>&#9733;</span>
    ))}
  </div>
);

const wrap = (idx, len) => ((idx % len) + len) % len;

const GoogleTestimonials = () => {
  const n = testimonials.length;
  const [active, setActive] = useState(0);
  const [isPaused, setIsPaused] = useState(false);

  const prev = wrap(active - 1, n);
  const next = wrap(active + 1, n);

  const goNext = () => setActive((i) => wrap(i + 1, n));
  const goPrev = () => setActive((i) => wrap(i - 1, n));

  useEffect(() => {
    if (isPaused) return;
    const id = setInterval(goNext, 3600);
    return () => clearInterval(id);
  }, [isPaused]);

  const visible = [
    { t: testimonials[prev],   idx: prev,   pos: "side" },
    { t: testimonials[active], idx: active, pos: "center" },
    { t: testimonials[next],   idx: next,   pos: "side" },
  ];

  return (
    <section
      className="gt-section"
      onMouseEnter={() => setIsPaused(true)}
      onMouseLeave={() => setIsPaused(false)}
    >
      <div className="gt-container">

        {/* Header */}
        <div className="gt-header">
          <p className="gt-label">What our customers say about us</p>
          <div className="gt-title-wrap">
            <span className="gt-title-bg" aria-hidden="true">Testimonials</span>
            <h2 className="gt-title">Testimonials</h2>
          </div>
        </div>

        {/* Slider row */}
        <div className="gt-slider-row">
          {/* Left arrow */}
          <button className="gt-arrow gt-arrow--left" aria-label="Previous" onClick={goPrev}>&#8249;</button>

          {/* Cards */}
          <div className="gt-cards">
            {visible.map(({ t, idx, pos }) => {
              const isLong = t.text.length > TRUNCATE;
              const text = isLong ? t.text.slice(0, TRUNCATE).trimEnd() + "..." : t.text;
              return (
                <article key={idx} className={`gt-card gt-card--${pos}`}>
                  {/* Avatar + Name + Role */}
                  <div className="gt-card-top">
                    <div className="gt-avatar" style={{ background: AVATAR_COLORS[idx % AVATAR_COLORS.length] }}>
                      {t.name.charAt(0)}
                    </div>
                    <div className="gt-identity">
                      <h3 className="gt-name">{t.name}</h3>
                      {t.role && <p className="gt-role">{t.role}</p>}
                    </div>
                  </div>

                  {/* Stars */}
                  <Stars rating={t.rating} size={pos === "center" ? "lg" : "sm"} />

                  {/* Text */}
                  <p className="gt-text">
                    {text}
                    {isLong && (
                      <a href={GOOGLE_REVIEW_URL} target="_blank" rel="noopener noreferrer" className="gt-show-more">
                        {" "}Show More
                      </a>
                    )}
                  </p>

                  {/* Posted On Google */}
                  <div className="gt-footer">
                    <GoogleGFull size={pos === "center" ? 34 : 26} />
                    <div className="gt-posted">
                      <span>Posted On</span>
                      <span>Google</span>
                    </div>
                  </div>
                </article>
              );
            })}
          </div>

          {/* Right arrow */}
          <button className="gt-arrow gt-arrow--right" aria-label="Next" onClick={goNext}>&#8250;</button>
        </div>

        {/* Dots */}
        <div className="gt-dots">
          {testimonials.map((_, i) => (
            <button
              key={i}
              className={`gt-dot ${i === active ? "gt-dot--active" : ""}`}
              aria-label={`Go to review ${i + 1}`}
              onClick={() => setActive(i)}
            />
          ))}
        </div>

        {/* Write a review link */}
        <div className="gt-cta">
          <a href={GOOGLE_REVIEW_URL} target="_blank" rel="noopener noreferrer" className="gt-cta-link">
            Write a Review on Google &#8599;
          </a>
        </div>

      </div>
    </section>
  );
};

export default GoogleTestimonials;
