'use client';

import React, { useEffect, useMemo, useRef, useState } from 'react';
import { ContributionHeatmap, HeatmapLegend, type ContributionDay as HeatDay } from '@/components/ContributionHeatmap';
import { getAssetPath } from '@/lib/assetPath';
import { HoverPreviewLink } from '@/components/ui/hover-preview-link';
import ProfilePreviewThumb from '@/components/ProfilePreviewThumb';
import { CODING_PROFILE_CONFIGS } from '@/data/codingProfiles';
import type {
  LeetCodeContributionsApiResponse,
  LeetCodeContributionCalendar,
  LeetCodeContributionWeek,
  LeetCodeContributionMonth,
  LeetCodeContributionDay,
} from '@/types/leetcode';

// Contests attended outside what LeetCode's API reports.
const CONTEST_OFFSET = 6;

const MONTH_NAMES = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];

interface LeetCodeContributionsProps {
  username?: string;
  className?: string;
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
  const [rating, setRating] = useState<number | undefined>(CODING_PROFILE_CONFIGS.leetcode.baselineRating);
  const [contests, setContests] = useState<number | undefined>();
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const [hasError, setHasError] = useState<boolean>(false);

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

  useEffect(() => {
    let cancelled = false;
    const apply = (r?: number, c?: number) => {
      if (cancelled) return;
      if (typeof r === 'number' && r > 0) setRating(Math.round(r));
      if (typeof c === 'number') setContests(c + CONTEST_OFFSET);
    };

    async function loadContest() {
      // 1. Local API route (dev / server builds)
      try {
        const res = await fetch(getAssetPath('/api/coding-stats/'), { cache: 'no-cache' });
        if (res.ok) {
          const d = await res.json();
          if (typeof d?.leetcode?.contests === 'number') {
            apply(d.leetcode.rating, d.leetcode.contests);
            return;
          }
        }
      } catch {
        // fall through
      }
      // 2. CORS-enabled public API (static export)
      try {
        const res = await fetch(
          `https://alfa-leetcode-api.onrender.com/${encodeURIComponent(username)}/contest`
        );
        if (res.ok) {
          const d = await res.json();
          apply(d?.contestRating, d?.contestAttend);
        }
      } catch {
        // keep baseline rating
      }
    }

    loadContest();
    return () => {
      cancelled = true;
    };
  }, [username]);

  const days = useMemo<HeatDay[]>(
    () =>
      (calendar?.weeks ?? []).flatMap((w) =>
        w.contributionDays.map((d) => ({ date: d.date, count: d.submissionCount, level: d.intensityLevel }))
      ),
    [calendar]
  );

  if (isLoading) {
    return (
      <div className={`h-32 w-full animate-pulse rounded-lg bg-slate-200/40 dark:bg-[#16181C]/50 ${className}`} aria-busy="true" aria-label="Loading LeetCode submissions" />
    );
  }

  if (hasError || !calendar) {
    return <p className={`text-[13px] text-slate-500 dark:text-[#71767B] ${className}`}>LeetCode activity unavailable</p>;
  }

  return (
    <section className={`flex w-full max-w-full min-w-0 flex-col gap-3 ${className}`} aria-label="LeetCode Submissions Heatmap">
      <p className="text-[13px] text-slate-500 dark:text-[#71767B]">
        <span className="font-semibold text-slate-900 dark:text-slate-100 tabular-nums">{calendar.totalSubmissions.toLocaleString()}</span>{' '}
        submissions in the last year on{' '}
        <HoverPreviewLink
          href={`https://leetcode.com/u/${effectiveUsername}`}
          title={`${effectiveUsername} on LeetCode`}
          domain="leetcode.com"
          image={<ProfilePreviewThumb src={CODING_PROFILE_CONFIGS.leetcode.imageSrc} alt="" tint="#fff3e0" />}
          className="font-medium text-slate-900 dark:text-slate-100 underline decoration-slate-400/50 underline-offset-2 hover:decoration-current"
        >
          LeetCode
        </HoverPreviewLink>
        {typeof rating === 'number' && rating > 0 && (
          <>
            {' · '}Rating{' '}
            <span className="font-semibold text-slate-900 dark:text-slate-100 tabular-nums">{rating}</span>
          </>
        )}
        {typeof contests === 'number' && (
          <>
            {' · '}
            <span className="font-semibold text-slate-900 dark:text-slate-100 tabular-nums">{contests}</span> contests
          </>
        )}
      </p>
      <ContributionHeatmap data={days} />
      <HeatmapLegend className="self-end" />
    </section>
  );
}
