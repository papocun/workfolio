'use client';

import Link from 'next/link';
import { Avatar, AvatarImage, AvatarFallback } from '@/components/base-ui/avatar';
import { ScrollProgress } from '@/components/core/scroll-progress';
import { getAssetPath } from '@/lib/assetPath';
import { portfolioData } from '@/data/portfolioData';
import {
  Popover,
  PopoverButton,
  PopoverPanel,
} from '@/components/animate-ui/components/headless/popover';
import { SettingsContent } from '@/components/SettingsPopover';

const getInitials = (name: string) =>
  name
    .split(/\s+/)
    .map((word) => word.slice(0, 1))
    .join('');

export default function Navbar() {
  return (
    <header className="lg:hidden sticky top-0 z-50 w-full bg-[#FAF9F6]/85 dark:bg-[#000000]/90 backdrop-blur-md border-b border-slate-200/80 dark:border-slate-800/60 will-change-transform">
      <div className="max-w-[680px] w-full min-w-0 mx-auto px-2.5 min-[360px]:px-4 sm:px-6 py-2.5 sm:py-3.5 flex items-center justify-between gap-1 min-[360px]:gap-2">
        {/* Left: Avatar (settings) + Branding */}
        <div className="flex items-center gap-2 min-[360px]:gap-2.5 min-w-0">
          {/* Settings Trigger using existing circular header icon */}
          <Popover className="relative inline-flex items-center shrink-0">
            <PopoverButton
              aria-label="Open settings"
              className="group/avatar inline-flex items-center rounded-full transition-transform duration-200 ease-[cubic-bezier(0.16,1,0.3,1)] hover:scale-105 active:scale-[0.96] focus:outline-none focus-visible:ring-2 focus-visible:ring-[#1D9BF0] cursor-pointer shrink-0"
            >
              <Avatar className="h-6 w-6 sm:h-7.5 sm:w-7.5 ring-2 ring-slate-200/90 dark:ring-slate-700 group-hover/avatar:ring-[#1D9BF0]/60 dark:group-hover/avatar:ring-[#1D9BF0]/60 transition-[box-shadow,color] duration-200 ease-[cubic-bezier(0.16,1,0.3,1)] select-none cursor-pointer">
                <AvatarImage
                  src={getAssetPath('/images/projects/NUmercaiq.gif')}
                  alt={portfolioData.name}
                />
                <AvatarFallback className="text-[9px] sm:text-[10.5px] font-mono font-semibold">
                  {getInitials(portfolioData.name)}
                </AvatarFallback>
              </Avatar>
            </PopoverButton>

            <PopoverPanel
              anchor={{ to: 'bottom-start', gap: 8 }}
              className="w-[240px] sm:w-[260px] max-w-[calc(100vw-32px)] rounded-[22px] border border-slate-200/90 dark:border-[#2F3336] bg-white/95 dark:bg-[#16181C]/95 backdrop-blur-md shadow-[0px_0px_0px_1px_rgba(0,0,0,0.06),0px_1px_1px_-0.5px_rgba(0,0,0,0.06),0px_3px_3px_-1.5px_rgba(0,0,0,0.06),_0px_6px_6px_-3px_rgba(0,0,0,0.06),0px_12px_12px_-6px_rgba(0,0,0,0.06),0px_24px_24px_-12px_rgba(0,0,0,0.06)] p-3.5 sm:p-4 text-slate-800 dark:text-slate-100 select-none"
            >
              <SettingsContent />
            </PopoverPanel>
          </Popover>

        <Link
          className="py-1 -my-1 text-[13px] min-[360px]:text-[14px] sm:text-[15.5px] font-semibold text-slate-900 dark:text-slate-100 tracking-tight hover:opacity-75 transition-opacity duration-150 ease-[cubic-bezier(0.4,0,0.2,1)] shrink-0 select-none"
          href="/"
          draggable={false}
          onDragStart={(e) => e.preventDefault()}
        >
          divyanshu tiwari
        </Link>
        </div>
      </div>

      {/* Subtle Scroll Progress Indicator */}
      <div className="absolute bottom-0 left-0 w-full h-[1.5px] overflow-hidden">
        <ScrollProgress className="h-full bg-slate-900 dark:bg-slate-100" />
      </div>
    </header>
  );
}
