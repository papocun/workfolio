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
    baselineStreak: 12,
    unit: 'problems',
    url: 'https://leetcode.com/u/21_dvynshx/',
    imageSrc: '/images/code/leetcode.png',
    imageAlt: 'LeetCode Avatar - 21_dvynshx',
  },
  dailysql: {
    id: 'dailysql',
    platform: 'DailySQL',
    username: 'divyanshutiwari281',
    baselineSolvedCount: 105,
    baselineStreak: 13,
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
    unit: 'problems',
    url: 'https://platform.stratascratch.com/user/papocun',
    imageSrc: '/images/code/stratascratch.jpg',
    imageAlt: 'StrataScratch Avatar - papocun',
  },
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

export const INITIAL_CODING_PROFILES: CodingProfileItem[] = [
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
