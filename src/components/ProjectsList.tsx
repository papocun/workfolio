'use client';

import Image from 'next/image';
import { motion } from 'framer-motion';
import { InView } from '@/components/core/in-view';
import { getAssetPath } from '@/lib/assetPath';

export interface Project {
  id: string;
  slug: string;
  title: string;
  description: string;
  link: string;
  previewBg: string;
  headlineHighlight: string;
  imageSrc?: string;
}

interface ProjectsListProps {
  projects: Project[];
}

const itemVariants = {
  hidden: { opacity: 0, scale: 0.92, filter: 'blur(10px)' },
  visible: {
    opacity: 1,
    scale: 1,
    filter: 'blur(0px)',
    transition: {
      duration: 0.5,
      ease: [0.25, 0.1, 0.25, 1] as const,
    },
  },
};

export default function ProjectsList({ projects }: ProjectsListProps) {
  return (
    <InView
      viewOptions={{ once: true, margin: '0px 0px -100px 0px' }}
      variants={{
        hidden: { opacity: 0 },
        visible: {
          opacity: 1,
          transition: {
            staggerChildren: 0.12,
          },
        },
      }}
    >
      <div className="flex flex-col gap-12 sm:gap-16">
        {projects.map((project) => (
          <motion.article
            key={project.id}
            variants={itemVariants}
            className="flex flex-col group"
          >
            {/* Visual Media Box */}
            <div
              className={`relative aspect-[16/9] w-full overflow-hidden rounded-md border border-slate-200/80 dark:border-slate-800 select-none ${project.previewBg || 'bg-slate-100 dark:bg-slate-900'}`}
            >
              {project.imageSrc ? (
                <Image
                  src={getAssetPath(project.imageSrc)}
                  alt={project.title}
                  fill
                  sizes="(max-width: 680px) 100vw, 680px"
                  className="object-cover object-[20px_center] translate-x-[20px] transition-transform duration-300 group-hover:scale-[1.02]"
                />
              ) : (
                <div className="p-6 sm:p-8 flex flex-col justify-between h-full">
                  <div className="flex items-center justify-between text-[11.5px] text-slate-400">
                    <span>PROJECT_{project.id}</span>
                    <span className="w-1.5 h-1.5 rounded-full bg-slate-400/50" />
                  </div>
                  <p className="text-[15px] sm:text-[17px] font-medium leading-snug max-w-[500px]">
                    {project.headlineHighlight}
                  </p>
                </div>
              )}
            </div>

            {/* Micro Index / Slug */}
            <div className="mt-4 mb-1.5 text-[12px] text-slate-400 dark:text-slate-500 font-mono">
              {project.id} / {project.slug}
            </div>

            {/* Title */}
            <h2 className="text-[18px] sm:text-[21px] font-bold text-slate-900 dark:text-slate-100 leading-snug tracking-tight mb-2">
              {project.title}
            </h2>

            {/* Description */}
            <p className="text-[14px] text-slate-600 dark:text-slate-400 leading-[1.55] max-w-[680px] mb-3.5">
              {project.description}
            </p>

            {/* Link with Phosphor Arrow & Expanding Underline */}
            <div>
              <a
                href={project.link}
                target="_blank"
                rel="noopener noreferrer"
                className="group/link relative inline-flex items-center gap-1.5 text-[13px] text-slate-700 dark:text-slate-300 hover:text-slate-900 dark:hover:text-white pb-0.5 transition-colors font-medium"
              >
                <span>view project</span>
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  width="14"
                  height="14"
                  fill="currentColor"
                  viewBox="0 0 256 256"
                  className="inline-block translate-y-[0.5px]"
                  aria-hidden="true"
                >
                  <path d="M221.66,133.66l-72,72a8,8,0,0,1-11.32-11.32L196.69,136H40a8,8,0,0,1,0-16H196.69L138.34,61.66a8,8,0,0,1,11.32-11.32l72,72A8,8,0,0,1,221.66,133.66Z" />
                </svg>
                <span className="absolute bottom-0 left-0 h-[1px] w-full bg-slate-900 dark:bg-slate-100 origin-left scale-x-0 group-hover/link:scale-x-100 transition-transform duration-200 ease-out" />
              </a>
            </div>
          </motion.article>
        ))}
      </div>
    </InView>
  );
}
