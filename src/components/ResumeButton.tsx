import React from 'react';
import { portfolioData } from '@/data/portfolioData';

interface ResumeButtonProps {
  href?: string;
  className?: string;
}

export default function ResumeButton({
  href = portfolioData.socials.resumeUrl,
  className = '',
}: ResumeButtonProps) {
  return (
    <a
      href={href}
      target="_blank"
      rel="noopener noreferrer"
      className={`group relative inline-flex h-8 items-center justify-center overflow-hidden rounded-full border border-slate-200 dark:border-slate-800 bg-white dark:bg-[#0f1422] px-3.5 text-[12.5px] font-medium text-slate-800 dark:text-slate-200 transition-all duration-300 hover:border-slate-900 dark:hover:border-slate-100 active:scale-[0.97] active:border-slate-900 dark:active:border-slate-100 shadow-2xs cursor-pointer select-none ${className}`}
    >
      {/* Default Layer (Slides up on hover / active) */}
      <span className="inline-flex items-center gap-1.5 transition-all duration-300 ease-out group-hover:-translate-y-8 group-hover:opacity-0 group-active:-translate-y-8 group-active:opacity-0">
        <span>resume</span>
        <svg
          xmlns="http://www.w3.org/2000/svg"
          width="12"
          height="12"
          fill="currentColor"
          viewBox="0 0 256 256"
          className="translate-y-[0.5px]"
          aria-hidden="true"
        >
          <path d="M221.66,133.66l-72,72a8,8,0,0,1-11.32-11.32L196.69,136H40a8,8,0,0,1,0-16H196.69L138.34,61.66a8,8,0,0,1,11.32-11.32l72,72A8,8,0,0,1,221.66,133.66Z" />
        </svg>
      </span>

      {/* Hover / Active Slide-up Layer (Enters from bottom) */}
      <div
        className="absolute inset-0 z-10 flex h-full w-full items-center justify-center gap-1.5 bg-slate-900 text-white dark:bg-slate-100 dark:text-slate-950 transition-all duration-300 ease-out translate-y-full opacity-0 group-hover:translate-y-0 group-hover:opacity-100 group-active:translate-y-0 group-active:opacity-100"
        aria-hidden="true"
      >
        <span>resume</span>
        <svg
          xmlns="http://www.w3.org/2000/svg"
          width="12"
          height="12"
          fill="currentColor"
          viewBox="0 0 256 256"
          className="translate-y-[0.5px] group-hover:translate-x-0.5 group-active:translate-x-0.5 transition-transform"
        >
          <path d="M221.66,133.66l-72,72a8,8,0,0,1-11.32-11.32L196.69,136H40a8,8,0,0,1,0-16H196.69L138.34,61.66a8,8,0,0,1,11.32-11.32l72,72A8,8,0,0,1,221.66,133.66Z" />
        </svg>
      </div>
    </a>
  );
}
