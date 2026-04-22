import type { Metadata } from 'next';
import CodingProfilesList from '@/components/CodingProfilesList';

export const metadata: Metadata = {
  title: 'Coding & Problem Solving',
  description:
    'Competitive programming, algorithm practice, and SQL query optimization profiles across LeetCode, DailySQL, and StrataScratch by Divyanshu Tiwari.',
  alternates: {
    canonical: 'https://datafolio.me/code/',
    types: {
      'text/markdown': 'https://datafolio.me/code.md',
    },
  },
  openGraph: {
    title: 'Coding & Problem Solving | Divyanshu Tiwari',
    description:
      'Competitive programming, algorithm practice, and SQL query optimization profiles across LeetCode, DailySQL, and StrataScratch by Divyanshu Tiwari.',
    url: 'https://datafolio.me/code/',
    siteName: 'Divyanshu Tiwari',
    locale: 'en_US',
    type: 'website',
  },
  twitter: {
    card: 'summary_large_image',
    title: 'Coding & Problem Solving | Divyanshu Tiwari',
    description:
      'Competitive programming, algorithm practice, and SQL query optimization profiles across LeetCode, DailySQL, and StrataScratch by Divyanshu Tiwari.',
    creator: '@21dvy_t',
  },
};

const breadcrumbJsonLd = {
  '@context': 'https://schema.org',
  '@type': 'BreadcrumbList',
  itemListElement: [
    {
      '@type': 'ListItem',
      position: 1,
      name: 'Home',
      item: 'https://datafolio.me/',
    },
    {
      '@type': 'ListItem',
      position: 2,
      name: 'Code',
      item: 'https://datafolio.me/code/',
    },
  ],
};

export default function CodePage() {
  return (
    <main className="max-w-[680px] mx-auto px-4 sm:px-6 pt-6 sm:pt-10 pb-16 sm:pb-20">
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(breadcrumbJsonLd) }}
      />

      {/* Section Header */}
      <div className="mb-6 sm:mb-8">
        <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-slate-100 dark:bg-slate-800/80 text-[12.5px] font-mono text-slate-600 dark:text-slate-400 mb-3 border border-slate-200/60 dark:border-slate-700/60">
          <span className="w-1.5 h-1.5 rounded-full bg-[#1D9BF0] animate-pulse" />
          <span>the code</span>
        </div>
        <h1 className="text-[28px] sm:text-[34px] font-bold text-slate-900 dark:text-slate-100 tracking-tight leading-tight mb-2 sm:mb-2.5">
          Code
        </h1>
        <p className="text-[15px] sm:text-[16px] text-slate-600 dark:text-slate-400 leading-relaxed max-w-[620px]">
          I work on coding problems, SQL questions, and practice my problem-solving skills.
        </p>
      </div>

      {/* Clean Stacked Coding Profiles (LeetCode & DailySQL) */}
      <CodingProfilesList />
    </main>
  );
}
