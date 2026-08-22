import type { Metadata } from 'next';
import CodingProfilesList from '@/components/CodingProfilesList';

export const metadata: Metadata = {
  title: 'Code — Divyanshu Tiwari',
  description:
    'Competitive programming, algorithms, and database query optimization profiles on LeetCode and DailySQL.',
};

export default function CodePage() {
  return (
    <main className="max-w-[680px] mx-auto px-4 sm:px-6 pt-6 sm:pt-10 pb-16 sm:pb-20 transition-colors duration-200 ease-[cubic-bezier(0.4,0,0.2,1)]">
      {/* Section Header */}
      <div className="mb-6 sm:mb-8">
        <div className="inline-flex items-center gap-2 px-2.5 py-1 rounded-full bg-slate-100 dark:bg-slate-800/80 text-[11.5px] font-mono text-slate-600 dark:text-slate-400 mb-3 border border-slate-200/60 dark:border-slate-700/60">
          <span className="w-1.5 h-1.5 rounded-full bg-[#1D9BF0] animate-pulse" />
          <span>the code</span>
        </div>
        <h1 className="text-[24px] sm:text-[30px] font-bold text-slate-900 dark:text-slate-100 tracking-tight leading-tight mb-2 sm:mb-2.5">
          Code
        </h1>
        <p className="text-[13.5px] sm:text-[14.5px] text-slate-600 dark:text-slate-400 leading-relaxed max-w-[620px]">
          I work on coding problems, SQL questions, and practice my problem-solving skills.
        </p>
      </div>

      {/* Clean Stacked Coding Profiles (LeetCode & DailySQL) */}
      <CodingProfilesList />
    </main>
  );
}
