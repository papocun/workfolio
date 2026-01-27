'use client';

import React, { useRef } from 'react';
import Image from 'next/image';
import { motion, useScroll, useTransform, MotionValue } from 'framer-motion';
import { getAssetPath } from '@/lib/assetPath';

export interface ProjectItem {
  id: string;
  slug: string;
  title: string;
  headlineHighlight: string;
  description: string;
  technologies: string[];
  githubUrl: string;
  liveDemoUrl?: string;
  previewBg: string;
  imageSrc?: string;
}

interface ProjectsStackingCardsProps {
  projects: ProjectItem[];
}

interface StackingCardProps {
  project: ProjectItem;
  index: number;
  total: number;
  progress: MotionValue<number>;
  range: [number, number];
  targetScale: number;
}

function ProjectStackCard({
  project,
  index,
  total,
  progress,
  range,
  targetScale,
}: StackingCardProps) {
  const cardContainerRef = useRef<HTMLDivElement>(null);

  // Transform scale as scroll progresses
  const scale = useTransform(progress, range, [1, targetScale]);

  return (
    <div
      ref={cardContainerRef}
      className="sticky top-16 sm:top-20 flex items-center justify-center mb-8 sm:mb-10 last:mb-0"
    >
      <motion.article
        style={{
          scale,
          top: `calc(${index * 14}px)`,
        }}
        className="w-full max-w-[680px] rounded-xl border border-slate-200/90 dark:border-slate-800/90 bg-white dark:bg-[#0f1422] p-4 sm:p-5 shadow-sm dark:shadow-xl transition-colors duration-200 origin-top flex flex-col group"
      >
        {/* Compact Visual Media Frame */}
        <div
          className={`relative h-[130px] sm:h-[155px] w-full rounded-lg border border-slate-200/80 dark:border-slate-800 overflow-hidden select-none ${project.previewBg}`}
        >
          {project.imageSrc ? (
            <div className="relative w-full h-full bg-slate-100 dark:bg-slate-900">
              <Image
                src={getAssetPath(project.imageSrc)}
                alt={project.title}
                fill
                sizes="(max-width: 680px) 100vw, 680px"
                className="object-cover object-center transition-transform duration-300 group-hover:scale-[1.02]"
              />
            </div>
          ) : (
            <div className="p-4 sm:p-5 flex flex-col justify-between h-full">
              <div className="flex items-center justify-between font-mono text-[10.5px] text-slate-400">
                <span>PROJECT_{project.id}</span>
                <span className="w-1.5 h-1.5 rounded-full bg-slate-400/50" />
              </div>
              <p className="text-[13.5px] sm:text-[15px] font-medium leading-snug max-w-[520px] text-slate-100">
                {project.headlineHighlight}
              </p>
            </div>
          )}
        </div>

        {/* Micro Index / Slug */}
        <div className="mt-3 mb-1 text-[11px] font-mono text-slate-400 dark:text-slate-500">
          {project.id} / {project.slug}
        </div>

        {/* Project Name */}
        <h2 className="text-[16px] sm:text-[18px] font-bold text-slate-900 dark:text-slate-100 leading-snug tracking-tight mb-1.5">
          {project.title}
        </h2>

        {/* Short Technical Description */}
        <p className="text-[12.5px] sm:text-[13.5px] text-slate-600 dark:text-slate-300 leading-[1.55] max-w-[640px] mb-3.5">
          {project.description}
        </p>

        {/* Technologies Used */}
        <div className="flex flex-wrap gap-1.5 mb-3.5">
          {project.technologies.map((tech) => (
            <span
              key={tech}
              className="rounded-lg bg-slate-100 dark:bg-slate-800/90 border border-slate-200/60 dark:border-slate-700/60 px-2.5 py-0.5 text-[10.5px] font-mono font-medium text-slate-700 dark:text-slate-300"
            >
              {tech}
            </span>
          ))}
        </div>

        {/* Footer Links & Counter */}
        <div className="pt-2 border-t border-slate-100 dark:border-slate-800/80 flex justify-between items-center text-[12px] font-mono">
          {/* Subtle GitHub & Live Demo Links */}
          <div className="flex items-center gap-4">
            <a
              href={project.githubUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="group/link relative inline-flex items-center gap-1 text-slate-700 dark:text-slate-300 hover:text-slate-900 dark:hover:text-white transition-colors py-0.5"
            >
              <span>GitHub</span>
              <svg
                xmlns="http://www.w3.org/2000/svg"
                width="11"
                height="11"
                fill="currentColor"
                viewBox="0 0 256 256"
                className="translate-y-[0.5px] opacity-70 group-hover/link:opacity-100 transition-opacity"
              >
                <path d="M200,64V168a8,8,0,0,1-16,0V83.31L69.66,197.66a8,8,0,0,1-11.32-11.32L172.69,72H88a8,8,0,0,1,0-16H192A8,8,0,0,1,200,64Z" />
              </svg>
              <span className="absolute bottom-0 left-0 h-[1px] w-full bg-slate-900 dark:bg-slate-100 origin-left scale-x-0 group-hover/link:scale-x-100 transition-transform duration-200 ease-out" />
            </a>

            {project.liveDemoUrl && (
              <a
                href={project.liveDemoUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="group/link relative inline-flex items-center gap-1 text-[#ff3131] dark:text-[#ff4d4d] hover:text-[#e02828] dark:hover:text-[#ff6666] transition-colors py-0.5"
              >
                <span>Live Demo</span>
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  width="11"
                  height="11"
                  fill="currentColor"
                  viewBox="0 0 256 256"
                  className="translate-y-[0.5px] opacity-80 group-hover:opacity-100 transition-opacity"
                >
                  <path d="M200,64V168a8,8,0,0,1-16,0V83.31L69.66,197.66a8,8,0,0,1-11.32-11.32L172.69,72H88a8,8,0,0,1,0-16H192A8,8,0,0,1,200,64Z" />
                </svg>
                <span className="absolute bottom-0 left-0 h-[1px] w-full bg-[#ff3131] dark:bg-[#ff4d4d] origin-left scale-x-0 group-hover:scale-x-100 transition-transform duration-200 ease-out" />
              </a>
            )}
          </div>

          <span className="font-mono text-[10.5px] text-slate-400">
            0{index + 1} / 0{total}
          </span>
        </div>
      </motion.article>
    </div>
  );
}

export default function ProjectsStackingCards({
  projects,
}: ProjectsStackingCardsProps) {
  const containerRef = useRef<HTMLDivElement>(null);

  const { scrollYProgress } = useScroll({
    target: containerRef,
    offset: ['start start', 'end end'],
  });

  return (
    <div ref={containerRef} className="relative w-full pb-8">
      {projects.map((project, index) => {
        const targetScale = 1 - (projects.length - index) * 0.035;
        const startRange = index * (1 / projects.length);

        return (
          <ProjectStackCard
            key={project.id}
            project={project}
            index={index}
            total={projects.length}
            progress={scrollYProgress}
            range={[startRange, 1]}
            targetScale={targetScale}
          />
        );
      })}
    </div>
  );
}
