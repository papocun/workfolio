import { NextResponse } from 'next/server';
import type { ThoughtApiResponse, ThoughtQuote } from '@/types/thought';

export const revalidate = 3600; // Cache for 1 hour

interface ZenQuoteRaw {
  q?: string;
  a?: string;
  c?: number;
  h?: string;
}

export async function GET() {
  try {
    const apiKey = process.env.ZENQUOTES_API_KEY;
    const url = apiKey
      ? `https://zenquotes.io/api/quotes/${apiKey}`
      : 'https://zenquotes.io/api/quotes';

    const res = await fetch(url, {
      headers: {
        'User-Agent': 'workfolio-portfolio',
        Accept: 'application/json',
      },
      next: { revalidate: 3600 },
    });

    if (!res.ok) {
      const errorResp: ThoughtApiResponse = {
        success: false,
        quotes: [],
        error: `ZenQuotes responded with status ${res.status}`,
      };
      return NextResponse.json(errorResp, { status: 502 });
    }

    const data = await res.json();

    if (!Array.isArray(data) || data.length === 0) {
      const errorResp: ThoughtApiResponse = {
        success: false,
        quotes: [],
        error: 'Empty or invalid response from quotes API',
      };
      return NextResponse.json(errorResp, { status: 502 });
    }

    // Filter reasonably sized quotes that fit cleanly inside the card without bloating
    const filtered: ThoughtQuote[] = [];
    for (const item of data as ZenQuoteRaw[]) {
      if (!item.q || !item.a) continue;
      const text = item.q.trim();
      const author = item.a.trim();

      // Ensure length is reasonable: 25 to 190 characters, valid author
      if (text.length >= 25 && text.length <= 190 && author.length > 0) {
        filtered.push({
          quote: text,
          author,
        });
      }
    }

    // If all were somehow filtered, fall back to any available from response
    if (filtered.length === 0) {
      for (const item of data as ZenQuoteRaw[]) {
        if (item.q && item.a) {
          filtered.push({
            quote: item.q.trim(),
            author: item.a.trim(),
          });
        }
      }
    }

    const responseData: ThoughtApiResponse = {
      success: true,
      quotes: filtered,
    };

    return NextResponse.json(responseData, {
      headers: {
        'Cache-Control': 'public, s-maxage=3600, stale-while-revalidate=86400',
      },
    });
  } catch (err: unknown) {
    const message = err instanceof Error ? err.message : 'Unknown server error';
    const responseData: ThoughtApiResponse = {
      success: false,
      quotes: [],
      error: message,
    };
    return NextResponse.json(responseData, { status: 500 });
  }
}
