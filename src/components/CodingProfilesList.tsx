'use client';

import React, { useState, useEffect } from 'react';
import Image from 'next/image';
import { getAssetPath } from '@/lib/assetPath';
import { trackLeetcodeClicked, trackStratascratchClicked } from '@/lib/posthog';
import {
  INITIAL_CODING_PROFILES,
  CODING_PROFILE_CONFIGS,
  formatSolvedCount,
  type CodingProfileItem,
} from '@/data/codingProfiles';

export type { CodingProfileItem } from '@/data/codingProfiles';
export const CODING_PROFILES: CodingProfileItem[] = INITIAL_CODING_PROFILES;

interface CachedStatsItem {
  formatted?: string;
  streak?: number;
  rating?: number;
}

// Session-level memory cache to avoid duplicate requests across component re-renders
let cachedStatsMap: Record<string, CachedStatsItem> | null = null;
let lastFetchTimestamp = 0;
const CACHE_TTL_MS = 5 * 60 * 1000; // 5 minutes

interface CodingProfilesListProps {
  profiles?: CodingProfileItem[];
}

export default function CodingProfilesList({
  profiles = INITIAL_CODING_PROFILES,
}: CodingProfilesListProps) {
  const [items, setItems] = useState<CodingProfileItem[]>(profiles);

  useEffect(() => {
    let isMounted = true;

    async function fetchLiveStats() {
      const now = Date.now();

      // Reuse cached stats if fresh
      if (cachedStatsMap && now - lastFetchTimestamp < CACHE_TTL_MS) {
        if (isMounted) {
          setItems((prev) =>
            prev.map((item) => {
              const cached = cachedStatsMap?.[item.id];
              if (!cached) return item;
              return {
                ...item,
                solvedCount: cached.formatted || item.solvedCount,
                streak: cached.streak !== undefined ? cached.streak : item.streak,
                rating: cached.rating !== undefined ? cached.rating : item.rating,
              };
            })
          );
        }
        return;
      }

      let updatedViaApi = false;

      // 1. Try internal API endpoint first (with basePath support)
      try {
        const apiEndpoint = getAssetPath('/api/coding-stats');
        const res = await fetch(apiEndpoint, { cache: 'no-cache' }).catch(() => null);

        if (res && res.ok) {
          const data = await res.json();
          const newMap: Record<string, CachedStatsItem> = {};

          if (data.leetcode) {
            newMap.leetcode = {
              formatted: data.leetcode.formatted,
              streak: data.leetcode.streak,
              rating: data.leetcode.rating,
            };
          }
          if (data.dailysql) {
            newMap.dailysql = {
              formatted: data.dailysql.formatted,
              streak: data.dailysql.streak,
            };
          }
          if (data.stratascratch) {
            newMap.stratascratch = {
              formatted: data.stratascratch.formatted,
              streak: data.stratascratch.streak,
            };
          }

          cachedStatsMap = { ...cachedStatsMap, ...newMap };
          lastFetchTimestamp = Date.now();
          updatedViaApi = true;

          if (isMounted) {
            setItems((prev) =>
              prev.map((item) => {
                const updated = newMap[item.id];
                if (!updated) return item;
                return {
                  ...item,
                  solvedCount: updated.formatted || item.solvedCount,
                  streak: updated.streak !== undefined ? updated.streak : item.streak,
                  rating: updated.rating !== undefined ? updated.rating : item.rating,
                };
              })
            );
          }
        }
      } catch {
        // Continue to client-side fallback if server endpoint is unavailable
      }

      // 2. Client-side fallback (for static hosting like GitHub Pages where /api/ is not running)
      if (!updatedViaApi) {
        try {
          const lcUsername = CODING_PROFILE_CONFIGS.leetcode.username;
          const lcRes = await fetch(
            `https://alfa-leetcode-api.onrender.com/userProfile/${lcUsername}`
          ).catch(() => null);

          if (lcRes && lcRes.ok && isMounted) {
            const lcData = await lcRes.json();
            if (typeof lcData.totalSolved === 'number' && lcData.totalSolved > 0) {
              const formatted = formatSolvedCount(
                lcData.totalSolved,
                CODING_PROFILE_CONFIGS.leetcode.unit
              );
              cachedStatsMap = {
                ...cachedStatsMap,
                leetcode: {
                  ...cachedStatsMap?.leetcode,
                  formatted,
                },
              };
              lastFetchTimestamp = Date.now();

              setItems((prev) =>
                prev.map((item) =>
                  item.id === 'leetcode' ? { ...item, solvedCount: formatted } : item
                )
              );
            }
          }
        } catch {
          // Gracefully maintain verified baseline state without broken UI
        }
      }
    }

    fetchLiveStats();

    return () => {
      isMounted = false;
    };
  }, []);

  return (
    <div className="flex w-full flex-col gap-4 sm:gap-5">
      {items.map((profile) => (
        <CodingProfileCard key={profile.id} profile={profile} />
      ))}
    </div>
  );
}

function CodingProfileCard({ profile }: { profile: CodingProfileItem }) {
  const [imageError, setImageError] = useState(false);

  const hasStreak = typeof profile.streak === 'number' && profile.streak > 0;
  const hasRating = typeof profile.rating === 'number' && profile.rating > 0;
  const showStatsRow = hasStreak || hasRating;

  return (
    <article className="group relative flex flex-col-reverse sm:flex-row items-stretch justify-between gap-4 sm:gap-6 overflow-hidden rounded-2xl border border-slate-200/90 dark:border-[#2F3336] bg-white dark:bg-[#16181C] p-4 sm:p-6 shadow-xs dark:shadow-md transition-all duration-200 ease-[cubic-bezier(0.4,0,0.2,1)] hover:border-slate-400 dark:hover:border-slate-700">
      {/* Left Column: Info & CTA */}
      <div className="flex flex-1 flex-row items-end justify-between gap-3 sm:flex-col sm:items-start sm:justify-between">
        <div className="flex-1 min-w-0">
          {/* Compact Stats Row: Streak & Rating (above username) */}
          {showStatsRow && (
            <div className="flex items-center gap-1.5 mb-2 flex-wrap">
              {hasStreak && (
                <span className="inline-flex items-center gap-1 rounded-full border border-amber-500/25 dark:border-amber-500/35 bg-amber-500/10 dark:bg-amber-500/15 px-2.5 py-0.5 font-mono text-[11px] font-semibold text-amber-800 dark:text-amber-300">
                  <span>{profile.streak}</span>
                  <span aria-hidden="true">🔥</span>
                </span>
              )}
              {hasRating && (
                <span className="inline-flex items-center gap-1 rounded-full border border-slate-200/90 dark:border-[#2F3336] bg-slate-100/90 dark:bg-[#1E2732] px-2.5 py-0.5 font-mono text-[11px] font-medium text-slate-700 dark:text-[#E7E9EA]">
                  <span>{profile.rating} rating</span>
                </span>
              )}
            </div>
          )}

          {/* Account / Username Tag */}
          <span className="font-mono text-[11.5px] sm:text-[12px] text-slate-500 dark:text-[#71767B]">
            @{profile.username}
          </span>

          {/* Platform Name */}
          <h2 className="text-[19px] sm:text-[22px] font-bold text-slate-900 dark:text-[#E7E9EA] tracking-tight leading-snug mt-0.5 truncate">
            {profile.platform}
          </h2>

          {/* Solved Problems Count */}
          <p className="text-[13px] sm:text-[13.5px] font-medium text-slate-600 dark:text-slate-400 mt-1">
            {profile.solvedCount}
          </p>
        </div>

        {/* Minimal Link CTA Button */}
        <div className="shrink-0 pt-0 sm:pt-3">
          <a
            href={profile.url}
            target="_blank"
            rel="noopener noreferrer"
            onClick={() => {
              if (profile.id === 'leetcode') {
                trackLeetcodeClicked({
                  location: 'coding_profiles_list',
                  url: profile.url,
                });
              } else if (profile.id === 'stratascratch') {
                trackStratascratchClicked({
                  location: 'coding_profiles_list',
                  url: profile.url,
                });
              }
            }}
            className="group/btn inline-flex items-center gap-1.5 rounded-full border border-slate-200/90 dark:border-[#2F3336] bg-slate-50 dark:bg-[#000000] px-3.5 py-1.5 text-[12px] font-mono font-medium text-slate-800 dark:text-[#E7E9EA] shadow-2xs transition-all duration-200 ease-[cubic-bezier(0.4,0,0.2,1)] hover:border-slate-900 dark:hover:border-slate-100 hover:bg-slate-100 dark:hover:bg-[#1E2732] active:scale-95 whitespace-nowrap"
          >
            <span>View Profile</span>
            <svg
              xmlns="http://www.w3.org/2000/svg"
              width="12"
              height="12"
              fill="currentColor"
              viewBox="0 0 256 256"
              className="translate-y-[0.5px] transition-transform duration-200 ease-out group-hover/btn:translate-x-0.5 shrink-0"
              aria-hidden="true"
            >
              <path d="M221.66,133.66l-72,72a8,8,0,0,1-11.32-11.32L196.69,136H40a8,8,0,0,1,0-16H196.69L138.34,61.66a8,8,0,0,1,11.32-11.32l72,72A8,8,0,0,1,221.66,133.66Z" />
            </svg>
          </a>
        </div>
      </div>

      {/* Right Column: Platform Image / Icon */}
      <div className="relative w-full sm:w-36 md:w-44 aspect-[16/9] sm:aspect-square rounded-xl overflow-hidden border border-slate-200/70 dark:border-slate-800 bg-slate-900 dark:bg-black/60 flex items-center justify-center shrink-0 select-none">
        {!imageError ? (
          <Image
            src={getAssetPath(profile.imageSrc)}
            alt={profile.imageAlt}
            fill
            sizes="(max-width: 640px) 100vw, 176px"
            onError={() => setImageError(true)}
            className="object-cover object-center transition-transform duration-250 ease-out group-hover:scale-[1.02]"
          />
        ) : (
          <div className="flex flex-col items-center justify-center text-center p-3 text-slate-400 dark:text-slate-500 font-mono text-[11px]">
            <span className="text-xl font-bold mb-1 text-slate-200 dark:text-slate-300">
              {profile.platform[0]}
            </span>
            <span>{profile.platform}</span>
          </div>
        )}
      </div>
    </article>
  );
}
