import React, { useRef } from "react";
import "./ParttoPriVideoTestimonial.css";
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

    const card = container.querySelector(".Partnership-to-PLC-vtcard");
    if (!card) return;

    const gap = 24; // must match CSS .Partnership-to-PLC-vtslider gap
    const cardWidth = card.offsetWidth + gap;

    container.scrollBy({
      left: direction === "next" ? cardWidth : -cardWidth,
      behavior: "smooth",
    });
  };

  // Placeholder videos only — hidden until real ones exist (see utils/videoTestimonials).
  if (!REAL_VIDEOS_READY) return null;

  return (
    <section className="Partnership-to-PLC-vtsection">
      <div className="Partnership-to-PLC-vtcontainer">
        <h2 className="Partnership-to-PLC-vtheading">Video Testimonials</h2>
        <p className="Partnership-to-PLC-vtsubtitle">
          Hear directly from our clients about their experience working with us.
        </p>

        <div className="Partnership-to-PLC-vtslider-wrapper">
          {/* Left arrow */}
          <button
            className="Partnership-to-PLC-vtside-arrow Partnership-to-PLC-vtleft"
            aria-label="Previous video"
            onClick={() => handleScroll("prev")}
          >
            ❮
          </button>

          {/* Cards slider */}
          <div className="Partnership-to-PLC-vtslider" ref={sliderRef}>
            {videoTestimonials.map((item, idx) => (
              <article className="Partnership-to-PLC-vtcard" key={idx}>
                <div className="Partnership-to-PLC-vtvideo-wrap">
                  <div className="Partnership-to-PLC-vtvideo-aspect">
                    <iframe
                      className="Partnership-to-PLC-vtvideo"
                      src={item.videoUrl}
                      title={item.name}
                      frameBorder="0"
                      allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share"
                      allowFullScreen
                    ></iframe>
                  </div>
                </div>

                <h3 className="Partnership-to-PLC-vtname">{item.name}</h3>
                <p className="Partnership-to-PLC-vtrole">{item.role}</p>
              </article>
            ))}
          </div>

          {/* Right arrow */}
          <button
            className="Partnership-to-PLC-vtside-arrow Partnership-to-PLC-vtright"
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
