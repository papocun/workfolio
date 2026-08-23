import type { Metadata } from 'next';
import TextScramble from "@/components/TextScramble";
import ResumeButton from "@/components/ResumeButton";
import AlertBanner from "@/components/ui/AlertBanner";
import EmailContactLink from "@/components/EmailContactLink";
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

      {/* Greeting */}
      <p className="text-[14px] sm:text-[16px] text-slate-500 dark:text-slate-400 font-medium mb-1 sm:mb-2 leading-snug">
        Hi, I&apos;m{" "}
        <TextScramble
          text="Divyanshu"
          className="text-slate-900 dark:text-slate-100 font-semibold tracking-normal"
        />
        .
      </p>

      {/* Headline */}
      <h1 className="text-[22px] sm:text-[28px] font-bold text-slate-900 dark:text-slate-100 leading-[1.2] tracking-tight mb-3 sm:mb-4">
        Data Scientist. ML Systems Builder.
      </h1>

      {/* Narrative Bio — Rendered directly in Server HTML for crawlers and agents */}
      <div className="space-y-3.5 sm:space-y-4.5 text-[13.5px] sm:text-[14.5px] text-slate-600 dark:text-slate-300 leading-[1.65]">
        <p>
          I work at the intersection of data, machine learning, and software,
          building systems that solve problems beyond a notebook. I&apos;ve
          worked with startups and small teams on problems ranging from fraud
          scoring and forecasting to automation and real-time APIs, where the
          interesting part is usually turning an idea into something reliable
          enough to use.
        </p>
        <p>
          My work moves between experimentation and engineering. I enjoy
          understanding the problem first, testing what actually works, and then
          building the pieces around it. Sometimes that means an ML model,
          sometimes a data pipeline or API, and sometimes figuring out why the
          numbers don&apos;t make sense in the first place.
        </p>
        <p>
          These days, I&apos;m also exploring LLMs, RAG, and AI
          applications&mdash;mostly with the same question in mind: can this be
          made genuinely useful, or is it just another demo?
        </p>
        <p>
          Outside of work, I build side projects, play chess, read, and follow
          whatever happens to catch my curiosity. I like learning by building,
          breaking things, and going deep enough to understand how they work.
        </p>
      </div>

      {/* Action Links & Creative Resume Button */}
      <div className="flex flex-wrap items-center gap-4 sm:gap-6 pt-6 sm:pt-8 mt-2 text-[12.5px] sm:text-[13px]">
        <EmailContactLink email={portfolioData.email} />

        {/* Creative Sliding Pill Resume Action */}
        <ResumeButton href={portfolioData.socials.resumeUrl} />
      </div>
    </main>
  );
}
