'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
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

const NAV_ITEMS = [
  { label: 'projects', href: '/projects', isUnderConstruction: false },
  { label: 'experience', href: '/experience', isUnderConstruction: false },
  { label: 'code', href: '/code', isUnderConstruction: false },
  { label: 'blog', href: '/blog', isUnderConstruction: true },
];

const getInitials = (name: string) =>
  name
    .split(/\s+/)
    .map((word) => word.slice(0, 1))
    .join('');

export default function Navbar() {
  const pathname = usePathname();

  return (
    <header className="sticky top-0 z-50 w-full bg-[#FAF9F6]/85 dark:bg-[#000000]/90 backdrop-blur-md border-b border-slate-200/80 dark:border-slate-800/60">
      <div className="max-w-[680px] w-full min-w-0 mx-auto px-2.5 min-[360px]:px-4 sm:px-6 py-2.5 sm:py-3.5 flex items-center justify-between gap-1 min-[360px]:gap-2">
        {/* Left Branding */}
        <Link
          className="text-[13px] min-[360px]:text-[14px] sm:text-[15.5px] font-semibold text-slate-900 dark:text-slate-100 tracking-tight hover:opacity-75 transition-opacity duration-150 ease-[cubic-bezier(0.4,0,0.2,1)] shrink-0 select-none"
          href="/"
          draggable={false}
          onDragStart={(e) => e.preventDefault()}
        >
          divyanshu tiwari
        </Link>

        {/* Right Navigation & Profile Avatar */}
        <div className="flex items-center gap-1.5 min-[360px]:gap-2 sm:gap-4 shrink-0">
          <nav aria-label="Main navigation" className="flex items-center gap-1 min-[360px]:gap-1.5 sm:gap-2.5 text-[11.5px] min-[360px]:text-[13px] sm:text-[14px] select-none">
            {NAV_ITEMS.map((item, index) => {
              const isActive = pathname === item.href;

              return (
                <div key={item.href} className="flex items-center gap-1 min-[360px]:gap-1.5 sm:gap-2.5">
                  <Link
                    href={item.href}
                    draggable={false}
                    onDragStart={(e) => e.preventDefault()}
                    className={`group relative inline-flex items-center gap-0.5 sm:gap-1 py-1 px-0.5 text-slate-500 dark:text-slate-400 transition-colors duration-150 ease-[cubic-bezier(0.4,0,0.2,1)] select-none ${
                      isActive
                        ? 'font-semibold text-slate-900 dark:text-slate-100'
                        : 'hover:text-slate-900 dark:hover:text-slate-100'
                    }`}
                  >
                    <span>{item.label}</span>
                    {item.isUnderConstruction && (
                      <span
                        className="inline-block w-1 h-1 rounded-full bg-slate-300 dark:bg-slate-600 group-hover:bg-amber-500 dark:group-hover:bg-amber-400 -translate-y-1 transition-colors duration-150 ease-[cubic-bezier(0.4,0,0.2,1)]"
                        title="Under construction"
                      />
                    )}
                    <span
                      className={`absolute -bottom-0.5 left-0 h-[1.5px] w-full bg-slate-900 dark:bg-slate-100 origin-left transition-transform duration-200 ease-out ${
                        isActive
                          ? 'scale-x-100'
                          : 'scale-x-0 group-hover:scale-x-100'
                      }`}
                    />
                  </Link>
                  {index < NAV_ITEMS.length - 1 && (
                    <span className="text-slate-300 dark:text-slate-700 select-none text-[10px] sm:text-[11px]" aria-hidden="true">
                      ·
                    </span>
                  )}
                </div>
              );
            })}
          </nav>

          {/* Vertical Divider */}
          <span className="h-3.5 sm:h-4 w-[1px] bg-slate-200 dark:bg-slate-800" aria-hidden="true" />

          {/* Settings Trigger using existing circular header icon */}
          <Popover className="relative inline-flex items-center shrink-0">
            <PopoverButton
              aria-label="Open settings"
              className="group/avatar inline-flex items-center rounded-full transition-transform duration-200 ease-[cubic-bezier(0.4,0,0.2,1)] hover:scale-105 active:scale-95 focus:outline-none focus-visible:ring-2 focus-visible:ring-[#1D9BF0] cursor-pointer shrink-0"
            >
              <Avatar className="h-6 w-6 sm:h-7.5 sm:w-7.5 ring-2 ring-slate-200/90 dark:ring-slate-700 select-none cursor-pointer">
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
              anchor={{ to: 'bottom-end', gap: 8 }}
              className="w-[240px] sm:w-[260px] max-w-[calc(100vw-32px)] rounded-2xl border border-slate-200/90 dark:border-[#2F3336] bg-white/95 dark:bg-[#16181C]/95 backdrop-blur-md shadow-xl dark:shadow-2xl p-3.5 sm:p-4 text-slate-800 dark:text-slate-100 select-none"
            >
              <SettingsContent />
            </PopoverPanel>
          </Popover>
        </div>
      </div>

      {/* Subtle Scroll Progress Indicator */}
      <div className="absolute bottom-0 left-0 w-full h-[1.5px] overflow-hidden">
        <ScrollProgress className="h-full bg-slate-900 dark:bg-slate-100" />
      </div>
    </header>
  );
}
