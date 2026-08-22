'use client';

import React, { useEffect, useRef } from 'react';
import Image from 'next/image';
import { getAssetPath } from '@/lib/assetPath';
import type { Project } from '@/types';
import {
  trackProjectViewed,
  trackGithubClicked,
  trackProjectDemoClicked,
} from '@/lib/posthog';

interface ProjectCardProps {
  project: Project;
}

export default function ProjectCard({ project }: ProjectCardProps) {
  const cardRef = useRef<HTMLElement>(null);
  const hasTrackedViewRef = useRef(false);

  useEffect(() => {
    if (hasTrackedViewRef.current) return;

    const currentEl = cardRef.current;
    if (!currentEl) return;

    const observer = new IntersectionObserver(
      (entries) => {
        const [entry] = entries;
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
      className="group rounded-2xl border border-slate-200/90 dark:border-slate-800/90 bg-white dark:bg-[#16181C] p-4 sm:p-7 shadow-xs dark:shadow-md transition-all duration-200 ease-[cubic-bezier(0.4,0,0.2,1)] hover:border-slate-400 dark:hover:border-slate-700"
    >
      {/* 1. Wide Project Image/Banner (~2000x500 cinematic ratio) */}
      {project.imageSrc && (
        <div className="relative aspect-[16/6] sm:aspect-[4/1] w-full mb-4 sm:mb-6 overflow-hidden rounded-xl border border-slate-200/70 dark:border-slate-800/80 bg-slate-950 flex items-center justify-center select-none">
          <Image
            src={getAssetPath(project.imageSrc)}
            alt={project.title}
            fill
            sizes="(max-width: 640px) 100vw, (max-width: 1024px) 90vw, 680px"
            className="object-cover object-center transition-transform duration-250 ease-out group-hover:scale-[1.01]"
          />
        </div>
      )}

      {/* 2. Project Name */}
      <h2 className="text-[18px] sm:text-[22px] font-bold text-slate-900 dark:text-slate-100 tracking-tight leading-snug mb-2 sm:mb-2.5">
        {project.title}
      </h2>

      {/* 3. Technology Stack Pills */}
      <div className="flex flex-wrap gap-1.5 mb-4 sm:mb-5">
        {project.techStack.map((tech) => (
          <span
            key={tech}
            className="rounded-md bg-slate-100 dark:bg-slate-800/90 border border-slate-200/60 dark:border-slate-700/60 px-2.5 py-0.5 text-[11px] font-mono font-medium text-slate-700 dark:text-slate-300"
          >
            {tech}
          </span>
        ))}
      </div>

      {/* 4. Three Concise Project Points */}
      {project.impactMetrics && project.impactMetrics.length > 0 && (
        <ul className="space-y-2.5 mb-5 sm:mb-6">
          {project.impactMetrics.map((point, i) => (
            <li
              key={i}
              className="flex items-start gap-2.5 text-[13px] sm:text-[13.5px] text-slate-600 dark:text-slate-400 leading-[1.6]"
            >
              <span
                className="mt-[7px] h-1.5 w-1.5 shrink-0 rounded-full bg-[#1D9BF0]"
                aria-hidden="true"
              />
              <span>{point}</span>
            </li>
          ))}
        </ul>
      )}

      {/* 5. GitHub / Live Demo Links */}
      <div className="flex items-center gap-5 pt-3.5 border-t border-slate-100 dark:border-slate-800/80 font-mono text-[12px]">
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
          className="group/link relative inline-flex items-center gap-1 text-slate-700 dark:text-slate-300 hover:text-slate-900 dark:hover:text-white transition-colors duration-150 ease-[cubic-bezier(0.4,0,0.2,1)] py-0.5"
        >
          <span>GitHub</span>
          <svg
            xmlns="http://www.w3.org/2000/svg"
            width="11"
            height="11"
            fill="currentColor"
            viewBox="0 0 256 256"
            className="translate-y-[0.5px] opacity-70 group-hover:opacity-100 transition-opacity duration-150 ease-[cubic-bezier(0.4,0,0.2,1)]"
          >
            <path d="M200,64V168a8,8,0,0,1-16,0V83.31L69.66,197.66a8,8,0,0,1-11.32-11.32L172.69,72H88a8,8,0,0,1,0-16H192A8,8,0,0,1,200,64Z" />
          </svg>
          <span className="absolute bottom-0 left-0 h-[1px] w-full bg-slate-900 dark:bg-slate-100 origin-left scale-x-0 group-hover/link:scale-x-100 transition-transform duration-200 ease-out" />
        </a>

        {project.liveUrl && (
          <a
            href={project.liveUrl}
            target="_blank"
            rel="noopener noreferrer"
            onClick={() =>
              trackProjectDemoClicked(project.title, project.liveUrl)
            }
            className="group/link relative inline-flex items-center gap-1 text-[#1D9BF0] hover:text-[#1a8cd8] transition-colors duration-150 ease-[cubic-bezier(0.4,0,0.2,1)] py-0.5"
          >
            <span>Live Demo</span>
            <svg
              xmlns="http://www.w3.org/2000/svg"
              width="11"
              height="11"
              fill="currentColor"
              viewBox="0 0 256 256"
              className="translate-y-[0.5px] opacity-80 group-hover:opacity-100 transition-opacity duration-150 ease-[cubic-bezier(0.4,0,0.2,1)]"
            >
              <path d="M200,64V168a8,8,0,0,1-16,0V83.31L69.66,197.66a8,8,0,0,1-11.32-11.32L172.69,72H88a8,8,0,0,1,0-16H192A8,8,0,0,1,200,64Z" />
            </svg>
            <span className="absolute bottom-0 left-0 h-[1px] w-full bg-[#1D9BF0] origin-left scale-x-0 group-hover/link:scale-x-100 transition-transform duration-200 ease-out" />
          </a>
        )}
      </div>
    </article>
  );
}
