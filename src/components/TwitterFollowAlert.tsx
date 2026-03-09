'use client';

import React, { useState, useEffect } from 'react';
import { usePathname } from 'next/navigation';
import { motion, AnimatePresence, useReducedMotion } from 'framer-motion';
import { TwitterLogo, ArrowRight } from '@phosphor-icons/react';
import { Alert, AlertTitle } from '@/components/base-ui/alert';
import { portfolioData } from '@/data/portfolioData';
import {
  trackTwitterFollowAlertShown,
  trackTwitterFollowClicked,
} from '@/lib/posthog';

const TWITTER_URL = portfolioData.socials.twitter || 'https://x.com/21dvy_t';
const SHOW_DELAY_MS = 15000; // 15 seconds

export default function TwitterFollowAlert() {
  const pathname = usePathname();
  const [isVisible, setIsVisible] = useState(false);
  const shouldReduceMotion = useReducedMotion();

  useEffect(() => {
    // Reset alert visibility on route change
    setIsVisible(false);

    const timer = setTimeout(() => {
      setIsVisible(true);
      trackTwitterFollowAlertShown();
    }, SHOW_DELAY_MS);

    return () => {
      clearTimeout(timer);
    };
  }, [pathname]);

  const handleCardClick = (e: React.MouseEvent) => {
    // Ignore clicks on the close / dismiss button
    if ((e.target as HTMLElement).closest('button[aria-label="Dismiss alert"]')) {
      return;
    }

    trackTwitterFollowClicked();
    window.open(TWITTER_URL, '_blank', 'noopener,noreferrer');
  };

  const handleClose = () => {
    setIsVisible(false);
  };

  return (
    <AnimatePresence>
      {isVisible && (
        <motion.div
          initial={shouldReduceMotion ? { opacity: 0 } : { opacity: 0, y: 20, scale: 0.96 }}
          animate={shouldReduceMotion ? { opacity: 1 } : { opacity: 1, y: 0, scale: 1 }}
          exit={shouldReduceMotion ? { opacity: 0 } : { opacity: 0, y: 15, scale: 0.96 }}
          transition={{ duration: 0.25, ease: [0.4, 0, 0.2, 1] }}
          className="fixed bottom-4 right-4 sm:bottom-6 sm:right-6 z-50 max-w-[calc(100vw-2rem)] sm:max-w-xs md:max-w-sm pointer-events-auto"
        >
          <Alert
            variant="default"
            onClose={handleClose}
            onClick={handleCardClick}
            className="group cursor-pointer border border-slate-200/90 dark:border-[#2F3336] bg-white/95 dark:bg-[#16181C]/95 backdrop-blur-md hover:border-[#1D9BF0] dark:hover:border-[#1D9BF0] shadow-lg dark:shadow-2xl transition-all duration-200 p-3 sm:p-3.5 pr-2 items-center gap-2.5 rounded-2xl"
          >
            {/* Twitter/X Brand Icon */}
            <div className="shrink-0 flex items-center justify-center w-8 h-8 rounded-full bg-[#1D9BF0]/10 text-[#1D9BF0] transition-transform duration-200 group-hover:scale-105">
              <TwitterLogo size={18} weight="fill" />
            </div>

            {/* Alert Title / Text */}
            <div className="flex-1 min-w-0 pr-1">
              <AlertTitle className="text-[13px] sm:text-[13.5px] font-semibold text-slate-900 dark:text-[#E7E9EA] group-hover:text-[#1D9BF0] dark:group-hover:text-[#1D9BF0] transition-colors duration-150 inline-flex items-center gap-1.5 flex-wrap">
                <span>Follow me on Twitter/X</span>
                <ArrowRight
                  size={14}
                  weight="bold"
                  className="text-[#1D9BF0] transition-transform duration-200 ease-out group-hover:translate-x-1 shrink-0"
                />
              </AlertTitle>
            </div>
          </Alert>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
