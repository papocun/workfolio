'use client';

import React from 'react';
import Link from 'next/link';
import {
  X,
  TwitterLogo,
  LinkedinLogo,
  House,
} from '@phosphor-icons/react';
import { usePopover } from '@/components/animate-ui/components/headless/popover';
import { useTheme } from '@/components/ThemeProvider';
import { useSound } from '@/components/SoundProvider';
import { portfolioData } from '@/data/portfolioData';
import { trackContactClicked } from '@/lib/posthog';

interface ToggleSwitchProps {
  checked: boolean;
  onChange: () => void;
  label: string;
  disabled?: boolean;
}

function ToggleSwitch({ checked, onChange, label, disabled = false }: ToggleSwitchProps) {
  return (
    <button
      type="button"
      role="switch"
      aria-checked={checked}
      aria-label={label}
      disabled={disabled}
      onClick={(e) => {
        e.stopPropagation();
        onChange();
      }}
      className={`relative inline-flex h-5 w-9 shrink-0 rounded-full border border-transparent p-0.5 transition-colors duration-200 ease-[cubic-bezier(0.4,0,0.2,1)] focus:outline-none focus-visible:ring-2 focus-visible:ring-[#1D9BF0] focus-visible:ring-offset-2 dark:focus-visible:ring-offset-[#16181C] select-none ${
        disabled ? 'cursor-not-allowed opacity-75' : 'cursor-pointer'
      } ${
        checked
          ? 'bg-[#1D9BF0]'
          : 'bg-slate-200 dark:bg-[#2F3336] border-slate-300/80 dark:border-[#3E4347]'
      }`}
    >
      <span
        aria-hidden="true"
        className={`pointer-events-none inline-block h-3.5 w-3.5 rounded-full bg-white shadow-xs transition-transform duration-200 ease-[cubic-bezier(0.4,0,0.2,1)] ${
          checked ? 'translate-x-4' : 'translate-x-0'
        }`}
      />
    </button>
  );
}

export function SettingsContent() {
  const { close } = usePopover();
  const { isDark, toggleTheme, isTransitioning } = useTheme();
  const { isSoundOn, toggleSound } = useSound();

  return (
    <div className="flex flex-col space-y-3.5 w-full">
      {/* Popover Header */}
      <div className="flex items-center justify-between pb-2 border-b border-slate-100 dark:border-[#2F3336]/80">
        <h2 className="text-[13.5px] font-bold text-slate-900 dark:text-slate-100 tracking-tight">
          Settings
        </h2>
        <button
          type="button"
          onClick={close}
          aria-label="Close settings"
          className="p-1 rounded-md text-slate-400 hover:text-slate-700 dark:hover:text-slate-200 hover:bg-slate-100 dark:hover:bg-[#1E2732] transition-colors focus:outline-none focus-visible:ring-2 focus-visible:ring-[#1D9BF0] cursor-pointer"
        >
          <X size={13} weight="bold" aria-hidden="true" />
        </button>
      </div>

      {/* Preferences Toggles (Dark Mode & Sound) — Entire row clickable for touch & tablet */}
      <div className="space-y-1">
        <div
          role="button"
          tabIndex={0}
          onClick={isTransitioning ? undefined : toggleTheme}
          onKeyDown={(e) => {
            if (e.key === 'Enter' || e.key === ' ') {
              e.preventDefault();
              if (!isTransitioning) toggleTheme();
            }
          }}
          className={`flex items-center justify-between gap-2 py-1 px-1 -mx-1 rounded-md transition-colors select-none ${
            isTransitioning
              ? 'cursor-not-allowed opacity-75'
              : 'cursor-pointer hover:bg-slate-100/70 dark:hover:bg-[#1E2732]/60 active:bg-slate-200/50 dark:active:bg-[#1E2732]/90'
          }`}
        >
          <span className="text-[13px] font-medium text-slate-700 dark:text-slate-300">
            Dark Mode
          </span>
          <ToggleSwitch
            checked={isDark}
            onChange={toggleTheme}
            label="Toggle dark mode"
            disabled={isTransitioning}
          />
        </div>

        <div
          role="button"
          tabIndex={0}
          onClick={toggleSound}
          onKeyDown={(e) => {
            if (e.key === 'Enter' || e.key === ' ') {
              e.preventDefault();
              toggleSound();
            }
          }}
          className="flex items-center justify-between gap-2 py-1 px-1 -mx-1 rounded-md transition-colors select-none cursor-pointer hover:bg-slate-100/70 dark:hover:bg-[#1E2732]/60 active:bg-slate-200/50 dark:active:bg-[#1E2732]/90"
        >
          <span className="text-[13px] font-medium text-slate-700 dark:text-slate-300">
            Sound
          </span>
          <ToggleSwitch
            checked={isSoundOn}
            onChange={toggleSound}
            label="Toggle sound effects"
          />
        </div>
      </div>

      {/* Divider */}
      <hr className="border-t border-slate-100 dark:border-[#2F3336]/80 -mt-1.5" />

      {/* Social Media & Navigation Links */}
      <div className="space-y-2 pt-1.5">
        <div className="grid grid-cols-2 gap-2">
          {/* Twitter Profile */}
          <a
            href={portfolioData.socials.twitter}
            target="_blank"
            rel="noopener noreferrer"
            onClick={() =>
              trackContactClicked({
                channel: 'twitter',
                location: 'settings_popover',
                url: portfolioData.socials.twitter,
              })
            }
            className="group flex items-center justify-center gap-2 px-2.5 py-1.5 rounded-lg border border-slate-200/80 dark:border-[#2F3336]/70 bg-slate-50/60 dark:bg-[#121417]/60 hover:bg-slate-100/90 dark:hover:bg-[#1E2732] hover:border-slate-300 dark:hover:border-slate-600 transition-all duration-150 text-slate-700 dark:text-slate-200 hover:text-slate-950 dark:hover:text-white cursor-pointer focus:outline-none focus-visible:ring-2 focus-visible:ring-[#1D9BF0]"
          >
            <TwitterLogo
              size={14}
              weight="bold"
              className="text-slate-600 dark:text-slate-300 group-hover:text-[#1D9BF0] transition-colors shrink-0"
              aria-hidden="true"
            />
            <span className="text-[12px] font-medium truncate">Twitter</span>
          </a>

          {/* LinkedIn Profile */}
          <a
            href={portfolioData.socials.linkedin}
            target="_blank"
            rel="noopener noreferrer"
            onClick={() =>
              trackContactClicked({
                channel: 'linkedin',
                location: 'settings_popover',
                url: portfolioData.socials.linkedin,
              })
            }
            className="group flex items-center justify-center gap-2 px-2.5 py-1.5 rounded-lg border border-slate-200/80 dark:border-[#2F3336]/70 bg-slate-50/60 dark:bg-[#121417]/60 hover:bg-slate-100/90 dark:hover:bg-[#1E2732] hover:border-slate-300 dark:hover:border-slate-600 transition-all duration-150 text-slate-700 dark:text-slate-200 hover:text-slate-950 dark:hover:text-white cursor-pointer focus:outline-none focus-visible:ring-2 focus-visible:ring-[#1D9BF0]"
          >
            <LinkedinLogo
              size={14}
              weight="bold"
              className="text-slate-600 dark:text-slate-300 group-hover:text-[#0A66C2] dark:group-hover:text-[#0A66C2] transition-colors shrink-0"
              aria-hidden="true"
            />
            <span className="text-[12px] font-medium truncate">LinkedIn</span>
          </a>
        </div>

        {/* Homepage Link Box */}
        <Link
          href="/"
          onClick={close}
          className="group flex items-center justify-center gap-2 w-full px-2.5 py-1.5 rounded-lg border border-slate-200/80 dark:border-[#2F3336]/70 bg-slate-50/60 dark:bg-[#121417]/60 hover:bg-slate-100/90 dark:hover:bg-[#1E2732] hover:border-slate-300 dark:hover:border-slate-600 transition-all duration-150 text-slate-700 dark:text-slate-200 hover:text-slate-950 dark:hover:text-white cursor-pointer focus:outline-none focus-visible:ring-2 focus-visible:ring-[#1D9BF0]"
        >
          <House
            size={14}
            weight="bold"
            className="text-slate-600 dark:text-slate-300 group-hover:text-[#1D9BF0] transition-colors shrink-0"
            aria-hidden="true"
          />
          <span className="text-[12px] font-medium truncate">Homepage</span>
        </Link>
      </div>
    </div>
  );
}

export default SettingsContent;
