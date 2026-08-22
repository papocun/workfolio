'use client';

import React from 'react';
import { LockKey } from '@phosphor-icons/react';
import Link from 'next/link';
import AlertBanner from '@/components/ui/AlertBanner';

interface LockedPagePlaceholderProps {
  sectionLabel: string;
  pageTitle: string;
}

export default function LockedPagePlaceholder({
  sectionLabel,
  pageTitle,
}: LockedPagePlaceholderProps) {
  return (
    <main className="max-w-[680px] mx-auto px-4 sm:px-6 pt-6 sm:pt-10 pb-16 sm:pb-24 transition-colors duration-200">
      {/* Main Notice Banner with Simple, Human Language */}
      <AlertBanner
        title="Notice: Some pages are still being built"
        description="A few sections of my portfolio are still under construction. I’m updating them and will have them ready soon."
        variant="warning"
        dismissible={true}
        autoClose={true}
        autoCloseDuration={5000}
      />

      {/* Section Subtitle / Micro Indicator */}
      <div className="flex items-center justify-between mb-6 sm:mb-10">
        <span className="text-[11.5px] sm:text-[12px] font-mono text-slate-400 dark:text-slate-500 lowercase tracking-normal">
          // {sectionLabel}
        </span>
        <span className="inline-flex items-center gap-1.5 font-mono text-[10.5px] sm:text-[11px] text-amber-600 dark:text-amber-400 bg-amber-50 dark:bg-amber-950/40 border border-amber-200/60 dark:border-amber-800/50 px-2 py-0.5 rounded-full">
          <span className="w-1.5 h-1.5 rounded-full bg-amber-500" />
          <span>under construction</span>
        </span>
      </div>

      {/* Clean Minimal Locked Page Card */}
      <div className="w-full rounded-2xl border border-slate-200/90 dark:border-slate-800/90 bg-white dark:bg-[#16181C] p-6 sm:p-12 shadow-xs dark:shadow-xl transition-colors duration-200 ease-[cubic-bezier(0.4,0,0.2,1)] flex flex-col items-center text-center">
        {/* Subtle Lock Icon */}
        <div className="w-12 h-12 rounded-xl bg-slate-100 dark:bg-slate-800/90 border border-slate-200/80 dark:border-slate-700/80 flex items-center justify-center text-slate-600 dark:text-slate-300 mb-5 shadow-xs">
          <LockKey size={22} weight="regular" />
        </div>

        {/* Short Heading */}
        <h1 className="text-[20px] sm:text-[23px] font-bold text-slate-900 dark:text-slate-100 tracking-tight mb-2">
          This page is still being built
        </h1>

        {/* One Short Explanation */}
        <p className="text-[13.5px] sm:text-[14px] text-slate-500 dark:text-slate-400 max-w-[380px] leading-relaxed mb-6">
          I&apos;m working on this section right now. Check back soon.
        </p>

        {/* Simple Return Link */}
        <Link
          href="/"
          className="group relative inline-flex items-center gap-1.5 font-mono text-[12px] text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white transition-colors duration-150 ease-[cubic-bezier(0.4,0,0.2,1)] py-1 px-3 rounded-lg border border-slate-200/80 dark:border-slate-800 hover:border-slate-300 dark:hover:border-slate-700 bg-slate-50/50 dark:bg-slate-900/50"
        >
          <span>← return home</span>
        </Link>
      </div>
    </main>
  );
}
