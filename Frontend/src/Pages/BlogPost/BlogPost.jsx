import React, { useState, useEffect } from "react";
import { useParams, Link, useNavigate } from "react-router-dom";
import { getPostBySlug, getRelatedPosts, posts, CATEGORIES } from "../../data/blogData";
import "./BlogPost.css";

const WP_API = "https://legalterminus.com/wp-json/wp/v2/posts";

const BlogPost = () => {
  const { slug } = useParams();
  const navigate = useNavigate();
  const post = getPostBySlug(slug);

  const [content, setContent] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(false);

  useEffect(() => {
    if (!post) { navigate("/blog", { replace: true }); return; }
    setLoading(true);
    setError(false);
    setContent(null);

    fetch(`${WP_API}?slug=${slug}&_fields=content`)
      .then((r) => r.json())
      .then((data) => {
        if (data && data[0] && data[0].content) {
          setContent(data[0].content.rendered);
        } else {
          setError(true);
        }
      })
      .catch(() => setError(true))
      .finally(() => setLoading(false));
  }, [slug]);

  if (!post) return null;

  const relatedPosts = getRelatedPosts(slug, post.category, 3);
  const recentPosts = posts.slice(0, 5);

  const currentIndex = posts.findIndex((p) => p.slug === slug);
  const prevPost = currentIndex < posts.length - 1 ? posts[currentIndex + 1] : null;
  const nextPost = currentIndex > 0 ? posts[currentIndex - 1] : null;

  return (
    <main className="blogpost-root">
      {/* Hero banner */}
      <div className="blogpost-hero" style={{ backgroundImage: `url(${post.image})` }}>
        <div className="blogpost-hero-overlay">
          <div className="blogpost-hero-inner">
            <nav className="blogpost-breadcrumb" aria-label="Breadcrumb">
              <Link to="/">Home</Link>
              <span aria-hidden="true"> / </span>
              <span>Blog</span>
              <span aria-hidden="true"> / </span>
              <span>{post.category}</span>
            </nav>
            <h1 className="blogpost-hero-title">{post.title}</h1>
            <div className="blogpost-hero-meta">
              <span className="blogpost-hero-category">{post.category}</span>
              <span className="blogpost-hero-sep">·</span>
              <time>{post.date}</time>
              <span className="blogpost-hero-sep">·</span>
              <span>Legal Terminus</span>
            </div>
          </div>
        </div>
      </div>

      {/* Body layout */}
      <div className="blogpost-body">
        {/* Main article */}
        <article className="blogpost-article">
          <div className="blogpost-featured-img-wrap">
            <img
              className="blogpost-featured-img"
              src={post.image}
              alt={post.title}
              loading="lazy"
            />
          </div>

          {loading && (
            <div className="blogpost-loading">
              <div className="blogpost-spinner" />
              <p>Loading article…</p>
            </div>
          )}

          {error && !loading && (
            <div className="blogpost-error">
              <p>
                Unable to load the full article. Read it on the{" "}
                <a
                  href={`https://legalterminus.com/${slug}/`}
                  target="_blank"
                  rel="noopener noreferrer"
                >
                  Legal Terminus website →
                </a>
              </p>
            </div>
          )}

          {content && !loading && (
            <div
              className="blogpost-content"
              dangerouslySetInnerHTML={{ __html: content }}
            />
          )}

          {/* Tags & share */}
          <div className="blogpost-footer-row">
            <div className="blogpost-tag-row">
              <span className="blogpost-tags-label">Category:</span>
              <span className="blogpost-tag-chip">{post.category}</span>
            </div>
            <div className="blogpost-share-row">
              <span className="blogpost-share-label">Share:</span>
              <a
                className="blogpost-share-link"
                href={`https://www.facebook.com/sharer/sharer.php?u=https://legal-terminus-web.web.app/blog/${slug}`}
                target="_blank"
                rel="noopener noreferrer"
                aria-label="Share on Facebook"
              >
                Facebook
              </a>
              <a
                className="blogpost-share-link"
                href={`https://www.linkedin.com/sharing/share-offsite/?url=https://legal-terminus-web.web.app/blog/${slug}`}
                target="_blank"
                rel="noopener noreferrer"
                aria-label="Share on LinkedIn"
              >
                LinkedIn
              </a>
              <a
                className="blogpost-share-link"
                href={`https://twitter.com/intent/tweet?url=https://legal-terminus-web.web.app/blog/${slug}&text=${encodeURIComponent(post.title)}`}
                target="_blank"
                rel="noopener noreferrer"
                aria-label="Share on Twitter"
              >
                Twitter
              </a>
            </div>
          </div>

          {/* Prev / Next navigation */}
          <nav className="blogpost-prevnext" aria-label="Post navigation">
            {prevPost ? (
              <Link to={`/blog/${prevPost.slug}`} className="blogpost-nav-link blogpost-nav-prev">
                <span className="blogpost-nav-arrow">←</span>
                <span className="blogpost-nav-copy">
                  <small>Previous Post</small>
                  <strong>{prevPost.title}</strong>
                </span>
              </Link>
            ) : (
              <span />
            )}
            {nextPost && (
              <Link to={`/blog/${nextPost.slug}`} className="blogpost-nav-link blogpost-nav-next">
                <span className="blogpost-nav-copy">
                  <small>Next Post</small>
                  <strong>{nextPost.title}</strong>
                </span>
                <span className="blogpost-nav-arrow">→</span>
              </Link>
            )}
          </nav>
        </article>

        {/* Sidebar */}
        <aside className="blogpost-sidebar">
          {/* Categories */}
          <div className="blogpost-sidebar-card">
            <h3 className="blogpost-sidebar-heading">Categories</h3>
            <ul className="blogpost-cat-list">
              {CATEGORIES.filter((c) => c !== "All").map((cat) => (
                <li key={cat}>
                  <Link
                    to="/blog"
                    className="blogpost-cat-link"
                    onClick={() => sessionStorage.setItem("blogCategory", cat)}
                  >
                    <span className="blogpost-cat-arrow">›</span>
                    {cat}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Recent Posts */}
          <div className="blogpost-sidebar-card">
            <h3 className="blogpost-sidebar-heading">Recent Posts</h3>
            <ul className="blogpost-recent-list">
              {recentPosts.map((p) => (
                <li key={p.id} className="blogpost-recent-item">
                  <Link to={`/blog/${p.slug}`} className="blogpost-recent-link">
                    <img
                      src={p.image}
                      alt={p.title}
                      className="blogpost-recent-thumb"
                      loading="lazy"
                    />
                    <div className="blogpost-recent-copy">
                      <time className="blogpost-recent-date">{p.date}</time>
                      <span className="blogpost-recent-title">{p.title}</span>
                    </div>
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Related Posts */}
          {relatedPosts.length > 0 && (
            <div className="blogpost-sidebar-card">
              <h3 className="blogpost-sidebar-heading">Related Posts</h3>
              <ul className="blogpost-related-list">
                {relatedPosts.map((p) => (
                  <li key={p.id}>
                    <Link to={`/blog/${p.slug}`} className="blogpost-related-link">
                      <img
                        src={p.image}
                        alt={p.title}
                        className="blogpost-related-thumb"
                        loading="lazy"
                      />
                      <div>
                        <time className="blogpost-recent-date">{p.date}</time>
                        <span className="blogpost-related-title">{p.title}</span>
                      </div>
                    </Link>
                  </li>
                ))}
              </ul>
            </div>
          )}

          {/* Read full on source */}
          <div className="blogpost-sidebar-card blogpost-sidebar-source">
            <p>Read the original article on:</p>
            <a
              href={`https://legalterminus.com/${slug}/`}
              target="_blank"
              rel="noopener noreferrer"
              className="blogpost-source-btn"
            >
              legalterminus.com →
            </a>
          </div>
        </aside>
      </div>
    </main>
  );
};

export default BlogPost;
