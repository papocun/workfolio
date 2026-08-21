'use client';

import { ReactNode, useRef } from 'react';
import {
  motion,
  useInView,
  Variants,
  Transition,
  UseInViewOptions,
} from 'framer-motion';

interface InViewProps {
  children: ReactNode;
  variants?: Variants;
  transition?: Transition;
  viewOptions?: UseInViewOptions;
  as?: React.ElementType;
  className?: string;
}

const defaultVariants = {
  hidden: {
    opacity: 0,
  },
  visible: {
    opacity: 1,
    transition: {
      staggerChildren: 0.09,
    },
  },
};

export function InView({
  children,
  variants = defaultVariants,
  transition,
  viewOptions = { once: true, margin: '0px 0px -100px 0px' },
  as: Component = 'div',
  className = '',
}: InViewProps) {
  const ref = useRef(null);
  const isInView = useInView(ref, viewOptions);

  return (
    <Component ref={ref} className={className}>
      <motion.div
        initial="hidden"
        animate={isInView ? 'visible' : 'hidden'}
        variants={variants}
        transition={transition}
      >
        {children}
      </motion.div>
    </Component>
  );
}
