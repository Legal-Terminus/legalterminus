import React from "react";
import "./TrademarkTypes.css";

const TYPES = [
  {
    title: "Name Mark",
    desc: "You can register your first name or surname or complete name for trademark so that no one can copy your name.",
    example: "Name of Shah Rukh Khan",
  },
  {
    title: "Invented Word",
    desc: "An invented word trademark registration is when you protect a completely unique, made-up word as your brand name. Since the word is original and doesn't exist in any dictionary.",
    example: "Zomato, Swiggy",
  },
  {
    title: "Letters or Numerical Mark",
    desc: "You can register letters, numbers, or a combination of both as a trademark if they are unique and distinctive. This type of trademark protects combinations that represent your brand, preventing others from using them in a similar context.",
    example: "hp",
  },
  {
    title: "Device Mark",
    desc: "A Device Mark refers to a trademark that includes a logo, design, symbol, or any graphic element that uniquely represents your brand. Unlike word marks, which focus solely on the text, device marks emphasize the visual components associated with your brand.",
    example: "Allen Solly",
  },
  {
    title: "Monogram Mark",
    desc: "A Monogram Trademark is a logo or symbol consisting of letters (often initials) that are designed in a stylized, interconnected manner to represent a brand.",
    example: "Legal Terminus LT",
  },
  {
    title: "Colour Mark",
    desc: "A Colour Mark is a trademark that protects a specific color or a combination of colors that is used uniquely by a brand. The color(s) must be associated with the brand and serve as an identifier for the brand's goods or services.",
    example: "Coca-Cola Red",
  },
  {
    title: "Shape Mark",
    desc: "A Shape Mark is a type of trademark that protects the product shape or packaging shape or store layout of a product or its container.",
    example: "Appy Fizz",
  },
  {
    title: "Sound Mark",
    desc: "A Sound Mark is a type of trademark that protects a unique sound used to represent a brand or product. These marks can include jingles, musical notes, or other distinctive sounds that are strongly associated with a brand.",
    example: "Tune of Nokia",
  },
  {
    title: "Signature Mark",
    desc: "A Signature Trademark is a type of personalized signature that is used as a distinctive brand identifier. This could be the signature of the founder, CEO, or any significant figure associated with the brand.",
    example: "Signature of Sachin Tendulkar",
  },
];

const TrademarkTypes = () => {
  return (
    <section className="tmty-section">
      <div className="tmty-container">
        <h2 className="tmty-heading">Types of Trademark Registration</h2>
        <p className="tmty-intro">
          In India, trademarks play a crucial role in protecting the identity of businesses and their
          products or services. Governed by the Trademark Act, 1999, trademarks can include various
          elements such as logos, shapes, sounds, or designs that make a brand unique. These trademarks
          safeguard businesses by distinguishing their goods or services from others and providing legal
          protection against unauthorized use. This helps businesses maintain their uniqueness, prevent
          imitation, and avoid infringement, ensuring their brand remains secure in a competitive market.
        </p>

        <div className="tmty-grid">
          {TYPES.map((t) => (
            <div className="tmty-card" key={t.title}>
              <h3 className="tmty-title">{t.title}</h3>
              <p className="tmty-desc">{t.desc}</p>
              <p className="tmty-example">
                <strong>Example:</strong> {t.example}
              </p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default TrademarkTypes;
