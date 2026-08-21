'use client';

import React from 'react';
import {
  MorphingDialog,
  MorphingDialogTrigger,
  MorphingDialogContainer,
  MorphingDialogContent,
  MorphingDialogTitle,
  MorphingDialogSubtitle,
  MorphingDialogClose,
} from '@/components/core/morphing-dialog';

export interface DetailedExperience {
  id: string;
  index: string;
  role: string;
  company: string;
  location: string;
  period: string;
  tagline: string;
  highlights: string[];
  technologies: string[];
}

const EXPERIENCES: DetailedExperience[] = [
  {
    id: 'zeitstone',
    index: '01',
    role: 'Data Scientist Intern',
    company: 'ZeitstoneAI',
    location: 'Remote',
    period: 'Aug 2026 – Present',
    tagline: 'E-commerce Financial Decision System & Scoring Pipelines',
    highlights: [
      'Owned end-to-end development of an e-commerce financial decision system, translating business requirements into 9 scoring models, validating them through 119 automated tests, and collaborating across business, backend, data, and database layers to design a multi-source data model connecting Shopify, payment, shipping, returns, and cost data into actionable scoring and dashboard outputs.',
      'Currently integrating and refining the scoring pipeline, working across multiple business data sources to ensure consistent inputs, transformations, and reliable decision outputs.',
      'Building and validating the underlying data model and data flows, with ongoing work around scoring logic, relationships between data sources, and edge-case handling.',
      'Working closely with business, backend, data, and database teams to translate business requirements into technical requirements, scoring logic, and implementable system behaviour.',
      'Continuously testing, debugging, and refining the decision models, expanding validation coverage and handling edge cases as the system evolves.',
    ],
    technologies: [
      'Python',
      'Data Modeling',
      'Automated Testing',
      'Scoring Systems',
      'FastAPI',
      'Docker',
    ],
  },
  {
    id: 'chatspark',
    index: '02',
    role: 'Data Analyst Intern',
    company: 'ChatSpark',
    location: 'Remote',
    period: 'Mar 2026 – May 2026',
    tagline: 'Excel Automation, SQL Cohort Analysis & Recurring Dashboards',
    highlights: [
      'Automated the Excel reporting pipeline end-to-end in Python, reducing dashboard generation time from 3+ hours to under 5 minutes for recurring reports.',
      'Performed SQL-based cohort analysis on transactional data, identifying a 15% decline in repeat purchases over a 90-day window and presenting the findings to support retention decisions.',
      'Maintained recurring business dashboards and reporting workflows, ensuring data accuracy and consistency for operational decision-making.',
    ],
    technologies: [
      'Python',
      'SQL',
      'Excel Automation',
      'Cohort Analysis',
      'Dashboards',
    ],
  },
];

export default function ExperienceMorphingList() {
  return (
    <div className="flex flex-col gap-5">
      {EXPERIENCES.map((exp) => (
        <MorphingDialog key={exp.id}>
          {/* Card Trigger */}
          <MorphingDialogTrigger className="group rounded-xl border border-slate-200/90 dark:border-slate-800/80 bg-white dark:bg-[#0f1422] p-4 sm:p-5 transition-all duration-200 hover:border-slate-400 dark:hover:border-slate-600 hover:shadow-xs text-left">
            <div className="flex items-center justify-between font-mono text-[11px] text-slate-400 dark:text-slate-500 mb-1.5">
              <span>
                {exp.index} / {exp.company.toUpperCase()}
              </span>
              <span className="flex items-center gap-1.5 text-[11.5px] text-slate-500 dark:text-slate-400 font-medium">
                {exp.period}
              </span>
            </div>

            <div className="flex items-baseline justify-between gap-2 mb-1">
              <MorphingDialogTitle className="text-[16px] sm:text-[18px] font-bold text-slate-900 dark:text-slate-100 tracking-tight">
                {exp.role}
              </MorphingDialogTitle>
            </div>

            <MorphingDialogSubtitle className="text-[12.5px] text-slate-500 dark:text-slate-400 mb-2 flex items-center gap-1.5 font-medium">
              <span className="text-slate-900 dark:text-slate-200 font-semibold">{exp.company}</span>
              <span className="text-slate-300 dark:text-slate-700 select-none" aria-hidden="true">
                ·
              </span>
              <span>{exp.location}</span>
            </MorphingDialogSubtitle>

            <p className="text-[13px] text-slate-600 dark:text-slate-400 leading-[1.5] mb-3">
              {exp.tagline}
            </p>

            <div className="flex items-center justify-between pt-2 border-t border-slate-100 dark:border-slate-800/80 mt-1">
              <div className="flex flex-wrap gap-1.5">
                {exp.technologies.slice(0, 4).map((tech) => (
                  <span
                    key={tech}
                    className="rounded-lg bg-slate-100 dark:bg-slate-800 px-2 py-0.5 text-[10.5px] font-mono font-medium text-slate-600 dark:text-slate-300"
                  >
                    {tech}
                  </span>
                ))}
                {exp.technologies.length > 4 && (
                  <span className="rounded-lg bg-slate-50 dark:bg-slate-900 px-1.5 py-0.5 text-[10px] font-mono text-slate-400">
                    +{exp.technologies.length - 4}
                  </span>
                )}
              </div>

              <span className="inline-flex items-center gap-1 font-mono text-[11px] text-slate-500 dark:text-slate-400 group-hover:text-slate-900 dark:group-hover:text-slate-100 transition-colors">
                <span>expand</span>
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  width="11"
                  height="11"
                  fill="currentColor"
                  viewBox="0 0 256 256"
                  className="translate-y-[0.5px]"
                >
                  <path d="M221.66,133.66l-72,72a8,8,0,0,1-11.32-11.32L196.69,136H40a8,8,0,0,1,0-16H196.69L138.34,61.66a8,8,0,0,1,11.32-11.32l72,72A8,8,0,0,1,221.66,133.66Z" />
                </svg>
              </span>
            </div>
          </MorphingDialogTrigger>

          {/* Morphing Compact Dialog Container */}
          <MorphingDialogContainer>
            <MorphingDialogContent className="p-4 sm:p-5 max-h-[58vh] overflow-y-auto bg-white dark:bg-[#0f1422] border-slate-200 dark:border-slate-800 text-slate-900 dark:text-slate-100">
              <MorphingDialogClose className="top-3 right-3 dark:text-slate-400 dark:hover:text-slate-100 dark:hover:bg-slate-800" />

              {/* Index & Period Header */}
              <div className="flex items-center gap-2 font-mono text-[10.5px] text-slate-400 dark:text-slate-500 mb-1">
                <span>
                  {exp.index} / {exp.company.toUpperCase()}
                </span>
                <span>·</span>
                <span className="text-slate-500 dark:text-slate-400">{exp.period}</span>
              </div>

              {/* Title & Subtitle */}
              <MorphingDialogTitle className="text-[17px] sm:text-[19px] font-bold text-slate-900 dark:text-slate-100 tracking-tight mb-0.5">
                {exp.role}
              </MorphingDialogTitle>

              <MorphingDialogSubtitle className="text-[12.5px] text-slate-600 dark:text-slate-400 mb-3 flex items-center gap-1.5 font-medium">
                <span className="text-slate-900 dark:text-slate-200 font-semibold">{exp.company}</span>
                <span className="text-slate-300 dark:text-slate-700 select-none" aria-hidden="true">
                  ·
                </span>
                <span>{exp.location}</span>
                <span className="text-slate-300 dark:text-slate-700 select-none" aria-hidden="true">
                  ·
                </span>
                <span className="text-[#ff3131] dark:text-[#ff4d4d] bg-[#ff3131]/10 border border-[#ff3131]/30 px-1.5 py-0.2 rounded-full text-[10px] font-mono">
                  Verified
                </span>
              </MorphingDialogSubtitle>

              {/* Key Impact & Accomplishments */}
              <div className="mb-3">
                <h3 className="text-[10.5px] font-mono font-semibold uppercase tracking-wider text-slate-400 dark:text-slate-500 mb-1.5">
                  Key Accomplishments
                </h3>
                <ul className="space-y-1.5 text-[12px] sm:text-[12.5px] text-slate-600 dark:text-slate-300 leading-[1.5]">
                  {exp.highlights.map((bullet, idx) => (
                    <li key={idx} className="flex items-start">
                      <span
                        className="text-slate-400 dark:text-slate-500 mr-2 select-none shrink-0 font-mono"
                        aria-hidden="true"
                      >
                        —
                      </span>
                      <span>{bullet}</span>
                    </li>
                  ))}
                </ul>
              </div>

              {/* Full Technical Toolchain */}
              <div>
                <h3 className="text-[10.5px] font-mono font-semibold uppercase tracking-wider text-slate-400 dark:text-slate-500 mb-1.5">
                  Technical Stack
                </h3>
                <div className="flex flex-wrap gap-1">
                  {exp.technologies.map((tech) => (
                    <span
                      key={tech}
                      className="rounded-lg bg-slate-100 dark:bg-slate-800 border border-slate-200/70 dark:border-slate-700 px-2 py-0.5 text-[10.5px] font-mono font-medium text-slate-700 dark:text-slate-300"
                    >
                      {tech}
                    </span>
                  ))}
                </div>
              </div>
            </MorphingDialogContent>
          </MorphingDialogContainer>
        </MorphingDialog>
      ))}
    </div>
  );
}
