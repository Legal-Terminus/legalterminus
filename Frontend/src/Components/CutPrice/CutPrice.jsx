/**
 * The struck-through "was" price above a plan's price (E24-S01).
 *
 * Nine pricing cards were built without one, so a cut price set in the portal
 * had nowhere to appear. This draws it for them; cards that already have their
 * own styled cut price keep it. Shows nothing when the plan has no cut price.
 */
export default function CutPrice({ plan }) {
  const was = plan?.oldPrice;
  if (!was) return null;
  return (
    <div style={{ color: "#ff3b3b", textDecoration: "line-through", fontSize: "18px", fontWeight: 500, lineHeight: 1.3 }}>
      {typeof was === "number" ? `₹${was.toLocaleString("en-IN")}` : was}
    </div>
  );
}
