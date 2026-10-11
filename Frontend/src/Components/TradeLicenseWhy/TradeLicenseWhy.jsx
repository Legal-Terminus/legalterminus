import React, { useRef } from "react";
import "./TradeLicenseWhy.css";
import { REAL_VIDEOS_READY } from "../../utils/videoTestimonials";

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
];

const TradeLicenseWhy = () => {
  const sliderRef = useRef(null);

  const handleScroll = (direction) => {
    const container = sliderRef.current;
    if (!container) return;

    const card = container.querySelector(".tradewhy-card");
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
    <section className="tradewhy-section">
      <div className="tradewhy-container">
        <h2 className="tradewhy-heading">Why Choose Trade License?</h2>
        <p className="tradewhy-subtitle">
          Hear directly from our clients about their experience and the benefits
          of obtaining a Trade License for smoother business operations.
        </p>

        <div className="tradewhy-slider-wrapper">
          {/* Left arrow */}
          <button
            className="tradewhy-side-arrow tradewhy-left"
            aria-label="Previous video"
            onClick={() => handleScroll("prev")}
          >
            ❮
          </button>

          {/* Cards slider */}
          <div className="tradewhy-slider" ref={sliderRef}>
            {videoTestimonials.map((item, idx) => (
              <article className="tradewhy-card" key={idx}>
                <div className="tradewhy-video-wrap">
                  <div className="tradewhy-video-aspect">
                    <iframe
                      className="tradewhy-video"
                      src={item.videoUrl}
                      title={item.name}
                      frameBorder="0"
                      allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share"
                      allowFullScreen
                    ></iframe>
                  </div>
                </div>

                <h3 className="tradewhy-name">{item.name}</h3>
                <p className="tradewhy-role">{item.role}</p>
              </article>
            ))}
          </div>

          {/* Right arrow */}
          <button
            className="tradewhy-side-arrow tradewhy-right"
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

export default TradeLicenseWhy;
