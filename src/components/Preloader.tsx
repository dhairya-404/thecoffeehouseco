import React, { useEffect, useRef } from 'react';
import gsap from 'gsap';

interface PreloaderProps {
  onComplete: () => void;
}

export const Preloader: React.FC<PreloaderProps> = ({ onComplete }) => {
  const preloaderRef = useRef<HTMLDivElement>(null);
  const textRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const tl = gsap.timeline({
      onComplete: () => {
        onComplete();
      },
    });

    // Initial state
    gsap.set(preloaderRef.current, { opacity: 1 });

    // Fade in preloader
    tl.fromTo(
      preloaderRef.current,
      { opacity: 0 },
      { opacity: 1, duration: 0.5 }
    )
    // Animate text
      .fromTo(
        textRef.current,
        { opacity: 0, y: 30, scale: 0.9 },
        { opacity: 1, y: 0, scale: 1, duration: 0.8, ease: 'power3.out' }
      )
    // Fade out preloader
      .to(preloaderRef.current, {
        opacity: 0,
        duration: 0.8,
        delay: 1.5,
        ease: 'power3.inOut',
      });
  }, [onComplete]);

  return (
    <div ref={preloaderRef} className="preloader" aria-hidden="true">
      <div ref={textRef} className="preloader-content">
        <span className="preloader-label meta-text">THE COFFEE HOUSE CO.</span>
        <h1 className="preloader-title display-1">PREPARING</h1>
      </div>
    </div>
  );
};
