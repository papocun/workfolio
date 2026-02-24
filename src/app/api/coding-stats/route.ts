import { NextResponse } from 'next/server';

export const revalidate = 3600; // Cache for 1 hour

export interface CodingStatsResponse {
  leetcode: {
    solvedCount: number;
    formatted: string;
    easy: number;
    medium: number;
    hard: number;
  };
  dailysql: {
    solvedCount: number;
    formatted: string;
    easy: number;
    medium: number;
    advanced: number;
  };
  stratascratch: {
    solvedCount: number;
    formatted: string;
  };
}

export async function GET() {
  // Verified baseline counts
  let leetcodeSolved = 122;
  let leetcodeEasy = 83;
  let leetcodeMedium = 37;
  let leetcodeHard = 2;

  const dailysqlSolved = 104;
  const dailysqlEasy = 55;
  const dailysqlMedium = 37;
  const dailysqlAdvanced = 12;

  const stratascratchSolved = 52;

  // Attempt live LeetCode GraphQL fetch
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
        username: '21_dvynshx',
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
    }
  } catch (error) {
    console.error('Error fetching live LeetCode stats:', error);
  }

  const responseData: CodingStatsResponse = {
    leetcode: {
      solvedCount: leetcodeSolved,
      formatted: `${leetcodeSolved} problems solved`,
      easy: leetcodeEasy,
      medium: leetcodeMedium,
      hard: leetcodeHard,
    },
    dailysql: {
      solvedCount: dailysqlSolved,
      formatted: `${dailysqlSolved} queries solved`,
      easy: dailysqlEasy,
      medium: dailysqlMedium,
      advanced: dailysqlAdvanced,
    },
    stratascratch: {
      solvedCount: stratascratchSolved,
      formatted: `${stratascratchSolved} problems solved`,
    },
  };

  return NextResponse.json(responseData);
}
