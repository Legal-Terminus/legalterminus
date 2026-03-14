import React, { useRef } from "react";
import "./TrademarktoOppositionWhy.css";

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

    const card = container.querySelector(".tlwhy-card");
    if (!card) return;

    const gap = 24;
    const cardWidth = card.offsetWidth + gap;

    container.scrollBy({
      left: direction === "next" ? cardWidth : -cardWidth,
      behavior: "smooth",
    });
  };

  return (
    <section className="tlwhy-section">
      <div className="tlwhy-container">
        <h2 className="tlwhy-heading">Video Testimonials</h2>
        <p className="tlwhy-subtitle">
          Hear directly from our clients about their experience working with us.
        </p>

        <div className="tlwhy-slider-wrapper">
          <button
            className="tlwhy-side-arrow tlwhy-left"
            aria-label="Previous video"
            onClick={() => handleScroll("prev")}
          >
            ❮
          </button>

          <div className="tlwhy-slider" ref={sliderRef}>
            {videoTestimonials.map((item, idx) => (
              <article className="tlwhy-card" key={idx}>
                <div className="tlwhy-video-wrap">
                  <div className="tlwhy-video-aspect">
                    <iframe
                      className="tlwhy-video"
                      src={item.videoUrl}
                      title={item.name}
                      frameBorder="0"
                      allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share"
                      allowFullScreen
                    ></iframe>
                  </div>
                </div>

                <h3 className="tlwhy-name">{item.name}</h3>
                <p className="tlwhy-role">{item.role}</p>
              </article>
            ))}
          </div>

          <button
            className="tlwhy-side-arrow tlwhy-right"
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
