import { NextResponse } from 'next/server';
import {
  CODING_PROFILE_CONFIGS,
  formatSolvedCount,
} from '@/data/codingProfiles';

export const revalidate = 3600; // Cache for 1 hour

export interface CodingStatsResponse {
  leetcode: {
    solvedCount: number;
    formatted: string;
    easy?: number;
    medium?: number;
    hard?: number;
  };
  dailysql: {
    solvedCount: number;
    formatted: string;
    easy?: number;
    medium?: number;
    advanced?: number;
  };
  stratascratch: {
    solvedCount: number;
    formatted: string;
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

  let dailysqlSolved = dailysqlConfig.baselineSolvedCount;
  let dailysqlEasy = 55;
  let dailysqlMedium = 38;
  let dailysqlAdvanced = 12;

  let stratascratchSolved = stratascratchConfig.baselineSolvedCount;

  // 1. Fetch live LeetCode stats
  try {
    const leetcodeQuery = {
      query: `
        query userProblemsSolved($username: String!) {
          matchedUser(username: $username) {
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
    }
  } catch (error) {
    console.error('Error fetching live LeetCode stats:', error);
  }

  // 2. Fetch live DailySQL stats
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
    },
    dailysql: {
      solvedCount: dailysqlSolved,
      formatted: formatSolvedCount(dailysqlSolved, dailysqlConfig.unit),
      easy: dailysqlEasy,
      medium: dailysqlMedium,
      advanced: dailysqlAdvanced,
    },
    stratascratch: {
      solvedCount: stratascratchSolved,
      formatted: formatSolvedCount(stratascratchSolved, stratascratchConfig.unit),
    },
  };

  return NextResponse.json(responseData);
}
