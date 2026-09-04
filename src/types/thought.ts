/* ============================================================
   WORKFOLIO — Thought / Quotes Types
   Type definitions for the Thought section and ZenQuotes API.
   ============================================================ */

export interface ThoughtQuote {
  quote: string;
  author: string;
}

export interface ThoughtApiResponse {
  success: boolean;
  quotes: ThoughtQuote[];
  error?: string;
}
