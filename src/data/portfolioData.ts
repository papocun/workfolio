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
      "Data Scientist transitioning from data analytics into applied machine learning, building and deploying production-grade ML systems (fraud scoring, forecasting, segmentation) end-to-end from model design to cloud deployment.",
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
        "Architected end-to-end ingestion pipelines for Shopify and merchant data using GraphQL Bulk Operations, Webhooks, S3, Lambda, SQS, Redshift, and Aurora.",
        "Built ingestion flows for historical backfills and incremental syncs with idempotency, dead-letter queues, and reconciliation for dropped events.",
        "Mapped data stages from raw ingest through validation, normalization, and canonical warehousing to final scoring tables.",
        "Drafted canonical schemas and data contracts to unify Shopify, payment gateway, 3PL, and warehouse feeds.",
        "Codified 20+ business-health formulas with explicit transformation logic, boundary checks, and fallback rules.",
        "Engineered a Formula Dependency Registry to trigger recalculation only when upstream fields change.",
        "Stress-tested formulas against synthetic edge cases (refunds, late webhooks, duplicate events, and partial payloads).",
        "Benchmarked AWS compute and storage costs to model operating expenses scaling from 10 to 10,000 merchants.",
        "Set up data-quality monitors and alert thresholds for ingestion latency, validation failures, and score drift.",
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
        "Automated weekly Excel reporting in Python, cutting report turnaround from 3+ hours to under 5 minutes.",
        "Ran SQL cohort analyses on raw transactions, uncovering a 15% dip in 90-day repeat purchases to guide retention experiments.",
        "Maintained core operational dashboards, keeping KPI feeds reliable for day-to-day decisions.",
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
        "Segments users into High-Value and Budget personas using seven behavioral features.",
        "Evaluated cluster stability and separation with the Elbow Method and Silhouette scoring.",
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
        "Modeled hourly demand curves using CatBoost with rolling time-series splits to prevent lookahead bias.",
        "Validated forecasting performance with temporal validation and hyperparameter tuning across seasons.",
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
        "Isolated 93 Class A SKUs driving 79.7% of total revenue using SQL-based ABC/Pareto analysis.",
        "Turned messy supplier inventory logs into clean revenue and reorder classifications.",
        "Fixed join amplification and duplicate ingestion across 9,001 transaction rows, restoring data integrity.",
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
