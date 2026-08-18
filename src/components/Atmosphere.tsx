import React, { useState } from 'react';
import { ATMOSPHERE_GALLERY } from '../data/cafeData';
import { useCursor } from '../context/CursorContext';
import type { GalleryItem } from '../types';

export const Atmosphere: React.FC = () => {
  const [activeModalItem, setActiveModalItem] = useState<GalleryItem | null>(null);
  const { setCursor, resetCursor } = useCursor();

  return (
    <section id="atmosphere" className="atmosphere-section" aria-label="Atmosphere and Visual Journal">
      <div className="container">
        {/* Section Header */}
        <div className="atmosphere-header">
          <div>
            <span className="label-caps">VISUAL CHRONICLE</span>
            <h2 className="heading-1 atmosphere-heading">
              ATMOSPHERE <span className="font-editorial italic">& LIGHT.</span>
            </h2>
          </div>
          <div className="atmosphere-meta-text">
            <p className="body-lead">
              A photographic journal documenting sunlight across linen tables, the morning steam, and the slow rhythm of the riverfront.
            </p>
          </div>
        </div>

        {/* Masonry Editorial Grid */}
        <div className="atmosphere-grid">
          {ATMOSPHERE_GALLERY.map((item) => (
            <div
              key={item.id}
              className={`gallery-card aspect-${item.aspect}`}
              onClick={() => setActiveModalItem(item)}
              onMouseEnter={() => setCursor('view', 'VIEW')}
              onMouseLeave={resetCursor}
              role="button"
              tabIndex={0}
            >
              <div className="gallery-img-wrap">
                <img
                  src={item.image}
                  alt={item.title}
                  className="gallery-photo"
                  loading="lazy"
                />
                <div className="gallery-overlay">
                  <div className="overlay-top-tag">
                    <span className="time-badge">{item.time}</span>
                    <span className="loc-badge">{item.location}</span>
                  </div>
                  <div className="overlay-bottom-title">
                    <h3 className="card-item-title">{item.title}</h3>
                    <span className="view-indicator">+</span>
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Lightbox Modal */}
      {activeModalItem && (
        <div className="gallery-modal" onClick={() => setActiveModalItem(null)}>
          <div className="modal-backdrop"></div>
          <div className="modal-content-box" onClick={(e) => e.stopPropagation()}>
            <button
              className="modal-close-btn"
              onClick={() => setActiveModalItem(null)}
              aria-label="Close image modal"
            >
              ✕
            </button>
            <div className="modal-img-frame">
              <img src={activeModalItem.image} alt={activeModalItem.title} className="modal-full-img" />
            </div>
            <div className="modal-info-bar">
              <div>
                <span className="modal-time">{activeModalItem.time} • {activeModalItem.location}</span>
                <h4 className="modal-title">{activeModalItem.title}</h4>
              </div>
              <span className="modal-brand">EMBER & BEAN ARCHIVE</span>
            </div>
          </div>
        </div>
      )}

      <style>{`
        .atmosphere-section {
          position: relative;
          background-color: var(--bg-primary);
          padding-top: clamp(6rem, 10vw, 10rem);
          padding-bottom: clamp(6rem, 10vw, 10rem);
        }

        .atmosphere-header {
          display: grid;
          grid-template-columns: 1fr;
          gap: 2rem;
          margin-bottom: 4rem;
          align-items: flex-end;
        }

        @media (min-width: 900px) {
          .atmosphere-header {
            grid-template-columns: 1.2fr 1fr;
          }
        }

        .atmosphere-heading {
          margin-top: 0.5rem;
          color: var(--text-primary);
        }

        /* Editorial Asymmetric Grid */
        .atmosphere-grid {
          display: grid;
          grid-template-columns: 1fr;
          gap: 1.5rem;
        }

        @media (min-width: 640px) {
          .atmosphere-grid {
            grid-template-columns: repeat(2, 1fr);
          }
        }

        @media (min-width: 1024px) {
          .atmosphere-grid {
            grid-template-columns: repeat(3, 1fr);
            gap: 2rem;
          }
        }

        .gallery-card {
          position: relative;
          border-radius: 4px;
          overflow: hidden;
          background-color: #171310;
          cursor: pointer;
        }

        .gallery-img-wrap {
          position: relative;
          width: 100%;
          overflow: hidden;
        }

        .aspect-tall .gallery-img-wrap {
          padding-bottom: 135%;
        }

        .aspect-portrait .gallery-img-wrap {
          padding-bottom: 120%;
        }

        .aspect-square .gallery-img-wrap {
          padding-bottom: 100%;
        }

        .aspect-landscape .gallery-img-wrap {
          padding-bottom: 80%;
        }

        .gallery-photo {
          position: absolute;
          inset: 0;
          width: 100%;
          height: 100%;
          object-fit: cover;
          filter: grayscale(15%) brightness(0.9);
          transition: transform 0.8s cubic-bezier(0.16, 1, 0.3, 1), filter 0.5s ease;
        }

        .gallery-card:hover .gallery-photo {
          transform: scale(1.06);
          filter: grayscale(0%) brightness(1);
        }

        .gallery-overlay {
          position: absolute;
          inset: 0;
          display: flex;
          flex-direction: column;
          justify-content: space-between;
          padding: 1.5rem;
          background: linear-gradient(
            180deg,
            rgba(15, 12, 10, 0.4) 0%,
            transparent 40%,
            rgba(15, 12, 10, 0.8) 100%
          );
          opacity: 0.9;
          transition: opacity 0.3s ease;
        }

        .overlay-top-tag {
          display: flex;
          justify-content: space-between;
          align-items: center;
        }

        .time-badge {
          font-size: var(--text-2xs);
          letter-spacing: 0.15em;
          color: var(--accent-copper);
          font-weight: 600;
          background: rgba(15, 12, 10, 0.7);
          padding: 0.25rem 0.6rem;
          border-radius: 4px;
        }

        .loc-badge {
          font-size: 0.625rem;
          letter-spacing: 0.15em;
          color: var(--text-muted);
          text-transform: uppercase;
        }

        .overlay-bottom-title {
          display: flex;
          justify-content: space-between;
          align-items: baseline;
        }

        .card-item-title {
          font-family: var(--font-serif);
          font-size: 1.25rem;
          color: var(--text-primary);
          letter-spacing: -0.01em;
        }

        .view-indicator {
          font-size: 1.5rem;
          color: var(--accent-copper);
          line-height: 1;
        }

        /* Modal Lightbox */
        .gallery-modal {
          position: fixed;
          inset: 0;
          z-index: var(--z-modal);
          display: flex;
          align-items: center;
          justify-content: center;
          padding: 2rem;
        }

        .modal-backdrop {
          position: absolute;
          inset: 0;
          background-color: rgba(10, 8, 7, 0.92);
          backdrop-filter: blur(16px);
        }

        .modal-content-box {
          position: relative;
          z-index: 2;
          max-width: 900px;
          width: 100%;
          background-color: #171310;
          border: 1px solid var(--border-light);
          border-radius: 6px;
          overflow: hidden;
          box-shadow: 0 30px 80px rgba(0, 0, 0, 0.8);
        }

        .modal-close-btn {
          position: absolute;
          top: 1rem;
          right: 1rem;
          width: 36px;
          height: 36px;
          border-radius: 50%;
          background: rgba(15, 12, 10, 0.8);
          border: 1px solid var(--border-light);
          color: #FFF;
          display: flex;
          align-items: center;
          justify-content: center;
          z-index: 10;
          cursor: pointer;
        }

        .modal-img-frame {
          max-height: 70vh;
          overflow: hidden;
          background: #000;
        }

        .modal-full-img {
          width: 100%;
          height: 100%;
          object-fit: contain;
          max-height: 70vh;
        }

        .modal-info-bar {
          padding: 1.5rem 2rem;
          display: flex;
          justify-content: space-between;
          align-items: center;
          background: #1B1613;
          border-top: 1px solid var(--border-light);
        }

        .modal-time {
          font-size: var(--text-xs);
          letter-spacing: 0.15em;
          color: var(--accent-copper);
          display: block;
          margin-bottom: 0.25rem;
        }

        .modal-title {
          font-family: var(--font-serif);
          font-size: 1.35rem;
          color: var(--text-primary);
        }

        .modal-brand {
          font-size: var(--text-2xs);
          letter-spacing: 0.2em;
          color: var(--text-muted);
        }
      `}</style>
    </section>
  );
};
