'use client';

import React from 'react';
import Link from 'next/link';
import { portfolioData } from '@/data/portfolioData';
import { RelativeTime } from '@/components/ui/relative-time';
import { BinaryYear } from '@/components/ui/binary-year';

// Fixed at build time (same source as the "Last updated" label), so server and client agree.
const BUILD_YEAR = new Date(process.env.NEXT_PUBLIC_BUILD_TIME ?? Date.now()).getFullYear();

export default function Footer() {
  return (
    <footer className="w-full max-w-full min-w-0 border-t border-slate-200/80 dark:border-slate-800/80 bg-[#FAF9F6] dark:bg-[#000000] text-slate-600 dark:text-slate-400 mt-4 sm:mt-6 transition-colors duration-200 ease-[cubic-bezier(0.4,0,0.2,1)]">
      <div className="max-w-[680px] w-full min-w-0 mx-auto px-4 sm:px-6 pt-10 sm:pt-14 pb-8 sm:pb-12">
        {/* Identity */}
        <div>
          <Link
            href="/"
            draggable={false}
            onDragStart={(e) => e.preventDefault()}
            className="inline-block py-1 -my-1 text-[16px] sm:text-[17px] font-bold text-slate-900 dark:text-slate-100 tracking-tight hover:opacity-85 transition-opacity duration-150 ease-[cubic-bezier(0.4,0,0.2,1)] select-none"
          >
            {portfolioData.name.split(' ')[0].toUpperCase()}
          </Link>
          <p className="text-[14px] sm:text-[14.5px] text-slate-500 dark:text-slate-400 mt-1.5 leading-relaxed max-w-[280px]">
            {portfolioData.roleHeadline}
          </p>
        </div>

        {/* Last updated */}
        <div className="border-t border-slate-100 dark:border-slate-800/80 pt-6 mt-10 sm:mt-12 flex flex-wrap items-center justify-between gap-x-3 gap-y-1 text-[12.5px] sm:text-[13px] font-mono text-slate-400 dark:text-slate-500">
          <div>
            <span>Last updated </span>
            <RelativeTime date={process.env.NEXT_PUBLIC_BUILD_TIME ?? null} />
          </div>
          <BinaryYear year={BUILD_YEAR} className="-mr-2" />
        </div>
      </div>
    </footer>
  );
}
