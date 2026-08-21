'use client';

import { motion } from 'framer-motion';
import { InView } from '@/components/core/in-view';

export interface ExperienceItem {
  id: string;
  role: string;
  company: string;
  location: string;
  period: string;
  bullets: string[];
}

interface ExperienceListProps {
  experiences: ExperienceItem[];
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

export default function ExperienceList({ experiences }: ExperienceListProps) {
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
      <div className="flex flex-col gap-6">
        {experiences.map((exp) => (
          <motion.article
            key={exp.id}
            variants={itemVariants}
            className="rounded-lg border border-slate-200/90 bg-white p-5 sm:p-6 transition-all duration-150 hover:border-slate-300"
          >
            {/* Role Header & Date */}
            <div className="flex flex-col sm:flex-row sm:items-baseline justify-between gap-1">
              <h2 className="text-[16px] sm:text-[18px] font-bold text-slate-900 tracking-tight">
                {exp.role}
              </h2>
              <span className="text-[12.5px] text-slate-400 font-medium">
                {exp.period}
              </span>
            </div>

            {/* Company & Location */}
            <div className="text-[13px] text-slate-600 mt-1 mb-4 flex items-center gap-1.5 font-medium">
              <span className="text-slate-900 font-semibold">{exp.company}</span>
              <span className="text-slate-300 select-none" aria-hidden="true">
                ·
              </span>
              <span className="text-slate-500">{exp.location}</span>
            </div>

            {/* Bullet Points */}
            <ul className="space-y-2 text-[13.5px] sm:text-[14px] text-slate-600 leading-[1.55]">
              {exp.bullets.map((bullet, idx) => (
                <li key={idx} className="flex items-start">
                  <span
                    className="text-slate-400 mr-2 select-none shrink-0"
                    aria-hidden="true"
                  >
                    —
                  </span>
                  <span>{bullet}</span>
                </li>
              ))}
            </ul>
          </motion.article>
        ))}
      </div>
    </InView>
  );
}
