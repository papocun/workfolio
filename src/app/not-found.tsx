import Link from 'next/link';
import type { Metadata } from 'next';

export const metadata: Metadata = {
  title: '404 — Page Not Found | Divyanshu Tiwari',
  description: 'The requested page could not be found. Explore available sections of Divyanshu Tiwari\'s portfolio.',
  robots: {
    index: false,
    follow: true,
  },
};

const RECOVERY_LINKS = [
  {
    title: 'Homepage',
    href: '/',
    description: 'Introduction, bio, core focus, and contact information.',
  },
  {
    title: 'Projects',
    href: '/projects',
    description: 'Production machine learning systems, time-series pipelines, and cloud APIs.',
  },
  {
    title: 'Experience',
    href: '/experience',
    description: 'Professional and startup experience across data science and ML engineering.',
  },
  {
    title: 'Code',
    href: '/code',
    description: 'Coding profiles, active streaks, and algorithm problem-solving activity.',
  },
  {
    title: 'Blog',
    href: '/blog',
    description: 'Technical writing, notes, and research.',
  },
  {
    title: 'Sitemap (XML)',
    href: '/sitemap.xml',
    description: 'Complete XML sitemap listing all canonical public pages.',
  },
  {
    title: 'LLMs Reference (llms.txt)',
    href: '/llms.txt',
    description: 'Structured, machine-readable summary for AI agents and LLMs.',
  },
];

export default function NotFound() {
  return (
    <main className="max-w-[680px] mx-auto px-4 sm:px-6 pt-10 sm:pt-16 pb-20 sm:pb-24">
      {/* 404 Badge */}
      <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-amber-50 dark:bg-amber-950/40 border border-amber-200/70 dark:border-amber-800/60 text-[12.5px] font-mono text-amber-700 dark:text-amber-300 mb-4">
        <span className="w-1.5 h-1.5 rounded-full bg-amber-500" />
        <span>HTTP 404 · Page Not Found</span>
      </div>

      {/* Heading */}
      <h1 className="text-[28px] sm:text-[36px] font-bold text-slate-900 dark:text-slate-100 tracking-tight leading-tight mb-3 text-balance">
        This page could not be found.
      </h1>

      <p className="text-[15px] sm:text-[16px] text-slate-600 dark:text-slate-300 leading-relaxed mb-8 text-pretty">
        The URL you requested does not exist or has moved. Use the links below to navigate to valid sections of the site or access agent-friendly resources.
      </p>

      {/* Navigation & Recovery Links Section */}
      <section aria-label="Available Pages & Recovery Links">
        <h2 className="font-mono text-[12px] font-semibold uppercase tracking-wider text-slate-500 dark:text-slate-400 mb-3 select-none">
          Available Pages &amp; Resources
        </h2>

        <div className="space-y-2.5">
          {RECOVERY_LINKS.map((link) => (
            <Link
              key={link.href}
              href={link.href}
              className="group block rounded-xl border border-slate-200/90 dark:border-[#2F3336] bg-white dark:bg-[#16181C] p-3.5 sm:p-4 shadow-xs hover:border-slate-400 dark:hover:border-slate-600 active:scale-[0.96] transition-[border-color,background-color,transform] duration-150"
            >
              <div className="flex items-center justify-between gap-2">
                <span className="font-semibold text-[15px] text-slate-900 dark:text-slate-100 group-hover:text-[#1D9BF0] transition-colors">
                  {link.title} <span className="font-mono text-[13px] text-slate-400 font-normal">({link.href})</span>
                </span>
                <span className="text-slate-400 group-hover:text-slate-900 dark:group-hover:text-slate-100 group-hover:translate-x-0.5 transition-[transform,color] duration-150 inline-flex items-center">
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    width="14"
                    height="14"
                    fill="currentColor"
                    viewBox="0 0 256 256"
                    className="translate-y-[0.5px]"
                    aria-hidden="true"
                  >
                    <path d="M221.66,133.66l-72,72a8,8,0,0,1-11.32-11.32L196.69,136H40a8,8,0,0,1,0-16H196.69L138.34,61.66a8,8,0,0,1,11.32-11.32l72,72A8,8,0,0,1,221.66,133.66Z" />
                  </svg>
                </span>
              </div>
              <p className="text-[14px] text-slate-500 dark:text-slate-400 mt-1 leading-normal">
                {link.description}
              </p>
            </Link>
          ))}
        </div>
      </section>
    </main>
  );
}
