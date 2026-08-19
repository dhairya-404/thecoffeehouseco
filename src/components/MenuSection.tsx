import React, { useState } from 'react';
import { MENU_CATEGORIES } from '../data/cafeData';
import { useCursor } from '../context/CursorContext';

export const MenuSection: React.FC = () => {
  const [activeCategory, setActiveCategory] = useState(0);
  const [hoveredItemImage, setHoveredItemImage] = useState<string | null>(null);
  const [mousePos, setMousePos] = useState({ x: 0, y: 0 });
  const { setCursor, resetCursor } = useCursor();

  const currentCategory = MENU_CATEGORIES[activeCategory];

  const handleMouseMove = (e: React.MouseEvent) => {
    setMousePos({ x: e.clientX, y: e.clientY });
  };

  return (
    <section
      className="chc-menu-section"
      id="menu"
      aria-label="Editorial Coffee and Food Menu"
      onMouseMove={handleMouseMove}
    >
      <div className="container">
        {/* Section Header */}
        <div className="section-header">
          <span className="section-num">04 / THE MENU</span>
          <span className="section-caption">SEASONAL EXTRACTIONS & ARTISANAL BAKEHOUSE</span>
        </div>

        {/* Headline */}
        <div className="swiss-grid menu-title-grid">
          <div className="col-8 col-lg-8 col-sm-12">
            <h2 className="heading-section menu-main-heading">
              CALIBRATED DAILY. HONEST PRICING.
            </h2>
          </div>
          <div className="col-4 col-lg-8 col-sm-12 menu-sub-desc">
            <p className="body-text">
              All drinks prepared with fresh single-origin beans roasted on-site. Milk beverages feature organic grass-fed whole milk or house-malted oat milk.
            </p>
          </div>
        </div>

        {/* Category Selector Tabs */}
        <div className="menu-category-tabs" role="tablist">
          {MENU_CATEGORIES.map((cat, idx) => (
            <button
              key={cat.id}
              role="tab"
              aria-selected={activeCategory === idx}
              type="button"
              className={`menu-tab-item ${activeCategory === idx ? 'is-active' : ''}`}
              onClick={() => setActiveCategory(idx)}
              onMouseEnter={() => setCursor('link')}
              onMouseLeave={resetCursor}
            >
              <span className="tab-idx meta-text">0{idx + 1}</span>
              <span className="tab-label font-display">{cat.title}</span>
            </button>
          ))}
        </div>

        {/* Category Description Banner */}
        <div className="menu-category-banner">
          <span className="meta-text cat-summary-tag">CATEGORY NOTE:</span>
          <p className="cat-summary-text">{currentCategory.description}</p>
        </div>

        {/* Typographic Editorial Menu List */}
        <div className="menu-editorial-list">
          {currentCategory.items.map((item, idx) => {
            const itemNum = (idx + 1).toString().padStart(2, '0');
            return (
              <div
                key={item.name}
                className="menu-list-row"
                onMouseEnter={() => {
                  setHoveredItemImage(item.image || null);
                  setCursor('link');
                }}
                onMouseLeave={() => {
                  setHoveredItemImage(null);
                  resetCursor();
                }}
              >
                <div className="menu-row-main">
                  <div className="menu-num-title">
                    <span className="menu-item-num meta-text">{itemNum}</span>
                    <h3 className="menu-item-name font-display">{item.name}</h3>
                  </div>
                  <div className="menu-leader-line"></div>
                  <span className="menu-item-price font-mono">{item.price}</span>
                </div>
                <p className="menu-item-description font-sans">{item.description}</p>
              </div>
            );
          })}
        </div>

        {/* Dietary & Origin Note Footer */}
        <div className="menu-footer-meta">
          <span className="meta-text">OAT MILK SUBSTITUTION AVAILABLE (+₹40)</span>
          <span className="meta-text">PRICES INCLUSIVE OF ALL APPLICABLE TAXES</span>
        </div>
      </div>

      {/* Floating Hover Image Preview (Desktop Only) */}
      {hoveredItemImage && (
        <div
          className="menu-floating-preview"
          style={{
            transform: `translate3d(${mousePos.x + 24}px, ${mousePos.y - 120}px, 0)`,
          }}
        >
          <img
            src={hoveredItemImage}
            alt="Menu item preview"
            className="menu-preview-img"
            onError={(e) => {
              // Fallback to signature cup if image not found
              (e.target as HTMLImageElement).src = '/assets/brand/coffee-cup/chc_signature_cup_front.jpg';
            }}
          />
        </div>
      )}

      <style>{`
        .chc-menu-section {
          padding-top: clamp(4.5rem, 8vw, 7.5rem);
          padding-bottom: clamp(4.5rem, 8vw, 7.5rem);
          background-color: var(--bg-canvas);
          border-bottom: 1px solid var(--border-hairline);
          position: relative;
        }

        .menu-title-grid {
          margin-bottom: clamp(2.5rem, 5vw, 4.5rem);
          align-items: end;
          row-gap: 1.5rem;
        }

        .menu-main-heading {
          letter-spacing: -0.035em;
        }

        .menu-sub-desc {
          color: var(--text-secondary);
        }

        .menu-category-tabs {
          display: flex;
          border-top: 1px solid var(--border-hairline);
          border-bottom: 1px solid var(--border-hairline);
          margin-bottom: 2rem;
          overflow-x: auto;
          scrollbar-width: none;
        }

        .menu-category-tabs::-webkit-scrollbar {
          display: none;
        }

        .menu-tab-item {
          flex: 1;
          min-width: 170px;
          display: flex;
          align-items: baseline;
          gap: 0.65rem;
          padding: 1.15rem 1.25rem;
          border-right: 1px solid var(--border-hairline);
          color: var(--text-muted);
          transition: all var(--duration-fast) ease;
          text-align: left;
        }

        .menu-tab-item:last-child {
          border-right: none;
        }

        .menu-tab-item.is-active {
          background-color: var(--bg-canvas-subtle);
          color: var(--text-primary);
        }

        .menu-tab-item.is-active .tab-idx {
          color: var(--accent-terracotta);
        }

        .tab-label {
          font-size: 0.95rem;
          font-weight: 600;
          letter-spacing: 0.04em;
        }

        .menu-category-banner {
          display: flex;
          align-items: baseline;
          gap: 1rem;
          padding-bottom: 1.5rem;
          margin-bottom: 1.5rem;
          border-bottom: 1px solid var(--border-hairline);
          flex-wrap: wrap;
        }

        .cat-summary-tag {
          color: var(--accent-terracotta);
        }

        .cat-summary-text {
          font-size: var(--text-small);
          color: var(--text-secondary);
          font-style: italic;
        }

        /* Typographic Menu Rows */
        .menu-editorial-list {
          display: flex;
          flex-direction: column;
        }

        .menu-list-row {
          padding: 1.35rem 0;
          border-bottom: 1px solid var(--border-hairline);
          transition: background-color var(--duration-fast) ease, padding-left var(--duration-fast) ease;
          cursor: pointer;
        }

        .menu-list-row:hover {
          background-color: rgba(17, 17, 17, 0.02);
          padding-left: 0.75rem;
        }

        .menu-row-main {
          display: flex;
          align-items: baseline;
          justify-content: space-between;
          gap: 1.5rem;
          margin-bottom: 0.4rem;
        }

        .menu-num-title {
          display: flex;
          align-items: baseline;
          gap: 1rem;
        }

        .menu-item-num {
          color: var(--accent-terracotta);
          width: 24px;
        }

        .menu-item-name {
          font-size: clamp(1.2rem, 1.8vw, 1.6rem);
          font-weight: 600;
          letter-spacing: -0.02em;
          color: var(--text-primary);
        }

        .menu-leader-line {
          flex-grow: 1;
          height: 1px;
          border-bottom: 1px dotted var(--border-medium);
          margin: 0 0.5rem;
        }

        @media (max-width: 640px) {
          .menu-leader-line {
            display: none;
          }
        }

        .menu-item-price {
          font-size: 1.1rem;
          font-weight: 700;
          color: var(--text-primary);
          white-space: nowrap;
        }

        .menu-item-description {
          font-size: 0.9rem;
          color: var(--text-muted);
          padding-left: 2.5rem;
          max-width: 680px;
        }

        @media (max-width: 640px) {
          .menu-item-description {
            padding-left: 0;
          }
        }

        .menu-footer-meta {
          display: flex;
          justify-content: space-between;
          padding-top: 2rem;
          flex-wrap: wrap;
          gap: 1rem;
        }

        /* Floating Preview */
        .menu-floating-preview {
          position: fixed;
          top: 0;
          left: 0;
          width: 220px;
          height: 160px;
          pointer-events: none;
          z-index: var(--z-modal);
          border: 1px solid var(--border-strong);
          background-color: var(--bg-canvas-dark);
          box-shadow: 0 16px 36px rgba(0, 0, 0, 0.2);
          overflow: hidden;
          transition: transform 0.1s linear;
        }

        @media (max-width: 1024px) {
          .menu-floating-preview {
            display: none;
          }
        }

        .menu-preview-img {
          width: 100%;
          height: 100%;
          object-fit: cover;
        }
      `}</style>
    </section>
  );
};
