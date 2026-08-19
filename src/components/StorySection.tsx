import React from 'react';
import { useCursor } from '../context/CursorContext';

export const StorySection: React.FC = () => {
  const { setCursor, resetCursor } = useCursor();

  return (
    <section className="chc-story-section" id="story" aria-label="Our Story & Space">
      <div className="container">
        {/* Section Header */}
        <div className="section-header">
          <span className="section-num">05 / THE SPACE & ORIGIN</span>
          <span className="section-caption">SABARMATI RIVERFRONT / AHMEDABAD</span>
        </div>

        {/* Grand Story Headline */}
        <div className="swiss-grid story-headline-grid">
          <div className="col-12">
            <h2 className="display-1 story-big-title">
              TIME UNCOUPLED<br />
              <span className="text-terracotta">FROM URGENCY.</span>
            </h2>
          </div>
        </div>

        {/* Asymmetric Editorial Story Grid */}
        <div className="swiss-grid story-content-grid">
          {/* Left Column: Architectural Photo with Editorial Framing */}
          <div className="col-6 col-lg-8 col-sm-12">
            <div
              className="story-image-block"
              onMouseEnter={() => setCursor('open', 'SPACE')}
              onMouseLeave={resetCursor}
            >
              <img
                src="/images/story_atelier.jpg"
                alt="Architectural interior of The Coffee House Co. featuring raw lime plaster and teak furniture"
                className="story-main-photo"
              />
              <div className="story-photo-caption">
                <span className="meta-text">PLATE 02.4 — THE RIVERFRONT CORNER</span>
                <span className="meta-text">NATURAL NORTHERN EXPOSURE</span>
              </div>
            </div>
          </div>

          {/* Right Column: Narrative Copy & Numbers */}
          <div className="col-6 col-lg-8 col-sm-12 story-narrative-block">
            <div className="story-paragraphs">
              <p className="body-lead story-lead-copy">
                The Coffee House Co. began with a quiet conviction: that in a city moving as rapidly as Ahmedabad, there should exist a sanctuary where time is uncoupled from haste.
              </p>
              <p className="body-text">
                We designed our space along the riverfront using reclaimed Indian teakwood, hand-cast lime plaster, and warm textured linen. Sunlight enters indirectly through architectural slatted louvers, creating shifting geometric shadows that mark the quiet passage of morning into afternoon.
              </p>
              <p className="body-text">
                There are no blaring television monitors, no hurried self-service buzzers, and no compromises on agricultural provenance. Just the gentle hiss of calibrated steam, the aroma of newly ground micro-lots, and conversations that have ample room to unfold.
              </p>
            </div>

            {/* Swiss Numbered Architectural Pillars */}
            <div className="story-metrics-grid">
              <div className="story-metric-item">
                <span className="metric-digit font-display">24</span>
                <span className="metric-label meta-text">SEATS TOTAL FOR INTIMATE DIALOGUE</span>
              </div>
              <div className="story-metric-item">
                <span className="metric-digit font-display">100%</span>
                <span className="metric-label meta-text">SHADE-GROWN DIRECT TRADE LOTS</span>
              </div>
              <div className="story-metric-item">
                <span className="metric-digit font-display">93.5°</span>
                <span className="metric-label meta-text">STABILIZED MINERAL EXTRACTION TEMP</span>
              </div>
            </div>
          </div>
        </div>
      </div>

      <style>{`
        .chc-story-section {
          padding-top: clamp(4.5rem, 8vw, 7.5rem);
          padding-bottom: clamp(4.5rem, 8vw, 7.5rem);
          background-color: var(--bg-canvas);
          border-bottom: 1px solid var(--border-hairline);
        }

        .story-headline-grid {
          margin-bottom: clamp(3rem, 6vw, 5.5rem);
        }

        .story-big-title {
          font-size: clamp(2.75rem, 6.5vw, 6.75rem);
          letter-spacing: -0.04em;
          line-height: 0.92;
        }

        .text-terracotta {
          color: var(--accent-terracotta);
        }

        .story-content-grid {
          align-items: start;
          row-gap: 3rem;
        }

        .story-image-block {
          background-color: var(--bg-canvas-subtle);
          border: 1px solid var(--border-hairline);
          padding: 0.875rem;
        }

        .story-main-photo {
          width: 100%;
          aspect-ratio: 4 / 5;
          object-fit: cover;
        }

        .story-photo-caption {
          display: flex;
          justify-content: space-between;
          padding-top: 0.75rem;
          margin-top: 0.75rem;
          border-top: 1px solid var(--border-hairline);
          flex-wrap: wrap;
          gap: 0.5rem;
        }

        .story-narrative-block {
          display: flex;
          flex-direction: column;
          gap: 3rem;
        }

        .story-paragraphs {
          display: flex;
          flex-direction: column;
          gap: 1.5rem;
        }

        .story-lead-copy {
          color: var(--text-primary);
          font-weight: 500;
        }

        .story-metrics-grid {
          display: grid;
          grid-template-columns: repeat(3, 1fr);
          gap: 1.5rem;
          border-top: 1px solid var(--border-hairline);
          padding-top: 2rem;
        }

        @media (max-width: 640px) {
          .story-metrics-grid {
            grid-template-columns: 1fr;
            gap: 1.5rem;
          }
        }

        .story-metric-item {
          display: flex;
          flex-direction: column;
          gap: 0.5rem;
        }

        .metric-digit {
          font-size: clamp(2.25rem, 3.5vw, 3.5rem);
          font-weight: 700;
          color: var(--text-primary);
          line-height: 1;
        }

        .metric-label {
          color: var(--text-muted);
          line-height: 1.4;
        }
      `}</style>
    </section>
  );
};
