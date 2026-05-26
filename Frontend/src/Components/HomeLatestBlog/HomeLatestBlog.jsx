import React from "react";
import { Link } from "react-router-dom";
import { posts } from "../../data/blogData";
import "./HomeLatestBlog.css";

const FEATURED_COUNT = 3;

const HomeLatestBlog = () => {
  const featured = posts.slice(0, FEATURED_COUNT);

  return (
    <section className="hlb-section">
      <div className="hlb-container">

        {/* Heading */}
        <div className="hlb-header">
          <span className="hlb-subtitle">VISITING OUR BLOG</span>
          <h2 className="hlb-title">
            Latest News &amp; Articles From<br />Legal Terminus
          </h2>
          <p className="hlb-subdesc">
            Stay informed with the latest legal insights, compliance updates, taxation news,
            and expert guidance curated by the Legal Terminus team.
          </p>
        </div>

        {/* Cards Grid */}
        <div className="hlb-grid">
          {featured.map((post) => (
            <Link
              key={post.id}
              to={`/blog/${post.slug}`}
              className="hlb-card-link"
            >
              <article className="hlb-card">
                {/* Image */}
                <div className="hlb-card-media">
                  <img
                    src={post.image}
                    alt={post.title}
                    className="hlb-card-image"
                    loading="lazy"
                  />
                  <span className="hlb-card-tag">{post.category}</span>
                </div>

                {/* Body */}
                <div className="hlb-card-body">
                  <time className="hlb-card-date">{post.date}</time>
                  <h3 className="hlb-card-title">{post.title}</h3>
                  <p className="hlb-card-excerpt">{post.excerpt}</p>
                  <span className="hlb-read-more">Read More →</span>
                </div>
              </article>
            </Link>
          ))}
        </div>

        {/* View All */}
        <div className="hlb-view-all-wrap">
          <Link to="/blog" className="hlb-view-all-btn">
            View All Articles
          </Link>
        </div>

      </div>
    </section>
  );
};

export default HomeLatestBlog;
