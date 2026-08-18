import React, { useState } from 'react';
import { MENU_CATEGORIES } from '../data/cafeData';
import { useCursor } from '../context/CursorContext';
import { MagneticButton } from './MagneticButton';

export const MenuSection: React.FC = () => {
  const [activeCategoryId, setActiveCategoryId] = useState('espresso');
  const { setCursor, resetCursor } = useCursor();

  const currentCategory = MENU_CATEGORIES.find((c) => c.id === activeCategoryId) || MENU_CATEGORIES[0];

  return (
    <section id="menu" className="menu-section section-cream" aria-label="Café Menu">
      <div className="container">
        {/* Editorial Section Header */}
        <div className="menu-header-row">
          <div className="menu-title-block">
            <span className="label-caps-dark">CURATED OFFERINGS</span>
            <h2 className="heading-1 menu-main-heading">
              THE <span className="font-editorial italic">DAILY</span> TASTING.
            </h2>
          </div>
          <div className="menu-header-note">
            <p className="body-lead-dark">
              All milk drinks prepared with single-estate whole milk or house-made toasted oat milk. Pastries baked fresh at 6:30 AM daily.
            </p>
          </div>
        </div>

        {/* Category Navigation Pills */}
        <div className="menu-category-tabs" role="tablist">
          {MENU_CATEGORIES.map((cat) => (
            <button
              key={cat.id}
              role="tab"
              aria-selected={activeCategoryId === cat.id}
              className={`menu-pill-btn ${activeCategoryId === cat.id ? 'is-active' : ''}`}
              onClick={() => setActiveCategoryId(cat.id)}
              onMouseEnter={() => setCursor('link')}
              onMouseLeave={resetCursor}
            >
              <span>{cat.title}</span>
            </button>
          ))}
        </div>

        {/* Category Description Banner */}
        <div className="category-meta-banner">
          <span className="cat-desc-text">{currentCategory.description}</span>
          <span className="cat-tax-note">ALL TAXES INCLUSIVE • GST 5%</span>
        </div>

        {/* Editorial Menu Item List */}
        <div className="menu-items-grid">
          {currentCategory.items.map((item, idx) => (
            <div
              key={item.name}
              className="menu-item-row"
              onMouseEnter={() => setCursor('open', 'SELECT')}
              onMouseLeave={resetCursor}
            >
              {item.image && (
                <div className="item-thumb-frame">
                  <img
                    src={item.image}
                    alt={item.name}
                    className="item-thumb-img"
                    loading="lazy"
                  />
                </div>
              )}
              <div className="item-details-body">
                <div className="item-main-line">
                  <div className="item-title-wrap">
                    <span className="item-index">{(idx + 1).toString().padStart(2, '0')}</span>
                    <h3 className="item-name">{item.name}</h3>
                  </div>
                  <div className="item-line-connector"></div>
                  <div className="item-price-badge">{item.price}</div>
                </div>
                <p className="item-description-p">{item.description}</p>
              </div>
            </div>
          ))}
        </div>

        {/* Bottom Note & Allergy Notice */}
        <div className="menu-footer-bar">
          <div className="allergy-info">
            <span className="allergy-icon">✦</span>
            <span>House-made vegan oat milk & gluten-friendly bakery items available upon request.</span>
          </div>

          <MagneticButton
            className="btn-magnetic btn-outline-dark"
            cursorText="PDF"
            onClick={() => alert('Full Seasonal Tasting Guide & Roaster Notes will be provided at your table.')}
          >
            DOWNLOAD TASTING CARD ↓
          </MagneticButton>
        </div>
      </div>

      <style>{`
        .menu-section {
          position: relative;
          background-color: var(--bg-cream);
          color: var(--text-dark);
          padding-top: clamp(6rem, 11vw, 11rem);
          padding-bottom: clamp(6rem, 11vw, 11rem);
        }

        .label-caps-dark {
          font-family: var(--font-sans);
          font-size: var(--text-xs);
          letter-spacing: 0.22em;
          text-transform: uppercase;
          font-weight: 600;
          color: #B86338;
        }

        .menu-header-row {
          display: grid;
          grid-template-columns: 1fr;
          gap: 2rem;
          margin-bottom: 3.5rem;
          align-items: flex-end;
        }

        @media (min-width: 900px) {
          .menu-header-row {
            grid-template-columns: 1.2fr 1fr;
          }
        }

        .menu-main-heading {
          margin-top: 0.5rem;
          color: var(--text-dark);
          letter-spacing: -0.02em;
        }

        .menu-category-tabs {
          display: flex;
          flex-wrap: wrap;
          gap: 0.75rem;
          margin-bottom: 2.5rem;
          border-bottom: 1px solid var(--border-dark);
          padding-bottom: 1.5rem;
        }

        .menu-pill-btn {
          padding: 0.65rem 1.4rem;
          border-radius: 9999px;
          font-size: var(--text-xs);
          letter-spacing: 0.16em;
          font-weight: 600;
          text-transform: uppercase;
          color: var(--text-dark-secondary);
          background-color: transparent;
          border: 1px solid var(--border-dark);
          transition: all 0.3s ease;
        }

        .menu-pill-btn.is-active {
          background-color: var(--text-dark);
          color: var(--bg-cream);
          border-color: var(--text-dark);
        }

        .category-meta-banner {
          display: flex;
          flex-direction: column;
          gap: 0.5rem;
          justify-content: space-between;
          padding: 1rem 1.5rem;
          background-color: rgba(20, 16, 14, 0.04);
          border-radius: 4px;
          margin-bottom: 3rem;
          font-size: var(--text-xs);
          color: var(--text-dark-secondary);
        }

        @media (min-width: 768px) {
          .category-meta-banner {
            flex-direction: row;
            align-items: center;
          }
        }

        .cat-desc-text {
          font-style: italic;
          font-family: var(--font-editorial);
          font-size: 0.95rem;
        }

        .cat-tax-note {
          letter-spacing: 0.15em;
          font-size: 0.6875rem;
          color: #7A7067;
        }

        .menu-items-grid {
          display: grid;
          grid-template-columns: 1fr;
          gap: 2rem;
          margin-bottom: 4rem;
        }

        @media (min-width: 900px) {
          .menu-items-grid {
            grid-template-columns: 1fr 1fr;
            gap: 2.5rem 4rem;
          }
        }

        .menu-item-row {
          position: relative;
          padding: 1.25rem 0;
          border-bottom: 1px dashed rgba(20, 16, 14, 0.15);
          transition: transform 0.3s ease;
          display: flex;
          align-items: center;
          gap: 1.25rem;
        }

        .menu-item-row:hover {
          transform: translateX(4px);
        }

        .item-thumb-frame {
          position: relative;
          width: 72px;
          height: 72px;
          flex-shrink: 0;
          border-radius: 8px;
          overflow: hidden;
          background-color: #171310;
          box-shadow: 0 4px 14px rgba(20, 16, 14, 0.12);
          border: 1px solid rgba(20, 16, 14, 0.1);
        }

        .item-thumb-img {
          width: 100%;
          height: 100%;
          object-fit: cover;
          transition: transform 0.5s cubic-bezier(0.16, 1, 0.3, 1);
        }

        .menu-item-row:hover .item-thumb-img {
          transform: scale(1.1);
        }

        .item-details-body {
          flex: 1;
          min-width: 0;
        }

        .item-main-line {
          display: flex;
          align-items: baseline;
          gap: 0.75rem;
          margin-bottom: 0.35rem;
        }

        .item-title-wrap {
          display: flex;
          align-items: baseline;
          gap: 0.6rem;
          white-space: nowrap;
        }

        .item-index {
          font-size: var(--text-2xs);
          color: #B86338;
          font-weight: 600;
          letter-spacing: 0.1em;
        }

        .item-name {
          font-family: var(--font-serif);
          font-size: 1.15rem;
          color: var(--text-dark);
          letter-spacing: -0.01em;
        }

        .item-line-connector {
          flex: 1;
          height: 1px;
          background-color: rgba(20, 16, 14, 0.12);
        }

        .item-price-badge {
          font-family: var(--font-serif);
          font-size: 1.1rem;
          color: #B86338;
          font-weight: 600;
          white-space: nowrap;
        }

        .item-description-p {
          font-size: 0.85rem;
          line-height: 1.5;
          color: #61574E;
          padding-left: 1.5rem;
          max-width: 95%;
        }

        .menu-footer-bar {
          display: flex;
          flex-direction: column;
          gap: 1.5rem;
          justify-content: space-between;
          align-items: flex-start;
          border-top: 1px solid var(--border-dark);
          padding-top: 2rem;
        }

        @media (min-width: 768px) {
          .menu-footer-bar {
            flex-direction: row;
            align-items: center;
          }
        }

        .allergy-info {
          display: flex;
          align-items: center;
          gap: 0.6rem;
          font-size: var(--text-xs);
          color: #6B6258;
        }

        .allergy-icon {
          color: #B86338;
        }
      `}</style>
    </section>
  );
};
