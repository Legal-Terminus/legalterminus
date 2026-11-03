# Play Console: store listing and declarations

## State on 2026-11-03 (entered into Play Console through Safari, with the user's go-ahead)

Dashboard: **10 of 11 setup tasks complete. Nothing has been sent for review and no release has been created.**

| Item | State |
|---|---|
| Privacy policy URL | Done (`https://legalterminus.com/privacy-policy`) |
| Sign-in details | Done: client reviewer login, full-access box ticked (client login only, chosen by the user) |
| Ads / Advertising ID | Done: No / No (checked against the built APK: no ad libraries, no AD_ID permission) |
| Government apps, Financial features, Health apps | Done: No / no financial features / no health features |
| Target audience | Done: 18 and over |
| App category and contact details | Done and published: Business, `sales21@legalterminus.com`, `https://legalterminus.com` |
| Store listing (default, en-IN) | Done: name, short and full description, icon, feature graphic, 3 phone screenshots; AI-asset declaration "Don't label assets" |
| Data safety | Done, saved (imported from Play's own CSV, then read back): collected not shared, 9 data types, encrypted in transit, deletion on request |
| **Content rating** | **NOT done: the IARC questionnaire needs a person to accept IARC's Terms of Use** (email `sales21@legalterminus.com`, category "All other app types") |

**Gate before "Send for review":** Data safety's deletion answer and both deletion links point to the privacy policy,
which does **not yet** mention deletion. Publish the additions in `docs/privacy-policy-app-addendum.md` (needs a release tag and
the firm's wording review) first, or Google will see a policy that contradicts the form.

## Original draft for review (kept for reference)

Prepared 2026-11-03 for the Legal Terminus Android app (`com.legalterminus.app`). Paste from here into Play
Console. **Everything marked ❓ is a guess from the code or docs and must be confirmed by someone who knows
the business before it is submitted**; Play compares these answers with what the app really does.

## Files

| What | Where |
|---|---|
| App bundle for Play (production values, versionCode 3, 1.0.0) | `~/lt-android-release/out/legalterminus-1.0.0-prod-vc3.aab` |
| Phone screenshots, 1080×2160 (Play allows at most 2:1), QA test data only | `~/lt-android-release/play-assets/phone-1-ADMIN.png`, `phone-2-TEAM.png`, `phone-3-CLIENT.png` |
| App icon 512×512 PNG | `~/lt-android-release/play-assets/icon-512.png` (made from `MobileApp/assets/icon-only.png`) |
| Feature graphic 1024×500 (JPEG, no transparency) | `~/lt-android-release/play-assets/feature-graphic-1024x500.jpg` (the logo lockup on white: plain but valid; a designer can replace it) |

The client screenshot shows an empty account ("0" everywhere); a client with a few services would sell the
app better. Take one from a QA client that has matters. Do not use production data in screenshots.

## Main store listing

- **App name** (14/30): Legal Terminus
- **Short description** (79/80): Follow your legal and compliance services, documents and payments in one place.
- **Full description** (749/4000):

```
Legal Terminus brings your legal and compliance work into one app.

If you are a client, you can:
• See each of your services, such as company registration and trademark work, and exactly which step it is on
• Upload documents and open the ones we share with you
• Message the Legal Terminus team on a service and read their replies
• See what has been billed and what is due
• Get a notification when something needs you

If you are part of the Legal Terminus team, you can follow matters, tasks, leads and reports from your phone.

Sign in with your email and password, an email sign-in link, or your Google account. Your account is created by the firm or by signing up, and what you see depends on your role.

Questions: sales21@legalterminus.com
```
  The contact address is `sales21@legalterminus.com` (chosen by the user 2026-11-03; it is the address on the website).
- **Category:** Business. **Tags:** pick Productivity / Business tools if offered.
- **Contact:** email ❓, website `https://legalterminus.com`, phone optional.
- **Release notes (en-IN)** (163/500): First release of the Legal Terminus app: sign in, follow your services step by step, upload and view documents, message the team, and see payments and amounts due.

## App content

- **Privacy policy URL:** `https://legalterminus.com/privacy-policy` (the website has this route; ❓ open it and
  confirm it shows the real policy and that it mentions the app, account data, documents and payments).
- **App access:** *All or some functionality is restricted.* Provide a reviewer login. The production reviewer
  account **exists** (created 2026-11-03): `play.reviewer@legalterminus.com`, client role, no data. The password is
  in `~/lt-android-release/keys/PLAY_REVIEWER.txt`; type it into the Play form, never into the repo.
  Instructions text: "Sign in with the email and password below. The account is a client account with no real data."
- **Ads:** No ads. **Advertising ID:** not used.
- **Target audience:** 18 and over only. **News app:** No. **Government app:** No (private firm).
  **COVID-19 / health app:** No.
- **Financial features:** ❓ The app shows what is billed and what is due; payment itself happens on the website
  through a payment gateway. If that is still true, answer that the app has no financial features
  (no loans, banking, payments or trading in the app). Check with the team before ticking.
- **Content rating (IARC questionnaire), category "Utility / Productivity":** violence, sexual content, language,
  controlled substances, gambling: all **No**. ❓ User interaction: **Yes**, users exchange messages with the
  firm inside a service. Shares location: **No**. Digital purchases in the app: **No** ❓.

## Data safety (what the app handles; ❓ confirm each row)

| Data | Collected | Why | Shared | Optional |
|---|---|---|---|---|
| Name, email address, phone number, address | Yes | Account and service delivery | No ❓ | Required |
| User IDs (sign-in account id) | Yes | Account | No | Required |
| Government ID numbers (PAN / Aadhaar / GST) in forms and uploaded documents | Yes ❓ (Play has no separate category; likely "Other info") | Service delivery | No | Required where a service needs it |
| Files and documents the user uploads | Yes | Service delivery | No | Optional |
| Messages sent inside a service | Yes | Service delivery | No | Optional |
| Payment status and amounts billed or due | Yes ("Purchase history" / "Other financial info") ❓ | Service delivery | No | Required |

- **Encrypted in transit:** Yes (HTTPS only). **Data at rest:** held in Google Cloud (Firebase) by the firm.
  "Shared" is No because Google Cloud and the sign-in provider act on the firm's behalf (service providers);
  ❓ confirm no analytics or advertising SDK is added later.
- **Can users ask for their data to be deleted?** ❓ **Decision D2 is still open.** Today only an Admin can delete an
  account. Play asks apps that let people create an account to offer deletion in the app and a web page. Until that
  exists, the honest answer is a deletion *request* process (an email address on the privacy policy page); decide this
  before submitting, because the answer must match the privacy policy.
- **Permissions in the app:** the build requests only `INTERNET` and `ACCESS_NETWORK_STATE` ❓ (confirm in the merged
  manifest of the production bundle).

## What this draft does not fix

- A **production reviewer account** and the **deletion answer (D2)** are decisions and production changes for the firm.
- The server side the app needs on production (API CORS for `https://localhost`, bucket CORS) is **not done**
  and is not part of this file; see `docs/android-release-plan.md`. A build published to the Production track
  before that is live would show real users errors on every screen that loads data.
- The team-member Home screen shows a blank gap where other roles have a heading (seen on the emulator,
  2026-11-03); it may be intended. Look at it before screenshots are chosen.
