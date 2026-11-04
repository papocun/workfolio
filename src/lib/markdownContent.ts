import { portfolioData } from '@/data/portfolioData';

export const LLMS_TXT_CONTENT = `# Divyanshu Tiwari

> Data Scientist and ML Systems Builder working across machine learning, data, AI applications, and software.

## About
 
22, working in Data & AI. Most days I'm building data pipelines and trying to make them actually reliable, not just working once and breaking later. Lately I've been figuring out where LLMs and RAG genuinely help with data work, and where people are just forcing AI into things that don't need it. Outside of that: chess, coffee, and writing. Thanks for stopping by :)
 
- Location: India
- Email: divyanshutiwari281@gmail.com
- Website: https://datafolio.me/

## Projects

- [Customer Intelligence Engine](https://datafolio.me/projects): KMeans customer segmentation system with real-time cloud API on AWS EC2.
  - Category: Unsupervised ML & Cloud API
  - Stack: Python, Scikit-learn, KMeans, FastAPI, Docker, AWS EC2
  - GitHub: https://github.com/papocun/Customer-Segmentation-Project
  - Live Demo: http://16.171.71.103/

- [DemandCast](https://datafolio.me/projects): Bike demand forecasting pipeline with CatBoost and temporal validation.
  - Category: Time-Series & Production ML
  - Stack: Python, CatBoost, FastAPI, Docker, AWS
  - GitHub: https://github.com/papocun/DemandCast

- [Inventory Intelligence Engine](https://datafolio.me/projects): SQL-based ABC/Pareto inventory classification engine optimizing revenue-driving SKUs.
  - Category: Analytics & SQL Optimization
  - Stack: Python, Pandas, MySQL, Plotly, Streamlit, Railway
  - GitHub: https://github.com/papocun/Inventory-supply-chain-optimization

## Experience

- [Zeitstone AI](https://datafolio.me/experience) (Jun 2026 – Present) — Data Engineering & AI Intern
  - Built 23+ Python data pipelines and scoring KPIs for Shopify merchant data on AWS; cut scoring time from 7s to 3s.
  - Stack: Python, AWS, Data Pipelines

- [ChatSpark](https://datafolio.me/experience) (Mar 2026 – May 2026) — Data Analyst Intern
  - Automated Python Excel reporting pipeline (cut generation time from 3+ hours to <5 mins).
  - SQL cohort analysis uncovering 15% decline in 90-day repeat purchases.
  - Stack: Python, SQL, Excel Automation, Cohort Analysis, Dashboards.

## Code

- [LeetCode](https://leetcode.com/u/21_dvynshx/): 130+ algorithm and data structure problems solved.
- [DailySQL](https://dailysql.in/u/divyanshutiwari281): 100+ SQL query optimization problems solved.
- [StrataScratch](https://platform.stratascratch.com/user/papocun): 80+ data science & query challenges solved.
- 1st Place Champion: Query Quest SQL Championship (500+ participants).

## Blog

- [Blog](https://datafolio.me/blog): Technical writing and research notes on ML systems, data engineering, and LLM applications (under construction).

## Contact

- Homepage: https://datafolio.me/
- Email: divyanshutiwari281@gmail.com
- GitHub: https://github.com/papocun
- LinkedIn: https://www.linkedin.com/in/divyansh21/
- Twitter / X: https://x.com/21dvy_t
- Resume: https://drive.google.com/file/d/1fCisWglo58yyOrg-YUc2WyPyj2GJRQiC/view?usp=sharing
`;

export const HOMEPAGE_MARKDOWN = `# Divyanshu Tiwari

**Data Scientist. ML Systems Builder.**
Location: India
Email: divyanshutiwari281@gmail.com
Website: https://datafolio.me/

## About

I work at the intersection of data, machine learning, and software, building systems that solve problems beyond a notebook. I've worked with startups and small teams on problems ranging from fraud scoring and forecasting to automation and real-time APIs, where the interesting part is usually turning an idea into something reliable enough to use.

My work moves between experimentation and engineering. I enjoy understanding the problem first, testing what actually works, and then building the pieces around it. Sometimes that means an ML model, sometimes a data pipeline or API, and sometimes figuring out why the numbers don't make sense in the first place.

These days, I'm also exploring LLMs, RAG, and AI applications—mostly with the same question in mind: can this be made genuinely useful, or is it just another demo?

Outside of work, I build side projects, play chess, read, and follow whatever happens to catch my curiosity. I like learning by building, breaking things, and going deep enough to understand how they work.

## Projects

- [Customer Intelligence Engine](https://datafolio.me/projects): KMeans customer segmentation system with real-time cloud API on AWS EC2.
- [DemandCast](https://datafolio.me/projects): Bike demand forecasting pipeline with CatBoost and temporal validation.
- [Inventory Intelligence Engine](https://datafolio.me/projects): SQL-based ABC/Pareto inventory classification engine optimizing revenue-driving SKUs.

## Experience

- [Zeitstone AI](https://datafolio.me/experience) (Data Engineering & AI Intern, Jun 2026 – Present): End-to-end data infrastructure and ingestion pipelines for Shopify and external merchant data on AWS using Python.
- [ChatSpark](https://datafolio.me/experience) (Data Analyst Intern, Mar 2026 – May 2026): Python Excel pipeline automation and SQL cohort analysis.

## Code

- [LeetCode](https://leetcode.com/u/21_dvynshx/): 130+ problems solved.
- [DailySQL](https://dailysql.in/u/divyanshutiwari281): 100+ SQL optimization problems solved.
- [StrataScratch](https://platform.stratascratch.com/user/papocun): 80+ data science problems solved.

## Blog

- [Blog](https://datafolio.me/blog): Writing and technical notes (under construction).

## Resources & Links

- [LLMs Reference](https://datafolio.me/llms.txt): Machine-readable index for AI agents and LLMs.
- [Sitemap](https://datafolio.me/sitemap.xml): XML sitemap of all public pages.

## Contact

- Email: divyanshutiwari281@gmail.com
- GitHub: https://github.com/papocun
- LinkedIn: https://www.linkedin.com/in/divyansh21/
- Twitter / X: https://x.com/21dvy_t
- Resume: https://drive.google.com/file/d/1fCisWglo58yyOrg-YUc2WyPyj2GJRQiC/view?usp=sharing
`;

export const PROJECTS_MARKDOWN = `# Projects — Divyanshu Tiwari

A curated selection of machine learning systems, predictive pipelines, analytics engines, and desktop tools built by Divyanshu Tiwari.

## ML-Based Projects

### 1. Customer Intelligence Engine
- **Category**: Unsupervised ML & Cloud API
- **Summary**: Built a KMeans-based customer segmentation system that classifies customers into personas, deployed as a cloud API.
- **Key Details**:
  - Classifies customers into High-Value and Budget personas using seven behavioral features.
  - Validated segmentation using the Elbow Method and Silhouette Score.
  - Containerized with Docker Compose and deployed on AWS EC2 with FastAPI.
- **Technologies**: Python, Scikit-learn, KMeans, FastAPI, Docker, AWS EC2
- **GitHub**: https://github.com/papocun/Customer-Segmentation-Project
- **Live Demo**: http://16.171.71.103/

### 2. DemandCast
- **Category**: Time-Series & Production ML
- **Summary**: Bike demand forecasting pipeline with temporal validation and sub-second real-time inference.
- **Key Details**:
  - Modeled demand patterns using CatBoost with temporal train/test split.
  - Containerized and deployed on AWS with FastAPI.
- **Technologies**: Python, CatBoost, FastAPI, Docker, AWS
- **GitHub**: https://github.com/papocun/DemandCast

## Data Engineering Projects

*Projects coming soon.*

## Data Analytics Projects

### 1. Inventory Intelligence Engine
- **Category**: Analytics & SQL Optimization
- **Summary**: SQL-based ABC/Pareto inventory classification engine that identifies revenue-driving SKUs and fixes join amplification.
- **Key Details**:
  - Identified 93 Class A SKUs responsible for 79.7% of revenue.
  - Resolved join amplification and duplicate ingestion issues across 9,001 records.
- **Technologies**: Python, Pandas, MySQL, Plotly, Streamlit, Railway
- **GitHub**: https://github.com/papocun/Inventory-supply-chain-optimization

### 2. Digital Wallet Analytics
- **Category**: Product Analytics & Decision Making
- **Summary**: Product analytics project for a B2C digital wallet, covering user behavior, engagement, and business decisions.
- **Technologies**: Python, SQL, Product Analytics, Decision Making
- **GitHub**: https://github.com/papocun/digital-wallet-analytics

### 3. Taxi Fare Analysis
- **Category**: Dashboard & Business Visualization
- **Summary**: A Power BI analysis of taxi fare data using interactive dashboards.
- **Technologies**: Power BI
- **GitHub**: https://github.com/papocun/taxi-fair-analysis

## Python Projects

### 1. My Desk Kitty
- **Category**: Desktop Tool & Interaction
- **Summary**: A small interactive Python desktop experiment: a virtual cat that reacts to keyboard activity.
- **Technologies**: Python, PyInput, PySide6
- **GitHub**: https://github.com/papocun/My-Desk-Kitty

## Navigation

- [Home](https://datafolio.me/): Homepage & contact
- [Experience](https://datafolio.me/experience): Work & internships
- [Code](https://datafolio.me/code): Problem solving & stats
- [Blog](https://datafolio.me/blog): Technical writing
`;

export const EXPERIENCE_MARKDOWN = `# Experience — Divyanshu Tiwari

Professional track record in machine learning engineering, predictive scoring, and data analytics.

## Work History

### Data Engineering & AI Intern — Zeitstone AI
- **Period**: Jun 2026 – Present
- **Location**: Remote
- **Summary**:
  - Automated merchant data processing: built 23+ Python data pipelines that move fragmented Shopify merchant data through staging and Silver-layer workflows to automate downstream scoring.
  - Reduced scoring execution time from 7 seconds to 3 seconds (~57%) by optimizing Python scoring logic and data processing.
  - Built business scoring logic: implemented 23+ scoring KPIs covering promotional, margin, payment and shipping leakages, COGS, risk and fraud as reusable Python logic.
  - Improved data processing reliability: built ingestion and transformation workflows on Shopify GraphQL Bulk Operations and Webhooks, enabling incremental retrieval and less unnecessary fetching across merchant stores.
  - Improved scoring auditability: developed reconciliation logic with standardized business rules, data mapping and audit checks, improving score traceability and surfacing discrepancies across merchant-level calculations.
- **Technologies**: Python, AWS, Data Pipelines

### Data Analyst Intern — ChatSpark
- **Period**: Mar 2026 – May 2026
- **Location**: Remote
- **Summary**:
  - Automated Python Excel reporting pipeline, reducing report generation from 3+ hours to under 5 minutes.
  - Performed SQL cohort analysis on transactional data identifying a 15% decline in 90-day repeat purchases.
  - Maintained recurring business dashboards for operational decision-making.
- **Technologies**: Python, SQL, Excel Automation, Cohort Analysis, Dashboards

## Navigation

- [Home](https://datafolio.me/): Homepage & contact
- [Projects](https://datafolio.me/projects): Production ML projects
- [Code](https://datafolio.me/code): Problem solving & stats
- [Blog](https://datafolio.me/blog): Technical writing
`;

export const CODE_MARKDOWN = `# Code & Problem Solving — Divyanshu Tiwari

Competitive programming, algorithms, data structures, and database query optimization profiles.

## Profiles & Stats

- **LeetCode**: [@21_dvynshx](https://leetcode.com/u/21_dvynshx/)
  - Solved 130+ algorithmic problems across arrays, trees, dynamic programming, and graphs.
- **DailySQL**: [@divyanshutiwari281](https://dailysql.in/u/divyanshutiwari281)
  - Solved 100+ SQL optimization and query problems.
- **StrataScratch**: [@papocun](https://platform.stratascratch.com/user/papocun)
  - Solved 80+ data engineering and interview problems.

## Achievements

- **1st Place — Query Quest SQL Championship**: Inter-college SQL query optimization competition (500+ participants).
- **300+ Problems Solved**: Total across LeetCode, DailySQL, and StrataScratch.

## Navigation

- [Home](https://datafolio.me/): Homepage & contact
- [Projects](https://datafolio.me/projects): Production ML projects
- [Experience](https://datafolio.me/experience): Work & internships
- [Blog](https://datafolio.me/blog): Technical writing
`;

export const BLOG_MARKDOWN = `# Blog — Divyanshu Tiwari

Technical writing, research notes, and engineering lessons on applied machine learning, data engineering, and AI systems.

## Status

*This section is currently under construction. Articles and deep-dives will be published soon.*

## Navigation

- [Home](https://datafolio.me/): Homepage & contact
- [Projects](https://datafolio.me/projects): Production ML projects
- [Experience](https://datafolio.me/experience): Work & internships
- [Code](https://datafolio.me/code): Problem solving & stats
`;

export function getMarkdownForPath(pathname: string): string | null {
  const normalized = pathname.replace(/\/$/, '').toLowerCase() || '/';

  switch (normalized) {
    case '/':
      return HOMEPAGE_MARKDOWN;
    case '/projects':
      return PROJECTS_MARKDOWN;
    case '/experience':
      return EXPERIENCE_MARKDOWN;
    case '/code':
      return CODE_MARKDOWN;
    case '/blog':
      return BLOG_MARKDOWN;
    case '/llms.txt':
      return LLMS_TXT_CONTENT;
    default:
      return null;
  }
}
