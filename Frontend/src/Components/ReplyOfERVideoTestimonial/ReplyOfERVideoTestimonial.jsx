import React, { useRef } from "react";
import "./ReplyOfERVideoTestimonial.css";
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

    const card = container.querySelector(".Rf-ER-vt-card");
    if (!card) return;

    const gap = 24; // must match CSS .Rf-ER-vt-slider gap
    const cardWidth = card.offsetWidth + gap;

    container.scrollBy({
      left: direction === "next" ? cardWidth : -cardWidth,
      behavior: "smooth",
    });
  };

  // Placeholder videos only — hidden until real ones exist (see utils/videoTestimonials).
  if (!REAL_VIDEOS_READY) return null;

  return (
    <section className="Rf-ER-vt-section">
      <div className="Rf-ER-vt-container">
        <h2 className="Rf-ER-vt-heading">Video Testimonials</h2>
        <p className="Rf-ER-vt-subtitle">
          Hear directly from our clients about their experience working with us.
        </p>

        <div className="Rf-ER-vt-slider-wrapper">
          {/* Left arrow */}
          <button
            className="Rf-ER-vt-side-arrow Rf-ER-vt-left"
            aria-label="Previous video"
            onClick={() => handleScroll("prev")}
          >
            ❮
          </button>

          {/* Cards slider */}
          <div className="Rf-ER-vt-slider" ref={sliderRef}>
            {videoTestimonials.map((item, idx) => (
              <article className="Rf-ER-vt-card" key={idx}>
                <div className="Rf-ER-vt-video-wrap">
                  <div className="Rf-ER-vt-video-aspect">
                    <iframe
                      className="Rf-ER-vt-video"
                      src={item.videoUrl}
                      title={item.name}
                      frameBorder="0"
                      allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share"
                      allowFullScreen
                    ></iframe>
                  </div>
                </div>

                <h3 className="Rf-ER-vt-name">{item.name}</h3>
                <p className="Rf-ER-vt-role">{item.role}</p>
              </article>
            ))}
          </div>

          {/* Right arrow */}
          <button
            className="Rf-ER-vt-side-arrow Rf-ER-vt-right"
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
