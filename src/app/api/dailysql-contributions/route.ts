import { NextResponse } from 'next/server';
import { CODING_PROFILE_CONFIGS } from '@/data/codingProfiles';

// Static at build time for the GitHub Pages export; revalidates when self-hosted.
export const dynamic = 'force-static';
export const revalidate = 3600;

export async function GET() {
  const { username, baselineSolvedCount } = CODING_PROFILE_CONFIGS.dailysql;
  try {
    const res = await fetch(`https://www.dailysql.in/u/${encodeURIComponent(username)}`, {
      headers: { 'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 Chrome/120 Safari/537.36' },
      next: { revalidate: 3600 },
    });
    if (!res.ok) throw new Error(`status ${res.status}`);
    const html = await res.text();

    const heat = html.match(/\\"heatmap\\":(\{[^}]*\})/);
    if (!heat) throw new Error('heatmap not found');
    const heatmap: Record<string, number> = JSON.parse(heat[1].replace(/\\"/g, '"'));
    const solved = html.match(/\\"total_solved\\":\s*(\d+)/);

    return NextResponse.json({
      success: true,
      username,
      heatmap,
      totalSolved: solved ? parseInt(solved[1], 10) : baselineSolvedCount,
    });
  } catch (e) {
    return NextResponse.json(
      { success: false, username, error: e instanceof Error ? e.message : 'failed' },
      { status: 502 }
    );
  }
}
