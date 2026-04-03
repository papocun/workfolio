import React from 'react';

interface SkillItem {
  name: string;
  icon: React.ReactNode;
}

interface SkillCategory {
  category: string;
  skills: SkillItem[];
}

/* ============================================================
   Official Technology & Concept Icons
   Theme-adaptive, crisp SVG graphics for every skill
   ============================================================ */

function PythonLogo() {
  return (
    <svg className="w-3.5 h-3.5 shrink-0" viewBox="0 0 24 24" fill="none" aria-hidden="true">
      <path
        d="M11.91 2C6.44 2 6.78 4.38 6.78 4.38L6.79 6.84H12V7.61H4.21S2 7.36 2 12.83c0 5.48 1.93 5.25 1.93 5.25h1.16V16.4s-.06-2.02 1.99-2.02h5.18s1.93.03 1.93-1.89V4.03S14.65 2 11.91 2z"
        fill="#3776AB"
      />
      <circle cx="9.04" cy="4.54" r="0.8" fill="#FFFFFF" />
      <path
        d="M12.09 22c5.47 0 5.13-2.38 5.13-2.38l-.01-2.46H12v-.77h7.79s2.21.25 2.21-5.22c0-5.48-1.93-5.25-1.93-5.25h-1.16v1.68s.06 2.02-1.99 2.02h-5.18s-1.93-.03-1.93 1.89v8.46s-.26 2.03 2.29 2.03z"
        fill="#FFD43B"
      />
      <circle cx="14.96" cy="19.46" r="0.8" fill="#FFFFFF" />
    </svg>
  );
}

function SqlLogo() {
  return (
    <svg className="w-3.5 h-3.5 shrink-0 text-[#1D9BF0]" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
      <ellipse cx="12" cy="5" rx="8" ry="2.5" />
      <path d="M4 5v6c0 1.38 3.58 2.5 8 2.5s8-1.12 8-2.5V5" />
      <path d="M4 11v6c0 1.38 3.58 2.5 8 2.5s8-1.12 8-2.5v-6" />
    </svg>
  );
}

function PySparkLogo() {
  return (
    <svg className="w-3.5 h-3.5 shrink-0" viewBox="0 0 24 24" fill="none" aria-hidden="true">
      <path
        d="M13.2 2.2c-.3 1.1-.9 2-1.8 2.8-.7.7-1.4 1.3-2.2 1.8-.8.5-1.7.9-2.7 1.1 1.2.6 2.3 1.4 3.1 2.4.9 1 1.5 2.2 1.7 3.5.4-1.2 1.1-2.3 2-3.2.9-.9 2-1.6 3.2-2.1-1.1-.5-2.1-1.2-2.9-2.1-.6-.9-1-1.9-1.2-3.1L13.2 2.2z"
        fill="#E25A1C"
      />
      <path
        d="M7.4 12.8c-.8.8-1.7 1.4-2.8 1.8 1.1.4 2 1.1 2.8 1.8.7.7 1.3 1.6 1.7 2.6.4-1 .9-1.9 1.7-2.6.8-.7 1.7-1.4 2.8-1.8-1.1-.4-2-1.1-2.8-1.8-.8-.8-1.3-1.6-1.7-2.6-.4 1-.9 1.9-1.7 2.6z"
        fill="#E25A1C"
      />
    </svg>
  );
}

function EtlWorkflowIcon() {
  return (
    <svg className="w-3.5 h-3.5 shrink-0 text-[#1D9BF0]" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
      <path d="M4 14a4 4 0 0 1 7.2-2.4L13 13" />
      <path d="M12 9l1.5 4h-4" />
      <path d="M20 10a4 4 0 0 1-7.2 2.4L11 11" />
      <path d="M12 15l-1.5-4h4" />
    </svg>
  );
}

function DataPipelinesIcon() {
  return (
    <svg className="w-3.5 h-3.5 shrink-0 text-[#1D9BF0]" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
      <rect x="3" y="4" width="5" height="5" rx="1" />
      <rect x="16" y="4" width="5" height="5" rx="1" />
      <rect x="9.5" y="15" width="5" height="5" rx="1" />
      <path d="M8 6.5h8" />
      <path d="M5.5 9v3.5a2 2 0 0 0 2 2H9.5" />
      <path d="M18.5 9v3.5a2 2 0 0 1-2 2H14.5" />
    </svg>
  );
}

function DataModellingIcon() {
  return (
    <svg className="w-3.5 h-3.5 shrink-0 text-[#1D9BF0]" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
      <rect x="3" y="3" width="7" height="6" rx="1" />
      <rect x="14" y="3" width="7" height="6" rx="1" />
      <rect x="8.5" y="15" width="7" height="6" rx="1" />
      <path d="M6.5 9v2.5a1 1 0 0 0 1 1h9a1 1 0 0 0 1-1V9" />
      <path d="M12 12.5V15" />
    </svg>
  );
}

function DataQualityIcon() {
  return (
    <svg className="w-3.5 h-3.5 shrink-0 text-[#10B981]" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
      <path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z" />
      <path d="M9 12l2 2 4-4" />
    </svg>
  );
}

function SnowflakeLogo() {
  return (
    <svg className="w-3.5 h-3.5 shrink-0" viewBox="0 0 24 24" fill="none" stroke="#29B5E8" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
      <path d="M12 2.5v19M2.5 12h19M5.5 5.5l13 13M18.5 5.5l-13 13" />
      <circle cx="12" cy="12" r="1.5" fill="#29B5E8" />
    </svg>
  );
}

function RedshiftLogo() {
  return (
    <svg className="w-3.5 h-3.5 shrink-0" viewBox="0 0 24 24" fill="none" aria-hidden="true">
      <path
        d="M12 2.5L3.5 7.4v9.2L12 21.5l8.5-4.9V7.4L12 2.5z"
        stroke="#8C4FFF"
        strokeWidth="2"
        strokeLinejoin="round"
      />
      <path d="M12 21.5V12M12 12L3.5 7.4M12 12l8.5-4.6" stroke="#8C4FFF" strokeWidth="2" />
      <circle cx="12" cy="12" r="2" fill="#CC2264" />
    </svg>
  );
}

function S3Logo() {
  return (
    <svg className="w-3.5 h-3.5 shrink-0" viewBox="0 0 24 24" fill="none" stroke="#E25A1C" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
      <path d="M4 7l8-4 8 4-8 4-8-4z" />
      <path d="M4 12l8 4 8-4" />
      <path d="M4 17l8 4 8-4" />
    </svg>
  );
}

function AirflowLogo() {
  return (
    <svg className="w-3.5 h-3.5 shrink-0" viewBox="0 0 24 24" fill="none" aria-hidden="true">
      <circle cx="12" cy="12" r="2.8" fill="#017CEE" />
      <path
        d="M12 3c-1.7 0-3 1.3-3 3 0 1.2.7 2.2 1.7 2.7V11h2.6V8.7c1-.5 1.7-1.5 1.7-2.7 0-1.7-1.3-3-3-3z"
        fill="#017CEE"
      />
      <path
        d="M21 12c0-1.7-1.3-3-3-3-1.2 0-2.2.7-2.7 1.7H13v2.6h2.3c.5 1 1.5 1.7 2.7 1.7 1.7 0 3-1.3 3-3z"
        fill="#017CEE"
      />
      <path
        d="M12 21c1.7 0 3-1.3 3-3 0-1.2-.7-2.2-1.7-2.7V13h-2.6v2.3c-1 .5-1.7 1.5-1.7 2.7 0 1.7 1.3 3 3 3z"
        fill="#017CEE"
      />
      <path
        d="M3 12c0 1.7 1.3 3 3 3 1.2 0 2.2-.7 2.7-1.7H11v-2.6H8.7c-.5-1-1.5-1.7-2.7-1.7-1.7 0-3 1.3-3 3z"
        fill="#017CEE"
      />
    </svg>
  );
}

function DagsterLogo() {
  return (
    <svg className="w-3.5 h-3.5 shrink-0" viewBox="0 0 24 24" fill="none" aria-hidden="true">
      <path
        d="M4 6.5L12 2l8 4.5v11L12 22l-8-4.5v-11z"
        stroke="#2563EB"
        strokeWidth="2"
        strokeLinejoin="round"
      />
      <circle cx="12" cy="12" r="2.8" fill="#2563EB" />
    </svg>
  );
}

function DbtLogo() {
  return (
    <svg className="w-3.5 h-3.5 shrink-0" viewBox="0 0 24 24" fill="none" aria-hidden="true">
      <path
        d="M12 2.5L4 7.2v9.6l8 4.7 8-4.7V7.2L12 2.5z"
        fill="#FF694B"
      />
      <path
        d="M12 6.8L7 9.8v4.5l5 3 5-3V9.8l-5-3z"
        fill="#FFFFFF"
      />
    </svg>
  );
}

function AwsLogo() {
  return (
    <svg className="w-3.5 h-3.5 shrink-0" viewBox="0 0 24 24" fill="none" aria-hidden="true">
      <path
        d="M8.2 11.2c-.1-.7-.4-1.2-.9-1.5-.5-.3-1.1-.5-1.9-.5-.8 0-1.4.2-1.9.5-.4.3-.7.8-.7 1.3 0 .5.2.9.6 1.2.4.3 1.1.6 2.1.8l1.4.3c1.4.3 2.3.8 2.9 1.4.6.6.9 1.4.9 2.4 0 1.2-.5 2.2-1.4 2.9-.9.7-2.2 1.1-3.7 1.1-1.4 0-2.6-.4-3.5-1.1-.9-.7-1.4-1.7-1.5-3h2.3c.1.7.4 1.2.9 1.6.5.3 1.2.5 2 .5.8 0 1.5-.2 2-.5.5-.3.7-.8.7-1.4 0-.5-.2-1-.7-1.3-.5-.3-1.2-.6-2.2-.8l-1.3-.3c-1.3-.3-2.2-.8-2.8-1.3-.5-.6-.8-1.4-.8-2.4 0-1.1.4-2 1.3-2.7.9-.7 2-1 3.5-1 1.3 0 2.4.3 3.2.9.8.6 1.3 1.5 1.4 2.6h-2.1zM18.8 8.8l2.6 8.3h-2.2l-.5-2.1h-2.8l-.5 2.1h-2.2l2.6-8.3h3zm-.8 4.6l-.9-3.7-.9 3.7h1.8z"
        fill="#FF9900"
      />
      <path
        d="M3 19c5 3.5 13 3.5 18 0"
        stroke="#FF9900"
        strokeWidth="1.7"
        strokeLinecap="round"
      />
    </svg>
  );
}

function GlueLogo() {
  return (
    <svg className="w-3.5 h-3.5 shrink-0" viewBox="0 0 24 24" fill="none" aria-hidden="true">
      <rect x="4" y="4" width="7" height="7" rx="1.5" fill="#8C4FFF" />
      <rect x="13" y="4" width="7" height="7" rx="1.5" fill="#8C4FFF" opacity="0.6" />
      <rect x="4" y="13" width="7" height="7" rx="1.5" fill="#8C4FFF" opacity="0.6" />
      <rect x="13" y="13" width="7" height="7" rx="1.5" fill="#8C4FFF" />
    </svg>
  );
}

function DockerLogo() {
  return (
    <svg className="w-3.5 h-3.5 shrink-0" viewBox="0 0 24 24" fill="none" aria-hidden="true">
      <path
        d="M13.5 5h2v2h-2V5zm-3 0h2v2h-2V5zm-3 0h2v2h-2V5zm6 3h2v2h-2V8zm-3 0h2v2h-2V8zm-3 0h2v2h-2V8zm-3 0h2v2h-2V8zm12 0h2v2h-2V8zm-15 3h2v2h-2v-2zm3 0h2v2h-2v-2zm3 0h2v2h-2v-2zm3 0h2v2h-2v-2zm3 0h2v2h-2v-2zm3 0h2v2h-2v-2z"
        fill="#2496ED"
      />
      <path
        d="M22.5 13.5c-.5-.4-1.5-.5-2.2-.2-.2-.7-.7-1.3-1.4-1.7l-.6-.3-.4.6c-.4.6-.4 1.4-.2 2.1-.8.5-1.9.5-2.2.5H2c-.3 1.5.2 3.1 1.2 4.3 1.2 1.5 3.1 2.3 5.3 2.3 6.3 0 11-3.6 12.8-8.2.5.1 1.1 0 1.5-.3.2-.2.4-.4.5-.6l-.8-.5z"
        fill="#2496ED"
      />
    </svg>
  );
}

function GitLogo() {
  return (
    <svg className="w-3.5 h-3.5 shrink-0" viewBox="0 0 24 24" fill="none" aria-hidden="true">
      <path
        d="M21.6 10.9L13.1 2.4c-.6-.6-1.5-.6-2.1 0L8.9 4.5l2.6 2.6c.6-.2 1.3-.1 1.8.4.5.5.7 1.3.4 1.9l2.5 2.5c.6-.3 1.4-.1 1.9.4.7.7.7 1.9 0 2.6-.7.7-1.9.7-2.6 0-.6-.6-.7-1.4-.3-2.1L12.7 10.3v5.1c.2.1.4.3.5.5.7.7.7 1.9 0 2.6-.7.7-1.9.7-2.6 0-.7-.7-.7-1.9 0-2.6.2-.2.4-.4.7-.5v-5.2c-.3-.1-.5-.3-.7-.5-.6-.6-.7-1.4-.3-2.1L7.7 5.7 2.4 11c-.6.6-.6 1.5 0 2.1l8.5 8.5c.6.6 1.5.6 2.1 0l8.6-8.6c.6-.6.6-1.5 0-2.1z"
        fill="#F05032"
      />
    </svg>
  );
}

function GitHubLogo() {
  return (
    <svg className="w-3.5 h-3.5 shrink-0 fill-current text-slate-800 dark:text-slate-200" viewBox="0 0 16 16" aria-hidden="true">
      <path d="M8 0C3.58 0 0 3.58 0 8c0 3.54 2.29 6.53 5.47 7.59.4.07.55-.17.55-.38 0-.19-.01-.82-.01-1.49-2.01.37-2.53-.49-2.69-.94-.09-.23-.48-.94-.82-1.13-.28-.15-.68-.52-.01-.53.63-.01 1.08.58 1.23.82.72 1.21 1.87.87 2.33.66.07-.52.28-.87.51-1.07-1.78-.2-3.64-.89-3.64-3.95 0-.87.31-1.59.82-2.15-.08-.2-.36-1.02.08-2.12 0 0 .67-.21 2.2.82.64-.18 1.32-.27 2-.27.68 0 1.36.09 2 .27 1.53-1.04 2.2-.82 2.2-.82.44 1.1.16 1.92.08 2.12.51.56.82 1.27.82 2.15 0 3.07-1.87 3.75-3.65 3.95.29.25.54.73.54 1.48 0 1.07-.01 1.93-.01 2.2 0 .21.15.46.55.38A8.013 8.013 0 0016 8c0-4.42-3.58-8-8-8z" />
    </svg>
  );
}

function LinuxLogo() {
  return (
    <svg className="w-3.5 h-3.5 shrink-0 text-slate-800 dark:text-slate-200" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
      <rect x="3" y="4" width="18" height="16" rx="2" />
      <path d="M7 8l4 4-4 4" />
      <path d="M13 16h4" />
    </svg>
  );
}

function LlmRagIcon() {
  return (
    <svg className="w-3.5 h-3.5 shrink-0 text-[#8C4FFF]" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
      <path d="M9.5 2A2.5 2.5 0 0 1 12 4.5v15a2.5 2.5 0 0 1-4.96.44 2.5 2.5 0 0 1-2.96-3.08 3 3 0 0 1-.34-5.58 2.5 2.5 0 0 1 1.32-4.24 2.5 2.5 0 0 1 4.44-2.04z" />
      <path d="M14.5 2A2.5 2.5 0 0 0 12 4.5v15a2.5 2.5 0 0 0 4.96.44 2.5 2.5 0 0 0 2.96-3.08 3 3 0 0 0 .34-5.58 2.5 2.5 0 0 0-1.32-4.24 2.5 2.5 0 0 0-4.44-2.04z" />
    </svg>
  );
}

function VectorDbIcon() {
  return (
    <svg className="w-3.5 h-3.5 shrink-0 text-[#1D9BF0]" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
      <circle cx="5" cy="5" r="2.5" />
      <circle cx="19" cy="5" r="2.5" />
      <circle cx="12" cy="12" r="2.5" />
      <circle cx="5" cy="19" r="2.5" />
      <circle cx="19" cy="19" r="2.5" />
      <path d="M5 7.5v9M7.5 5h9M16.5 19h-9M19 7.5v9M6.8 6.8l3.4 3.4M13.8 13.8l3.4 3.4M17.2 6.8l-3.4 3.4M10.2 13.8l-3.4 3.4" strokeOpacity="0.5" />
    </svg>
  );
}

/* ============================================================
   Exact 5 Final Categories for Data Engineer + AI Data Engineer
   ============================================================ */

const DATA_ENGINEERING_SKILLS: SkillCategory[] = [
  {
    category: 'Languages',
    skills: [
      { name: 'Python', icon: <PythonLogo /> },
      { name: 'SQL', icon: <SqlLogo /> },
    ],
  },
  {
    category: 'Data Engineering',
    skills: [
      { name: 'PySpark', icon: <PySparkLogo /> },
      { name: 'ETL / ELT', icon: <EtlWorkflowIcon /> },
      { name: 'Data Pipelines', icon: <DataPipelinesIcon /> },
      { name: 'Data Modelling', icon: <DataModellingIcon /> },
      { name: 'Data Quality', icon: <DataQualityIcon /> },
    ],
  },
  {
    category: 'Data Platform & Warehousing',
    skills: [
      { name: 'Snowflake', icon: <SnowflakeLogo /> },
      { name: 'Amazon Redshift', icon: <RedshiftLogo /> },
      { name: 'Amazon S3', icon: <S3Logo /> },
    ],
  },
  {
    category: 'Orchestration & Transformation',
    skills: [
      { name: 'Apache Airflow', icon: <AirflowLogo /> },
      { name: 'Dagster', icon: <DagsterLogo /> },
      { name: 'dbt', icon: <DbtLogo /> },
    ],
  },
  {
    category: 'AI Data & Infrastructure',
    skills: [
      { name: 'AWS', icon: <AwsLogo /> },
      { name: 'AWS Glue', icon: <GlueLogo /> },
      { name: 'Docker', icon: <DockerLogo /> },
      { name: 'Git', icon: <GitLogo /> },
      { name: 'GitHub', icon: <GitHubLogo /> },
      { name: 'Linux', icon: <LinuxLogo /> },
      { name: 'LLM / RAG', icon: <LlmRagIcon /> },
      { name: 'Vector Databases', icon: <VectorDbIcon /> },
    ],
  },
];

interface SkillsSectionProps {
  className?: string;
}

export default function SkillsSection({ className = '' }: SkillsSectionProps) {
  return (
    <section
      className={`w-full ${className}`}
      aria-label="Skills & Technologies"
    >
      {/* Top Thin Horizontal Divider */}
      <hr className="border-t border-slate-200/80 dark:border-[#2F3336]/60 my-6 sm:my-7" />

      {/* Section Heading with Theme-Aware Typography */}
      <h2 className="text-[17px] sm:text-[18px] font-bold text-slate-900 dark:text-slate-100 tracking-tight mb-3.5 sm:mb-4">
        Skills
      </h2>

      {/* 5 Clean Categories & Compact Rectangular Skill Boxes */}
      <div className="space-y-2.5 sm:space-y-3">
        {DATA_ENGINEERING_SKILLS.map((item) => (
          <div
            key={item.category}
            className="flex flex-col sm:flex-row sm:items-start gap-1.5 sm:gap-3"
          >
            {/* Category Name on Left - High-contrast theme-aware typography */}
            <span className="text-[12.5px] sm:text-[13px] font-medium text-slate-600 dark:text-slate-400 w-full sm:w-[195px] md:w-[210px] shrink-0 sm:pt-1 transition-colors duration-200">
              {item.category}
            </span>

            {/* Individual Rectangular Skill Boxes on Right (6px radius, compact padding) */}
            <div className="flex flex-wrap items-center gap-1.5 sm:gap-2 flex-1">
              {item.skills.map((skill) => (
                <div
                  key={skill.name}
                  className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-[6px] border border-slate-200/90 dark:border-[#2F3336]/80 bg-white/80 dark:bg-[#16181C]/70 shadow-2xs text-slate-800 dark:text-slate-200 text-[12px] sm:text-[12.5px] font-medium tracking-tight hover:border-[#1D9BF0]/60 dark:hover:border-[#1D9BF0]/60 hover:bg-slate-50 dark:hover:bg-[#1E2732]/80 transition-all duration-150 cursor-default select-none group"
                >
                  <span className="shrink-0 flex items-center justify-center transition-transform duration-150 group-hover:scale-105">
                    {skill.icon}
                  </span>
                  <span className="leading-none whitespace-nowrap group-hover:text-slate-900 dark:group-hover:text-white transition-colors duration-150">
                    {skill.name}
                  </span>
                </div>
              ))}
            </div>
          </div>
        ))}
      </div>

      {/* Bottom Thin Horizontal Divider */}
      <hr className="border-t border-slate-200/80 dark:border-[#2F3336]/60 mt-6 sm:mt-7" />
    </section>
  );
}
