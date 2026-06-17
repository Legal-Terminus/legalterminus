import React, { useRef } from "react";
import "../ProFOPCTestimonial/ProFOPCTestimonial.css";

const testimonials = [
  {
    name: "Rajeev Menon",
    role: "Director, Northbridge Industries",
    text:
      "Legal Terminus converted our public company to private without a single hiccup. The RD approval came through smoothly.",
    rating: 5,
    initial: "R",
  },
  {
    name: "Sunita Agarwal",
    role: "Promoter, Agarwal Steels",
    text:
      "They handled the special resolution, newspaper notices and RD-1 filing end to end. Very professional team.",
    rating: 5,
    initial: "S",
  },
  {
    name: "Imran Sheikh",
    role: "MD, Crescent Traders",
    text:
      "We wanted to reduce our compliance burden. The conversion was completed well within the promised timeline.",
    rating: 5,
    initial: "I",
  },
  {
    name: "Pooja Reddy",
    role: "Director, Reddy Infra",
    text:
      "Clear guidance at every step and constant status updates. Highly recommend their conversion services.",
    rating: 5,
    initial: "P",
  },
  {
    name: "Vikram Desai",
    role: "Chairman, Desai Holdings",
    text:
      "Their company secretaries knew exactly what the Regional Director needed. No back and forth.",
    rating: 5,
    initial: "V",
  },
  {
    name: "Anita Kulkarni",
    role: "Founder, Kulkarni Foods",
    text:
      "Smooth, transparent and reasonably priced. The altered MOA & AOA were drafted perfectly.",
    rating: 4,
    initial: "A",
  },
  {
    name: "Harish Nair",
    role: "Director, Nair Exports",
    text:
      "Got our fresh Certificate of Incorporation as a private company without any stress.",
    rating: 5,
    initial: "H",
  },
  {
    name: "Meera Joshi",
    role: "Promoter, Joshi Textiles",
    text:
      "The team managed creditor notices and objections handling very efficiently.",
    rating: 5,
    initial: "M",
  },
  {
    name: "Sanjay Gupta",
    role: "MD, Gupta Logistics",
    text:
      "Professional, responsive and well organised. The conversion paperwork was flawless.",
    rating: 5,
    initial: "S",
  },
  {
    name: "Farhan Ali",
    role: "Director, Ali Pharma",
    text:
      "Excellent support throughout the RD process. Worth every rupee.",
    rating: 4,
    initial: "F",
  },
  {
    name: "Deepa Iyer",
    role: "Founder, Iyer Solutions",
    text:
      "They kept us compliant and updated all our statutory registers after conversion.",
    rating: 5,
    initial: "D",
  },
  {
    name: "Nikhil Verma",
    role: "Promoter, Verma Group",
    text:
      "Transparent pricing and a knowledgeable team. The whole conversion felt effortless.",
    rating: 5,
    initial: "N",
  },
];

const GoogleTestimonials = () => {
  const sliderRef = useRef(null);

  const handleScroll = (direction) => {
    const container = sliderRef.current;
    if (!container) return;

    const card = container.querySelector(".profopc-testimonial-card");
    if (!card) return;

    const gap = 24;
    const cardWidth = card.offsetWidth + gap;

    container.scrollBy({
      left: direction === "next" ? cardWidth : -cardWidth,
      behavior: "smooth",
    });
  };

  return (
    <section className="profopc-testimonial-section">
      <div className="profopc-testimonial-container">
        <h2 className="profopc-testimonial-heading">
          See What Our Customers Say on Google
        </h2>

        <div className="profopc-testimonial-slider-wrapper">
          <button
            className="profopc-testimonial-arrow profopc-testimonial-left"
            onClick={() => handleScroll("prev")}
            aria-label="Previous testimonials"
          >
            ❮
          </button>

          <div
            className="profopc-testimonial-slider"
            ref={sliderRef}
          >
            {testimonials.map((t, idx) => (
              <article
                className="profopc-testimonial-card"
                key={idx}
              >
                <span className="profopc-testimonial-quote profopc-testimonial-quote-top">
                  “
                </span>

                <div className="profopc-testimonial-avatar-wrap">
                  <div className="profopc-testimonial-avatar">
                    <span>{t.initial}</span>
                  </div>
                </div>

                <p className="profopc-testimonial-text">{t.text}</p>

                <h3 className="profopc-testimonial-name">{t.name}</h3>
                <p className="profopc-testimonial-role">{t.role}</p>

                <div className="profopc-testimonial-stars">
                  {Array.from({ length: t.rating }).map((_, i) => (
                    <span key={i}>★</span>
                  ))}
                </div>

                <span className="profopc-testimonial-quote profopc-testimonial-quote-bottom">
                  ”
                </span>
              </article>
            ))}
          </div>

          <button
            className="profopc-testimonial-arrow profopc-testimonial-right"
            onClick={() => handleScroll("next")}
            aria-label="Next testimonials"
          >
            ❯
          </button>
        </div>
      </div>
    </section>
  );
};

export default GoogleTestimonials;
