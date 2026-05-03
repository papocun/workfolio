'use client';

import React, { useEffect, useState } from 'react';
import { Eye } from '@phosphor-icons/react';
import { fetchGlobalViews } from '@/lib/viewsClient';

import {
  Tooltip,
  TooltipContent,
  TooltipTrigger,
} from '@/components/animate-ui/components/animate/tooltip';

// Module-level state: persists across Next.js client-side route transitions,
// but resets on actual browser document loads and page refreshes.
let hasCountedThisDocument = false;

function isDocumentRootLoad(): boolean {
  if (typeof window === 'undefined') return false;
  const path = window.location.pathname.replace(/\/$/, '');
  const basePath = (process.env.NEXT_PUBLIC_BASE_PATH || '').replace(/\/$/, '');
  return path === '' || path === '/' || path === basePath;
}

interface ViewCounterProps {
  showTooltip?: boolean;
}

export default function ViewCounter({ showTooltip = false }: ViewCounterProps) {
  const [views, setViews] = useState<number | null>(null);

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

  const eyeIcon = (
    <Eye
      size={15}
      weight="bold"
      className="text-[#1D9BF0] shrink-0"
      aria-hidden="true"
    />
  );

  return (
    <div
      className="relative flex items-center gap-1.5 cursor-default group select-none rounded px-1 py-0.5 -mx-1 -my-0.5"
      role="status"
      aria-label={
        formattedViews
          ? `${formattedViews} views`
          : 'View counter'
      }
    >
      {showTooltip ? (
        <Tooltip side="top">
          <TooltipTrigger asChild>
            <span
              className="inline-flex items-center justify-center cursor-default focus:outline-none focus-visible:ring-1 focus-visible:ring-[#1D9BF0] rounded p-0.5 -m-0.5"
              tabIndex={0}
              role="img"
              aria-label="Views"
            >
              {eyeIcon}
            </span>
          </TooltipTrigger>
          <TooltipContent>
            <p>Views</p>
          </TooltipContent>
        </Tooltip>
      ) : (
        eyeIcon
      )}

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
    </div>
  );
}
