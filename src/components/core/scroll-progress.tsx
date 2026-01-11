'use client';

import React, { RefObject } from 'react';
import { motion, useScroll, SpringOptions, useSpring } from 'framer-motion';

export interface ScrollProgressProps {
  className?: string;
  containerRef?: RefObject<HTMLElement | null>;
  springOptions?: SpringOptions;
}

export function ScrollProgress({
  className = '',
  containerRef,
  springOptions = {
    stiffness: 280,
    damping: 30,
    restDelta: 0.001,
  },
}: ScrollProgressProps) {
  const { scrollYProgress } = useScroll(
    containerRef ? { container: containerRef } : {}
  );

  const scaleX = useSpring(scrollYProgress, springOptions);

  return (
    <motion.div
      style={{
        scaleX,
        transformOrigin: '0%',
      }}
      className={`h-0.5 w-full bg-slate-900 dark:bg-slate-100 ${className}`}
    />
  );
}

export default ScrollProgress;
