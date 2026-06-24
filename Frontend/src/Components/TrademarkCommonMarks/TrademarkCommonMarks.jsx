import React from "react";
import "./TrademarkCommonMarks.css";

/* Legal Terminus "LT" monogram used as the device-mark example */
const LTMark = ({ size = 92 }) => (
  <svg viewBox="0 0 64 64" width={size} height={size} aria-hidden="true">
    <defs>
      <linearGradient id="lt-mark-grad" x1="0" y1="0" x2="1" y2="1">
        <stop offset="0" stopColor="#16a34a" />
        <stop offset="1" stopColor="#4ade80" />
      </linearGradient>
    </defs>
    <rect x="4" y="4" width="56" height="56" rx="16" fill="url(#lt-mark-grad)" />
    <text
      x="32"
      y="43"
      textAnchor="middle"
      fontSize="27"
      fontWeight="800"
      fill="#ffffff"
      fontFamily="Poppins, sans-serif"
      letterSpacing="1"
    >
      LT
    </text>
  </svg>
);

const Wordmark = () => (
  <>
    <span className="tmcm-word-accent">LEGAL</span> TERMINUS
  </>
);

const MARKS = [
  {
    title: "Word Mark",
    sub: "(also known as brand name)",
    example: <div className="tmcm-word"><Wordmark /></div>,
    desc: "A Word Mark is a unique name for your product or service. Registering it gives you ownership of the word in plain text.",
  },
  {
    title: "Logo",
    sub: "(also known as design and device mark)",
    example: <LTMark size={96} />,
    desc: "A Logo refers to a unique visual symbol, artwork, or design that represents your brand.",
  },
  {
    title: "Composite Mark",
    sub: "(Word + Logo)",
    example: (
      <div className="tmcm-composite">
        <LTMark size={80} />
        <span className="tmcm-composite-word"><Wordmark /></span>
      </div>
    ),
    desc: "A Composite Mark combines both a brand name and a logo. It includes the text (word mark) along with a unique symbol or design.",
  },
];

const TrademarkCommonMarks = () => {
  return (
    <section className="tmcm-section">
      <div className="tmcm-container">
        <h2 className="tmcm-heading">Most Commonly Filed Trademarks</h2>

        <div className="tmcm-grid">
          {MARKS.map((m) => (
            <div className="tmcm-card" key={m.title}>
              <div className="tmcm-head">
                <h3 className="tmcm-title">{m.title}</h3>
                <p className="tmcm-sub">{m.sub}</p>
              </div>

              <div className="tmcm-example">{m.example}</div>

              <p className="tmcm-desc">{m.desc}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default TrademarkCommonMarks;
