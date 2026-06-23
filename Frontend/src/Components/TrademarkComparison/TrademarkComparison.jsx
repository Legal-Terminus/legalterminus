import React from "react";
import "./TrademarkComparison.css";

const ROWS = [
  {
    aspect: "What is it?",
    patent: "A protection that allows inventors exclusive rights to their inventions for a set period.",
    trademark: "A symbol, word, or phrase that identifies and distinguishes products or services of one company from others.",
    copyright: "Legal right granted to creators of original works of creative expression.",
  },
  {
    aspect: "Protection for",
    patent: "New inventions including technologies, processes, or any new and useful improvements.",
    trademark: "Brand names, logos, slogans, and other marketing devices that distinguish goods and services.",
    copyright: "Literary, musical, dramatic, and artistic works like books, music, movies, and paintings.",
  },
  {
    aspect: "Duration",
    patent: "Typically, 20 years from the filing date.",
    trademark: "Indefinite, as long as the trademark is in use and renewal fees are paid.",
    copyright: "Life of the author plus 60 years",
  },
  {
    aspect: "Eligibility",
    patent: "Must be new, useful, and non-obvious.",
    trademark: "Must be distinctive and not merely descriptive or generic.",
    copyright: "Must be original and fixed in a tangible form.",
  },
  {
    aspect: "Purpose",
    patent: "To encourage and reward innovation by providing economic incentive for new inventions.",
    trademark: "To help consumers identify and choose products or services based on known qualities and brand reputation.",
    copyright: "To promote creativity by allowing creators to control and profit from their original works.",
  },
  {
    aspect: "Example",
    patent: "A new type of coffee maker that brews coffee twice as fast as standard machines.",
    trademark: "A well-known sportswear brand's swoosh logo, which helps consumers immediately recognise its products.",
    copyright: "A novel you write and publish, protected so others can't copy or sell it without your consent.",
  },
];

const TrademarkComparison = () => {
  return (
    <section className="tmcomp-section">
      <div className="tmcomp-container">
        <h2 className="tmcomp-heading">
          Differences Between Patents, Trademarks, and Copyrights: Simple Explanations with Examples
        </h2>

        <div className="tmcomp-table-wrap">
          <table className="tmcomp-table">
            <thead>
              <tr>
                <th>Aspect</th>
                <th>Patent</th>
                <th>Trademark</th>
                <th>Copyright</th>
              </tr>
            </thead>
            <tbody>
              {ROWS.map((row) => (
                <tr key={row.aspect}>
                  <td className="tmcomp-aspect">{row.aspect}</td>
                  <td>{row.patent}</td>
                  <td>{row.trademark}</td>
                  <td>{row.copyright}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </section>
  );
};

export default TrademarkComparison;
