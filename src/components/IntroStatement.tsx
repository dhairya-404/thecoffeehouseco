import React, { useEffect, useRef } from 'react';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import { useCursor } from '../context/CursorContext';

gsap.registerPlugin(ScrollTrigger);

export const IntroStatement: React.FC = () => {
  const sectionRef = useRef<HTMLElement>(null);
  const headlineRef = useRef<HTMLHeadingElement>(null);
  const textRef = useRef<HTMLParagraphElement>(null);
  const quoteRef = useRef<HTMLDivElement>(null);
  const { setCursor, resetCursor } = useCursor();

  useEffect(() => {
    const ctx = gsap.context(() => {
      const lines = headlineRef.current?.querySelectorAll('.statement-line');
      if (lines) {
        gsap.fromTo(
          lines,
          { y: 80, opacity: 0.1, rotateX: -20 },
          {
            y: 0,
            opacity: 1,
            rotateX: 0,
            duration: 1.2,
            stagger: 0.2,
            ease: 'power3.out',
            scrollTrigger: {
              trigger: headlineRef.current,
              start: 'top 80%',
              end: 'bottom 60%',
              scrub: 1,
            },
          }
        );
      }

      if (textRef.current) {
        gsap.fromTo(
          textRef.current,
          { y: 40, opacity: 0 },
          {
            y: 0,
            opacity: 1,
            duration: 1,
            ease: 'power2.out',
            scrollTrigger: {
              trigger: textRef.current,
              start: 'top 85%',
              toggleActions: 'play none none reverse',
            },
          }
        );
      }

      if (quoteRef.current) {
        gsap.fromTo(
          quoteRef.current,
          { scale: 0.95, opacity: 0 },
          {
            scale: 1,
            opacity: 1,
            duration: 1,
            ease: 'power2.out',
            scrollTrigger: {
              trigger: quoteRef.current,
              start: 'top 85%',
              toggleActions: 'play none none reverse',
            },
          }
        );
      }
    }, sectionRef);

    return () => ctx.revert();
  }, []);

  return (
    <section ref={sectionRef} id="intro" className="intro-section" aria-label="Introduction Statement">
      <div className="container">
        {/* Label */}
        <div className="intro-header">
          <span className="label-caps">OUR PHILOSOPHY</span>
          <span className="intro-line-sep"></span>
          <span className="intro-vol">VOL. 01 / THE CONVICTION</span>
        </div>

        {/* Large Statement */}
        <div className="intro-headline-wrap">
          <h2 ref={headlineRef} className="intro-statement">
            <span className="statement-line">WE BELIEVE</span>
            <span className="statement-line highlight">GOOD COFFEE</span>
            <span className="statement-line italic">DESERVES</span>
            <span className="statement-line">TIME.</span>
          </h2>
        </div>

        {/* Supporting Editorial Paragraphs & Asymmetric Layout */}
        <div className="intro-editorial-grid">
          <div className="intro-visual-col">
            <div
              className="intro-photo-card"
              onMouseEnter={() => setCursor('view', 'RITUAL')}
              onMouseLeave={resetCursor}
            >
              <img
                src="/images/ritual_wait.jpg"
                alt="Carefully brewing manual pour-over specialty coffee"
                className="intro-photo-img"
                loading="lazy"
              />
              <div className="intro-photo-badge">SLOW EXTRACTION • 93.5°C</div>
            </div>
          </div>
          
          <div className="intro-content-col">
            <p ref={textRef} className="intro-body-copy">
              In an accelerated world fixated on haste and automated buttons, Ember & Bean was founded to protect the quiet grace of the pause. Every bean we roast is treated as an agricultural marvel, demanding tailored temperatures, calibrated grinds, and unhurried brewing.
            </p>

            <div ref={quoteRef} className="intro-quote-card" onMouseEnter={() => setCursor('link')} onMouseLeave={resetCursor}>
              <div className="quote-mark">“</div>
              <p className="quote-text">
                The cup in your hands is the final punctuation mark of a journey that began on mountain slopes months ago. We only ask that you give it your full attention.
              </p>
              <div className="quote-author">— Dhairya & Jiya, Founders</div>
            </div>
          </div>
        </div>
      </div>

      <style>{`
        .intro-section {
          position: relative;
          background-color: var(--bg-secondary);
          padding-top: clamp(6rem, 12vw, 12rem);
          padding-bottom: clamp(6rem, 12vw, 12rem);
          border-top: 1px solid var(--border-light);
          border-bottom: 1px solid var(--border-light);
          overflow: hidden;
        }

        .intro-header {
          display: flex;
          align-items: center;
          gap: 1.5rem;
          margin-bottom: 4rem;
        }

        .intro-line-sep {
          width: 60px;
          height: 1px;
          background-color: var(--border-medium);
        }

        .intro-vol {
          font-size: var(--text-2xs);
          letter-spacing: 0.2em;
          color: var(--text-muted);
        }

        .intro-headline-wrap {
          margin-bottom: 4.5rem;
        }

        .intro-statement {
          font-family: var(--font-serif);
          font-size: clamp(2.8rem, 7.5vw, 6.8rem);
          line-height: 1.02;
          font-weight: 400;
          letter-spacing: -0.02em;
          color: var(--text-primary);
          display: flex;
          flex-direction: column;
          perspective: 1000px;
        }

        .statement-line {
          display: block;
          will-change: transform, opacity;
        }

        .statement-line.highlight {
          color: var(--accent-copper);
        }

        .statement-line.italic {
          font-family: var(--font-editorial);
          font-style: italic;
          color: #DDD4CB;
        }

        .intro-editorial-grid {
          display: grid;
          grid-template-columns: 1fr;
          gap: 3rem;
        }

        @media (min-width: 900px) {
          .intro-editorial-grid {
            grid-template-columns: 0.45fr 1fr;
            gap: 4.5rem;
            align-items: center;
          }
        }

        .intro-visual-col {
          display: flex;
          align-items: center;
          justify-content: center;
        }

        .intro-photo-card {
          position: relative;
          width: 100%;
          max-width: 320px;
          border-radius: 8px;
          overflow: hidden;
          background: #14100E;
          box-shadow: 0 20px 45px rgba(0, 0, 0, 0.4);
          border: 1px solid var(--border-light);
        }

        .intro-photo-img {
          width: 100%;
          height: 380px;
          object-fit: cover;
          display: block;
          transition: transform 0.6s ease;
        }

        .intro-photo-card:hover .intro-photo-img {
          transform: scale(1.05);
        }

        .intro-photo-badge {
          position: absolute;
          bottom: 1rem;
          left: 1rem;
          background: rgba(15, 12, 10, 0.85);
          backdrop-filter: blur(8px);
          padding: 0.35rem 0.75rem;
          border-radius: 4px;
          font-size: 0.625rem;
          letter-spacing: 0.16em;
          color: var(--accent-copper);
          border: 1px solid var(--border-light);
          font-weight: 600;
        }

        .intro-body-copy {
          font-size: clamp(1.2rem, 1.8vw, 1.5rem);
          line-height: 1.65;
          font-weight: 300;
          color: #C2BAB1;
          margin-bottom: 3.5rem;
          max-width: 680px;
        }

        .intro-quote-card {
          position: relative;
          background: rgba(29, 24, 20, 0.7);
          border-left: 2px solid var(--accent-copper);
          padding: 2.5rem 2rem 2rem 3rem;
          border-radius: 0 8px 8px 0;
          max-width: 640px;
          transition: background-color 0.3s ease;
        }

        .intro-quote-card:hover {
          background: rgba(35, 29, 24, 0.9);
        }

        .quote-mark {
          position: absolute;
          top: -0.25rem;
          left: 1rem;
          font-family: var(--font-serif);
          font-size: 3.5rem;
          line-height: 1;
          color: var(--accent-copper);
          opacity: 0.4;
        }

        .quote-text {
          font-family: var(--font-editorial);
          font-style: italic;
          font-size: 1.15rem;
          line-height: 1.6;
          color: var(--text-primary);
          margin-bottom: 1.25rem;
        }

        .quote-author {
          font-size: var(--text-xs);
          letter-spacing: 0.15em;
          color: var(--text-muted);
          text-transform: uppercase;
        }
      `}</style>
    </section>
  );
};
