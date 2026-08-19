import React, { useEffect, useRef } from 'react';
import gsap from 'gsap';
import { useCursor } from '../context/CursorContext';

interface HeroProps {
  onReserveClick?: () => void;
}

export const Hero: React.FC<HeroProps> = ({ onReserveClick }) => {
  const sectionRef = useRef<HTMLElement>(null);
  const headlineRef = useRef<HTMLHeadingElement>(null);
  const metaRef = useRef<HTMLDivElement>(null);
  const imageFrameRef = useRef<HTMLDivElement>(null);
  const scrollIndicatorRef = useRef<HTMLDivElement>(null);
  const { setCursor, resetCursor } = useCursor();

  useEffect(() => {
    const ctx = gsap.context(() => {
      const tl = gsap.timeline({ defaults: { ease: 'power3.out' } });

      tl.fromTo(
        metaRef.current,
        { opacity: 0, y: 15 },
        { opacity: 1, y: 0, duration: 0.8, delay: 0.2 }
      )
      .fromTo(
        headlineRef.current?.querySelectorAll('.hero-line') || [],
        { opacity: 0, y: 50 },
        { opacity: 1, y: 0, duration: 1, stagger: 0.12 },
        '-=0.4'
      )
      .fromTo(
        imageFrameRef.current,
        { opacity: 0, scale: 0.96 },
        { opacity: 1, scale: 1, duration: 1.2, ease: 'power2.out' },
        '-=0.8'
      )
      .fromTo(
        scrollIndicatorRef.current,
        { opacity: 0, y: 10 },
        { opacity: 1, y: 0, duration: 0.6 },
        '-=0.4'
      );
    }, sectionRef);

    return () => ctx.revert();
  }, []);

  return (
    <section ref={sectionRef} className="chc-hero-section" id="hero" aria-label="Hero Section">
      <div className="container">
        {/* Section Numbering & Metadata Header */}
        <div ref={metaRef} className="section-header hero-top-meta">
          <span className="section-num">01 / THE COFFEE HOUSE CO.</span>
          <div className="hero-meta-items">
            <span className="meta-text">AHMEDABAD / 23.0225° N</span>
            <span className="meta-sep">•</span>
            <span className="meta-text">07:00 — 22:00</span>
            <span className="meta-sep">•</span>
            <span className="meta-text">COFFEE / FOOD / CULTURE</span>
          </div>
        </div>

        {/* Asymmetrical Editorial Composition */}
        <div className="swiss-grid hero-main-grid">
          {/* Left Column: Monumental Headline + Statement */}
          <div className="col-7 col-lg-8 col-sm-12 hero-text-column">
            <h1 ref={headlineRef} className="display-1 hero-headline">
              <span className="hero-line d-block">COFFEE</span>
              <span className="hero-line d-block text-accent-brown">WORTH</span>
              <span className="hero-line d-block">STAYING</span>
              <span className="hero-line d-block text-terracotta">FOR.</span>
            </h1>

            <div className="hero-description-block">
              <hr className="swiss-rule hero-divider" />
              <div className="hero-desc-grid">
                <p className="body-lead hero-intro-copy">
                  An independent specialty coffee house designed around the discipline of slow extraction, architectural stillness, and honest daily baking along the riverfront.
                </p>
                <div className="hero-cta-wrap">
                  <button
                    type="button"
                    className="btn-swiss hero-reserve-action"
                    onClick={onReserveClick}
                    onMouseEnter={() => setCursor('link')}
                    onMouseLeave={resetCursor}
                  >
                    <span>RESERVE TASTING TABLE</span>
                    <span>→</span>
                  </button>
                  <a
                    href="#menu"
                    className="btn-swiss btn-swiss-outline hero-menu-action"
                    onMouseEnter={() => setCursor('link')}
                    onMouseLeave={resetCursor}
                  >
                    <span>EXPLORE MENU</span>
                  </a>
                </div>
              </div>
            </div>
          </div>

          {/* Right Column: Architectural Signature Visual */}
          <div className="col-5 col-lg-8 col-sm-12 hero-visual-column">
            <div
              ref={imageFrameRef}
              className="hero-image-frame"
              onMouseEnter={() => setCursor('open', 'VIEW')}
              onMouseLeave={resetCursor}
            >
              <div className="hero-image-wrapper">
                <img
                  src="/assets/brand/coffee-cup/chc_signature_cup_front.jpg"
                  alt="The Coffee House Co. signature unglazed ceramic espresso cup with CHC insignia resting on limestone"
                  className="hero-primary-photo"
                  loading="eager"
                />
              </div>
              <div className="hero-image-caption-bar">
                <span className="meta-text">FIG 01.0 — SIGNATURE STONEWARE CUP</span>
                <span className="meta-text">DOUBLE SHOT / 1:2 RATIO</span>
              </div>
            </div>
          </div>
        </div>

        {/* Scroll Indicator */}
        <div ref={scrollIndicatorRef} className="hero-scroll-row">
          <a href="#intro" className="hero-scroll-link meta-text">
            <span>SCROLL TO DISCOVER</span>
            <span className="scroll-down-arrow">↓</span>
          </a>
        </div>
      </div>

      <style>{`
        .chc-hero-section {
          position: relative;
          padding-top: clamp(6.5rem, 11vw, 9rem);
          padding-bottom: clamp(3rem, 6vw, 5rem);
          background-color: var(--bg-canvas);
          min-height: 100vh;
          display: flex;
          flex-direction: column;
          justify-content: space-between;
        }

        .hero-top-meta {
          margin-bottom: clamp(2rem, 4vw, 3.5rem);
        }

        .hero-meta-items {
          display: flex;
          align-items: center;
          gap: 0.75rem;
          flex-wrap: wrap;
        }

        .meta-sep {
          color: var(--border-medium);
          font-size: 0.65rem;
        }

        @media (max-width: 640px) {
          .meta-sep, .hero-meta-items span:nth-child(n+3) {
            display: none;
          }
        }

        .hero-main-grid {
          align-items: start;
          row-gap: 3rem;
        }

        .hero-text-column {
          display: flex;
          flex-direction: column;
          justify-content: space-between;
        }

        .hero-headline {
          margin-bottom: clamp(2rem, 3.5vw, 3.5rem);
        }

        .d-block {
          display: block;
        }

        .text-accent-brown {
          color: var(--accent-coffee);
        }

        .text-terracotta {
          color: var(--accent-terracotta);
        }

        .hero-divider {
          margin-bottom: 2rem;
        }

        .hero-desc-grid {
          display: flex;
          flex-direction: column;
          gap: 1.75rem;
          max-width: 620px;
        }

        .hero-intro-copy {
          color: var(--text-secondary);
        }

        .hero-cta-wrap {
          display: flex;
          align-items: center;
          gap: 1rem;
          flex-wrap: wrap;
        }

        .hero-visual-column {
          display: flex;
          flex-direction: column;
        }

        .hero-image-frame {
          position: relative;
          background-color: var(--bg-canvas-subtle);
          border: 1px solid var(--border-hairline);
          padding: 1rem;
        }

        .hero-image-wrapper {
          position: relative;
          width: 100%;
          aspect-ratio: 1 / 1;
          overflow: hidden;
          background-color: #E6E2D8;
        }

        .hero-primary-photo {
          width: 100%;
          height: 100%;
          object-fit: cover;
          transition: transform 0.8s var(--ease-editorial);
        }

        .hero-image-frame:hover .hero-primary-photo {
          transform: scale(1.03);
        }

        .hero-image-caption-bar {
          display: flex;
          justify-content: space-between;
          align-items: center;
          padding-top: 0.875rem;
          border-top: 1px solid var(--border-hairline);
          margin-top: 0.875rem;
          flex-wrap: wrap;
          gap: 0.5rem;
        }

        .hero-scroll-row {
          padding-top: clamp(2.5rem, 5vw, 4.5rem);
          display: flex;
          justify-content: flex-end;
        }

        .hero-scroll-link {
          display: inline-flex;
          align-items: center;
          gap: 0.5rem;
          color: var(--text-muted);
          transition: color 0.2s ease;
        }

        .hero-scroll-link:hover {
          color: var(--text-primary);
        }

        .scroll-down-arrow {
          animation: floatArrow 2s infinite ease-in-out;
        }

        @keyframes floatArrow {
          0%, 100% { transform: translateY(0); }
          50% { transform: translateY(5px); }
        }
      `}</style>
    </section>
  );
};
