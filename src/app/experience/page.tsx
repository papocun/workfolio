import type { Metadata } from 'next';
import ExperienceTimeline, {
  TimelineExperienceItem,
} from '@/components/ExperienceTimeline';

export const metadata: Metadata = {
  title: 'Experience — Divyanshu Tiwari',
  description:
    'Professional track record in machine learning engineering, predictive fraud scoring, and data analytics.',
};

const EXPERIENCES: TimelineExperienceItem[] = [
  {
    id: 'zeitstone',
    company: 'ZeitstoneAI',
    role: 'Data Scientist Intern',
    period: 'Aug 2026 – Present',
    location: 'Remote',
    isCurrent: true,
    narrative: [
      'Owned end-to-end development of an e-commerce financial decision system, translating business requirements into 9 scoring models, validating them through 119 automated tests, and collaborating across business, backend, data, and database layers to design a multi-source data model connecting Shopify, payment, shipping, returns, and cost data into actionable scoring and dashboard outputs.',
      'Currently integrating and refining the scoring pipeline, working across multiple business data sources to ensure consistent inputs, transformations, and reliable decision outputs.',
      'Building and validating the underlying data model and data flows, with ongoing work around scoring logic, relationships between data sources, and edge-case handling.',
      'Working closely with business, backend, data, and database teams to translate business requirements into technical requirements, scoring logic, and implementable system behaviour.',
      'Continuously testing, debugging, and refining the decision models, expanding validation coverage and handling edge cases as the system evolves.',
    ],
    technologies: [
      'Python',
      'Data Modeling',
      'Automated Testing',
      'Scoring Systems',
      'FastAPI',
      'Docker',
    ],
  },
  {
    id: 'chatspark',
    company: 'ChatSpark',
    role: 'Data Analyst Intern',
    period: 'Mar 2026 – May 2026',
    location: 'Remote',
    isCurrent: false,
    narrative: [
      'Automated the Excel reporting pipeline end-to-end in Python, reducing dashboard generation time from 3+ hours to under 5 minutes for recurring reports.',
      'Performed SQL-based cohort analysis on transactional data, identifying a 15% decline in repeat purchases over a 90-day window and presenting the findings to support retention decisions.',
      'Maintained recurring business dashboards and reporting workflows, ensuring data accuracy and consistency for operational decision-making.',
    ],
    technologies: [
      'Python',
      'SQL',
      'Excel Automation',
      'Cohort Analysis',
      'Dashboards',
    ],
  },
];

export default function ExperiencePage() {
  return (
    <main className="max-w-[680px] mx-auto px-6 pt-8 sm:pt-10 pb-20 transition-colors duration-200">
      {/* Section Header */}
      <div className="mb-10 sm:mb-12">
        <div className="inline-flex items-center gap-2 px-2.5 py-1 rounded-full bg-slate-100 dark:bg-slate-800/80 text-[11.5px] font-mono text-slate-600 dark:text-slate-400 mb-3 border border-slate-200/60 dark:border-slate-700/60">
          <span className="w-1.5 h-1.5 rounded-full bg-[#ff3131] animate-pulse" />
          <span>experience</span>
        </div>
        <h1 className="text-[26px] sm:text-[30px] font-bold text-slate-900 dark:text-slate-100 tracking-tight leading-tight mb-2.5">
          Experience
        </h1>
        <p className="text-[13.5px] sm:text-[14.5px] text-slate-600 dark:text-slate-400 leading-relaxed max-w-[620px]">
          A look at what I’ve built, learned, and worked on along the way.
        </p>
      </div>

      {/* Timeline with Large Circular Nodes */}
      <ExperienceTimeline experiences={EXPERIENCES} />
    </main>
  );
}
