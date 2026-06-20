import { useState, useEffect } from "react";
import "../Testimonials/Testimonials.css";
import testimonialImg from "../../assets/testimonial.webp";

// Testimonials reproduced from the Company Registration Consultancy in Odisha page
const DATA = [
  {
    id: 1,
    name: "Mugdha Khandelwal",
    role: "Whole-time Director, 79PM Lozix",
    text: "We have been associated with Legal Terminus since 2022. The team is very helpful and proactive. We have had a smooth sailing with all our work, from company registration to returns filing.",
    avatar: "https://randomuser.me/api/portraits/women/65.jpg",
  },
  {
    id: 2,
    name: "Gagan Chandra Panda",
    role: "MD, DKP Textiles & Footwear (OPC) Pvt Ltd",
    text: "The company incorporation and post-incorporation services provided by Legal Terminus are excellent. I am extremely pleased with the exceptional service I received and highly recommend their services.",
    avatar: "https://randomuser.me/api/portraits/men/32.jpg",
  },
  {
    id: 3,
    name: "Babaji Samal",
    role: "MD, Appsys Technosoft",
    text: "This year I went through the company incorporation in Bhubaneswar by Legal Terminus. Their service is exceptional. I would highly recommend them.",
    avatar: "https://randomuser.me/api/portraits/men/52.jpg",
  },
  {
    id: 4,
    name: "Kumud Singh",
    role: "Founder",
    text: "Exceptional service from Legal Terminus! They made company registration a breeze.",
    avatar: "https://randomuser.me/api/portraits/men/76.jpg",
  },
  {
    id: 5,
    name: "Nandita Jena",
    role: "Director",
    text: "My experience with Legal Terminus for company incorporation in Bhubaneswar was excellent. The team was knowledgeable, professional, and handled everything with care.",
    avatar: "https://randomuser.me/api/portraits/women/44.jpg",
  },
];

export default function CroTestimonials() {
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
          Across Odisha
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
