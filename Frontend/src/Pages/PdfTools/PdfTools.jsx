import React, { useLayoutEffect } from 'react'
import './PdfTools.css'

const toolFiles = {
  merge: 'pdf-merge-tool.html',
  split: 'pdf-split-tool.html',
  compress: 'pdf-compress-tool.html',
  'pdf-to-jpg': 'pdf-to-jpg-tool.html',
  'jpg-to-pdf': 'jpg-to-pdf-tool.html',
  ocr: 'ocr_pdf_tool.html',
  rotate: 'rotate-pdf-tool.html',
}

const Arrow = () => (
  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
    <path d="M5 12h14" />
    <path d="m12 5 7 7-7 7" />
  </svg>
)

const tools = [
  {
    key: 'merge',
    title: 'Merge PDF',
    description: 'Combine multiple PDFs into one file, arranged in exactly the order you want.',
    icon: (
      <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
        <path d="M10.6 13.4a4 4 0 0 0 5.7 0l3-3a4 4 0 1 0-5.7-5.7l-1.5 1.5" />
        <path d="M13.4 10.6a4 4 0 0 0-5.7 0l-3 3a4 4 0 1 0 5.7 5.7l1.5-1.5" />
      </svg>
    ),
  },
  {
    key: 'split',
    title: 'Split PDF',
    description: 'Separate one document into independent files by page range or extract single pages.',
    icon: (
      <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
        <circle cx="6" cy="6" r="3" />
        <circle cx="6" cy="18" r="3" />
        <path d="M20 4 8.12 15.88" />
        <path d="M14.47 14.48 20 20" />
        <path d="M8.12 8.12 12 12" />
      </svg>
    ),
  },
  {
    key: 'compress',
    title: 'Compress PDF',
    description: 'Reduce file size for easy sharing and upload — without losing visible quality.',
    icon: (
      <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
        <path d="M9 9 4 4" /><path d="M9 4v5H4" />
        <path d="m15 9 5-5" /><path d="M15 4v5h5" />
        <path d="m9 15-5 5" /><path d="M9 20v-5H4" />
        <path d="m15 15 5 5" /><path d="M15 20v-5h5" />
      </svg>
    ),
  },
  {
    key: 'pdf-to-jpg',
    title: 'PDF to JPG',
    description: 'Convert each PDF page into a high-resolution JPG image in a single click.',
    icon: (
      <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
        <rect x="3" y="4" width="18" height="16" rx="2" />
        <circle cx="9" cy="10" r="2" />
        <path d="m21 16-5-5L5 20" />
      </svg>
    ),
  },
  {
    key: 'jpg-to-pdf',
    title: 'JPG to PDF',
    description: 'Turn your JPG, PNG, and other images into one clean, shareable PDF document.',
    icon: (
      <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
        <rect x="3" y="4" width="14" height="14" rx="2" />
        <circle cx="8" cy="9" r="1.6" />
        <path d="m3 15 4-4 5 5" />
        <path d="M14 21h5a2 2 0 0 0 2-2v-9" />
      </svg>
    ),
  },
  {
    key: 'ocr',
    title: 'OCR PDF',
    description: 'Turn scanned images into selectable, searchable text you can copy and edit.',
    icon: (
      <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
        <circle cx="11" cy="11" r="7" />
        <path d="m21 21-4.3-4.3" />
        <path d="M9 11h4" /><path d="M11 9v4" />
      </svg>
    ),
  },
  {
    key: 'rotate',
    title: 'Rotate PDF',
    description: 'Easily rotate individual pages or entire documents to the correct orientation.',
    icon: (
      <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
        <path d="M21 12a9 9 0 1 1-3-6.7" />
        <path d="M21 4v5h-5" />
      </svg>
    ),
  },
]

const PdfTools = () => {
  // The page is lazy-loaded, so the footer briefly sits at the top while the
  // chunk loads. When the hero content mounts ABOVE it, the browser's scroll
  // anchoring drags the view down to keep the footer in place. Disabling scroll
  // anchoring for the duration this page is mounted stops that jump at the
  // source (no visible flick to the footer), and we pin the view to the top.
  useLayoutEffect(() => {
    const html = document.documentElement
    const prevAnchor = html.style.overflowAnchor
    // Disable anchoring BEFORE the browser paints this mount, so inserting the
    // hero above the footer never shifts the scroll position.
    html.style.overflowAnchor = 'none'
    window.scrollTo(0, 0)
    const raf = requestAnimationFrame(() => window.scrollTo(0, 0))
    return () => {
      cancelAnimationFrame(raf)
      html.style.overflowAnchor = prevAnchor
    }
  }, [])

  return (
    <div className="pdf-tools-page">
      {/* Banner */}
      <section className="pt-banner">
        <div className="pt-banner-content">
          <span className="pt-banner-badge">Free Tools</span>
          <h1>All-in-One PDF Tools</h1>
          <p>Simple, Fast, and Free</p>
          <span className="pt-banner-divider" aria-hidden="true"></span>
          <p className="pt-banner-sub">
            Everything you need for PDFs, made simple. 100% free tools to merge, split, compress,
            convert, run OCR, and rotate your files instantly.
          </p>
        </div>
      </section>

      {/* Tools grid */}
      <section className="pt-tools">
        <div className="pt-container">
          <div className="pt-grid">
            {tools.map((tool) => (
              <article key={tool.key} className="pt-card">
                <div className="pt-card-icon">{tool.icon}</div>
                <h3>{tool.title}</h3>
                <p>{tool.description}</p>
                <a className="pt-card-btn" href={`/tools/${toolFiles[tool.key]}`}>
                  Open Tool <Arrow />
                </a>
              </article>
            ))}
          </div>
        </div>
      </section>
    </div>
  )
}

export default PdfTools
