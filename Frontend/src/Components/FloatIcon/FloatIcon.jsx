import React, { useState, useEffect } from "react";
import "./FloatIcon.css";

const FloatIcon = () => {
  const [open, setOpen] = useState(false);
  const [userInteracted, setUserInteracted] = useState(false);

  /* AUTO OPEN / CLOSE EVERY 3 SECONDS */
  useEffect(() => {
    if (userInteracted) return;

    const interval = setInterval(() => {
      setOpen(prev => !prev);
    }, 3000); // 3 seconds

    return () => clearInterval(interval);
  }, [userInteracted]);

  /* MANUAL TOGGLE */
  const handleToggle = () => {
    setUserInteracted(true); // stop auto animation
    setOpen(!open);
  };

  return (
    <div className={`float-icons ${open ? "open" : ""}`}>

      {/* WhatsApp */}
      <a
        href="https://wa.me/918280008183"
        target="_blank"
        rel="noopener noreferrer"
        className="float-icon whatsapp"
        aria-label="Chat on WhatsApp"
      >
        <svg viewBox="0 0 32 32">
          <path d="M19.11 17.44c-.27-.14-1.6-.79-1.85-.88-.25-.09-.43-.14-.61.14-.18.27-.7.88-.86 1.06-.16.18-.32.2-.59.07-.27-.14-1.15-.42-2.19-1.34-.81-.72-1.36-1.61-1.52-1.88-.16-.27-.02-.42.12-.56.12-.12.27-.32.41-.48.14-.16.18-.27.27-.45.09-.18.05-.34-.02-.48-.07-.14-.61-1.47-.84-2.01-.22-.53-.44-.46-.61-.47h-.52c-.18 0-.48.07-.73.34-.25.27-.96.94-.96 2.29s.99 2.66 1.13 2.84c.14.18 1.95 2.98 4.73 4.18z"/>
          <path d="M16.04 2.4c-7.45 0-13.52 6.07-13.52 13.52 0 2.38.62 4.69 1.79 6.72L2 30l7.54-2.28a13.46 13.46 0 006.5 1.67c7.45 0 13.52-6.07 13.52-13.52S23.49 2.4 16.04 2.4z"/>
        </svg>
      </a>

      {/* Call */}
      <a
        href="tel:+919999999999"
        className="float-icon call"
        aria-label="Call Us"
      >
        <svg viewBox="0 0 24 24">
          <path d="M6.62 10.79a15.05 15.05 0 006.59 6.59l2.2-2.2a1 1 0 011.01-.24c1.12.37 2.33.57 3.58.57a1 1 0 011 1V20a1 1 0 01-1 1C10.85 21 3 13.15 3 3a1 1 0 011-1h3.5a1 1 0 011 1c0 1.25.2 2.46.57 3.58a1 1 0 01-.25 1.01l-2.2 2.2z"/>
        </svg>
      </a>

      {/* MAIN BUTTON */}
      <button
        className="float-icon main"
        onClick={handleToggle}
        aria-label="Open Contact Options"
      >
        <span>{open ? "✕" : "☎"}</span>
      </button>

    </div>
  );
};

export default FloatIcon;
