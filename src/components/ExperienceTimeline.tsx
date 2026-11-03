'use client';

import { SkillChip } from '@/components/SkillsSection';
import React, { useState } from 'react';
import { CaretDown, ArrowRight } from '@phosphor-icons/react';

export interface TimelineExperienceItem {
  id: string;
  company: string;
  role: string;
  period: string;
  location?: string;
  isCurrent?: boolean;
  summary: string;
  narrative: string[];
  technologies: string[];
}

interface ExperienceTimelineProps {
  experiences: TimelineExperienceItem[];
}

export default function ExperienceTimeline({
  experiences,
}: ExperienceTimelineProps) {
  // All experiences are collapsed by default until user clicks the expand button
  const [expandedIds, setExpandedIds] = useState<Record<string, boolean>>({});

  const toggleExpand = (id: string) => {
    setExpandedIds((prev) => ({
      ...prev,
      [id]: !prev[id],
    }));
  };

  return (
    <section aria-label="Experience List" className="w-full">
      <div className="divide-y divide-slate-200/80 dark:divide-[#2F3336]/60">
        {experiences.map((exp) => {
          const isExpanded = !!expandedIds[exp.id];
          const contentId = `exp-details-${exp.id}`;

          return (
            <article key={exp.id} className="py-3.5 sm:py-4">
              <button
                type="button"
                onClick={() => toggleExpand(exp.id)}
                aria-expanded={isExpanded}
                aria-controls={contentId}
                className="block w-full text-left cursor-pointer"
              >
                <div className="flex w-full items-center justify-between gap-3">
                  <span className="min-w-0 truncate text-[15px] sm:text-[16px] font-bold text-slate-900 dark:text-slate-100 tracking-tight">
                    {exp.company}
                    <span className="mx-2 font-normal text-slate-400 dark:text-slate-500" aria-hidden="true">
                      ·
                    </span>
                    <span className="font-normal text-slate-600 dark:text-slate-400">{exp.role}</span>
                  </span>
                  <span className="flex shrink-0 items-center gap-2.5 text-[12px] sm:text-[12.5px] font-mono text-slate-500 dark:text-[#71767B]">
                    <span className="hidden min-[420px]:inline tabular-nums">{exp.period}</span>
                    <CaretDown
                      size={16}
                      weight="regular"
                      aria-hidden="true"
                      className={`transition-transform duration-200 ${isExpanded ? 'rotate-180' : ''}`}
                    />
                  </span>
                </div>
                <p
                  className={`mt-1.5 text-[14px] sm:text-[15px] leading-[1.65] text-slate-600 dark:text-slate-300 text-pretty ${
                    isExpanded ? '' : 'line-clamp-1'
                  }`}
                >
                  {exp.summary}
                </p>
              </button>

              <div
                id={contentId}
                className={`grid transition-[grid-template-rows] duration-200 ease-out ${
                  isExpanded ? 'grid-rows-[1fr]' : 'grid-rows-[0fr]'
                }`}
              >
                <div className="overflow-hidden">
                  <div className="pt-3 space-y-2">
                    {exp.narrative.map((bullet, bIdx) => (
                      <div
                        key={bIdx}
                        className="flex items-start gap-2.5 text-[14px] sm:text-[15px] text-slate-700 dark:text-slate-300 leading-[1.65]"
                      >
                        <ArrowRight
                          size={14}
                          weight="regular"
                          className="text-[#1D9BF0] shrink-0 mt-1"
                          aria-hidden="true"
                        />
                        <span className="text-pretty">{bullet}</span>
                      </div>
                    ))}

                    {exp.technologies.length > 0 && (
                      <ul className="flex flex-wrap gap-2 pt-1.5" aria-label="Tech">
                        {exp.technologies.map((tech) => (
                          <SkillChip key={tech} name={tech} />
                        ))}
                      </ul>
                    )}
                  </div>
                </div>
              </div>
            </article>
          );
        })}
      </div>
    </section>
  );
}
