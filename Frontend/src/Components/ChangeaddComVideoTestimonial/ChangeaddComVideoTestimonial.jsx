import React, { useRef } from "react";
import "./ChangeaddComVideoTestimonial.css";

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

const VideoTestimonials = () => {
  const sliderRef = useRef(null);

  const handleScroll = (direction) => {
    const container = sliderRef.current;
    if (!container) return;

    const card = container.querySelector(".Change-add-com-vt-card");
    if (!card) return;

    const gap = 24; // must match CSS .Change-add-com-vt-slider gap
    const cardWidth = card.offsetWidth + gap;

    container.scrollBy({
      left: direction === "next" ? cardWidth : -cardWidth,
      behavior: "smooth",
    });
  };

  return (
    <section className="Change-add-com-vt-section">
      <div className="Change-add-com-vt-container">
        <h2 className="Change-add-com-vt-heading">Video Testimonials</h2>
        <p className="Change-add-com-vt-subtitle">
          Hear directly from our clients about their experience working with us.
        </p>

        <div className="Change-add-com-vt-slider-wrapper">
          {/* Left arrow */}
          <button
            className="Change-add-com-vt-side-arrow Change-add-com-vt-left"
            aria-label="Previous video"
            onClick={() => handleScroll("prev")}
          >
            ❮
          </button>

          {/* Cards slider */}
          <div className="Change-add-com-vt-slider" ref={sliderRef}>
            {videoTestimonials.map((item, idx) => (
              <article className="Change-add-com-vt-card" key={idx}>
                <div className="Change-add-com-vt-video-wrap">
                  <div className="Change-add-com-vt-video-aspect">
                    <iframe
                      className="Change-add-com-vt-video"
                      src={item.videoUrl}
                      title={item.name}
                      frameBorder="0"
                      allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share"
                      allowFullScreen
                    ></iframe>
                  </div>
                </div>

                <h3 className="Change-add-com-vt-name">{item.name}</h3>
                <p className="Change-add-com-vt-role">{item.role}</p>
              </article>
            ))}
          </div>

          {/* Right arrow */}
          <button
            className="Change-add-com-vt-side-arrow Change-add-com-vt-right"
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

export default VideoTestimonials;
