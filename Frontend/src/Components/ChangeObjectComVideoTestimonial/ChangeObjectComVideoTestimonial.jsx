import React, { useRef } from "react";
import "./ChangeObjectComVideoTestimonial.css";

const videoTestimonials = [
  {
    name: "Kirti Ranjan Sahu",
    role: "Proprietor of Keshab Jewellers",
    videoUrl: "https://www.youtube.com/embed/dQw4w9WgXcQ",
  },
  {
    name: "Gobinda Chandra Mishra",
    role: "Influencer",
    videoUrl: "https://www.youtube.com/embed/ysz5PUM2z2A",
  },
  {
    name: "Babaji Samal",
    role: "MD, AppsSys Technosoft",
    videoUrl: "https://www.youtube.com/embed/jNQXAC9IVRw",
  },
  {
    name: "Pritam Rath",
    role: "Director, Stabdha Utility Insights",
    videoUrl: "https://www.youtube.com/embed/oHg5SJYRHA0",
  },
  // add more items as needed
];

const ChangeObjectComVideoTestimonial = () => {
  const sliderRef = useRef(null);

  const handleScroll = (direction) => {
    const container = sliderRef.current;
    if (!container) return;

    const card = container.querySelector(".Change-ob-vt-card");
    if (!card) return;

    const gap = 24; // must match CSS .Change-ob-vt-slider gap
    const cardWidth = card.offsetWidth + gap;

    container.scrollBy({
      left: direction === "next" ? cardWidth : -cardWidth,
      behavior: "smooth",
    });
  };

  return (
    <section className="Change-ob-vt-section">
      <div className="Change-ob-vt-container">
        <h2 className="Change-ob-vt-heading">Video Testimonials</h2>
        <p className="Change-ob-vt-subtitle">
          Hear directly from our clients about their experience working with us.
        </p>

        <div className="Change-ob-vt-slider-wrapper">
          {/* Left arrow */}
          <button
            className="Change-ob-vt-side-arrow Change-ob-vt-left"
            aria-label="Previous video"
            onClick={() => handleScroll("prev")}
          >
            ❮
          </button>

          {/* Cards slider */}
          <div className="Change-ob-vt-slider" ref={sliderRef}>
            {videoTestimonials.map((item, idx) => (
              <article className="Change-ob-vt-card" key={idx}>
                <div className="Change-ob-vt-video-wrap">
                  <div className="Change-ob-vt-video-aspect">
                    <iframe
                      className="Change-ob-vt-video"
                      src={item.videoUrl}
                      title={item.name}
                      frameBorder="0"
                      allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share"
                      allowFullScreen
                    ></iframe>
                  </div>
                </div>

                <h3 className="Change-ob-vt-name">{item.name}</h3>
                <p className="Change-ob-vt-role">{item.role}</p>
              </article>
            ))}
          </div>

          {/* Right arrow */}
          <button
            className="Change-ob-vt-side-arrow Change-ob-vt-right"
            aria-label="Next video"
            onClick={() => handleScroll("next")}
          >
            ❯
          </button>
        </div>
      </div>
    </section>
  );
};

export default ChangeObjectComVideoTestimonial;
