# Website content hidden until the firm supplies the real thing

**Last updated:** 2026-10-11
**Applies to:** the marketing site (`Frontend/`), with the redesign on or off. It is on
QA now and reaches the live site at the next release.

Several sections of the site were built with placeholder videos that were never
replaced. They have been hidden rather than left showing the wrong thing. Nothing was
deleted: every section comes back by supplying the real links and flipping one line.

## What the firm needs to send

| # | Needed | Brings back |
|---|---|---|
| 1 | YouTube links to real client video testimonials, with each client's name and role as they agreed to be shown | The "Video Testimonials" section on 63 pages |
| 2 | YouTube links to the firm's actual coverage on each channel: Darbar TV, Daily News, Chandrama Khabar, EN Odisha, Utkal Bharat, Pratigyan Live (or the correct list of channels) | "Media Coverage" on the Media page |
| 3 | A video of the firm's process, if one exists | The "Watch Video" buttons in the "Who we are" block |

A link is the address of the video on YouTube, for example
`https://www.youtube.com/watch?v=XXXXXXXXXXX`. One list in an email is enough.

## Why these were hidden

Every video slot on the site pointed at the same handful of YouTube videos that have
nothing to do with the firm:

| Video id | What it actually is |
|---|---|
| `dQw4w9WgXcQ` | A music video widely used as an internet joke |
| `oHg5SJYRHA0` | Another upload of the same joke video |
| `jNQXAC9IVRw` | The first video ever uploaded to YouTube |
| `ysz5PUM2z2A` | A stock sample clip used in programming tutorials |
| `kJQP7kiw5Fk`, `fJ9rUzIMcZQ` | Two famous music videos (Media page only) |

They sat under real people's names and photos ("Kirti Ranjan Sahu, Proprietor of
Keshab Jewellers", "Darbar TV"). A visitor who pressed play saw a joke video presented
as that person's testimonial. They date from the original build in January 2026, not
from the redesign.

## What is hidden

### 1. Video testimonial sections — 43 components

Each of these now shows nothing. Before, the section appeared on **63 of the
site's 79 pages** (measured by opening every page in a browser and scrolling to the
bottom); after, on none.

Six of them have "Why" in their name (`FoodLicenseWhy`, `IECWhy`, `OPCWhy`,
`TradeLicenseWhy`, `TrademarktoHearingWhy`, `TrademarktoOppositionWhy`) and most are
headed "Why Choose …" rather than "Video Testimonials". They are the same slider with
the same placeholder videos, under names that appear to be invented ("Rohit Mehta,
Importer, Global Trade Exports").

<details>
<summary>The 43 components</summary>

- `AddVideoTestimonial`
- `BCvideo`
- `CICvideo`
- `CIOvideo`
- `CIRvideo`
- `ChangeLlpVideoTestimonial`
- `ChangeObjectComVideoTestimonial`
- `ChangeaddComVideoTestimonial`
- `ChangetoCompanyVideoTestimonial`
- `ChangetoLlpVideoTestimonial`
- `DPVideoTestimonial`
- `DissolveLLPVideoTestimonial`
- `DissolveVideoTestimonial`
- `FoodLicenseWhy`
- `IECWhy`
- `ISOvideo`
- `IncorporationVideoTestimonial`
- `IncreaseVideoTestimonial`
- `LLPVideoTestimonial`
- `LLRvideotestimonial`
- `LlptoPriVideoTestimonial`
- `OPCWhy`
- `PFRvideo`
- `PartnershipLLPVideoTestimonial`
- `ParttoPriVideoTestimonial`
- `PritoLlpVideoTestimonial`
- `PritoPublicVideoTestimonial`
- `ProFOPCVideoTestimonial`
- `ProFPLCVideoTestimonial`
- `ProVideoTestimonial`
- `PublictoPriVideoTestimonial`
- `PvtltdVideoTestimonial`
- `ReplyOfERVideoTestimonial`
- `Section8VideoTestimonial`
- `SocietyVideoTestimonial`
- `TMApplicaVideoTestimonial`
- `TMVideoTestimonial`
- `TradeLicenseWhy`
- `TrademarktoHearingWhy`
- `TrademarktoOppositionWhy`
- `TrustVideoTestimonial`
- `VideoTestimonial`
- `WindupPLCVideoTestimonial`

</details>

<details>
<summary>The 63 pages that showed the section</summary>

- `/about`
- `/companyregistration-in-odisha`
- `/event-based-compliances/add-or-remove-a-director-company`
- `/event-based-compliances/change-company-name`
- `/event-based-compliances/change-in-object-clause-of-a-company`
- `/event-based-compliances/change-in-registered-office-address`
- `/event-based-compliances/change-in-registered-office-address-for-llp`
- `/event-based-compliances/changing-the-objects-of-llp`
- `/event-based-compliances/conversion-in-form-of-business/conversion-of-llp-into-private-limited-company`
- `/event-based-compliances/conversion-in-form-of-business/conversion-of-partnership-into-limited-liability-partnership`
- `/event-based-compliances/conversion-in-form-of-business/conversion-of-private-limited-company-into-llp`
- `/event-based-compliances/conversion-in-form-of-business/conversion-of-private-limited-company-to-public-limited-company`
- `/event-based-compliances/conversion-in-form-of-business/conversion-of-proprietorship-into-opc-private-limited-company`
- `/event-based-compliances/conversion-in-form-of-business/conversion-of-proprietorship-into-private-limited-company`
- `/event-based-compliances/conversion-in-form-of-business/conversion-of-public-limited-company-to-private-limited-company`
- `/event-based-compliances/conversion-in-form-of-business/partnership-firm-to-private-limited-company`
- `/event-based-compliances/increase-authorized-share-capital-company`
- `/event-based-compliances/name-change-process-in-india-for-llp`
- `/event-based-compliances/windup-services/dissolution-of-partnership-firm`
- `/event-based-compliances/windup-services/process-of-winding-up-limited-liability-partnership`
- `/event-based-compliances/windup-services/process-of-winding-up-of-a-company`
- `/registrations-returns/license-certifications/bar-code-registration`
- `/registrations-returns/license-certifications/food-license-and-registration`
- `/registrations-returns/license-certifications/importer-exporter-code-registration`
- `/registrations-returns/license-certifications/iso-certification-in-india`
- `/registrations-returns/license-certifications/labour-license-registration`
- `/registrations-returns/license-certifications/odisha-labour-welfare-fund-olwf-registration`
- `/registrations-returns/license-certifications/trade-license-registration`
- `/registrations-returns/registrations/epf-registration-in-india`
- `/registrations-returns/registrations/esic-registration-in-india`
- `/registrations-returns/registrations/gst-registration-in-india`
- `/registrations-returns/registrations/professional-tax-registration`
- `/registrations-returns/registrations/shop-commercial-establishments-registration-in-india`
- `/registrations-returns/registrations/startup-india-registration`
- `/registrations-returns/registrations/startup-odisha-registration`
- `/registrations-returns/registrations/udyam-registration-in-india`
- `/registrations-returns/return-filing/annual-filing-company`
- `/registrations-returns/return-filing/annual-filing-llp`
- `/registrations-returns/return-filing/epf-return-filing`
- `/registrations-returns/return-filing/esi-return-filing`
- `/registrations-returns/return-filing/gst-return-filing`
- `/registrations-returns/return-filing/itr-filing-company`
- `/registrations-returns/return-filing/itr-filing-individual`
- `/registrations-returns/return-filing/professional-tax-return-filing`
- `/setting-up-a-business/non-profit-making-structures/non-profit-company-sec-8-company-registration-in-india`
- `/setting-up-a-business/non-profit-making-structures/society-registration-in-india`
- `/setting-up-a-business/non-profit-making-structures/trust-registration-in-india`
- `/setting-up-a-business/profit-making-structures/incorporation-of-wholly-owned-subsidiary-in-india`
- `/setting-up-a-business/profit-making-structures/limited-liability-partnership-registration-in-india`
- `/setting-up-a-business/profit-making-structures/one-person-company-registration-in-india`
- `/setting-up-a-business/profit-making-structures/partnership-firm-registration-in-india`
- `/setting-up-a-business/profit-making-structures/private-limited-company-registration-in-india`
- `/setting-up-a-business/profit-making-structures/proprietorship-firm-registration-in-india`
- `/setting-up-a-business/profit-making-structures/public-limited-company-registration-in-india`
- `/trademark/registration-and-compliance-services/reply-to-examination-report-trademark`
- `/trademark/registration-and-compliance-services/trademark-hearing-in-india`
- `/trademark/registration-and-compliance-services/trademark-opposition-in-india`
- `/trademark/registration-and-compliance-services/trademark-registration-in-india`
- `/trademark/registration-and-compliance-services/trademark-renewal-in-india`
- `/updation/change-name-company-to-company`
- `/updation/change-name-llp-to-llp`
- `/windup/wind-up-plc`
- `/zoho-applications`

</details>

### 2. Media page — "Media Coverage"

`/media` showed six videos under TV channel names. None was that channel's coverage.
The heading, the sentence under it and the six cards are hidden. **Print Media** (the
newspaper clippings) is real and is still shown, as is the page banner.

### 3. "Who we are" block — the process video

`ProcessSection` has a "Watch Video" button and a large play button that open the same
joke video. Both buttons are hidden; the block's text and its five steps stay.

This block is **not on the live site today**: the only page that uses it
(`Pages/AboutUs/AboutUs.jsx`) has no address. The site's About page is a different
file. It is hidden anyway so that it cannot go live by accident.

## How to bring something back (for a developer)

All three switches are in `Frontend/src/utils/videoTestimonials.js`.

| Section | Put the real links in | Then |
|---|---|---|
| One video testimonial slider | the `videoTestimonials` list at the top of that component | delete its line `if (!REAL_VIDEOS_READY) return null;` |
| All of them at once | every one of the 43 components | set `REAL_VIDEOS_READY = true` |
| Media Coverage | `mediaCoverage` in `Frontend/src/Pages/Media/Media.jsx` | set `REAL_MEDIA_COVERAGE_READY = true` |
| Process video | the `videoSrc` default in `ProcessSection.jsx` | set `REAL_PROCESS_VIDEO_READY = true` |

Do not set `REAL_VIDEOS_READY = true` while any slider still has a placeholder: it
turns all 43 back on together. Search the code for the ids in the table above
to check — after a full replacement that search finds nothing.

To check the result, build the site and open a page that has the section; or repeat
the count: every page opened in a browser and scrolled to the bottom should show a
"Video Testimonials" heading only where real videos were supplied.

## Found at the same time, not changed

These were noticed during the same pass. None is shown to visitors as a video today,
so nothing was hidden; each needs a decision.

- **A second media page that names a competitor.** `Pages/MediaHub/MediaHub.jsx` shows a
  slider whose five entries are titled "Vakilsearch – Media Coverage 1" to "5". It
  looks like leftover template content. The page has no address, so nobody can reach
  it. It should be deleted or rewritten before anyone links to it.
- **The photos beside the written reviews on the home page** appear to be stock
  portraits rather than the reviewers themselves. This was seen, not verified. If the
  reviews are genuine Google reviews, the reviewers' real profile photos or simple
  initials would be safer.
- **Unused pages and components.** `Pages/AboutUs/AboutUs.jsx` and
  `Pages/MediaHub/MediaHub.jsx` are not reachable. Several of the video sliders above
  are not used by any page either. They are hidden like the rest, and could be
  deleted.
- **The search-engine snapshots can miss the bottom of a page.** When the site is
  built, each page is saved as plain HTML for search engines. That step sometimes
  saves a page before its lower sections have loaded — the home page was captured
  with about a third of its text in one build out of four. It is unrelated to the
  videos and predates the redesign, but it affects what search engines read.

## Record

| Date | Change | Commit |
|---|---|---|
| 2026-10-11 | Video testimonial sliders hidden | `2ecd3e17` |
| 2026-10-11 | Media Coverage and the process video buttons hidden; this document | this commit |
