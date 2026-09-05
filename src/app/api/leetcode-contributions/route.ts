import { NextRequest, NextResponse } from 'next/server';
import type {
  LeetCodeContributionsApiResponse,
  LeetCodeContributionCalendar,
  LeetCodeContributionWeek,
  LeetCodeContributionDay,
  LeetCodeContributionMonth,
  LeetCodeDayActivity,
} from '@/types/leetcode';
import { CODING_PROFILE_CONFIGS } from '@/data/codingProfiles';

// Revalidate frequently (every 60s) so activity updates quickly with time
export const revalidate = 60;

const LEETCODE_GRAPHQL_ENDPOINT = 'https://leetcode.com/graphql';
const DEFAULT_LEETCODE_USERNAME = CODING_PROFILE_CONFIGS.leetcode.username || '21_dvynshx';

const LEETCODE_CALENDAR_QUERY = `
  query getUserCalendar($username: String!) {
    matchedUser(username: $username) {
      userCalendar {
        submissionCalendar
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
 * Generates trailing 53 weeks (Sunday to Saturday, 371 days)
 * aligned with the current date for the contribution calendar.
 */
function buildCalendarGrid(submissionsMap: Map<string, number>): {
  weeks: LeetCodeContributionWeek[];
  months: LeetCodeContributionMonth[];
  totalInTrailingYear: number;
} {
  const monthNames = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];
  const today = new Date();

  // End on the Saturday of the current week
  const endSaturday = new Date(Date.UTC(today.getUTCFullYear(), today.getUTCMonth(), today.getUTCDate()));
  const currentUTCDay = endSaturday.getUTCDay(); // 0 (Sun) to 6 (Sat)
  endSaturday.setUTCDate(endSaturday.getUTCDate() + (6 - currentUTCDay));

  // 53 weeks = 53 * 7 = 371 days
  // Start on Sunday 370 days before endSaturday
  const startSunday = new Date(endSaturday);
  startSunday.setUTCDate(startSunday.getUTCDate() - 370);

  const weeks: LeetCodeContributionWeek[] = [];
  const months: LeetCodeContributionMonth[] = [];
  let currentWeekDays: LeetCodeContributionDay[] = [];
  let lastMonth = -1;
  let totalInTrailingYear = 0;

  const walker = new Date(startSunday);
  for (let i = 0; i < 371; i++) {
    const isoDate = walker.toISOString().slice(0, 10);
    const count = submissionsMap.get(isoDate) || 0;
    const weekday = walker.getUTCDay();
    const monthIdx = walker.getUTCMonth();

    totalInTrailingYear += count;

    // Track start of new months for calendar headers
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
      submissionCount: count,
      weekday,
      intensityLevel: calculateIntensity(count),
    });

    // Saturday closes the current week column
    if (weekday === 6 || i === 370) {
      weeks.push({ contributionDays: currentWeekDays });
      currentWeekDays = [];
    }

    walker.setUTCDate(walker.getUTCDate() + 1);
  }

  return { weeks, months, totalInTrailingYear };
}

function parseCalendarData(rawCalendar: unknown): {
  submissionsMap: Map<string, number>;
  normalizedSubmissions: LeetCodeDayActivity[];
  allTimeTotal: number;
} {
  let parsedCalendar: Record<string, number> = {};
  if (typeof rawCalendar === 'string') {
    try {
      parsedCalendar = JSON.parse(rawCalendar);
    } catch {
      parsedCalendar = {};
    }
  } else if (rawCalendar && typeof rawCalendar === 'object') {
    parsedCalendar = rawCalendar as Record<string, number>;
  }

  const submissionsMap = new Map<string, number>();
  const normalizedSubmissions: LeetCodeDayActivity[] = [];
  const timestamps = Object.keys(parsedCalendar).map(Number).sort((a, b) => a - b);
  let allTimeTotal = 0;

  for (const ts of timestamps) {
    const count = Number(parsedCalendar[ts]) || 0;
    allTimeTotal += count;
    const dateStr = new Date(ts * 1000).toISOString().slice(0, 10);
    const prev = submissionsMap.get(dateStr) || 0;
    submissionsMap.set(dateStr, prev + count);
  }

  for (const [date, count] of submissionsMap.entries()) {
    normalizedSubmissions.push({ date, count });
  }
  normalizedSubmissions.sort((a, b) => a.date.localeCompare(b.date));

  return { submissionsMap, normalizedSubmissions, allTimeTotal };
}

export async function GET(request?: NextRequest) {
  try {
    let requestedUsername = DEFAULT_LEETCODE_USERNAME;
    if (request && request.url) {
      try {
        const { searchParams } = new URL(request.url);
        const qUsername = searchParams.get('username');
        if (qUsername) requestedUsername = qUsername;
      } catch {
        // Fallback to default
      }
    }

    if (!requestedUsername) {
      requestedUsername = process.env.LEETCODE_USERNAME || DEFAULT_LEETCODE_USERNAME;
    }

    let rawCalendar: unknown = null;

    // 1. Primary: Official LeetCode GraphQL with valid origin/referer
    try {
      const res = await fetch(LEETCODE_GRAPHQL_ENDPOINT, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'User-Agent':
            'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36',
          Referer: 'https://leetcode.com/',
          Origin: 'https://leetcode.com',
        },
        body: JSON.stringify({
          query: LEETCODE_CALENDAR_QUERY,
          variables: { username: requestedUsername },
        }),
        next: { revalidate: 60 },
      });

      if (res.ok) {
        const json = await res.json();
        rawCalendar = json?.data?.matchedUser?.userCalendar?.submissionCalendar;
      }
    } catch {
      // Proceed to fallback
    }

    // 2. Secondary Fallback: Alfa LeetCode API (high availability & CORS-enabled)
    if (!rawCalendar) {
      try {
        const alfaRes = await fetch(
          `https://alfa-leetcode-api.onrender.com/${encodeURIComponent(requestedUsername)}/calendar`,
          {
            headers: { 'User-Agent': 'workfolio-portfolio' },
            next: { revalidate: 60 },
          }
        );
        if (alfaRes.ok) {
          const alfaData = await alfaRes.json();
          rawCalendar = alfaData?.submissionCalendar;
        }
      } catch {
        // Proceed
      }
    }

    // 3. Tertiary Fallback: Public FaisalShohag proxy
    if (!rawCalendar) {
      try {
        const fallbackRes = await fetch(
          `https://leetcode-api-faisalshohag.vercel.app/${encodeURIComponent(requestedUsername)}`,
          {
            headers: { 'User-Agent': 'workfolio-portfolio' },
            next: { revalidate: 60 },
          }
        );
        if (fallbackRes.ok) {
          const fallbackData = await fallbackRes.json();
          rawCalendar = fallbackData?.submissionCalendar;
        }
      } catch {
        // Proceed
      }
    }

    if (!rawCalendar) {
      const errorResponse: LeetCodeContributionsApiResponse = {
        success: false,
        username: requestedUsername,
        error: 'Unable to retrieve live LeetCode calendar data',
      };
      return NextResponse.json(errorResponse, { status: 502 });
    }

    const { submissionsMap, normalizedSubmissions, allTimeTotal } = parseCalendarData(rawCalendar);
    const { weeks, months, totalInTrailingYear } = buildCalendarGrid(submissionsMap);

    const calendar: LeetCodeContributionCalendar = {
      totalSubmissions: totalInTrailingYear,
      weeks,
      months,
    };

    const successResponse: LeetCodeContributionsApiResponse = {
      success: true,
      username: requestedUsername,
      totalSubmissions: allTimeTotal,
      totalSubmissionsLastYear: totalInTrailingYear,
      submissions: normalizedSubmissions,
      calendar,
    };

    return NextResponse.json(successResponse, {
      headers: {
        'Cache-Control': 'public, s-maxage=60, stale-while-revalidate=300',
      },
    });
  } catch (err: unknown) {
    const message = err instanceof Error ? err.message : 'Unknown server error';
    const response: LeetCodeContributionsApiResponse = {
      success: false,
      username: DEFAULT_LEETCODE_USERNAME,
      error: message,
    };
    return NextResponse.json(response, { status: 500 });
  }
}
