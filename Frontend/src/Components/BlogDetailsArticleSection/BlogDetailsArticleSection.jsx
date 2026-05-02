import React from "react";
import "./BlogDetailsArticleSection.css";
import heroImg from "../../assets/bd1.webp";

/* React icons for social buttons */
import { FaFacebookF, FaSkype, FaInstagram, FaLinkedinIn } from "react-icons/fa";

const BlogDetailsArticleSection = () => {
  const categories = [
    "Civil Law",
    "Legal Advice",
    "Labour Law",
    "Business Law",
    "Copyright Claim",
  ];

  const handleSearch = (e) => {
    e.preventDefault();
    const q = e.target.elements["bda-search"].value.trim();
    if (!q) return;
  };

  const handleCategoryClick = (cat) => {
  };

  const openPost = (id) => {
  };

  return (
    <main className="blogdetailsarticle-root" role="main">
      <div className="blogdetailsarticle-container">

        {/* LEFT COLUMN */}
        <section className="blogdetailsarticle-main">
          <h1 className="blogdetailsarticle-page-title">Blog &amp; News</h1>

          <article className="blogdetailsarticle-hero-article" aria-labelledby="bda-article-title">
            <div className="blogdetailsarticle-hero-image-wrap">
              <img
                className="blogdetailsarticle-hero-image"
                src={heroImg}
                alt="Legal consultation signing documents"
                loading="lazy"
              />
            </div>

            <div className="blogdetailsarticle-article-intro">
              <h2 id="bda-article-title" className="blogdetailsarticle-article-title">
                Understanding Client Agreements
              </h2>

              <p className="blogdetailsarticle-article-meta">
                <span className="blogdetailsarticle-meta-date">May 5, 2023</span>
                <span className="blogdetailsarticle-meta-sep"> — </span>
                <span className="blogdetailsarticle-article-author">By Notrav</span>
              </p>

              <p className="blogdetailsarticle-article-excerpt">
                A concise introduction to reading and negotiating client agreements. This guide
                highlights the key sections to look for, common pitfalls, and how to protect client interests.
              </p>

              <div className="blogdetailsarticle-cta-row">
                <button
                  className="blogdetailsarticle-btn blogdetailsarticle-btn-primary"
                  type="button"
                  onClick={() => {}}
                >
                  Read More
                </button>

                <button
                  className="blogdetailsarticle-btn blogdetailsarticle-btn-outline"
                  type="button"
                  onClick={() => {}}
                >
                  Save
                </button>
              </div>
            </div>
          </article>

          {/* FULL ARTICLE CONTENT */}
          <div className="blogdetailsarticle-content">
            <p className="blogdetailsarticle-dropcap">
              There are many variations of passages of Lorem Ipsum available, but
              the majority have suffered humour, randomised words which don’t look
              even slightly believable. If you are going to passage of Lorem Ipsum,
              you need embarrassing hidden in the middle of text. All the Lorem Ipsum
              Internet tend to repeat predefined chunks as necessary, making this the
              first generator on the Internet.
            </p>

            <p className="blogdetailsarticle-paragraph">
              Nemo enim ipsam voluptatem quia voluptas sit aspernatur aut odit aut fugit,
              sed quia consequuntur magni dolores eos qui ratione voluptatem sequi nesciunt.
              Neque porro quisquam est, qui dolorem ipsum quia amet, consectetur, adipisci velit,
              sed quia non numquam eius modi tempora incidunt ut labore et dolore magnam
              aliquam voluptatem.
            </p>

            <div className="blogdetailsarticle-quote-box">
              <div className="blogdetailsarticle-quote-icon">❝</div>

              <p className="blogdetailsarticle-quote-text">
                Nemo enim ipsam voluptatem quia voluptas sit aspernatur aut odit aut fugit,
                sed quia consequuntur doloresvoluptatem sequi nesciunt. Neque porro quisquam
                est, qui dolorem ipsum quia dolor sit amet,
              </p>

              <div className="blogdetailsarticle-quote-author">
                <span className="blogdetailsarticle-author-line"></span>
                <span className="blogdetailsarticle-author-name">Jhone Marko / CEO, Phoenix</span>
              </div>
            </div>

            <h2 className="blogdetailsarticle-subtitle">
              Legal Procedure For Theft & Fraudlance Cases
            </h2>

            <p className="blogdetailsarticle-paragraph">
              Nemo enim ipsam voluptatem quia voluptas sit aspernatur aut odit aut fugit,
              sed quia consequuntur magni dolores eos qui ratione voluptatem sequi nesciunt.
              Neque porro quisquam est, qui dolorem ipsum quia dolor sit consectetur, adipisci velit,
              sed quia non numquam eius modi tempora incidunt ut labore et dolore magnam aliquam
              voluptatem.
            </p>

            <p className="blogdetailsarticle-paragraph">
              Nor again is there anyone who loves or pursues or desires to obtain pain of itself,
              because it is pain, but because occasionally circumstances occur in which toil and
              pain can procure him some great pleasure. To take a trivial example, which of us ever
              undertakes laborious physical exercise,
            </p>

            <div className="blogdetailsarticle-gallery">
              <img src={heroImg} alt="gallery 1" loading="lazy" />
              <img src={heroImg} alt="gallery 2" loading="lazy" />
            </div>

            <p className="blogdetailsarticle-paragraph">
              There are many variations of passages of Lorem Ipsum available, but the majority
              have suffered humour, randomised words which don’t look even slightly believable.
              If you are going to passage of Lorem Ipsum, you need embarrassing hidden in the
              middle of text. All the Lorem Ipsum Internet tend to repeat predefined chunks.
            </p>

            <div className="blogdetailsarticle-tags-social">
              <div className="blogdetailsarticle-tags">
                <span className="blogdetailsarticle-tags-label">Tags:</span>
                <span className="blogdetailsarticle-tag">Advisor</span>
                <span className="blogdetailsarticle-tag">Financials</span>
              </div>

              <div className="blogdetailsarticle-social-icons" aria-label="Share post">
                <div className="blogdetailsarticle-social-circle" role="button" tabIndex="0" aria-label="Share to Facebook">
                  <FaFacebookF />
                </div>
                <div className="blogdetailsarticle-social-circle" role="button" tabIndex="0" aria-label="Share to Skype">
                  <FaSkype />
                </div>
                <div className="blogdetailsarticle-social-circle" role="button" tabIndex="0" aria-label="Share to Instagram">
                  <FaInstagram />
                </div>
                <div className="blogdetailsarticle-social-circle" role="button" tabIndex="0" aria-label="Share to LinkedIn">
                  <FaLinkedinIn />
                </div>
              </div>
            </div>

            <div className="blogdetailsarticle-prevnext">
              <button className="blogdetailsarticle-prev">
                <span className="blogdetailsarticle-arrow">←</span> Previous Post
              </button>

              <button className="blogdetailsarticle-next">
                Next Post <span className="blogdetailsarticle-arrow">→</span>
              </button>
            </div>

            <h3 className="blogdetailsarticle-comments-title">Comments (2)</h3>

            <div className="blogdetailsarticle-comment">
              <img
                className="blogdetailsarticle-comment-avatar"
                src={heroImg}
                alt="Patric Evra"
                loading="lazy"
              />

              <div className="blogdetailsarticle-comment-body">
                <h4 className="blogdetailsarticle-comment-name">Patric Evra</h4>
                <a href="#" className="blogdetailsarticle-comment-date">April 12, 2024 – 6:44 am</a>

                <p className="blogdetailsarticle-comment-text">
                  Duis aute irure dolor in reprehenderit in voluptate velit esse cillum dolore
                  eu occaecat cupidatat non proident, sunt in culpa qui officia deserunt.
                </p>
              </div>

              <button className="blogdetailsarticle-reply-btn">Reply</button>
            </div>

            <div className="blogdetailsarticle-comment">
              <img
                className="blogdetailsarticle-comment-avatar"
                src={heroImg}
                alt="Monica Benedict"
                loading="lazy"
              />

              <div className="blogdetailsarticle-comment-body">
                <h4 className="blogdetailsarticle-comment-name">Monica Benedict</h4>
                <a href="#" className="blogdetailsarticle-comment-date">April 10, 2024 – 7:28 am</a>

                <p className="blogdetailsarticle-comment-text">
                  Duis aute irure dolor in reprehenderit in voluptate velit esse cillum dolore
                  eu occaecat cupidatat non proident, sunt in culpa qui officia deserunt.
                </p>
              </div>

              <button className="blogdetailsarticle-reply-btn">Reply</button>
            </div>

            <h3 className="blogdetailsarticle-comment-title">Leave A Comment</h3>

            <form className="blogdetailsarticle-comment-form" onSubmit={(e) => { e.preventDefault(); }}>
              <div className="blogdetailsarticle-form-grid">
                <input type="text" placeholder="Name" />
                <input type="email" placeholder="Email" />
              </div>

              <input type="text" placeholder="Phone" className="blogdetailsarticle-form-single" />

              <textarea placeholder="Write a Comment"></textarea>

              <button type="submit" className="blogdetailsarticle-comment-submit">Post Comment</button>
            </form>
          </div>
        </section>

        {/* RIGHT SIDEBAR */}
        <aside className="blogdetailsarticle-sidebar" aria-labelledby="bda-sidebar-title">
          <form className="blogdetailsarticle-searchbox" onSubmit={handleSearch} role="search">
            <input
              id="bda-search"
              name="bda-search"
              type="search"
              className="blogdetailsarticle-search-input"
              placeholder="search"
              aria-label="Search blog"
            />

            <button type="submit" className="blogdetailsarticle-search-btn" aria-label="Search">
              <svg width="18" height="18" viewBox="0 0 24 24" aria-hidden="true" focusable="false">
                <path d="M21 20l-5.6-5.6a7 7 0 10-1 1L20 21zM4 10a6 6 0 1112 0A6 6 0 014 10z" />
              </svg>
            </button>
          </form>

          <div className="blogdetailsarticle-card">
            <h3 id="bda-sidebar-title" className="blogdetailsarticle-card-title">Categories</h3>

            <ul className="blogdetailsarticle-categories" role="list">
              {categories.map((c) => (
                <li key={c} className="blogdetailsarticle-category-item">
                  <svg
                    className="blogdetailsarticle-cat-icon"
                    width="18"
                    height="18"
                    viewBox="0 0 24 24"
                    aria-hidden="true"
                    focusable="false"
                  >
                    <path d="M10 17l5-5-5-5v10z" />
                  </svg>

                  <button
                    className="blogdetailsarticle-cat-link"
                    type="button"
                    onClick={() => handleCategoryClick(c)}
                  >
                    {c}
                  </button>
                </li>
              ))}
            </ul>
          </div>

          <div className="blogdetailsarticle-sidebar-space" aria-hidden="true" />

          <div className="blogdetailsarticle-recent-posts">
            <h4 className="blogdetailsarticle-side-heading">Recent Post</h4>

            <ul className="blogdetailsarticle-recent-list" role="list">
              <li className="blogdetailsarticle-recent-item">
                <img src={heroImg} alt="thumbnail" className="blogdetailsarticle-recent-thumb" />
                <div className="blogdetailsarticle-recent-copy">
                  <time className="blogdetailsarticle-recent-date">December 08, 2023</time>
                  <button className="blogdetailsarticle-recent-title" onClick={() => openPost(1)}>
                    Thinking out of the box: modern engineering in action
                  </button>
                </div>
              </li>

              <li className="blogdetailsarticle-recent-item">
                <img src={heroImg} alt="thumbnail" className="blogdetailsarticle-recent-thumb" />
                <div className="blogdetailsarticle-recent-copy">
                  <time className="blogdetailsarticle-recent-date">November 30, 2023</time>
                  <button className="blogdetailsarticle-recent-title" onClick={() => openPost(2)}>
                    Thinking out of the box: modern engineering in action
                  </button>
                </div>
              </li>

              <li className="blogdetailsarticle-recent-item">
                <img src={heroImg} alt="thumbnail" className="blogdetailsarticle-recent-thumb" />
                <div className="blogdetailsarticle-recent-copy">
                  <time className="blogdetailsarticle-recent-date">November 12, 2023</time>
                  <button className="blogdetailsarticle-recent-title" onClick={() => openPost(3)}>
                    Thinking out of the box: modern engineering in action
                  </button>
                </div>
              </li>
            </ul>
          </div>

          <div className="blogdetailsarticle-popular-tags">
            <h4 className="blogdetailsarticle-side-heading">Popular Tag</h4>

            <div className="blogdetailsarticle-tag-list">
              <button type="button" className="blogdetailsarticle-tag-chip">Petition</button>
              <button type="button" className="blogdetailsarticle-tag-chip">Criminal Cases</button>
              <button type="button" className="blogdetailsarticle-tag-chip">Legal Procedure</button>
              <button type="button" className="blogdetailsarticle-tag-chip">Family Law</button>
              <button type="button" className="blogdetailsarticle-tag-chip">Supreem Court</button>
              <button type="button" className="blogdetailsarticle-tag-chip">Hearing</button>
            </div>
          </div>
        </aside>
      </div>
    </main>
  );
};

export default BlogDetailsArticleSection;
