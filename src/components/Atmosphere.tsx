import React, { useState } from 'react';
import { ATMOSPHERE_GALLERY } from '../data/cafeData';
import { useCursor } from '../context/CursorContext';
import type { GalleryItem } from '../types';

export const Atmosphere: React.FC = () => {
  const [activeModalItem, setActiveModalItem] = useState<GalleryItem | null>(null);
  const { setCursor, resetCursor } = useCursor();

  return (
    <section className="chc-atmosphere-section" id="atmosphere" aria-label="Visual Archive of The Space">
      <div className="container">
        {/* Section Header */}
        <div className="section-header">
          <span className="section-num">06 / THE VISUAL ARCHIVE</span>
          <span className="section-caption">ATMOSPHERE • LIGHT • TACTILE DETAILS</span>
        </div>

        {/* Headline */}
        <div className="swiss-grid atmosphere-title-grid">
          <div className="col-10 col-lg-8 col-sm-12">
            <h2 className="heading-section atmosphere-main-title">
              MOMENTS OBSERVED ACROSS THE DAY.
            </h2>
          </div>
        </div>

        {/* Curated Editorial Masonry Grid */}
        <div className="atmosphere-masonry-grid">
          {ATMOSPHERE_GALLERY.map((item, idx) => (
            <div
              key={item.id}
              className={`atmosphere-card card-${item.aspect || 'portrait'}`}
              onClick={() => setActiveModalItem(item)}
              onMouseEnter={() => setCursor('open', 'EXPAND')}
              onMouseLeave={resetCursor}
            >
              <div className="atmosphere-img-wrap">
                <img
                  src={item.image}
                  alt={item.title}
                  className="atmosphere-img"
                  loading="lazy"
                />
                <div className="atmosphere-hover-overlay">
                  <span className="meta-text overlay-time">{item.time}</span>
                  <span className="overlay-plus font-mono">+</span>
                </div>
              </div>
              <div className="atmosphere-card-caption">
                <div className="atmosphere-caption-row">
                  <span className="meta-text">{String(idx + 1).padStart(2, '0')} // {item.location}</span>
                  <span className="mobile-zoom-pill meta-text">TAP TO VIEW ↗</span>
                </div>
                <h4 className="atmosphere-item-title font-display">{item.title}</h4>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Lightbox Zoom Modal */}
      {activeModalItem && (
        <div
          className="atmosphere-modal-backdrop"
          onClick={() => setActiveModalItem(null)}
          role="dialog"
          aria-modal="true"
        >
          <div className="atmosphere-modal-box" onClick={(e) => e.stopPropagation()}>
            <button
              className="modal-close-btn font-mono"
              onClick={() => setActiveModalItem(null)}
              aria-label="Close archive image view"
              onMouseEnter={() => setCursor('open', 'CLOSE')}
              onMouseLeave={resetCursor}
            >
              ✕ CLOSE
            </button>

            <div className="modal-image-holder">
              <img
                src={activeModalItem.image}
                alt={activeModalItem.title}
                className="modal-zoom-image"
              />
            </div>

            <div className="modal-caption-footer">
              <div>
                <span className="meta-text">{activeModalItem.time} • {activeModalItem.location}</span>
                <h3 className="heading-title modal-heading">{activeModalItem.title}</h3>
              </div>
              <span className="meta-text archive-tag">THE COFFEE HOUSE CO. ARCHIVE</span>
            </div>
          </div>
        </div>
      )}

      <style>{`
        .chc-atmosphere-section {
          padding-top: clamp(4.5rem, 8vw, 7.5rem);
          padding-bottom: clamp(4.5rem, 8vw, 7.5rem);
          background-color: var(--bg-canvas);
          border-bottom: 1px solid var(--border-hairline);
        }

        .atmosphere-title-grid {
          margin-bottom: clamp(2.5rem, 5vw, 4.5rem);
        }

        .atmosphere-main-title {
          letter-spacing: -0.03em;
        }

        .atmosphere-masonry-grid {
          column-count: 3;
          column-gap: 1.5rem;
        }

        @media (max-width: 900px) {
          .atmosphere-masonry-grid {
            column-count: 2;
            column-gap: 1rem;
          }
        }

        @media (max-width: 600px) {
          .atmosphere-masonry-grid {
            column-count: 1;
          }
        }

        .atmosphere-card {
          background-color: var(--bg-canvas-subtle);
          border: 1px solid var(--border-hairline);
          padding: 0.75rem;
          cursor: pointer;
          break-inside: avoid;
          margin-bottom: 1.5rem;
          transition: border-color var(--duration-fast) ease, transform 0.2s ease;
          -webkit-tap-highlight-color: transparent;
        }

        .atmosphere-card:active {
          transform: scale(0.985);
        }

        @media (hover: hover) {
          .atmosphere-card:hover {
            border-color: var(--border-strong);
          }

          .atmosphere-card:hover .atmosphere-img {
            transform: scale(1.04);
          }

          .atmosphere-card:hover .atmosphere-hover-overlay {
            opacity: 1;
          }
        }

        .atmosphere-img-wrap {
          position: relative;
          width: 100%;
          aspect-ratio: 4 / 3;
          overflow: hidden;
          background-color: #E2DDD5;
        }

        .card-tall .atmosphere-img-wrap {
          aspect-ratio: 3 / 4;
        }

        .card-square .atmosphere-img-wrap {
          aspect-ratio: 1 / 1;
        }

        .card-portrait .atmosphere-img-wrap {
          aspect-ratio: 4 / 5;
        }

        .card-landscape .atmosphere-img-wrap {
          aspect-ratio: 16 / 10;
        }

        .atmosphere-img {
          width: 100%;
          height: 100%;
          object-fit: cover;
          transition: transform 0.6s var(--ease-editorial);
        }

        .atmosphere-hover-overlay {
          position: absolute;
          inset: 0;
          background-color: rgba(17, 17, 17, 0.4);
          opacity: 0;
          display: flex;
          align-items: center;
          justify-content: space-between;
          padding: 1.25rem;
          color: var(--text-inverse);
          transition: opacity var(--duration-fast) ease;
        }

        .overlay-plus {
          font-size: 1.5rem;
        }

        .atmosphere-card-caption {
          display: flex;
          flex-direction: column;
          gap: 0.35rem;
          padding-top: 0.75rem;
          border-top: 1px solid var(--border-hairline);
          margin-top: 0.75rem;
        }

        .atmosphere-caption-row {
          display: flex;
          justify-content: space-between;
          align-items: center;
        }

        .mobile-zoom-pill {
          display: none;
          font-size: 0.625rem;
          color: var(--accent-terracotta);
          letter-spacing: 0.05em;
        }

        @media (max-width: 900px) {
          .mobile-zoom-pill {
            display: inline-block;
          }
        }

        .atmosphere-item-title {
          font-size: 1.05rem;
          font-weight: 600;
          color: var(--text-primary);
        }

        /* Modal Lightbox */
        .atmosphere-modal-backdrop {
          position: fixed;
          inset: 0;
          background-color: rgba(17, 17, 17, 0.92);
          backdrop-filter: blur(10px);
          z-index: var(--z-modal);
          display: flex;
          align-items: center;
          justify-content: center;
          padding: 2rem;
        }

        .atmosphere-modal-box {
          position: relative;
          background-color: var(--bg-canvas);
          border: 1px solid var(--border-hairline);
          max-width: 900px;
          width: 100%;
          padding: 1.5rem;
        }

        .modal-close-btn {
          position: absolute;
          top: 1.5rem;
          right: 1.5rem;
          font-size: 0.75rem;
          letter-spacing: 0.14em;
          padding: 0.4rem 0.8rem;
          border: 1px solid var(--border-hairline);
          background-color: var(--bg-canvas);
          z-index: 10;
        }

        .modal-image-holder {
          width: 100%;
          max-height: 70vh;
          overflow: hidden;
          margin-bottom: 1.25rem;
          background-color: #000;
        }

        .modal-zoom-image {
          width: 100%;
          max-height: 70vh;
          object-fit: contain;
        }

        .modal-caption-footer {
          display: flex;
          justify-content: space-between;
          align-items: flex-end;
          border-top: 1px solid var(--border-hairline);
          padding-top: 1rem;
          flex-wrap: wrap;
          gap: 1rem;
        }

        .modal-heading {
          font-size: 1.35rem;
          color: var(--text-primary);
          margin-top: 0.25rem;
        }

        .archive-tag {
          color: var(--accent-terracotta);
        }
      `}</style>
    </section>
  );
};
