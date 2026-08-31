import React, { useRef, useEffect } from 'react';
import gsap from 'gsap';
import { useCursor } from '../context/CursorContext';

export const IntroStatement: React.FC = () => {
  const sectionRef = useRef<HTMLElement>(null);
  const titleRef = useRef<HTMLHeadingElement>(null);
  const textRef = useRef<HTMLDivElement>(null);
  const { setCursor, resetCursor } = useCursor();

  useEffect(() => {
    const ctx = gsap.context(() => {
      gsap.fromTo(
        titleRef.current,
        { opacity: 0, y: 40 },
        {
          opacity: 1,
          y: 0,
          duration: 1,
          ease: 'power3.out',
          scrollTrigger: {
            trigger: titleRef.current,
            start: 'top 85%',
          },
        }
      );

      gsap.fromTo(
        textRef.current?.querySelectorAll('.intro-anim-block') || [],
        { opacity: 0, y: 30 },
        {
          opacity: 1,
          y: 0,
          duration: 0.8,
          stagger: 0.15,
          ease: 'power3.out',
          scrollTrigger: {
            trigger: textRef.current,
            start: 'top 80%',
          },
        }
      );
    }, sectionRef);

    return () => ctx.revert();
  }, []);

  return (
    <section ref={sectionRef} className="chc-intro-section" id="intro" aria-label="About The House">
      <div className="container">
        <div className="section-header">
          <span className="section-num">02 / THE HOUSE</span>
          <span className="section-caption">ARCHITECTURE × CRAFT × CULTURE</span>
        </div>

        <div className="swiss-grid intro-statement-grid">
          <div className="col-10 col-lg-8 col-sm-12">
            <h2 ref={titleRef} className="heading-section intro-statement-text">
              A SANCTUARY FOR SLOW MORNINGS, UNHURRIED CONVERSATIONS, AND COFFEE PREPARED WITH SCIENTIFIC RIGOR.
            </h2>
          </div>
        </div>

        <div ref={textRef} className="swiss-grid intro-details-grid">
          <div className="col-4 col-lg-4 col-sm-12 intro-anim-block">
            <div className="intro-card-border">
              <span className="meta-text pillar-index">01 / ARCHITECTURE</span>
              <h3 className="heading-title intro-pillar-title">Limestone & Teakwood</h3>
              <p className="body-text">
                Designed to quiet the senses. Natural morning light sweeps across raw lime plaster and hand-planed Indian teak surfaces, creating a physical space uncoupled from city urgency.
              </p>
            </div>
          </div>

          <div className="col-4 col-lg-4 col-sm-12 intro-anim-block">
            <div className="intro-card-border">
              <span className="meta-text pillar-index">02 / CALIBRATION</span>
              <h3 className="heading-title intro-pillar-title">Triple-Filtered Minerals</h3>
              <p className="body-text">
                Coffee is 98% water. Our extraction lab custom-mineralizes reverse osmosis mountain water with balanced calcium and magnesium ions at exactly 93.5°C per origin profile.
              </p>
            </div>
          </div>

          <div className="col-4 col-lg-4 col-sm-12 intro-anim-block">
            <div className="intro-card-border">
              <span className="meta-text pillar-index">03 / ETHOS</span>
              <h3 className="heading-title intro-pillar-title">Direct Estate Harvests</h3>
              <p className="body-text">
                We partner with generational shade-grown coffee estates across Chikmagalur and Biligirirangana Hills, roasting in microscopic 2kg batches strictly to preserve terroir clarity.
              </p>
            </div>
          </div>
        </div>

        <div
          className="intro-pullquote-banner"
          onMouseEnter={() => setCursor('link')}
          onMouseLeave={resetCursor}
        >
          <div className="pullquote-inner">
            <span className="meta-text">FOUNDER'S MEMORANDUM</span>
            <p className="font-display pullquote-statement">
              "We do not offer quick coffee. We offer the quiet grace of paying complete attention."
            </p>
            <div className="pullquote-signature meta-text">— THE COFFEE HOUSE CO. / AHMEDABAD</div>
          </div>
        </div>
      </div>

      <style>{`
        .chc-intro-section {
          padding-top: clamp(4rem, 8vw, 7rem);
          padding-bottom: clamp(4rem, 8vw, 7rem);
          background-color: var(--bg-canvas);
          border-bottom: 1px solid var(--border-hairline);
        }

        .intro-statement-grid {
          margin-bottom: clamp(3.5rem, 6vw, 6rem);
        }

        .intro-statement-text {
          font-size: clamp(2.25rem, 4.2vw, 4.75rem);
          line-height: 1.05;
          letter-spacing: -0.035em;
          color: var(--text-primary);
        }

        .intro-details-grid {
          row-gap: 2.5rem;
          margin-bottom: clamp(3.5rem, 6vw, 6rem);
        }

        .intro-card-border {
          border-top: 1px solid var(--border-hairline);
          padding-top: 1.5rem;
          display: flex;
          flex-direction: column;
          gap: 1rem;
        }

        .pillar-index {
          color: var(--accent-terracotta);
        }

        .intro-pillar-title {
          font-size: 1.35rem;
          font-weight: 600;
          color: var(--text-primary);
        }

        .intro-pullquote-banner {
          background-color: var(--bg-canvas-subtle);
          border: 1px solid var(--border-hairline);
          padding: clamp(2.5rem, 5vw, 4.5rem) clamp(1.5rem, 4vw, 3.5rem);
        }

        .pullquote-inner {
          display: flex;
          flex-direction: column;
          gap: 1.5rem;
          max-width: 960px;
        }

        .pullquote-statement {
          font-size: clamp(1.5rem, 3vw, 2.75rem);
          line-height: 1.18;
          letter-spacing: -0.025em;
          color: var(--text-primary);
          font-weight: 500;
        }

        .pullquote-signature {
          color: var(--text-muted);
        }
      `}</style>
    </section>
  );
};
