import { useState, useEffect } from "react";
import "./Testimonials.css";
import testimonialImg from "../../assets/testimonial.webp";

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
    const timer = setInterval(() => {
      setActiveIndex((prev) => (prev + 1) % DATA.length);
    }, 4000);
    return () => clearInterval(timer);
  }, []);

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
