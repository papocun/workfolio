'use client';

import React, { useState, useEffect, useRef, useCallback } from 'react';
import { LockKey, WarningCircle } from '@phosphor-icons/react';
import { motion, AnimatePresence } from 'framer-motion';
import { Alert, AlertTitle, AlertDescription } from '@/components/base-ui/alert';
import { TextShimmer } from '@/components/core/text-shimmer';

const breadcrumbJsonLd = {
  '@context': 'https://schema.org',
  '@type': 'BreadcrumbList',
  itemListElement: [
    {
      '@type': 'ListItem',
      position: 1,
      name: 'Home',
      item: 'https://datafolio.me/',
    },
    {
      '@type': 'ListItem',
      position: 2,
      name: 'Blog',
      item: 'https://datafolio.me/blog/',
    },
  ],
};

export default function BlogPage() {
  return (
    <main className="max-w-[680px] mx-auto px-4 sm:px-6 pt-6 sm:pt-10 pb-16 sm:pb-24">
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(breadcrumbJsonLd) }}
      />

      {/* 10-Second Initial Notice Banner */}
      <InitialNoticeBanner />

      <div className="w-full flex flex-col items-center justify-center text-center py-20 sm:py-28">
        {/* Locker Icon with small rounded background */}
        <div className="w-12 h-12 rounded-xl bg-slate-100 dark:bg-slate-800/90 border border-slate-200/80 dark:border-slate-700/80 flex items-center justify-center text-slate-600 dark:text-slate-300 mb-3.5 shadow-xs">
          <LockKey size={22} weight="regular" />
        </div>

        {/* Semantic page heading */}
        <h1 className="sr-only">Blog</h1>

        {/* TextShimmer animation directly underneath */}
        <TextShimmer className="font-mono text-[15px]" duration={1}>
          Work in progress...
        </TextShimmer>
      </div>
    </main>
  );
}

/**
 * Notice banner shown for the first 10 seconds of entering the page,
 * then smoothly fades out and collapses. Can also be manually dismissed
 * via the X button, which cancels the auto-close timer.
 */
function InitialNoticeBanner() {
  const [isVisible, setIsVisible] = useState(true);
  const timerRef = useRef<NodeJS.Timeout | null>(null);

  const handleClose = useCallback(() => {
    if (timerRef.current) {
      clearTimeout(timerRef.current);
      timerRef.current = null;
    }
    setIsVisible(false);
  }, []);

  useEffect(() => {
    timerRef.current = setTimeout(() => {
      setIsVisible(false);
    }, 10000);

    return () => {
      if (timerRef.current) {
        clearTimeout(timerRef.current);
        timerRef.current = null;
      }
    };
  }, []);

  return (
    <AnimatePresence>
      {isVisible && (
        <motion.div
          key="blog-initial-notice"
          initial={{ opacity: 0, y: -6 }}
          animate={{ opacity: 1, y: 0, transition: { duration: 0.25, ease: 'easeOut' } }}
          exit={{
            opacity: 0,
            y: -6,
            height: 0,
            marginBottom: 0,
            transition: { duration: 0.3, ease: 'easeInOut' },
          }}
          className="w-full mb-6 overflow-hidden"
        >
          <Alert variant="warning" onClose={handleClose}>
            <WarningCircle
              size={18}
              weight="fill"
              className="shrink-0 mt-0.5 text-amber-500 dark:text-amber-400"
            />
            <div className="flex-1">
              <AlertTitle>Notice: Some pages are still being built</AlertTitle>
              <AlertDescription>
                A few sections of my portfolio are still under construction. I&apos;m updating them and will have them ready soon.
              </AlertDescription>
            </div>
          </Alert>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
