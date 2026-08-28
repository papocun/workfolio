/* ============================================================
   WORKFOLIO — Coding Profiles Data & Configuration
   Central source of truth for coding platform metadata & counts.
   ============================================================ */

export type CodingPlatformId = 'leetcode' | 'dailysql' | 'stratascratch';

export interface CodingProfileConfig {
  id: CodingPlatformId;
  platform: string;
  username: string;
  baselineSolvedCount: number;
  baselineStreak?: number;
  baselineRating?: number;
  unit: 'problems' | 'queries';
  url: string;
  imageSrc: string;
  imageAlt: string;
}

export const CODING_PROFILE_CONFIGS: Record<CodingPlatformId, CodingProfileConfig> = {
  leetcode: {
    id: 'leetcode',
    platform: 'LeetCode',
    username: '21_dvynshx',
    baselineSolvedCount: 122,
    baselineStreak: undefined,
    baselineRating: 1652,
    unit: 'problems',
    url: 'https://leetcode.com/u/21_dvynshx/',
    imageSrc: '/images/code/leetcode.png',
    imageAlt: 'LeetCode Avatar - 21_dvynshx',
  },
  dailysql: {
    id: 'dailysql',
    platform: 'DailySQL',
    username: 'divyanshutiwari281',
    baselineSolvedCount: 106,
    baselineStreak: 13, // Active verified running streak
    unit: 'queries',
    url: 'https://dailysql.in/u/divyanshutiwari281',
    imageSrc: '/images/code/dailysql.jpg',
    imageAlt: 'DailySQL Avatar - divyanshutiwari281',
  },
  stratascratch: {
    id: 'stratascratch',
    platform: 'StrataScratch',
    username: 'papocun',
    baselineSolvedCount: 52,
    baselineStreak: undefined,
    unit: 'problems',
    url: 'https://platform.stratascratch.com/user/papocun',
    imageSrc: '/images/code/stratascratch.jpg',
    imageAlt: 'StrataScratch Avatar - papocun',
  },
};

export const DEFAULT_PLATFORM_ORDER: Record<CodingPlatformId, number> = {
  leetcode: 0,
  dailysql: 1,
  stratascratch: 2,
};

export interface CodingProfileItem {
  id: CodingPlatformId;
  platform: string;
  username: string;
  solvedCount: string;
  streak?: number;
  rating?: number;
  url: string;
  imageSrc: string;
  imageAlt: string;
}

export function formatSolvedCount(count: number, unit: 'problems' | 'queries'): string {
  return `${count} ${unit} solved`;
}

/**
 * Sorts coding profiles by current active streak descending.
 * Ties are broken by the predefined stable default platform order.
 */
export function sortCodingProfilesByStreak(profiles: CodingProfileItem[]): CodingProfileItem[] {
  return [...profiles].sort((a, b) => {
    const streakA = typeof a.streak === 'number' && a.streak > 0 ? a.streak : 0;
    const streakB = typeof b.streak === 'number' && b.streak > 0 ? b.streak : 0;

    if (streakB !== streakA) {
      return streakB - streakA;
    }

    return (DEFAULT_PLATFORM_ORDER[a.id] ?? 0) - (DEFAULT_PLATFORM_ORDER[b.id] ?? 0);
  });
}

const rawProfiles: CodingProfileItem[] = [
  {
    id: 'leetcode',
    platform: CODING_PROFILE_CONFIGS.leetcode.platform,
    username: CODING_PROFILE_CONFIGS.leetcode.username,
    solvedCount: formatSolvedCount(
      CODING_PROFILE_CONFIGS.leetcode.baselineSolvedCount,
      CODING_PROFILE_CONFIGS.leetcode.unit
    ),
    streak: CODING_PROFILE_CONFIGS.leetcode.baselineStreak,
    rating: CODING_PROFILE_CONFIGS.leetcode.baselineRating,
    url: CODING_PROFILE_CONFIGS.leetcode.url,
    imageSrc: CODING_PROFILE_CONFIGS.leetcode.imageSrc,
    imageAlt: CODING_PROFILE_CONFIGS.leetcode.imageAlt,
  },
  {
    id: 'dailysql',
    platform: CODING_PROFILE_CONFIGS.dailysql.platform,
    username: CODING_PROFILE_CONFIGS.dailysql.username,
    solvedCount: formatSolvedCount(
      CODING_PROFILE_CONFIGS.dailysql.baselineSolvedCount,
      CODING_PROFILE_CONFIGS.dailysql.unit
    ),
    streak: CODING_PROFILE_CONFIGS.dailysql.baselineStreak,
    url: CODING_PROFILE_CONFIGS.dailysql.url,
    imageSrc: CODING_PROFILE_CONFIGS.dailysql.imageSrc,
    imageAlt: CODING_PROFILE_CONFIGS.dailysql.imageAlt,
  },
  {
    id: 'stratascratch',
    platform: CODING_PROFILE_CONFIGS.stratascratch.platform,
    username: CODING_PROFILE_CONFIGS.stratascratch.username,
    solvedCount: formatSolvedCount(
      CODING_PROFILE_CONFIGS.stratascratch.baselineSolvedCount,
      CODING_PROFILE_CONFIGS.stratascratch.unit
    ),
    streak: CODING_PROFILE_CONFIGS.stratascratch.baselineStreak,
    url: CODING_PROFILE_CONFIGS.stratascratch.url,
    imageSrc: CODING_PROFILE_CONFIGS.stratascratch.imageSrc,
    imageAlt: CODING_PROFILE_CONFIGS.stratascratch.imageAlt,
  },
];

export const INITIAL_CODING_PROFILES: CodingProfileItem[] = sortCodingProfilesByStreak(rawProfiles);
