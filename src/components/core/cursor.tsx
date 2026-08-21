'use client';

import React, { useEffect, useState, useRef } from 'react';
import {
  motion,
  useMotionValue,
  useSpring,
  SpringOptions,
  Transition,
  Variant,
} from 'framer-motion';

export interface CursorProps {
  children: React.ReactNode;
  className?: string;
  springConfig?: SpringOptions;
  attachToParent?: boolean;
  transition?: Transition;
  variants?: {
    initial: Variant;
    animate: Variant;
    exit?: Variant;
  };
  onPositionChange?: (x: number, y: number) => void;
}

export function Cursor({
  children,
  className = '',
  springConfig = { stiffness: 450, damping: 32, mass: 0.5 },
  transition = { duration: 0.15, ease: 'easeInOut' },
  variants,
  onPositionChange,
}: CursorProps) {
  const [isVisible, setIsVisible] = useState(false);
  const [isTouch, setIsTouch] = useState(false);

  const cursorX = useMotionValue(-100);
  const cursorY = useMotionValue(-100);

  const springX = useSpring(cursorX, springConfig);
  const springY = useSpring(cursorY, springConfig);

  useEffect(() => {
    // Detect touch device
    if (typeof window !== 'undefined') {
      const isTouchDevice =
        'ontouchstart' in window ||
        navigator.maxTouchPoints > 0 ||
        window.matchMedia('(pointer: coarse)').matches;
      setIsTouch(isTouchDevice);
      if (isTouchDevice) return;
    }

    const handleMouseMove = (e: MouseEvent) => {
      if (!isVisible) setIsVisible(true);
      cursorX.set(e.clientX);
      cursorY.set(e.clientY);
      onPositionChange?.(e.clientX, e.clientY);
    };

    const handleMouseLeave = () => {
      setIsVisible(false);
    };

    const handleMouseEnter = () => {
      setIsVisible(true);
    };

    window.addEventListener('mousemove', handleMouseMove, { passive: true });
    document.documentElement.addEventListener('mouseleave', handleMouseLeave);
    document.documentElement.addEventListener('mouseenter', handleMouseEnter);

    return () => {
      window.removeEventListener('mousemove', handleMouseMove);
      document.documentElement.removeEventListener('mouseleave', handleMouseLeave);
      document.documentElement.removeEventListener('mouseenter', handleMouseEnter);
    };
  }, [cursorX, cursorY, isVisible, onPositionChange]);

  if (isTouch) return null;

  return (
    <motion.div
      style={{
        x: springX,
        y: springY,
        translateX: '-50%',
        translateY: '-50%',
      }}
      initial="initial"
      animate={isVisible ? 'animate' : 'initial'}
      exit="exit"
      variants={
        variants || {
          initial: { scale: 0, opacity: 0 },
          animate: { scale: 1, opacity: 1 },
          exit: { scale: 0, opacity: 0 },
        }
      }
      transition={transition}
      className={`fixed top-0 left-0 pointer-events-none z-50 ${className}`}
    >
      {children}
    </motion.div>
  );
}
