import React, { useRef } from "react";
import "./LlptoPriVideoTestimonial.css";
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
  // add more items as needed
];

const VideoTestimonials = () => {
  const sliderRef = useRef(null);

  const handleScroll = (direction) => {
    const container = sliderRef.current;
    if (!container) return;

    const card = container.querySelector(".LLP-to-PLC-vt-card");
    if (!card) return;

    const gap = 24; // must match CSS .LLP-to-PLC-vt-slider gap
    const cardWidth = card.offsetWidth + gap;

    container.scrollBy({
      left: direction === "next" ? cardWidth : -cardWidth,
      behavior: "smooth",
    });
  };

  // Placeholder videos only — hidden until real ones exist (see utils/videoTestimonials).
  if (!REAL_VIDEOS_READY) return null;

  return (
    <section className="LLP-to-PLC-vt-section">
      <div className="LLP-to-PLC-vt-container">
        <h2 className="LLP-to-PLC-vt-heading">Video Testimonials</h2>
        <p className="LLP-to-PLC-vt-subtitle">
          Hear directly from our clients about their experience working with us.
        </p>

        <div className="LLP-to-PLC-vt-slider-wrapper">
          {/* Left arrow */}
          <button
            className="LLP-to-PLC-vt-side-arrow LLP-to-PLC-vt-left"
            aria-label="Previous video"
            onClick={() => handleScroll("prev")}
          >
            ❮
          </button>

          {/* Cards slider */}
          <div className="LLP-to-PLC-vt-slider" ref={sliderRef}>
            {videoTestimonials.map((item, idx) => (
              <article className="LLP-to-PLC-vt-card" key={idx}>
                <div className="LLP-to-PLC-vt-video-wrap">
                  <div className="LLP-to-PLC-vt-video-aspect">
                    <iframe
                      className="LLP-to-PLC-vt-video"
                      src={item.videoUrl}
                      title={item.name}
                      frameBorder="0"
                      allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share"
                      allowFullScreen
                    ></iframe>
                  </div>
                </div>

                <h3 className="LLP-to-PLC-vt-name">{item.name}</h3>
                <p className="LLP-to-PLC-vt-role">{item.role}</p>
              </article>
            ))}
          </div>

          {/* Right arrow */}
          <button
            className="LLP-to-PLC-vt-side-arrow LLP-to-PLC-vt-right"
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
