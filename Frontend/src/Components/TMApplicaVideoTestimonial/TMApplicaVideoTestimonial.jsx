import React, { useRef } from "react";
import "./TMApplicaVideoTestimonial.css";
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

    const card = container.querySelector(".Tm-Applica-vt-card");
    if (!card) return;

    const gap = 24; // must match CSS .Tm-Applica-vt-slider gap
    const cardWidth = card.offsetWidth + gap;

    container.scrollBy({
      left: direction === "next" ? cardWidth : -cardWidth,
      behavior: "smooth",
    });
  };

  // Placeholder videos only — hidden until real ones exist (see utils/videoTestimonials).
  if (!REAL_VIDEOS_READY) return null;

  return (
    <section className="Tm-Applica-vt-section">
      <div className="Tm-Applica-vt-container">
        <h2 className="Tm-Applica-vt-heading">Video Testimonials</h2>
        <p className="Tm-Applica-vt-subtitle">
          Hear directly from our clients about their experience working with us.
        </p>

        <div className="Tm-Applica-vt-slider-wrapper">
          {/* Left arrow */}
          <button
            className="Tm-Applica-vt-side-arrow Tm-Applica-vt-left"
            aria-label="Previous video"
            onClick={() => handleScroll("prev")}
          >
            ❮
          </button>

          {/* Cards slider */}
          <div className="Tm-Applica-vt-slider" ref={sliderRef}>
            {videoTestimonials.map((item, idx) => (
              <article className="Tm-Applica-vt-card" key={idx}>
                <div className="Tm-Applica-vt-video-wrap">
                  <div className="Tm-Applica-vt-video-aspect">
                    <iframe
                      className="Tm-Applica-vt-video"
                      src={item.videoUrl}
                      title={item.name}
                      frameBorder="0"
                      allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share"
                      allowFullScreen
                    ></iframe>
                  </div>
                </div>

                <h3 className="Tm-Applica-vt-name">{item.name}</h3>
                <p className="Tm-Applica-vt-role">{item.role}</p>
              </article>
            ))}
          </div>

          {/* Right arrow */}
          <button
            className="Tm-Applica-vt-side-arrow Tm-Applica-vt-right"
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
