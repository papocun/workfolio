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
      'Architected end-to-end ingestion pipelines for Shopify and merchant data using GraphQL Bulk Operations, Webhooks, S3, Lambda, SQS, Redshift, and Aurora.',
      'Built ingestion flows for historical backfills and incremental syncs with idempotency, dead-letter queues, and reconciliation for dropped events.',
      'Mapped data stages from raw ingest through validation, normalization, and canonical warehousing to final scoring tables.',
      'Drafted canonical schemas and data contracts to unify Shopify, payment gateway, 3PL, and warehouse feeds.',
      'Codified 20+ business-health formulas with explicit transformation logic, boundary checks, and fallback rules.',
      'Engineered a Formula Dependency Registry to trigger recalculation only when upstream fields change.',
      'Stress-tested formulas against synthetic edge cases (refunds, late webhooks, duplicate events, and partial payloads).',
      'Benchmarked AWS compute and storage costs to model operating expenses scaling from 10 to 10,000 merchants.',
      'Set up data-quality monitors and alert thresholds for ingestion latency, validation failures, and score drift.',
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
      'Automated weekly Excel reporting in Python, cutting report turnaround from 3+ hours to under 5 minutes.',
      'Ran SQL cohort analyses on raw transactions, uncovering a 15% dip in 90-day repeat purchases to guide retention experiments.',
      'Maintained core operational dashboards, keeping KPI feeds reliable for day-to-day decisions.',
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
        <h1 className="text-[28px] sm:text-[34px] font-bold text-slate-900 dark:text-slate-100 tracking-tight leading-tight mb-2 sm:mb-2.5 text-balance">
          Experience
        </h1>
        <p className="text-[15px] sm:text-[16px] text-slate-600 dark:text-slate-400 leading-relaxed max-w-[620px] text-pretty">
          A look at what I’ve built, learned, and worked on along the way.
        </p>
      </div>

      {/* Flat Editorial Expandable Experience List */}
      <ExperienceTimeline experiences={EXPERIENCES} />
    </main>
  );
}
