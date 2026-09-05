'use client';

import React, { useEffect, useState } from 'react';
import { Eye } from '@phosphor-icons/react';
import { fetchGlobalViews } from '@/lib/viewsClient';

// Module-level state: persists across Next.js client-side route transitions,
// but resets on actual browser document loads and page refreshes.
let hasCountedThisDocument = false;

function isDocumentRootLoad(): boolean {
  if (typeof window === 'undefined') return false;
  const path = window.location.pathname.replace(/\/$/, '');
  const basePath = (process.env.NEXT_PUBLIC_BASE_PATH || '').replace(/\/$/, '');
  return path === '' || path === '/' || path === basePath;
}

export default function ViewCounter() {
  const [views, setViews] = useState<number | null>(null);
  const [showTooltip, setShowTooltip] = useState(false);

  useEffect(() => {
    let isMounted = true;

    // A visit is counted (+1) ONLY when:
    // 1. The document load was a direct homepage visit or page refresh (isDocumentRootLoad())
    // 2. It has not already been counted within this browser document lifecycle (!hasCountedThisDocument)
    //
    // For internal Next.js client-side navigation (Home -> Projects -> Home),
    // hasCountedThisDocument remains true, so it only retrieves the current count without incrementing.
    if (!hasCountedThisDocument && isDocumentRootLoad()) {
      hasCountedThisDocument = true;
      fetchGlobalViews(true).then((count) => {
        if (isMounted && count !== null) {
          setViews(count);
        }
      });
    } else {
      fetchGlobalViews(false).then((count) => {
        if (isMounted && count !== null) {
          setViews(count);
        }
      });
    }

    return () => {
      isMounted = false;
    };
  }, []);

  const formattedViews = views !== null ? views.toLocaleString() : null;
  const tooltipText = 'Shows how many times this site has been visited';

  return (
    <div
      className="relative flex items-center gap-1.5 cursor-default group select-none focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-[#1D9BF0] rounded px-1 py-0.5 -mx-1 -my-0.5"
      tabIndex={0}
      role="status"
      aria-label={
        formattedViews
          ? `${formattedViews} views. ${tooltipText}`
          : `View counter. ${tooltipText}`
      }
      onMouseEnter={() => setShowTooltip(true)}
      onMouseLeave={() => setShowTooltip(false)}
      onFocus={() => setShowTooltip(true)}
      onBlur={() => setShowTooltip(false)}
    >
      <Eye
        size={15}
        weight="bold"
        className="text-[#1D9BF0] shrink-0"
        aria-hidden="true"
      />
      <span className="text-slate-700 dark:text-[#E7E9EA] font-medium min-w-[2ch]">
        {formattedViews !== null ? (
          formattedViews
        ) : (
          <span
            className="inline-block w-8 h-3.5 bg-slate-200 dark:bg-slate-800 rounded animate-pulse align-middle"
            aria-hidden="true"
          />
        )}
      </span>

      {/* Accessible subtle tooltip matching the portfolio design system */}
      {showTooltip && (
        <div
          role="tooltip"
          className="absolute bottom-full left-1/2 -translate-x-1/2 mb-2 px-2.5 py-1 text-[11px] leading-tight font-medium rounded-md shadow-lg pointer-events-none whitespace-nowrap z-50 bg-slate-900/90 dark:bg-[#1E2732]/95 text-white dark:text-[#E7E9EA] border border-slate-700/40 dark:border-slate-600/40 backdrop-blur-xs transition-opacity duration-150 animate-in fade-in zoom-in-95"
        >
          {tooltipText}
          <div className="absolute top-full left-1/2 -translate-x-1/2 -mt-[1px] border-4 border-transparent border-t-slate-900/90 dark:border-t-[#1E2732]/95" />
        </div>
      )}
    </div>
  );
}
