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

interface LocationTagProps {
  location?: string;
  className?: string;
}

export default function LocationTag({
  location = 'Delhi',
  className = '',
}: LocationTagProps) {
  const { isDark, toggleTheme } = useTheme();
  const { isSoundOn, toggleSound } = useSound();

  return (
    <div
      className={`flex items-center gap-3 sm:gap-3.5 text-[13px] sm:text-[13.5px] text-slate-500 dark:text-[#71767B] font-medium flex-wrap ${className}`}
    >
      {/* Location with Phosphor MapPin */}
      <div className="flex items-center gap-1.5">
        <MapPin
          size={15}
          weight="bold"
          className="text-slate-400 dark:text-[#71767B] shrink-0"
          aria-hidden="true"
        />
        <span className="text-slate-700 dark:text-[#E7E9EA] font-medium">{location}</span>
      </div>

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
          className="text-slate-400 dark:text-[#71767B] hover:text-slate-900 dark:hover:text-[#E7E9EA] transition-colors duration-150 inline-flex items-center justify-center p-0.5 rounded focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-[#1D9BF0]"
        >
          <GithubLogo size={15} weight="regular" className="shrink-0" />
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
          className="text-slate-400 dark:text-[#71767B] hover:text-[#0A66C2] dark:hover:text-[#0A66C2] transition-colors duration-150 inline-flex items-center justify-center p-0.5 rounded focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-[#1D9BF0]"
        >
          <LinkedinLogo size={15} weight="regular" className="shrink-0" />
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
          className="text-slate-400 dark:text-[#71767B] hover:text-slate-900 dark:hover:text-[#E7E9EA] transition-colors duration-150 inline-flex items-center justify-center p-0.5 rounded focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-[#1D9BF0]"
        >
          <XLogo size={15} weight="regular" className="shrink-0" />
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
          className={`p-0.5 rounded transition-colors duration-150 inline-flex items-center justify-center cursor-pointer focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-[#1D9BF0] ${
            isSoundOn
              ? 'text-[#1D9BF0] hover:text-[#1a8cd8]'
              : 'text-slate-400 dark:text-[#71767B] hover:text-slate-900 dark:hover:text-[#E7E9EA]'
          }`}
        >
          {isSoundOn ? (
            <SpeakerHigh size={15} weight="bold" className="shrink-0" />
          ) : (
            <SpeakerSlash size={15} weight="regular" className="shrink-0" />
          )}
        </button>

        {/* Theme Toggle (Light Mode / Dark Mode) */}
        <button
          type="button"
          onClick={toggleTheme}
          aria-label={
            isDark ? 'Switch to light mode' : 'Switch to dark mode'
          }
          title={isDark ? 'Theme: Dark' : 'Theme: Light'}
          className="text-slate-400 dark:text-[#71767B] hover:text-slate-900 dark:hover:text-[#E7E9EA] transition-colors duration-150 inline-flex items-center justify-center p-0.5 rounded cursor-pointer focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-[#1D9BF0]"
        >
          {isDark ? (
            <Sun size={15} weight="regular" className="shrink-0" />
          ) : (
            <Moon size={15} weight="regular" className="shrink-0" />
          )}
        </button>
      </div>
    </div>
  );
}
