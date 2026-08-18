import React, { useEffect, useState, useRef } from 'react';
import gsap from 'gsap';

interface PreloaderProps {
  onComplete: () => void;
}

export const Preloader: React.FC<PreloaderProps> = ({ onComplete }) => {
  const [count, setCount] = useState(0);
  const curtainRef = useRef<HTMLDivElement>(null);
  const contentRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    let progress = 0;
    const interval = setInterval(() => {
      progress += Math.floor(Math.random() * 12) + 6;
      if (progress >= 100) {
        progress = 100;
        setCount(100);
        clearInterval(interval);

        // Curtain Lift Animation
        const tl = gsap.timeline({
          onComplete: () => {
            onComplete();
          },
        });

        tl.to(contentRef.current, {
          y: -40,
          opacity: 0,
          duration: 0.6,
          ease: 'power3.in',
        });

        tl.to(curtainRef.current, {
          yPercent: -100,
          duration: 1.1,
          ease: 'power4.inOut',
        });
      } else {
        setCount(progress);
      }
    }, 60);

    return () => clearInterval(interval);
  }, [onComplete]);

  return (
    <div ref={curtainRef} className="preloader-curtain" aria-hidden="true">
      <div ref={contentRef} className="preloader-content">
        <div className="preloader-brand">EMBER & BEAN</div>
        <div className="preloader-counter">{count.toString().padStart(2, '0')}%</div>
        <div className="preloader-tagline">COFFEE, SLOWLY MADE.</div>
      </div>

      <style>{`
        .preloader-curtain {
          position: fixed;
          inset: 0;
          width: 100vw;
          height: 100vh;
          background-color: #0A0807;
          z-index: 1000000;
          display: flex;
          align-items: center;
          justify-content: center;
          will-change: transform;
        }

        .preloader-content {
          display: flex;
          flex-direction: column;
          align-items: center;
          gap: 1.25rem;
          text-align: center;
        }

        .preloader-brand {
          font-family: var(--font-serif);
          font-size: 1.1rem;
          letter-spacing: 0.25em;
          color: var(--accent-copper);
        }

        .preloader-counter {
          font-family: var(--font-serif);
          font-size: clamp(4rem, 10vw, 8rem);
          color: var(--text-primary);
          line-height: 1;
          font-weight: 400;
        }

        .preloader-tagline {
          font-size: var(--text-2xs);
          letter-spacing: 0.3em;
          color: var(--text-muted);
          text-transform: uppercase;
        }
      `}</style>
    </div>
  );
};
