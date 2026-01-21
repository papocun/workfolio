'use client';

import React, { useState, useEffect } from 'react';
import { TransitionPanel } from '@/components/core/transition-panel';

export interface ExperienceItem {
  id: string;
  role: string;
  company: string;
  location: string;
  period: string;
  bullets: string[];
  technologies?: string[];
}

interface ExperienceTransitionPanelProps {
  experiences: ExperienceItem[];
}

export default function ExperienceTransitionPanel({
  experiences,
}: ExperienceTransitionPanelProps) {
  const [activeIndex, setActiveIndex] = useState(0);
  const [direction, setDirection] = useState(1);

  const handleSetActiveIndex = (newIndex: number) => {
    if (newIndex === activeIndex) return;
    setDirection(newIndex > activeIndex ? 1 : -1);
    setActiveIndex(newIndex);
  };

  useEffect(() => {
    if (activeIndex < 0) setActiveIndex(0);
    if (activeIndex >= experiences.length) setActiveIndex(experiences.length - 1);
  }, [activeIndex, experiences.length]);

  const variants = {
    enter: (dir: number) => ({
      x: dir > 0 ? 40 : -40,
      opacity: 0,
      filter: 'blur(4px)',
    }),
    center: {
      zIndex: 1,
      x: 0,
      opacity: 1,
      filter: 'blur(0px)',
    },
    exit: (dir: number) => ({
      zIndex: 0,
      x: dir < 0 ? 40 : -40,
      opacity: 0,
      filter: 'blur(4px)',
      position: 'absolute' as const,
      top: 0,
      left: 0,
      width: '100%',
    }),
  };

  return (
    <div className="w-full rounded-xl border border-slate-200/90 dark:border-slate-800/90 bg-white dark:bg-[#0f1422] p-5 sm:p-7 shadow-sm dark:shadow-xl transition-colors duration-200">
      {/* Platform / Company Tabs Header */}
      <div className="flex items-center justify-between border-b border-slate-100 dark:border-slate-800/80 pb-4 mb-6">
        <div className="flex items-center gap-2">
          {experiences.map((exp, index) => {
            const isActive = activeIndex === index;
            return (
              <button
                key={exp.id}
                type="button"
                onClick={() => handleSetActiveIndex(index)}
                className={`relative px-3 py-1.5 rounded-lg text-[12px] font-mono transition-all duration-150 flex items-center gap-2 cursor-pointer ${
                  isActive
                    ? 'bg-slate-900 dark:bg-slate-100 text-white dark:text-slate-950 font-medium shadow-xs'
                    : 'text-slate-500 dark:text-slate-400 hover:text-slate-900 dark:hover:text-slate-100 hover:bg-slate-100 dark:hover:bg-slate-800'
                }`}
              >
                <span>
                  0{index + 1} / {exp.company}
                </span>
                {isActive && (
                  <span className="w-1.5 h-1.5 rounded-full bg-[#ff3131] animate-pulse" />
                )}
              </button>
            );
          })}
        </div>

        {/* Counter Badge */}
        <span className="font-mono text-[11.5px] text-slate-400 dark:text-slate-500 hidden sm:inline-block">
          {String(activeIndex + 1).padStart(2, '0')} / {String(experiences.length).padStart(2, '0')}
        </span>
      </div>

      {/* Animated Sliding Transition Panel */}
      <TransitionPanel
        activeIndex={activeIndex}
        custom={direction}
        variants={variants}
        transition={{
          x: { type: 'spring', stiffness: 300, damping: 30 },
          opacity: { duration: 0.2 },
          filter: { duration: 0.2 },
        }}
      >
        {experiences.map((exp) => (
          <div key={exp.id} className="min-h-[200px] flex flex-col justify-between">
            <div>
              {/* Role Header & Period */}
              <div className="flex flex-col sm:flex-row sm:items-baseline justify-between gap-1 mb-1">
                <h2 className="text-[17px] sm:text-[19px] font-bold text-slate-900 dark:text-slate-100 tracking-tight">
                  {exp.role}
                </h2>
                <span className="text-[12px] font-mono text-slate-400 dark:text-slate-500">
                  {exp.period}
                </span>
              </div>

              {/* Company & Location Subhead */}
              <div className="text-[13px] text-slate-600 dark:text-slate-400 mb-4 flex items-center gap-1.5 font-medium">
                <span className="text-slate-900 dark:text-slate-200 font-semibold">{exp.company}</span>
                <span className="text-slate-300 dark:text-slate-700 select-none" aria-hidden="true">
                  ·
                </span>
                <span>{exp.location}</span>
              </div>

              {/* Bullets */}
              <ul className="space-y-2.5 text-[13px] sm:text-[13.5px] text-slate-600 dark:text-slate-300 leading-[1.6] mb-5">
                {exp.bullets.map((bullet, idx) => (
                  <li key={idx} className="flex items-start">
                    <span
                      className="text-slate-400 dark:text-slate-500 mr-2.5 select-none shrink-0 font-mono"
                      aria-hidden="true"
                    >
                      —
                    </span>
                    <span>{bullet}</span>
                  </li>
                ))}
              </ul>

              {/* Technologies (if provided) */}
              {exp.technologies && exp.technologies.length > 0 && (
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
          </div>
        ))}
      </TransitionPanel>

      {/* Footer Controls */}
      <div className="flex items-center justify-between border-t border-slate-100 dark:border-slate-800/80 pt-4 mt-4">
        <button
          type="button"
          onClick={() => handleSetActiveIndex(activeIndex - 1)}
          disabled={activeIndex === 0}
          className={`px-3 py-1.5 rounded-lg text-[12px] font-medium font-mono transition-colors flex items-center gap-1.5 cursor-pointer ${
            activeIndex === 0
              ? 'opacity-25 cursor-not-allowed text-slate-400 dark:text-slate-600'
              : 'text-slate-700 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-800 hover:text-slate-900 dark:hover:text-slate-100'
          }`}
        >
          <svg
            xmlns="http://www.w3.org/2000/svg"
            width="13"
            height="13"
            fill="currentColor"
            viewBox="0 0 256 256"
            className="rotate-180"
          >
            <path d="M221.66,133.66l-72,72a8,8,0,0,1-11.32-11.32L196.69,136H40a8,8,0,0,1,0-16H196.69L138.34,61.66a8,8,0,0,1,11.32-11.32l72,72A8,8,0,0,1,221.66,133.66Z" />
          </svg>
          <span>Previous</span>
        </button>

        <div className="flex items-center gap-1.5">
          {experiences.map((_, i) => (
            <button
              key={i}
              type="button"
              onClick={() => handleSetActiveIndex(i)}
              aria-label={`Go to experience ${i + 1}`}
              className={`h-1.5 rounded-full transition-all duration-200 cursor-pointer ${
                activeIndex === i
                  ? 'w-5 bg-slate-900 dark:bg-slate-100'
                  : 'w-1.5 bg-slate-200 dark:bg-slate-800 hover:bg-slate-300 dark:hover:bg-slate-700'
              }`}
            />
          ))}
        </div>

        <button
          type="button"
          onClick={() => handleSetActiveIndex(activeIndex + 1)}
          disabled={activeIndex === experiences.length - 1}
          className={`px-3 py-1.5 rounded-lg text-[12px] font-medium font-mono transition-colors flex items-center gap-1.5 cursor-pointer ${
            activeIndex === experiences.length - 1
              ? 'opacity-25 cursor-not-allowed text-slate-400 dark:text-slate-600'
              : 'text-slate-700 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-800 hover:text-slate-900 dark:hover:text-slate-100'
          }`}
        >
          <span>Next</span>
          <svg
            xmlns="http://www.w3.org/2000/svg"
            width="13"
            height="13"
            fill="currentColor"
            viewBox="0 0 256 256"
          >
            <path d="M221.66,133.66l-72,72a8,8,0,0,1-11.32-11.32L196.69,136H40a8,8,0,0,1,0-16H196.69L138.34,61.66a8,8,0,0,1,11.32-11.32l72,72A8,8,0,0,1,221.66,133.66Z" />
          </svg>
        </button>
      </div>
    </div>
  );
}
