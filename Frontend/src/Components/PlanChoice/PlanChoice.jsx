import { forwardRef } from "react";
import { inr } from "../../utils/pricing";
import "./PlanChoice.css";

/**
 * #221 — a product's one required question, shown ABOVE its plan cards (the
 * trademark page's "Proposed to be Used" / "Prior User"). Nothing is chosen
 * until the customer chooses: Buy Now asks for an answer first, so nobody pays
 * the wrong price because a default was picked for them.
 *
 * `choice` is the catalogue's `{ label, options: [{ id, name, surcharge }] }`.
 * `hints` are the page's own words under each answer, by answer id.
 * `error` is shown when Buy Now was pressed with nothing chosen.
 */
const PlanChoice = forwardRef(function PlanChoice({ choice, value, onChange, hints = {}, error = "", idPrefix = "plan-choice" }, ref) {
  if (!choice) return null;
  const errorId = `${idPrefix}-error`;
  return (
    <fieldset
      ref={ref}
      tabIndex={-1}
      className={`plan-choice${error ? " plan-choice--error" : ""}`}
      aria-describedby={error ? errorId : undefined}
    >
      <legend className="plan-choice-legend">
        Choose your {choice.label.toLowerCase()} <span className="plan-choice-required">(required)</span>
      </legend>
      <div className="plan-choice-options">
        {choice.options.map((o) => {
          const id = `${idPrefix}-${o.id}`;
          const checked = value === o.id;
          return (
            <label key={o.id} htmlFor={id} className={`plan-choice-option${checked ? " is-checked" : ""}`}>
              <input
                id={id}
                type="radio"
                name={idPrefix}
                value={o.id}
                checked={checked}
                onChange={() => onChange(o.id)}
              />
              <span className="plan-choice-text">
                <span className="plan-choice-name">{o.name}</span>
                <span className="plan-choice-price">{o.surcharge > 0 ? `+ ${inr(o.surcharge)} on every plan` : "Plan price as shown"}</span>
                {hints[o.id] && <span className="plan-choice-hint">{hints[o.id]}</span>}
              </span>
            </label>
          );
        })}
      </div>
      {error && <p id={errorId} role="alert" className="plan-choice-error">{error}</p>}
    </fieldset>
  );
});

export default PlanChoice;
