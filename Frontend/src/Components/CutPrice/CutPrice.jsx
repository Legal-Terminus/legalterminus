/**
 * The struck-through "was" price above a plan's price (E24-S01).
 *
 * The figure comes from the plan — that is, from Website Prices in the portal —
 * and from nowhere else. Shows nothing when the plan has no cut price.
 *
 * `className` is the card's own cut-price style, where it has one. Five cards
 * used to have the figure typed into the page beside this component, so the
 * website showed a cut price the portal did not have, and two of them once the
 * firm entered one (#212). A cut price is never written into a card.
 */
export default function CutPrice({ plan, className }) {
  const was = plan?.oldPrice;
  if (!was) return null;
  const text = typeof was === "number" ? `₹${was.toLocaleString("en-IN")}` : was;
  if (className) return <div className={className}>{text}</div>;
  return (
    <div style={{ color: "#ff3b3b", textDecoration: "line-through", fontSize: "18px", fontWeight: 500, lineHeight: 1.3 }}>
      {text}
    </div>
  );
}
