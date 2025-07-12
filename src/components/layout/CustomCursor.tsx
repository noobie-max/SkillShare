
'use client';

import { useState, useEffect, useCallback, useRef } from 'react';
import { cn } from '@/lib/utils';

export function CustomCursor() {
  const dotRef = useRef<HTMLDivElement>(null);
  const outlineRef = useRef<HTMLDivElement>(null);
  const requestRef = useRef<number>();
  const previousTimeRef = useRef<number>();
  const [isMounted, setIsMounted] = useState(false);

  const [mousePosition, setMousePosition] = useState({ x: -100, y: -100 });
  const [isHovering, setIsHovering] = useState(false);
  const [isClicked, setIsClicked] = useState(false);
  const [isHidden, setIsHidden] = useState(false);
  const [isIdle, setIsIdle] = useState(false);

  let idleTimeout = useRef<NodeJS.Timeout>();

  const animateDotOutline = useCallback(() => {
    if (previousTimeRef.current !== undefined) {
      if (dotRef.current) {
        dotRef.current.style.left = `${mousePosition.x}px`;
        dotRef.current.style.top = `${mousePosition.y}px`;
      }
      if (outlineRef.current) {
        outlineRef.current.style.left = `${mousePosition.x}px`;
        outlineRef.current.style.top = `${mousePosition.y}px`;
      }
    }
    previousTimeRef.current = performance.now();
    requestRef.current = requestAnimationFrame(animateDotOutline);
  }, [mousePosition]);

  useEffect(() => {
    setIsMounted(true);
  }, []);

  useEffect(() => {
    if (!isMounted) return;

    requestRef.current = requestAnimationFrame(animateDotOutline);

    const handleMouseMove = (event: MouseEvent) => {
      setMousePosition({ x: event.clientX, y: event.clientY });
      setIsIdle(false);
      clearTimeout(idleTimeout.current);
      idleTimeout.current = setTimeout(() => setIsIdle(true), 2000);
    };

    const handleMouseOver = (e: MouseEvent) => {
      const target = e.target as HTMLElement;
      if (target.closest('a, button, [role="button"], input, select, textarea')) {
        setIsHovering(true);
      } else {
        setIsHovering(false);
      }
    };
    
    const handleMouseDown = () => setIsClicked(true);
    const handleMouseUp = () => setIsClicked(false);
    const handleMouseEnter = () => setIsHidden(false);
    const handleMouseLeave = () => setIsHidden(true);

    document.addEventListener('mousemove', handleMouseMove);
    document.addEventListener('mouseover', handleMouseOver);
    document.addEventListener('mousedown', handleMouseDown);
    document.addEventListener('mouseup', handleMouseUp);
    document.body.addEventListener('mouseenter', handleMouseEnter);
    document.body.addEventListener('mouseleave', handleMouseLeave);

    return () => {
      if (requestRef.current) {
        cancelAnimationFrame(requestRef.current);
      }
      document.removeEventListener('mousemove', handleMouseMove);
      document.removeEventListener('mouseover', handleMouseOver);
      document.removeEventListener('mousedown', handleMouseDown);
      document.removeEventListener('mouseup', handleMouseUp);
      document.body.removeEventListener('mouseenter', handleMouseEnter);
      document.body.removeEventListener('mouseleave', handleMouseLeave);
      clearTimeout(idleTimeout.current);
    };
  }, [isMounted, animateDotOutline]);

  if (!isMounted) {
    return null;
  }

  const cursorClasses = cn({
    'cursor--link-hovered': isHovering,
    'cursor--clicked': isClicked,
    'cursor--hidden': isHidden,
    'cursor--idle': isIdle,
  });

  return (
    <div className={cursorClasses}>
      <div ref={dotRef} className="cursor-dot" />
      <div ref={outlineRef} className="cursor-outline" />
    </div>
  );
}
