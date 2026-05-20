import React, { useState } from "react";
import { Link } from "react-router-dom";
import { posts, CATEGORIES } from "../../data/blogData";
import "./BlogPage.css";

const PAGE_SIZE = 9;

const BlogPage = () => {
  const [activeCategory, setActiveCategory] = useState("All");
  const [currentPage, setCurrentPage] = useState(1);
  const [email, setEmail] = useState("");

  const filtered =
    activeCategory === "All"
      ? posts
      : posts.filter((p) => p.category === activeCategory);

  const totalPages = Math.ceil(filtered.length / PAGE_SIZE);
  const paginated = filtered.slice(
    (currentPage - 1) * PAGE_SIZE,
    currentPage * PAGE_SIZE
  );

  const handleCategoryClick = (cat) => {
    setActiveCategory(cat);
    setCurrentPage(1);
  };

  const handlePageChange = (page) => {
    setCurrentPage(page);
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  return (
    <section className="blogpage-root">
      {/* Category Filter Tabs */}
      <div className="blogpage-filters-wrap">
        <div className="blogpage-filters">
          {CATEGORIES.map((cat) => (
            <button
              key={cat}
              className={`blogpage-filter-btn${activeCategory === cat ? " active" : ""}`}
              onClick={() => handleCategoryClick(cat)}
            >
              {cat}
            </button>
          ))}
        </div>
      </div>

      {/* Blog Grid */}
      <div className="blogpage-grid-wrap">
        <div className="blogpage-grid">
          {paginated.map((post) => (
            <article key={post.id} className="blogpage-card">
              <Link
                to={`/blog/${post.slug}`}
                className="blogpage-card-link"
                aria-label={post.title}
              >
                <div className="blogpage-card-media">
                  <img
                    className="blogpage-card-image"
                    src={post.image}
                    alt={post.title}
                    loading="lazy"
                  />
                  <div className="blogpage-tags">
                    <span className="blogpage-tag">{post.category}</span>
                  </div>
                </div>

                <div className="blogpage-card-body">
                  <time className="blogpage-date">{post.date}</time>
                  <h3 className="blogpage-title">{post.title}</h3>
                  <p className="blogpage-excerpt">{post.excerpt}</p>
                  <span className="blogpage-read-more">Read More →</span>
                </div>
              </Link>
            </article>
          ))}
        </div>

        {/* Pagination */}
        {totalPages > 1 && (
          <nav className="blogpage-pagination" aria-label="Blog pagination">
            <button
              className="blogpage-page-btn"
              onClick={() => handlePageChange(currentPage - 1)}
              disabled={currentPage === 1}
              aria-label="Previous page"
            >
              ←
            </button>

            {Array.from({ length: totalPages }, (_, i) => i + 1).map((page) => (
              <button
                key={page}
                className={`blogpage-page-btn${currentPage === page ? " active" : ""}`}
                onClick={() => handlePageChange(page)}
                aria-current={currentPage === page ? "page" : undefined}
              >
                {page}
              </button>
            ))}

            <button
              className="blogpage-page-btn"
              onClick={() => handlePageChange(currentPage + 1)}
              disabled={currentPage === totalPages}
              aria-label="Next page"
            >
              →
            </button>
          </nav>
        )}
      </div>

      <hr className="blogpage-divider" />

      {/* Newsletter */}
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
            value={email}
            onChange={(e) => setEmail(e.target.value)}
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
