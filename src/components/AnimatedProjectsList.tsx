'use client';

import React from 'react';
import { InView } from '@/components/core/in-view';
import ProjectCard from '@/components/ProjectCard';
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
          y: 20,
        },
        visible: {
          opacity: 1,
          y: 0,
        },
      };

  return (
    <div className="flex flex-col gap-6 sm:gap-8">
      {projects.map((project, index) => (
        <InView
          key={project.id}
          viewOptions={{
            margin: '0px 0px -60px 0px',
            once: true,
          }}
          variants={variants}
          transition={{
            duration: 0.3,
            ease: 'easeOut',
            delay: shouldReduceMotion ? 0 : index * 0.08,
          }}
        >
          <ProjectCard project={project} />
        </InView>
      ))}
    </div>
  );
}
