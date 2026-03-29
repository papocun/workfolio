import type { Metadata } from 'next';
import ExperienceTimeline, {
  TimelineExperienceItem,
} from '@/components/ExperienceTimeline';

export const metadata: Metadata = {
  title: 'Experience',
  description:
    'Professional track record in machine learning engineering, predictive fraud scoring, and data analytics across startups and early-stage teams.',
  alternates: {
    canonical: 'https://datafolio.me/experience/',
    types: {
      'text/markdown': 'https://datafolio.me/experience.md',
    },
  },
  openGraph: {
    title: 'Experience | Divyanshu Tiwari',
    description:
      'Professional track record in machine learning engineering, predictive fraud scoring, and data analytics across startups and early-stage teams.',
    url: 'https://datafolio.me/experience/',
    siteName: 'Divyanshu Tiwari',
    locale: 'en_US',
    type: 'website',
  },
  twitter: {
    card: 'summary_large_image',
    title: 'Experience | Divyanshu Tiwari',
    description:
      'Professional track record in machine learning engineering, predictive fraud scoring, and data analytics across startups and early-stage teams.',
    creator: '@21dvy_t',
  },
};

const breadcrumbJsonLd = {
  '@context': 'https://schema.org',
  '@type': 'BreadcrumbList',
  itemListElement: [
    {
      '@type': 'ListItem',
      position: 1,
      name: 'Home',
      item: 'https://datafolio.me/',
    },
    {
      '@type': 'ListItem',
      position: 2,
      name: 'Experience',
      item: 'https://datafolio.me/experience/',
    },
  ],
};

const EXPERIENCES: TimelineExperienceItem[] = [
  {
    id: 'zeitstone',
    company: 'ZeitstoneAI',
    role: 'Data Scientist Intern',
    period: 'Aug 2026 – Present',
    location: 'Remote',
    isCurrent: true,
    summary:
      'Building an e-commerce financial decision system with 9 scoring models, automated testing, and multi-source data integration.',
    narrative: [
      'Owned end-to-end development of an e-commerce financial decision system, translating business requirements into 9 scoring models validated through 119 automated tests.',
      'Collaborated across business, backend, data, and database layers to design a multi-source data model connecting Shopify, payment, shipping, returns, and cost data into actionable scoring and dashboard outputs.',
      'Integrated and refined scoring pipelines, ensuring consistent transformations, reliable decision outputs, and robust edge-case handling.',
      'Continuously tested, debugged, and refined decision models, expanding validation coverage and handling edge cases as the system evolves.',
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
    summary:
      'Automated end-to-end Python reporting pipelines and performed SQL cohort analysis to support retention decisions.',
    narrative: [
      'Automated the Excel reporting pipeline end-to-end in Python, reducing dashboard generation time from 3+ hours to under 5 minutes for recurring reports.',
      'Performed SQL-based cohort analysis on transactional data, identifying a 15% decline in repeat purchases over a 90-day window and presenting findings to support retention decisions.',
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
    <main className="max-w-[680px] mx-auto px-4 sm:px-6 pt-6 sm:pt-10 pb-16 sm:pb-20 transition-colors duration-200 ease-[cubic-bezier(0.4,0,0.2,1)]">
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(breadcrumbJsonLd) }}
      />

      {/* Section Header */}
      <div className="mb-6 sm:mb-8">
        <div className="inline-flex items-center gap-2 px-2.5 py-1 rounded-full bg-slate-100 dark:bg-slate-800/80 text-[11.5px] font-mono text-slate-600 dark:text-slate-400 mb-3 border border-slate-200/60 dark:border-slate-700/60">
          <span className="w-1.5 h-1.5 rounded-full bg-[#1D9BF0] animate-pulse" />
          <span>experience</span>
        </div>
        <h1 className="text-[24px] sm:text-[30px] font-bold text-slate-900 dark:text-slate-100 tracking-tight leading-tight mb-2 sm:mb-2.5">
          Experience
        </h1>
        <p className="text-[13.5px] sm:text-[14.5px] text-slate-600 dark:text-slate-400 leading-relaxed max-w-[620px]">
          A look at what I’ve built, learned, and worked on along the way.
        </p>
      </div>

      {/* Flat Editorial Expandable Experience List */}
      <ExperienceTimeline experiences={EXPERIENCES} />
    </main>
  );
}
