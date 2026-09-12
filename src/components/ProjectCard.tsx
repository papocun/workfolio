'use client';

import React, { useState, useEffect, useRef } from 'react';
import { motion, AnimatePresence, useReducedMotion } from 'framer-motion';
import {
  ArrowRight,
  CaretDown,
  Brain,
  ChartLineUp,
  ChartPieSlice,
  Wallet,
  Taxi,
  Cat,
  Database,
  Code,
  ChartBar,
} from '@phosphor-icons/react';
import { trackProjectViewed, trackGithubClicked, trackProjectDemoClicked } from '@/lib/posthog';
import type { Project } from '@/types';

export interface ProjectCardProps {
  project: Project;
  defaultExpanded?: boolean;
}

function getProjectIcon(project: Project) {
  const iconKey = project.icon || project.id;
  switch (iconKey) {
    case 'brain':
    case 'customer-intelligence-engine':
      return <Brain size={24} weight="regular" className="shrink-0" />;
    case 'chart-line-up':
    case 'demandcast':
      return <ChartLineUp size={24} weight="regular" className="shrink-0" />;
    case 'chart-pie-slice':
    case 'inventory-intelligence-engine':
      return <ChartPieSlice size={24} weight="regular" className="shrink-0" />;
    case 'wallet':
    case 'digital-wallet-analytics':
      return <Wallet size={24} weight="regular" className="shrink-0" />;
    case 'taxi':
    case 'taxi-fare-analysis':
      return <Taxi size={24} weight="regular" className="shrink-0" />;
    case 'cat':
    case 'my-desk-kitty':
      return <Cat size={24} weight="regular" className="shrink-0" />;
    case 'database':
      return <Database size={24} weight="regular" className="shrink-0" />;
    default:
      if (project.projectGroup === 'ml') {
        return <Brain size={24} weight="regular" className="shrink-0" />;
      }
      if (project.projectGroup === 'data-analytics') {
        return <ChartBar size={24} weight="regular" className="shrink-0" />;
      }
      if (project.projectGroup === 'data-engineering') {
        return <Database size={24} weight="regular" className="shrink-0" />;
      }
      return <Code size={24} weight="regular" className="shrink-0" />;
  }
}

export default function ProjectCard({
  project,
  defaultExpanded = false,
}: ProjectCardProps) {
  const [isExpanded, setIsExpanded] = useState(defaultExpanded);
  const cardRef = useRef<HTMLElement>(null);
  const hasTrackedViewRef = useRef(false);
  const shouldReduceMotion = useReducedMotion();

  const contentId = `project-details-${project.id}`;
  const hasMetrics = Boolean(project.impactMetrics && project.impactMetrics.length > 0);

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
      className="group rounded-2xl border border-slate-200/90 dark:border-[#2F3336] bg-white dark:bg-[#16181C] p-4 sm:p-6 shadow-[0px_0px_0px_1px_rgba(0,0,0,0.06),0px_1px_1px_-0.5px_rgba(0,0,0,0.06),0px_3px_3px_-1.5px_rgba(0,0,0,0.06),_0px_6px_6px_-3px_rgba(0,0,0,0.06),0px_12px_12px_-6px_rgba(0,0,0,0.06),0px_24px_24px_-12px_rgba(0,0,0,0.06)] transition-[border-color,box-shadow] duration-200 ease-[cubic-bezier(0.4,0,0.2,1)] hover:border-slate-300 dark:hover:border-slate-700"
    >
      <div className="flex items-start gap-3.5 sm:gap-4.5">
        {/* Left: Large Prominent Domain/Project Icon Container */}
        <div
          aria-hidden="true"
          className="shrink-0 w-11 h-11 sm:w-12 sm:h-12 rounded-xl border border-slate-200/90 dark:border-[#2F3336] bg-slate-50 dark:bg-[#1E2732]/40 flex items-center justify-center text-slate-700 dark:text-slate-200 group-hover:border-slate-300 dark:group-hover:border-slate-600 transition-colors"
        >
          {getProjectIcon(project)}
        </div>

        {/* Center: Information & Metadata */}
        <div className="flex-1 min-w-0">
          <div className="flex items-start justify-between gap-3">
            <div className="flex-1 min-w-0">
              <h3 className="text-[16px] sm:text-[17.5px] font-bold text-slate-900 dark:text-[#E7E9EA] tracking-tight leading-snug text-balance">
                {project.title}
              </h3>
              {project.description && (
                <p className="text-[13.5px] sm:text-[14px] text-slate-600 dark:text-[#8B9198] leading-relaxed mt-1 text-pretty">
                  {project.description}
                </p>
              )}
            </div>

            {/* Right: Actions (GitHub, Live, Expand) */}
            <div className="shrink-0 flex items-center gap-3 sm:gap-3.5 pt-0.5">
              {/* Primary Action: GitHub text link with animated underline */}
              <a
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
                aria-label={`View ${project.title} on GitHub`}
                className="group/github relative inline-flex items-center text-[12.5px] font-mono font-medium text-slate-500 dark:text-slate-400 hover:text-slate-900 dark:hover:text-[#E7E9EA] transition-colors focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-[#1D9BF0] rounded select-none py-0.5"
              >
                <span>GitHub</span>
                <span className="absolute -bottom-0.5 left-0 h-[1.2px] w-full bg-slate-900 dark:bg-[#E7E9EA] origin-left scale-x-0 group-hover/github:scale-x-100 transition-transform duration-200 ease-out" />
              </a>

              {/* Secondary Action: "Live" text link with animated underline (ONLY if liveUrl exists) */}
              {project.liveUrl && (
                <a
                  href={project.liveUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  onClick={() => trackProjectDemoClicked(project.title, project.liveUrl!)}
                  aria-label={`View live project for ${project.title}`}
                  className="group/live relative inline-flex items-center text-[12.5px] font-mono font-medium text-[#1D9BF0] hover:text-[#1A8CD8] transition-colors focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-[#1D9BF0] rounded select-none py-0.5"
                >
                  <span>Live</span>
                  <span className="absolute -bottom-0.5 left-0 h-[1.2px] w-full bg-[#1D9BF0] origin-left scale-x-0 group-hover/live:scale-x-100 transition-transform duration-200 ease-out" />
                </a>
              )}

              {/* Optional Expand Toggle for Impact Metrics */}
              {hasMetrics && (
                <button
                  type="button"
                  onClick={() => setIsExpanded((prev) => !prev)}
                  aria-expanded={isExpanded}
                  aria-controls={contentId}
                  aria-label={
                    isExpanded
                      ? `Collapse details for ${project.title}`
                      : `Expand details for ${project.title}`
                  }
                  className="text-slate-400 dark:text-slate-400 hover:text-slate-900 dark:hover:text-[#E7E9EA] transition-colors p-1 -m-1 rounded focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-[#1D9BF0] cursor-pointer select-none"
                >
                  <CaretDown
                    size={16}
                    weight="bold"
                    className={`transition-transform duration-200 ease-[cubic-bezier(0.16,1,0.3,1)] ${
                      isExpanded ? 'rotate-180 text-[#1D9BF0]' : ''
                    }`}
                  />
                </button>
              )}
            </div>
          </div>

          {/* Technology/Stack Tags */}
          {project.techStack && project.techStack.length > 0 && (
            <div className="flex flex-wrap gap-1.5 mt-3">
              {project.techStack.map((tech: string) => (
                <span
                  key={tech}
                  className="rounded-md bg-slate-100/90 dark:bg-[#16181C] border border-slate-200/90 dark:border-[#2F3336] px-2.5 py-0.5 text-[11.5px] font-mono font-medium text-slate-600 dark:text-slate-300 transition-colors hover:border-slate-300 dark:hover:border-slate-500 shadow-2xs whitespace-nowrap"
                >
                  {tech}
                </span>
              ))}
            </div>
          )}

          {/* Collapsible Impact Metrics / Deep Details */}
          {hasMetrics && (
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
                  <div className="pt-3.5 mt-3 border-t border-slate-100 dark:border-[#2F3336]/80">
                    <ul className="space-y-2">
                      {project.impactMetrics!.map((point: string, i: number) => (
                        <li
                          key={i}
                          className="flex items-start gap-2 text-[13px] sm:text-[13.5px] text-slate-600 dark:text-[#8B9198] leading-[1.6]"
                        >
                          <ArrowRight
                            size={13}
                            weight="bold"
                            className="text-[#1D9BF0] shrink-0 mt-1"
                            aria-hidden="true"
                          />
                          <span className="text-pretty">{point}</span>
                        </li>
                      ))}
                    </ul>
                  </div>
                </motion.div>
              )}
            </AnimatePresence>
          )}
        </div>
      </div>
    </article>
  );
}
