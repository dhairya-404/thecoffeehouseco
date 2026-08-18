import React, { useRef, useEffect } from 'react';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import { useCursor } from '../context/CursorContext';

gsap.registerPlugin(ScrollTrigger);

export const StorySection: React.FC = () => {
  const sectionRef = useRef<HTMLElement>(null);
  const img1Ref = useRef<HTMLDivElement>(null);
  const img2Ref = useRef<HTMLDivElement>(null);
  const textColRef = useRef<HTMLDivElement>(null);
  const { setCursor, resetCursor } = useCursor();

  useEffect(() => {
    const ctx = gsap.context(() => {
      // Parallax effect on layered photos
      if (img1Ref.current) {
        gsap.to(img1Ref.current, {
          y: -40,
          ease: 'none',
          scrollTrigger: {
            trigger: sectionRef.current,
            start: 'top bottom',
            end: 'bottom top',
            scrub: 1,
          },
        });
      }

      if (img2Ref.current) {
        gsap.to(img2Ref.current, {
          y: 50,
          ease: 'none',
          scrollTrigger: {
            trigger: sectionRef.current,
            start: 'top bottom',
            end: 'bottom top',
            scrub: 1.2,
          },
        });
      }
    }, sectionRef);

    return () => ctx.revert();
  }, []);

  return (
    <section ref={sectionRef} id="story" className="story-section" aria-label="Café Story and Architecture">
      <div className="container">
        {/* Asymmetric Header */}
        <div className="story-header-row">
          <span className="label-caps">OUR SPACE & GENESIS</span>
          <span className="story-origin-tag">AHMEDABAD • EST. 2018</span>
        </div>

        <div className="story-asymmetric-grid">
          {/* Left Column: Huge Headline + Text */}
          <div ref={textColRef} className="story-narrative-col">
            <h2 className="story-display-title">
              BUILT FOR<br />
              <span className="font-editorial italic highlight-text">SLOW</span><br />
              MORNINGS.
            </h2>

            <div className="story-text-blocks">
              <p className="story-p lead-p">
                Ember & Bean began with a quiet conviction: that in a city moving as rapidly as Ahmedabad, there should exist a sanctuary where time is uncoupled from urgency.
              </p>
              <p className="story-p">
                We designed our space along the riverfront using reclaimed teakwood, raw hand-cast lime plaster, and warm textured linen. Sunlight enters indirectly through slatted louvers, creating shifting geometric shadows that mark the quiet passage of morning into afternoon.
              </p>
              <p className="story-p">
                There are no loud television screens, no blaring buzzers, and no hurry. Just the hiss of steam, the aroma of newly cracked beans, and conversations that have room to breathe.
              </p>
            </div>

            {/* Architecture Metrics */}
            <div className="story-pillars-grid">
              <div className="pillar-item">
                <span className="pillar-num">24</span>
                <span className="pillar-label">SEATS ONLY FOR INTIMACY</span>
              </div>
              <div className="pillar-item">
                <span className="pillar-num">100%</span>
                <span className="pillar-label">TRACEABLE ESTATE HARVESTS</span>
              </div>
              <div className="pillar-item">
                <span className="pillar-num">0</span>
                <span className="pillar-label">ARTIFICIAL SYRUPS OR POWDERS</span>
              </div>
            </div>
          </div>

          {/* Right Column: Layered Asymmetric Photography */}
          <div className="story-visuals-col">
            {/* Primary Large Photo */}
            <div
              ref={img1Ref}
              className="story-photo-card photo-main"
              onMouseEnter={() => setCursor('view', 'SPACE')}
              onMouseLeave={resetCursor}
            >
              <img
                src="/images/story_atelier.jpg"
                alt="Minimalist architectural cafe interior with warm lighting and wooden furniture"
                className="story-img"
                loading="lazy"
              />
              <div className="photo-label-badge">RIVERFRONT ATELIER / 08:30 AM</div>
            </div>

            {/* Secondary Floating Overlapping Photo */}
            <div
              ref={img2Ref}
              className="story-photo-card photo-overlap"
              onMouseEnter={() => setCursor('view', 'ROAST')}
              onMouseLeave={resetCursor}
            >
              <img
                src="/images/story_roast.jpg"
                alt="Hand roasted specialty coffee beans cooling on tray"
                className="story-img"
                loading="lazy"
              />
              <div className="photo-label-badge">SMALL-BATCH ROAST / 2KG DRUM</div>
            </div>
          </div>
        </div>
      </div>

      <style>{`
        .story-section {
          position: relative;
          background-color: var(--bg-secondary);
          padding-top: clamp(6rem, 12vw, 12rem);
          padding-bottom: clamp(6rem, 12vw, 12rem);
          overflow: hidden;
        }

        .story-header-row {
          display: flex;
          justify-content: space-between;
          align-items: center;
          border-bottom: 1px solid var(--border-light);
          padding-bottom: 1.5rem;
          margin-bottom: 4rem;
        }

        .story-origin-tag {
          font-size: var(--text-2xs);
          letter-spacing: 0.2em;
          color: var(--text-muted);
        }

        .story-asymmetric-grid {
          display: grid;
          grid-template-columns: 1fr;
          gap: 4rem;
        }

        @media (min-width: 1024px) {
          .story-asymmetric-grid {
            grid-template-columns: 1.15fr 1fr;
            gap: 6rem;
            align-items: center;
          }
        }

        .story-display-title {
          font-family: var(--font-serif);
          font-size: clamp(3rem, 6.5vw, 5.8rem);
          line-height: 0.95;
          letter-spacing: -0.02em;
          color: var(--text-primary);
          margin-bottom: 2.5rem;
        }

        .highlight-text {
          color: var(--accent-copper);
        }

        .story-text-blocks {
          display: flex;
          flex-direction: column;
          gap: 1.5rem;
          max-width: 580px;
          margin-bottom: 3.5rem;
        }

        .story-p {
          font-size: 1.05rem;
          line-height: 1.7;
          color: #BDB4AA;
          font-weight: 300;
        }

        .story-p.lead-p {
          font-size: 1.25rem;
          line-height: 1.6;
          color: #E8DFD8;
        }

        .story-pillars-grid {
          display: grid;
          grid-template-columns: repeat(3, 1fr);
          gap: 1.5rem;
          border-top: 1px solid var(--border-light);
          padding-top: 2rem;
        }

        .pillar-item {
          display: flex;
          flex-direction: column;
          gap: 0.4rem;
        }

        .pillar-num {
          font-family: var(--font-serif);
          font-size: clamp(1.8rem, 2.8vw, 2.5rem);
          color: var(--accent-copper);
          line-height: 1;
        }

        .pillar-label {
          font-size: 0.625rem;
          letter-spacing: 0.18em;
          color: var(--text-muted);
          line-height: 1.4;
        }

        /* Layered Photography */
        .story-visuals-col {
          position: relative;
          min-height: 520px;
          display: flex;
          align-items: center;
        }

        .story-photo-card {
          position: relative;
          border-radius: 4px;
          overflow: hidden;
          background: #000;
          box-shadow: 0 25px 60px rgba(0, 0, 0, 0.6);
        }

        .photo-main {
          width: 85%;
          height: 480px;
          will-change: transform;
        }

        .photo-overlap {
          position: absolute;
          right: 0;
          bottom: -20px;
          width: 60%;
          height: 320px;
          border: 4px solid var(--bg-secondary);
          z-index: 2;
          will-change: transform;
        }

        .story-img {
          width: 100%;
          height: 100%;
          object-fit: cover;
          transition: transform 0.8s ease;
        }

        .story-photo-card:hover .story-img {
          transform: scale(1.06);
        }

        .photo-label-badge {
          position: absolute;
          bottom: 1rem;
          left: 1rem;
          background: rgba(15, 12, 10, 0.85);
          backdrop-filter: blur(8px);
          padding: 0.35rem 0.75rem;
          border-radius: 4px;
          font-size: 0.625rem;
          letter-spacing: 0.16em;
          color: var(--text-primary);
          border: 1px solid var(--border-light);
        }
      `}</style>
    </section>
  );
};
