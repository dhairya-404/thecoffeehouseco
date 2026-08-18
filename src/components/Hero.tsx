import React, { useEffect, useRef } from 'react';
import gsap from 'gsap';
import { MagneticButton } from './MagneticButton';
import { useCursor } from '../context/CursorContext';

interface HeroProps {
  onReserveClick?: () => void;
}

export const Hero: React.FC<HeroProps> = ({ onReserveClick }) => {
  const heroRef = useRef<HTMLElement>(null);
  const bgImgRef = useRef<HTMLDivElement>(null);
  const headlineRef = useRef<HTMLHeadingElement>(null);
  const metaRef = useRef<HTMLDivElement>(null);
  const subtextRef = useRef<HTMLParagraphElement>(null);
  const ctaGroupRef = useRef<HTMLDivElement>(null);
  const scrollPromptRef = useRef<HTMLDivElement>(null);
  const { setCursor, resetCursor } = useCursor();

  useEffect(() => {
    const ctx = gsap.context(() => {
      const tl = gsap.timeline({ defaults: { ease: 'power3.out' } });

      // Image subtle scale in
      tl.fromTo(
        bgImgRef.current,
        { scale: 1.15, filter: 'brightness(0.65) contrast(1.1)' },
        { scale: 1.0, filter: 'brightness(0.85) contrast(1.05)', duration: 2.2, ease: 'power2.out' },
        0
      );

      // Meta badge reveal
      tl.fromTo(
        metaRef.current,
        { y: 30, opacity: 0 },
        { y: 0, opacity: 1, duration: 1.0 },
        0.3
      );

      // Headline lines reveal
      const headlineLines = headlineRef.current?.querySelectorAll('.hero-line');
      if (headlineLines) {
        tl.fromTo(
          headlineLines,
          { y: '100%', rotateZ: 2, opacity: 0 },
          { y: '0%', rotateZ: 0, opacity: 1, duration: 1.3, stagger: 0.18, ease: 'power4.out' },
          0.5
        );
      }

      // Subtext
      tl.fromTo(
        subtextRef.current,
        { y: 30, opacity: 0 },
        { y: 0, opacity: 1, duration: 1.0 },
        0.9
      );

      // CTAs
      tl.fromTo(
        ctaGroupRef.current,
        { y: 25, opacity: 0 },
        { y: 0, opacity: 1, duration: 0.9 },
        1.1
      );

      // Scroll Prompt
      tl.fromTo(
        scrollPromptRef.current,
        { opacity: 0, y: -10 },
        { opacity: 1, y: 0, duration: 1.0 },
        1.4
      );
    }, heroRef);

    return () => ctx.revert();
  }, []);

  const handleScrollTo = (id: string) => {
    const el = document.getElementById(id);
    if (el) el.scrollIntoView({ behavior: 'smooth' });
  };

  return (
    <section ref={heroRef} className="hero-section" id="hero" aria-label="Hero Section">
      {/* Cinematic Background Layer */}
      <div className="hero-bg-container">
        <div
          ref={bgImgRef}
          className="hero-bg-image"
          style={{ backgroundImage: `url('/images/hero_bg.jpg')` }}
          role="img"
          aria-label="Atmospheric morning light filtering through Ember & Bean coffee café"
        />
        <div className="hero-gradient-overlay"></div>
        <div className="hero-vignette"></div>
      </div>

      {/* Hero Content Grid */}
      <div className="container hero-content-container">
        {/* Established Badge & Coordinate */}
        <div ref={metaRef} className="hero-meta-row">
          <div className="hero-badge">
            <span className="badge-pulse"></span>
            <span className="label-caps">EST. 2018 / AHMEDABAD</span>
          </div>
          <span className="hero-coord">23.0225° N, 72.5714° E</span>
        </div>

        {/* Grand Headline */}
        <div className="hero-headline-wrap">
          <h1 ref={headlineRef} className="hero-title">
            <div className="hero-line-mask">
              <span className="hero-line">COFFEE,</span>
            </div>
            <div className="hero-line-mask">
              <span className="hero-line hero-line-italic">MADE SLOWLY.</span>
            </div>
          </h1>
        </div>

        {/* Supporting Editorial Paragraph */}
        <div className="hero-bottom-grid">
          <div className="hero-desc-col">
            <p ref={subtextRef} className="hero-description">
              Specialty single-origin roasts, unhurried manual pour-overs, honest hearth bakery, and an intimate corner designed for contemplation.
            </p>

            {/* CTAs */}
            <div ref={ctaGroupRef} className="hero-cta-group">
              <MagneticButton
                as="a"
                href="#menu"
                onClick={(e) => {
                  e.preventDefault();
                  handleScrollTo('menu');
                }}
                className="btn-magnetic btn-primary"
                cursorText="MENU"
              >
                EXPLORE THE MENU
              </MagneticButton>

              <MagneticButton
                as="button"
                onClick={() => {
                  if (onReserveClick) onReserveClick();
                  else handleScrollTo('location');
                }}
                className="btn-magnetic btn-outline-light"
                cursorText="BOOK"
              >
                RESERVE A TABLE →
              </MagneticButton>
            </div>
          </div>

          {/* Quick Origin Micro-Pillars */}
          <div className="hero-origins-col">
            <div className="origin-ticker">
              <div className="origin-item">
                <span className="origin-num">01</span>
                <div>
                  <div className="origin-title">Ratnagiri Estate</div>
                  <div className="origin-notes">Anaerobic Washed • 1,420m</div>
                </div>
              </div>
              <div className="origin-item">
                <span className="origin-num">02</span>
                <div>
                  <div className="origin-title">Yirgacheffe Bloom</div>
                  <div className="origin-notes">Jasmine & Bergamot • 1,950m</div>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Scroll To Discover Indicator */}
        <div
          ref={scrollPromptRef}
          className="hero-scroll-discover"
          onClick={() => handleScrollTo('intro')}
          onMouseEnter={() => setCursor('open', 'DOWN')}
          onMouseLeave={resetCursor}
          role="button"
          tabIndex={0}
        >
          <div className="scroll-indicator-line">
            <span className="scroll-dot"></span>
          </div>
          <span className="scroll-text">SCROLL TO DISCOVER</span>
        </div>
      </div>

      <style>{`
        .hero-section {
          position: relative;
          min-height: 100vh;
          width: 100%;
          display: flex;
          align-items: center;
          justify-content: center;
          padding-top: calc(var(--header-height) + 2rem);
          padding-bottom: 4rem;
          overflow: hidden;
          background-color: var(--bg-primary);
        }

        .hero-bg-container {
          position: absolute;
          inset: 0;
          width: 100%;
          height: 100%;
          z-index: var(--z-background);
          overflow: hidden;
        }

        .hero-bg-image {
          position: absolute;
          inset: -5%;
          width: 110%;
          height: 110%;
          background-size: cover;
          background-position: center 35%;
          will-change: transform, filter;
        }

        .hero-gradient-overlay {
          position: absolute;
          inset: 0;
          background: linear-gradient(
            180deg,
            rgba(15, 12, 10, 0.45) 0%,
            rgba(15, 12, 10, 0.25) 40%,
            rgba(15, 12, 10, 0.85) 85%,
            rgba(15, 12, 10, 1) 100%
          );
        }

        .hero-vignette {
          position: absolute;
          inset: 0;
          box-shadow: inset 0 0 120px rgba(0, 0, 0, 0.7);
        }

        .hero-content-container {
          position: relative;
          z-index: var(--z-base);
          display: flex;
          flex-direction: column;
          justify-content: space-between;
          min-height: calc(100vh - var(--header-height) - 6rem);
        }

        .hero-meta-row {
          display: flex;
          align-items: center;
          justify-content: space-between;
          padding-bottom: 1.5rem;
        }

        .hero-badge {
          display: inline-flex;
          align-items: center;
          gap: 0.6rem;
          padding: 0.4rem 0.9rem;
          border-radius: 9999px;
          background: rgba(20, 16, 14, 0.65);
          backdrop-filter: blur(8px);
          border: 1px solid var(--border-light);
        }

        .badge-pulse {
          width: 6px;
          height: 6px;
          border-radius: 50%;
          background-color: var(--accent-copper);
          box-shadow: 0 0 8px var(--accent-copper);
          animation: pulseGlow 2s infinite ease-in-out;
        }

        @keyframes pulseGlow {
          0%, 100% { opacity: 1; transform: scale(1); }
          50% { opacity: 0.4; transform: scale(0.75); }
        }

        .hero-coord {
          font-size: var(--text-2xs);
          letter-spacing: 0.2em;
          color: var(--text-muted);
          display: none;
        }

        @media (min-width: 768px) {
          .hero-coord {
            display: block;
          }
        }

        .hero-headline-wrap {
          margin: 2rem 0;
        }

        .hero-title {
          font-family: var(--font-serif);
          font-size: clamp(3.2rem, 9.5vw, 8.8rem);
          line-height: 0.92;
          font-weight: 400;
          letter-spacing: -0.025em;
          color: var(--text-primary);
          text-transform: uppercase;
        }

        .hero-line-mask {
          overflow: hidden;
          padding-bottom: 0.15em;
        }

        .hero-line {
          display: inline-block;
          will-change: transform, opacity;
        }

        .hero-line-italic {
          font-style: italic;
          font-family: var(--font-editorial);
          color: #E8DFD8;
          display: block;
          letter-spacing: -0.015em;
        }

        .hero-bottom-grid {
          display: grid;
          grid-template-columns: 1fr;
          gap: 2.5rem;
          align-items: flex-end;
          margin-top: 1rem;
        }

        @media (min-width: 900px) {
          .hero-bottom-grid {
            grid-template-columns: 1.4fr 1fr;
          }
        }

        .hero-description {
          font-size: clamp(1.05rem, 1.4vw, 1.25rem);
          line-height: 1.65;
          font-weight: 300;
          color: #DDD5CD;
          max-width: 540px;
          margin-bottom: 2rem;
          text-shadow: 0 2px 10px rgba(0, 0, 0, 0.4);
        }

        .hero-cta-group {
          display: flex;
          flex-wrap: wrap;
          align-items: center;
          gap: 1.25rem;
        }

        .hero-origins-col {
          display: none;
          justify-content: flex-end;
        }

        @media (min-width: 900px) {
          .hero-origins-col {
            display: flex;
          }
        }

        .origin-ticker {
          background: rgba(20, 16, 14, 0.6);
          backdrop-filter: blur(12px);
          border: 1px solid var(--border-light);
          padding: 1.25rem 1.75rem;
          border-radius: 12px;
          display: flex;
          flex-direction: column;
          gap: 1rem;
          min-width: 290px;
        }

        .origin-item {
          display: flex;
          align-items: flex-start;
          gap: 1rem;
        }

        .origin-num {
          font-size: var(--text-2xs);
          color: var(--accent-copper);
          font-weight: 600;
          letter-spacing: 0.15em;
          padding-top: 2px;
        }

        .origin-title {
          font-family: var(--font-serif);
          font-size: 1.05rem;
          color: var(--text-primary);
        }

        .origin-notes {
          font-size: var(--text-xs);
          color: var(--text-muted);
          letter-spacing: 0.05em;
        }

        .hero-scroll-discover {
          margin-top: 3rem;
          display: flex;
          align-items: center;
          gap: 1.25rem;
          cursor: pointer;
          width: fit-content;
        }

        .scroll-indicator-line {
          position: relative;
          width: 1px;
          height: 36px;
          background-color: var(--border-medium);
          overflow: hidden;
        }

        .scroll-dot {
          position: absolute;
          top: 0;
          left: 0;
          width: 100%;
          height: 12px;
          background-color: var(--accent-copper);
          animation: scrollDown 2.2s cubic-bezier(0.65, 0, 0.35, 1) infinite;
        }

        @keyframes scrollDown {
          0% { transform: translateY(-100%); }
          100% { transform: translateY(300%); }
        }

        .scroll-text {
          font-size: var(--text-2xs);
          letter-spacing: 0.24em;
          font-weight: 500;
          color: var(--text-secondary);
          transition: color 0.3s ease;
        }

        .hero-scroll-discover:hover .scroll-text {
          color: var(--accent-copper);
        }
      `}</style>
    </section>
  );
};
