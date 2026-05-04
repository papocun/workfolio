'use client';

import React, { useState, useEffect, useRef, useCallback } from 'react';
import { usePathname } from 'next/navigation';
import { motion, AnimatePresence, useReducedMotion } from 'framer-motion';
import { ArrowRight, X } from '@phosphor-icons/react';
import { portfolioData } from '@/data/portfolioData';
import {
  trackTwitterFollowAlertShown,
  trackTwitterFollowClicked,
  trackTwitterFollowAlertClosed,
} from '@/lib/posthog';

const TWITTER_URL = portfolioData.socials.twitter || 'https://x.com/21dvy_t';
const SHOW_DELAY_MS = 15000; // 15 seconds
const AUTO_CLOSE_DELAY_MS = 10000; // 10 seconds lifetime
const ROTATE_INTERVAL_MS = 2000; // 2 seconds per subheader

const SUBHEADINGS: string[] = [
  'Divyanshu posts daily. Come say hi.',
  'Daily thoughts, data, projects, and random ideas.',
  "I share what I'm learning and building.",
  'New day, new ideas, new posts.',
  "Follow along with the things I'm building.",
  "Data, projects, experiments, and whatever I'm thinking about.",
  'Building in public, one post at a time.',
  'Sometimes useful. Sometimes completely random.',
  'A little corner of the internet where I post my work.',
  "Follow along. I post what I'm learning and making.",
];

/**
 * Plays a short, pleasant notification chime using Web Audio API.
 * Respects browser autoplay policies without error.
 */
function playNotificationChime() {
  if (typeof window === 'undefined') return;
  try {
    const AudioContextClass =
      window.AudioContext ||
      (window as unknown as { webkitAudioContext: typeof AudioContext }).webkitAudioContext;
    if (!AudioContextClass) return;

    const ctx = new AudioContextClass();
    const now = ctx.currentTime;

    const osc1 = ctx.createOscillator();
    const osc2 = ctx.createOscillator();
    const gain = ctx.createGain();

    osc1.type = 'sine';
    osc1.frequency.setValueAtTime(880, now);
    osc1.frequency.exponentialRampToValueAtTime(1320, now + 0.08);

    osc2.type = 'sine';
    osc2.frequency.setValueAtTime(1760, now + 0.04);

    gain.gain.setValueAtTime(0.04, now);
    gain.gain.exponentialRampToValueAtTime(0.0001, now + 0.3);

    osc1.connect(gain);
    osc2.connect(gain);
    gain.connect(ctx.destination);

    osc1.start(now);
    osc2.start(now + 0.03);
    osc1.stop(now + 0.3);
    osc2.stop(now + 0.3);

    setTimeout(() => {
      ctx.close().catch(() => {});
    }, 400);
  } catch {
    // Autoplay or audio context permission restricted — silently ignore
  }
}

/**
 * Crisp official X (Twitter) vector logo
 */
function XLogoIcon({ className = 'w-4 h-4' }: { className?: string }) {
  return (
    <svg
      viewBox="0 0 24 24"
      aria-hidden="true"
      fill="currentColor"
      className={className}
    >
      <path d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-5.214-6.817L4.99 21.75H1.68l7.73-8.835L1.254 2.25H8.08l4.713 6.231zm-1.161 17.52h1.833L7.084 4.126H5.117z" />
    </svg>
  );
}

export default function TwitterFollowAlert() {
  const pathname = usePathname();
  const [isVisible, setIsVisible] = useState(false);
  const [subheadingIndex, setSubheadingIndex] = useState(0);
  const shouldReduceMotion = useReducedMotion();

  const triggerTimerRef = useRef<NodeJS.Timeout | null>(null);
  const autoCloseTimerRef = useRef<NodeJS.Timeout | null>(null);
  const rotateIntervalRef = useRef<NodeJS.Timeout | null>(null);

  const clearAllTimers = useCallback(() => {
    if (triggerTimerRef.current) {
      clearTimeout(triggerTimerRef.current);
      triggerTimerRef.current = null;
    }
    if (autoCloseTimerRef.current) {
      clearTimeout(autoCloseTimerRef.current);
      autoCloseTimerRef.current = null;
    }
    if (rotateIntervalRef.current) {
      clearInterval(rotateIntervalRef.current);
      rotateIntervalRef.current = null;
    }
  }, []);

  const handleClose = useCallback(() => {
    clearAllTimers();
    setIsVisible(false);
    trackTwitterFollowAlertClosed();
  }, [clearAllTimers]);

  useEffect(() => {
    // Reset state and timers on route change
    clearAllTimers();
    setIsVisible(false);
    setSubheadingIndex(0);

    triggerTimerRef.current = setTimeout(() => {
      setIsVisible(true);
      setSubheadingIndex(0);
      playNotificationChime();
      trackTwitterFollowAlertShown();

      // Start 10-second auto-close lifetime timer
      autoCloseTimerRef.current = setTimeout(() => {
        handleClose();
      }, AUTO_CLOSE_DELAY_MS);

      // Start 2-second subheading rotation timer
      rotateIntervalRef.current = setInterval(() => {
        setSubheadingIndex((prev) => (prev + 1) % SUBHEADINGS.length);
      }, ROTATE_INTERVAL_MS);
    }, SHOW_DELAY_MS);

    return () => {
      clearAllTimers();
    };
  }, [pathname, clearAllTimers, handleClose]);

  const handleDismiss = useCallback(
    (e: React.MouseEvent) => {
      e.preventDefault();
      e.stopPropagation();
      handleClose();
    },
    [handleClose]
  );

  const handleLinkClick = () => {
    clearAllTimers();
    trackTwitterFollowClicked();
  };

  return (
    <AnimatePresence>
      {isVisible && (
        <motion.div
          initial={shouldReduceMotion ? { opacity: 0 } : { opacity: 0, y: 20, scale: 0.96 }}
          animate={shouldReduceMotion ? { opacity: 1 } : { opacity: 1, y: 0, scale: 1 }}
          exit={shouldReduceMotion ? { opacity: 0 } : { opacity: 0, y: 15, scale: 0.96 }}
          transition={{ duration: 0.25, ease: [0.4, 0, 0.2, 1] }}
          className="fixed bottom-4 right-4 sm:bottom-6 sm:right-6 z-50 w-[calc(100vw-2rem)] sm:w-[340px] md:w-[370px] pointer-events-auto select-none"
        >
          <div className="relative group border border-slate-200/90 dark:border-[#2F3336] bg-white/95 dark:bg-[#16181C]/95 backdrop-blur-md hover:border-[#1D9BF0] dark:hover:border-[#1D9BF0] shadow-lg dark:shadow-2xl transition-colors duration-150 p-3.5 sm:p-4 pr-3 rounded-2xl flex items-start gap-3">
            {/* Native direct external link covering card area without nested buttons or click-animation */}
            <a
              href={TWITTER_URL}
              target="_blank"
              rel="noopener noreferrer"
              onClick={handleLinkClick}
              aria-label="Follow me on X/Twitter"
              className="absolute inset-0 z-10 rounded-2xl focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#1D9BF0]"
              style={{ WebkitTouchCallout: 'none', WebkitTapHighlightColor: 'transparent' }}
            />

            {/* X Brand Icon Badge */}
            <div className="shrink-0 flex items-center justify-center w-8 h-8 rounded-full bg-[#1D9BF0]/10 text-[#1D9BF0] mt-0.5 transition-transform duration-200 group-hover:scale-105 pointer-events-none">
              <XLogoIcon className="w-4 h-4" />
            </div>

            {/* Content: Header, Arrow & Rotating Subheader */}
            <div className="flex-1 min-w-0 pr-1 pointer-events-none">
              <div className="flex items-center justify-between gap-1.5">
                <span className="text-[13.5px] sm:text-[14px] font-bold text-slate-900 dark:text-[#E7E9EA] group-hover:text-[#1D9BF0] dark:group-hover:text-[#1D9BF0] transition-colors duration-150 truncate">
                  Follow me on X/Twitter
                </span>
                <ArrowRight
                  size={14}
                  weight="bold"
                  className="text-[#1D9BF0] transition-transform duration-200 ease-out group-hover:translate-x-1 shrink-0"
                />
              </div>

              {/* Rotating Subheader with smooth fade/slide */}
              <div className="mt-1 h-[34px] sm:h-[32px] overflow-hidden relative">
                <AnimatePresence mode="wait">
                  <motion.p
                    key={subheadingIndex}
                    initial={{ opacity: 0, y: 4 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: -4 }}
                    transition={{ duration: 0.22, ease: 'easeOut' }}
                    className="text-[12px] sm:text-[12.5px] text-slate-600 dark:text-slate-400 leading-snug line-clamp-2"
                  >
                    {SUBHEADINGS[subheadingIndex]}
                  </motion.p>
                </AnimatePresence>
              </div>
            </div>

            {/* Dismiss Button — on top (z-20) as an independent sibling of the link */}
            <button
              type="button"
              onClick={handleDismiss}
              aria-label="Dismiss alert"
              className="relative z-20 shrink-0 p-1.5 sm:p-1 -mr-1 -mt-1 rounded-lg text-slate-400 hover:text-slate-700 dark:hover:text-slate-200 hover:bg-slate-200/50 dark:hover:bg-slate-800 transition-colors duration-150 cursor-pointer focus:outline-none focus-visible:ring-1 focus-visible:ring-[#1D9BF0]"
            >
              <X size={15} weight="bold" />
            </button>
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
