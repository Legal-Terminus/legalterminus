import { useState, useEffect, useRef } from "react";
import "./Testimonials.css";
import testimonialImg from "../../assets/testimonial.webp";
import { THEME_C } from "../../utils/theme";

// Static data defined at module level — not re-allocated on every render
const DATA = [
  {
    id: 1,
    name: "Gaurav Naik",
    role: "Lifora Exim",
    text: "Thank you for the smooth company registration service. The team was supportive, responsive, and completed all formalities within the promised timeline. They kept us informed at every stage and helped us understand the entire process easily. Great experience overall and very professional service from start to finish.",
    avatar: "https://randomuser.me/api/portraits/men/32.jpg",
  },
  {
    id: 2,
    name: "Kanhu Charan Dash",
    role: "VAIDYA SETU HEALTH AND WELLNESS PRIVATE LIMITED",
    text: "Excellent experience with Legal Terminus for Private Limited Company registration. This is the best company registration service provider in Odisha. Their team handled the complete process professionally and completed everything on time. They managed all documentation efficiently and ensured timely completion. Communication was smooth, quick, and helpful throughout. Truly reliable and trustworthy professionals for startup registration and compliance services.",
    avatar: "https://randomuser.me/api/portraits/men/45.jpg",
  },
  {
    id: 3,
    name: "Abinash Das",
    role: "TANUMANASA RESEARCH PRIVATE LIMITED",
    text: "Successfully completed our Trademark Registration process with their assistance. The team was very supportive, professional, and handled the entire process smoothly. Thank you for the excellent service and guidance throughout. Highly recommended.",
    avatar: "https://randomuser.me/api/portraits/men/64.jpg",
  },
  {
    id: 4,
    name: "Subhalaxmi Maharana",
    role: "MY NESTHUB PRIVATE LIMITED",
    text: "Really satisfied with their service. They handled everything properly without confusion and were always available for help. Made the whole process stress-free.",
    avatar: "https://randomuser.me/api/portraits/women/48.jpg",
  },
  {
    id: 5,
    name: "Priyanka Behera",
    role: "ROOTAMZ PRIVATE LIMITED",
    text: "ROOTAMZ PRIVATE LIMITED had a wonderful experience working with Legal Terminus Private Limited Company. Their team was highly professional, cooperative, and dedicated to delivering quality service throughout the entire process. Communication was smooth, transparent, and timely at every stage. We truly appreciate their support, expertise, and commitment, and we look forward to future collaborations together.",
    avatar: "https://randomuser.me/api/portraits/women/68.jpg",
  },
];

export default function Testimonials() {
  const [activeIndex, setActiveIndex] = useState(0);
  const active = DATA[activeIndex];

  useEffect(() => {
    if (THEME_C) return undefined; // Theme C runs its own pausable timer below
    const timer = setInterval(() => {
      setActiveIndex((prev) => (prev + 1) % DATA.length);
    }, 4000);
    return () => clearInterval(timer);
  }, []);

  // Theme C only: the rotation waits while the pointer or keyboard focus is on
  // the reviews, so a review can be read to the end.
  const paused = useRef(false);
  useEffect(() => {
    if (!THEME_C) return undefined;
    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) return undefined;
    const timer = setInterval(() => {
      if (!paused.current) setActiveIndex((prev) => (prev + 1) % DATA.length);
    }, 4000);
    return () => clearInterval(timer);
  }, []);
  const step = (by) => setActiveIndex((prev) => (prev + by + DATA.length) % DATA.length);

  // Theme C (E-25, #209 Home 10): one featured review with arrows, the reviewers
  // as small picture cards beneath. Same reviews, same image, same words; the layout
  // (arrows, cards) does not exist in the old markup, so it cannot be CSS alone.
  if (THEME_C) {
    return (
      <section
        className="Testimonials-container tst-c"
        onMouseEnter={() => { paused.current = true; }}
        onMouseLeave={() => { paused.current = false; }}
        onFocus={() => { paused.current = true; }}
        onBlur={() => { paused.current = false; }}
      >
        <div className="Testimonials-header">
          <span className="Testimonials-badge">CLIENT TESTIMONIALS</span>
          <h2>
            Trusted by Businesses
            Across India
          </h2>
        </div>

        <div className="tst-c__main">
          <div className="tst-c__media">
            <img src={testimonialImg} alt="Legal consultation discussion" />
          </div>

          <div className="tst-c__body">
            <div className="tst-c__top">
              <div className="tst-c__stars">
                <span className="star">★</span>
                <span className="star">★</span>
                <span className="star">★</span>
                <span className="star">★</span>
                <span className="star">★</span>
              </div>
              <div className="tst-c__ctl">
                <button type="button" aria-label="Previous review" onClick={() => step(-1)}>
                  <svg width="20" height="20" viewBox="0 0 24 24" fill="none" aria-hidden="true">
                    <path d="M19 12H5M11 5l-7 7 7 7" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" />
                  </svg>
                </button>
                <button type="button" aria-label="Next review" onClick={() => step(1)}>
                  <svg width="20" height="20" viewBox="0 0 24 24" fill="none" aria-hidden="true">
                    <path d="M5 12h14M13 5l7 7-7 7" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" />
                  </svg>
                </button>
              </div>
            </div>

            <p className="tst-c__text" aria-live="polite">"{active.text}"</p>

            <div className="tst-c__user">
              <img src={active.avatar} alt={active.name} />
              <div className="tst-c__who">
                <h4>{active.name}</h4>
                <span>{active.role}</span>
              </div>
            </div>

            <span className="tst-c__quote" aria-hidden="true">"</span>
          </div>
        </div>

        <div className="tst-c__thumbs">
          {DATA.map((item, index) => (
            <button
              key={item.id}
              type="button"
              className="tst-c__thumb"
              aria-pressed={activeIndex === index}
              onClick={() => setActiveIndex(index)}
            >
              {/* picture only: printing every reviewer's name here would add
                  words the page does not show today (E25-S02 content check) */}
              <img src={item.avatar} alt={item.name} />
            </button>
          ))}
        </div>
      </section>
    );
  }

  return (
    <section className="Testimonials-container">
      <div className="Testimonials-header">
        <span className="Testimonials-badge">CLIENT TESTIMONIALS</span>
        <h2>
          Trusted by Businesses
          Across India
        </h2>
      </div>

      <div className="Testimonials-layout">
        {/* LEFT IMAGE */}
        <div className="Testimonials-image">
          <div className="image-wrapper">
            <img src={testimonialImg} alt="Legal consultation discussion" />
            <div className="image-overlay"></div>
          </div>
        </div>

        {/* TESTIMONIAL CARD */}
        <div className="Testimonials-card">
          <div className="card-glow"></div>

          <div className="Testimonials-stars">
            <span className="star">★</span>
            <span className="star">★</span>
            <span className="star">★</span>
            <span className="star">★</span>
            <span className="star">★</span>
          </div>

          <p className="Testimonials-text">"{active.text}"</p>

          <div className="Testimonials-user">
            <div className="avatar-ring">
              <img src={active.avatar} alt={active.name} />
            </div>
            <div className="user-info">
              <h4>{active.name}</h4>
              <span>{active.role}</span>
            </div>
          </div>

          <span className="Testimonials-quote">"</span>
        </div>

        {/* AVATAR SWITCH */}
        <div className="Testimonials-switch">
          {DATA.map((item, index) => (
            <button
              key={item.id}
              className={`Testimonials-switchItem ${
                activeIndex === index ? "active" : ""
              }`}
              onClick={() => setActiveIndex(index)}
            >
              <div className="avatar-indicator"></div>
              <img src={item.avatar} alt={item.name} />
            </button>
          ))}
        </div>
      </div>
    </section>
  );
}
