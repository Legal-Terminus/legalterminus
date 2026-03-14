import React, { useRef } from "react";
import "./ChangeLlpTestimonial.css";

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
  {
    name: "Ananya Singh",
    role: "Startup Founder",
    text: "They explained every step clearly and completed the process on time.",
    rating: 5,
    initial: "A",
  },
  {
    name: "Rahul Verma",
    role: "Consultant",
    text: "Smooth GST registration and very responsive support.",
    rating: 4,
    initial: "R",
  },
  {
    name: "Sneha Patil",
    role: "Entrepreneur",
    text: "Got timely reminders for all compliance due dates. Stress-free now.",
    rating: 5,
    initial: "S",
  },
  {
    name: "Mohit Sharma",
    role: "Director, FinSync Solutions",
    text: "Their advisory has helped us structure our business better.",
    rating: 5,
    initial: "M",
  },
  {
    name: "Arjun Nair",
    role: "Proprietor",
    text: "Very polite staff and accurate guidance for tax planning.",
    rating: 4,
    initial: "A",
  },
  {
    name: "Ritu Jain",
    role: "Business Owner",
    text: "Paperwork was minimal and everything happened online. Very convenient.",
    rating: 5,
    initial: "R",
  },
  {
    name: "Deepak Kulkarni",
    role: "Co-Founder, TechHive",
    text: "They took care of all MCA filings and kept us updated at every step.",
    rating: 5,
    initial: "D",
  },
  {
    name: "Neha Agarwal",
    role: "Consultant",
    text: "Prompt responses, transparent pricing and professional work.",
    rating: 5,
    initial: "N",
  },
];

const ChangeLlpTestimonial = () => {
  const sliderRef = useRef(null);

  const handleScroll = (direction) => {
    const container = sliderRef.current;
    if (!container) return;

    const card = container.querySelector(".Change-llp-gt-card");
    if (!card) return;

    const gap = 24; // same as CSS gap
    const cardWidth = card.offsetWidth + gap;

    container.scrollBy({
      left: direction === "next" ? cardWidth : -cardWidth,
      behavior: "smooth",
    });
  };

  return (
    <section className="Change-llp-gt-section">
      <div className="Change-llp-gt-container">
        <h2 className="Change-llp-gt-heading">
          See What Our Customers Say on Google
        </h2>

        <div className="Change-llp-gt-slider-wrapper">
          {/* Left arrow */}
          <button
            className="Change-llp-gt-side-arrow Change-llp-gt-left"
            aria-label="Previous testimonials"
            onClick={() => handleScroll("prev")}
          >
            ❮
          </button>

          {/* Cards slider */}
          <div className="Change-llp-gt-slider" ref={sliderRef}>
            {testimonials.map((t, idx) => (
              <article className="Change-llp-gt-card" key={idx}>
                {/* top quote */}
                <span className="Change-llp-gt-quote Change-llp-gt-quote-top">“</span>

                {/* avatar */}
                <div className="Change-llp-gt-avatar-wrap">
                  <div className="Change-llp-gt-avatar">
                    <span>{t.initial}</span>
                  </div>
                </div>

                {/* text */}
                <p className="Change-llp-gt-text">{t.text}</p>

                {/* name & role */}
                <h3 className="Change-llp-gt-name">{t.name}</h3>
                <p className="Change-llp-gt-role">{t.role}</p>

                {/* stars */}
                <div className="Change-llp-gt-stars">
                  {Array.from({ length: t.rating }).map((_, i) => (
                    <span key={i}>★</span>
                  ))}
                </div>

                {/* bottom quote */}
                <span className="Change-llp-gt-quote Change-llp-gt-quote-bottom">”</span>
              </article>
            ))}
          </div>

          {/* Right arrow */}
          <button
            className="Change-llp-gt-side-arrow Change-llp-gt-right"
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

export default ChangeLlpTestimonial;
