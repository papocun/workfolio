'use client';

import React from 'react';

export interface OtherProjectItem {
  id: string;
  index: string;
  title: string;
  description: string;
  techStack?: string[];
  year: string;
  githubUrl: string;
}

const OTHER_PROJECTS: OtherProjectItem[] = [
  {
    id: 'digital-wallet-analytics',
    index: '01',
    title: 'Digital Wallet Analytics',
    description:
      'End-to-end product analytics project for a B2C digital wallet, exploring user behaviour, engagement, and business decisions through data.',
    techStack: ['Python', 'SQL', 'Product Analytics', 'Decision Making'],
    year: '2026',
    githubUrl: 'https://github.com/papocun/digital-wallet-analytics',
  },
  {
    id: 'my-desk-kitty',
    index: '02',
    title: 'My Desk Kitty',
    description:
      'A small interactive Python desktop experiment that reacts to keyboard activity and brings a playful virtual cat to life.',
    techStack: ['Python', 'PyInput', 'PySide6'],
    year: '2026',
    githubUrl: 'https://github.com/papocun/My-Desk-Kitty',
  },
  {
    id: 'taxi-fare-analysis',
    index: '03',
    title: 'Taxi Fare Analysis',
    description:
      'An end-to-end Power BI analysis exploring taxi data through interactive dashboards and business-focused visualisation.',
    techStack: ['Power BI'],
    year: '2026',
    githubUrl: 'https://github.com/papocun/taxi-fair-analysis',
  },
];

export default function OtherProjectsList() {
  return (
    <section className="mt-20 pt-12 border-t border-slate-200/80 dark:border-slate-800/80">
      {/* Section Header */}
      <div className="mb-8 sm:mb-10">
        <div className="inline-flex items-center gap-2 px-2.5 py-1 rounded-full bg-slate-100 dark:bg-slate-800/80 text-[11.5px] font-mono text-slate-600 dark:text-slate-400 mb-3 border border-slate-200/60 dark:border-slate-700/60">
          <span className="w-1.5 h-1.5 rounded-full bg-[#ff3131] animate-pulse" />
          <span>more projects</span>
        </div>
        <h2 className="text-[22px] sm:text-[25px] font-bold text-slate-900 dark:text-slate-100 tracking-tight leading-tight mb-2">
          Other things I&apos;ve built
        </h2>
        <p className="text-[13.5px] sm:text-[14px] text-slate-600 dark:text-slate-400 leading-relaxed max-w-[620px]">
          A few more things I’ve explored along the way.
        </p>
      </div>

      {/* Numbered List Rows */}
      <div className="divide-y divide-slate-200/70 dark:divide-slate-800/80 border-y border-slate-200/70 dark:border-slate-800/80">
        {OTHER_PROJECTS.map((project) => (
          <a
            key={project.id}
            href={project.githubUrl}
            target="_blank"
            rel="noopener noreferrer"
            className="group block py-4 sm:py-5 transition-colors duration-150 -mx-2 px-2 rounded-lg hover:bg-slate-50/80 dark:hover:bg-slate-900/50 cursor-pointer"
          >
            <div className="flex items-start justify-between gap-3 sm:gap-4">
              {/* Left Column: Number + Name + Description */}
              <div className="flex items-start gap-3 sm:gap-4 flex-1 min-w-0">
                <span className="font-mono text-[12px] text-slate-400 dark:text-slate-500 pt-0.5 select-none shrink-0">
                  {project.index}
                </span>

                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-2 flex-wrap mb-1">
                    <h3 className="text-[14.5px] sm:text-[15px] font-semibold text-slate-800 dark:text-slate-200 group-hover:text-slate-950 dark:group-hover:text-white transition-colors">
                      {project.title}
                    </h3>
                  </div>

                  <p className="text-[12.5px] sm:text-[13px] text-slate-500 dark:text-slate-400 leading-[1.55] line-clamp-2 sm:line-clamp-none">
                    {project.description}
                  </p>

                  {/* Tech stack tags */}
                  {project.techStack && (
                    <div className="flex flex-wrap gap-1.5 mt-2">
                      {project.techStack.map((tech) => (
                        <span
                          key={tech}
                          className="rounded bg-slate-100 dark:bg-slate-800/90 px-1.5 py-0.5 text-[10px] font-mono text-slate-600 dark:text-slate-400"
                        >
                          {tech}
                        </span>
                      ))}
                    </div>
                  )}
                </div>
              </div>

              {/* Right Column: Year + Subtle Animated Arrow */}
              <div className="flex items-center gap-2 sm:gap-3 shrink-0 pt-0.5">
                <span className="font-mono text-[11.5px] sm:text-[12px] text-slate-400 dark:text-slate-500">
                  {project.year}
                </span>
                <span className="text-slate-400 dark:text-slate-500 group-hover:text-slate-900 dark:group-hover:text-slate-100 group-hover:translate-x-1 transition-all duration-150 inline-flex items-center text-[13px] sm:text-[14px]">
                  →
                </span>
              </div>
            </div>
          </a>
        ))}
      </div>
    </section>
  );
}
