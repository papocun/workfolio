import { NextResponse } from 'next/server';
import {
  CODING_PROFILE_CONFIGS,
  formatSolvedCount,
} from '@/data/codingProfiles';
import {
  calculateLeetCodeActiveStreak,
  calculateCurrentActiveStreak,
} from '@/lib/streakUtils';

export const revalidate = 3600; // Cache for 1 hour

export interface CodingStatsResponse {
  leetcode: {
    solvedCount: number;
    formatted: string;
    easy?: number;
    medium?: number;
    hard?: number;
    streak?: number;
    rating?: number;
  };
  dailysql: {
    solvedCount: number;
    formatted: string;
    easy?: number;
    medium?: number;
    advanced?: number;
    streak?: number;
  };
  stratascratch: {
    solvedCount: number;
    formatted: string;
    streak?: number;
  };
}

export async function GET() {
  const leetcodeConfig = CODING_PROFILE_CONFIGS.leetcode;
  const dailysqlConfig = CODING_PROFILE_CONFIGS.dailysql;
  const stratascratchConfig = CODING_PROFILE_CONFIGS.stratascratch;

  let leetcodeSolved = leetcodeConfig.baselineSolvedCount;
  let leetcodeEasy = 83;
  let leetcodeMedium = 37;
  let leetcodeHard = 2;
  let leetcodeStreak: number | undefined = leetcodeConfig.baselineStreak;
  let leetcodeRating: number | undefined = leetcodeConfig.baselineRating;

  let dailysqlSolved = dailysqlConfig.baselineSolvedCount;
  let dailysqlEasy = 55;
  let dailysqlMedium = 38;
  let dailysqlAdvanced = 13;
  let dailysqlStreak: number | undefined = dailysqlConfig.baselineStreak;

  let stratascratchSolved = stratascratchConfig.baselineSolvedCount;
  let stratascratchStreak: number | undefined = stratascratchConfig.baselineStreak;

  // 1. Fetch live LeetCode stats, current active streak, and contest rating
  try {
    const leetcodeQuery = {
      query: `
        query getUserProfile($username: String!) {
          userContestRanking(username: $username) {
            rating
          }
          matchedUser(username: $username) {
            userCalendar {
              submissionCalendar
            }
            submitStatsGlobal {
              acSubmissionNum {
                difficulty
                count
              }
            }
          }
        }
      `,
      variables: {
        username: leetcodeConfig.username,
      },
    };

    const res = await fetch('https://leetcode.com/graphql', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'User-Agent':
          'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36',
      },
      body: JSON.stringify(leetcodeQuery),
      next: { revalidate: 3600 },
    });

    if (res.ok) {
      const data = await res.json();
      const stats = data?.data?.matchedUser?.submitStatsGlobal?.acSubmissionNum;
      if (Array.isArray(stats)) {
        const all = stats.find((s: { difficulty: string }) => s.difficulty === 'All');
        const easy = stats.find((s: { difficulty: string }) => s.difficulty === 'Easy');
        const medium = stats.find((s: { difficulty: string }) => s.difficulty === 'Medium');
        const hard = stats.find((s: { difficulty: string }) => s.difficulty === 'Hard');

        if (all && typeof all.count === 'number' && all.count > 0) {
          leetcodeSolved = all.count;
          if (easy) leetcodeEasy = easy.count;
          if (medium) leetcodeMedium = medium.count;
          if (hard) leetcodeHard = hard.count;
        }
      }

      // Calculate the actual current active streak from the submission calendar
      const submissionCalendar = data?.data?.matchedUser?.userCalendar?.submissionCalendar;
      const activeStreak = calculateLeetCodeActiveStreak(submissionCalendar);
      leetcodeStreak = activeStreak > 0 ? activeStreak : undefined;

      // Check live rating
      const liveRating = data?.data?.userContestRanking?.rating;
      if (typeof liveRating === 'number' && liveRating > 0) {
        leetcodeRating = Math.round(liveRating);
      } else {
        leetcodeRating = undefined;
      }
    } else {
      // Fallback to public proxy if GraphQL is blocked
      const proxyRes = await fetch(
        `https://alfa-leetcode-api.onrender.com/userProfile/${leetcodeConfig.username}`,
        { next: { revalidate: 3600 } }
      );
      if (proxyRes.ok) {
        const proxyData = await proxyRes.json();
        if (typeof proxyData.totalSolved === 'number' && proxyData.totalSolved > 0) {
          leetcodeSolved = proxyData.totalSolved;
          if (proxyData.easySolved) leetcodeEasy = proxyData.easySolved;
          if (proxyData.mediumSolved) leetcodeMedium = proxyData.mediumSolved;
          if (proxyData.hardSolved) leetcodeHard = proxyData.hardSolved;
        }
      }

      const calRes = await fetch(
        `https://alfa-leetcode-api.onrender.com/userProfileCalendar/${leetcodeConfig.username}`,
        { next: { revalidate: 3600 } }
      );
      if (calRes.ok) {
        const calData = await calRes.json();
        const activeStreak = calculateLeetCodeActiveStreak(calData.submissionCalendar);
        leetcodeStreak = activeStreak > 0 ? activeStreak : undefined;
      }
    }
  } catch (error) {
    console.error('Error fetching live LeetCode stats:', error);
  }

  // 2. Fetch live DailySQL stats and active streak
  try {
    const res = await fetch(`https://dailysql.in/u/${dailysqlConfig.username}`, {
      headers: {
        'User-Agent':
          'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36',
      },
      next: { revalidate: 3600 },
    });

    if (res.ok) {
      const html = await res.text();
      const jsonMatch =
        html.match(/\\"total_solved\\":\s*(\d+)/) ||
        html.match(/"total_solved":\s*(\d+)/);
      const metaMatch = html.match(/(\d+)\s*(?:Problems|Queries)\s*Solved/i);

      if (jsonMatch && jsonMatch[1]) {
        dailysqlSolved = parseInt(jsonMatch[1], 10);
      } else if (metaMatch && metaMatch[1]) {
        dailysqlSolved = parseInt(metaMatch[1], 10);
      }

      // Check current_streak from profile payload
      const jsonStreakMatch =
        html.match(/\\"current_streak\\":\s*(\d+)/) ||
        html.match(/"current_streak":\s*(\d+)/);
      const metaStreakMatch = html.match(/(\d+)\s*Day\s*Streak/i);

      let parsedStreak = 0;
      if (jsonStreakMatch && jsonStreakMatch[1]) {
        parsedStreak = parseInt(jsonStreakMatch[1], 10);
      } else if (metaStreakMatch && metaStreakMatch[1]) {
        parsedStreak = parseInt(metaStreakMatch[1], 10);
      }

      // Verify active streak against recent submission timestamps in HTML
      const submissionDateMatches = Array.from(
        html.matchAll(/"created_at":\s*\\"([^\\"]+)\\"/g)
      ).concat(Array.from(html.matchAll(/"created_at":\s*"([^"]+)"/g)));

      if (submissionDateMatches.length > 0) {
        const submissionDates = submissionDateMatches
          .map((m) => m[1].split('T')[0])
          .filter(Boolean);

        const activeSubStreak = calculateCurrentActiveStreak(submissionDates);
        if (activeSubStreak > 0) {
          dailysqlStreak = Math.max(parsedStreak, activeSubStreak);
        } else {
          // Streak broken based on submissions
          dailysqlStreak = undefined;
        }
      } else if (parsedStreak > 0) {
        dailysqlStreak = parsedStreak;
      } else {
        dailysqlStreak = undefined;
      }

      // Check for breakdown stats
      const easyMatch = html.match(/\\"easy\\":\{\\"solved\\":\s*(\d+)/);
      const medMatch = html.match(/\\"medium\\":\{\\"solved\\":\s*(\d+)/);
      const advMatch = html.match(/\\"advanced\\":\{\\"solved\\":\s*(\d+)/);
      if (easyMatch) dailysqlEasy = parseInt(easyMatch[1], 10);
      if (medMatch) dailysqlMedium = parseInt(medMatch[1], 10);
      if (advMatch) dailysqlAdvanced = parseInt(advMatch[1], 10);
    }
  } catch (error) {
    console.error('Error fetching live DailySQL stats:', error);
  }

  const responseData: CodingStatsResponse = {
    leetcode: {
      solvedCount: leetcodeSolved,
      formatted: formatSolvedCount(leetcodeSolved, leetcodeConfig.unit),
      easy: leetcodeEasy,
      medium: leetcodeMedium,
      hard: leetcodeHard,
      streak: leetcodeStreak,
      rating: leetcodeRating,
    },
    dailysql: {
      solvedCount: dailysqlSolved,
      formatted: formatSolvedCount(dailysqlSolved, dailysqlConfig.unit),
      easy: dailysqlEasy,
      medium: dailysqlMedium,
      advanced: dailysqlAdvanced,
      streak: dailysqlStreak,
    },
    stratascratch: {
      solvedCount: stratascratchSolved,
      formatted: formatSolvedCount(stratascratchSolved, stratascratchConfig.unit),
      streak: stratascratchStreak,
    },
  };

  return NextResponse.json(responseData);
}
