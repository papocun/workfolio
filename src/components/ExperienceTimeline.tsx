'use client';

import React from 'react';
import { motion } from 'framer-motion';

export interface TimelineExperienceItem {
  id: string;
  company: string;
  role: string;
  period: string;
  location: string;
  isCurrent?: boolean;
  tagline?: string;
  narrative: string[];
  technologies: string[];
}

interface ExperienceTimelineProps {
  experiences: TimelineExperienceItem[];
}

export default function ExperienceTimeline({
  experiences,
}: ExperienceTimelineProps) {
  return (
    <div className="relative w-full">
      {/* Vertical Timeline Track Line */}
      <div
        className="absolute left-[19px] sm:left-[21px] top-5 bottom-8 w-[2px] bg-slate-200/90 dark:bg-slate-800/90 -translate-x-1/2"
        aria-hidden="true"
      />

      <div className="space-y-12 sm:space-y-16">
        {experiences.map((exp, index) => {
          const isLatest = exp.isCurrent ?? index === 0;

          return (
            <motion.div
              key={exp.id}
              initial={{ opacity: 0, y: 16 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, margin: '-40px' }}
              transition={{ duration: 0.35, ease: 'easeOut' }}
              className="relative flex items-start gap-5 sm:gap-7"
            >
              {/* Large Circular Timeline Node Anchor */}
              <div className="relative z-10 shrink-0 flex items-center justify-center">
                <div
                  className={`w-10 h-10 sm:w-11 sm:h-11 rounded-full flex items-center justify-center transition-all duration-200 bg-white dark:bg-[#0f1422] ${
                    isLatest
                      ? 'border-2 border-slate-900 dark:border-slate-100 shadow-md ring-4 ring-slate-100 dark:ring-slate-800/60'
                      : 'border-2 border-slate-300 dark:border-slate-700/80 shadow-xs'
                  }`}
                >
                  {isLatest ? (
                    <span
                      className="relative flex items-center justify-center h-4 w-4"
                      aria-label="Currently working here"
                    >
                      {/* Subtle ambient pulse ring */}
                      <span className="motion-safe:animate-ping absolute inline-flex h-full w-full rounded-full bg-[#ff3131] opacity-40" />
                      {/* Gentle secondary halo */}
                      <span className="motion-safe:animate-pulse absolute inline-flex h-3 w-3 rounded-full bg-[#ff3131]/25" />
                      {/* Living solid center dot with soft glow */}
                      <span className="relative inline-flex rounded-full h-2.5 w-2.5 bg-[#ff3131] shadow-[0_0_6px_rgba(255,49,49,0.65)]" />
                    </span>
                  ) : (
                    <span className="w-2.5 h-2.5 rounded-full bg-slate-400 dark:bg-slate-500" />
                  )}
                </div>
              </div>

              {/* Experience Story & Details */}
              <div className="flex-1 pt-0.5 min-w-0">
                {/* Header Row: Company & Metadata */}
                <div className="flex flex-col sm:flex-row sm:items-baseline justify-between gap-1 mb-1">
                  <div className="flex items-center gap-2 flex-wrap">
                    <h2 className="text-[19px] sm:text-[22px] font-bold text-slate-900 dark:text-slate-100 tracking-tight leading-snug">
                      {exp.company}
                    </h2>
                    {isLatest && (
                      <span className="inline-flex items-center gap-1 font-mono text-[10.5px] px-2 py-0.5 rounded-full bg-[#ff3131]/10 text-[#ff3131] dark:text-[#ff4d4d] border border-[#ff3131]/30 font-medium">
                        Present
                      </span>
                    )}
                  </div>

                  <span className="text-[12px] font-mono text-slate-400 dark:text-slate-500">
                    {exp.period}
                  </span>
                </div>

                {/* Role & Location Subtitle */}
                <div className="text-[13px] sm:text-[13.5px] text-slate-600 dark:text-slate-400 mb-3.5 flex items-center gap-1.5 font-medium">
                  <span className="text-slate-900 dark:text-slate-200 font-semibold">{exp.role}</span>
                  <span className="text-slate-300 dark:text-slate-700 select-none" aria-hidden="true">
                    ·
                  </span>
                  <span>{exp.location}</span>
                </div>

                {/* What I did — Story-driven Narrative */}
                <div className="mb-4">
                  <h3 className="text-[11px] font-mono font-semibold uppercase tracking-wider text-slate-400 dark:text-slate-500 mb-2.5">
                    What I did
                  </h3>
                  <div className="space-y-3 text-[13.5px] sm:text-[14.5px] text-slate-600 dark:text-slate-300 leading-[1.65]">
                    {exp.narrative.map((paragraph, pIdx) => (
                      <p key={pIdx}>{paragraph}</p>
                    ))}
                  </div>
                </div>

                {/* Technologies Used Badges */}
                {exp.technologies.length > 0 && (
                  <div className="flex flex-wrap gap-1.5 pt-1">
                    {exp.technologies.map((tech) => (
                      <span
                        key={tech}
                        className="rounded-lg bg-slate-100 dark:bg-slate-800 border border-slate-200/60 dark:border-slate-700/60 px-2.5 py-0.5 text-[11px] font-mono font-medium text-slate-700 dark:text-slate-300"
                      >
                        {tech}
                      </span>
                    ))}
                  </div>
                )}
              </div>
            </motion.div>
          );
        })}
      </div>
    </div>
  );
}
