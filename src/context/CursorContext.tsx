import React, { useEffect, useRef, createContext, useContext } from 'react';
import gsap from 'gsap';

interface CursorContextType {
  cursorState: { type: 'default' | 'link' | 'open' | 'crosshair'; data?: string };
  setCursor: (type: 'default' | 'link' | 'open' | 'crosshair', data?: string) => void;
  resetCursor: () => void;
}

const defaultCursorState: CursorContextType['cursorState'] = { type: 'default' };

export const CursorContext = createContext<CursorContextType>({
  cursorState: defaultCursorState,
  setCursor: () => {},
  resetCursor: () => {},
});

export const useCursor = () => useContext(CursorContext);

export const CursorProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [cursorState, setCursorState] = React.useState(defaultCursorState);
  const cursorRef = useRef<HTMLDivElement>(null);
  const ringRef = useRef<HTMLDivElement>(null);
  const mouseX = useRef(0);
  const mouseY = useRef(0);

  const setCursor = (type: 'default' | 'link' | 'open' | 'crosshair', data?: string) => {
    setCursorState({ type, data });
  };

  const resetCursor = () => {
    setCursorState({ type: 'default' });
  };

  useEffect(() => {
    const updateMousePosition = (e: MouseEvent) => {
      mouseX.current = e.clientX;
      mouseY.current = e.clientY;
    };

    window.addEventListener('mousemove', updateMousePosition);
    return () => window.removeEventListener('mousemove', updateMousePosition);
  }, []);

  useEffect(() => {
    const cursor = cursorRef.current;
    const ring = ringRef.current;

    if (!cursor || !ring) return;

    gsap.set([cursor, ring], { x: mouseX.current, y: mouseY.current });

    const tick = () => {
      gsap.to(cursor, {
        x: mouseX.current,
        y: mouseY.current,
        duration: 0.1,
        ease: 'power2.out',
      });
      gsap.to(ring, {
        x: mouseX.current,
        y: mouseY.current,
        duration: 0.3,
        ease: 'power3.out',
      });
    };

    const interval = setInterval(tick, 1000 / 60);

    return () => clearInterval(interval);
  }, []);

  useEffect(() => {
    const cursor = cursorRef.current;
    const ring = ringRef.current;

    if (!cursor || !ring) return;

    const handleMouseOver = () => {
      gsap.to(cursor, { opacity: 1, scale: 1 });
      gsap.to(ring, { opacity: 0.3, scale: 3, borderWidth: 1 });
    };

    const handleMouseOut = () => {
      gsap.to(cursor, { opacity: 0 });
      gsap.to(ring, { opacity: 0, scale: 1, borderWidth: 0 });
    };

    document.addEventListener('mouseenter', handleMouseOver);
    document.addEventListener('mouseleave', handleMouseOut);

    return () => {
      document.removeEventListener('mouseenter', handleMouseOver);
      document.removeEventListener('mouseleave', handleMouseOut);
    };
  }, []);

  const getCursorStyle = () => {
    switch (cursorState.type) {
      case 'link':
        return { cursor: 'pointer' };
      case 'open':
        return { cursor: 'zoom-in' };
      case 'crosshair':
        return { cursor: 'crosshair' };
      default:
        return { cursor: 'default' };
    }
  };

  return (
    <CursorContext.Provider value={{ cursorState, setCursor, resetCursor }}>
      <div style={getCursorStyle()}>{children}</div>
      <div ref={cursorRef} className="custom-cursor cursor-dot" />
      <div ref={ringRef} className="custom-cursor cursor-ring" />
    </CursorContext.Provider>
  );
};
