/**
 * Client-side global view counter utility.
 * 
 * Uses CountAPI for persistence across static GitHub Pages deployments.
 * Do not place credentials in this client module: `NEXT_PUBLIC_*` variables are
 * embedded in the JavaScript sent to every visitor.
 */

const COUNT_API_KEY = 'papocun_workfolio_views';
const COUNT_API_BASE = 'https://countapi.mileshilliard.com/api/v1';

export async function fetchGlobalViews(increment: boolean = false): Promise<number | null> {
  const timestamp = Date.now();

  // Serverless CountAPI (zero-config global persistence)
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
