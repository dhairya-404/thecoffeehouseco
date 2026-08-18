import React, { useEffect, useRef } from 'react';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import { RITUAL_STEPS } from '../data/cafeData';
import { useCursor } from '../context/CursorContext';

gsap.registerPlugin(ScrollTrigger);

export const RitualSection: React.FC = () => {
  const pinContainerRef = useRef<HTMLDivElement>(null);
  const horizontalTrackRef = useRef<HTMLDivElement>(null);
  const progressBarRef = useRef<HTMLDivElement>(null);
  const { setCursor, resetCursor } = useCursor();

  useEffect(() => {
    const pinEl = pinContainerRef.current;
    const trackEl = horizontalTrackRef.current;
    if (!pinEl || !trackEl) return;

    // Check screen width for horizontal pin (on small mobile screens, we can let it scroll or horizontal scrub smoothly)
    const isMobile = window.innerWidth < 768;

    const ctx = gsap.context(() => {
      const getScrollAmount = () => {
        return -(trackEl.scrollWidth - window.innerWidth + (isMobile ? 40 : 100));
      };

      const tl = gsap.timeline({
        scrollTrigger: {
          trigger: pinEl,
          pin: true,
          scrub: 1,
          start: 'top top',
          end: () => `+=${Math.max(window.innerWidth * (isMobile ? 2.2 : 2.5), 1800)}`,
          invalidateOnRefresh: true,
        },
      });

      // Animate horizontal translation of the track
      tl.to(trackEl, {
        x: getScrollAmount,
        ease: 'none',
      }, 0);

      // Animate scaleX of horizontal progress bar in sync
      if (progressBarRef.current) {
        tl.fromTo(progressBarRef.current,
          { scaleX: 0 },
          { scaleX: 1, ease: 'none' },
          0
        );
      }
    }, pinEl);

    return () => ctx.revert();
  }, []);

  return (
    <section id="ritual" className="ritual-section" aria-label="The Coffee Brewing Ritual">
      <div ref={pinContainerRef} className="ritual-pin-wrapper">
        {/* Sticky Section Header Bar */}
        <div className="ritual-fixed-header container">
          <div className="ritual-title-wrap">
            <span className="label-caps">THE CRAFT PROCESS</span>
            <h2 className="heading-1 ritual-heading">
              THE <span className="font-editorial italic text-copper">RITUAL.</span>
            </h2>
          </div>

          <div className="ritual-progress-wrapper">
            <span className="ritual-progress-label">HORIZONTAL FLOW</span>
            <div className="ritual-progress-track">
              <div ref={progressBarRef} className="ritual-progress-bar"></div>
            </div>
          </div>
        </div>

        {/* Horizontal Scrolling Track */}
        <div
          ref={horizontalTrackRef}
          className="ritual-horizontal-track"
          onMouseEnter={() => setCursor('drag', 'SCROLL')}
          onMouseLeave={resetCursor}
        >
          {/* Intro Card / Philosophy Slide */}
          <div className="ritual-intro-slide">
            <div className="ritual-quote-box">
              <span className="ritual-step-tag">DISCIPLINE</span>
              <h3 className="ritual-quote-title">
                "Four deliberate acts. From whole roasted cherry to the perfect extraction."
              </h3>
              <p className="ritual-quote-desc">
                No automatic machines. No shortcuts. Every pour-over is hand-executed by baristas trained in fluid dynamics and thermal balance.
              </p>
              <div className="ritual-scroll-hint">
                <span>SCROLL VERTICALLY TO NAVIGATE</span>
                <span className="hint-arrow">→</span>
              </div>
            </div>
          </div>

          {/* 4 Step Cards */}
          {RITUAL_STEPS.map((step) => (
            <div key={step.number} className="ritual-step-card">
              <div className="ritual-card-inner">
                {/* Visual Area */}
                <div className="ritual-image-frame">
                  <img
                    src={step.image}
                    alt={`${step.title} - ${step.subTitle}`}
                    className="ritual-img"
                    loading="lazy"
                  />
                  <div className="ritual-timer-badge">
                    <span className="timer-icon">⏱</span>
                    <span>{step.duration}</span>
                  </div>
                </div>

                {/* Content Area */}
                <div className="ritual-card-content">
                  <div className="step-num-badge">STAGE {step.number}</div>
                  <h3 className="step-title-display">{step.title}</h3>
                  <div className="step-subtitle">{step.subTitle}</div>

                  <p className="step-desc-p">{step.description}</p>

                  <div className="step-param-box">
                    <span className="param-label">EXTRACTION PARAMETER:</span>
                    <span className="param-text">{step.detail}</span>
                  </div>
                </div>
              </div>
            </div>
          ))}

          {/* Final Transition Outro Slide */}
          <div className="ritual-outro-slide">
            <div className="outro-card">
              <span className="label-caps">COMPLETION</span>
              <h3 className="outro-title">READY TO BE SAVORED.</h3>
              <p className="outro-desc">
                Take a seat by the sunlit window. The coffee has arrived at its optimum temperature.
              </p>
              <a href="#atmosphere" className="btn-magnetic btn-primary" style={{ marginTop: '1.5rem', display: 'inline-flex' }}>
                EXPLORE ATMOSPHERE ↓
              </a>
            </div>
          </div>
        </div>
      </div>

      <style>{`
        .ritual-section {
          position: relative;
          background-color: #120E0C;
          overflow: hidden;
          border-top: 1px solid var(--border-light);
          border-bottom: 1px solid var(--border-light);
        }

        .ritual-pin-wrapper {
          position: relative;
          height: 100vh;
          width: 100%;
          display: flex;
          flex-direction: column;
          justify-content: space-between;
          padding: 2.5rem 0 3rem;
          overflow: hidden;
        }

        .ritual-fixed-header {
          display: flex;
          justify-content: space-between;
          align-items: flex-end;
          padding-top: 1.5rem;
          margin-bottom: 1.5rem;
          z-index: 10;
        }

        .ritual-heading {
          margin-top: 0.25rem;
          color: var(--text-primary);
        }

        .text-copper {
          color: var(--accent-copper);
        }

        .ritual-progress-wrapper {
          display: none;
          flex-direction: column;
          gap: 0.5rem;
          width: 200px;
        }

        @media (min-width: 768px) {
          .ritual-progress-wrapper {
            display: flex;
          }
        }

        .ritual-progress-label {
          font-size: var(--text-2xs);
          letter-spacing: 0.2em;
          color: var(--text-muted);
        }

        .ritual-progress-track {
          width: 100%;
          height: 2px;
          background-color: rgba(245, 240, 235, 0.1);
          overflow: hidden;
        }

        .ritual-progress-bar {
          width: 100%;
          height: 100%;
          background-color: var(--accent-copper);
          transform-origin: left center;
          transform: scaleX(0);
          will-change: transform;
        }

        .ritual-horizontal-track {
          display: flex;
          gap: 3.5rem;
          padding: 0 var(--container-padding);
          height: calc(100vh - 180px);
          align-items: center;
          width: fit-content;
          will-change: transform;
        }

        /* Intro Slide */
        .ritual-intro-slide {
          width: clamp(300px, 35vw, 460px);
          flex-shrink: 0;
          height: 100%;
          display: flex;
          align-items: center;
        }

        .ritual-quote-box {
          background: rgba(23, 19, 16, 0.8);
          border: 1px solid var(--border-light);
          padding: 3rem 2.5rem;
          border-radius: 8px;
          display: flex;
          flex-direction: column;
          gap: 1.25rem;
        }

        .ritual-step-tag {
          font-size: var(--text-2xs);
          letter-spacing: 0.2em;
          color: var(--accent-copper);
          font-weight: 600;
        }

        .ritual-quote-title {
          font-family: var(--font-serif);
          font-size: clamp(1.4rem, 2vw, 1.85rem);
          line-height: 1.25;
          color: var(--text-primary);
        }

        .ritual-quote-desc {
          font-size: 0.95rem;
          line-height: 1.6;
          color: var(--text-secondary);
          font-weight: 300;
        }

        .ritual-scroll-hint {
          display: flex;
          align-items: center;
          gap: 0.75rem;
          font-size: var(--text-2xs);
          letter-spacing: 0.18em;
          color: var(--accent-copper);
          margin-top: 1rem;
        }

        .hint-arrow {
          font-size: 1.1rem;
          animation: bounceX 1.5s infinite alternate;
        }

        @keyframes bounceX {
          from { transform: translateX(0); }
          to { transform: translateX(6px); }
        }

        /* Step Cards */
        .ritual-step-card {
          width: clamp(340px, 50vw, 680px);
          height: 100%;
          flex-shrink: 0;
          display: flex;
          align-items: center;
        }

        .ritual-card-inner {
          display: grid;
          grid-template-columns: 1fr;
          gap: 2rem;
          width: 100%;
          height: 90%;
          max-height: 520px;
          background: rgba(23, 19, 16, 0.9);
          border: 1px solid var(--border-light);
          border-radius: 8px;
          overflow: hidden;
          padding: 1.5rem;
        }

        @media (min-width: 900px) {
          .ritual-card-inner {
            grid-template-columns: 1fr 1.1fr;
            padding: 2rem;
            gap: 2.5rem;
          }
        }

        .ritual-image-frame {
          position: relative;
          width: 100%;
          height: 100%;
          min-height: 220px;
          border-radius: 4px;
          overflow: hidden;
          background: #000;
        }

        .ritual-img {
          position: absolute;
          inset: 0;
          width: 100%;
          height: 100%;
          object-fit: cover;
          transition: transform 0.6s ease;
        }

        .ritual-step-card:hover .ritual-img {
          transform: scale(1.06);
        }

        .ritual-timer-badge {
          position: absolute;
          top: 1rem;
          right: 1rem;
          display: flex;
          align-items: center;
          gap: 0.4rem;
          background: rgba(15, 12, 10, 0.85);
          backdrop-filter: blur(8px);
          padding: 0.35rem 0.75rem;
          border-radius: 9999px;
          font-size: var(--text-xs);
          font-family: monospace;
          color: var(--accent-copper);
          border: 1px solid var(--border-light);
        }

        .ritual-card-content {
          display: flex;
          flex-direction: column;
          justify-content: center;
          gap: 1rem;
        }

        .step-num-badge {
          font-size: var(--text-2xs);
          letter-spacing: 0.2em;
          color: var(--accent-copper);
          font-weight: 600;
        }

        .step-title-display {
          font-family: var(--font-serif);
          font-size: clamp(2rem, 3.5vw, 3rem);
          line-height: 1;
          color: var(--text-primary);
          letter-spacing: -0.01em;
        }

        .step-subtitle {
          font-family: var(--font-editorial);
          font-style: italic;
          font-size: 1.1rem;
          color: #DDD4CB;
        }

        .step-desc-p {
          font-size: 0.95rem;
          line-height: 1.6;
          color: #BDB4AA;
          font-weight: 300;
        }

        .step-param-box {
          background: rgba(15, 12, 10, 0.5);
          border-left: 2px solid var(--accent-copper);
          padding: 0.75rem 1rem;
          margin-top: 0.5rem;
          display: flex;
          flex-direction: column;
          gap: 0.25rem;
        }

        .param-label {
          font-size: 0.625rem;
          letter-spacing: 0.18em;
          color: var(--text-muted);
        }

        .param-text {
          font-size: var(--text-xs);
          color: var(--text-primary);
          font-weight: 500;
        }

        /* Outro Slide */
        .ritual-outro-slide {
          width: clamp(280px, 30vw, 420px);
          flex-shrink: 0;
          height: 100%;
          display: flex;
          align-items: center;
          padding-right: 4rem;
        }

        .outro-card {
          background: rgba(29, 24, 20, 0.9);
          border: 1px solid var(--border-copper);
          padding: 3rem 2.5rem;
          border-radius: 8px;
          display: flex;
          flex-direction: column;
          gap: 1.25rem;
        }

        .outro-title {
          font-family: var(--font-serif);
          font-size: 1.85rem;
          color: var(--text-primary);
        }

        .outro-desc {
          font-size: 0.95rem;
          line-height: 1.6;
          color: var(--text-secondary);
        }
      `}</style>
    </section>
  );
};
