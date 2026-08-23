/**
 * RFC 7231 / RFC 9110 compliant Accept header parser with quality factor support.
 */

export interface AcceptEntry {
  mediaType: string;
  type: string;
  subtype: string;
  q: number;
  params: Record<string, string>;
}

export function parseAcceptHeader(acceptHeader: string | null | undefined): AcceptEntry[] {
  if (!acceptHeader || typeof acceptHeader !== 'string') {
    return [{ mediaType: '*/*', type: '*', subtype: '*', q: 1, params: {} }];
  }

  const entries: AcceptEntry[] = [];
  const parts = acceptHeader.split(',');

  for (const rawPart of parts) {
    const part = rawPart.trim();
    if (!part) continue;

    const segments = part.split(';').map((s) => s.trim());
    const mediaType = segments[0]?.toLowerCase() || '*/*';
    const [type = '*', subtype = '*'] = mediaType.split('/');

    let q = 1.0;
    const params: Record<string, string> = {};

    for (let i = 1; i < segments.length; i++) {
      const seg = segments[i];
      const equalIndex = seg.indexOf('=');
      if (equalIndex > 0) {
        const key = seg.slice(0, equalIndex).trim().toLowerCase();
        const value = seg.slice(equalIndex + 1).trim().replace(/^"(.*)"$/, '$1');
        if (key === 'q') {
          const parsedQ = parseFloat(value);
          if (!isNaN(parsedQ)) {
            q = Math.max(0, Math.min(1, parsedQ));
          }
        } else {
          params[key] = value;
        }
      }
    }

    // Only include entries where quality factor q > 0 (q=0 means unacceptable)
    if (q > 0) {
      entries.push({
        mediaType,
        type,
        subtype,
        q,
        params,
      });
    }
  }

  // Sort by quality descending; if quality is equal, sort by specificity (type/subtype > type/* > */*)
  entries.sort((a, b) => {
    if (b.q !== a.q) return b.q - a.q;

    const scoreA = (a.type !== '*' ? 2 : 0) + (a.subtype !== '*' ? 1 : 0);
    const scoreB = (b.type !== '*' ? 2 : 0) + (b.subtype !== '*' ? 1 : 0);
    return scoreB - scoreA;
  });

  return entries;
}

// Evaluates whether Markdown should be returned over HTML given an Accept header.
// Supports:
// - Explicit text/markdown (e.g. Accept: text/markdown) -> true
// - Quality-weighted accept (e.g. Accept: text/markdown;q=0.9, text/html;q=0.5) -> true
// - Quality-weighted accept (e.g. Accept: text/html;q=0.9, text/markdown;q=0.5) -> false
// - Rejection with q=0 (e.g. Accept: text/markdown;q=0, text/html) -> false
// - Standard browser accept (e.g. text/html,application/xhtml+xml;q=0.9) -> false
// - Wildcard with no specific format -> false (default to HTML)
export function prefersMarkdown(acceptHeader: string | null | undefined): boolean {
  if (!acceptHeader) return false;

  const entries = parseAcceptHeader(acceptHeader);
  if (entries.length === 0) return false;

  let markdownScore = -1;
  let htmlScore = -1;

  for (const entry of entries) {
    // Check match for text/markdown
    if (
      (entry.type === 'text' && entry.subtype === 'markdown') ||
      (entry.type === 'text' && entry.subtype === 'x-markdown')
    ) {
      if (markdownScore === -1) {
        markdownScore = entry.q * 10 + 3; // Specific match bonus
      }
    }

    // Check match for text/html
    if (entry.type === 'text' && entry.subtype === 'html') {
      if (htmlScore === -1) {
        htmlScore = entry.q * 10 + 3;
      }
    }

    // Wildcards
    if (entry.type === 'text' && entry.subtype === '*') {
      if (markdownScore === -1) markdownScore = entry.q * 10 + 2;
      if (htmlScore === -1) htmlScore = entry.q * 10 + 2;
    }
    if (entry.type === '*' && entry.subtype === '*') {
      if (markdownScore === -1) markdownScore = entry.q * 10 + 1;
      if (htmlScore === -1) htmlScore = entry.q * 10 + 1;
    }
  }

  // If client specifically accepted text/markdown with positive score and it beats or equals html (when markdown was explicit)
  if (markdownScore > 0) {
    // If markdown was explicitly requested with higher priority than html
    return markdownScore > htmlScore;
  }

  return false;
}
