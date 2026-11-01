'use client';

import React, { useEffect, useMemo, useState } from 'react';
import { ContributionHeatmap, HeatmapLegend, type ContributionDay } from '@/components/ContributionHeatmap';
import { getAssetPath } from '@/lib/assetPath';
import { HoverPreviewLink } from '@/components/ui/hover-preview-link';
import ProfilePreviewThumb from '@/components/ProfilePreviewThumb';
import { CODING_PROFILE_CONFIGS } from '@/data/codingProfiles';

interface Props {
  username?: string;
  className?: string;
}

// 53 weeks, Sunday-first, ending on this week's Saturday (matches the other heatmaps).
function buildYear(map: Record<string, number>): ContributionDay[] {
  const t = new Date();
  const end = new Date(Date.UTC(t.getUTCFullYear(), t.getUTCMonth(), t.getUTCDate()));
  end.setUTCDate(end.getUTCDate() + (6 - end.getUTCDay()));
  const todayIso = t.toISOString().slice(0, 10);
  const walker = new Date(end);
  walker.setUTCDate(walker.getUTCDate() - 370);
  const out: ContributionDay[] = [];
  for (let i = 0; i < 371; i++) {
    const iso = walker.toISOString().slice(0, 10);
    out.push({ date: iso, count: iso > todayIso ? 0 : map[iso] || 0 });
    walker.setUTCDate(walker.getUTCDate() + 1);
  }
  return out;
}

export default function DailySQLContributions({
  username = CODING_PROFILE_CONFIGS.dailysql.username,
  className = '',
}: Props) {
  const [heatmap, setHeatmap] = useState<Record<string, number> | null>(null);
  const [totalSolved, setTotalSolved] = useState<number | undefined>();
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    let cancelled = false;
    fetch(getAssetPath('/api/dailysql-contributions/'))
      .then((r) => (r.ok ? r.json() : null))
      .then((d) => {
        if (cancelled) return;
        if (d?.success && d.heatmap) {
          setHeatmap(d.heatmap);
          setTotalSolved(d.totalSolved);
        }
        setIsLoading(false);
      })
      .catch(() => !cancelled && setIsLoading(false));
    return () => {
      cancelled = true;
    };
  }, [username]);

  const days = useMemo(() => (heatmap ? buildYear(heatmap) : []), [heatmap]);
  const yearTotal = useMemo(() => days.reduce((s, d) => s + d.count, 0), [days]);

  if (isLoading) {
    return <div className={`h-32 w-full animate-pulse rounded-lg bg-slate-200/40 dark:bg-[#16181C]/50 ${className}`} aria-busy="true" aria-label="Loading DailySQL submissions" />;
  }
  if (!heatmap) {
    return <p className={`text-[13px] text-slate-500 dark:text-[#71767B] ${className}`}>DailySQL activity unavailable</p>;
  }

  const strong = 'font-semibold text-slate-900 dark:text-slate-100 tabular-nums';
  return (
    <section className={`flex w-full max-w-full min-w-0 flex-col gap-3 ${className}`} aria-label="DailySQL Submissions Heatmap">
      <p className="text-[13px] text-slate-500 dark:text-[#71767B]">
        <span className={strong}>{yearTotal.toLocaleString()}</span> submissions in the last year on{' '}
        <HoverPreviewLink
          href={CODING_PROFILE_CONFIGS.dailysql.url}
          title={`${username} on DailySQL`}
          domain="dailysql.in"
          image={<ProfilePreviewThumb src={CODING_PROFILE_CONFIGS.dailysql.imageSrc} alt="" tint="#e0f2fe" />}
          className="font-medium text-slate-900 dark:text-slate-100 underline decoration-slate-400/50 underline-offset-2 hover:decoration-current"
        >
          DailySQL
        </HoverPreviewLink>
        {typeof totalSolved === 'number' && (
          <>
            {' · '}
            <span className={strong}>{totalSolved}</span> solved
          </>
        )}
      </p>
      <ContributionHeatmap data={days} />
      <HeatmapLegend className="self-end" />
    </section>
  );
}
