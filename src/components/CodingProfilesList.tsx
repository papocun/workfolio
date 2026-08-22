'use client';

import React, { useState, useEffect } from 'react';
import Image from 'next/image';
import { getAssetPath } from '@/lib/assetPath';
import { trackLeetcodeClicked, trackStratascratchClicked } from '@/lib/posthog';

export interface CodingProfileItem {
  id: 'leetcode' | 'dailysql' | 'stratascratch';
  platform: string;
  username: string;
  solvedCount: string;
  url: string;
  imageSrc: string;
  imageAlt: string;
}

// Verified baseline profile data from actual live profiles
export const CODING_PROFILES: CodingProfileItem[] = [
  {
    id: 'leetcode',
    platform: 'LeetCode',
    username: '21_dvynshx',
    solvedCount: '122 problems solved',
    url: 'https://leetcode.com/u/21_dvynshx/',
    imageSrc: '/images/code/leetcode.png',
    imageAlt: 'LeetCode Avatar - 21_dvynshx',
  },
  {
    id: 'dailysql',
    platform: 'DailySQL',
    username: 'divyanshutiwari281',
    solvedCount: '104 queries solved',
    url: 'https://dailysql.in/u/divyanshutiwari281',
    imageSrc: '/images/code/dailysql.jpg',
    imageAlt: 'DailySQL Avatar - divyanshutiwari281',
  },
  {
    id: 'stratascratch',
    platform: 'StrataScratch',
    username: 'papocun',
    solvedCount: '52 problems solved',
    url: 'https://platform.stratascratch.com/user/papocun',
    imageSrc: '/images/code/stratascratch.jpg',
    imageAlt: 'StrataScratch Avatar - papocun',
  },
];

interface CodingProfilesListProps {
  profiles?: CodingProfileItem[];
}

export default function CodingProfilesList({
  profiles = CODING_PROFILES,
}: CodingProfilesListProps) {
  const [items, setItems] = useState<CodingProfileItem[]>(profiles);

  useEffect(() => {
    // Dynamic refresh from real profile data endpoint
    let isMounted = true;
    async function fetchLiveStats() {
      try {
        const res = await fetch('/api/coding-stats');
        if (res.ok && isMounted) {
          const data = await res.json();
          setItems((prev) =>
            prev.map((item) => {
              if (item.id === 'leetcode' && data.leetcode?.formatted) {
                return { ...item, solvedCount: data.leetcode.formatted };
              }
              if (item.id === 'dailysql' && data.dailysql?.formatted) {
                return { ...item, solvedCount: data.dailysql.formatted };
              }
              if (item.id === 'stratascratch' && data.stratascratch?.formatted) {
                return { ...item, solvedCount: data.stratascratch.formatted };
              }
              return item;
            })
          );
        }
      } catch (err) {
        // Keeps verified baseline data if network fails
        console.error('Error loading live coding stats:', err);
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

  return (
    <article className="group relative flex flex-col-reverse sm:flex-row items-stretch justify-between gap-4 sm:gap-6 overflow-hidden rounded-2xl border border-slate-200/90 dark:border-[#2F3336] bg-white dark:bg-[#16181C] p-4 sm:p-6 shadow-xs dark:shadow-md transition-all duration-200 ease-[cubic-bezier(0.4,0,0.2,1)] hover:border-slate-400 dark:hover:border-slate-700">
      {/* Left Column: Info & CTA */}
      <div className="flex flex-1 flex-row items-end justify-between gap-3 sm:flex-col sm:items-start sm:justify-between">
        <div className="flex-1 min-w-0">
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
