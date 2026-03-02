'use client';

import { useEffect } from 'react';
import { portfolioData } from '@/data/portfolioData';
import { trackResumeClicked } from '@/lib/posthog';

export default function ResumePage() {
  useEffect(() => {
    trackResumeClicked({
      location: 'resume_page_redirect',
      url: portfolioData.socials.resumeUrl,
    });
    window.location.replace(portfolioData.socials.resumeUrl);
  }, []);

  return (
    <main className="max-w-[680px] mx-auto px-6 pt-16 pb-20 text-center font-mono text-[13px] text-slate-500">
      <p className="mb-3">Opening verified resume...</p>
      <a
        href={portfolioData.socials.resumeUrl}
        target="_blank"
        rel="noopener noreferrer"
        onClick={() =>
          trackResumeClicked({
            location: 'resume_page_fallback_link',
            url: portfolioData.socials.resumeUrl,
          })
        }
        className="text-slate-900 dark:text-slate-100 underline"
      >
        Click here if you are not redirected automatically
      </a>
    </main>
  );
}

