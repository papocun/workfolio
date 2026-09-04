/* ============================================================
   WORKFOLIO — GitHub Contribution Types
   Strict type definitions for GitHub Contribution Calendar.
   ============================================================ */

export interface ContributionDay {
  date: string; // ISO string e.g. "2026-09-04"
  contributionCount: number;
  weekday: number; // 0 (Sunday) to 6 (Saturday)
  intensityLevel?: 0 | 1 | 2 | 3 | 4;
}

export interface ContributionWeek {
  contributionDays: ContributionDay[];
}

export interface ContributionMonth {
  name: string; // e.g. "Jan", "Feb"
  year?: number;
  firstDay: string;
  totalWeeks: number;
}

export interface GitHubContributionCalendar {
  totalContributions: number;
  weeks: ContributionWeek[];
  months: ContributionMonth[];
}

export interface GitHubContributionsApiResponse {
  success: boolean;
  username: string;
  calendar?: GitHubContributionCalendar;
  error?: string;
}
