'use client';

import React, { useState, useEffect } from 'react';
import { LockKey, WarningCircle } from '@phosphor-icons/react';
import { motion, AnimatePresence } from 'framer-motion';
import { Alert, AlertTitle, AlertDescription } from '@/components/base-ui/alert';
import { TextShimmer } from '@/components/core/text-shimmer';

export default function BlogPage() {
  useEffect(() => {
    document.title = 'Blog — Divyanshu Tiwari';
  }, []);

  return (
    <main className="max-w-[680px] mx-auto px-4 sm:px-6 pt-6 sm:pt-10 pb-16 sm:pb-24 transition-colors duration-200">
      {/* Auto-cycling Notice Banner (Non-dismissible) */}
      <AutoCyclingNotice />

      {/* Section Subtitle / Micro Indicator */}
      <div className="flex items-center justify-between mb-6 sm:mb-10">
        <span className="text-[11.5px] sm:text-[12px] font-mono text-slate-400 dark:text-slate-500 lowercase tracking-normal">
          // writing
        </span>
        <span className="inline-flex items-center gap-1.5 font-mono text-[10.5px] sm:text-[11px] text-amber-600 dark:text-amber-400 bg-amber-50 dark:bg-amber-950/40 border border-amber-200/60 dark:border-amber-800/50 px-2 py-0.5 rounded-full">
          <span className="w-1.5 h-1.5 rounded-full bg-amber-500" />
          <span>under construction</span>
        </span>
      </div>

      {/* Simplified Central Under-Construction Card */}
      <div className="w-full rounded-2xl border border-slate-200/90 dark:border-slate-800/90 bg-white dark:bg-[#16181C] p-8 sm:p-14 shadow-xs dark:shadow-xl transition-colors duration-200 ease-[cubic-bezier(0.4,0,0.2,1)] flex flex-col items-center justify-center text-center">
        {/* Locker Icon */}
        <div className="w-12 h-12 rounded-xl bg-slate-100 dark:bg-slate-800/90 border border-slate-200/80 dark:border-slate-700/80 flex items-center justify-center text-slate-600 dark:text-slate-300 mb-3.5 shadow-xs">
          <LockKey size={22} weight="regular" />
        </div>

        {/* TextShimmer animation directly underneath */}
        <TextShimmer className="font-mono text-sm" duration={1}>
          Work in progress...
        </TextShimmer>
      </div>
    </main>
  );
}

/**
 * Notice banner that cycles automatically (visible -> fades out -> waits -> fades in -> repeat)
 * without a manual close button or click-to-dismiss.
 */
function AutoCyclingNotice() {
  const [isVisible, setIsVisible] = useState(true);

  useEffect(() => {
    let timer: NodeJS.Timeout;

    if (isVisible) {
      // Stays visible for 6 seconds, then fades out
      timer = setTimeout(() => {
        setIsVisible(false);
      }, 6000);
    } else {
      // Waits for 3.5 seconds, then fades back in
      timer = setTimeout(() => {
        setIsVisible(true);
      }, 3500);
    }

    return () => {
      clearTimeout(timer);
    };
  }, [isVisible]);

  return (
    <div className="w-full mb-6 min-h-[76px]">
      <AnimatePresence mode="wait">
        {isVisible && (
          <motion.div
            key="blog-notice"
            initial={{ opacity: 0, y: -6 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -6 }}
            transition={{ duration: 0.35, ease: [0.4, 0, 0.2, 1] }}
            className="w-full pointer-events-none"
          >
            <Alert variant="warning" className="cursor-default select-none">
              <WarningCircle
                size={18}
                weight="fill"
                className="shrink-0 mt-0.5 text-amber-500 dark:text-amber-400"
              />
              <div className="flex-1">
                <AlertTitle>Notice: Some pages are still being built</AlertTitle>
                <AlertDescription>
                  A few sections of my portfolio are still under construction. I’m updating them and will have them ready soon.
                </AlertDescription>
              </div>
            </Alert>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
