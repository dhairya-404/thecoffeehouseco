import React, { useEffect, useRef } from 'react';
import { useCursor } from '../context/CursorContext';

export const CustomCursor: React.FC = () => {
  const { cursorState } = useCursor();
  const dotRef = useRef<HTMLDivElement>(null);
  const ringRef = useRef<HTMLDivElement>(null);

  const isActive = cursorState.variant === 'active' || cursorState.variant === 'view' || cursorState.variant === 'open' || !!cursorState.text;
  const isHidden = cursorState.variant === 'hidden';
  const text = cursorState.text || (cursorState.variant === 'view' ? 'VIEW' : cursorState.variant === 'open' ? 'OPEN' : '');

  useEffect(() => {
    // Check for touch devices
    if (window.matchMedia('(pointer: coarse)').matches) {
      return;
    }

    let mouseX = window.innerWidth / 2;
    let mouseY = window.innerHeight / 2;
    let ringX = mouseX;
    let ringY = mouseY;
    let isVisible = false;
    let animationFrameId: number;

    const onMouseMove = (e: MouseEvent) => {
      mouseX = e.clientX;
      mouseY = e.clientY;

      if (!isVisible) {
        isVisible = true;
        dotRef.current?.classList.add('is-visible');
        ringRef.current?.classList.add('is-visible');
      }

      if (dotRef.current) {
        dotRef.current.style.transform = `translate3d(${mouseX}px, ${mouseY}px, 0) translate(-50%, -50%)`;
      }
    };

    const onMouseLeave = () => {
      isVisible = false;
      dotRef.current?.classList.remove('is-visible');
      ringRef.current?.classList.remove('is-visible');
    };

    const onMouseEnter = () => {
      isVisible = true;
      dotRef.current?.classList.add('is-visible');
      ringRef.current?.classList.add('is-visible');
    };

    const lerp = (start: number, end: number, factor: number) => start + (end - start) * factor;

    const render = () => {
      ringX = lerp(ringX, mouseX, 0.15);
      ringY = lerp(ringY, mouseY, 0.15);

      if (ringRef.current) {
        ringRef.current.style.transform = `translate3d(${ringX}px, ${ringY}px, 0) translate(-50%, -50%)`;
      }

      animationFrameId = requestAnimationFrame(render);
    };

    window.addEventListener('mousemove', onMouseMove, { passive: true });
    document.addEventListener('mouseleave', onMouseLeave);
    document.addEventListener('mouseenter', onMouseEnter);
    animationFrameId = requestAnimationFrame(render);

    return () => {
      window.removeEventListener('mousemove', onMouseMove);
      document.removeEventListener('mouseleave', onMouseLeave);
      document.removeEventListener('mouseenter', onMouseEnter);
      cancelAnimationFrame(animationFrameId);
    };
  }, []);

  return (
    <>
      <div
        ref={dotRef}
        className={`custom-cursor ${isHidden ? 'is-hidden' : ''}`}
        style={{
          opacity: isActive ? 0 : '',
          transition: 'opacity 0.2s ease',
        }}
      >
        <div className="cursor-dot" />
      </div>

      <div
        ref={ringRef}
        className={`cursor-ring ${isActive ? 'cursor-active' : ''} ${isHidden ? 'is-hidden' : ''}`}
      >
        <span className="cursor-text">{text}</span>
      </div>
    </>
  );
};
