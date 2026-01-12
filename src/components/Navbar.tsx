'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { Avatar, AvatarImage, AvatarFallback } from '@/components/base-ui/avatar';
import { ScrollProgress } from '@/components/core/scroll-progress';
import { portfolioData } from '@/data/portfolioData';

const NAV_ITEMS = [
  { label: 'projects', href: '/projects', isUnderConstruction: false },
  { label: 'experience', href: '/experience', isUnderConstruction: false },
  { label: 'code', href: '/code', isUnderConstruction: true },
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
    <header className="sticky top-0 z-50 w-full bg-white/90 dark:bg-[#090d16]/90 backdrop-blur-sm border-b border-slate-200/50 dark:border-slate-800/60 transition-colors duration-200">
      <div className="max-w-[680px] mx-auto px-6 py-3.5 flex items-center justify-between">
        {/* Left Branding */}
        <Link
          className="text-[13.5px] sm:text-[14.5px] font-semibold text-slate-900 dark:text-slate-100 tracking-tight hover:opacity-75 transition-opacity"
          href="/"
        >
          divyanshu tiwari
        </Link>

        {/* Right Navigation & Profile Avatar */}
        <div className="flex items-center gap-3 sm:gap-4">
          <nav className="flex items-center gap-2 sm:gap-2.5 text-[12.5px]">
            {NAV_ITEMS.map((item, index) => {
              const isActive = pathname === item.href;

              return (
                <div key={item.href} className="flex items-center gap-2 sm:gap-2.5">
                  <Link
                    href={item.href}
                    className={`group relative inline-flex items-center gap-1 py-0.5 text-slate-500 dark:text-slate-400 transition-colors duration-150 ${
                      isActive
                        ? 'font-semibold text-slate-900 dark:text-slate-100'
                        : 'hover:text-slate-900 dark:hover:text-slate-100'
                    }`}
                  >
                    <span>{item.label}</span>
                    {item.isUnderConstruction && (
                      <span
                        className="inline-block w-1 h-1 rounded-full bg-slate-300 dark:bg-slate-600 group-hover:bg-amber-500 dark:group-hover:bg-amber-400 -translate-y-1 transition-colors"
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
                    <span className="text-slate-300 dark:text-slate-700 select-none" aria-hidden="true">
                      ·
                    </span>
                  )}
                </div>
              );
            })}
          </nav>

          {/* Vertical Divider */}
          <span className="h-4 w-[1px] bg-slate-200 dark:bg-slate-800" aria-hidden="true" />

          {/* User Profile Avatar (Non-redirecting) */}
          <Avatar className="h-7 w-7 sm:h-7.5 sm:w-7.5 ring-2 ring-slate-200/90 dark:ring-slate-700 select-none">
            <AvatarImage
              src="https://github.com/papocun.png"
              alt={portfolioData.name}
            />
            <AvatarFallback className="text-[10.5px] font-mono font-semibold">
              {getInitials(portfolioData.name)}
            </AvatarFallback>
          </Avatar>
        </div>
      </div>

      {/* Subtle Scroll Progress Indicator */}
      <div className="absolute bottom-0 left-0 w-full h-[1.5px] overflow-hidden">
        <ScrollProgress className="h-full bg-slate-900 dark:bg-slate-100" />
      </div>
    </header>
  );
}
