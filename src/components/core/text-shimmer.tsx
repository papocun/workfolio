'use client';

import React, { useMemo } from 'react';
import { motion } from 'framer-motion';

export interface TextShimmerProps {
  children: string;
  as?: string;
  className?: string;
  duration?: number;
  spread?: number;
}

export function TextShimmer({
  children,
  as = 'p',
  className = '',
  duration = 2,
  spread = 2,
}: TextShimmerProps) {
  const dynamicSpread = useMemo(() => {
    return children.length * spread;
  }, [children, spread]);

  return (
    <motion.p
      className={`relative inline-block bg-[length:250%_100%,auto] bg-clip-text text-transparent [--base-color:#71767b] [--base-gradient-color:#ffffff] [--bg:linear-gradient(90deg,#0000_calc(50%-var(--spread)),var(--base-gradient-color),#0000_calc(50%+var(--spread)))] [background-repeat:no-repeat,padding-box] ${className}`}
      initial={{ backgroundPosition: '100% center' }}
      animate={{ backgroundPosition: '0% center' }}
      transition={{
        repeat: Infinity,
        duration,
        ease: 'linear',
      }}
      style={
        {
          '--spread': `${dynamicSpread}px`,
          backgroundImage: `var(--bg), linear-gradient(var(--base-color), var(--base-color))`,
        } as React.CSSProperties
      }
    >
      {children}
    </motion.p>
  );
}
