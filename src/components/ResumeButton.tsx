'use client';

import React, { useState, useRef } from 'react';
import { motion, AnimatePresence, useReducedMotion } from 'framer-motion';
import { LockKey } from '@phosphor-icons/react';
import { useSound } from '@/components/SoundProvider';

interface ResumeButtonProps {
  href?: string;
  className?: string;
}

export default function ResumeButton({
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  href,
  className = '',
}: ResumeButtonProps) {
  const [showLockedFeedback, setShowLockedFeedback] = useState(false);
  const [shakeKey, setShakeKey] = useState(0);
  const timerRef = useRef<NodeJS.Timeout | null>(null);
  const shouldReduceMotion = useReducedMotion();
  const { playClickSound } = useSound();

  const handleClick = (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    playClickSound();
    setShakeKey((k) => k + 1);
    setShowLockedFeedback(true);

    if (timerRef.current) clearTimeout(timerRef.current);
    timerRef.current = setTimeout(() => {
      setShowLockedFeedback(false);
    }, 2000);
  };

  return (
    <div className="relative inline-flex items-center">
      <motion.button
        key={shakeKey}
        type="button"
        aria-disabled="true"
        title="Resume is currently locked"
        onClick={handleClick}
        animate={
          !shouldReduceMotion && shakeKey > 0
            ? { x: [0, -4, 4, -3, 3, 0] }
            : { x: 0 }
        }
        transition={{ duration: 0.3, ease: [0.36, 0.07, 0.19, 0.97] }}
        className={`group relative inline-flex h-8 items-center justify-center overflow-hidden rounded-full border border-slate-200 dark:border-slate-800 bg-white dark:bg-[#16181C] px-3.5 text-[12.5px] font-medium text-slate-800 dark:text-slate-200 transition-colors duration-200 cursor-pointer shadow-2xs select-none active:scale-[0.96] ${className}`}
      >
        {/* Default Layer (Leaves on hover: ease-in) */}
        <span className="inline-flex items-center gap-1.5 transition-all duration-200 ease-in group-hover:-translate-y-8 group-hover:opacity-0">
          <span>resume</span>
          <svg
            xmlns="http://www.w3.org/2000/svg"
            width="12"
            height="12"
            fill="currentColor"
            viewBox="0 0 256 256"
            className="translate-y-[0.5px]"
            aria-hidden="true"
          >
            <path d="M221.66,133.66l-72,72a8,8,0,0,1-11.32-11.32L196.69,136H40a8,8,0,0,1,0-16H196.69L138.34,61.66a8,8,0,0,1,11.32-11.32l72,72A8,8,0,0,1,221.66,133.66Z" />
          </svg>
        </span>

        {/* Hover Slide-up Layer (Enters from bottom: ease-out) */}
        <div
          className="absolute inset-0 z-10 flex h-full w-full items-center justify-center gap-1.5 bg-slate-900 text-white dark:bg-slate-100 dark:text-slate-950 transition-all duration-250 ease-out translate-y-full opacity-0 group-hover:translate-y-0 group-hover:opacity-100"
          aria-hidden="true"
        >
          <span>resume</span>
          <svg
            xmlns="http://www.w3.org/2000/svg"
            width="12"
            height="12"
            fill="currentColor"
            viewBox="0 0 256 256"
            className="translate-y-[0.5px] group-hover:translate-x-0.5 transition-transform duration-200 ease-out"
          >
            <path d="M221.66,133.66l-72,72a8,8,0,0,1-11.32-11.32L196.69,136H40a8,8,0,0,1,0-16H196.69L138.34,61.66a8,8,0,0,1,11.32-11.32l72,72A8,8,0,0,1,221.66,133.66Z" />
          </svg>
        </div>
      </motion.button>

      {/* Floating feedback tooltip when clicked */}
      <AnimatePresence>
        {showLockedFeedback && (
          <motion.div
            initial={{ opacity: 0, y: 6, scale: 0.95 }}
            animate={{ opacity: 1, y: -34, scale: 1 }}
            exit={{ opacity: 0, y: -28, scale: 0.95 }}
            transition={{ duration: 0.15, ease: [0.16, 1, 0.3, 1] }}
            className="absolute left-1/2 -translate-x-1/2 z-30 pointer-events-none whitespace-nowrap rounded-full bg-slate-900 dark:bg-slate-100 text-white dark:text-slate-950 px-2.5 py-1 text-[11px] font-mono font-medium shadow-md flex items-center gap-1.5"
          >
            <LockKey size={12} weight="fill" className="text-amber-400 dark:text-amber-600" />
            <span>Updating / Locked</span>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}

