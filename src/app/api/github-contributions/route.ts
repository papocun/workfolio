import { NextRequest, NextResponse } from 'next/server';
import type {
  GitHubContributionsApiResponse,
  GitHubContributionCalendar,
  ContributionWeek,
  ContributionDay,
  ContributionMonth,
} from '@/types/github';

import repoCommitsData from '@/data/repoCommits.json';

export const revalidate = 14400; // Cache for 4 hours (14400s)

const GITHUB_GRAPHQL_ENDPOINT = 'https://api.github.com/graphql';
const DEFAULT_PRIMARY_USERNAME = 'papocun';
const FALLBACK_USERNAME = 'papocun';
const REPO_COMMITS: Record<string, number> = repoCommitsData as Record<string, number>;

const CONTRIBUTION_QUERY = `
  query getContributionCalendar($login: String!) {
    user(login: $login) {
      contributionsCollection {
        contributionCalendar {
          totalContributions
          weeks {
            contributionDays {
              date
              contributionCount
              weekday
            }
          }
          months {
            name
            year
            firstDay
            totalWeeks
          }
        }
      }
    }
  }
`;

function calculateIntensity(count: number): 0 | 1 | 2 | 3 | 4 {
  if (count <= 0) return 0;
  if (count <= 2) return 1;
  if (count <= 5) return 2;
  if (count <= 9) return 3;
  return 4;
}

/**
 * Fetch contribution calendar from GitHub's official GraphQL API.
 * Server-only: GITHUB_TOKEN is kept strictly secret on the server.
 */
async function fetchFromGraphQL(username: string, token: string): Promise<GitHubContributionCalendar | null> {
  const res = await fetch(GITHUB_GRAPHQL_ENDPOINT, {
    method: 'POST',
    headers: {
      Authorization: `Bearer ${token}`,
      'Content-Type': 'application/json',
      'User-Agent': 'workfolio-portfolio',
    },
    body: JSON.stringify({
      query: CONTRIBUTION_QUERY,
      variables: { login: username },
    }),
    next: { revalidate: 14400 },
  });

  if (!res.ok) {
    return null;
  }

  const json = await res.json();
  const calendarData = json?.data?.user?.contributionsCollection?.contributionCalendar;

  if (!calendarData || !Array.isArray(calendarData.weeks)) {
    return null;
  }

  const weeks: ContributionWeek[] = calendarData.weeks.map(
    (w: { contributionDays: Array<{ date: string; contributionCount: number; weekday: number }> }) => ({
      contributionDays: (w.contributionDays || []).map((d) => ({
        date: d.date,
        contributionCount: d.contributionCount,
        weekday: d.weekday,
        intensityLevel: calculateIntensity(d.contributionCount),
      })),
    })
  );

  const months: ContributionMonth[] = (calendarData.months || []).map(
    (m: { name: string; year?: number; firstDay: string; totalWeeks: number }) => ({
      name: m.name,
      year: m.year,
      firstDay: m.firstDay,
      totalWeeks: m.totalWeeks,
    })
  );

  return {
    totalContributions: calendarData.totalContributions ?? 0,
    weeks,
    months,
  };
}

/**
 * Fallback to public GitHub contribution data if no GITHUB_TOKEN is configured in the environment.
 * Transforms public contribution data into the exact GitHub GraphQL contributionCalendar structure.
 */
async function fetchFromPublicEndpoint(username: string): Promise<GitHubContributionCalendar | null> {
  try {
    const res = await fetch(`https://github-contributions-api.jogruber.de/v4/${username}`, {
      headers: {
        'User-Agent': 'workfolio-portfolio',
      },
      next: { revalidate: 14400 },
    });

    if (!res.ok) {
      return null;
    }

    const data = await res.json();
    if (!data || !Array.isArray(data.contributions) || data.contributions.length === 0) {
      return null;
    }

    interface RawContribution {
      date: string;
      count: number;
      level: number;
    }

    const contributionsMap = new Map<string, number>();
    for (const item of data.contributions as RawContribution[]) {
      if (item.date && typeof item.count === 'number') {
        contributionsMap.set(item.date, item.count);
      }
    }

    // Merge genuine local repository commits into contributions map
    for (const [date, count] of Object.entries(REPO_COMMITS)) {
      const current = contributionsMap.get(date) || 0;
      if (count > current) {
        contributionsMap.set(date, count);
      }
    }

    // Determine calendar window: 53 full weeks (371 days) ending on the current week's Saturday
    const now = new Date();
    const localYear = now.getFullYear();
    const localMonth = now.getMonth();
    const localDay = now.getDate();
    const todayDate = new Date(Date.UTC(localYear, localMonth, localDay));
    const todayIso = todayDate.toISOString().slice(0, 10);

    const endSaturday = new Date(todayDate);
    const dayOfWeek = endSaturday.getUTCDay(); // 0 = Sun, 6 = Sat
    endSaturday.setUTCDate(endSaturday.getUTCDate() + (6 - dayOfWeek));

    const startSunday = new Date(endSaturday);
    startSunday.setUTCDate(startSunday.getUTCDate() - 370);

    const weeks: ContributionWeek[] = [];
    const months: ContributionMonth[] = [];
    let currentWeekDays: ContributionDay[] = [];
    const monthNames = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];
    let lastMonth = -1;
    let totalInTrailingYear = 0;

    const walker = new Date(startSunday);
    for (let i = 0; i < 371; i++) {
      const isoDate = walker.toISOString().slice(0, 10);
      const isFuture = isoDate > todayIso;
      const count = isFuture ? 0 : (contributionsMap.get(isoDate) || 0);
      const weekday = walker.getUTCDay();
      const monthIdx = walker.getUTCMonth();

      totalInTrailingYear += count;

      if (monthIdx !== lastMonth) {
        lastMonth = monthIdx;
        months.push({
          name: monthNames[monthIdx],
          year: walker.getUTCFullYear(),
          firstDay: isoDate,
          totalWeeks: 1,
        });
      }

      currentWeekDays.push({
        date: isoDate,
        contributionCount: count,
        weekday,
        intensityLevel: calculateIntensity(count),
      });

      if (weekday === 6) {
        weeks.push({ contributionDays: currentWeekDays });
        currentWeekDays = [];
      }

      walker.setUTCDate(walker.getUTCDate() + 1);
    }

    return {
      totalContributions: totalInTrailingYear,
      weeks,
      months,
    };
  } catch {
    return null;
  }
}

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const requestedUsername =
      searchParams.get('username') ||
      process.env.GITHUB_USERNAME ||
      DEFAULT_PRIMARY_USERNAME;

    const token = process.env.GITHUB_TOKEN || process.env.GH_TOKEN;
    let calendar: GitHubContributionCalendar | null = null;
    let effectiveUsername = requestedUsername;

    // 1. Try official GraphQL if server token is available
    if (token) {
      calendar = await fetchFromGraphQL(requestedUsername, token);
      
      // If primary username returned nothing, attempt fallback username (e.g. papocun)
      if (!calendar && requestedUsername !== FALLBACK_USERNAME) {
        calendar = await fetchFromGraphQL(FALLBACK_USERNAME, token);
        if (calendar) effectiveUsername = FALLBACK_USERNAME;
      }
    }

    // 2. If no token or GraphQL failed, safely fall back to public contributions data
    if (!calendar) {
      calendar = await fetchFromPublicEndpoint(requestedUsername);
      if (!calendar && requestedUsername !== FALLBACK_USERNAME) {
        calendar = await fetchFromPublicEndpoint(FALLBACK_USERNAME);
        if (calendar) effectiveUsername = FALLBACK_USERNAME;
      }
    }

    if (!calendar) {
      const errorResponse: GitHubContributionsApiResponse = {
        success: false,
        username: requestedUsername,
        error: 'Unable to retrieve GitHub contribution data',
      };
      return NextResponse.json(errorResponse, { status: 502 });
    }

    // Merge genuine local repository commits into calendar data
    let extraContributions = 0;
    const mergedWeeks = calendar.weeks.map((week) => ({
      contributionDays: week.contributionDays.map((day) => {
        const repoCount = REPO_COMMITS[day.date] || 0;
        if (repoCount > 0 && day.contributionCount < repoCount) {
          extraContributions += repoCount - day.contributionCount;
          return {
            ...day,
            contributionCount: repoCount,
            intensityLevel: calculateIntensity(repoCount),
          };
        }
        return day;
      }),
    }));

    calendar = {
      ...calendar,
      totalContributions: calendar.totalContributions + extraContributions,
      weeks: mergedWeeks,
    };

    const successResponse: GitHubContributionsApiResponse = {
      success: true,
      username: effectiveUsername,
      calendar,
    };

    return NextResponse.json(successResponse, {
      headers: {
        'Cache-Control': 'public, s-maxage=14400, stale-while-revalidate=86400',
      },
    });
  } catch (err: unknown) {
    const message = err instanceof Error ? err.message : 'Unknown server error';
    const response: GitHubContributionsApiResponse = {
      success: false,
      username: DEFAULT_PRIMARY_USERNAME,
      error: message,
    };
    return NextResponse.json(response, { status: 500 });
  }
}
