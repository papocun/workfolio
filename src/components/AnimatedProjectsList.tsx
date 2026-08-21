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
          y: 100,
          filter: 'blur(4px)',
        },
        visible: {
          opacity: 1,
          y: 0,
          filter: 'blur(0px)',
        },
      };

  return (
    <div className="flex flex-col gap-8">
      {projects.map((project, index) => (
        <InView
          key={project.id}
          viewOptions={{
            margin: '0px 0px -120px 0px',
            once: true,
          }}
          variants={variants}
          transition={{
            duration: 0.5,
            ease: 'easeInOut',
            delay: shouldReduceMotion ? 0 : index * 0.1,
          }}
        >
          <ProjectCard project={project} />
        </InView>
      ))}
    </div>
  );
}
