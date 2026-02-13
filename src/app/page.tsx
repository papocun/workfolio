import TextScramble from "@/components/TextScramble";
import ResumeButton from "@/components/ResumeButton";
import AlertBanner from "@/components/ui/AlertBanner";
import { portfolioData } from "@/data/portfolioData";

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
      <p className="text-[14px] sm:text-[16px] text-slate-500 dark:text-slate-400 font-medium mb-2 sm:mb-3.5 leading-snug">
        Hi, I&apos;m{" "}
        <TextScramble
          text="Divyanshu"
          className="text-slate-900 dark:text-slate-100 font-semibold tracking-normal"
        />
        .
      </p>

      {/* Headline */}
      <h1 className="text-[22px] sm:text-[28px] font-bold text-slate-900 dark:text-slate-100 leading-[1.2] tracking-tight mb-4 sm:mb-6">
        Data Scientist. Applied ML Systems Builder.
      </h1>

      {/* Narrative Bio — Only ZeitstoneAI is bold */}
      <div className="space-y-3.5 sm:space-y-4.5 text-[13.5px] sm:text-[14.5px] text-slate-600 dark:text-slate-300 leading-[1.65]">
        <p>
          I&apos;m a Data Scientist building production-grade ML systems across
          fraud scoring, forecasting, segmentation, and real-time APIs.
          Currently at{" "}
          <strong className="font-semibold text-slate-900 dark:text-slate-100">ZeitstoneAI</strong>
          , where I work on weighted fraud-risk scoring pipelines and take models
          from data and experimentation toward real-world deployment.
        </p>
        <p>
          My work spans supervised and unsupervised ML, statistical
          experimentation, and ML engineering, with hands-on experience across
          CatBoost, XGBoost, KMeans, FastAPI, Docker, AWS, and MLflow.
        </p>
        <p>
          Beyond traditional ML, I also build with LLMs, RAG, fine-tuning, and AI
          applications, exploring how intelligent systems can be made useful,
          reliable, and practical.
        </p>
        <p>
          I freelance on the side, working on automation and analytics projects
          that turn repetitive workflows and messy data into systems people can
          actually use. Outside of all that, I&apos;m a chess player, reader,
          and builder who enjoys side projects, experiments, and occasionally
          going far too deep into something just because it caught my curiosity.
        </p>
      </div>

      {/* Action Links & Creative Resume Button */}
      <div className="flex flex-wrap items-center gap-4 sm:gap-6 pt-6 sm:pt-8 mt-2 text-[12.5px] sm:text-[13px]">
        <a
          href="https://mail.google.com/mail/?view=cm&fs=1&to=divyanshutiwari281@gmail.com"
          target="_blank"
          rel="noopener noreferrer"
          className="group relative py-0.5 text-slate-600 dark:text-slate-300 hover:text-slate-900 dark:hover:text-white transition-colors duration-150 ease-[cubic-bezier(0.4,0,0.2,1)] break-all sm:break-normal"
        >
          <span>divyanshutiwari281@gmail.com</span>
          <span className="absolute -bottom-0.5 left-0 h-[1.5px] w-full bg-slate-900 dark:bg-slate-100 origin-left scale-x-0 group-hover:scale-x-100 transition-transform duration-200 ease-out" />
        </a>

        {/* Creative Sliding Pill Resume Action */}
        <ResumeButton href={portfolioData.socials.resumeUrl} />
      </div>
    </main>
  );
}
