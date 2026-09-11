'use client';

import React, { useState, useEffect } from 'react';
import { Cursor } from '@/components/core/cursor';
import { motion, useReducedMotion } from 'framer-motion';

export default function CustomCursor() {
  const [isHovering, setIsHovering] = useState(false);
  const shouldReduceMotion = useReducedMotion();

  useEffect(() => {
    if (typeof document === 'undefined') return;

    const interactiveSelector =
      'a, button, [role="button"], [role="switch"], input, textarea, select, [tabindex="0"]';

    const handlePointerOver = (e: PointerEvent) => {
      const target = e.target as Element | null;
      if (!target) return;
      const isInteractive = Boolean(target.closest(interactiveSelector));
      setIsHovering(isInteractive);
    };

    document.addEventListener('pointerover', handlePointerOver, { passive: true });
    return () => {
      document.removeEventListener('pointerover', handlePointerOver);
    };
  }, []);

  if (shouldReduceMotion) return null;

  return (
    <Cursor
      springConfig={{
        stiffness: 550,
        damping: 36,
        mass: 0.35,
      }}
      variants={{
        initial: { scale: 0.7, opacity: 0 },
        animate: { scale: 1, opacity: 1 },
        exit: { scale: 0.7, opacity: 0 },
      }}
      transition={{
        duration: 0.12,
        ease: 'easeOut',
      }}
    >
      <motion.div
        animate={{
          scale: isHovering ? 2 : 1,
          opacity: isHovering ? 0.75 : 0.6,
        }}
        transition={{
          type: 'spring',
          stiffness: 400,
          damping: 26,
        }}
        className="h-2.5 w-2.5 rounded-full bg-slate-900 dark:bg-slate-100 backdrop-blur-xs pointer-events-none"
      />
    </Cursor>
  );
}

