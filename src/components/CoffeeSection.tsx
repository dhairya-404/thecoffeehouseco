import React, { useState, useRef, useEffect } from 'react';
import gsap from 'gsap';
import { COFFEE_FEATURES } from '../data/cafeData';
import { useCursor } from '../context/CursorContext';
import { MagneticButton } from './MagneticButton';

export const CoffeeSection: React.FC = () => {
  const [activeIndex, setActiveIndex] = useState(0);
  const { setCursor, resetCursor } = useCursor();
  const currentCoffee = COFFEE_FEATURES[activeIndex];
  const imageRef = useRef<HTMLImageElement>(null);
  const detailsRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (imageRef.current) {
      gsap.fromTo(
        imageRef.current,
        { scale: 1.08, opacity: 0.7, filter: 'blur(4px)' },
        { scale: 1, opacity: 1, filter: 'blur(0px)', duration: 0.8, ease: 'power2.out' }
      );
    }

    if (detailsRef.current) {
      gsap.fromTo(
        detailsRef.current.children,
        { y: 20, opacity: 0 },
        { y: 0, opacity: 1, duration: 0.6, stagger: 0.08, ease: 'power3.out' }
      );
    }
  }, [activeIndex]);

  return (
    <section id="coffee" className="coffee-section" aria-label="Coffee Philosophy and Selections">
      <div className="container">
        {/* Section Header */}
        <div className="coffee-header-grid">
          <div>
            <span className="label-caps">OUR COFFEE LINEAGE</span>
            <h2 className="heading-1 coffee-main-heading">
              CRAFT OVER <span className="font-editorial italic text-copper">SPEED.</span>
            </h2>
          </div>
          <p className="body-lead coffee-lead-text">
            We partner directly with smallholder coffee estates across Chikmagalur, Yirgacheffe, and Biligirirangana hills. Every harvest is roasted to honor its micro-climate and cellular density.
          </p>
        </div>

        {/* Category Nav Tabs */}
        <div className="coffee-tab-nav" role="tablist">
          {COFFEE_FEATURES.map((item, index) => (
            <button
              key={item.id}
              role="tab"
              aria-selected={activeIndex === index}
              className={`coffee-tab-btn ${activeIndex === index ? 'is-active' : ''}`}
              onClick={() => setActiveIndex(index)}
              onMouseEnter={() => setCursor('link')}
              onMouseLeave={resetCursor}
            >
              <span className="coffee-tab-num">{item.number}</span>
              <span className="coffee-tab-name">{item.name}</span>
            </button>
          ))}
        </div>

        {/* Editorial Feature Showcase */}
        <div className="coffee-showcase-grid">
          {/* Left Column: Visual with Hover Micro-Interaction */}
          <div
            className="coffee-image-frame"
            onMouseEnter={() => setCursor('view', 'EXPLORE')}
            onMouseLeave={resetCursor}
          >
            <div className="image-aspect-wrapper">
              <img
                ref={imageRef}
                key={currentCoffee.image}
                src={currentCoffee.image}
                alt={currentCoffee.name}
                className="coffee-featured-img"
                loading="lazy"
              />
            </div>
            <div className="image-caption-overlay">
              <span className="caption-tag">{currentCoffee.origin}</span>
              <span className="caption-tag">{currentCoffee.elevation}</span>
            </div>
          </div>

          {/* Right Column: Deep Editorial Metadata & Tasting Profile */}
          <div ref={detailsRef} className="coffee-details-col">
            <div className="coffee-num-huge">{currentCoffee.number}</div>

            <div className="coffee-title-group">
              <h3 className="coffee-name-display">{currentCoffee.name}</h3>
              <p className="coffee-tagline-text">{currentCoffee.tagline}</p>
            </div>

            {/* Tasting Notes Cloud */}
            <div className="tasting-notes-block">
              <span className="notes-label">TASTING NOTES</span>
              <div className="notes-tags-wrap">
                {currentCoffee.tastingNotes.map((note) => (
                  <span key={note} className="note-pill">
                    {note}
                  </span>
                ))}
              </div>
            </div>

            {/* Spec Sheet Table */}
            <div className="coffee-spec-sheet">
              <div className="spec-row">
                <span className="spec-key">ESTATE & ORIGIN</span>
                <span className="spec-val">{currentCoffee.origin}</span>
              </div>
              <div className="spec-row">
                <span className="spec-key">PROCESSING METHOD</span>
                <span className="spec-val">{currentCoffee.process}</span>
              </div>
              <div className="spec-row">
                <span className="spec-key">GROWTH ELEVATION</span>
                <span className="spec-val">{currentCoffee.elevation}</span>
              </div>
            </div>

            {/* Narrative Description */}
            <p className="coffee-narrative-p">{currentCoffee.description}</p>

            {/* CTA */}
            <div className="coffee-cta-wrap">
              <MagneticButton
                as="a"
                href="#menu"
                className="btn-magnetic btn-outline-light"
                cursorText="VIEW"
              >
                VIEW ON MENU →
              </MagneticButton>
            </div>
          </div>
        </div>
      </div>

      <style>{`
        .coffee-section {
          position: relative;
          background-color: var(--bg-primary);
          padding-top: clamp(6rem, 10vw, 10rem);
          padding-bottom: clamp(6rem, 10vw, 10rem);
        }

        .coffee-header-grid {
          display: grid;
          grid-template-columns: 1fr;
          gap: 2rem;
          margin-bottom: 4rem;
        }

        @media (min-width: 900px) {
          .coffee-header-grid {
            grid-template-columns: 1.2fr 1fr;
            align-items: flex-end;
          }
        }

        .coffee-main-heading {
          margin-top: 0.75rem;
          color: var(--text-primary);
        }

        .text-copper {
          color: var(--accent-copper);
        }

        .coffee-lead-text {
          max-width: 500px;
        }

        .coffee-tab-nav {
          display: flex;
          overflow-x: auto;
          border-bottom: 1px solid var(--border-light);
          margin-bottom: 4rem;
          padding-bottom: 0.5rem;
          gap: 1.5rem;
          scrollbar-width: none;
        }

        .coffee-tab-nav::-webkit-scrollbar {
          display: none;
        }

        .coffee-tab-btn {
          display: flex;
          align-items: center;
          gap: 0.75rem;
          padding: 0.75rem 1.25rem;
          white-space: nowrap;
          border-radius: 9999px;
          border: 1px solid transparent;
          color: var(--text-muted);
          transition: all 0.3s ease;
        }

        .coffee-tab-btn.is-active {
          color: var(--text-primary);
          background-color: var(--bg-card);
          border-color: var(--border-copper);
        }

        .coffee-tab-num {
          font-size: var(--text-xs);
          letter-spacing: 0.1em;
          color: var(--accent-copper);
          font-weight: 600;
        }

        .coffee-tab-name {
          font-size: var(--text-xs);
          letter-spacing: 0.18em;
          font-weight: 500;
        }

        .coffee-showcase-grid {
          display: grid;
          grid-template-columns: 1fr;
          gap: 3.5rem;
          align-items: center;
        }

        @media (min-width: 960px) {
          .coffee-showcase-grid {
            grid-template-columns: 1.1fr 1fr;
            gap: 5rem;
          }
        }

        .coffee-image-frame {
          position: relative;
          border-radius: 4px;
          overflow: hidden;
          background: #14100E;
          box-shadow: 0 20px 50px rgba(0, 0, 0, 0.5);
          cursor: pointer;
        }

        .image-aspect-wrapper {
          position: relative;
          padding-bottom: 120%;
          overflow: hidden;
        }

        .coffee-featured-img {
          position: absolute;
          inset: 0;
          width: 100%;
          height: 100%;
          object-fit: cover;
          transition: transform 0.8s cubic-bezier(0.16, 1, 0.3, 1);
        }

        .coffee-image-frame:hover .coffee-featured-img {
          transform: scale(1.05);
        }

        .image-caption-overlay {
          position: absolute;
          bottom: 1.5rem;
          left: 1.5rem;
          display: flex;
          gap: 0.6rem;
          z-index: 2;
        }

        .caption-tag {
          font-size: 0.6875rem;
          letter-spacing: 0.15em;
          text-transform: uppercase;
          background: rgba(15, 12, 10, 0.75);
          backdrop-filter: blur(8px);
          padding: 0.4rem 0.8rem;
          border-radius: 4px;
          color: var(--text-primary);
          border: 1px solid var(--border-light);
        }

        .coffee-details-col {
          display: flex;
          flex-direction: column;
          gap: 1.75rem;
        }

        .coffee-num-huge {
          font-family: var(--font-serif);
          font-size: clamp(3.5rem, 6vw, 5.5rem);
          line-height: 0.9;
          color: rgba(200, 122, 83, 0.25);
        }

        .coffee-name-display {
          font-family: var(--font-serif);
          font-size: clamp(2rem, 3.5vw, 3rem);
          line-height: 1.1;
          color: var(--text-primary);
          letter-spacing: -0.01em;
        }

        .coffee-tagline-text {
          font-family: var(--font-editorial);
          font-style: italic;
          font-size: 1.2rem;
          color: #DDD4CB;
          margin-top: 0.4rem;
        }

        .tasting-notes-block {
          margin-top: 0.5rem;
        }

        .notes-label {
          font-size: var(--text-2xs);
          letter-spacing: 0.2em;
          color: var(--accent-copper);
          display: block;
          margin-bottom: 0.75rem;
        }

        .notes-tags-wrap {
          display: flex;
          flex-wrap: wrap;
          gap: 0.6rem;
        }

        .note-pill {
          font-size: var(--text-xs);
          letter-spacing: 0.08em;
          padding: 0.4rem 0.9rem;
          background: rgba(245, 240, 235, 0.05);
          border: 1px solid var(--border-light);
          border-radius: 9999px;
          color: var(--text-secondary);
        }

        .coffee-spec-sheet {
          border-top: 1px solid var(--border-light);
          border-bottom: 1px solid var(--border-light);
          padding: 1.25rem 0;
          display: flex;
          flex-direction: column;
          gap: 0.75rem;
        }

        .spec-row {
          display: flex;
          justify-content: space-between;
          font-size: var(--text-xs);
        }

        .spec-key {
          letter-spacing: 0.15em;
          color: var(--text-muted);
        }

        .spec-val {
          color: var(--text-primary);
          font-weight: 500;
        }

        .coffee-narrative-p {
          font-size: 1rem;
          line-height: 1.7;
          color: #C2BAB1;
          font-weight: 300;
        }

        .coffee-cta-wrap {
          margin-top: 0.5rem;
        }
      `}</style>
    </section>
  );
};
