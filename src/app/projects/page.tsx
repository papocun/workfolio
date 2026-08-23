import type { Metadata } from 'next';
import { portfolioData } from '@/data/portfolioData';
import AnimatedProjectsList from '@/components/AnimatedProjectsList';
import OtherProjectsList from '@/components/OtherProjectsList';

export const metadata: Metadata = {
  title: 'Projects',
  description:
    'Production-grade machine learning systems, predictive pipelines, and containerized cloud APIs built and deployed by Divyanshu Tiwari.',
  alternates: {
    canonical: 'https://datafolio.me/projects/',
    types: {
      'text/markdown': 'https://datafolio.me/projects.md',
    },
  },
};

export default function ProjectsPage() {
  return (
    <main className="max-w-[680px] mx-auto px-4 sm:px-6 pt-6 sm:pt-10 pb-16 sm:pb-20 transition-colors duration-200 ease-[cubic-bezier(0.4,0,0.2,1)]">
      {/* Section Header */}
      <div className="mb-6 sm:mb-8">
        <div className="inline-flex items-center gap-2 px-2.5 py-1 rounded-full bg-slate-100 dark:bg-slate-800/80 text-[11.5px] font-mono text-slate-600 dark:text-slate-400 mb-3 border border-slate-200/60 dark:border-slate-700/60">
          <span className="w-1.5 h-1.5 rounded-full bg-[#1D9BF0] animate-pulse" />
          <span>the work</span>
        </div>
        <h1 className="text-[24px] sm:text-[30px] font-bold text-slate-900 dark:text-slate-100 tracking-tight leading-tight mb-2 sm:mb-2.5">
          Projects
        </h1>
        <p className="text-[13.5px] sm:text-[14.5px] text-slate-600 dark:text-slate-400 leading-relaxed max-w-[620px]">
          A few things I’ve built, explored, and brought to life.
        </p>
      </div>

      {/* Featured Projects with Scroll Reveal & Stagger Animation */}
      <AnimatedProjectsList projects={portfolioData.projects} />

      {/* Secondary Other Projects List */}
      <OtherProjectsList />
    </main>
  );
}
