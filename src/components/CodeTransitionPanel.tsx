'use client';

import React, { useState, useEffect } from 'react';
import { TransitionPanel } from '@/components/core/transition-panel';
import { portfolioData } from '@/data/portfolioData';

export interface CodePlatform {
  id: string;
  index: string;
  name: string;
  handle: string;
  url: string;
  primaryStat: string;
  secondaryDetail: string;
  focusAreas: string[];
  previewBg: string;
}

const PLATFORMS: CodePlatform[] = [
  {
    id: 'leetcode',
    index: '01',
    name: 'LeetCode',
    handle: '21_dvynshx',
    url: portfolioData.socials.leetcode || 'https://leetcode.com/u/21_dvynshx/',
    primaryStat: '300+ Problems Solved',
    secondaryDetail: 'Algorithms, Data Structures & Statistical Problem Solving',
    focusAreas: ['Dynamic Programming', 'Graph Algorithms', 'Trees & Arrays', 'Python / C++'],
    previewBg: 'bg-slate-950 text-slate-100',
  },
  {
    id: 'dailysql',
    index: '02',
    name: 'DailySQL.in',
    handle: 'divyanshutiwari281',
    url: portfolioData.socials.dailysql || 'https://dailysql.in/u/divyanshutiwari281',
    primaryStat: '1st Place Query Quest Champion',
    secondaryDetail: 'Competitive Query Optimization & Database Performance Tuning',
    focusAreas: ['Window Functions', 'Recursive CTEs', 'Index Bottlenecks', 'Complex JOINs'],
    previewBg: 'bg-zinc-950 text-zinc-100',
  },
];

export default function CodeTransitionPanel() {
  const [activeIndex, setActiveIndex] = useState(0);
  const [direction, setDirection] = useState(1);

  const handleSetActiveIndex = (newIndex: number) => {
    if (newIndex === activeIndex) return;
    setDirection(newIndex > activeIndex ? 1 : -1);
    setActiveIndex(newIndex);
  };

  useEffect(() => {
    if (activeIndex < 0) setActiveIndex(0);
    if (activeIndex >= PLATFORMS.length) setActiveIndex(PLATFORMS.length - 1);
  }, [activeIndex]);

  const variants = {
    enter: (dir: number) => ({
      x: dir > 0 ? 36 : -36,
      opacity: 0,
      filter: 'blur(4px)',
    }),
    center: {
      zIndex: 1,
      x: 0,
      opacity: 1,
      filter: 'blur(0px)',
    },
    exit: (dir: number) => ({
      zIndex: 0,
      x: dir < 0 ? 36 : -36,
      opacity: 0,
      filter: 'blur(4px)',
      position: 'absolute' as const,
      top: 0,
      left: 0,
      width: '100%',
    }),
  };

  return (
    <div className="w-full rounded-xl border border-slate-200/90 dark:border-slate-800/90 bg-white dark:bg-[#0f1422] p-5 sm:p-6 shadow-sm dark:shadow-xl transition-colors duration-200">
      {/* Platform Switcher Tabs Header */}
      <div className="flex items-center justify-between border-b border-slate-100 dark:border-slate-800/80 pb-3.5 mb-5">
        <div className="flex items-center gap-2">
          {PLATFORMS.map((platform, index) => {
            const isActive = activeIndex === index;
            return (
              <button
                key={platform.id}
                type="button"
                onClick={() => handleSetActiveIndex(index)}
                className={`relative px-3 py-1.5 rounded-lg text-[12px] font-mono transition-all duration-150 flex items-center gap-2 cursor-pointer ${
                  isActive
                    ? 'bg-slate-900 dark:bg-slate-100 text-white dark:text-slate-950 font-medium shadow-xs'
                    : 'text-slate-500 dark:text-slate-400 hover:text-slate-900 dark:hover:text-slate-100 hover:bg-slate-100 dark:hover:bg-slate-800'
                }`}
              >
                <span>
                  {platform.index} / {platform.name.toLowerCase()}
                </span>
                {isActive && (
                  <span className="w-1.5 h-1.5 rounded-full bg-[#ff3131] animate-pulse" />
                )}
              </button>
            );
          })}
        </div>

        {/* Counter */}
        <span className="font-mono text-[11.5px] text-slate-400 dark:text-slate-500 hidden sm:inline-block">
          0{activeIndex + 1} / 0{PLATFORMS.length}
        </span>
      </div>

      {/* Animated Sliding Transition Panel */}
      <TransitionPanel
        activeIndex={activeIndex}
        custom={direction}
        variants={variants}
        transition={{
          x: { type: 'spring', stiffness: 320, damping: 30 },
          opacity: { duration: 0.2 },
          filter: { duration: 0.2 },
        }}
      >
        {PLATFORMS.map((platform) => (
          <div key={platform.id} className="w-full">
            {/* Entire Card is Clickable to External Profile */}
            <a
              href={platform.url}
              target="_blank"
              rel="noopener noreferrer"
              className="group block rounded-lg border border-slate-200/80 dark:border-slate-800 p-4 sm:p-5 transition-all duration-200 hover:border-slate-400 dark:hover:border-slate-600 hover:shadow-xs bg-[#FBFBFA] dark:bg-[#151c2e]"
            >
              {/* Header Box with Platform Index & Live Stat */}
              <div
                className={`h-[90px] sm:h-[100px] w-full rounded-md p-3.5 sm:p-4 flex flex-col justify-between select-none mb-3.5 ${platform.previewBg}`}
              >
                <div className="flex items-center justify-between font-mono text-[10.5px] text-slate-400">
                  <span>PLATFORM_{platform.index}</span>
                  <span className="w-1.5 h-1.5 rounded-full bg-slate-400/50" />
                </div>
                <div className="flex items-end justify-between">
                  <span className="text-[15px] sm:text-[17px] font-bold text-slate-100 tracking-tight">
                    {platform.primaryStat}
                  </span>
                  <span className="font-mono text-[11px] text-slate-400 hidden sm:inline-block">
                    @{platform.handle}
                  </span>
                </div>
              </div>

              {/* Title & Handle */}
              <div className="flex items-baseline justify-between gap-2 mb-1">
                <h3 className="text-[17px] sm:text-[19px] font-bold text-slate-900 dark:text-slate-100 tracking-tight">
                  {platform.name}
                </h3>
                <span className="font-mono text-[11.5px] text-slate-500 dark:text-slate-400 sm:hidden">
                  @{platform.handle}
                </span>
              </div>

              {/* Detail */}
              <p className="text-[13px] text-slate-600 dark:text-slate-400 leading-relaxed mb-3">
                {platform.secondaryDetail}
              </p>

              {/* Focus Area Tags */}
              <div className="flex flex-wrap gap-1.5 mb-3.5">
                {platform.focusAreas.map((tag) => (
                  <span
                    key={tag}
                    className="rounded-lg bg-white dark:bg-slate-800/90 border border-slate-200/80 dark:border-slate-700/70 px-2 py-0.5 text-[10.5px] font-mono font-medium text-slate-700 dark:text-slate-300"
                  >
                    {tag}
                  </span>
                ))}
              </div>

              {/* Subtle Clickable Indicator */}
              <div className="pt-2 border-t border-slate-200/60 dark:border-slate-800 flex items-center justify-between font-mono text-[11.5px] text-slate-700 dark:text-slate-300 group-hover:text-slate-900 dark:group-hover:text-white transition-colors">
                <span className="inline-flex items-center gap-1">
                  <span>open {platform.name.toLowerCase()} profile</span>
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    width="11"
                    height="11"
                    fill="currentColor"
                    viewBox="0 0 256 256"
                    className="translate-y-[0.5px] group-hover:translate-x-0.5 group-hover:-translate-y-0.5 transition-transform"
                  >
                    <path d="M200,64V168a8,8,0,0,1-16,0V83.31L69.66,197.66a8,8,0,0,1-11.32-11.32L172.69,72H88a8,8,0,0,1,0-16H192A8,8,0,0,1,200,64Z" />
                  </svg>
                </span>
                <span className="text-[10.5px] text-slate-400">external ↗</span>
              </div>
            </a>
          </div>
        ))}
      </TransitionPanel>

      {/* Footer Navigation Controls */}
      <div className="flex items-center justify-between border-t border-slate-100 dark:border-slate-800/80 pt-3.5 mt-4">
        <button
          type="button"
          onClick={() => handleSetActiveIndex(activeIndex - 1)}
          disabled={activeIndex === 0}
          className={`px-3 py-1.5 rounded-lg text-[12px] font-medium font-mono transition-colors flex items-center gap-1.5 cursor-pointer ${
            activeIndex === 0
              ? 'opacity-25 cursor-not-allowed text-slate-400 dark:text-slate-600'
              : 'text-slate-700 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-800 hover:text-slate-900 dark:hover:text-slate-100'
          }`}
        >
          <svg
            xmlns="http://www.w3.org/2000/svg"
            width="13"
            height="13"
            fill="currentColor"
            viewBox="0 0 256 256"
            className="rotate-180"
          >
            <path d="M221.66,133.66l-72,72a8,8,0,0,1-11.32-11.32L196.69,136H40a8,8,0,0,1,0-16H196.69L138.34,61.66a8,8,0,0,1,11.32-11.32l72,72A8,8,0,0,1,221.66,133.66Z" />
          </svg>
          <span>Previous</span>
        </button>

        <div className="flex items-center gap-1.5">
          {PLATFORMS.map((_, i) => (
            <button
              key={i}
              type="button"
              onClick={() => handleSetActiveIndex(i)}
              aria-label={`Go to platform ${i + 1}`}
              className={`h-1.5 rounded-full transition-all duration-200 cursor-pointer ${
                activeIndex === i
                  ? 'w-5 bg-slate-900 dark:bg-slate-100'
                  : 'w-1.5 bg-slate-200 dark:bg-slate-800 hover:bg-slate-300 dark:hover:bg-slate-700'
              }`}
            />
          ))}
        </div>

        <button
          type="button"
          onClick={() => handleSetActiveIndex(activeIndex + 1)}
          disabled={activeIndex === PLATFORMS.length - 1}
          className={`px-3 py-1.5 rounded-lg text-[12px] font-medium font-mono transition-colors flex items-center gap-1.5 cursor-pointer ${
            activeIndex === PLATFORMS.length - 1
              ? 'opacity-25 cursor-not-allowed text-slate-400 dark:text-slate-600'
              : 'text-slate-700 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-800 hover:text-slate-900 dark:hover:text-slate-100'
          }`}
        >
          <span>Next</span>
          <svg
            xmlns="http://www.w3.org/2000/svg"
            width="13"
            height="13"
            fill="currentColor"
            viewBox="0 0 256 256"
          >
            <path d="M221.66,133.66l-72,72a8,8,0,0,1-11.32-11.32L196.69,136H40a8,8,0,0,1,0-16H196.69L138.34,61.66a8,8,0,0,1,11.32-11.32l72,72A8,8,0,0,1,221.66,133.66Z" />
          </svg>
        </button>
      </div>
    </div>
  );
}
