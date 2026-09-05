/**
 * Client-side global view counter utility.
 * 
 * Strategy:
 * 1. If NEXT_PUBLIC_UPSTASH_REDIS_REST_URL and NEXT_PUBLIC_UPSTASH_REDIS_REST_TOKEN are set,
 *    queries Upstash Redis REST endpoint directly.
 * 2. Otherwise, uses the high-availability serverless CountAPI global counter,
 *    ensuring full persistence across devices and static deployments (GitHub Pages).
 */

const UPSTASH_URL = process.env.NEXT_PUBLIC_UPSTASH_REDIS_REST_URL;
const UPSTASH_TOKEN = process.env.NEXT_PUBLIC_UPSTASH_REDIS_REST_TOKEN;
const COUNT_API_KEY = 'papocun_workfolio_views';
const COUNT_API_BASE = 'https://countapi.mileshilliard.com/api/v1';

export async function fetchGlobalViews(increment: boolean = false): Promise<number | null> {
  const timestamp = Date.now();

  // Option 1: Upstash Redis REST
  if (UPSTASH_URL && UPSTASH_TOKEN) {
    try {
      const endpoint = increment
        ? `${UPSTASH_URL}/incr/portfolio:views?_t=${timestamp}`
        : `${UPSTASH_URL}/get/portfolio:views?_t=${timestamp}`;

      const response = await fetch(endpoint, {
        method: increment ? 'POST' : 'GET',
        cache: 'no-store',
        headers: {
          Authorization: `Bearer ${UPSTASH_TOKEN}`,
          'Cache-Control': 'no-cache, no-store, must-revalidate',
          Pragma: 'no-cache',
        },
      });

      if (response.ok) {
        const data = await response.json();
        const count = Number(data.result);
        if (!isNaN(count) && count >= 0) {
          return count;
        }
      }
    } catch (err) {
      console.warn('[ViewCounter] Upstash request failed, trying CountAPI fallback:', err);
    }
  }

  // Option 2: Serverless CountAPI (zero-config global persistence)
  try {
    const endpoint = increment
      ? `${COUNT_API_BASE}/hit/${COUNT_API_KEY}?_t=${timestamp}`
      : `${COUNT_API_BASE}/get/${COUNT_API_KEY}?_t=${timestamp}`;

    const response = await fetch(endpoint, {
      method: 'GET',
      cache: 'no-store',
      headers: {
        'Cache-Control': 'no-cache, no-store, must-revalidate',
        Pragma: 'no-cache',
      },
    });

    if (response.ok) {
      const data = await response.json();
      const count = Number(data.value);
      if (!isNaN(count) && count >= 0) {
        return count;
      }
    }
  } catch (err) {
    console.error('[ViewCounter] CountAPI request failed:', err);
  }

  return null;
}
