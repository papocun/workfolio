'use client';

import React, { useEffect, useState, useMemo, useRef } from 'react';
import { getAssetPath } from '@/lib/assetPath';
import { CODING_PROFILE_CONFIGS } from '@/data/codingProfiles';
import type {
  LeetCodeContributionsApiResponse,
  LeetCodeContributionCalendar,
  LeetCodeContributionWeek,
  LeetCodeContributionMonth,
  LeetCodeContributionDay,
} from '@/types/leetcode';

interface LeetCodeContributionsProps {
  username?: string;
  className?: string;
}

interface ActiveTooltipData {
  dateStr: string;
  submissionsStr: string;
  accessibleText: string;
  x: number;
  y: number;
}

const MONTH_NAMES = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];
const DAY_LABELS = ['', 'Mon', '', 'Wed', '', 'Fri', ''];

function formatDateShort(isoDate: string): string {
  try {
    const [year, month, day] = isoDate.split('-').map(Number);
    const d = new Date(Date.UTC(year, month - 1, day));
    return `${MONTH_NAMES[d.getUTCMonth()]} ${d.getUTCDate()}, ${d.getUTCFullYear()}`;
  } catch {
    return isoDate;
  }
}

function formatDateLong(isoDate: string): string {
  try {
    const [year, month, day] = isoDate.split('-').map(Number);
    const d = new Date(Date.UTC(year, month - 1, day));
    const fullMonth = d.toLocaleDateString('en-US', { month: 'long', timeZone: 'UTC' });
    return `${fullMonth} ${d.getUTCDate()}, ${d.getUTCFullYear()}`;
  } catch {
    return isoDate;
  }
}

function getIntensityClass(level?: number): string {
  switch (level) {
    case 1:
      return 'bg-[#1D9BF0]/30 border border-[#1D9BF0]/40 dark:border-transparent';
    case 2:
      return 'bg-[#1D9BF0]/55 border border-[#1D9BF0]/60 dark:border-transparent';
    case 3:
      return 'bg-[#1D9BF0]/80 border border-[#1D9BF0]/85 dark:border-transparent';
    case 4:
      return 'bg-[#1D9BF0] border border-[#1D9BF0] shadow-[0_0_6px_rgba(29,155,240,0.4)]';
    case 0:
    default:
      return 'bg-slate-200/50 dark:bg-[#16181C] border border-slate-300/40 dark:border-[#2F3336]/60';
  }
}

function LeetCodeLogo({ className = 'w-4 h-4' }: { className?: string }) {
  return (
    <svg className={className} viewBox="0 0 24 24" fill="none" aria-hidden="true">
      <path
        d="M13.483 0a1.374 1.374 0 0 0-.961.438L7.116 6.226l-3.854 4.126a5.266 5.266 0 0 0-1.209 2.104 5.35 5.35 0 0 0-.125.513 5.527 5.527 0 0 0 .062 2.362 5.83 5.83 0 0 0 .349 1.017 5.938 5.938 0 0 0 4.818 3.665c.502.044.975-.087 1.442-.258a5.64 5.64 0 0 0 1.258-.694l3.856-3.693a1.373 1.373 0 0 0 .438-.962 1.374 1.374 0 0 0-.438-.962 1.375 1.375 0 0 0-1.923 0l-3.856 3.693a3.17 3.17 0 0 1-.722.399 3.013 3.013 0 0 1-.806.143 3.208 3.208 0 0 1-2.607-1.982 3.27 3.27 0 0 1-.194-.564 3.047 3.047 0 0 1-.035-1.299 2.92 2.92 0 0 1 .668-1.168l3.854-4.126 5.406-5.788a1.374 1.374 0 0 0 0-1.923A1.374 1.374 0 0 0 13.483 0z"
        fill="#1D9BF0"
      />
      <path
        d="M9.824 10.97a1.376 1.376 0 0 0-1.924 0L2.494 16.76a1.375 1.375 0 0 0 0 1.924 1.374 1.374 0 0 0 1.923 0l5.407-5.79a1.374 1.374 0 0 0 0-1.924z"
        className="fill-slate-800 dark:fill-white"
      />
      <path
        d="M17.48 14.308a1.375 1.375 0 0 0-1.924 0l-2.89 2.768a1.375 1.375 0 0 0 0 1.924 1.375 1.375 0 0 0 1.924 0l2.89-2.768a1.374 1.374 0 0 0 0-1.924z"
        fill="#1D9BF0"
      />
    </svg>
  );
}

function buildCalendarFromRaw(rawCalendar: unknown): LeetCodeContributionCalendar {
  let parsedCalendar: Record<string, number> = {};
  if (typeof rawCalendar === 'string') {
    try {
      parsedCalendar = JSON.parse(rawCalendar);
    } catch {
      parsedCalendar = {};
    }
  } else if (rawCalendar && typeof rawCalendar === 'object') {
    parsedCalendar = rawCalendar as Record<string, number>;
  }

  const submissionsMap = new Map<string, number>();
  const timestamps = Object.keys(parsedCalendar).map(Number).sort((a, b) => a - b);

  for (const ts of timestamps) {
    const count = Number(parsedCalendar[ts]) || 0;
    const dateStr = new Date(ts * 1000).toISOString().slice(0, 10);
    const prev = submissionsMap.get(dateStr) || 0;
    submissionsMap.set(dateStr, prev + count);
  }

  const today = new Date();
  const endSaturday = new Date(Date.UTC(today.getUTCFullYear(), today.getUTCMonth(), today.getUTCDate()));
  const currentUTCDay = endSaturday.getUTCDay();
  endSaturday.setUTCDate(endSaturday.getUTCDate() + (6 - currentUTCDay));

  const startSunday = new Date(endSaturday);
  startSunday.setUTCDate(startSunday.getUTCDate() - 370);

  const weeks: LeetCodeContributionWeek[] = [];
  const months: LeetCodeContributionMonth[] = [];
  let currentWeekDays: LeetCodeContributionDay[] = [];
  let lastMonth = -1;
  let totalInTrailingYear = 0;

  const walker = new Date(startSunday);
  for (let i = 0; i < 371; i++) {
    const isoDate = walker.toISOString().slice(0, 10);
    const count = submissionsMap.get(isoDate) || 0;
    const weekday = walker.getUTCDay();
    const monthIdx = walker.getUTCMonth();

    totalInTrailingYear += count;

    if (monthIdx !== lastMonth) {
      lastMonth = monthIdx;
      months.push({
        name: MONTH_NAMES[monthIdx],
        year: walker.getUTCFullYear(),
        firstDay: isoDate,
        totalWeeks: 1,
      });
    }

    currentWeekDays.push({
      date: isoDate,
      submissionCount: count,
      weekday,
      intensityLevel: count <= 0 ? 0 : count <= 2 ? 1 : count <= 5 ? 2 : count <= 9 ? 3 : 4,
    });

    if (weekday === 6 || i === 370) {
      weeks.push({ contributionDays: currentWeekDays });
      currentWeekDays = [];
    }

    walker.setUTCDate(walker.getUTCDate() + 1);
  }

  return {
    totalSubmissions: totalInTrailingYear,
    weeks,
    months,
  };
}

export default function LeetCodeContributions({
  username = CODING_PROFILE_CONFIGS.leetcode.username || '21_dvynshx',
  className = '',
}: LeetCodeContributionsProps) {
  const [calendar, setCalendar] = useState<LeetCodeContributionCalendar | null>(null);
  const [effectiveUsername, setEffectiveUsername] = useState<string>(username);
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const [hasError, setHasError] = useState<boolean>(false);
  const [tooltip, setTooltip] = useState<ActiveTooltipData | null>(null);

  const containerRef = useRef<HTMLDivElement>(null);
  const scrollRef = useRef<HTMLDivElement>(null);
  const isFetchingRef = useRef<boolean>(false);

  useEffect(() => {
    let isCancelled = false;

    async function loadData(isSilent = false) {
      if (isFetchingRef.current) return;
      isFetchingRef.current = true;

      if (!isSilent) {
        setIsLoading(true);
        setHasError(false);
      }

      try {
        // 1. Fetch from Next.js server API route (with trailing slash)
        const endpoint = getAssetPath(
          `/api/leetcode-contributions/?username=${encodeURIComponent(username)}&_t=${Date.now()}`
        );
        const res = await fetch(endpoint, { cache: 'no-cache' }).catch(() => null);

        if (res && res.ok) {
          const data: LeetCodeContributionsApiResponse = await res.json();
          if (data.success && data.calendar) {
            if (!isCancelled) {
              setCalendar(data.calendar);
              if (data.username) setEffectiveUsername(data.username);
              setIsLoading(false);
              setHasError(false);
            }
            isFetchingRef.current = false;
            return;
          }
        }

        // 2. Primary fallback: Alfa LeetCode API (high availability & CORS-enabled)
        try {
          const alfaEndpoint = `https://alfa-leetcode-api.onrender.com/${encodeURIComponent(username)}/calendar`;
          const alfaRes = await fetch(alfaEndpoint).catch(() => null);

          if (alfaRes && alfaRes.ok) {
            const alfaData = await alfaRes.json();
            if (alfaData && alfaData.submissionCalendar) {
              const builtCalendar = buildCalendarFromRaw(alfaData.submissionCalendar);
              if (!isCancelled) {
                setCalendar(builtCalendar);
                setEffectiveUsername(username);
                setIsLoading(false);
                setHasError(false);
              }
              isFetchingRef.current = false;
              return;
            }
          }
        } catch {
          // Proceed to tertiary fallback
        }

        // 3. Tertiary fallback: Public FaisalShohag proxy
        try {
          const publicEndpoint = `https://leetcode-api-faisalshohag.vercel.app/${encodeURIComponent(username)}`;
          const publicRes = await fetch(publicEndpoint).catch(() => null);

          if (publicRes && publicRes.ok) {
            const publicData = await publicRes.json();
            if (publicData && publicData.submissionCalendar) {
              const builtCalendar = buildCalendarFromRaw(publicData.submissionCalendar);
              if (!isCancelled) {
                setCalendar(builtCalendar);
                setEffectiveUsername(username);
                setIsLoading(false);
                setHasError(false);
              }
              isFetchingRef.current = false;
              return;
            }
          }
        } catch {
          // Fall through to error
        }

        throw new Error('Could not retrieve live LeetCode submissions');
      } catch {
        if (!isCancelled) {
          // If we already have a previous calendar loaded, keep it visible
          setHasError((prev) => (!calendar ? true : prev));
          setIsLoading(false);
        }
      } finally {
        isFetchingRef.current = false;
      }
    }

    // Initial load
    loadData(false);

    // Auto-update with time: periodic background poll every 60 seconds
    const interval = setInterval(() => {
      loadData(true);
    }, 60000);

    // Refresh immediately whenever user focuses back to the portfolio tab
    const handleFocus = () => {
      if (typeof document !== 'undefined' && document.visibilityState === 'visible') {
        loadData(true);
      }
    };

    window.addEventListener('focus', handleFocus);
    document.addEventListener('visibilitychange', handleFocus);

    return () => {
      isCancelled = true;
      clearInterval(interval);
      window.removeEventListener('focus', handleFocus);
      document.removeEventListener('visibilitychange', handleFocus);
    };
  }, [username]);

  // Compute month positions from actual week columns (matches GitHub calendar spacing)
  const monthLabels = useMemo(() => {
    if (!calendar || !calendar.weeks || calendar.weeks.length === 0) return [];

    const labels: Array<{ name: string; weekIndex: number }> = [];
    let lastMonth = -1;
    let lastWeekIdx = -99;

    calendar.weeks.forEach((week, wIdx) => {
      const firstDay = week.contributionDays[0];
      if (!firstDay) return;

      const dateObj = new Date(firstDay.date + 'T00:00:00Z');
      const mIdx = dateObj.getUTCMonth();

      if (mIdx !== lastMonth) {
        if (wIdx - lastWeekIdx >= 3) {
          labels.push({
            name: MONTH_NAMES[mIdx],
            weekIndex: wIdx,
          });
          lastWeekIdx = wIdx;
        }
        lastMonth = mIdx;
      }
    });

    return labels;
  }, [calendar]);

  const handleCellHover = (
    e: React.MouseEvent<HTMLDivElement> | React.FocusEvent<HTMLDivElement>,
    day: LeetCodeContributionDay
  ) => {
    if (!containerRef.current) return;
    const containerRect = containerRef.current.getBoundingClientRect();
    const cellRect = e.currentTarget.getBoundingClientRect();

    const dateShort = formatDateShort(day.date);
    const dateLong = formatDateLong(day.date);
    const count = day.submissionCount;
    const submissionsStr = `${count} submission${count === 1 ? '' : 's'}`;

    const x = cellRect.left - containerRect.left + cellRect.width / 2;
    const y = cellRect.top - containerRect.top;

    setTooltip({
      dateStr: dateShort,
      submissionsStr,
      accessibleText: `${dateLong}: ${submissionsStr}`,
      x,
      y,
    });
  };

  const handleCellLeave = () => {
    setTooltip(null);
  };

  // 1. Loading Skeleton State
  if (isLoading) {
    return (
      <div
        className={`w-full max-w-full min-w-0 rounded-xl border border-slate-200/70 dark:border-[#2F3336]/60 bg-white/40 dark:bg-[#16181C]/30 p-3.5 sm:p-4 transition-colors duration-200 ${className}`}
        aria-busy="true"
        aria-label="Loading LeetCode activity"
      >
        <div className="flex items-center justify-between mb-3">
          <div className="space-y-1">
            <div className="h-4 w-20 bg-slate-200 dark:bg-[#2F3336] rounded-md animate-pulse" />
            <div className="h-3 w-36 bg-slate-200/60 dark:bg-[#2F3336]/60 rounded-md animate-pulse" />
          </div>
          <div className="h-4 w-16 bg-slate-200 dark:bg-[#2F3336] rounded-full animate-pulse" />
        </div>
        <div className="h-24 w-full bg-slate-200/30 dark:bg-[#16181C]/50 rounded-lg animate-pulse" />
      </div>
    );
  }

  // 2. Error Fallback State
  if (hasError || !calendar) {
    return (
      <div
        className={`w-full rounded-xl border border-dashed border-slate-300 dark:border-[#2F3336] bg-slate-50/50 dark:bg-[#16181C]/20 p-3.5 sm:p-4 text-center transition-colors duration-200 ${className}`}
      >
        <div className="flex items-center justify-center gap-2 text-slate-500 dark:text-[#71767B] text-[13px]">
          <LeetCodeLogo className="w-4 h-4 opacity-70" />
          <span>LeetCode activity unavailable</span>
        </div>
      </div>
    );
  }

  const profileUrl = `https://leetcode.com/u/${effectiveUsername}/`;
  const totalWeeks = calendar.weeks.length;

  return (
    <section
      ref={containerRef}
      className={`relative w-full max-w-full min-w-0 rounded-xl border border-slate-200/80 dark:border-[#2F3336]/60 bg-white/70 dark:bg-[#16181C]/40 p-3.5 sm:p-4 shadow-xs transition-colors duration-200 ${className}`}
      aria-label="LeetCode Submissions Heatmap"
    >
      {/* Floating Tooltip matching exact prompt requirement:
          Line 1: Sep 4, 2026
          Line 2: 3 submissions (or 0 submissions) */}
      {tooltip && (
        <div
          role="tooltip"
          className="pointer-events-none absolute z-30 -translate-x-1/2 -translate-y-[calc(100%+8px)] rounded-md bg-slate-900 dark:bg-[#1E2732] px-2.5 py-1.5 text-center shadow-xl border border-slate-700/60 dark:border-[#2F3336] whitespace-nowrap transition-all duration-100"
          style={{
            left: `${tooltip.x}px`,
            top: `${tooltip.y}px`,
          }}
        >
          <div className="text-[10px] text-slate-300 dark:text-[#71767B] leading-tight">
            {tooltip.dateStr}
          </div>
          <div className="font-semibold text-[11px] text-white dark:text-[#E7E9EA] leading-snug mt-0.5">
            {tooltip.submissionsStr}
          </div>
          <div className="absolute left-1/2 -bottom-[4px] -translate-x-1/2 border-x-4 border-t-4 border-x-transparent border-t-slate-900 dark:border-t-[#1E2732]" />
        </div>
      )}

      {/* Header Section */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 mb-3">
        <div>
          <div className="flex items-center gap-2">
            <a
              href={profileUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-1.5 font-bold text-slate-900 dark:text-slate-100 hover:text-[#1D9BF0] dark:hover:text-[#1D9BF0] transition-colors text-[14px] sm:text-[15px] tracking-tight group"
            >
              <LeetCodeLogo className="w-4 h-4 transition-transform group-hover:scale-110" />
              <span>LeetCode</span>
            </a>
          </div>
          <p className="text-[12px] sm:text-[12.5px] text-slate-500 dark:text-[#71767B] mt-0.5">
            <span className="font-semibold text-slate-800 dark:text-slate-200">
              {calendar.totalSubmissions.toLocaleString()}
            </span>{' '}
            submissions in the last year
          </p>
        </div>

        {/* Legend */}
        <div className="flex items-center gap-1.5 text-[10.5px] sm:text-[11px] text-slate-400 dark:text-[#71767B] self-end sm:self-auto">
          <span>Less</span>
          <div className="flex items-center gap-1">
            <span className="w-2.5 h-2.5 rounded-[2px] bg-slate-200/50 dark:bg-[#16181C] border border-slate-300/40 dark:border-[#2F3336]/60" />
            <span className="w-2.5 h-2.5 rounded-[2px] bg-[#1D9BF0]/30" />
            <span className="w-2.5 h-2.5 rounded-[2px] bg-[#1D9BF0]/55" />
            <span className="w-2.5 h-2.5 rounded-[2px] bg-[#1D9BF0]/80" />
            <span className="w-2.5 h-2.5 rounded-[2px] bg-[#1D9BF0]" />
          </div>
          <span>More</span>
        </div>
      </div>

      {/* Heatmap Grid Container: fits desktop, horizontally scrollable on mobile */}
      <div
        ref={scrollRef}
        tabIndex={0}
        aria-label="Scrollable LeetCode submission heatmap"
        className="w-full max-w-full min-w-0 overflow-x-auto pb-0.5 outline-none focus-visible:ring-1 focus-visible:ring-[#1D9BF0]/50 rounded-lg [scrollbar-width:thin] scrollbar-thumb-slate-300/70 dark:scrollbar-thumb-[#2F3336]/70 [touch-action:pan-x]"
        style={{ WebkitOverflowScrolling: 'touch' }}
      >
        <div className="min-w-fit flex flex-col gap-1 select-none">
          {/* Month Labels Row aligned with week columns */}
          <div className="flex items-center text-[10px] text-slate-400 dark:text-[#71767B] pl-[26px]">
            <div
              className="relative h-3 text-[9.5px] sm:text-[10px]"
              style={{
                width: `calc(${totalWeeks} * 10.5px)`,
              }}
            >
              {monthLabels.map((m) => (
                <span
                  key={`${m.name}-${m.weekIndex}`}
                  className="absolute transform -translate-x-1 whitespace-nowrap"
                  style={{
                    left: `${m.weekIndex * 10.5}px`,
                  }}
                >
                  {m.name}
                </span>
              ))}
            </div>
          </div>

          {/* Days Grid Container (Labels + Week Columns) */}
          <div className="flex items-start gap-1">
            {/* Day of Week Row Labels (Mon, Wed, Fri) aligned to 7-day grid */}
            <div
              className="flex flex-col gap-[2px] text-[9px] text-slate-400 dark:text-[#71767B] w-[22px] select-none text-right pr-1"
              aria-hidden="true"
            >
              {DAY_LABELS.map((dayLabel, idx) => (
                <div key={idx} className="h-[8.5px] leading-[8.5px]">
                  {dayLabel}
                </div>
              ))}
            </div>

            {/* Weeks Columns */}
            <div
              role="grid"
              aria-label="LeetCode Activity"
              className="flex items-center gap-[2px]"
            >
              {calendar.weeks.map((week, wIdx) => (
                <div
                  key={wIdx}
                  role="row"
                  className="flex flex-col gap-[2px]"
                >
                  {week.contributionDays.map((day) => {
                    const accessibleLabel = `${formatDateLong(day.date)}: ${
                      day.submissionCount === 0
                        ? '0 submissions'
                        : `${day.submissionCount} submission${day.submissionCount === 1 ? '' : 's'}`
                    }`;

                    return (
                      <div
                        key={day.date}
                        role="gridcell"
                        tabIndex={0}
                        aria-label={accessibleLabel}
                        onMouseEnter={(e) => handleCellHover(e, day)}
                        onMouseLeave={handleCellLeave}
                        onFocus={(e) => handleCellHover(e, day)}
                        onBlur={handleCellLeave}
                        className={`w-[8.5px] h-[8.5px] rounded-[2px] cursor-pointer transition-transform duration-100 hover:scale-135 hover:z-20 focus-visible:scale-135 focus-visible:outline-hidden focus-visible:ring-1 focus-visible:ring-[#1D9BF0] ${getIntensityClass(
                          day.intensityLevel
                        )}`}
                      />
                    );
                  })}
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
