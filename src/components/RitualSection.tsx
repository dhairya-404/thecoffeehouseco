import React, { useEffect, useRef } from 'react';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import { RITUAL_STEPS } from '../data/cafeData';
import { useCursor } from '../context/CursorContext';

gsap.registerPlugin(ScrollTrigger);

export const RitualSection: React.FC = () => {
  const sectionRef = useRef<HTMLElement>(null);
  const pinContainerRef = useRef<HTMLDivElement>(null);
  const horizontalTrackRef = useRef<HTMLDivElement>(null);
  const progressBarRef = useRef<HTMLDivElement>(null);
  const { setCursor, resetCursor } = useCursor();

  useEffect(() => {
    const sectionEl = sectionRef.current;
    const pinEl = pinContainerRef.current;
    const trackEl = horizontalTrackRef.current;
    if (!sectionEl || !pinEl || !trackEl) return;

    const isMobile = window.innerWidth < 768;

    const ctx = gsap.context(() => {
      const getScrollAmount = () => {
        const extraPad = isMobile ? 32 : 80;
        return -(trackEl.scrollWidth - window.innerWidth + extraPad);
      };

      const tl = gsap.timeline({
        scrollTrigger: {
          trigger: sectionEl,
          pin: pinEl,
          scrub: 0.2,
          start: 'top top',
          end: () => `+=${Math.max(window.innerWidth * (isMobile ? 1.8 : 2.2), 1500)}`,
          anticipatePin: 1,
          invalidateOnRefresh: true,
        },
      });

      tl.to(trackEl, {
        x: getScrollAmount,
        ease: 'none',
      }, 0);

      if (progressBarRef.current) {
        tl.fromTo(
          progressBarRef.current,
          { scaleX: 0 },
          { scaleX: 1, ease: 'none' },
          0
        );
      }
    }, sectionEl);

    const refreshTimer = setTimeout(() => {
      ScrollTrigger.refresh();
    }, 150);

    return () => {
      clearTimeout(refreshTimer);
      ctx.revert();
    };
  }, []);

  return (
    <section ref={sectionRef} id="ritual" className="chc-ritual-section" aria-label="The Coffee Brewing Ritual">
      <div ref={pinContainerRef} className="ritual-pin-wrapper">
        <div className="container ritual-header-bar">
          <div className="section-header no-border">
            <span className="section-num">07 / THE EXTRACTION RITUAL</span>
            <span className="section-caption">PRECISION SEQUENCE • GRIND TO CUP</span>
          </div>
        </div>

        <div ref={horizontalTrackRef} className="ritual-horizontal-track">
          <div className="ritual-card intro-step-card">
            <span className="meta-text step-tag">METHODOLOGY</span>
            <h3 className="display-1 ritual-intro-title">
              FOUR STEPS.<br />
              <span className="text-terracotta">ZERO SHORTCUTS.</span>
            </h3>
            <p className="body-lead ritual-intro-lead">
              Every single cup served at The Coffee House Co. follows an invariant extraction timeline measured to the tenth of a second and gram.
            </p>
          </div>

          {RITUAL_STEPS.map((step) => (
            <div
              key={step.number}
              className="ritual-card process-step-card"
              onMouseEnter={() => setCursor('open', step.title)}
              onMouseLeave={resetCursor}
            >
              <div className="step-card-inner">
                <div className="step-top-bar">
                  <span className="step-big-num font-mono">{step.number}</span>
                  <div className="step-timer-badge font-mono">
                    <span>DURATION:</span>
                    <span className="timer-val">{step.duration}</span>
                  </div>
                </div>

                <div className="step-photo-frame">
                  <img src={step.image} alt={step.title} className="step-img" loading="eager" />
                </div>

                <div className="step-bottom-info">
                  <span className="meta-text step-subtitle">{step.subTitle}</span>
                  <h4 className="heading-title step-heading">{step.title}</h4>
                  <p className="body-text step-desc">{step.description}</p>
                  <div className="step-detail-tag font-mono">
                    <span>SPEC:</span> {step.detail}
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>

        <div className="ritual-progress-container">
          <div ref={progressBarRef} className="ritual-progress-line"></div>
        </div>
      </div>

      <style>{`
        .chc-ritual-section {
          position: relative;
          background-color: var(--bg-canvas);
          border-bottom: 1px solid var(--border-hairline);
        }

        .ritual-pin-wrapper {
          position: relative;
          width: 100vw;
          height: 100vh;
          overflow: hidden;
          display: flex;
          flex-direction: column;
          justify-content: space-between;
          padding-top: 1.5rem;
          padding-bottom: 1.5rem;
          box-sizing: border-box;
        }

        .ritual-header-bar {
          z-index: 10;
        }

        .no-border {
          border-top: none;
          margin-bottom: 0;
          padding-top: 0;
        }

        .ritual-horizontal-track {
          display: flex;
          align-items: center;
          gap: clamp(1.5rem, 3vw, 2.5rem);
          padding-left: clamp(1.5rem, 5vw, 6rem);
          padding-right: clamp(1.5rem, 5vw, 6rem);
          will-change: transform;
          flex-grow: 1;
        }

        .ritual-card {
          flex-shrink: 0;
        }

        .intro-step-card {
          width: clamp(320px, 30vw, 460px);
          display: flex;
          flex-direction: column;
          gap: 1.5rem;
        }

        .step-tag {
          color: var(--accent-terracotta);
        }

        .ritual-intro-title {
          font-size: clamp(2.25rem, 4vw, 4.25rem);
          letter-spacing: -0.04em;
        }

        .text-terracotta {
          color: var(--accent-terracotta);
        }

        .ritual-intro-lead {
          color: var(--text-secondary);
        }

        .process-step-card {
          width: clamp(300px, 26vw, 420px);
          height: 68vh;
          background-color: var(--bg-canvas-subtle);
          border: 1px solid var(--border-hairline);
          padding: 1.15rem;
          display: flex;
          flex-direction: column;
        }

        .step-card-inner {
          display: flex;
          flex-direction: column;
          justify-content: space-between;
          height: 100%;
          gap: 0.85rem;
        }

        .step-top-bar {
          display: flex;
          justify-content: space-between;
          align-items: baseline;
          border-bottom: 1px solid var(--border-hairline);
          padding-bottom: 0.65rem;
        }

        .step-big-num {
          font-size: 1.35rem;
          font-weight: 700;
          color: var(--accent-terracotta);
        }

        .step-timer-badge {
          font-size: 0.75rem;
          color: var(--text-muted);
          display: flex;
          gap: 0.35rem;
        }

        .timer-val {
          color: var(--text-primary);
          font-weight: 700;
        }

        .step-photo-frame {
          width: 100%;
          flex-grow: 1;
          overflow: hidden;
          background-color: var(--bg-canvas-subtle);
        }

        .step-img {
          width: 100%;
          height: 100%;
          object-fit: cover;
        }

        .step-bottom-info {
          display: flex;
          flex-direction: column;
          gap: 0.4rem;
          padding-top: 0.65rem;
          border-top: 1px solid var(--border-hairline);
        }

        .step-subtitle {
          color: var(--accent-coffee);
        }

        .step-heading {
          font-size: 1.25rem;
          color: var(--text-primary);
        }

        .step-desc {
          font-size: 0.85rem;
          color: var(--text-secondary);
          line-height: 1.45;
        }

        .step-detail-tag {
          font-size: 0.6875rem;
          color: var(--text-muted);
          background-color: rgba(17, 17, 17, 0.04);
          padding: 0.3rem 0.55rem;
          border: 1px solid var(--border-hairline);
          margin-top: 0.2rem;
        }

        .step-detail-tag span {
          color: var(--accent-terracotta);
          font-weight: 700;
        }

        .ritual-progress-container {
          width: 100%;
          height: 2px;
          background-color: var(--border-hairline);
          position: relative;
        }

        .ritual-progress-line {
          position: absolute;
          top: 0;
          left: 0;
          width: 100%;
          height: 100%;
          background-color: var(--accent-terracotta);
          transform-origin: left center;
        }
      `}</style>
    </section>
  );
};
