import type { TimelineExperienceItem } from '@/components/ExperienceTimeline';

/** Work experience shown on the home and experience pages. */
export const EXPERIENCES: TimelineExperienceItem[] = [
  {
    id: 'zeitster',
    company: 'Zeitster',
    role: 'Data Engineering & AI Intern',
    period: 'Aug 2026 – Present',
    location: 'Remote',
    isCurrent: true,
    summary:
      'Designed end-to-end data infrastructure and ingestion pipelines for Shopify and external merchant data on AWS using Python.',
    narrative: [
      "Automated merchant data processing: addressed fragmented Shopify merchant data and manual processing bottlenecks by engineering 23+ Python-based data pipelines, processing data through staging and Silver-layer workflows to automate downstream scoring operations.",
      "Reduced scoring execution time: optimized Python scoring workflows for merchant performance metrics, cutting execution time from 7 seconds to 3 seconds (~57% improvement) through logic optimization and more efficient data processing.",
      "Built business scoring logic: designed and implemented 23+ business scoring KPIs covering promotional, margin, payment and shipping leakages, COGS, risk and fraud, translating complex business rules into reusable Python logic.",
      "Improved data processing reliability: engineered structured data ingestion and transformation workflows integrating Shopify GraphQL Bulk Operations and Webhooks, enabling incremental data retrieval and reducing unnecessary data fetching across multiple merchant stores.",
      "Improved scoring auditability and productivity: developed scoring and reconciliation logic with standardized business rules, data mapping and audit checks, improving score traceability and helping identify discrepancies across merchant-level calculations.",
    ],
    technologies: ['Python', 'AWS', 'Data Pipelines'],
  },
];
