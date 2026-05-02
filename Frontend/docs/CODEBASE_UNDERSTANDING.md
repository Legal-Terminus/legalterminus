# Legal Terminus — Frontend Codebase Understanding

> **Last reviewed:** April 26, 2026  
> **Project type:** Marketing/SaaS Website (React SPA)

---

## Table of Contents

1. [Project Setup](#1-project-setup)
2. [Entry Point & Routing](#2-entry-point--routing)
3. [Pages (40+ routes)](#3-pages)
4. [Component Architecture](#4-component-architecture)
5. [Styling Approach](#5-styling-approach)
6. [Data & State Management](#6-data--state-management)
7. [Architecture Summary](#7-architecture-summary)

---

## 1. Project Setup

| Item | Detail |
|------|--------|
| **Build tool** | Vite 7.2.4 |
| **Framework** | React 19.2.0 |
| **Routing** | react-router-dom 7.9.6 |
| **Animation** | framer-motion 12.26.2 |
| **Icons** | lucide-react 0.555.0 + react-icons 5.5.0 |
| **Loaders** | react-spinners 0.17.0 |
| **Styling** | Vanilla CSS (per-component `.css` files — no Tailwind) |
| **Linting** | ESLint with React plugin |
| **Hot reload** | React Fast Refresh via Vite |

**Key config files:**
- `vite.config.js` — minimal, just `@vitejs/plugin-react`
- No `tailwind.config.js` (Tailwind is NOT used despite being listed in the workspace)

---

## 2. Entry Point & Routing

### `main.jsx`
- Mounts `<App />` into `#root` wrapped in React `<StrictMode>`

### `App.jsx` — Route Tree

Every route is wrapped in `<RouteLoaderWrapper>` which shows a full-page loader (minimum 2 seconds) during route transitions.

#### Core Routes
| Path | Component |
|------|-----------|
| `/` | Home |
| `/blog` | Blog listing |
| `/blog/details` | BlogDetails |
| `/contact/us` | ContactUs |

#### Business Registration (10 routes)
| Path | Service |
|------|---------|
| `/private-limited-company-registration-in-india` | Private Limited Company |
| `/public-limited-company-registration-in-india` | Public Limited Company |
| `/one-person-company` | One Person Company (OPC) |
| `/llp` | Limited Liability Partnership |
| `/trust` | Trust Registration |
| `/society` | Society Registration |
| `/section-8` | Section 8 (Non-Profit) Company |
| `/partnership` | Partnership Firm |
| `/proprietorship` | Proprietorship |
| `/incorption-registration-in-india` | Wholly Owned Subsidiary |

#### Registrations & Compliance (13 routes)
| Path | Service |
|------|---------|
| `/gst-registration` | GST Registration |
| `/gst-return-filing` | GST Return Filing |
| `/epf` | EPF Registration |
| `/esic` | ESIC Registration |
| `/udyam` | Udyam Registration |
| `/professional-tax` | Professional Tax |
| `/shop-establishment` | Shop & Establishment |
| `/iec` | Importer Exporter Code |
| `/food-license` | Food License |
| `/trade-license` | Trade License |
| `/labour-license` | Labour License |
| `/bar-code` | Bar Code Registration |
| `/iso` | ISO Certification |

#### Conversion Services (6 routes)
| Path | Service |
|------|---------|
| `/conversion/proprietorship-to-opc` | Proprietorship → OPC |
| `/conversion/proprietorship-to-private` | Proprietorship → Pvt Ltd |
| `/conversion/partnership-to-llp` | Partnership → LLP |
| `/conversion/partnership-to-private` | Partnership → Pvt Ltd |
| `/conversion/llp-to-private` | LLP → Pvt Ltd |
| `/conversion/private-to-llp` | Pvt Ltd → LLP |

#### Updation / Event-Based Compliance (8 routes)
| Path | Service |
|------|---------|
| `/updation/change-name-company` | Change Company Name |
| `/updation/change-name-llp` | Change LLP Name |
| `/updation/change-address-company` | Change Company Address |
| `/updation/change-address-llp` | Change LLP Address |
| `/updation/change-object-company` | Change Company Objectives |
| `/updation/change-object-llp` | Change LLP Objectives |
| `/updation/increase-authorised-capital` | Increase Authorised Capital |
| `/updation/add-remove-director` | Add / Remove Directors |

#### Dissolution / Windup (3 routes)
| Path | Service |
|------|---------|
| `/windup/dissolve-private` | Dissolve Private Company |
| `/windup/dissolve-llp` | Dissolve LLP |
| `/windup/dissolve-partnership` | Dissolve Partnership |

#### Trademark Services (5 routes)
| Path | Service |
|------|---------|
| `/trademark/application` | Trademark Application |
| `/trademark/renewal` | Trademark Renewal |
| `/trademark/opposition` | Trademark Opposition |
| `/trademark/hearing` | Trademark Hearing |
| `/trademark/exam-reply` | Reply to Examination Report |

**Total routes: ~55**

---

## 3. Pages

### `Home/Home.jsx`
The marketing home page. Composes the following sections top-to-bottom:

| Component | Purpose |
|-----------|---------|
| `Herosection` | Hero banner — headline, CTA buttons, service tag links |
| `Premiumbusiness` | 4–6 service category cards with expandable accordion descriptions |
| `WorkingProcessPro` | Visual step-by-step "how it works" section |
| `Legalhelp` | CTA banner for getting legal help |
| `HomeCertisfiedClient` | Auto-scrolling client logo carousel |
| `HomeAboutExperiance` | Company experience & credentials block |
| `Whoweare` | Company intro with embedded video player |
| `Featureslegalservice` | Highlighted feature list |
| `Subscribe` | Newsletter signup form |
| `Testimonials` | 4-testimonial carousel with avatar switcher |
| `ContactUs` | Full contact form + social links |
| `HomeLatestBlog` | Preview of 3 latest blog posts |

### Service Pages (40+ pages)
Every service page follows the same **section-composition template**:

```
<Breadcrum />           ← Header: title, highlights, side form
<[Service]PlanAndPricing /> ← Pricing tiers
<[Service]TermsCondition />
<[Service]ZolvitPremium />  ← Premium upsell block
<[Service]Tabs />           ← Sticky scroll-to-section tabs
<[Service]CompanyTab />     ← Why choose this service
<[Service]Types />          ← Service variants/types
<[Service]RequirementsTab /> ← Eligibility & requirements
<[Service]Process />        ← Step-by-step process
<[Service]Document />       ← Required documents checklist
<[Service]FAQ />            ← Expandable FAQ with search
<[Service]Testimonial />    ← Client testimonials
<[Service]VideoTestimonial /> ← Video reviews
<[Service]OurClients />     ← Client logo grid
```

### `Blog.jsx`
- `BlogBanner` — hero for blog listing
- `BlogPage` — 6 blog cards (image, tag, date, title, excerpt) + newsletter form

### `BlogDetails.jsx`
Composes: `BlogDetailsBanner`, `BlogDetailsArticleSection`, `BlogDetailsFaq`, `BlogDetailsOurLatestNews`, `BlogDetailsTestimonial`, `BlogDetailsPricingPlans`, `BlogDetailsAboutUs`

### `ContactUs.jsx` (route: `/contact/us`)
- `BannerContact` — contact page hero
- `ContactUsSection` — form with phone/email contact info

---

## 4. Component Architecture

### Directory structure: `src/Components/`

Each component lives in its own folder with a `.jsx` and matching `.css` file.

---

### Global / Layout Components

#### `Navbar/Navbar.jsx`
Full mega-menu navigation bar. Structure:

```
Home
├── Setting Up a Business
│   ├── Profit Making: LLP, Private Ltd, Public Ltd, OPC, Partnership, Proprietorship, WOS
│   └── Non-Profit: Section 8, Trust, Society
├── Registrations & Returns
│   ├── Registrations: GST, Udyam, EPF, ESIC, Professional Tax, Shop & Estab.
│   ├── Licenses & Certs: IEC, Food, Trade, Labour, Bar Code, ISO
│   └── Return Filing: GST Returns, ITR, Annual Filing, etc.
├── Event Based Compliances
│   ├── Conversion, Updation, Dissolution, Trademark
└── Know Us
    └── About, Contact, Media, Blog, Policies
```

- Mobile responsive with hamburger menu
- Uses nested expandable sections on mobile

#### `Footer/Footer.jsx`
Multi-column footer:
- Quick links (Terms, Privacy, Refund, Confidentiality policies)
- Service links
- Brand center section
- Social media links

---

### Utility / UX Components

| Component | Behavior |
|-----------|---------|
| `FloatIcon/FloatIcon.jsx` | Floating WhatsApp + Phone buttons (bottom-right). Auto-toggles open/closed every 3 seconds until user interaction. z-index: 9999 |
| `PageLoader/PageLoader.jsx` | Full-screen loader showing Legal Terminus logo |
| `PageLoader/RouteLoaderWrapper.jsx` | Wraps all routes; displays loader for minimum 2 seconds on every navigation |

---

### Home Page Section Components

| Component | What it renders |
|-----------|----------------|
| `Herosection/Herosection.jsx` | Title, subtitle, 2 CTA buttons, service tag chips |
| `Premiumbusiness/Premiumbusiness.jsx` | Grid of 4–6 service cards; each card has gradient icon, title, description, accordion expand |
| `WorkingProcessPro/WorkingProcessPro.jsx` | Numbered step cards for the service process |
| `Whoweare/Whoweare.jsx` | Company intro text + video player |
| `HomeCertisfiedClient/HomeCertisfiedClient.jsx` | Horizontally scrolling client logo strip (119+ logos) |
| `HomeAboutExperiance/HomeAboutExperiance.jsx` | Stats: 1000+ companies, years of expertise, etc. |
| `Subscribe/Subscribe.jsx` | Email newsletter signup input + submit |
| `Testimonials/Testimonials.jsx` | 4 testimonials, 5-star ratings, avatar switching, quote rotation |
| `Contactus/Contactus.jsx` | Form: name, company, phone, email, subject, message + social icons (LinkedIn, Facebook, Twitter, Instagram, YouTube, GitHub) |
| `HomeLatestBlog/HomeLatestBlog.jsx` | 3 blog preview cards |
| `Legalhelp/` | CTA section |
| `Featureslegalservice/` | Feature list with icons |

---

### Shared Service-Page Components

These are generic enough to be reused or replicated per service:

| Component | Purpose |
|-----------|---------|
| `Breadcrum/Breadcrum.jsx` | Service header: title, 4 feature highlights, stats (1000+ companies, 100% online, 5+ years), right-side lead form (Name, Email, Phone, State, Call Time, WhatsApp checkbox) |
| `Faq/Faq.jsx` | Searchable FAQ; each question expands/collapses with +/− icon; animated open/close |
| `Documents/Documents.jsx` | Required documents checklist |
| `Steps/Steps.jsx` | Step-by-step process visualization |
| `Tabs/Tabs.jsx` | Generic sticky tabs with keyboard nav (Arrow/Home/End keys) |
| `Incorporation/Incorporation.jsx` | Generic incorporation content block |

---

### Service-Specific Component Families

Each major service has a dedicated component family prefixed with a short identifier:

| Prefix | Service |
|--------|---------|
| `Pvtltd*` | Private Limited Company |
| `GSTReg*` | GST Registration |
| `OPC*` / `ProFOPC*` | One Person Company |
| `LLP*` / `PartnershipLLP*` | LLP |
| `Dissolve*` / `Windup*` | Dissolution services |
| `TM*` / `Trademark*` | Trademark services |
| `ChangeToCompany*` | Company conversions |
| `LlptoPrivate*` | LLP → Pvt conversion |
| `PritoLlp*` | Pvt → LLP conversion |
| + 30 more | All other services |

Each family contains these sections: `Breadcrum`, `PlanAndPricing`, `ZolvitPremium`, `TermsCondition`, `Tabs`, `CompanyTab`, `Types`, `RequirementsTab`, `Process`, `Document`, `FAQ`, `Testimonial`, `VideoTestimonial`, `OurClients`

---

### Blog-Specific Components

| Component | Purpose |
|-----------|---------|
| `BlogBanner/BlogBanner.jsx` | Blog listing page hero |
| `BlogPage/BlogPage.jsx` | 6 blog post cards + newsletter form |
| `BlogDetails*` (7 components) | Individual blog post sections |

---

## 5. Styling Approach

- **Vanilla CSS** — every component has a co-located `.css` file
- **No Tailwind, no SASS/LESS** — pure CSS
- **No CSS Modules** — class names are global strings (risk of collision)

### CSS Patterns Used

| Pattern | Usage |
|---------|-------|
| Flexbox | Most layout (nav, cards, sections) |
| CSS Grid | Page-level section layouts |
| CSS custom properties | `--zen-delay` for staggered animations |
| Framer Motion | Complex entrance animations (fade, slide, scale) |
| CSS transitions | Hover effects, accordion open/close |
| `position: sticky` | Tab navigation stays at top on scroll |
| `z-index: 9999` | Floating contact icons always on top |

### Color Palette
- **Primary greens:** `#4CAF50` → `#45a049` (gradient)
- **Light backgrounds:** `#f0f9f0`, `#e6f4e6`
- **Professional palette:** greens and blues typical of legal/corporate sites
- **Box shadows** for card depth

### Responsive Design
- Media queries in each component's CSS
- Mobile-first implied; hamburger menu for Navbar on mobile

---

## 6. Data & State Management

### No Backend Integration
- **No API folder, no HTTP client** (no Axios, no Fetch wrappers)
- All data is **hardcoded as static arrays/objects inside components**

### Examples of hardcoded data
| Component | Hardcoded data |
|-----------|---------------|
| `Testimonials.jsx` | 4 testimonial objects (name, company, quote, avatar) |
| `BlogPage.jsx` | 6 mock blog post objects |
| `Faq.jsx` | 20+ Q&A pairs |
| `Navbar.jsx` | Full menu hierarchy |
| `Premiumbusiness.jsx` | Service card descriptions |
| `HomeCertisfiedClient.jsx` | 119+ client logo paths |

### Form Handling
- React `useState` for controlled inputs
- `e.preventDefault()` on submit
- **No actual form submission** — handlers only `console.log` data (demo state)

### State Management
- **Only React local state** (`useState`, `useRef`, `useEffect`)
- No Redux, no Context API, no Zustand, no external state library
- Each component manages its own state independently

---

## 7. Architecture Summary

### What this project is
A **React SPA marketing website** for Legal Terminus — an Indian legal services company offering business registration, compliance, trademark, and related services.

### How it's built

```
App.jsx
└── RouteLoaderWrapper (page transition loader, 2s min)
    ├── Home (composed of 12 section components)
    ├── [Service Page] × 40+ (composed of ~14 section components each)
    ├── Blog / BlogDetails
    └── ContactUs
```

### Component count estimate
- **~250+ components** total across all service families
- **~55 routes** 
- **~40 service pages**
- **~119 public client logo assets**
- **2 video assets** (hero + who-we-are)

### Key strengths
- Very consistent service page structure across all 40+ services
- Clean component-per-section decomposition
- Smooth UX touches: page loader on every route, floating contact buttons, sticky tabs

### Key limitations / technical debt
- All data is hardcoded — no CMS or API connection
- Forms don't submit anywhere
- No CSS Modules → global class name collision risk
- No state management pattern → harder to scale
- Blog section has no real data source
- No TypeScript (plain JSX)
- Route path typos exist (e.g., `/incorption-registration-in-india` should be `incorporation`)
