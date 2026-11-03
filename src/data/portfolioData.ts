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
      "Data Scientist moving from data analytics into applied machine learning. Builds and deploys ML systems (fraud scoring, forecasting, segmentation) from model design to cloud deployment.",
      "Works with supervised and unsupervised learning (XGBoost, CatBoost), A/B testing, ETL pipelines, and containerized API serving with FastAPI, Docker, and AWS EC2.",
      "Co-inventor on an autonomous IoT hardware patent, 1st place champion in a 500+ participant inter-college SQL query competition, and 300+ problems solved across LeetCode, StrataScratch, and DailySQL.",
    ],
  },

  experiences: [
    {
      role: "Data Engineering & AI Intern",
      company: "Zeitstone AI",
      period: "Jun 2026 – Present",
      location: "Remote",
      summary:
        "Designed end-to-end data infrastructure and ingestion pipelines for Shopify and external merchant data on AWS using Python.",
      highlights: [
        "Automated merchant data processing: built 23+ Python data pipelines that move fragmented Shopify merchant data through staging and Silver-layer workflows to automate downstream scoring.",
        "Reduced scoring execution time from 7 seconds to 3 seconds (~57%) by optimizing Python scoring logic and data processing.",
        "Built business scoring logic: implemented 23+ scoring KPIs covering promotional, margin, payment and shipping leakages, COGS, risk and fraud as reusable Python logic.",
        "Improved data processing reliability: built ingestion and transformation workflows on Shopify GraphQL Bulk Operations and Webhooks, enabling incremental retrieval and less unnecessary fetching across merchant stores.",
        "Improved scoring auditability: developed reconciliation logic with standardized business rules, data mapping and audit checks, improving score traceability and surfacing discrepancies across merchant-level calculations.",
      ],
      technologies: [
        "Python",
        "AWS",
        "Data Pipelines",
      ],
    },
    {
      role: "Data Analyst Intern",
      company: "ChatSpark",
      period: "Mar 2026 – May 2026",
      location: "Remote",
      summary:
        "Automated Python reporting pipelines and ran SQL cohort analysis to support retention decisions.",
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
      projectGroup: "ml",
      icon: "brain",
      description:
        "Built a KMeans-based customer segmentation system that classifies customers into personas, deployed as a cloud API.",
      impactMetrics: [
        "Segments users into High-Value and Budget personas using seven behavioral features.",
        "Evaluated cluster stability and separation with the Elbow Method and Silhouette scoring.",
        "Structured the code into ingestion, validation, transformation and training components with separate train and predict pipelines.",
        "Serves real-time predictions under a second through a FastAPI /predict endpoint, with a Streamlit dashboard and MongoDB Atlas for prediction logs.",
        "Containerized FastAPI, Streamlit and an Nginx reverse proxy with Docker Compose and deployed the stack on AWS EC2.",
      ],
      techStack: [
        "Python",
        "Scikit-learn",
        "KMeans",
        "FastAPI",
        "Streamlit",
        "MongoDB",
        "Nginx",
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
      projectGroup: "ml",
      icon: "chart-line-up",
      description:
        "Bike demand forecasting pipeline with temporal validation and sub-second real-time inference.",
      impactMetrics: [
        "Modeled hourly demand curves using CatBoost with rolling time-series splits to prevent lookahead bias.",
        "Tuned hyperparameters and checked performance with temporal validation across seasons.",
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
      projectGroup: "data-analytics",
      icon: "chart-pie-slice",
      description:
        "SQL-based ABC/Pareto inventory classification engine that identifies revenue-driving SKUs and fixes join amplification.",
      impactMetrics: [
        "Isolated 93 Class A SKUs driving 79.7% of total revenue using SQL-based ABC/Pareto analysis.",
        "Converted supplier inventory logs into revenue and reorder classifications.",
        "Fixed join amplification and duplicate ingestion across 9,001 transaction rows, restoring data integrity.",
        "Computed safety stock, reorder point and EOQ from daily demand statistics, counting zero-sale days so demand is not overstated.",
        "Flags each product as Healthy, Warning or Critical in a Streamlit dashboard so teams see replenishment risk at a glance.",
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
    {
      id: "self-healing-data-pipeline",
      title: "Self-Healing Data Pipeline",
      category: "ETL & LLM Inference",
      projectGroup: "data-engineering",
      icon: "database",
      description:
        "ETL pipeline that classifies review sentiment with a local LLM and recovers from failures on its own.",
      impactMetrics: [
        "Streams large Yelp review files in small batches, validating, cleaning and deduplicating each record before inference.",
        "Classifies sentiment, confidence and aspects with a local Qwen 2.5 3B model served through Ollama.",
        "Resumes from atomic checkpoints, retries with exponential backoff and quarantines records it cannot process.",
        "Schedules runs with Airflow and serves results through FastAPI to a Next.js dashboard.",
      ],
      techStack: [
        "Python",
        "Airflow",
        "Ollama",
        "Parquet",
        "FastAPI",
        "Next.js",
      ],
      githubUrl: "https://github.com/papocun/Self_healing_data_pipeline",
      isFeatured: false,
    },
    {
      id: "realtime-analytics-pipeline",
      title: "Realtime Music Analytics Pipeline",
      category: "Streaming & Data Warehouse",
      projectGroup: "data-engineering",
      icon: "database",
      description:
        "End-to-end streaming pipeline that turns music listening events into trusted warehouse tables and a live dashboard.",
      impactMetrics: [
        "Streams play, pause, skip and playlist events through Kafka with at-least-once delivery.",
        "Lands raw events in MinIO, then loads them hourly into Snowflake with Airflow and a file manifest so reruns never double-count.",
        "Transforms and tests the data with dbt, using deterministic IDs to keep songs and listeners unique across restarts.",
      ],
      techStack: ["Python", "Kafka", "MinIO", "Airflow", "Snowflake", "dbt"],
      githubUrl: "https://github.com/papocun/Realtime_analytics_pipeline",
      liveUrl: "https://realtime-analytics-pipeline.vercel.app",
      isFeatured: false,
    },
    {
      id: "digital-wallet-analytics",
      title: "Digital Wallet Analytics",
      category: "Product Analytics & Decision Making",
      projectGroup: "data-analytics",
      icon: "wallet",
      description:
        "Product analytics project for a B2C digital wallet, covering user behavior, engagement, and business decisions.",
      techStack: ["Python", "SQL", "Product Analytics", "Decision Making"],
      githubUrl: "https://github.com/papocun/digital-wallet-analytics",
      isFeatured: false,
    },
    {
      id: "taxi-fare-analysis",
      title: "Taxi Fare Analysis",
      category: "Dashboard & Business Visualization",
      projectGroup: "data-analytics",
      icon: "taxi",
      description:
        "A Power BI analysis of taxi fare data using interactive dashboards.",
      techStack: ["Power BI"],
      githubUrl: "https://github.com/papocun/taxi-fair-analysis",
      isFeatured: false,
    },
    {
      id: "my-desk-kitty",
      title: "My Desk Kitty",
      category: "Desktop Tool & Interaction",
      projectGroup: "python",
      icon: "cat",
      description:
        "An animated pixel-art cat that lives on the desktop, follows your cursor and reacts to your clicks and keystrokes.",
      impactMetrics: [
        "Switches between sitting, sleeping, looking, walking and running animations, and chases the pointer in follow mode.",
        "Runs frameless over a transparent background and clicks through to the desktop, so only the visible cat is interactive.",
        "Includes a control panel and system-tray menu to show, hide, follow or quit the cat.",
      ],
      techStack: ["Python", "PyInput", "PySide6"],
      githubUrl: "https://github.com/papocun/My-Desk-Kitty",
      isFeatured: false,
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

export interface ProjectCategoryConfig {
  id: 'ml' | 'data-engineering' | 'data-analytics' | 'python';
  title: string;
  description?: string;
}

export const PROJECT_CATEGORIES: ProjectCategoryConfig[] = [
  {
    id: 'ml',
    title: 'ML-Based Projects',
    description: 'Production ML systems, clustering models, and time-series forecasting pipelines.',
  },
  {
    id: 'data-engineering',
    title: 'Data Engineering Projects',
    description: 'Pipeline architectures, streaming ingestion, and cloud data warehouses.',
  },
  {
    id: 'data-analytics',
    title: 'Data Analytics Projects',
    description: 'SQL analytics, customer behavioral insights, and business dashboards.',
  },
  {
    id: 'python',
    title: 'Python Projects',
    description: 'Desktop tools, automation scripts, and interactive Python utilities.',
  },
];
