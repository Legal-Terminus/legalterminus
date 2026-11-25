# Store listing: Google Play and the App Store

The one text for both stores (owner, 2026-11-21: "more attractive and compelling for clients, and
talk about Legal Terminus offerings"). Paste from here; change it here first. Replaces the listing
text in `docs/play-store-listing.md`, whose declarations (data safety, content rating, app access)
still apply.

**Claims.** Every figure is word for word what the live website says (checked 2026-11-21 on
`/company-registration-consultancy-in-odisha` and `/trademark-registration-in-odisha`): "7+ Years of
Legal / Compliance Expertise", "5000+ Happy Clients", "1000+ Companies Registered", "1000+
Trademarks Registered", "100% Online Filing + Bhubaneswar Office", "Free Expert Consultation". If the
website's figures change, change them here too, because both stores reject claims that are not true or
cannot be backed up. The website's "4.9/5" Google rating and "top-rated" are left out on purpose: Google
Play forbids ratings and ranking claims in a listing, and Apple rejects references to another platform.

| Field | Limit | Used |
|---|---|---|
| App name (both) | 30 | 14 |
| App Store subtitle | 30 | 29 |
| Play short description | 80 | 78 |
| App Store promotional text | 170 | 140 |
| Description (both) | 4000 | 2018 |
| App Store keywords | 100 | 96 |
| What's new / release notes (both) | 500 (Play), 4000 (Apple) | 149 |

## App name (both stores)

```
Legal Terminus
```

## App Store subtitle

```
Company, GST & Trademark Help
```

## Google Play short description

```
Register your business, file GST & ITR, protect your brand. Track it all here.
```

## App Store promotional text (can be changed any time without a review)

```
Start a company, register your brand, stay GST-compliant. Expert help from Legal Terminus, with every step, document and payment in one app.
```

## Description (both stores)

```
Your legal, tax and compliance partner, in your pocket.

Legal Terminus helps founders, small businesses and professionals start, protect and run their business the right way. Our experts handle the paperwork with the government. You follow every step from your phone.

WHAT WE DO FOR YOU
• Start your business: Private Limited, LLP, One Person Company, Partnership, Proprietorship, Section 8 company, Trust and Society registration
• Protect your brand: trademark registration, replies to examination reports, hearings, oppositions and renewals
• Stay tax-compliant: GST registration and return filing, income tax returns for businesses and individuals, professional tax
• Keep your company compliant: annual ROC filings, adding or removing directors, changing name, address or objects, increasing capital, conversions and closures
• Get the licences you need: Udyam (MSME), Startup India, FSSAI, IEC, Shop & Establishment, trade licence, EPF, ESIC, ISO and more

WHAT YOU CAN DO IN THE APP
• See every service you have with us, and exactly which step it is on
• Upload your documents securely from your phone, and open the ones we share with you
• Message your Legal Terminus expert on each service, and get replies in one place
• Approve steps when your sign-off is needed
• See what has been billed, what you have paid and what is due
• Get notified the moment something needs you

WHY BUSINESSES CHOOSE LEGAL TERMINUS
• 7+ years of legal and compliance expertise
• 5,000+ happy clients, 1,000+ companies registered and 1,000+ trademarks registered
• 100% online, anywhere in India, with an office in Bhubaneswar for face-to-face help
• A free first consultation with an expert
• Clear plans and prices, shown before you start

GETTING STARTED
Sign in with Google, Apple (on iPhone), your email and password, or a one-tap link sent to your email. New to Legal Terminus? Sign up in the app, or book a free consultation at legalterminus.com.

Questions? Write to sales21@legalterminus.com or visit legalterminus.com.
```

## App Store keywords (comma-separated, no spaces after commas)

```
company registration,GST,ITR,trademark,LLP,compliance,ROC,MSME,Udyam,startup,legal,tax,CA,Odisha
```

## What's new (App Store) / Release notes (Play)

```
The new Legal Terminus app: follow each of your services step by step, share documents securely, message your expert, and see what is billed and due.
```

## Other fields

| Field | Value |
|---|---|
| Category | Business (App Store secondary: Productivity) |
| Support URL (App Store) | `https://legalterminus.com/contact-us` |
| Marketing URL (App Store) | `https://legalterminus.com` |
| Privacy policy URL (both) | `https://legalterminus.com/privacy-policy` |
| Contact email (both) | `sales21@legalterminus.com` |
| Copyright (App Store) | `2026 LEGAL TERMINUS PRIVATE LIMITED` |
| Age rating | 4+ (App Store), the IARC answers in `docs/play-store-listing.md` (Play) |
| Availability | India (leave out China mainland on the App Store) |
| Reviewer sign-in (both) | `play.reviewer@legalterminus.com`, password in `~/lt-android-release/keys/PLAY_REVIEWER.txt`; note: "A client account with no matters. Sign in with email and password." |

## What is entered in each store (2026-11-22)

**App Store (iOS 1.0, build 8)**: submitted for review with **automatic release** on approval.
- Screenshots: the "iPhone with Dynamic Island (medium display)" slot, **1206×2622**. Apple changed the
  required size in Nov 2026: 6.9" files (1320×2868) were refused.
- App Information: subtitle as above; Business / Productivity; Content Rights **No**; Age Rating with
  **Messaging and Chat: Yes** (private client–firm chat), User-Generated Content **No**.
- Pricing: Free. Availability: all countries except China mainland, which needs the security and AIGC
  declarations. No In-App Purchases: Pay Now pays for real-world services (guideline 3.1.3(e)), and the
  review notes say so.
- App Privacy: Name, Email, Phone, **Physical Address**, Other User Content, User ID, **Purchase History**;
  all App Functionality, linked to the user, no tracking. Encryption: exempt (`ITSAppUsesNonExemptEncryption`
  NO), so no documents are needed.
- TestFlight: internal group "LT team".

**Google Play (Android 1.0.2, build 8)**: listing changes entered, waiting on the upload key (valid from
2026-11-23 08:58 UTC).
- Short and full description as above. Feature graphic `play-feature-graphic-1024x500.jpg`; phone
  screenshots `play-phone-1..5.png` (1080×1920) in an **Android-style** frame. Google wants Android devices
  in Play images, so the iPhone status bar and Dynamic Island are replaced.
- App access: the reviewer login (password changed 2026-11-21). Financial features: none. Data safety: as in
  `docs/play-store-listing.md`, now with **deletion: Yes**, in app via "Delete my account", URL
  `https://legalterminus.com/privacy-policy#delete-my-data`.
- Build 8 permissions: INTERNET, ACCESS_NETWORK_STATE and Google sign-in's READ_GSERVICES only.

## Making the images again

The images are made from the app itself, never drawn by hand:
1. QA demo client "Odisha Fresh Foods Pvt Ltd" (`demo-client@legalterminus.test`, password in
   `~/lt-android-release/keys/QA_DEMO_CLIENT.txt`). QA only; never real client data.
2. `testStoreScreens` (iOS UI test) on the **iPhone 17 Pro Max** simulator, with the status bar set to 9:41,
   saves the raw screens. Export them with `xcrun xcresulttool export attachments`.
3. `node MobileApp/store-assets/render.mjs <raw-dir> <out-dir>` (from `Frontend/`, which has Playwright)
   makes every size: iOS 6.3/6.1/6.7/6.5/5.5/6.9 and the Play phone set. `feature-graphic.mjs` makes the
   Play feature graphic. They read the logo from `Portal/public/lt-logo.png` and the raw screens from
   `~/lt-android-release/store-assets/raw-screens/` (they contain absolute paths to this Mac; change them
   if the release Mac changes).
