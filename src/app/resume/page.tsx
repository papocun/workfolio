'use client';

import { useEffect } from 'react';
import { portfolioData } from '@/data/portfolioData';

export default function ResumePage() {
  useEffect(() => {
    window.location.replace(portfolioData.socials.resumeUrl);
  }, []);

  return (
    <main className="max-w-[680px] mx-auto px-6 pt-16 pb-20 text-center font-mono text-[13px] text-slate-500">
      <p className="mb-3">Opening verified resume...</p>
      <a
        href={portfolioData.socials.resumeUrl}
        target="_blank"
        rel="noopener noreferrer"
        className="text-slate-900 dark:text-slate-100 underline"
      >
        Click here if you are not redirected automatically
      </a>
    </main>
  );
}

