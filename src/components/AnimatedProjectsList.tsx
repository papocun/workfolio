'use client';

import React from 'react';
import { InView } from '@/components/core/in-view';
import ProjectCard from '@/components/ProjectCard';
import { PROJECT_CATEGORIES } from '@/data/portfolioData';
import { Project } from '@/types';
import { useReducedMotion } from 'framer-motion';

interface AnimatedProjectsListProps {
  projects: Project[];
}

export default function AnimatedProjectsList({
  projects,
}: AnimatedProjectsListProps) {
  const shouldReduceMotion = useReducedMotion();

  const variants = shouldReduceMotion
    ? {
        hidden: { opacity: 0 },
        visible: { opacity: 1 },
      }
    : {
        hidden: {
          opacity: 0,
          y: 16,
        },
        visible: {
          opacity: 1,
          y: 0,
        },
      };

  // Group projects by category
  const getProjectsForCategory = (categoryId: string) => {
    return projects.filter((p) => {
      if (p.projectGroup) {
        return p.projectGroup === categoryId;
      }
      // Fallback classification based on project ID / category string
      if (categoryId === 'ml') {
        return (
          p.id === 'customer-intelligence-engine' ||
          p.id === 'demandcast' ||
          p.category?.toLowerCase().includes('ml')
        );
      }
      if (categoryId === 'data-engineering') {
        return p.category?.toLowerCase().includes('engineering');
      }
      if (categoryId === 'data-analytics') {
        return (
          p.id === 'inventory-intelligence-engine' ||
          p.id === 'digital-wallet-analytics' ||
          p.id === 'taxi-fare-analysis' ||
          p.category?.toLowerCase().includes('analytics') ||
          p.category?.toLowerCase().includes('sql')
        );
      }
      if (categoryId === 'python') {
        return (
          p.id === 'my-desk-kitty' ||
          p.category?.toLowerCase().includes('python') ||
          p.category?.toLowerCase().includes('desktop')
        );
      }
      return false;
    });
  };

  return (
    <div className="flex flex-col gap-10 sm:gap-12">
      {PROJECT_CATEGORIES.map((category, catIndex) => {
        const categoryProjects = getProjectsForCategory(category.id);

        return (
          <InView
            key={category.id}
            viewOptions={{
              margin: '0px 0px -40px 0px',
              once: true,
            }}
            variants={variants}
            transition={{
              duration: 0.3,
              ease: 'easeOut',
              delay: shouldReduceMotion ? 0 : catIndex * 0.06,
            }}
          >
            <section aria-labelledby={`heading-${category.id}`}>
              {/* Category Header */}
              <div className="mb-3.5 sm:mb-4">
                <div className="flex items-center justify-between gap-3">
                  <h2
                    id={`heading-${category.id}`}
                    className="text-[17px] sm:text-[19px] font-bold text-slate-900 dark:text-slate-100 tracking-tight"
                  >
                    {category.title}
                  </h2>
                  <span className="text-[12px] font-mono text-slate-600 dark:text-slate-400 tabular-nums">
                    {categoryProjects.length > 0
                      ? `${categoryProjects.length} ${
                          categoryProjects.length === 1 ? 'project' : 'projects'
                        }`
                      : '0 projects'}
                  </span>
                </div>
                {category.description && (
                  <p className="text-[13px] sm:text-[13.5px] text-slate-500 dark:text-slate-400 mt-0.5 text-pretty">
                    {category.description}
                  </p>
                )}
                {/* Visual division line */}
                <div className="h-px bg-slate-200/80 dark:bg-[#2F3336]/60 mt-3" />
              </div>

              {/* Projects in this category */}
              {categoryProjects.length > 0 ? (
                <div className="flex flex-col gap-3.5 sm:gap-4">
                  {categoryProjects.map((project) => (
                    <ProjectCard key={project.id} project={project} />
                  ))}
                </div>
              ) : (
                /* Subtle empty state matching portfolio theme */
                <div className="rounded-xl border border-dashed border-slate-300/80 dark:border-[#2F3336] bg-slate-50/50 dark:bg-[#16181C]/40 py-6 px-4 text-center">
                  <p className="text-[13px] font-mono text-slate-500 dark:text-[#71767B]">
                    Projects coming soon.
                  </p>
                </div>
              )}
            </section>
          </InView>
        );
      })}
    </div>
  );
}
