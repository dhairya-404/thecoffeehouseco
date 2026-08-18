import React, { useRef, useEffect } from 'react';
import gsap from 'gsap';
import { useCursor } from '../context/CursorContext';
import { useIsTouchDevice } from '../hooks/useMediaQuery';

interface MagneticButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  children: React.ReactNode;
  strength?: number;
  className?: string;
  cursorText?: string;
  onClick?: (e: React.MouseEvent<HTMLButtonElement>) => void;
  as?: 'button' | 'a';
  href?: string;
  target?: string;
  rel?: string;
}

export const MagneticButton: React.FC<MagneticButtonProps> = ({
  children,
  strength = 0.35,
  className = '',
  cursorText,
  onClick,
  as = 'button',
  href,
  target,
  rel,
  ...props
}) => {
  const buttonRef = useRef<HTMLElement>(null);
  const { setCursor, resetCursor } = useCursor();
  const isTouch = useIsTouchDevice();

  useEffect(() => {
    const el = buttonRef.current;
    if (!el || isTouch) return;

    // Create optimized quickTo animators
    const xTo = gsap.quickTo(el, 'x', { duration: 0.3, ease: 'power2.out' });
    const yTo = gsap.quickTo(el, 'y', { duration: 0.3, ease: 'power2.out' });

    let rect: DOMRect;

    const handleMouseEnter = () => {
      // Cache bounding rect once on enter to prevent layout thrashing on mousemove
      rect = el.getBoundingClientRect();

      if (cursorText) {
        setCursor('open', cursorText);
      } else {
        setCursor('link');
      }
    };

    const handleMouseMove = (e: MouseEvent) => {
      if (!rect) return;
      const centerX = rect.left + rect.width / 2;
      const centerY = rect.top + rect.height / 2;

      const deltaX = (e.clientX - centerX) * strength;
      const deltaY = (e.clientY - centerY) * strength;

      xTo(deltaX);
      yTo(deltaY);
    };

    const handleMouseLeave = () => {
      gsap.to(el, {
        x: 0,
        y: 0,
        duration: 0.7,
        ease: 'elastic.out(1.1, 0.4)',
        overwrite: 'auto',
      });
      resetCursor();
    };

    el.addEventListener('mouseenter', handleMouseEnter);
    el.addEventListener('mousemove', handleMouseMove, { passive: true });
    el.addEventListener('mouseleave', handleMouseLeave);

    return () => {
      el.removeEventListener('mouseenter', handleMouseEnter);
      el.removeEventListener('mousemove', handleMouseMove);
      el.removeEventListener('mouseleave', handleMouseLeave);
    };
  }, [strength, cursorText, isTouch, setCursor, resetCursor]);

  if (as === 'a' && href) {
    return (
      <a
        ref={buttonRef as unknown as React.RefObject<HTMLAnchorElement>}
        href={href}
        target={target}
        rel={rel}
        className={className}
        onClick={onClick as unknown as React.MouseEventHandler<HTMLAnchorElement>}
      >
        {children}
      </a>
    );
  }

  return (
    <button
      ref={buttonRef as unknown as React.RefObject<HTMLButtonElement>}
      className={className}
      onClick={onClick}
      {...props}
    >
      {children}
    </button>
  );
};
