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
    id: 'zeitster',
    company: 'Zeitster',
    role: 'AI Data Engineer Intern',
    period: 'Aug 2026 – Present',
    location: 'Remote',
    isCurrent: true,
    summary:
      'Designed end-to-end data infrastructure and ingestion pipelines for Shopify and external merchant data across AWS, Redshift, and PostgreSQL.',
    narrative: [
      'Designed the end-to-end data infrastructure for ingesting Shopify and external merchant data, covering GraphQL Bulk Operations, Webhooks, S3, Lambda, SQS, Redshift, Aurora PostgreSQL and DynamoDB.',
      'Designed the ingestion architecture for both historical backfills and incremental data, including webhook processing, retries, DLQs, idempotency and reconciliation for missed or duplicate events.',
      'Defined the data pipeline architecture from raw ingestion → validation → normalization → canonical warehouse → formula-ready data → scoring.',
      'Designed the canonical data model and data contracts to standardize data coming from Shopify, payment gateways, 3PL/courier systems and merchant-specific sources.',
      'Defined 20+ business-health formulas with source-to-target data mappings, transformations, fallback rules, boundary conditions and unresolved-data handling.',
      'Designed a Formula Dependency Registry to map each formula to its required canonical fields and enable dependency-aware recalculation.',
      'Designed the formula testing strategy using synthetic merchant scenarios covering missing data, duplicate events, refunds, late-arriving data, boundary conditions and fallback cases.',
      'Evaluated AWS infrastructure and architecture trade-offs across compute, storage, orchestration, warehouse and operational databases.',
      'Created workload-based infrastructure cost estimates for scaling from 10 → 100 → 1K → 10K merchants rather than assuming production-scale infrastructure from day one.',
      'Defined data-quality and observability requirements covering pipeline failures, freshness, validation failures, duplicate events and scoring correctness.',
    ],
    technologies: [
      'AWS (S3, Lambda, SQS, Redshift)',
      'Aurora PostgreSQL',
      'DynamoDB',
      'Python',
      'SQL',
      'Shopify GraphQL',
      'Data Modeling',
      'Data Pipelines',
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
    <main className="max-w-[680px] mx-auto px-4 sm:px-6 pt-6 sm:pt-10 pb-16 sm:pb-20">
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(breadcrumbJsonLd) }}
      />

      {/* Section Header */}
      <div className="mb-6 sm:mb-8">
        <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-slate-100 dark:bg-slate-800/80 text-[12.5px] font-mono text-slate-600 dark:text-slate-400 mb-3 border border-slate-200/60 dark:border-slate-700/60">
          <span className="w-1.5 h-1.5 rounded-full bg-[#1D9BF0] animate-pulse" />
          <span>experience</span>
        </div>
        <h1 className="text-[28px] sm:text-[34px] font-bold text-slate-900 dark:text-slate-100 tracking-tight leading-tight mb-2 sm:mb-2.5">
          Experience
        </h1>
        <p className="text-[15px] sm:text-[16px] text-slate-600 dark:text-slate-400 leading-relaxed max-w-[620px]">
          A look at what I’ve built, learned, and worked on along the way.
        </p>
      </div>

      {/* Flat Editorial Expandable Experience List */}
      <ExperienceTimeline experiences={EXPERIENCES} />
    </main>
  );
}
