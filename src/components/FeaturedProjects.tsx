'use client';

import { SkillChip } from '@/components/SkillsSection';
import { useState } from 'react';
import { ArrowSquareOut, CaretDown, GithubLogo } from '@phosphor-icons/react';

interface Repo {
  name: string;
  description: string;
  tags: string[];
  url: string;
  liveUrl?: string;
}

// Featured repos, shown as an expandable list.
const FEATURED_REPOS: Repo[] = [
  {
    name: 'Self_healing_data_pipeline',
    description:
      'Self-healing ETL for large-scale review sentiment. Streams Yelp reviews in batches, classifies them with a local LLM, checkpoints every batch, retries with backoff and quarantines bad records.',
    tags: ['Python', 'Airflow', 'Ollama', 'FastAPI', 'Parquet', 'Next.js'],
    url: 'https://github.com/papocun/Self_healing_data_pipeline',
  },
  {
    name: 'Realtime_analytics_pipeline',
    description:
      'End-to-end realtime music analytics. Kafka events land in a MinIO lake, Airflow loads Snowflake, and dbt builds tested Bronze, Silver and Gold layers behind a live dashboard.',
    tags: ['Kafka', 'MinIO', 'Airflow', 'Snowflake', 'dbt'],
    url: 'https://github.com/papocun/Realtime_analytics_pipeline',
    liveUrl: 'https://realtime-analytics-pipeline.vercel.app/',
  },
  {
    name: 'Inventory-supply-chain-optimization',
    description:
      'Decision-support engine for inventory teams. SQL ABC/Pareto analysis, safety stock, reorder point and EOQ turn transaction history into Healthy, Warning and Critical replenishment signals in a Streamlit dashboard.',
    tags: ['Python', 'MySQL', 'Pandas', 'Plotly', 'Streamlit'],
    url: 'https://github.com/papocun/Inventory-supply-chain-optimization',
  },
  {
    name: 'Customer-Segmentation-Project',
    description:
      'End-to-end ML customer segmentation. KMeans splits customers into High-Value and Budget personas, served through a FastAPI endpoint and Streamlit dashboard, containerized with Docker and deployed on AWS EC2.',
    tags: ['Scikit-learn', 'FastAPI', 'Streamlit', 'MongoDB', 'Docker', 'AWS'],
    url: 'https://github.com/papocun/Customer-Segmentation-Project',
    liveUrl: 'http://16.171.71.103/',
  },
  {
    name: 'My-Desk-Kitty',
    description:
      'An animated pixel-art cat that lives on your desktop. It follows the cursor, reacts to clicks and keystrokes, and runs from the system tray.',
    tags: ['Python', 'PySide6', 'PyInput'],
    url: 'https://github.com/papocun/My-Desk-Kitty',
  },
];

const linkCls =
  'inline-flex items-center gap-1.5 py-1.5 -my-1.5 text-[13px] font-medium text-slate-800 dark:text-slate-100 hover:text-sky-500 dark:hover:text-[#1D9BF0] transition-colors';

export default function FeaturedProjects() {
  const [open, setOpen] = useState<Record<string, boolean>>(
    () => Object.fromEntries(FEATURED_REPOS.map((r) => [r.name, false]))
  );

  return (
    <section className="w-full max-w-full min-w-0" aria-label="Projects">
      <h2 className="text-[19px] sm:text-[21px] font-bold text-slate-900 dark:text-slate-100 tracking-tight mb-2 sm:mb-3">
        Projects
      </h2>

      <div className="divide-y divide-slate-200/80 dark:divide-[#2F3336]/60">
        {FEATURED_REPOS.map((repo) => {
          const isOpen = open[repo.name];
          const panelId = `proj-${repo.name}`;
          return (
            <div key={repo.name} className="py-3.5 sm:py-4">
              <button
                type="button"
                aria-expanded={isOpen}
                aria-controls={panelId}
                onClick={() => setOpen((o) => ({ ...o, [repo.name]: !o[repo.name] }))}
                className="block w-full text-left cursor-pointer"
              >
              <div className="flex w-full items-center justify-between gap-3">
                <span className="min-w-0 truncate text-[15px] sm:text-[16px] font-bold text-slate-900 dark:text-slate-100 tracking-tight">
                  {repo.name}
                </span>
                <span className="flex shrink-0 items-center gap-2.5 text-[12px] sm:text-[12.5px] font-mono text-slate-500 dark:text-[#71767B]">
                  <CaretDown
                    size={16}
                    weight="regular"
                    aria-hidden="true"
                    className={`transition-transform duration-200 ${isOpen ? 'rotate-180' : ''}`}
                  />
                </span>
              </div>
              <p
                className={`mt-1.5 text-[14px] sm:text-[15px] leading-[1.65] text-slate-600 dark:text-slate-300 text-pretty ${
                  isOpen ? '' : 'line-clamp-1'
                }`}
              >
                {repo.description}
              </p>
            </button>

              <div
                id={panelId}
                className={`grid transition-[grid-template-rows] duration-200 ease-out ${
                  isOpen ? 'grid-rows-[1fr]' : 'grid-rows-[0fr]'
                }`}
              >
                <div className="overflow-hidden">
                  <div className="pt-3">
                    <div className="flex flex-col gap-3 sm:flex-row sm:items-end sm:justify-between">
                      <ul className="flex flex-wrap gap-2" aria-label="Tech">
                        {repo.tags.map((t) => (
                          <SkillChip key={t} name={t} />
                        ))}
                      </ul>
                      <div className="flex shrink-0 items-center gap-4">
                        {repo.liveUrl && (
                          <a href={repo.liveUrl} target="_blank" rel="noopener noreferrer" className={linkCls}>
                            <ArrowSquareOut size={16} weight="regular" aria-hidden="true" /> Live
                          </a>
                        )}
                        <a href={repo.url} target="_blank" rel="noopener noreferrer" className={linkCls}>
                          <GithubLogo size={16} weight="regular" aria-hidden="true" /> Source
                        </a>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          );
        })}
      </div>
    </section>
  );
}
