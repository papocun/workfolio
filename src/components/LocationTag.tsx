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
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from '@/components/animate-ui/components/animate/tooltip';

interface LocationTagProps {
  location?: string;
  className?: string;
  showTooltips?: boolean;
}

function IconTooltip({
  enabled,
  label,
  children,
  side = 'top',
}: {
  enabled: boolean;
  label: string;
  children: React.ReactElement;
  side?: 'top' | 'bottom' | 'left' | 'right';
}) {
  if (!enabled) return children;
  return (
    <Tooltip side={side}>
      <TooltipTrigger asChild>{children}</TooltipTrigger>
      <TooltipContent>
        <p>{label}</p>
      </TooltipContent>
    </Tooltip>
  );
}

export default function LocationTag({
  location = 'Delhi',
  className = '',
  showTooltips = false,
}: LocationTagProps) {
  const { isDark, toggleTheme, isTransitioning } = useTheme();
  const { isSoundOn, toggleSound } = useSound();
  const shouldReduceMotion = useReducedMotion();

  const content = (
    <div
      className={`flex items-center gap-3 sm:gap-3.5 text-[14px] sm:text-[14.5px] text-slate-500 dark:text-slate-400 font-medium flex-wrap ${className}`}
    >
      {/* Group 1: Location & View Counter */}
      <div className="flex items-center gap-2.5 sm:gap-3">
        {/* Location with Phosphor MapPin */}
        <div className="flex items-center gap-1.5">
          <IconTooltip enabled={showTooltips} label="Delhi">
            <span
              className="inline-flex items-center justify-center cursor-default focus:outline-none focus-visible:ring-1 focus-visible:ring-[#1D9BF0] rounded p-1 -m-1"
              tabIndex={0}
              role="img"
              aria-label="Delhi"
              data-tooltip-target="location"
            >
              <MapPin
                size={16}
                weight="bold"
                className="text-slate-400 dark:text-slate-400 shrink-0"
                aria-hidden="true"
              />
            </span>
          </IconTooltip>
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
        <ViewCounter showTooltip={showTooltips} />
      </div>

      {/* Middle Vertical Pipe Divider (hidden when wrapped on mobile) */}
      <span
        className="hidden min-[480px]:inline text-slate-300 dark:text-[#2F3336] select-none text-[12px] font-light"
        aria-hidden="true"
      >
        |
      </span>

      {/* Group 2: Social Links & Controls */}
      <div className="flex items-center gap-2.5 sm:gap-3">
        {/* Social Phosphor Icons */}
        <div className="flex items-center gap-2.5">
          {/* GitHub */}
          <IconTooltip enabled={showTooltips} label="GitHub">
            <a
              href={portfolioData.socials.github}
              target="_blank"
              rel="noopener noreferrer"
              draggable={false}
              onDragStart={(e) => e.preventDefault()}
              onClick={() =>
                trackGithubClicked({
                  location: 'location_bar',
                  url: portfolioData.socials.github,
                })
              }
              aria-label="GitHub"
              className="text-slate-400 dark:text-slate-400 hover:text-slate-900 dark:hover:text-[#E7E9EA] transition-colors duration-150 inline-flex items-center justify-center p-1.5 -m-1 rounded focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-[#1D9BF0] select-none"
            >
              <GithubLogo size={16} weight="regular" className="shrink-0" />
            </a>
          </IconTooltip>

          {/* LinkedIn */}
          <IconTooltip enabled={showTooltips} label="LinkedIn">
            <a
              href={portfolioData.socials.linkedin}
              target="_blank"
              rel="noopener noreferrer"
              draggable={false}
              onDragStart={(e) => e.preventDefault()}
              onClick={() =>
                trackContactClicked({
                  channel: 'linkedin',
                  location: 'location_bar',
                  url: portfolioData.socials.linkedin,
                })
              }
              aria-label="LinkedIn"
              className="text-slate-400 dark:text-slate-400 hover:text-[#0A66C2] dark:hover:text-[#0A66C2] transition-colors duration-150 inline-flex items-center justify-center p-1.5 -m-1 rounded focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-[#1D9BF0] select-none"
            >
              <LinkedinLogo size={16} weight="regular" className="shrink-0" />
            </a>
          </IconTooltip>

          {/* X */}
          <IconTooltip enabled={showTooltips} label="X">
            <a
              href={portfolioData.socials.twitter}
              target="_blank"
              rel="noopener noreferrer"
              draggable={false}
              onDragStart={(e) => e.preventDefault()}
              onClick={() =>
                trackContactClicked({
                  channel: 'twitter',
                  location: 'location_bar',
                  url: portfolioData.socials.twitter,
                })
              }
              aria-label="X"
              className="text-slate-400 dark:text-slate-400 hover:text-slate-900 dark:hover:text-[#E7E9EA] transition-colors duration-150 inline-flex items-center justify-center p-1.5 -m-1 rounded focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-[#1D9BF0] select-none"
            >
              <XLogo size={16} weight="regular" className="shrink-0" />
            </a>
          </IconTooltip>
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
        <IconTooltip enabled={showTooltips} label="Sound">
          <button
            type="button"
            onClick={toggleSound}
            aria-label="Sound"
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
        </IconTooltip>

        {/* Theme Toggle (Light Mode / Dark Mode) */}
        <IconTooltip enabled={showTooltips} label="Theme">
          <button
            type="button"
            onClick={toggleTheme}
            disabled={isTransitioning}
            aria-label="Theme"
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
                    ? { opacity: 1 }
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
        </IconTooltip>
      </div>
    </div>
  </div>
  );

  return showTooltips ? (
    <TooltipProvider openDelay={150} closeDelay={100}>
      {content}
    </TooltipProvider>
  ) : (
    content
  );
}
