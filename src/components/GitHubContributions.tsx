'use client';

import React, { useEffect, useState, useMemo, useRef } from 'react';
import { getAssetPath } from '@/lib/assetPath';
import type { GitHubContributionsApiResponse, GitHubContributionCalendar, ContributionDay } from '@/types/github';

interface GitHubContributionsProps {
  username?: string;
  className?: string;
}

interface ActiveTooltipData {
  text: string;
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

export default function GitHubContributions({
  username = 'DIVYANSHU-TIWARI-281',
  className = '',
}: GitHubContributionsProps) {
  const [calendar, setCalendar] = useState<GitHubContributionCalendar | null>(null);
  const [effectiveUsername, setEffectiveUsername] = useState<string>(username);
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const [hasError, setHasError] = useState<boolean>(false);
  const [tooltip, setTooltip] = useState<ActiveTooltipData | null>(null);

  const containerRef = useRef<HTMLDivElement>(null);
  const scrollRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    let isCancelled = false;

    async function loadData() {
      setIsLoading(true);
      setHasError(false);

      try {
        const endpoint = getAssetPath(`/api/github-contributions?username=${encodeURIComponent(username)}`);
        const res = await fetch(endpoint, { cache: 'no-cache' }).catch(() => null);

        if (!res || !res.ok) {
          throw new Error('API route unavailable');
        }

        const data: GitHubContributionsApiResponse = await res.json();
        if (data.success && data.calendar) {
          if (!isCancelled) {
            setCalendar(data.calendar);
            if (data.username) setEffectiveUsername(data.username);
            setIsLoading(false);
          }
          return;
        }
        throw new Error(data.error || 'Failed to fetch contribution calendar');
      } catch {
        // Fallback: If local API endpoint failed (e.g. purely static export environment),
        // fetch directly from public fallback API client-side without crashing
        try {
          const publicRes = await fetch(
            `https://github-contributions-api.jogruber.de/v4/${encodeURIComponent(username)}`
          ).catch(() => null);

          let parsed = publicRes && publicRes.ok ? await publicRes.json() : null;

          // If primary user returned error or empty, try fallback papocun
          if ((!parsed || !Array.isArray(parsed.contributions)) && username !== 'papocun') {
            const fallbackRes = await fetch('https://github-contributions-api.jogruber.de/v4/papocun').catch(() => null);
            if (fallbackRes && fallbackRes.ok) {
              parsed = await fallbackRes.json();
              if (!isCancelled) setEffectiveUsername('papocun');
            }
          }

          if (parsed && Array.isArray(parsed.contributions) && parsed.contributions.length > 0) {
            const todayStr = new Date().toISOString().split('T')[0];
            interface RawItem {
              date: string;
              count: number;
              level: number;
            }
            const allPast = (parsed.contributions as RawItem[])
              .filter((d) => d.date <= todayStr)
              .sort((a, b) => a.date.localeCompare(b.date));

            const trailing = allPast.slice(-371);
            while (trailing.length > 0 && new Date(trailing[0].date + 'T00:00:00Z').getUTCDay() !== 0) {
              trailing.shift();
            }

            const weeks = [];
            let curDays: ContributionDay[] = [];
            for (let i = 0; i < trailing.length; i++) {
              const item = trailing[i];
              const dObj = new Date(item.date + 'T00:00:00Z');
              const wDay = dObj.getUTCDay();
              let lvl: 0 | 1 | 2 | 3 | 4 = 0;
              if (item.count > 0 && item.count <= 2) lvl = 1;
              else if (item.count > 2 && item.count <= 5) lvl = 2;
              else if (item.count > 5 && item.count <= 9) lvl = 3;
              else if (item.count > 9) lvl = 4;

              curDays.push({
                date: item.date,
                contributionCount: item.count,
                weekday: wDay,
                intensityLevel: lvl,
              });

              if (wDay === 6 || i === trailing.length - 1) {
                weeks.push({ contributionDays: curDays });
                curDays = [];
              }
            }

            let total = 0;
            for (const w of weeks) {
              for (const d of w.contributionDays) total += d.contributionCount;
            }

            if (!isCancelled) {
              setCalendar({
                totalContributions: total,
                weeks,
                months: [],
              });
              setIsLoading(false);
            }
            return;
          }
        } catch {
          // Ignored, proceed to set error state
        }

        if (!isCancelled) {
          setHasError(true);
          setIsLoading(false);
        }
      }
    }

    loadData();

    return () => {
      isCancelled = true;
    };
  }, [username]);

  // Compute month positions from actual week columns
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
    day: ContributionDay
  ) => {
    if (!containerRef.current) return;
    const containerRect = containerRef.current.getBoundingClientRect();
    const cellRect = e.currentTarget.getBoundingClientRect();

    const countText =
      day.contributionCount === 0
        ? 'No contributions'
        : `${day.contributionCount} contribution${day.contributionCount === 1 ? '' : 's'}`;

    const dateShort = formatDateShort(day.date);
    const dateLong = formatDateLong(day.date);

    const x = cellRect.left - containerRect.left + cellRect.width / 2;
    const y = cellRect.top - containerRect.top;

    setTooltip({
      text: `${countText} on ${dateShort}`,
      accessibleText: `${dateLong}: ${day.contributionCount} contribution${day.contributionCount === 1 ? '' : 's'}`,
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
        className={`w-full rounded-xl border border-slate-200/70 dark:border-[#2F3336]/60 bg-white/40 dark:bg-[#16181C]/30 p-3.5 sm:p-4 transition-colors duration-200 ${className}`}
        aria-busy="true"
        aria-label="Loading GitHub contributions"
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
          <svg className="w-4 h-4 opacity-70" viewBox="0 0 16 16" fill="currentColor" aria-hidden="true">
            <path d="M8 0C3.58 0 0 3.58 0 8c0 3.54 2.29 6.53 5.47 7.59.4.07.55-.17.55-.38 0-.19-.01-.82-.01-1.49-2.01.37-2.53-.49-2.69-.94-.09-.23-.48-.94-.82-1.13-.28-.15-.68-.52-.01-.53.63-.01 1.08.58 1.23.82.72 1.21 1.87.87 2.33.66.07-.52.28-.87.51-1.07-1.78-.2-3.64-.89-3.64-3.95 0-.87.31-1.59.82-2.15-.08-.2-.36-1.02.08-2.12 0 0 .67-.21 2.2.82.64-.18 1.32-.27 2-.27.68 0 1.36.09 2 .27 1.53-1.04 2.2-.82 2.2-.82.44 1.1.16 1.92.08 2.12.51.56.82 1.27.82 2.15 0 3.07-1.87 3.75-3.65 3.95.29.25.54.73.54 1.48 0 1.07-.01 1.93-.01 2.2 0 .21.15.46.55.38A8.013 8.013 0 0016 8c0-4.42-3.58-8-8-8z" />
          </svg>
          <span>GitHub activity unavailable</span>
        </div>
      </div>
    );
  }

  const profileUrl = `https://github.com/${effectiveUsername}`;
  const totalWeeks = calendar.weeks.length;

  return (
    <section
      ref={containerRef}
      className={`relative w-full rounded-xl border border-slate-200/80 dark:border-[#2F3336]/60 bg-white/70 dark:bg-[#16181C]/40 p-3.5 sm:p-4 shadow-xs transition-colors duration-200 ${className}`}
      aria-label="GitHub Contributions Heatmap"
    >
      {/* Floating Tooltip */}
      {tooltip && (
        <div
          role="tooltip"
          className="pointer-events-none absolute z-30 -translate-x-1/2 -translate-y-[calc(100%+8px)] rounded-md bg-slate-900 dark:bg-[#1E2732] px-2 py-1 text-[11px] font-medium tracking-tight text-white dark:text-[#E7E9EA] shadow-xl border border-slate-700/60 dark:border-[#2F3336] whitespace-nowrap transition-all duration-100"
          style={{
            left: `${tooltip.x}px`,
            top: `${tooltip.y}px`,
          }}
        >
          {tooltip.text}
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
              <svg className="w-4 h-4 fill-current transition-transform group-hover:scale-110" viewBox="0 0 16 16" aria-hidden="true">
                <path d="M8 0C3.58 0 0 3.58 0 8c0 3.54 2.29 6.53 5.47 7.59.4.07.55-.17.55-.38 0-.19-.01-.82-.01-1.49-2.01.37-2.53-.49-2.69-.94-.09-.23-.48-.94-.82-1.13-.28-.15-.68-.52-.01-.53.63-.01 1.08.58 1.23.82.72 1.21 1.87.87 2.33.66.07-.52.28-.87.51-1.07-1.78-.2-3.64-.89-3.64-3.95 0-.87.31-1.59.82-2.15-.08-.2-.36-1.02.08-2.12 0 0 .67-.21 2.2.82.64-.18 1.32-.27 2-.27.68 0 1.36.09 2 .27 1.53-1.04 2.2-.82 2.2-.82.44 1.1.16 1.92.08 2.12.51.56.82 1.27.82 2.15 0 3.07-1.87 3.75-3.65 3.95.29.25.54.73.54 1.48 0 1.07-.01 1.93-.01 2.2 0 .21.15.46.55.38A8.013 8.013 0 0016 8c0-4.42-3.58-8-8-8z" />
              </svg>
              <span>GitHub</span>
            </a>
          </div>
          <p className="text-[12px] sm:text-[12.5px] text-slate-500 dark:text-[#71767B] mt-0.5">
            <span className="font-semibold text-slate-800 dark:text-slate-200">
              {calendar.totalContributions.toLocaleString()}
            </span>{' '}
            contributions in the last year
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

      {/* Heatmap Grid container: fits naturally on desktop, scrollable on mobile */}
      <div
        ref={scrollRef}
        tabIndex={0}
        aria-label="Scrollable GitHub contribution heatmap"
        className="w-full overflow-x-auto pb-0.5 outline-none focus-visible:ring-1 focus-visible:ring-[#1D9BF0]/50 rounded-lg [scrollbar-width:thin] scrollbar-thumb-slate-300/70 dark:scrollbar-thumb-[#2F3336]/70"
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
            {/* Day of Week Row Labels (Mon, Wed, Fri) */}
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
              aria-label="Contribution Activity"
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
                      day.contributionCount === 0
                        ? 'No contributions'
                        : `${day.contributionCount} contribution${day.contributionCount === 1 ? '' : 's'}`
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
