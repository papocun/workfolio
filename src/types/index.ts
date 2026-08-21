/* ============================================================
   WORKFOLIO — TypeScript Type Definitions
   Single source of truth for all portfolio data structures.
   ============================================================ */

/** Social media and external profile links. */
export interface SocialLinks {
  github: string;
  linkedin: string;
  twitter?: string;
  leetcode?: string;
  dailysql?: string;
  resumeUrl: string;
}

/** Hero section content — headline, status badge, and bio paragraphs. */
export interface HeroSection {
  badge: string;
  title: string;
  bio: [string, string, string];
}

/** Professional work experience entry. */
export interface Experience {
  role: string;
  company: string;
  period: string;
  location: string;
  highlights: string[];
  technologies: string[];
}

/** Portfolio project entry with impact metrics and tech stack. */
export interface Project {
  id: string;
  title: string;
  category: string;
  description: string;
  impactMetrics: string[];
  techStack: string[];
  githubUrl: string;
  liveUrl?: string;
  isFeatured: boolean;
  imageSrc?: string;
}

/** Educational qualification. */
export interface Education {
  institution: string;
  degree: string;
  period: string;
}

/** Achievement, award, or credential entry. */
export interface Achievement {
  title: string;
  subtitle: string;
  description: string;
  badgeText?: string;
}

/** Technical skills grouped by domain category. */
export interface SkillMatrix {
  core: string[];
  dataAndBI: string[];
  deploymentAndDevOps: string[];
}

/** Top-level portfolio data shape. */
export interface PersonalProfile {
  name: string;
  roleHeadline: string;
  location: string;
  email: string;
  phone: string;
  socials: SocialLinks;
  hero: HeroSection;
  experiences: Experience[];
  projects: Project[];
  education: Education;
  achievements: Achievement[];
  skills: SkillMatrix;
}
