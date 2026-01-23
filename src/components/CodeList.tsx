'use client';

import { motion } from 'framer-motion';
import { InView } from '@/components/core/in-view';

export interface CodeProfile {
  id: string;
  slug: string;
  title: string;
  description: string;
  link: string;
  previewBg: string;
  headlineHighlight: string;
  platformLabel: string;
}

interface CodeListProps {
  profiles: CodeProfile[];
}

const itemVariants = {
  hidden: { opacity: 0, scale: 0.92, filter: 'blur(10px)' },
  visible: {
    opacity: 1,
    scale: 1,
    filter: 'blur(0px)',
    transition: {
      duration: 0.5,
      ease: [0.25, 0.1, 0.25, 1],
    },
  },
};

export default function CodeList({ profiles }: CodeListProps) {
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
        {profiles.map((profile) => (
          <motion.article
            key={profile.id}
            variants={itemVariants}
            className="flex flex-col group"
          >
            {/* Visual Media Box */}
            <div
              className={`aspect-[16/9] w-full rounded-lg border border-slate-200/80 dark:border-slate-800 p-6 sm:p-8 flex flex-col justify-between select-none ${profile.previewBg}`}
            >
              <div className="flex items-center justify-between font-mono text-[11px] text-slate-400">
                <span>{profile.platformLabel}</span>
                <span className="w-1.5 h-1.5 rounded-full bg-slate-400/50" />
              </div>
              <p className="text-[16px] sm:text-[18px] font-medium leading-snug max-w-[520px] font-urbanist text-slate-100">
                {profile.headlineHighlight}
              </p>
            </div>

            {/* Micro Index / Slug */}
            <div className="mt-4 mb-1.5 font-mono text-[12px] text-slate-400 dark:text-slate-500">
              {profile.id} / {profile.slug}
            </div>

            {/* Title */}
            <h2 className="text-[18px] sm:text-[21px] font-bold text-slate-900 dark:text-slate-100 leading-snug tracking-tight font-urbanist mb-2">
              {profile.title}
            </h2>

            {/* Description */}
            <p className="text-[14px] text-slate-600 dark:text-slate-400 leading-[1.55] max-w-[680px] mb-3.5 font-urbanist">
              {profile.description}
            </p>

            {/* Profile Action Link with Expanding Underline */}
            <div>
              <a
                href={profile.link}
                target="_blank"
                rel="noopener noreferrer"
                className="group/link relative inline-flex items-center gap-1.5 font-mono text-[12.5px] text-slate-800 dark:text-slate-300 hover:text-slate-900 dark:hover:text-white pb-0.5 transition-colors"
              >
                <span>view profile</span>
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  width="13"
                  height="13"
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
