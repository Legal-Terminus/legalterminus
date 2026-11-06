import { useState } from "react";
import { useChoice, surchargeOf } from "../../utils/pricing";

/**
 * #221 — the state behind <PlanChoice>: which answer is chosen (none at
 * first), the plans repriced for it, and `requireChoice()` for Buy Now.
 *
 *   const ref = useRef(null);                  // on <PlanChoice ref={ref}>: Buy Now focuses it
 *   const pc = usePlanChoice("trademark-application", DEFAULT_CHOICE, ref);
 *   const cards = pc.priced(PLANS);            // price = plan + surcharge
 *   const { ok, option } = pc.requireChoice(); // !ok → asked the customer to choose
 *
 * The repriced figure is only what the card SHOWS; the checkout sends the
 * answer's id and the server adds the surcharge itself.
 */
export function usePlanChoice(productKey, defaultChoice, ref) {
  const choice = useChoice(productKey, defaultChoice);
  const [optionId, setOptionId] = useState(null);
  const [error, setError] = useState("");

  const option = choice?.options?.find((o) => o.id === optionId) ?? null;
  const surcharge = surchargeOf(choice, optionId);

  const choose = (id) => { setOptionId(id); setError(""); };

  /** Plans with the chosen answer's surcharge added — and the cut price with it, so the saving stays the same. */
  const priced = (plans) => plans.map((p) => {
    if (!surcharge) return { ...p, basePrice: p.price };
    return { ...p, basePrice: p.price, price: p.price + surcharge, oldPrice: p.oldPrice ? p.oldPrice + surcharge : p.oldPrice };
  });

  /**
   * Before Buy Now: `{ ok: true, option }` — `option` is the chosen answer
   * (with the question's label), or null when the product asks nothing — or
   * `{ ok: false }` after asking the customer to choose (a message, and focus
   * on the question).
   */
  const requireChoice = () => {
    if (!choice) return { ok: true, option: null };
    if (option) return { ok: true, option: { ...option, label: choice.label } };
    setError(`Please choose ${choice.options.map((o) => o.name).join(" or ")} above to see your price, then continue.`);
    ref.current?.scrollIntoView?.({ behavior: "smooth", block: "center" });
    ref.current?.focus?.({ preventScroll: true });
    return { ok: false };
  };

  return { choice, optionId, option, surcharge, error, choose, priced, requireChoice };
}
