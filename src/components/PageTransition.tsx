'use client';

import React, { useRef } from 'react';
import { usePathname } from 'next/navigation';
import { motion, useReducedMotion } from 'framer-motion';

interface PageTransitionProps {
  children: React.ReactNode;
}

export default function PageTransition({ children }: PageTransitionProps) {
  const pathname = usePathname();
  const shouldReduceMotion = useReducedMotion();
  const isFirstRender = useRef(true);

  // On first mount (initial load / refresh), render immediately without animation
  const isInitial = isFirstRender.current;
  if (isFirstRender.current) {
    isFirstRender.current = false;
  }

  return (
    <motion.div
      key={pathname}
      initial={shouldReduceMotion || isInitial ? false : { opacity: 0, y: 4 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{
        duration: shouldReduceMotion ? 0 : 0.22,
        ease: [0.4, 0, 0.2, 1],
      }}
      className="w-full flex-1"
    >
      {children}
    </motion.div>
  );
}
