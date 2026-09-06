import type { Metadata } from 'next';
import Link from 'next/link';
import TextScramble from "@/components/TextScramble";
import ResumeButton from "@/components/ResumeButton";
import AlertBanner from "@/components/ui/AlertBanner";
import EmailContactLink from "@/components/EmailContactLink";
import LocationTag from "@/components/LocationTag";
import GitHubContributions from "@/components/GitHubContributions";
import LeetCodeContributions from "@/components/LeetCodeContributions";
import SkillsSection from "@/components/SkillsSection";
import ThoughtSection from "@/components/ThoughtSection";
import { portfolioData } from "@/data/portfolioData";
import { CODING_PROFILE_CONFIGS } from "@/data/codingProfiles";

export const metadata: Metadata = {
  title: "Divyanshu Tiwari | Building with data, code, and AI.",
  description:
    "Portfolio of Divyanshu Tiwari, a Data Scientist and ML Systems Builder working across machine learning, data, AI applications, and real-world software systems.",
  alternates: {
    canonical: "https://datafolio.me/",
    types: {
      "text/markdown": "https://datafolio.me/llms.txt",
    },
  },
  openGraph: {
    title: "Divyanshu Tiwari | Data Scientist & ML Systems Builder",
    description:
      "Portfolio of Divyanshu Tiwari, a Data Scientist and ML Systems Builder working across machine learning, data, AI applications, and real-world software systems.",
    url: "https://datafolio.me/",
    siteName: "Divyanshu Tiwari",
    locale: "en_US",
    type: "website",
    images: [
      {
        url: "/images/projects/NUmercaiq.gif",
        width: 400,
        height: 400,
        alt: "Divyanshu Tiwari — Data Scientist & ML Systems Builder",
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    title: "Divyanshu Tiwari | Data Scientist & ML Systems Builder",
    description:
      "Portfolio of Divyanshu Tiwari, a Data Scientist and ML Systems Builder working across machine learning, data, AI applications, and real-world software systems.",
    creator: "@21dvy_t",
    images: ["/images/projects/NUmercaiq.gif"],
  },
};

export default function HomePage() {
  return (
    <main className="w-full max-w-[680px] mx-auto px-4 sm:px-6 pt-6 sm:pt-10 pb-16 sm:pb-20 min-w-0">
      {/* Main Notice Banner */}
      <AlertBanner
        title="Notice: Some pages are still being built"
        description="A few sections of my portfolio are still under construction. I’m updating them and will have them ready soon."
        variant="warning"
        dismissible={true}
        autoClose={true}
        autoCloseDuration={5000}
      />

      {/* Main Heading with Animated Scramble only on the Name */}
      <h1 className="text-[25px] min-[360px]:text-[28px] sm:text-[34px] font-bold text-slate-900 dark:text-slate-100 leading-[1.2] tracking-tight mb-4 sm:mb-5 break-words">
        Hi, I&apos;m{" "}
        <TextScramble
          text="Divyanshu Tiwari"
          className="text-slate-900 dark:text-slate-100 font-bold tracking-tight"
        />
      </h1>

      {/* Narrative Bio Story */}
      <div className="space-y-3.5 sm:space-y-4.5 text-[15px] sm:text-[16px] text-slate-600 dark:text-slate-300 leading-[1.7]">
        <p>
          22, working in{" "}
          <Link
            href="/experience"
            className="font-bold text-slate-900 dark:text-slate-100 hover:text-[#1D9BF0] dark:hover:text-[#1D9BF0] transition-colors"
          >
            Data &amp; AI
          </Link>
          . Most days I&apos;m building data pipelines and trying to make them
          actually reliable not just working once and breaking later. Lately
          I&apos;ve been figuring out where LLMs and RAG genuinely help with data
          work, and where people are just forcing AI into things that don&apos;t
          need it.
        </p>
        <p>
          Outside of that:{" "}
          <a
            href="https://www.chess.com/member/papocun"
            target="_blank"
            rel="noopener noreferrer"
            className="font-bold text-slate-900 dark:text-slate-100 hover:text-[#1D9BF0] dark:hover:text-[#1D9BF0] transition-colors"
          >
            chess
          </a>
          , coffee, and{" "}
          <Link
            href="/blog"
            className="font-bold text-slate-900 dark:text-slate-100 hover:text-[#1D9BF0] dark:hover:text-[#1D9BF0] transition-colors"
          >
            writing
          </Link>
          . Thanks for stopping by :)
        </p>

        {/* Location Row */}
        <LocationTag location="Delhi" className="pt-1.5" showTooltips={true} />
      </div>

      {/* Action Links & Resume Button */}
      <div className="flex flex-wrap items-center gap-3.5 sm:gap-6 pt-5 sm:pt-8 mt-2 text-[14px] sm:text-[14.5px]">
        <EmailContactLink email={portfolioData.email} />

        {/* Sliding Pill Resume Action */}
        <ResumeButton href={portfolioData.socials.resumeUrl} />
      </div>

      {/* Top Divider for Activity Section */}
      <hr className="border-t border-slate-200/80 dark:border-[#2F3336]/60 my-6 sm:my-7" />

      {/* Activity Section */}
      <section className="w-full max-w-full min-w-0" aria-label="Activity">
        <h2 className="text-[19px] sm:text-[21px] font-bold text-slate-900 dark:text-slate-100 tracking-tight mb-3.5 sm:mb-4">
          Activity
        </h2>

        {/* GitHub Contribution Calendar */}
        <GitHubContributions username="papocun" />

        {/* LeetCode Contribution Calendar */}
        <div className="mt-3.5 sm:mt-4">
          <LeetCodeContributions username={CODING_PROFILE_CONFIGS.leetcode.username} />
        </div>
      </section>

      {/* Skills Section */}
      <SkillsSection />

      {/* Thought Section */}
      <ThoughtSection />
    </main>
  );
}
