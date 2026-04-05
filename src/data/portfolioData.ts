import type { PersonalProfile } from "@/types";

/* ============================================================
   WORKFOLIO — Portfolio Data Repository
   Single source of truth. All content is verified resume data.
   ============================================================ */

export const portfolioData: PersonalProfile = {
  name: "Divyanshu Tiwari",
  roleHeadline: "Learning, Building, Shipping • Data + AI",
  location: "India",
  email: "divyanshutiwari281@gmail.com",
  phone: "+91-6307488190",

  socials: {
    github: "https://github.com/papocun",
    linkedin: "https://www.linkedin.com/in/divyansh21/",
    twitter: "https://x.com/21dvy_t",
    leetcode: "https://leetcode.com/u/21_dvynshx/",
    dailysql: "https://dailysql.in/u/divyanshutiwari281",
    stratascratch: "https://platform.stratascratch.com/user/papocun",
    resumeUrl:
      "https://drive.google.com/file/d/14YWbiCTzkLcnwULHuuDESMvNvYIEjLbn/view?usp=sharing",
  },

  hero: {
    badge: "Open to ML / Data Science Roles",
    title: "I build machine learning systems that run in production.",
    bio: [
      "Data Scientist transitioning from data analytics into applied machine learning\u2014building and deploying production-grade ML systems (fraud scoring, forecasting, segmentation) end-to-end from model design to cloud deployment.",
      "Deep focus across Supervised & Unsupervised Learning (XGBoost, CatBoost), statistical validation (A/B testing), ETL pipelines, and containerized API serving using FastAPI, Docker, and AWS EC2.",
      "Co-inventor on an autonomous IoT hardware patent, 1st place champion in a 500+ participant inter-college SQL query competition, and active problem solver with 300+ challenges solved across LeetCode, StrataScratch, and DailySQL.",
    ],
  },

  experiences: [
    {
      role: "AI Data Engineer Intern",
      company: "Zeitster",
      period: "Aug 2026 – Present",
      location: "Remote",
      summary:
        "Designed end-to-end data infrastructure and ingestion pipelines for Shopify and external merchant data across AWS, Redshift, and PostgreSQL.",
      highlights: [
        "Designed the end-to-end data infrastructure for ingesting Shopify and external merchant data, covering GraphQL Bulk Operations, Webhooks, S3, Lambda, SQS, Redshift, Aurora PostgreSQL and DynamoDB.",
        "Designed the ingestion architecture for both historical backfills and incremental data, including webhook processing, retries, DLQs, idempotency and reconciliation for missed or duplicate events.",
        "Defined the data pipeline architecture from raw ingestion → validation → normalization → canonical warehouse → formula-ready data → scoring.",
        "Designed the canonical data model and data contracts to standardize data coming from Shopify, payment gateways, 3PL/courier systems and merchant-specific sources.",
        "Defined 20+ business-health formulas with source-to-target data mappings, transformations, fallback rules, boundary conditions and unresolved-data handling.",
        "Designed a Formula Dependency Registry to map each formula to its required canonical fields and enable dependency-aware recalculation.",
        "Designed the formula testing strategy using synthetic merchant scenarios covering missing data, duplicate events, refunds, late-arriving data, boundary conditions and fallback cases.",
        "Evaluated AWS infrastructure and architecture trade-offs across compute, storage, orchestration, warehouse and operational databases.",
        "Created workload-based infrastructure cost estimates for scaling from 10 → 100 → 1K → 10K merchants rather than assuming production-scale infrastructure from day one.",
        "Defined data-quality and observability requirements covering pipeline failures, freshness, validation failures, duplicate events and scoring correctness.",
      ],
      technologies: [
        "AWS (S3, Lambda, SQS, Redshift)",
        "Aurora PostgreSQL",
        "DynamoDB",
        "Python",
        "SQL",
        "Shopify GraphQL",
        "Data Modeling",
        "Data Pipelines",
      ],
    },
    {
      role: "Data Analyst Intern",
      company: "ChatSpark",
      period: "Mar 2026 – May 2026",
      location: "Remote",
      summary:
        "Automated end-to-end Python reporting pipelines and performed SQL cohort analysis to support retention decisions.",
      highlights: [
        "Automated the Excel reporting pipeline end-to-end in Python, reducing dashboard generation time from 3+ hours to under 5 minutes for recurring reports.",
        "Performed SQL-based cohort analysis on transactional data, identifying a 15% decline in repeat purchases over a 90-day window and presenting the findings to support retention decisions.",
        "Maintained recurring business dashboards and reporting workflows, ensuring data accuracy and consistency for operational decision-making.",
      ],
      technologies: [
        "Python",
        "SQL",
        "Excel Automation",
        "Cohort Analysis",
        "Dashboards",
      ],
    },
  ],

  projects: [
    {
      id: "customer-intelligence-engine",
      title: "Customer Intelligence Engine",
      category: "Unsupervised ML & Cloud API",
      description:
        "Built a KMeans-based customer segmentation system classifying customers into actionable personas with cloud API deployment.",
      impactMetrics: [
        "Built a KMeans-based customer segmentation system that classifies customers into High-Value and Budget personas using seven behavioural features.",
        "Validated segmentation using the Elbow Method and Silhouette Score to determine meaningful customer clusters.",
        "Containerized the application with Docker Compose and deployed it on AWS EC2, exposing the model through a real-time API.",
      ],
      techStack: [
        "Python",
        "Scikit-learn",
        "KMeans",
        "FastAPI",
        "Docker",
        "AWS EC2",
      ],
      githubUrl: "https://github.com/papocun/Customer-Segmentation-Project",
      liveUrl: "http://16.171.71.103/",
      isFeatured: true,
      imageSrc: "/images/projects/customer-intelligence-engine.png",
    },
    {
      id: "demandcast",
      title: "DemandCast",
      category: "Time-Series & Production ML",
      description:
        "Production-grade bike demand forecasting pipeline with temporal validation and sub-second real-time inference.",
      impactMetrics: [
        "Built a production-grade bike demand forecasting pipeline using CatBoost to model demand patterns.",
        "Used time-based train/test splitting and hyperparameter tuning to validate forecasting performance without temporal leakage.",
        "Containerized and deployed the complete system on AWS, serving real-time predictions through a live dashboard.",
      ],
      techStack: ["Python", "CatBoost", "FastAPI", "Docker", "AWS"],
      githubUrl: "https://github.com/papocun/DemandCast",
      isFeatured: true,
      imageSrc: "/images/projects/demand-cast.png",
    },
    {
      id: "inventory-intelligence-engine",
      title: "Inventory Intelligence Engine",
      category: "Analytics & SQL Optimization",
      description:
        "SQL-based ABC/Pareto inventory classification engine optimizing revenue-driving SKUs and resolving join amplification.",
      impactMetrics: [
        "Built a SQL-based ABC/Pareto classification engine identifying 93 Class A SKUs responsible for 79.7% of revenue.",
        "Used the analysis to turn raw inventory data into actionable product and revenue classifications.",
        "Debugged duplicate ingestion and JOIN amplification issues, restoring data accuracy across 9,001 records.",
      ],
      techStack: [
        "Python",
        "Pandas",
        "MySQL",
        "Plotly",
        "Streamlit",
        "Railway",
      ],
      githubUrl: "https://github.com/papocun/Inventory-supply-chain-optimization",
      isFeatured: true,
      imageSrc: "/images/projects/inventory-intelligence-engine.png",
    },
  ],

  education: {
    institution: "Ajay Kumar Garg Engineering College",
    degree: "B.Tech in Electronics and Communication Engineering",
    period: "2023 \u2013 2027",
  },

  achievements: [
    {
      title: "IoT Autonomous Hardware Patent Published",
      subtitle: "Co-Inventor",
      description:
        "IoT-enabled, solar-powered autonomous composting system with real-time sensor monitoring.",
      badgeText: "Patent",
    },
    {
      title: "1st Place \u2014 Query Quest SQL Championship",
      subtitle: "Inter-College Competition (500+ Participants)",
      description:
        "Ranked 1st at Query Quest, an inter-college SQL championship testing query optimization, joins, and window functions under timed conditions.",
      badgeText: "1st Place",
    },
    {
      title: "300+ Algorithmic & Data Science Problems Solved",
      subtitle: "LeetCode, StrataScratch & DailySQL",
      description:
        "Solved 300+ SQL, Python, and statistics problems across LeetCode, StrataScratch, and DailySQL.",
      badgeText: "300+",
    },
  ],

  skills: {
    core: [
      "Python",
      "SQL",
      "Statistics",
      "A/B Testing",
      "Supervised Learning",
      "Unsupervised Learning",
      "XGBoost",
      "CatBoost",
    ],
    dataAndBI: [
      "ETL",
      "EDA",
      "Feature Engineering",
      "Power BI",
      "Streamlit",
      "KPI Tracking",
      "Data Storytelling",
    ],
    deploymentAndDevOps: [
      "FastAPI",
      "Docker",
      "AWS",
      "MLflow",
      "Railway",
    ],
  },
};
