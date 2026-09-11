# Projects — Divyanshu Tiwari

Production ML systems, forecasting pipelines, and data tools I've built and deployed.

## Featured Projects

### 1. Customer Intelligence Engine
- **Category**: Unsupervised ML & Cloud API
- **Summary**: Customer segmentation system grouping user behavior into high-value and budget personas, served via cloud API.
- **Key Details**:
  - Segments users into High-Value and Budget tiers using seven behavioral features.
  - Evaluated cluster stability and separation with the Elbow Method and Silhouette scoring.
  - Containerized with Docker Compose and deployed on AWS EC2 via FastAPI.
- **Technologies**: Python, Scikit-learn, KMeans, FastAPI, Docker, AWS EC2
- **GitHub**: https://github.com/papocun/Customer-Segmentation-Project
- **Live Demo**: http://16.171.71.103/

### 2. DemandCast
- **Category**: Time-Series & Production ML
- **Summary**: Bike demand forecasting pipeline with strict temporal validation and sub-second inference.
- **Key Details**:
  - Modeled hourly demand curves using CatBoost with rolling time-series splits to prevent lookahead bias.
  - Containerized and deployed on AWS with FastAPI.
- **Technologies**: Python, CatBoost, FastAPI, Docker, AWS
- **GitHub**: https://github.com/papocun/DemandCast

### 3. Inventory Intelligence Engine
- **Category**: Analytics & SQL Optimization
- **Summary**: SQL-driven ABC/Pareto inventory engine prioritizing revenue-critical SKUs and fixing join duplication.
- **Key Details**:
  - Isolated 93 Class A SKUs driving 79.7% of total revenue.
  - Fixed join amplification and duplicate ingestion across 9,001 transaction rows, restoring data integrity.
- **Technologies**: Python, Pandas, MySQL, Plotly, Streamlit, Railway
- **GitHub**: https://github.com/papocun/Inventory-supply-chain-optimization

## Navigation

- [Home](https://datafolio.me/): Homepage & contact
- [Experience](https://datafolio.me/experience): Work & internships
- [Code](https://datafolio.me/code): Problem solving & stats
- [Blog](https://datafolio.me/blog): Technical writing
