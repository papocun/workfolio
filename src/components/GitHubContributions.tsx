'use client';

import React, { useEffect, useMemo, useState } from 'react';
import { ContributionHeatmap, HeatmapLegend, type ContributionDay as HeatDay } from '@/components/ContributionHeatmap';
import { getAssetPath } from '@/lib/assetPath';
import { HoverPreviewLink } from '@/components/ui/hover-preview-link';
import ProfilePreviewThumb from '@/components/ProfilePreviewThumb';
import type { GitHubContributionsApiResponse, GitHubContributionCalendar, ContributionDay } from '@/types/github';
import repoCommitsData from '@/data/repoCommits.json';

const REPO_COMMITS: Record<string, number> = repoCommitsData as Record<string, number>;

interface GitHubContributionsProps {
  username?: string;
  className?: string;
}



export default function GitHubContributions({
  username = 'papocun',
  className = '',
}: GitHubContributionsProps) {
  const [calendar, setCalendar] = useState<GitHubContributionCalendar | null>(null);
  const [effectiveUsername, setEffectiveUsername] = useState<string>(username);
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const [hasError, setHasError] = useState<boolean>(false);


  useEffect(() => {
    let isCancelled = false;

    async function loadData() {
      setIsLoading(true);
      setHasError(false);

      try {
        const endpoint = getAssetPath(`/api/github-contributions/?username=${encodeURIComponent(username)}`);
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
            const contributionsMap = new Map<string, number>();
            interface RawItem {
              date: string;
              count: number;
              level: number;
            }
            for (const item of (parsed.contributions as RawItem[])) {
              if (item.date && typeof item.count === 'number') {
                contributionsMap.set(item.date, item.count);
              }
            }

            for (const [date, count] of Object.entries(REPO_COMMITS)) {
              const cur = contributionsMap.get(date) || 0;
              if (count > cur) {
                contributionsMap.set(date, count);
              }
            }

            const now = new Date();
            const localYear = now.getFullYear();
            const localMonth = now.getMonth();
            const localDay = now.getDate();
            const todayDate = new Date(Date.UTC(localYear, localMonth, localDay));
            const todayIso = todayDate.toISOString().slice(0, 10);

            const endSaturday = new Date(todayDate);
            const dayOfWeek = endSaturday.getUTCDay();
            endSaturday.setUTCDate(endSaturday.getUTCDate() + (6 - dayOfWeek));

            const startSunday = new Date(endSaturday);
            startSunday.setUTCDate(startSunday.getUTCDate() - 370);

            const weeks = [];
            let curDays: ContributionDay[] = [];
            let total = 0;

            const walker = new Date(startSunday);
            for (let i = 0; i < 371; i++) {
              const iso = walker.toISOString().slice(0, 10);
              const isFuture = iso > todayIso;
              const count = isFuture ? 0 : (contributionsMap.get(iso) || 0);
              const weekday = walker.getUTCDay();

              total += count;

              let lvl: 0 | 1 | 2 | 3 | 4 = 0;
              if (count > 0 && count <= 2) lvl = 1;
              else if (count > 2 && count <= 5) lvl = 2;
              else if (count > 5 && count <= 9) lvl = 3;
              else if (count > 9) lvl = 4;

              curDays.push({
                date: iso,
                contributionCount: count,
                weekday,
                intensityLevel: lvl,
              });

              if (weekday === 6) {
                weeks.push({ contributionDays: curDays });
                curDays = [];
              }

              walker.setUTCDate(walker.getUTCDate() + 1);
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

  const days = useMemo<HeatDay[]>(
    () =>
      (calendar?.weeks ?? []).flatMap((w) =>
        w.contributionDays.map((d) => ({ date: d.date, count: d.contributionCount, level: d.intensityLevel }))
      ),
    [calendar]
  );

  if (isLoading) {
    return (
      <div className={`h-32 w-full animate-pulse rounded-lg bg-slate-200/40 dark:bg-[#16181C]/50 ${className}`} aria-busy="true" aria-label="Loading GitHub contributions" />
    );
  }

  if (hasError || !calendar) {
    return <p className={`text-[13px] text-slate-500 dark:text-[#71767B] ${className}`}>GitHub activity unavailable</p>;
  }

  return (
    <section className={`flex w-full max-w-full min-w-0 flex-col gap-3 ${className}`} aria-label="GitHub Contributions Heatmap">
      <p className="text-[13px] text-slate-500 dark:text-[#71767B]">
        <span className="font-semibold text-slate-900 dark:text-slate-100 tabular-nums">{calendar.totalContributions.toLocaleString()}</span>{' '}
        contributions in the last year on{' '}
        <HoverPreviewLink
          href={`https://github.com/${effectiveUsername}`}
          title={`${effectiveUsername} on GitHub`}
          domain="github.com"
          image={<ProfilePreviewThumb src={`https://github.com/${effectiveUsername}.png?size=128`} alt="" tint="#24292f" />}
          className="font-medium text-slate-900 dark:text-slate-100 underline decoration-slate-400/50 underline-offset-2 hover:decoration-current"
        >
          GitHub
        </HoverPreviewLink>
      </p>
      <ContributionHeatmap data={days} />
      <HeatmapLegend className="self-end" />
    </section>
  );
}
