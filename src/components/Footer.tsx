'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import {
  LinkedinLogo,
  XLogo,
} from '@phosphor-icons/react';
import { portfolioData } from '@/data/portfolioData';
import {
  trackContactClicked,
  trackGithubClicked,
  trackLeetcodeClicked,
  trackStratascratchClicked,
} from '@/lib/posthog';

const SOCIAL_LINKS = [
  {
    label: 'LinkedIn',
    channel: 'linkedin',
    href: portfolioData.socials.linkedin,
    icon: LinkedinLogo,
  },
  {
    label: 'X (Twitter)',
    channel: 'twitter',
    href: portfolioData.socials.twitter || 'https://x.com/21dvy_t',
    icon: XLogo,
  },
];

const PROFILE_LINKS = [
  {
    label: 'GitHub',
    id: 'github',
    href: portfolioData.socials.github,
  },
  {
    label: 'LeetCode',
    id: 'leetcode',
    href: portfolioData.socials.leetcode || 'https://leetcode.com/u/21_dvynshx/',
  },
  {
    label: 'DailySQL',
    id: 'dailysql',
    href: portfolioData.socials.dailysql || 'https://dailysql.in/u/divyanshutiwari281',
  },
  {
    label: 'StrataScratch',
    id: 'stratascratch',
    href: portfolioData.socials.stratascratch || 'https://platform.stratascratch.com/user/papocun',
  },
];

function LiveTimeDisplay() {
  const [formattedTime, setFormattedTime] = useState<string>('');

  useEffect(() => {
    const updateTime = () => {
      const now = new Date();
      const datePart = now.toLocaleDateString('en-US', {
        weekday: 'short',
        day: 'numeric',
        month: 'short',
        year: 'numeric',
      });
      const timePart = now.toLocaleTimeString('en-US', {
        hour12: false,
        hour: '2-digit',
        minute: '2-digit',
        second: '2-digit',
      });
      setFormattedTime(`${datePart} · ${timePart}`);
    };

    updateTime();
    const interval = setInterval(updateTime, 1000);
    return () => clearInterval(interval);
  }, []);

  return (
    <span className="tabular-nums select-none" suppressHydrationWarning>
      {formattedTime || 'Loading time...'}
    </span>
  );
}

export default function Footer() {
  return (
    <footer className="w-full border-t border-slate-200/80 dark:border-slate-800/80 bg-[#FAF9F6] dark:bg-[#000000] text-slate-600 dark:text-slate-400 mt-16 sm:mt-20 transition-colors duration-200 ease-[cubic-bezier(0.4,0,0.2,1)]">
      <div className="max-w-[680px] mx-auto px-4 sm:px-6 pt-10 sm:pt-14 pb-8 sm:pb-12">
        {/* Main Footer Multi-Column Structure */}
        <div className="grid grid-cols-1 sm:grid-cols-12 gap-8 sm:gap-6">
          {/* Left Column: Personal / Identity Area */}
          <div className="sm:col-span-6 flex flex-col justify-between">
            <div>
              <Link
                href="/"
                draggable={false}
                onDragStart={(e) => e.preventDefault()}
                className="text-[16px] sm:text-[17px] font-bold text-slate-900 dark:text-slate-100 tracking-tight hover:opacity-85 transition-opacity duration-150 ease-[cubic-bezier(0.4,0,0.2,1)] select-none"
              >
                {portfolioData.name.toLowerCase()}
              </Link>
              <p className="text-[14px] sm:text-[14.5px] text-slate-500 dark:text-slate-400 mt-1.5 leading-relaxed max-w-[280px]">
                {portfolioData.roleHeadline}
              </p>
            </div>
          </div>

          {/* Right Columns: Connect & Profiles */}
          <div className="sm:col-span-6 flex justify-start sm:justify-end gap-10 sm:gap-16">
            {/* Column 1: Connect */}
            <div>
              <h3 className="font-mono text-[12px] font-semibold uppercase tracking-wider text-slate-400 dark:text-slate-500 mb-3 select-none">
                Connect
              </h3>
              <ul className="space-y-2 text-[14px]">
                {SOCIAL_LINKS.map((item) => {
                  const Icon = item.icon;
                  return (
                    <li key={item.label}>
                      <a
                        href={item.href}
                        target="_blank"
                        rel="noopener noreferrer"
                        draggable={false}
                        onDragStart={(e) => e.preventDefault()}
                        onClick={() =>
                          trackContactClicked({
                            channel: item.channel,
                            location: 'footer_connect',
                            url: item.href,
                          })
                        }
                        className="group relative inline-flex items-center gap-1.5 text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white transition-colors duration-150 ease-[cubic-bezier(0.4,0,0.2,1)] py-1 select-none"
                      >
                        <Icon size={15} weight="regular" className="shrink-0 opacity-80 group-hover:opacity-100 transition-opacity duration-150 ease-[cubic-bezier(0.4,0,0.2,1)]" />
                        <span>{item.label}</span>
                        <span className="absolute -bottom-0.5 left-0 h-[1px] w-full bg-slate-900 dark:bg-slate-100 origin-left scale-x-0 group-hover:scale-x-100 transition-transform duration-200 ease-out" />
                      </a>
                    </li>
                  );
                })}
              </ul>
            </div>

            {/* Column 2: Profiles */}
            <div>
              <h3 className="font-mono text-[12px] font-semibold uppercase tracking-wider text-slate-400 dark:text-slate-500 mb-3 select-none">
                Profiles
              </h3>
              <ul className="space-y-2 text-[14px]">
                {PROFILE_LINKS.map((item) => (
                  <li key={item.label}>
                    <a
                      href={item.href}
                      target="_blank"
                      rel="noopener noreferrer"
                      draggable={false}
                      onDragStart={(e) => e.preventDefault()}
                      onClick={() => {
                        if (item.id === 'github') {
                          trackGithubClicked({
                            location: 'footer_profiles',
                            url: item.href,
                          });
                        } else if (item.id === 'leetcode') {
                          trackLeetcodeClicked({
                            location: 'footer_profiles',
                            url: item.href,
                          });
                        } else if (item.id === 'stratascratch') {
                          trackStratascratchClicked({
                            location: 'footer_profiles',
                            url: item.href,
                          });
                        }
                      }}
                      className="group relative inline-flex items-center text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white transition-colors duration-150 ease-[cubic-bezier(0.4,0,0.2,1)] py-1 select-none"
                    >
                      <span>{item.label}</span>
                      <span className="absolute -bottom-0.5 left-0 h-[1px] w-full bg-slate-900 dark:bg-slate-100 origin-left scale-x-0 group-hover:scale-x-100 transition-transform duration-200 ease-out" />
                    </a>
                  </li>
                ))}
              </ul>
            </div>
          </div>
        </div>

        {/* Subtle Bottom Row with Real-Time Clock */}
        <div className="border-t border-slate-100 dark:border-slate-800/80 pt-6 mt-10 sm:mt-12 flex flex-col sm:flex-row items-center justify-between gap-3 text-[13px] font-mono text-slate-400 dark:text-slate-500 text-center sm:text-left">
          <div className="flex items-center gap-2">
            <span>&copy; 2026 {portfolioData.name}</span>
            <span>·</span>
            <span>All rights reserved</span>
          </div>

          <div className="flex items-center gap-2">
            <LiveTimeDisplay />
            <span>·</span>
            <span>{portfolioData.location}</span>
          </div>
        </div>
      </div>
    </footer>
  );
}
