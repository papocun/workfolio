import type { Metadata } from 'next';
import Link from 'next/link';
import TextScramble from "@/components/TextScramble";
import ResumeButton from "@/components/ResumeButton";
import AlertBanner from "@/components/ui/AlertBanner";
import EmailContactLink from "@/components/EmailContactLink";
import LocationTag from "@/components/LocationTag";
import { portfolioData } from "@/data/portfolioData";

export const metadata: Metadata = {
  title: "Divyanshu Tiwari | Data Scientist & ML Systems Builder",
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
    <main className="max-w-[680px] mx-auto px-4 sm:px-6 pt-6 sm:pt-10 pb-16 sm:pb-20 transition-colors duration-200 ease-[cubic-bezier(0.4,0,0.2,1)]">
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
      <h1 className="text-[22px] sm:text-[28px] font-bold text-slate-900 dark:text-slate-100 leading-[1.2] tracking-tight mb-4 sm:mb-5">
        Hi, I&apos;m{" "}
        <TextScramble
          text="Divyanshu Tiwari"
          className="text-slate-900 dark:text-slate-100 font-bold tracking-tight"
        />
      </h1>

      {/* Narrative Bio Story */}
      <div className="space-y-3.5 sm:space-y-4.5 text-[13.5px] sm:text-[14.5px] text-slate-600 dark:text-slate-300 leading-[1.65]">
        <p>
          22 | Working in{" "}
          <Link
            href="/experience"
            className="font-bold text-slate-900 dark:text-slate-100 hover:text-[#1D9BF0] dark:hover:text-[#1D9BF0] transition-colors"
          >
            Data &amp; AI
          </Link>
          . Most of my time goes into testing ideas, building models, and
          checking whether the results actually hold up or just look good on the
          surface.
        </p>
        <p>
          This is my corner of the internet, where I share what I&apos;m
          building, learning, and occasionally getting wrong. The work is
          largely a loop: try something, see where it breaks, figure out if the
          issue is the data, the assumptions, or the approach, then build the
          actual system around what holds up, be it a model, a pipeline, or an
          API.
        </p>
        <p>
          Right now I&apos;m working through LLMs, RAG, and inference
          engineering, figuring out where they genuinely hold up in real
          projects and where they don&apos;t.
        </p>
        <p>
          Outside work:{" "}
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
          . Happy to have you here on datafolio, enjoy exploring :)
        </p>

        {/* Location Row */}
        <LocationTag location="Delhi" className="pt-1.5" />
      </div>

      {/* Action Links & Resume Button */}
      <div className="flex flex-wrap items-center gap-4 sm:gap-6 pt-6 sm:pt-8 mt-2 text-[12.5px] sm:text-[13px]">
        <EmailContactLink email={portfolioData.email} />

        {/* Sliding Pill Resume Action */}
        <ResumeButton href={portfolioData.socials.resumeUrl} />
      </div>
    </main>
  );
}
