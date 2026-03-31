import { NextRequest, NextResponse } from 'next/server';
import type {
  GitHubContributionsApiResponse,
  GitHubContributionCalendar,
  ContributionWeek,
  ContributionDay,
  ContributionMonth,
} from '@/types/github';

export const revalidate = 14400; // Cache for 4 hours (14400s)

const GITHUB_GRAPHQL_ENDPOINT = 'https://api.github.com/graphql';
const DEFAULT_PRIMARY_USERNAME = 'DIVYANSHU-TIWARI-281';
const FALLBACK_USERNAME = 'papocun';

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

    const todayStr = new Date().toISOString().split('T')[0];

    // Filter contributions up to today and sort chronologically
    const allPast = (data.contributions as RawContribution[])
      .filter((d) => d.date <= todayStr)
      .sort((a, b) => a.date.localeCompare(b.date));

    if (allPast.length === 0) {
      return null;
    }

    // GitHub's trailing 1-year window is up to 53 weeks (~371 days)
    const trailing = allPast.slice(-371);
    // Align start to Sunday (weekday 0)
    while (trailing.length > 0 && new Date(trailing[0].date + 'T00:00:00Z').getUTCDay() !== 0) {
      trailing.shift();
    }

    // Group days into weeks (Sunday to Saturday)
    const weeks: ContributionWeek[] = [];
    let currentWeekDays: ContributionDay[] = [];

    // Track month labels positioned at the start of their corresponding week
    const monthNames = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];
    const months: ContributionMonth[] = [];
    let lastMonth = -1;

    for (let i = 0; i < trailing.length; i++) {
      const item = trailing[i];
      const dateObj = new Date(item.date + 'T00:00:00Z');
      const weekday = dateObj.getUTCDay();
      const monthIdx = dateObj.getUTCMonth();

      // Check if we entered a new month on this day
      if (monthIdx !== lastMonth) {
        lastMonth = monthIdx;
        months.push({
          name: monthNames[monthIdx],
          year: dateObj.getUTCFullYear(),
          firstDay: item.date,
          totalWeeks: 1,
        });
      }

      currentWeekDays.push({
        date: item.date,
        contributionCount: item.count,
        weekday,
        intensityLevel: calculateIntensity(item.count),
      });

      // If Saturday or last item, finalize this week
      if (weekday === 6 || i === trailing.length - 1) {
        weeks.push({ contributionDays: currentWeekDays });
        currentWeekDays = [];
      }
    }

    // Calculate total contributions over the past year
    let totalInLastYear = 0;
    for (const week of weeks) {
      for (const day of week.contributionDays) {
        totalInLastYear += day.contributionCount;
      }
    }

    return {
      totalContributions: totalInLastYear,
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
