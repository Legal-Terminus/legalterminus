import React, { useState } from "react";
import { Link } from "react-router-dom";
import { posts, CATEGORIES } from "../../data/blogData";
import "./BlogPage.css";

const PAGE_SIZE = 4;
const VISIBLE_PAGES = 5;

const BlogPage = () => {
  const [activeCategory, setActiveCategory] = useState("All");
  const [currentPage, setCurrentPage] = useState(1);

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

  // Sliding window of 5 page numbers centred on current page
  const getVisiblePages = () => {
    if (totalPages <= VISIBLE_PAGES) {
      return Array.from({ length: totalPages }, (_, i) => i + 1);
    }
    let start = Math.max(1, currentPage - Math.floor(VISIBLE_PAGES / 2));
    let end = start + VISIBLE_PAGES - 1;
    if (end > totalPages) {
      end = totalPages;
      start = Math.max(1, end - VISIBLE_PAGES + 1);
    }
    return Array.from({ length: end - start + 1 }, (_, i) => start + i);
  };

  const visiblePages = getVisiblePages();

  return (
    <section className="blogpage-root">
      {/* Top bar: Category tabs + Pagination — both centred */}
      <div className="blogpage-topbar-wrap">
        <div className="blogpage-topbar">
          {/* Category Filter Tabs */}
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

          {/* Pagination — 5 numbers + next arrow */}
          {totalPages > 1 && (
            <nav className="blogpage-pagination" aria-label="Blog pagination">
              {visiblePages.map((page) => (
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
                className="blogpage-page-btn blogpage-page-arrow"
                onClick={() => handlePageChange(Math.min(currentPage + 1, totalPages))}
                disabled={currentPage === totalPages}
                aria-label="Next page"
              >
                →
              </button>
            </nav>
          )}
        </div>
      </div>

      {/* Blog Grid — 4 cards, centered */}
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
      </div>
    </section>
  );
};

export default BlogPage;
