'use client';

import React from 'react';
import {
  MapPin,
  GithubLogo,
  LinkedinLogo,
  XLogo,
  SpeakerHigh,
  SpeakerSlash,
  Sun,
  Moon,
} from '@phosphor-icons/react';
import { portfolioData } from '@/data/portfolioData';
import { trackGithubClicked, trackContactClicked } from '@/lib/posthog';
import { useTheme } from '@/components/ThemeProvider';
import { useSound } from '@/components/SoundProvider';
import ViewCounter from '@/components/ViewCounter';
import { motion, AnimatePresence, useReducedMotion } from 'framer-motion';

interface LocationTagProps {
  location?: string;
  className?: string;
}

export default function LocationTag({
  location = 'Delhi',
  className = '',
}: LocationTagProps) {
  const { isDark, toggleTheme, isTransitioning } = useTheme();
  const { isSoundOn, toggleSound } = useSound();
  const shouldReduceMotion = useReducedMotion();

  return (
    <div
      className={`flex items-center gap-3 sm:gap-3.5 text-[14px] sm:text-[14.5px] text-slate-500 dark:text-slate-400 font-medium flex-wrap ${className}`}
    >
      {/* Location with Phosphor MapPin */}
      <div className="flex items-center gap-1.5">
        <MapPin
          size={16}
          weight="bold"
          className="text-slate-400 dark:text-slate-400 shrink-0"
          aria-hidden="true"
        />
        <span className="text-slate-700 dark:text-[#E7E9EA] font-medium">{location}</span>
      </div>

      {/* Vertical Pipe Divider between Location and View Counter */}
      <span
        className="text-slate-300 dark:text-[#2F3336] select-none text-[12px] font-light"
        aria-hidden="true"
      >
        |
      </span>

      {/* Global View Counter */}
      <ViewCounter />

      {/* Vertical Pipe Divider */}
      <span
        className="text-slate-300 dark:text-[#2F3336] select-none text-[12px] font-light"
        aria-hidden="true"
      >
        |
      </span>

      {/* Social Phosphor Icons */}
      <div className="flex items-center gap-2.5">
        {/* GitHub */}
        <a
          href={portfolioData.socials.github}
          target="_blank"
          rel="noopener noreferrer"
          onClick={() =>
            trackGithubClicked({
              location: 'location_bar',
              url: portfolioData.socials.github,
            })
          }
          aria-label="GitHub Profile"
          className="text-slate-400 dark:text-slate-400 hover:text-slate-900 dark:hover:text-[#E7E9EA] transition-colors duration-150 inline-flex items-center justify-center p-1.5 -m-1 rounded focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-[#1D9BF0]"
        >
          <GithubLogo size={16} weight="regular" className="shrink-0" />
        </a>

        {/* LinkedIn */}
        <a
          href={portfolioData.socials.linkedin}
          target="_blank"
          rel="noopener noreferrer"
          onClick={() =>
            trackContactClicked({
              channel: 'linkedin',
              location: 'location_bar',
              url: portfolioData.socials.linkedin,
            })
          }
          aria-label="LinkedIn Profile"
          className="text-slate-400 dark:text-slate-400 hover:text-[#0A66C2] dark:hover:text-[#0A66C2] transition-colors duration-150 inline-flex items-center justify-center p-1.5 -m-1 rounded focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-[#1D9BF0]"
        >
          <LinkedinLogo size={16} weight="regular" className="shrink-0" />
        </a>

        {/* X */}
        <a
          href={portfolioData.socials.twitter}
          target="_blank"
          rel="noopener noreferrer"
          onClick={() =>
            trackContactClicked({
              channel: 'twitter',
              location: 'location_bar',
              url: portfolioData.socials.twitter,
            })
          }
          aria-label="X (Twitter) Profile"
          className="text-slate-400 dark:text-slate-400 hover:text-slate-900 dark:hover:text-[#E7E9EA] transition-colors duration-150 inline-flex items-center justify-center p-1.5 -m-1 rounded focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-[#1D9BF0]"
        >
          <XLogo size={16} weight="regular" className="shrink-0" />
        </a>
      </div>

      {/* Vertical Pipe Divider */}
      <span
        className="text-slate-300 dark:text-[#2F3336] select-none text-[12px] font-light"
        aria-hidden="true"
      >
        |
      </span>

      {/* Sound & Theme Controls */}
      <div className="flex items-center gap-2.5">
        {/* Sound Toggle (Sound On / Sound Off) */}
        <button
          type="button"
          onClick={toggleSound}
          aria-label={
            isSoundOn
              ? 'Sound enabled (click to mute)'
              : 'Sound muted (click to enable sound)'
          }
          title={isSoundOn ? 'Sound: On' : 'Sound: Off'}
          className={`p-1.5 -m-1 rounded transition-colors duration-150 inline-flex items-center justify-center cursor-pointer focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-[#1D9BF0] ${
            isSoundOn
              ? 'text-[#1D9BF0] hover:text-[#1a8cd8]'
              : 'text-slate-400 dark:text-slate-400 hover:text-slate-900 dark:hover:text-[#E7E9EA]'
          }`}
        >
          {isSoundOn ? (
            <SpeakerHigh size={16} weight="bold" className="shrink-0" />
          ) : (
            <SpeakerSlash size={16} weight="regular" className="shrink-0" />
          )}
        </button>

        {/* Theme Toggle (Light Mode / Dark Mode) */}
        <button
          type="button"
          onClick={toggleTheme}
          disabled={isTransitioning}
          aria-label={
            isDark ? 'Switch to light mode' : 'Switch to dark mode'
          }
          title={isDark ? 'Theme: Dark' : 'Theme: Light'}
          className={`text-slate-400 dark:text-slate-400 hover:text-slate-900 dark:hover:text-[#E7E9EA] transition-colors duration-150 inline-flex items-center justify-center p-1.5 -m-1 rounded focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-[#1D9BF0] overflow-hidden relative w-7 h-7 ${
            isTransitioning ? 'cursor-not-allowed opacity-75' : 'cursor-pointer'
          }`}
        >
          <AnimatePresence mode="wait" initial={false}>
            <motion.span
              key={isDark ? 'dark-sun' : 'light-moon'}
              initial={
                shouldReduceMotion
                  ? { opacity: 1 }
                  : { opacity: 0, rotate: -20, scale: 0.88 }
              }
              animate={{ opacity: 1, rotate: 0, scale: 1 }}
              exit={
                shouldReduceMotion
                  ? { opacity: 0 }
                  : { opacity: 0, rotate: 20, scale: 0.88 }
              }
              transition={{
                duration: shouldReduceMotion ? 0 : 0.18,
                ease: [0.4, 0, 0.2, 1],
              }}
              className="inline-flex items-center justify-center shrink-0"
            >
              {isDark ? (
                <Sun size={16} weight="regular" className="shrink-0" />
              ) : (
                <Moon size={16} weight="regular" className="shrink-0" />
              )}
            </motion.span>
          </AnimatePresence>
        </button>
      </div>
    </div>
  );
}
