'use client';

import React from 'react';

interface ResumeButtonProps {
  href?: string;
  className?: string;
}

export default function ResumeButton({
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  href,
  className = '',
}: ResumeButtonProps) {
  return (
    <button
      type="button"
      disabled
      aria-disabled="true"
      title="Resume is currently locked"
      onClick={(e) => {
        e.preventDefault();
        e.stopPropagation();
      }}
      className={`group relative inline-flex h-8 items-center justify-center overflow-hidden rounded-full border border-slate-200 dark:border-slate-800 bg-white dark:bg-[#16181C] px-3.5 text-[12.5px] font-medium text-slate-800 dark:text-slate-200 transition-all duration-200 ease-[cubic-bezier(0.4,0,0.2,1)] cursor-not-allowed opacity-80 dark:opacity-75 shadow-2xs select-none ${className}`}
    >
      {/* Default Layer (Leaves on hover: ease-in) */}
      <span className="inline-flex items-center gap-1.5 transition-all duration-200 ease-in group-hover:-translate-y-8 group-hover:opacity-0">
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

      {/* Hover Slide-up Layer (Enters from bottom: ease-out) */}
      <div
        className="absolute inset-0 z-10 flex h-full w-full items-center justify-center gap-1.5 bg-slate-900 text-white dark:bg-slate-100 dark:text-slate-950 transition-all duration-250 ease-out translate-y-full opacity-0 group-hover:translate-y-0 group-hover:opacity-100"
        aria-hidden="true"
      >
        <span>resume</span>
        <svg
          xmlns="http://www.w3.org/2000/svg"
          width="12"
          height="12"
          fill="currentColor"
          viewBox="0 0 256 256"
          className="translate-y-[0.5px] group-hover:translate-x-0.5 transition-transform duration-200 ease-out"
        >
          <path d="M221.66,133.66l-72,72a8,8,0,0,1-11.32-11.32L196.69,136H40a8,8,0,0,1,0-16H196.69L138.34,61.66a8,8,0,0,1,11.32-11.32l72,72A8,8,0,0,1,221.66,133.66Z" />
        </svg>
      </div>
    </button>
  );
}
