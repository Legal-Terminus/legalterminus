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
| Reviewer sign-in (both) | `play.reviewer@legalterminus.com`, password in `~/lt-android-release/keys/PLAY_REVIEWER.txt`; two sample matters (organisation "Apple Review Demo", added 2026-11-24 for App Review): Trademark Registration (₹4,499 paid, a shared sample PDF, a chat message) and Udyam (₹999 due). Do not delete them while a review may still use the account. |

## App Review notes (App Store)

The first submission of 1.0 (8) came back on 2026-11-24 under **Guideline 2.1 — Information Needed**:
Apple asked for a screen recording on a physical iPhone and the answers below. No code change was
needed. The resubmission attaches the recording (launch → sign up → Delete my account → demo sign-in →
a matter's Steps, Documents, Chat, Payments → sign out), the Certificate of Incorporation, the GST
registration certificate and any professional registration, and pastes this into
**App Review Information → Notes**:

```
1. SCREEN RECORDING
Attached: recorded on an iPhone running the latest iOS. It shows launch, sign-up, account deletion (My Profile > Delete my account), sign-in with the demo account, and the main features.

2. PURPOSE AND AUDIENCE
Legal Terminus Private Limited is an Indian business-compliance firm. Founders, small businesses and professionals buy our services (company registration, GST registration and returns, trademark registration, MSME/Udyam and similar filings), and our in-house experts carry them out. The app is the client side of that work: a client sees every step of each service as it progresses, shares documents securely, chats with the expert handling the service, and sees what is billed, paid and due.

3. HOW TO ACCESS
Sign in with the demo account given in Sign-In Information (email and password). It is a client account with sample services.
- Dashboard: summary of the client's services.
- My Services: tap a service to see its Steps, Documents, Chat and Payments.
- My Profile: edit details, sign out, Delete my account.
New users can create an account with Sign up (email), Sign in with Google, or Sign in with Apple.

4. EXTERNAL SERVICES
- Firebase Authentication (Google): sign-in with email/password, Google and Apple.
- Google Cloud (Firestore, Cloud Storage, Cloud Run): data, documents and our server.
- Razorpay (an Indian payment gateway): clients may pay fees for our professional services, performed by people outside the app (guideline 3.1.3(e)). No digital content or features are sold.
- Email (SMTP): notifications about service progress.
No AI services are used.

5. REGIONAL DIFFERENCES
None. The app works the same in every region. The services concern Indian law, so our clients are businesses in India.

6. REGULATED INDUSTRY
The services are compliance and registration filings with Indian government portals (MCA, GST, Trademark Registry), carried out for clients by our qualified staff. Attached: <list the documents attached>.

CONTENT MODERATION
Chat and documents are private between one client and our staff on that client's own service. There is no public or user-to-user content.

RESPONSES TO REVIEW GUIDANCE
- Bugs and crashes (2.1): Build 1.0 (8) was tested through TestFlight on a physical iPhone running the latest iOS (see recording). The app is iPhone only.
- Demo account (2.1): The account in Sign-In Information is a client account with two sample services. Clients are the only public account type. Staff accounts belong to our employees and are not offered to the public.
- Screenshots (2.3.3): Each screenshot shows a real screen of the app in use, framed with a caption.
- In-App Purchase (3.1.1): The app sells no digital content, subscriptions or features; fees are for professional services performed outside the app (3.1.3(e)), paid through Razorpay.
- Distribution (3.2): The app is for the general public: anyone in India who buys our compliance services. It is not limited to one organisation's employees.
```

Staff-uploaded documents are **Internal only** until someone clicks **Share** on the Documents tab;
approving a document does not share it (the sample PDF needed this).
