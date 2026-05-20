import React from "react";
import "./BlogPage.css";

const BLOG_BASE = "https://legalterminus.com";

const cards = [
  {
    id: 1,
    img: "https://legalterminus.com/wp-content/uploads/2026/03/520-x-402.jpg",
    tags: ["Income Tax"],
    date: "March 12, 2026",
    title: "Restaurants Under the Scanner: How the Income Tax Department Is Getting Smarter Than Ever",
    excerpt: "The Income Tax Department in India has clearly entered a new era of data intelligence and real-time monitoring. Recent communications signal tighter scrutiny for restaurant businesses.",
    slug: "restaurants-facing-income-tax-checks-latest-update",
  },
  {
    id: 2,
    img: "https://legalterminus.com/wp-content/uploads/2025/11/5.png",
    tags: ["Company Law"],
    date: "November 20, 2025",
    title: "Event-Based Compliances for a Private Limited Company",
    excerpt: "Apart from yearly compliances, certain filings are required whenever a major change or event occurs in the company — such as a change in directors, share capital, or registered office.",
    slug: "event-based-compliances-for-a-private-limited-company",
  },
  {
    id: 3,
    img: "https://legalterminus.com/wp-content/uploads/2025/11/4.png",
    tags: ["Company Law"],
    date: "November 20, 2025",
    title: "Recommended Registrations After Incorporation",
    excerpt: "These registrations are not always mandatory, but they are important for smooth business operations and future growth — including MSME, GST, and government programme eligibility.",
    slug: "recommended-registrations-after-incorporation",
  },
  {
    id: 4,
    img: "https://legalterminus.com/wp-content/uploads/2025/11/3.png",
    tags: ["Company Law"],
    date: "November 20, 2025",
    title: "Annual Compliance Calendar – Private Limited Company",
    excerpt: "A Private Limited Company must complete certain compliances every year. Use this as a ready checklist to know what to do and when, so you never miss a statutory deadline.",
    slug: "annual-compliance-calendar-private-limited-company",
  },
  {
    id: 5,
    img: "https://legalterminus.com/wp-content/uploads/2025/11/2.png",
    tags: ["Company Law"],
    date: "November 20, 2025",
    title: "Stationery to Be Prepared After Incorporation",
    excerpt: "Items every company should prepare immediately after registration. Once your company is incorporated, you should set up basic stationery and branding materials with the correct legal details.",
    slug: "stationery-to-be-prepared-after-incorporation",
  },
  {
    id: 6,
    img: "https://legalterminus.com/wp-content/uploads/2025/11/1.png",
    tags: ["Company Law"],
    date: "November 20, 2025",
    title: "Post-Incorporation Compliances",
    excerpt: "Mandatory steps every company must complete after incorporation. Several compliances must be completed within specific timeframes to avoid financial penalties and legal issues.",
    slug: "post-incorporation-compliances",
  },
];

const BlogPage = () => {
  return (
    <section className="blogpage-root">
      <div className="blogpage-grid-wrap">
        <div className="blogpage-grid">
          {cards.map((card) => (
            <article key={card.id} className="blogpage-card">
              <a
                href={`${BLOG_BASE}/${card.slug}/`}
                target="_blank"
                rel="noopener noreferrer"
                className="blogpage-card-link"
                aria-label={card.title}
              >
                <div className="blogpage-card-media">
                  <img className="blogpage-card-image" src={card.img} alt={card.title} loading="lazy" />
                  <div className="blogpage-tags">
                    {card.tags.map((t, idx) => (
                      <span className="blogpage-tag" key={idx}>
                        {t}
                      </span>
                    ))}
                  </div>
                </div>

                <div className="blogpage-card-body">
                  <time className="blogpage-date">{card.date}</time>
                  <h3 className="blogpage-title">{card.title}</h3>
                  <p className="blogpage-excerpt">{card.excerpt}</p>
                </div>
              </a>
            </article>
          ))}
        </div>
      </div>

      <hr className="blogpage-divider" />

      <aside className="blogpage-newsletter">
        <small className="blogpage-newsletter-label">NEWSLETTER</small>

        <h2 className="blogpage-newsletter-heading">
          Get the Latest <em>Update</em>
          <br />
          From <em>Legal Terminus</em>
        </h2>

        <form
          className="blogpage-newsletter-form"
          onSubmit={(e) => e.preventDefault()}
        >
          <label htmlFor="bp-email" className="blogpage-sr-only">
            Your email
          </label>

          <input
            id="bp-email"
            type="email"
            placeholder="Your email"
            className="blogpage-input"
          />

          <button type="submit" className="blogpage-submit" aria-label="subscribe">
            →
          </button>
        </form>
      </aside>
    </section>
  );
};

export default BlogPage;
