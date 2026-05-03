'use client';

import React from 'react';
import Link from 'next/link';
import {
  X,
  LinkedinLogo,
  House,
} from '@phosphor-icons/react';
import { usePopover } from '@/components/animate-ui/components/headless/popover';
import { useTheme } from '@/components/ThemeProvider';
import { useSound } from '@/components/SoundProvider';
import { portfolioData } from '@/data/portfolioData';
import { trackContactClicked } from '@/lib/posthog';

function XLogoIcon({ className = 'w-3.5 h-3.5' }: { className?: string }) {
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

      {/* Preferences Toggles (Dark Mode & Sound) */}
      <div className="space-y-1">
        <div className="flex items-center justify-between gap-2 py-1 select-none">
          <span
            onClick={isTransitioning ? undefined : toggleTheme}
            className={`text-[13px] font-medium text-slate-700 dark:text-slate-300 ${
              isTransitioning ? 'cursor-not-allowed opacity-75' : 'cursor-pointer'
            }`}
          >
            Dark Mode
          </span>
          <ToggleSwitch
            checked={isDark}
            onChange={toggleTheme}
            label="Toggle dark mode"
            disabled={isTransitioning}
          />
        </div>

        <div className="flex items-center justify-between gap-2 py-1 select-none">
          <span
            onClick={toggleSound}
            className="text-[13px] font-medium text-slate-700 dark:text-slate-300 cursor-pointer"
          >
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
          {/* Twitter/X Profile */}
          <a
            href={portfolioData.socials.twitter}
            target="_blank"
            rel="noopener noreferrer"
            draggable={false}
            onDragStart={(e) => e.preventDefault()}
            onClick={() =>
              trackContactClicked({
                channel: 'twitter',
                location: 'settings_popover',
                url: portfolioData.socials.twitter,
              })
            }
            className="group flex items-center justify-center gap-1.5 px-2.5 py-1.5 rounded-lg border border-slate-200/80 dark:border-[#2F3336]/70 bg-slate-50/60 dark:bg-[#121417]/60 hover:bg-slate-100/90 dark:hover:bg-[#1E2732] hover:border-slate-300 dark:hover:border-slate-600 transition-all duration-150 text-slate-700 dark:text-slate-200 hover:text-slate-950 dark:hover:text-white cursor-pointer focus:outline-none focus-visible:ring-2 focus-visible:ring-[#1D9BF0] select-none"
          >
            <XLogoIcon className="w-3.5 h-3.5 text-slate-600 dark:text-slate-300 group-hover:text-[#1D9BF0] transition-colors shrink-0" />
            <span className="text-[12px] font-medium truncate">Twitter/X</span>
          </a>

          {/* LinkedIn Profile */}
          <a
            href={portfolioData.socials.linkedin}
            target="_blank"
            rel="noopener noreferrer"
            draggable={false}
            onDragStart={(e) => e.preventDefault()}
            onClick={() =>
              trackContactClicked({
                channel: 'linkedin',
                location: 'settings_popover',
                url: portfolioData.socials.linkedin,
              })
            }
            className="group flex items-center justify-center gap-2 px-2.5 py-1.5 rounded-lg border border-slate-200/80 dark:border-[#2F3336]/70 bg-slate-50/60 dark:bg-[#121417]/60 hover:bg-slate-100/90 dark:hover:bg-[#1E2732] hover:border-slate-300 dark:hover:border-slate-600 transition-all duration-150 text-slate-700 dark:text-slate-200 hover:text-slate-950 dark:hover:text-white cursor-pointer focus:outline-none focus-visible:ring-2 focus-visible:ring-[#1D9BF0] select-none"
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
          draggable={false}
          onDragStart={(e) => e.preventDefault()}
          className="group flex items-center justify-center gap-2 w-full px-2.5 py-1.5 rounded-lg border border-slate-200/80 dark:border-[#2F3336]/70 bg-slate-50/60 dark:bg-[#121417]/60 hover:bg-slate-100/90 dark:hover:bg-[#1E2732] hover:border-slate-300 dark:hover:border-slate-600 transition-all duration-150 text-slate-700 dark:text-slate-200 hover:text-slate-950 dark:hover:text-white cursor-pointer focus:outline-none focus-visible:ring-2 focus-visible:ring-[#1D9BF0] select-none"
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
