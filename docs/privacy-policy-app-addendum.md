# Privacy policy: draft additions for the Android app (DRAFT, needs the firm's review)

Prepared 2026-11-03. **This is draft wording, not legal advice, and it is NOT live.** It is deliberately kept out of
`Frontend/src/Pages/Policies/PrivacyPolicy.jsx` because anything on `main` ships with the next release tag.

## Why

Play Console's Data safety form asks whether users can request deletion of their data, and Google compares the answer
with the privacy policy. The live policy (`https://legalterminus.com/privacy-policy`) has no section on deletion,
correction or retention, and does not mention the app. The chosen answer is "users can request deletion by email".

## What the live policy already says (so the new text stays consistent)

- Section 5: information is used only to provide services and meet legal obligations; industry-standard security measures.
- Section 6: information is never shared with third parties except as required by law or needed to provide the services.
- Contact block ("Need Assistance?"): `sales21@legalterminus.com`, +91 8280 045 432 / 8280093456.

## Proposed new sections (insert before "7. Policy Updates", which becomes 9)

**7. The Legal Terminus app**
The Legal Terminus Android app lets you sign in to your account and use the same services as the web portal: following
the progress of your services, uploading and viewing documents, messaging our team, and seeing amounts billed and due.
It processes the same information described in this policy, such as your name, email address, phone number, address,
documents you upload, identification numbers you provide for a service (for example PAN, Aadhaar or GST), messages, and
payment status. The app does not show advertisements and does not use an advertising identifier.

**8. Access, correction and deletion**
You can ask us to show you the information we hold about you, to correct it, or to delete your account and the personal
information linked to it. Write to sales21@legalterminus.com from the email address on your account, or call us on the
numbers below, and tell us what you want done. We will confirm your identity before acting. We may need to keep some
records where the law requires us to (for example for statutory filings we made on your behalf); we will tell you what
we are keeping and why.

**9. Policy Updates** (the existing section, renumbered)

## Open points for the firm / legal review (❓)

1. ❓ **Retention:** the policy gives no retention period. If the firm keeps matter files for a fixed number of years,
   say so in section 8; Play and Indian data-protection rules both expect it to be stated honestly.
2. ❓ **Response time:** no deadline is promised above. Add one only if the firm will really meet it.
3. ❓ **Who handles requests:** `sales21@` is a sales mailbox. A named person should own deletion requests.
4. ❓ **Who we share with:** section 6 says "never shared"; the app runs on Google Cloud / Firebase on the firm's behalf.
   If counsel wants service providers named, add them here, and keep the Data safety "shared: no" answer consistent.
5. ❓ **Account deletion in the app:** Play expects an in-app route too for apps with sign-up. Today only an Admin can
   delete an account; a "Request deletion" button that emails the firm would close this gap. Not built.

## Status

Implemented on the branch `chore/privacy-policy-app-deletion` (NOT merged to `main`): sections 7 and 8 added, "Policy Updates" is now
section 9, and `Frontend/tests/e2e/privacy-policy.spec.js` guards it (verified: fails on the current page, passes with the change).
Still needs the firm's wording review (the ❓ points above) before it is merged.

## To publish (needs a release tag, so only on the user's say)

Add the two sections as `policy-section` blocks in `Frontend/src/Pages/Policies/PrivacyPolicy.jsx`, renumber "Policy
Updates", merge to `main`, check on QA, then tag. After that Play's Data safety "deletion request" link can be
`https://legalterminus.com/privacy-policy`.
