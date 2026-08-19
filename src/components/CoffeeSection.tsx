import React, { useState } from 'react';
import { COFFEE_FEATURES } from '../data/cafeData';
import { useCursor } from '../context/CursorContext';

export const CoffeeSection: React.FC = () => {
  const [selectedFeature, setSelectedFeature] = useState(0);
  const { setCursor, resetCursor } = useCursor();

  const currentCoffee = COFFEE_FEATURES[selectedFeature];

  return (
    <section className="chc-craft-section dark-chapter" id="craft" aria-label="The Craft of Extraction">
      <div className="container">
        {/* Section Header */}
        <div className="section-header">
          <span className="section-num">03 / THE CRAFT</span>
          <span className="section-caption">SINGLE ESTATE MICRO-LOTS & EXTRACTION</span>
        </div>

        {/* Grand Craft Statement */}
        <div className="swiss-grid craft-headline-grid">
          <div className="col-10 col-lg-8 col-sm-12">
            <h2 className="heading-hero craft-hero-title">
              GOOD COFFEE IS A MATTER OF ATTENTION.
            </h2>
          </div>
        </div>

        {/* Feature Navigation Tabs in Swiss Style */}
        <div className="craft-selector-bar">
          {COFFEE_FEATURES.map((item, idx) => (
            <button
              key={item.id}
              type="button"
              className={`craft-tab-btn ${selectedFeature === idx ? 'is-active' : ''}`}
              onClick={() => setSelectedFeature(idx)}
              onMouseEnter={() => setCursor('link')}
              onMouseLeave={resetCursor}
            >
              <span className="tab-num meta-text">{item.number}</span>
              <span className="tab-name font-display">{item.name}</span>
            </button>
          ))}
        </div>

        {/* Interactive Feature Display Grid */}
        <div className="swiss-grid craft-detail-grid">
          {/* Visual Column */}
          <div className="col-6 col-lg-8 col-sm-12">
            <div className="craft-image-frame">
              <img
                src={currentCoffee.image}
                alt={currentCoffee.name}
                className="craft-photo"
                key={currentCoffee.id}
              />
              <div className="craft-image-tag">
                <span className="meta-text">{currentCoffee.number} // {currentCoffee.name}</span>
                <span className="meta-text">{currentCoffee.elevation}</span>
              </div>
            </div>
          </div>

          {/* Editorial Specs Column */}
          <div className="col-6 col-lg-8 col-sm-12 craft-spec-col">
            <div className="craft-text-top">
              <span className="meta-text highlight-spec">ORIGIN SPECIFICATION</span>
              <h3 className="heading-section craft-item-name">{currentCoffee.name}</h3>
              <p className="body-lead craft-tagline">{currentCoffee.tagline}</p>
              <p className="body-text craft-body-p">{currentCoffee.description}</p>
            </div>

            {/* Swiss Metadata Table */}
            <div className="craft-specs-table">
              <div className="spec-row">
                <span className="meta-text spec-label">ESTATE / REGION</span>
                <span className="spec-value font-sans">{currentCoffee.origin}</span>
              </div>
              <div className="spec-row">
                <span className="meta-text spec-label">PROCESSING</span>
                <span className="spec-value font-sans">{currentCoffee.process}</span>
              </div>
              <div className="spec-row">
                <span className="meta-text spec-label">ELEVATION</span>
                <span className="spec-value font-sans">{currentCoffee.elevation}</span>
              </div>
              <div className="spec-row tasting-row">
                <span className="meta-text spec-label">TASTING NOTES</span>
                <div className="tasting-tags-wrap">
                  {currentCoffee.tastingNotes.map((note) => (
                    <span key={note} className="tasting-pill font-mono">{note}</span>
                  ))}
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      <style>{`
        .chc-craft-section {
          background-color: var(--bg-canvas-dark);
          color: var(--text-inverse);
          position: relative;
        }

        .craft-headline-grid {
          margin-bottom: clamp(3rem, 5vw, 5rem);
        }

        .craft-hero-title {
          color: var(--text-inverse);
          letter-spacing: -0.035em;
        }

        .craft-selector-bar {
          display: flex;
          border-top: 1px solid var(--border-inverse-hairline);
          border-bottom: 1px solid var(--border-inverse-hairline);
          margin-bottom: clamp(2.5rem, 4.5vw, 4.5rem);
          overflow-x: auto;
          scrollbar-width: none;
        }

        .craft-selector-bar::-webkit-scrollbar {
          display: none;
        }

        .craft-tab-btn {
          flex: 1;
          min-width: 180px;
          display: flex;
          align-items: baseline;
          gap: 0.75rem;
          padding: 1.25rem 1.5rem;
          border-right: 1px solid var(--border-inverse-hairline);
          color: var(--text-inverse-muted);
          transition: all var(--duration-fast) ease;
          text-align: left;
        }

        .craft-tab-btn:last-child {
          border-right: none;
        }

        .craft-tab-btn.is-active {
          background-color: rgba(245, 243, 238, 0.06);
          color: var(--text-inverse);
        }

        .craft-tab-btn.is-active .tab-num {
          color: var(--accent-terracotta);
        }

        .tab-num {
          color: var(--text-inverse-muted);
        }

        .tab-name {
          font-size: 1rem;
          font-weight: 600;
          letter-spacing: 0.05em;
        }

        .craft-detail-grid {
          align-items: center;
          row-gap: 3rem;
        }

        .craft-image-frame {
          position: relative;
          background-color: var(--bg-canvas-dark-elevated);
          border: 1px solid var(--border-inverse-hairline);
          padding: 0.85rem;
        }

        .craft-photo {
          width: 100%;
          aspect-ratio: 4 / 3;
          object-fit: cover;
        }

        .craft-image-tag {
          display: flex;
          justify-content: space-between;
          padding-top: 0.75rem;
          border-top: 1px solid var(--border-inverse-hairline);
          margin-top: 0.75rem;
          color: var(--text-inverse-muted);
        }

        .craft-spec-col {
          display: flex;
          flex-direction: column;
          gap: 2rem;
        }

        .highlight-spec {
          color: var(--accent-terracotta);
          margin-bottom: 0.5rem;
          display: block;
        }

        .craft-item-name {
          color: var(--text-inverse);
          margin-bottom: 0.75rem;
        }

        .craft-tagline {
          color: var(--text-inverse-muted);
          margin-bottom: 1rem;
        }

        .craft-body-p {
          color: var(--text-inverse-muted);
          line-height: 1.7;
        }

        .craft-specs-table {
          display: flex;
          flex-direction: column;
          border-top: 1px solid var(--border-inverse-hairline);
        }

        .spec-row {
          display: flex;
          justify-content: space-between;
          align-items: baseline;
          padding: 0.875rem 0;
          border-bottom: 1px solid var(--border-inverse-hairline);
          flex-wrap: wrap;
          gap: 0.5rem;
        }

        .spec-label {
          color: var(--text-inverse-muted);
        }

        .spec-value {
          color: var(--text-inverse);
          font-weight: 500;
        }

        .tasting-row {
          align-items: center;
        }

        .tasting-tags-wrap {
          display: flex;
          gap: 0.5rem;
          flex-wrap: wrap;
        }

        .tasting-pill {
          font-size: 0.6875rem;
          padding: 0.25rem 0.65rem;
          border: 1px solid var(--border-inverse-hairline);
          color: var(--text-inverse);
          background-color: rgba(255, 255, 255, 0.04);
        }
      `}</style>
    </section>
  );
};
