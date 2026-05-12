import { useState } from "react";
import "./Testimonials.css";
import testimonialImg from "../../assets/testimonial.webp";

// Static data defined at module level — not re-allocated on every render
const DATA = [
  {
    id: 1,
    name: "Debasish Sahu",
    role: "Founder, Startup Pvt. Ltd.",
    text: "I am highly impressed with their refund policy. The process was completely transparent, hassle-free, and handled with professionalism. My refund was processed quickly without any complications.",
    avatar: "https://randomuser.me/api/portraits/men/32.jpg",
  },
  {
    id: 2,
    name: "Dipti Ranjan Sahoo",
    role: "Director, E-Commerce Business",
    text: "We are glad to share that our company Ephorsys Private Limited was successfully incorporated with the support of Legal Terminus. Their team provided excellent guidance throughout the entire process—from documentation to final approval. Everything was handled smoothly, professionally, and on time. Thank you, Legal Terminus, for making our incorporation journey hassle-free! 🙌",
    avatar: "https://randomuser.me/api/portraits/women/45.jpg",
  },
  {
    id: 3,
    name: "Hemant Sahoo",
    role: "Co-Founder, Tech Startup",
    text: "I’m really happy I went with Legal Terminus. Not only was their pricing the most reasonable I found, but the team also supported me through the whole incorporation process. A touch more structure in their service would make them unbeatable, but honestly, for the price and the help, they deserve 5 stars.",
    avatar: "https://randomuser.me/api/portraits/men/64.jpg",
  },
  {
    id: 4,
    name: "Sourav Sahoo",
    role: "Operations Head, Consulting Firm",
    text: "I had an excellent experience with Legal Terminus Private Limited. They got my GST registration completed within just a couple of hours, and I even received my GST certificate the same day. The entire process was quick, smooth, and absolutely hassle-free. Their team is professional, responsive, and truly knows their work. If you’re looking for fast and reliable GST or compliance services, I highly recommend Legal Terminus Private Limited.",
    avatar: "https://randomuser.me/api/portraits/women/68.jpg",
  },
];

export default function Testimonials() {
  const [active, setActive] = useState(DATA[0]);

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
          {DATA.map((item) => (
            <button
              key={item.id}
              className={`Testimonials-switchItem ${
                active.id === item.id ? "active" : ""
              }`}
              onClick={() => setActive(item)}
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
