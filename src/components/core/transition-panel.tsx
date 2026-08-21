'use client';

import { AnimatePresence, motion, Transition, Variants } from 'framer-motion';
import React, { Children, ReactNode } from 'react';

export interface TransitionPanelProps extends React.HTMLAttributes<HTMLDivElement> {
  activeIndex: number;
  children: ReactNode[];
  variants?: Variants;
  transition?: Transition;
  custom?: number;
  className?: string;
}

export function TransitionPanel({
  activeIndex,
  children,
  variants,
  transition,
  custom = 1,
  className = '',
  ...props
}: TransitionPanelProps) {
  const childArray = Children.toArray(children);
  const currentChild = childArray[activeIndex];

  const defaultVariants: Variants = {
    enter: (direction: number) => ({
      x: direction > 0 ? 40 : -40,
      opacity: 0,
    }),
    center: {
      zIndex: 1,
      x: 0,
      opacity: 1,
    },
    exit: (direction: number) => ({
      zIndex: 0,
      x: direction < 0 ? 40 : -40,
      opacity: 0,
    }),
  };

  return (
    <div className={`relative overflow-hidden ${className}`} {...props}>
      <AnimatePresence initial={false} custom={custom} mode="wait">
        <motion.div
          key={activeIndex}
          custom={custom}
          variants={variants || defaultVariants}
          initial="enter"
          animate="center"
          exit="exit"
          transition={
            transition || {
              x: { type: 'spring', stiffness: 350, damping: 32 },
              opacity: { duration: 0.2 },
            }
          }
          className="w-full"
        >
          {currentChild}
        </motion.div>
      </AnimatePresence>
    </div>
  );
}
