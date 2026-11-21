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

/** Selected when the page opens (7 Nov): it adds nothing, and most applicants are not yet using their mark. */
export const TRADEMARK_DEFAULT_OPTION = "proposed";

/**
 * The page's own words under each answer. Prior User says what its surcharge
 * pays for: an application claiming earlier use must carry a user affidavit
 * with evidence of that use (Trade Marks Rules, 2017, rule 25).
 */
export const TRADEMARK_CHOICE_HINTS = {
  proposed: "You have not started using this trademark yet.",
  "prior-user": "You are already using this trademark. Includes preparing your user affidavit and evidence of use.",
};
