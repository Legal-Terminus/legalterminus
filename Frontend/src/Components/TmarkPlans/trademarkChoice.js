/**
 * #221 — the trademark plans' required question, as the page shows it until
 * the catalogue arrives. The catalogue (Website Prices) is the source of the
 * surcharge; this ₹2,500 is only the fallback for display. Shared by both
 * pages that sell `trademark-application`.
 */
export const TRADEMARK_CHOICE = {
  label: "User type",
  options: [
    { id: "proposed", name: "Proposed to be Used", surcharge: 0 },
    { id: "prior-user", name: "Prior User", surcharge: 2500 },
  ],
};

/** The page's own words under each answer. */
export const TRADEMARK_CHOICE_HINTS = {
  proposed: "You have not started using this trademark yet.",
  "prior-user": "You are already using this trademark for your goods or services.",
};
