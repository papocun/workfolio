'use client';

import React, { useState, useEffect, useRef } from 'react';
import Image from 'next/image';
import { motion, AnimatePresence, useReducedMotion } from 'framer-motion';
import { ArrowRight, CaretDown, CaretUp } from '@phosphor-icons/react';
import { getAssetPath } from '@/lib/assetPath';
import { trackProjectViewed, trackGithubClicked, trackProjectDemoClicked } from '@/lib/posthog';
import type { Project } from '@/types';

export interface ProjectCardProps {
  project: Project;
  defaultExpanded?: boolean;
}

export default function ProjectCard({
  project,
  defaultExpanded = false,
}: ProjectCardProps) {
  // Standalone Expandable State for this project card
  const [isExpanded, setIsExpanded] = useState(defaultExpanded);
  const cardRef = useRef<HTMLElement>(null);
  const hasTrackedViewRef = useRef(false);
  const shouldReduceMotion = useReducedMotion();

  const contentId = `project-details-${project.id}`;

  // PostHog analytics intersection observer
  useEffect(() => {
    const currentEl = cardRef.current;
    if (!currentEl || hasTrackedViewRef.current) return;

    const observer = new IntersectionObserver(
      (entries) => {
        const entry = entries[0];
        if (entry.isIntersecting && !hasTrackedViewRef.current) {
          hasTrackedViewRef.current = true;
          trackProjectViewed(project.title, {
            project_id: project.id,
            category: project.category,
          });
          observer.disconnect();
        }
      },
      { threshold: 0.3 }
    );

    observer.observe(currentEl);

    return () => {
      observer.disconnect();
    };
  }, [project.title, project.id, project.category]);

  return (
    <article
      ref={cardRef}
      className="group rounded-2xl border border-slate-200/90 dark:border-slate-800/90 bg-white dark:bg-[#16181C] p-4 sm:p-7 shadow-[0px_0px_0px_1px_rgba(0,0,0,0.06),0px_1px_1px_-0.5px_rgba(0,0,0,0.06),0px_3px_3px_-1.5px_rgba(0,0,0,0.06),_0px_6px_6px_-3px_rgba(0,0,0,0.06),0px_12px_12px_-6px_rgba(0,0,0,0.06),0px_24px_24px_-12px_rgba(0,0,0,0.06)] transition-[border-color,box-shadow] duration-200 ease-[cubic-bezier(0.4,0,0.2,1)] hover:border-slate-300 dark:hover:border-slate-700"
    >
      {/* 1. Wide Project Image/Banner (Always Visible in Card) */}
      {project.imageSrc && (
        <div className="relative aspect-[16/6] sm:aspect-[4/1] w-full mb-4 sm:mb-5 overflow-hidden rounded-xl outline outline-1 outline-[oklch(0_0_0/0.1)] dark:outline-[oklch(1_0_0/0.1)] -outline-offset-1 bg-slate-950 flex items-center justify-center select-none">
          <Image
            src={getAssetPath(project.imageSrc)}
            alt={project.title}
            fill
            sizes="(max-width: 640px) 100vw, (max-width: 1024px) 90vw, 680px"
            className="object-cover object-center transition-transform duration-250 ease-out group-hover:scale-[1.01]"
          />
        </div>
      )}

      {/* 2. Project Header Row: Title, Description & Expand Chevron */}
      <div className="flex items-start justify-between gap-3">
        <div className="flex-1 min-w-0">
          <h2 className="text-[20px] sm:text-[24px] font-bold text-slate-900 dark:text-slate-100 tracking-tight leading-snug text-balance">
            {project.title}
          </h2>
          {project.description && (
            <p className="text-[14.5px] sm:text-[15px] text-slate-600 dark:text-slate-400 leading-relaxed mt-1 text-pretty">
              {project.description}
            </p>
          )}
        </div>

        {/* Down/Up Arrow Clickable Button */}
        <button
          type="button"
          onClick={() => setIsExpanded((prev) => !prev)}
          aria-expanded={isExpanded}
          aria-controls={contentId}
          aria-label={
            isExpanded
              ? `Collapse ${project.title}`
              : `Expand ${project.title}`
          }
          className={`shrink-0 p-2 rounded-lg border border-slate-200 dark:border-slate-800/80 bg-slate-50 dark:bg-slate-800/60 hover:bg-slate-100 dark:hover:bg-slate-700/80 text-slate-600 hover:text-slate-900 dark:text-slate-400 dark:hover:text-slate-100 active:scale-[0.96] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#1D9BF0] transition-[border-color,background-color,color,transform] duration-150 cursor-pointer mt-0.5 ${
            isExpanded
              ? 'text-[#1D9BF0] dark:text-[#1D9BF0] border-[#1D9BF0]/40 dark:border-[#1D9BF0]/40'
              : ''
          }`}
        >
          <CaretDown
            size={16}
            weight="bold"
            className={`transition-transform duration-200 ease-[cubic-bezier(0.16,1,0.3,1)] ${
              isExpanded ? 'rotate-180' : 'rotate-0'
            }`}
          />
        </button>
      </div>

      {/* 3. Collapsible Lower Content (Tech Stack, Bullets, Links) */}
      <AnimatePresence initial={false}>
        {isExpanded && (
          <motion.div
            id={contentId}
            key="expanded-details"
            initial={shouldReduceMotion ? { opacity: 0 } : { opacity: 0, height: 0 }}
            animate={shouldReduceMotion ? { opacity: 1 } : { opacity: 1, height: 'auto' }}
            exit={shouldReduceMotion ? { opacity: 0 } : { opacity: 0, height: 0 }}
            transition={
              shouldReduceMotion
                ? { duration: 0 }
                : { duration: 0.2, ease: [0.16, 1, 0.3, 1] }
            }
            className="overflow-hidden"
          >
            <div className="pt-4 sm:pt-5 mt-3 sm:mt-4 border-t border-slate-100 dark:border-slate-800/80">
              {/* Technology Stack */}
              <div className="mb-4 sm:mb-5">
                <span className="block text-[12px] font-mono font-semibold uppercase tracking-wider text-slate-500 dark:text-slate-400 mb-2 select-none">
                  Tech Stack
                </span>
                <div className="flex flex-wrap gap-1.5">
                  {project.techStack.map((tech: string) => (
                    <span
                      key={tech}
                      className="rounded-md bg-slate-100/90 dark:bg-[#16181C] border border-slate-200/90 dark:border-[#2F3336] px-3 py-1 text-[12px] font-mono font-medium text-slate-700 dark:text-slate-300 transition-colors hover:border-slate-300 dark:hover:border-slate-500 shadow-2xs whitespace-nowrap"
                    >
                      {tech}
                    </span>
                  ))}
                </div>
              </div>

              {/* Concise Project Points */}
              {project.impactMetrics && project.impactMetrics.length > 0 && (
                <ul className="space-y-2.5 mb-5 sm:mb-6">
                  {project.impactMetrics.map((point: string, i: number) => (
                    <li
                      key={i}
                      className="flex items-start gap-2.5 text-[14px] sm:text-[15px] text-slate-600 dark:text-slate-400 leading-[1.65]"
                    >
                      <ArrowRight
                        size={14}
                        weight="bold"
                        className="text-[#1D9BF0] shrink-0 mt-1"
                        aria-hidden="true"
                      />
                      <span className="text-pretty">{point}</span>
                    </li>
                  ))}
                </ul>
              )}

              {/* GitHub / Live Demo Buttons */}
              <div className="flex flex-wrap items-center gap-3 pt-4 border-t border-slate-100 dark:border-slate-800/80 font-mono text-[13px]">
                <motion.a
                  href={project.githubUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  onClick={() =>
                    trackGithubClicked({
                      project_name: project.title,
                      location: 'project_card',
                      url: project.githubUrl,
                    })
                  }
                  whileHover={shouldReduceMotion ? undefined : { scale: 1.02 }}
                  whileTap={shouldReduceMotion ? undefined : { scale: 0.97 }}
                  transition={{ type: 'spring', stiffness: 400, damping: 17 }}
                  className="inline-flex items-center gap-1.5 px-3.5 py-2 rounded-lg border border-slate-200 dark:border-slate-700/80 bg-white dark:bg-[#16181C] hover:bg-slate-50 dark:hover:bg-[#1E2732] text-slate-800 dark:text-slate-200 hover:text-slate-950 dark:hover:text-white transition-[border-color,background-color,color] duration-150 shadow-2xs hover:border-slate-300 dark:hover:border-slate-500 font-medium group/btn cursor-pointer"
                >
                  <span>GitHub</span>
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    width="12"
                    height="12"
                    fill="currentColor"
                    viewBox="0 0 256 256"
                    className="translate-y-[0.5px] transition-transform duration-200 ease-out group-hover/btn:translate-x-0.5 group-hover/btn:-translate-y-0.5 shrink-0"
                    aria-hidden="true"
                  >
                    <path d="M200,64V168a8,8,0,0,1-16,0V83.31L69.66,197.66a8,8,0,0,1-11.32-11.32L172.69,72H88a8,8,0,0,1,0-16H192A8,8,0,0,1,200,64Z" />
                  </svg>
                </motion.a>

                {project.liveUrl && (
                  <motion.a
                    href={project.liveUrl}
                    target="_blank"
                    rel="noopener noreferrer"
                    onClick={() => trackProjectDemoClicked(project.title, project.liveUrl)}
                    whileHover={shouldReduceMotion ? undefined : { scale: 1.02 }}
                    whileTap={shouldReduceMotion ? undefined : { scale: 0.97 }}
                    transition={{ type: 'spring', stiffness: 400, damping: 17 }}
                    className="inline-flex items-center gap-1.5 px-3.5 py-2 rounded-lg border border-[#1D9BF0]/30 hover:border-[#1D9BF0] bg-[#1D9BF0]/10 hover:bg-[#1D9BF0]/20 text-[#1D9BF0] font-medium transition-[border-color,background-color,color] duration-150 shadow-2xs group/btn cursor-pointer"
                  >
                    <span>Live Demo</span>
                    <svg
                      xmlns="http://www.w3.org/2000/svg"
                      width="12"
                      height="12"
                      fill="currentColor"
                      viewBox="0 0 256 256"
                      className="translate-y-[0.5px] transition-transform duration-200 ease-out group-hover/btn:translate-x-0.5 group-hover/btn:-translate-y-0.5 shrink-0"
                      aria-hidden="true"
                    >
                      <path d="M200,64V168a8,8,0,0,1-16,0V83.31L69.66,197.66a8,8,0,0,1-11.32-11.32L172.69,72H88a8,8,0,0,1,0-16H192A8,8,0,0,1,200,64Z" />
                    </svg>
                  </motion.a>
                )}
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </article>
  );
}
