import type { Metadata } from 'next';
import TextScramble from "@/components/TextScramble";
import { HoverPreviewLink } from "@/components/ui/hover-preview-link";
import ChessPreviewThumb from "@/components/ChessPreviewThumb";
import ResumeButton from "@/components/ResumeButton";
import EmailContactLink from "@/components/EmailContactLink";
import LocationTag from "@/components/LocationTag";import ActivityTabs from "@/components/ActivityTabs";
import FeaturedProjects from "@/components/FeaturedProjects";
import SkillsSection from "@/components/SkillsSection";
import ExperienceTimeline from "@/components/ExperienceTimeline";
import { EXPERIENCES } from "@/data/experiences";
import { portfolioData } from "@/data/portfolioData";
import { CODING_PROFILE_CONFIGS } from "@/data/codingProfiles";

export const metadata: Metadata = {
  title: "Divyanshu Tiwari",
  description:
    "Portfolio of Divyanshu Tiwari, a Data Scientist building ML systems, data pipelines, and AI applications.",
  alternates: {
    canonical: "https://datafolio.me/",
    types: {
      "text/markdown": "https://datafolio.me/llms.txt",
    },
  },
  openGraph: {
    title: "Divyanshu Tiwari",
    description:
      "Portfolio of Divyanshu Tiwari, a Data Scientist building ML systems, data pipelines, and AI applications.",
    url: "https://datafolio.me/",
    siteName: "Divyanshu Tiwari",
    locale: "en_US",
    type: "website",
    images: [
      {
        url: "/favicon.png",
        width: 512,
        height: 512,
        alt: "Divyanshu Tiwari",
      },
    ],
  },
  twitter: {
    card: "summary",
    title: "Divyanshu Tiwari",
    description:
      "Portfolio of Divyanshu Tiwari, a Data Scientist building ML systems, data pipelines, and AI applications.",
    creator: "@21dvy_t",
    images: ["/favicon.png"],
  },
};

export default function HomePage() {
  return (
    <main className="w-full max-w-[680px] mx-auto px-4 sm:px-6 pt-6 sm:pt-10 pb-16 sm:pb-20 min-w-0">
      {/* Main Heading with Animated Scramble only on the Name */}
      <h1 className="text-[25px] min-[360px]:text-[28px] sm:text-[34px] font-bold text-slate-900 dark:text-slate-100 leading-[1.2] tracking-tight mb-4 sm:mb-5 break-words text-balance">
        Hi, I&rsquo;m{" "}
        <TextScramble
          text="Divyanshu Tiwari"
          className="text-slate-900 dark:text-slate-100 font-bold tracking-tight"
        />
      </h1>

      {/* Narrative Bio Story */}
      <div id="about" className="scroll-mt-24 space-y-3.5 sm:space-y-4.5 text-[15px] sm:text-[16px] text-slate-600 dark:text-slate-300 leading-[1.7]">
        <p className="text-pretty max-w-[65ch]">
          22, working in{" "}
          <span className="font-bold text-slate-900 dark:text-slate-100">Data &amp; AI</span>
          . I enjoy exploring how technology works, building things, solving
          problems, and understanding what happens under the hood. Usually found
          experimenting with code, exploring new ideas, or figuring out why
          something broke. Curious about a lot of things and always learning.
          Outside tech, I enjoy maths, books, and{" "}
          <HoverPreviewLink
            href="https://www.chess.com/member/papocun"
            title="papocun on Chess.com"
            domain="chess.com"
            image={<ChessPreviewThumb />}
            className="font-bold text-slate-900 dark:text-slate-100 hover:text-sky-500 dark:hover:text-[#1D9BF0] transition-colors"
          >
            chess
          </HoverPreviewLink>
          .
        </p>

        {/* Location Row */}
        <LocationTag location="Delhi" className="pt-1.5" showTooltips={true} />
      </div>

      {/* Action Links & Resume Button */}
      <div className="flex flex-wrap items-center gap-3.5 sm:gap-6 pt-5 sm:pt-8 mt-2 text-[14px] sm:text-[14.5px]">
        <EmailContactLink email={portfolioData.email} />

        {/* Sliding Pill Resume Action */}
        <ResumeButton href={portfolioData.socials.resumeUrl} />      </div>

      {/* Top Divider for Activity Section */}
      <hr className="border-t border-slate-200/80 dark:border-[#2F3336]/60 my-6 sm:my-7" />

      {/* Activity Section */}
      <section className="w-full max-w-full min-w-0" aria-label="Activity">
        <h2 className="text-[19px] sm:text-[21px] font-bold text-slate-900 dark:text-slate-100 tracking-tight mb-3.5 sm:mb-4">
          Activity
        </h2>

        <ActivityTabs githubUsername="papocun" leetcodeUsername={CODING_PROFILE_CONFIGS.leetcode.username} />
      </section>

      {/* Top Divider for Projects Section */}
      <hr className="border-t border-slate-200/80 dark:border-[#2F3336]/60 my-6 sm:my-7" />

      {/* Featured Projects */}
      <FeaturedProjects />

      {/* Top Divider for Skills Section */}
      <hr className="border-t border-slate-200/80 dark:border-[#2F3336]/60 my-6 sm:my-7" />

      {/* Skills Section */}
      <SkillsSection />

      {/* Top Divider for Experience Section */}
      <hr className="border-t border-slate-200/80 dark:border-[#2F3336]/60 my-6 sm:my-7" />

      {/* Work Experience */}
      <section className="w-full max-w-full min-w-0" aria-label="Work Experience">
        <h2 className="text-[19px] sm:text-[21px] font-bold text-slate-900 dark:text-slate-100 tracking-tight mb-2 sm:mb-3">
          Work Experience
        </h2>
        <ExperienceTimeline experiences={EXPERIENCES} />
      </section>
    </main>
  );
}
