/* ============================================================
   WORKFOLIO — LeetCode Contribution Types
   Strict type definitions for LeetCode Activity & Contribution Heatmap.
   ============================================================ */

export interface LeetCodeDayActivity {
  date: string; // ISO string e.g. "2026-09-04"
  count: number;
}

export interface LeetCodeContributionDay {
  date: string; // ISO string e.g. "2026-09-04"
  submissionCount: number;
  weekday: number; // 0 (Sunday) to 6 (Saturday)
  intensityLevel: 0 | 1 | 2 | 3 | 4;
}

export interface LeetCodeContributionWeek {
  contributionDays: LeetCodeContributionDay[];
}

export interface LeetCodeContributionMonth {
  name: string; // e.g. "Jan", "Feb"
  year?: number;
  firstDay: string;
  totalWeeks: number;
}

export interface LeetCodeContributionCalendar {
  totalSubmissions: number;
  weeks: LeetCodeContributionWeek[];
  months: LeetCodeContributionMonth[];
}

export interface LeetCodeContributionsApiResponse {
  success: boolean;
  username: string;
  totalSubmissions?: number;
  totalSubmissionsLastYear?: number;
  submissions?: LeetCodeDayActivity[];
  calendar?: LeetCodeContributionCalendar;
  error?: string;
}
