'use client';

import React, { useState } from 'react';
import { Cursor } from '@/components/core/cursor';
import { motion } from 'framer-motion';

export default function CustomCursor() {
  const [isHovering, setIsHovering] = useState(false);

  const handlePositionChange = (x: number, y: number) => {
    if (typeof document === 'undefined') return;

    const target = document.elementFromPoint(x, y);
    if (!target) {
      if (isHovering) setIsHovering(false);
      return;
    }

    // Check for interactive targets
    const isInteractive = Boolean(
      target.closest('a, button, [role="button"], [role="switch"], input, textarea, select, [tabindex="0"]')
    );

    if (isInteractive !== isHovering) {
      setIsHovering(isInteractive);
    }
  };

  return (
    <Cursor
      onPositionChange={handlePositionChange}
      springConfig={{
        stiffness: 550,
        damping: 36,
        mass: 0.35,
      }}
      variants={{
        initial: { scale: 0, opacity: 0 },
        animate: { scale: 1, opacity: 1 },
        exit: { scale: 0, opacity: 0 },
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
