'use client';

import React from 'react';
import {
  Sun,
  Moon,
  SunDim,
  SpeakerHigh,
  SpeakerSlash,
  X,
  XLogo,
  LinkedinLogo,
  ArrowUpRight,
} from '@phosphor-icons/react';
import { usePopover } from '@/components/animate-ui/components/headless/popover';
import { useTheme } from '@/components/ThemeProvider';
import { useSound } from '@/components/SoundProvider';
import { portfolioData } from '@/data/portfolioData';
import { trackContactClicked } from '@/lib/posthog';

export function SettingsContent() {
  const { close } = usePopover();
  const { isDark, setTheme, brightness, setBrightness } = useTheme();
  const { isSoundOn, toggleSound, volume, setVolume, playClickSound } = useSound();

  const handleVolumeChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const val = Number(e.target.value);
    setVolume(val);
    if (isSoundOn) {
      playClickSound(val);
    }
  };

  const handleBrightnessChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const val = Number(e.target.value);
    setBrightness(val);
  };

  return (
    <div className="flex flex-col space-y-3.5">
      {/* Popover Header */}
      <div className="flex items-center justify-between pb-2 border-b border-slate-100 dark:border-[#2F3336]/80">
        <h2 className="text-[14px] font-bold text-slate-900 dark:text-slate-100 tracking-tight">
          Settings
        </h2>
        <button
          type="button"
          onClick={close}
          aria-label="Close settings"
          className="p-1 rounded-md text-slate-400 hover:text-slate-700 dark:hover:text-slate-200 hover:bg-slate-100 dark:hover:bg-[#1E2732] transition-colors focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-[#1D9BF0] cursor-pointer"
        >
          <X size={14} weight="bold" aria-hidden="true" />
        </button>
      </div>

      {/* 1. Appearance Section */}
      <div className="space-y-2.5">
        <span className="block text-[11px] font-mono font-semibold uppercase tracking-wider text-slate-500 dark:text-slate-400">
          Appearance
        </span>

        {/* Theme: Light vs Dark */}
        <div className="flex items-center justify-between gap-2">
          <span className="text-[13px] font-medium text-slate-700 dark:text-slate-300">
            Theme
          </span>
          <div
            role="radiogroup"
            aria-label="Theme mode"
            className="inline-flex items-center rounded-lg border border-slate-200/90 dark:border-[#2F3336] bg-slate-100/80 dark:bg-[#121417] p-0.5"
          >
            <button
              type="button"
              role="radio"
              aria-checked={!isDark}
              onClick={() => setTheme('light')}
              className={`inline-flex items-center gap-1.5 px-2.5 py-1 rounded-[6px] text-[12px] font-medium transition-all cursor-pointer focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-[#1D9BF0] ${
                !isDark
                  ? 'bg-white text-slate-900 shadow-xs font-semibold'
                  : 'text-slate-500 dark:text-slate-400 hover:text-slate-900 dark:hover:text-slate-200'
              }`}
            >
              <Sun size={13} weight={!isDark ? 'bold' : 'regular'} aria-hidden="true" />
              <span>Light</span>
            </button>
            <button
              type="button"
              role="radio"
              aria-checked={isDark}
              onClick={() => setTheme('dark')}
              className={`inline-flex items-center gap-1.5 px-2.5 py-1 rounded-[6px] text-[12px] font-medium transition-all cursor-pointer focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-[#1D9BF0] ${
                isDark
                  ? 'bg-[#1E2732] text-slate-100 border border-[#2F3336]/60 shadow-xs font-semibold'
                  : 'text-slate-500 dark:text-slate-400 hover:text-slate-900 dark:hover:text-slate-200'
              }`}
            >
              <Moon size={13} weight={isDark ? 'bold' : 'regular'} aria-hidden="true" />
              <span>Dark</span>
            </button>
          </div>
        </div>

        {/* Brightness Slider */}
        <div className="space-y-1 pt-0.5">
          <div className="flex items-center justify-between text-[12.5px]">
            <label
              htmlFor="settings-brightness"
              className="flex items-center gap-1.5 font-medium text-slate-700 dark:text-slate-300"
            >
              <SunDim size={14} className="text-slate-400" aria-hidden="true" />
              <span>Brightness</span>
            </label>
            <span className="font-mono text-[11.5px] text-slate-500 dark:text-slate-400 tabular-nums">
              {brightness}%
            </span>
          </div>
          <input
            id="settings-brightness"
            type="range"
            min="60"
            max="140"
            step="5"
            value={brightness}
            onChange={handleBrightnessChange}
            aria-label="Brightness"
            className="w-full h-1.5 bg-slate-200 dark:bg-[#2F3336] rounded-lg appearance-none cursor-pointer accent-[#1D9BF0] focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-[#1D9BF0]"
          />
        </div>
      </div>

      {/* Divider */}
      <hr className="border-t border-slate-100 dark:border-[#2F3336]/80 my-0.5" />

      {/* 2. Sound Section */}
      <div className="space-y-2.5">
        <span className="block text-[11px] font-mono font-semibold uppercase tracking-wider text-slate-500 dark:text-slate-400">
          Sound
        </span>

        {/* Sound On / Off Toggle */}
        <div className="flex items-center justify-between gap-2">
          <div className="flex items-center gap-1.5 text-[13px] font-medium text-slate-700 dark:text-slate-300">
            {isSoundOn ? (
              <SpeakerHigh size={14} className="text-[#1D9BF0]" aria-hidden="true" />
            ) : (
              <SpeakerSlash size={14} className="text-slate-400" aria-hidden="true" />
            )}
            <span>Sound</span>
          </div>
          <button
            type="button"
            role="switch"
            aria-checked={isSoundOn}
            aria-label="Toggle sound effects"
            onClick={toggleSound}
            className={`inline-flex items-center gap-1 px-2.5 py-1 rounded-md text-[12px] font-semibold transition-all cursor-pointer focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-[#1D9BF0] ${
              isSoundOn
                ? 'bg-[#1D9BF0]/15 text-[#1D9BF0] border border-[#1D9BF0]/30 hover:bg-[#1D9BF0]/20'
                : 'bg-slate-100 dark:bg-[#1E2732] text-slate-500 dark:text-slate-400 border border-slate-200/80 dark:border-[#2F3336] hover:text-slate-900 dark:hover:text-slate-200'
            }`}
          >
            <span>{isSoundOn ? 'On' : 'Off'}</span>
          </button>
        </div>

        {/* Volume Slider */}
        <div className="space-y-1 pt-0.5">
          <div className="flex items-center justify-between text-[12.5px]">
            <label
              htmlFor="settings-volume"
              className="flex items-center gap-1.5 font-medium text-slate-700 dark:text-slate-300"
            >
              <span>Volume</span>
            </label>
            <span className="font-mono text-[11.5px] text-slate-500 dark:text-slate-400 tabular-nums">
              {volume}%
            </span>
          </div>
          <input
            id="settings-volume"
            type="range"
            min="0"
            max="100"
            step="5"
            value={volume}
            onChange={handleVolumeChange}
            aria-label="Volume"
            className="w-full h-1.5 bg-slate-200 dark:bg-[#2F3336] rounded-lg appearance-none cursor-pointer accent-[#1D9BF0] focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-[#1D9BF0]"
          />
        </div>
      </div>

      {/* Divider */}
      <hr className="border-t border-slate-100 dark:border-[#2F3336]/80 my-0.5" />

      {/* 3. Social Section */}
      <div className="space-y-2">
        <span className="block text-[11px] font-mono font-semibold uppercase tracking-wider text-slate-500 dark:text-slate-400">
          Social
        </span>

        <div className="space-y-1.5">
          {/* X Profile */}
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
            className="group flex items-center justify-between px-2.5 py-1.5 rounded-lg border border-slate-200/80 dark:border-[#2F3336]/70 bg-slate-50/60 dark:bg-[#121417]/60 hover:bg-slate-100/90 dark:hover:bg-[#1E2732] hover:border-slate-300 dark:hover:border-slate-600 transition-all duration-150 text-slate-700 dark:text-slate-200 hover:text-slate-950 dark:hover:text-white cursor-pointer focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-[#1D9BF0]"
          >
            <div className="flex items-center gap-2">
              <XLogo
                size={14}
                weight="bold"
                className="text-slate-600 dark:text-slate-300 group-hover:text-slate-950 dark:group-hover:text-white transition-colors"
                aria-hidden="true"
              />
              <span className="text-[12.5px] font-medium">X</span>
            </div>
            <ArrowUpRight
              size={13}
              weight="bold"
              className="text-slate-400 dark:text-slate-500 group-hover:text-slate-700 dark:group-hover:text-slate-200 group-hover:translate-x-0.5 group-hover:-translate-y-0.5 transition-transform duration-150 shrink-0"
              aria-hidden="true"
            />
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
            className="group flex items-center justify-between px-2.5 py-1.5 rounded-lg border border-slate-200/80 dark:border-[#2F3336]/70 bg-slate-50/60 dark:bg-[#121417]/60 hover:bg-slate-100/90 dark:hover:bg-[#1E2732] hover:border-slate-300 dark:hover:border-slate-600 transition-all duration-150 text-slate-700 dark:text-slate-200 hover:text-slate-950 dark:hover:text-white cursor-pointer focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-[#1D9BF0]"
          >
            <div className="flex items-center gap-2">
              <LinkedinLogo
                size={14}
                weight="bold"
                className="text-slate-600 dark:text-slate-300 group-hover:text-[#0A66C2] dark:group-hover:text-[#0A66C2] transition-colors"
                aria-hidden="true"
              />
              <span className="text-[12.5px] font-medium">LinkedIn</span>
            </div>
            <ArrowUpRight
              size={13}
              weight="bold"
              className="text-slate-400 dark:text-slate-500 group-hover:text-slate-700 dark:group-hover:text-slate-200 group-hover:translate-x-0.5 group-hover:-translate-y-0.5 transition-transform duration-150 shrink-0"
              aria-hidden="true"
            />
          </a>
        </div>
      </div>
    </div>
  );
}
