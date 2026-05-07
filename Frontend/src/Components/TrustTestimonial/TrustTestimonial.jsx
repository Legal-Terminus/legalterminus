import React, { useRef } from "react";
import "./TrustTestimonial.css";

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
    text:
      "This year I went through the company trustestoration in Bhubaneswar by Legal Terminus. Their service is exceptional. I would highly recommend.",
    rating: 5,
    initial: "B",
  },
  {
    name: "Pritam Rath",
    role: "Director at Stabdha Utility Insights – Private Limited",
    text:
      "Working with Legal Terminus for our annual compliances has been a seamless experience. Highly recommend their services!",
    rating: 5,
    initial: "P",
  },
  {
    name: "Ananya Singh",
    role: "Startup Founder",
    text: "They explained every step clearly and completed the process on time.",
    rating: 5,
    initial: "A",
  },
];

const trustestTestimonial = () => {
  const sliderRef = useRef(null);

  const handleScroll = (direction) => {
    const container = sliderRef.current;
    if (!container) return;

    const card = container.querySelector(
      ".trustest-testimonial-card"
    );
    if (!card) return;

    const gap = 24;
    const cardWidth = card.offsetWidth + gap;

    container.scrollBy({
      left: direction === "next" ? cardWidth : -cardWidth,
      behavior: "smooth",
    });
  };

  return (
    <section className="trustest-testimonial-section">
      <div className="trustest-testimonial-container">
        <h2 className="trustest-testimonial-heading">
          See What Our Customers Say on Google
        </h2>

        <div className="trustest-testimonial-slider-wrapper">
          {/* Left arrow */}
          <button
            className="trustest-testimonial-arrow trustest-testimonial-arrow-left"
            aria-label="Previous testimonials"
            onClick={() => handleScroll("prev")}
          >
            ❮
          </button>

          {/* Slider */}
          <div
            className="trustest-testimonial-slider"
            ref={sliderRef}
          >
            {testimonials.map((t, idx) => (
              <article
                className="trustest-testimonial-card"
                key={idx}
              >
                <span className="trustest-testimonial-quote trustest-testimonial-quote-top">
                  “
                </span>

                <div className="trustest-testimonial-avatar-wrap">
                  <div className="trustest-testimonial-avatar">
                    {t.initial}
                  </div>
                </div>

                <p className="trustest-testimonial-text">
                  {t.text}
                </p>

                <h3 className="trustest-testimonial-name">
                  {t.name}
                </h3>
                <p className="trustest-testimonial-role">
                  {t.role}
                </p>

                <div className="trustest-testimonial-stars">
                  {Array.from({ length: t.rating }).map(
                    (_, i) => (
                      <span key={i}>★</span>
                    )
                  )}
                </div>

                <span className="trustest-testimonial-quote trustest-testimonial-quote-bottom">
                  ”
                </span>
              </article>
            ))}
          </div>

          {/* Right arrow */}
          <button
            className="trustest-testimonial-arrow trustest-testimonial-arrow-right"
            aria-label="Next testimonials"
            onClick={() => handleScroll("next")}
          >
            ❯
          </button>
        </div>
      </div>
    </section>
  );
};

export default trustestTestimonial;
