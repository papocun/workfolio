import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';
import { prefersMarkdown } from '@/lib/acceptParser';
import { getMarkdownForPath } from '@/lib/markdownContent';

export function middleware(request: NextRequest) {
  const { pathname } = request.nextUrl;
  const acceptHeader = request.headers.get('accept');

  // Check if requested path is a known content page
  const markdownContent = getMarkdownForPath(pathname);

  if (markdownContent && prefersMarkdown(acceptHeader)) {
    return new NextResponse(markdownContent, {
      status: 200,
      headers: {
        'Content-Type': 'text/markdown; charset=utf-8',
        'Vary': 'Accept, Accept-Encoding',
        'Cache-Control': 'public, max-age=3600, s-maxage=3600',
      },
    });
  }

  // For normal requests, pass through and ensure Vary: Accept header is set
  const response = NextResponse.next();
  const currentVary = response.headers.get('vary');
  if (currentVary) {
    if (!currentVary.includes('Accept')) {
      response.headers.set('Vary', `${currentVary}, Accept`);
    }
  } else {
    response.headers.set('Vary', 'Accept, Accept-Encoding');
  }

  return response;
}

export const config = {
  matcher: [
    /*
     * Match all request paths except for:
     * - _next/static (static files)
     * - _next/image (image optimization files)
     * - favicon.ico, favicon.png, images, etc.
     */
    '/((?!_next/static|_next/image|favicon.png|favicon.ico|images|pet|.*\\.(?:png|jpg|jpeg|gif|svg|ico|webp)$).*)',
  ],
};
