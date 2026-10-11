import React, { useRef } from "react";
import "./FoodLicenseWhy.css";
import { REAL_VIDEOS_READY } from "../../utils/videoTestimonials";

const videoTestimonials = [
  {
    name: "Rohit Mehta",
    role: "Restaurant Owner",
    videoUrl: "https://www.youtube.com/embed/dQw4w9WgXcQ",
  },
  {
    name: "Priya Desai",
    role: "Founder, HealthyBite Foods",
    videoUrl: "https://www.youtube.com/embed/ysz5PUM2z2A",
  },
  {
    name: "Ankit Sharma",
    role: "Director, SpiceHub Kitchens",
    videoUrl: "https://www.youtube.com/embed/jNQXAC9IVRw",
  },
  {
    name: "Simran Kaur",
    role: "Home Baker",
    videoUrl: "https://www.youtube.com/embed/oHg5SJYRHA0",
  },
];

const FoodLicenseWhy = () => {
  const sliderRef = useRef(null);

  const handleScroll = (direction) => {
    const container = sliderRef.current;
    if (!container) return;

    const card = container.querySelector(".foodwhy-card");
    if (!card) return;

    const gap = 24; // matches CSS gap
    const cardWidth = card.offsetWidth + gap;

    container.scrollBy({
      left: direction === "next" ? cardWidth : -cardWidth,
      behavior: "smooth",
    });
  };

  // Placeholder videos only — hidden until real ones exist (see utils/videoTestimonials).
  if (!REAL_VIDEOS_READY) return null;

  return (
    <section className="foodwhy-section">
      <div className="foodwhy-container">
        <h2 className="foodwhy-heading">Why Choose a Food License (FSSAI)?</h2>
        <p className="foodwhy-subtitle">
          Hear directly from our clients about their experience and the benefits
          of obtaining an FSSAI Food License for building trust and expanding their food business legally.
        </p>

        <div className="foodwhy-slider-wrapper">
          {/* Left arrow */}
          <button
            className="foodwhy-side-arrow foodwhy-left"
            aria-label="Previous video"
            onClick={() => handleScroll("prev")}
          >
            ❮
          </button>

          {/* Cards slider */}
          <div className="foodwhy-slider" ref={sliderRef}>
            {videoTestimonials.map((item, idx) => (
              <article className="foodwhy-card" key={idx}>
                <div className="foodwhy-video-wrap">
                  <div className="foodwhy-video-aspect">
                    <iframe
                      className="foodwhy-video"
                      src={item.videoUrl}
                      title={item.name}
                      frameBorder="0"
                      allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share"
                      allowFullScreen
                    ></iframe>
                  </div>
                </div>

                <h3 className="foodwhy-name">{item.name}</h3>
                <p className="foodwhy-role">{item.role}</p>
              </article>
            ))}
          </div>

          {/* Right arrow */}
          <button
            className="foodwhy-side-arrow foodwhy-right"
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

export default FoodLicenseWhy;
