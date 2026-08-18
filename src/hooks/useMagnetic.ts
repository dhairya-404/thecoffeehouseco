import { useEffect, useRef } from 'react';

export const useMagnetic = <T extends HTMLElement = HTMLButtonElement>(strength = 0.35) => {
  const ref = useRef<T>(null);

  useEffect(() => {
    const node = ref.current;
    if (!node || window.matchMedia('(pointer: coarse)').matches) return;

    let targetX = 0;
    let targetY = 0;
    let currentX = 0;
    let currentY = 0;
    let animationFrameId: number;

    const onMouseMove = (e: MouseEvent) => {
      const rect = node.getBoundingClientRect();
      const centerX = rect.left + rect.width / 2;
      const centerY = rect.top + rect.height / 2;
      const deltaX = e.clientX - centerX;
      const deltaY = e.clientY - centerY;

      targetX = deltaX * strength;
      targetY = deltaY * strength;
    };

    const onMouseLeave = () => {
      targetX = 0;
      targetY = 0;
    };

    const lerp = (a: number, b: number, n: number) => (1 - n) * a + n * b;

    const animate = () => {
      currentX = lerp(currentX, targetX, 0.15);
      currentY = lerp(currentY, targetY, 0.15);

      if (node) {
        node.style.transform = `translate3d(${currentX}px, ${currentY}px, 0)`;
      }

      animationFrameId = requestAnimationFrame(animate);
    };

    node.addEventListener('mousemove', onMouseMove);
    node.addEventListener('mouseleave', onMouseLeave);
    animationFrameId = requestAnimationFrame(animate);

    return () => {
      node.removeEventListener('mousemove', onMouseMove);
      node.removeEventListener('mouseleave', onMouseLeave);
      cancelAnimationFrame(animationFrameId);
      if (node) node.style.transform = 'translate3d(0, 0, 0)';
    };
  }, [strength]);

  return ref;
};
