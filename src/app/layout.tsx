import type { Metadata } from "next";
import { Urbanist } from "next/font/google";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import GridBackground from "@/components/GridBackground";
import { ThemeProvider } from "@/components/ThemeProvider";
import { SoundProvider } from "@/components/SoundProvider";
import CustomCursor from "@/components/CustomCursor";
import TwitterFollowAlert from "@/components/TwitterFollowAlert";
import { PostHogProvider } from "@/components/PostHogProvider";
import PageTransition from "@/components/PageTransition";
import { portfolioData } from "@/data/portfolioData";
import "./globals.css";

const urbanist = Urbanist({
  variable: "--font-sans",
  subsets: ["latin"],
  weight: ["400", "500", "600", "700"],
  display: "swap",
});

export const metadata: Metadata = {
  metadataBase: new URL("https://datafolio.me"),
  title: {
    default: "Divyanshu Tiwari | Building with data, code, and AI.",
    template: "%s | Divyanshu Tiwari",
  },
  description:
    "Portfolio of Divyanshu Tiwari, a Data Scientist and ML Systems Builder working across machine learning, data, AI applications, and real-world software systems.",
  keywords: [
    "Divyanshu Tiwari",
    "Data Scientist",
    "Machine Learning Systems",
    "Applied ML Engineer",
    "FastAPI",
    "Docker",
    "CatBoost",
    "Time Series Forecasting",
    "Customer Segmentation",
    "Python",
    "SQL",
  ],
  authors: [{ name: "Divyanshu Tiwari", url: "https://datafolio.me" }],
  creator: "Divyanshu Tiwari",
  publisher: "Divyanshu Tiwari",
  robots: {
    index: true,
    follow: true,
    googleBot: {
      index: true,
      follow: true,
      "max-video-preview": -1,
      "max-image-preview": "large",
      "max-snippet": -1,
    },
  },
  alternates: {
    canonical: "https://datafolio.me/",
    types: {
      "text/markdown": "https://datafolio.me/llms.txt",
    },
  },
  openGraph: {
    type: "website",
    locale: "en_US",
    url: "https://datafolio.me/",
    siteName: "Divyanshu Tiwari",
    title: "Divyanshu Tiwari | Data Scientist & ML Systems Builder",
    description:
      "Portfolio of Divyanshu Tiwari, a Data Scientist and ML Systems Builder working across machine learning, data, AI applications, and real-world software systems.",
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
  icons: {
    icon: "/favicon.png",
    shortcut: "/favicon.png",
    apple: "/favicon.png",
  },
};

const personJsonLd = {
  "@context": "https://schema.org",
  "@type": "Person",
  name: portfolioData.name,
  url: "https://datafolio.me/",
  jobTitle: "Data Scientist & ML Systems Builder",
  description:
    "Portfolio of Divyanshu Tiwari, a Data Scientist and ML Systems Builder working across machine learning, data, AI applications, and real-world software systems.",
  sameAs: [
    portfolioData.socials.github,
    portfolioData.socials.linkedin,
    portfolioData.socials.twitter,
    portfolioData.socials.leetcode,
    portfolioData.socials.dailysql,
    portfolioData.socials.stratascratch,
  ].filter(Boolean),
  knowsAbout: [
    "Machine Learning",
    "Data Science",
    "Applied ML Systems",
    "Python",
    "SQL",
    "FastAPI",
    "Docker",
    "Time Series Forecasting",
    "Customer Segmentation",
    "Fraud Scoring",
    "A/B Testing",
    "ETL Pipelines",
  ],
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html
      lang="en"
      suppressHydrationWarning
      className={`${urbanist.variable} dark h-full antialiased`}
    >
      <head>
        <link rel="icon" type="image/png" href="/favicon.png" />
        <link rel="apple-touch-icon" href="/favicon.png" />
        <link rel="alternate" type="text/markdown" href="https://datafolio.me/llms.txt" />
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(personJsonLd) }}
        />
        <script
          dangerouslySetInnerHTML={{
            __html: `
              (function() {
                try {
                  var saved = localStorage.getItem('theme') || localStorage.getItem('workfolio-theme');
                  if (saved === 'light') {
                    document.documentElement.classList.remove('dark');
                  } else {
                    document.documentElement.classList.add('dark');
                  }
                } catch (e) {
                  document.documentElement.classList.add('dark');
                }
              })();
            `,
          }}
        />
      </head>
      <body className="min-h-full flex flex-col font-sans bg-[#FAF9F6] dark:bg-[#000000] text-slate-800 dark:text-slate-100 selection:bg-sky-100 dark:selection:bg-[#1E2732] selection:text-sky-900 dark:selection:text-[#E7E9EA]">
        <PostHogProvider>
          <ThemeProvider>
            <SoundProvider>
              <GridBackground />
              <CustomCursor />
              <Navbar />
              <div className="flex-1 w-full relative z-10 flex flex-col" role="none">
                <PageTransition>{children}</PageTransition>
              </div>
              <TwitterFollowAlert />
              <Footer />
            </SoundProvider>
          </ThemeProvider>
        </PostHogProvider>
      </body>
    </html>
  );
}
