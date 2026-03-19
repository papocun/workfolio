import { LLMS_TXT_CONTENT } from '@/lib/markdownContent';

export const dynamic = 'force-static';

export async function GET() {
  return new Response(LLMS_TXT_CONTENT, {
    status: 200,
    headers: {
      'Content-Type': 'text/markdown; charset=utf-8',
      'Cache-Control': 'public, max-age=3600, s-maxage=3600',
    },
  });
}
