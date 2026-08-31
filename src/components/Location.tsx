import React from 'react';
import { BRAND_INFO } from '../data/cafeData';
import { useCursor } from '../context/CursorContext';

interface LocationProps {
  onReserveClick?: () => void;
}

export const Location: React.FC<LocationProps> = ({ onReserveClick }) => {
  const { setCursor, resetCursor } = useCursor();

  return (
    <section className="chc-location-section" id="location" aria-label="Location and Hours">
      <div className="container">
        <div className="section-header">
          <span className="section-num">08 / FIND US</span>
          <span className="section-caption">RIVERFRONT CORNER • VISITS & RESERVATIONS</span>
        </div>

        <div className="swiss-grid location-content-grid">
          <div className="col-6 col-lg-8 col-sm-12 location-details-col">
            <div className="location-heading-group">
              <span className="meta-text location-sub-badge">AHMEDABAD FLAGSHIP</span>
              <h2 className="heading-hero location-title">
                21 RIVERFRONT<br />
                <span className="text-terracotta">ROAD.</span>
              </h2>
              <p className="body-lead location-addr-lead">
                {BRAND_INFO.location}
              </p>
            </div>

            <div className="location-hours-table">
              <div className="hours-row">
                <span className="meta-text hours-label">MONDAY — FRIDAY</span>
                <span className="hours-val font-mono">{BRAND_INFO.hours.weekdays}</span>
              </div>
              <div className="hours-row">
                <span className="meta-text hours-label">SATURDAY — SUNDAY</span>
                <span className="hours-val font-mono">{BRAND_INFO.hours.weekends}</span>
              </div>
              <div className="hours-row">
                <span className="meta-text hours-label">CONTACT & INQUIRIES</span>
                <span className="hours-val font-mono">{BRAND_INFO.phone}</span>
              </div>
              <div className="hours-row">
                <span className="meta-text hours-label">DIGITAL CORRESPONDENCE</span>
                <span className="hours-val font-mono">{BRAND_INFO.email}</span>
              </div>
            </div>

            <div className="location-actions-group">
              <button
                type="button"
                className="btn-swiss location-reserve-btn"
                onClick={onReserveClick}
                onMouseEnter={() => setCursor('link')}
                onMouseLeave={resetCursor}
              >
                <span>BOOK A TASTING TABLE</span>
                <span>→</span>
              </button>
              <div className="location-note font-mono">
                <span>NOTE:</span> Valet parking is available at the North Promenade entry.
              </div>
            </div>
          </div>

          <div className="col-6 col-lg-8 col-sm-12 location-visual-col">
            <div className="location-map-card">
              <div className="map-svg-wrap">
                <svg viewBox="0 0 500 320" className="transit-map-svg" aria-label="Riverfront Transit Grid Map">
                  <defs>
                    <pattern id="grid-pattern" width="40" height="40" patternUnits="userSpaceOnUse">
                      <path d="M 40 0 L 0 0 0 40" fill="none" stroke="rgba(74,52,42,0.08)" strokeWidth="1"/>
                    </pattern>
                  </defs>
                  <rect width="100%" height="100%" fill="url(#grid-pattern)" />

                  <path
                    d="M-20,260 C120,240 220,100 520,60"
                    fill="none"
                    stroke="#D7C9B8"
                    strokeWidth="48"
                    strokeLinecap="round"
                  />
                  <path
                    d="M-20,260 C120,240 220,100 520,60"
                    fill="none"
                    stroke="#B2967D"
                    strokeWidth="1.5"
                    strokeDasharray="4,4"
                  />
                  <text x="70" y="245" fill="#7D5A44" fontFamily="Space Mono" fontSize="9" letterSpacing="0.12em">
                    SABARMATI RIVER
                  </text>

                  <path
                    d="M-10,220 C130,200 230,80 510,40"
                    fill="none"
                    stroke="#4A342A"
                    strokeWidth="2.5"
                  />
                  <text x="260" y="70" fill="#4A342A" fontFamily="Space Mono" fontSize="9" fontWeight="700" letterSpacing="0.1em">
                    RIVERFRONT ROAD WEST
                  </text>

                  <circle cx="150" cy="195" r="3" fill="#7D5A44" />
                  <text x="160" y="198" fill="#7D5A44" fontFamily="Space Mono" fontSize="8">ELLIS BRIDGE</text>

                  <circle cx="390" cy="55" r="3" fill="#7D5A44" />
                  <text x="400" y="58" fill="#7D5A44" fontFamily="Space Mono" fontSize="8">NEHRU BRIDGE</text>

                  <g transform="translate(300, 130)">
                    <circle cx="0" cy="0" r="22" fill="rgba(125, 90, 68, 0.2)">
                      <animate attributeName="r" values="14;28;14" dur="2.5s" repeatCount="indefinite"/>
                      <animate attributeName="opacity" values="0.8;0.1;0.8" dur="2.5s" repeatCount="indefinite"/>
                    </circle>
                    <circle cx="0" cy="0" r="7" fill="#7D5A44"/>
                    <circle cx="0" cy="0" r="2.5" fill="#F5F1EA"/>

                    <rect x="-80" y="-40" width="160" height="26" fill="#4A342A" />
                    <text x="0" y="-23" fill="#F5F1EA" fontFamily="Space Mono" fontSize="8.5" fontWeight="700" letterSpacing="0.1em" textAnchor="middle">
                      THE COFFEE HOUSE CO.
                    </text>
                    <polygon points="-4,-14 4,-14 0,-9" fill="#4A342A"/>
                  </g>
                </svg>
              </div>

              <div className="map-card-footer">
                <span className="meta-text">COORDINATES: {BRAND_INFO.coordinates}</span>
                <span className="meta-text">PROMENADE GATE 03</span>
              </div>
            </div>
          </div>
        </div>
      </div>

      <style>{`
        .chc-location-section {
          padding-top: clamp(4.5rem, 8vw, 7.5rem);
          padding-bottom: clamp(4.5rem, 8vw, 7.5rem);
          background-color: var(--bg-canvas);
          border-bottom: 1px solid var(--border-hairline);
        }

        .location-content-grid {
          align-items: start;
          row-gap: 3.5rem;
        }

        .location-details-col {
          display: flex;
          flex-direction: column;
          gap: 2.5rem;
        }

        .location-heading-group {
          display: flex;
          flex-direction: column;
          gap: 0.5rem;
        }

        .location-sub-badge {
          color: var(--accent-terracotta);
          margin-bottom: 0.75rem;
          display: block;
        }

        .location-title {
          margin-bottom: 1rem;
          letter-spacing: -0.04em;
        }

        .text-terracotta {
          color: var(--accent-terracotta);
        }

        .location-addr-lead {
          color: var(--text-secondary);
        }

        .location-hours-table {
          display: flex;
          flex-direction: column;
          border-top: 1px solid var(--border-hairline);
        }

        .hours-row {
          display: flex;
          justify-content: space-between;
          align-items: baseline;
          padding: 1rem 0;
          border-bottom: 1px solid var(--border-hairline);
          flex-wrap: wrap;
          gap: 0.5rem;
        }

        .hours-label {
          color: var(--text-muted);
        }

        .hours-val {
          font-size: 0.95rem;
          color: var(--text-primary);
          font-weight: 600;
        }

        .location-actions-group {
          display: flex;
          flex-direction: column;
          gap: 1rem;
        }

        .location-reserve-btn {
          width: fit-content;
        }

        .location-note {
          font-size: 0.75rem;
          color: var(--text-muted);
        }

        .location-note span {
          color: var(--accent-terracotta);
          font-weight: 700;
        }

        .location-map-card {
          background-color: var(--bg-canvas-subtle);
          border: 1px solid var(--border-hairline);
          padding: 1rem;
        }

        .map-svg-wrap {
          width: 100%;
          background-color: var(--bg-canvas);
          border: 1px solid var(--border-hairline);
          overflow: hidden;
        }

        .transit-map-svg {
          width: 100%;
          height: auto;
          display: block;
        }

        .map-card-footer {
          display: flex;
          justify-content: space-between;
          padding-top: 0.85rem;
          margin-top: 0.85rem;
          border-top: 1px solid var(--border-hairline);
          flex-wrap: wrap;
          gap: 0.5rem;
        }
      `}</style>
    </section>
  );
};
