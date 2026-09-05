'use client';

import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { CaretDown, CaretUp, ArrowRight } from '@phosphor-icons/react';

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
      <div className="divide-y divide-slate-200/80 dark:divide-[#2F3336]/40 space-y-4 sm:space-y-5">
        {experiences.map((exp, index) => {
          const isExpanded = !!expandedIds[exp.id];
          const contentId = `exp-details-${exp.id}`;

          return (
            <article
              key={exp.id}
              className={index === 0 ? '' : 'pt-4 sm:pt-5'}
            >
              {/* Top Row: Clickable Header Button */}
              <button
                type="button"
                onClick={() => toggleExpand(exp.id)}
                aria-expanded={isExpanded}
                aria-controls={contentId}
                className="w-full text-left group flex flex-col sm:flex-row sm:items-baseline justify-between gap-1.5 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#1D9BF0] rounded-sm transition-colors py-1.5 cursor-pointer"
              >
                {/* Left: Company · Role */}
                <div className="flex items-baseline gap-2 flex-wrap">
                  <span className="text-[16px] sm:text-[17px] font-semibold text-slate-900 dark:text-slate-100 group-hover:text-black dark:group-hover:text-white transition-colors">
                    {exp.company}
                  </span>
                  <span
                    className="text-slate-400 dark:text-slate-500 select-none text-[14px]"
                    aria-hidden="true"
                  >
                    ·
                  </span>
                  <span className="text-[14.5px] sm:text-[15.5px] text-slate-600 dark:text-slate-400 font-normal">
                    {exp.role}
                  </span>
                </div>

                {/* Right: Date Range & Arrow Indicator */}
                <div className="flex items-center gap-2 shrink-0 self-start sm:self-auto mt-0.5 sm:mt-0">
                  <span className="text-[13px] sm:text-[14px] font-mono text-slate-500 dark:text-slate-400 tabular-nums">
                    {exp.period}
                  </span>
                  <span
                    className={`inline-flex items-center justify-center transition-colors ${
                      isExpanded
                        ? 'text-[#1D9BF0]'
                        : 'text-slate-400 dark:text-slate-400 group-hover:text-slate-700 dark:group-hover:text-slate-200'
                    }`}
                    aria-hidden="true"
                  >
                    {isExpanded ? (
                      <CaretUp size={16} weight="bold" />
                    ) : (
                      <CaretDown size={16} weight="bold" />
                    )}
                  </span>
                </div>
              </button>

              {/* Short One-Line Summary */}
              <p className="text-[14.5px] sm:text-[15px] text-slate-600 dark:text-slate-400 leading-relaxed mt-1 sm:mt-1.5">
                {exp.summary}
              </p>

              {/* Collapsible Expanded Details */}
              <AnimatePresence initial={false}>
                {isExpanded && (
                  <motion.div
                    id={contentId}
                    key="expanded-content"
                    initial={{ opacity: 0, height: 0 }}
                    animate={{ opacity: 1, height: 'auto' }}
                    exit={{ opacity: 0, height: 0 }}
                    transition={{ duration: 0.2, ease: [0.4, 0, 0.2, 1] }}
                    className="overflow-hidden"
                  >
                    <div className="border-l border-slate-300 dark:border-[#2F3336] pl-4 sm:pl-5 ml-2.5 sm:ml-3 my-2.5 sm:my-3 space-y-2">
                      {/* Detailed Bullet Points */}
                      {exp.narrative.map((bullet, bIdx) => (
                        <div
                          key={bIdx}
                          className="flex items-start gap-2.5 text-[14px] sm:text-[15px] text-slate-700 dark:text-slate-300 leading-[1.65]"
                        >
                          <ArrowRight
                            size={14}
                            weight="bold"
                            className="text-[#1D9BF0] shrink-0 mt-1"
                            aria-hidden="true"
                          />
                          <span>{bullet}</span>
                        </div>
                      ))}

                      {/* Technologies Used */}
                      {exp.technologies.length > 0 && (
                        <div className="flex flex-wrap gap-1.5 pt-1.5">
                          {exp.technologies.map((tech) => (
                            <span
                              key={tech}
                              className="rounded bg-slate-100 dark:bg-[#16181C] border border-slate-200/80 dark:border-[#2F3336] px-2.5 py-1 text-[12px] font-mono text-slate-700 dark:text-slate-300 font-medium"
                            >
                              {tech}
                            </span>
                          ))}
                        </div>
                      )}
                    </div>
                  </motion.div>
                )}
              </AnimatePresence>
            </article>
          );
        })}
      </div>
    </section>
  );
}
