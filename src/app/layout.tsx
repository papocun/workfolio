import type { Metadata } from "next";
import { Urbanist } from "next/font/google";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import GridBackground from "@/components/GridBackground";
import { ThemeProvider } from "@/components/ThemeProvider";
import CustomCursor from "@/components/CustomCursor";
import TwitterFollowAlert from "@/components/TwitterFollowAlert";
import { PostHogProvider } from "@/components/PostHogProvider";
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
    default: "Divyanshu Tiwari | Data Scientist & ML Systems Builder",
    template: "%s | Divyanshu Tiwari",
  },
  description:
    "Data Scientist and ML systems builder working across machine learning, data, AI applications, and software.",
  authors: [{ name: "Divyanshu Tiwari", url: "https://datafolio.me" }],
  creator: "Divyanshu Tiwari",
  publisher: "Divyanshu Tiwari",
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
      "Data Scientist and ML systems builder working across machine learning, data, AI applications, and software.",
  },
  twitter: {
    card: "summary_large_image",
    title: "Divyanshu Tiwari | Data Scientist & ML Systems Builder",
    description:
      "Data Scientist and ML systems builder working across machine learning, data, AI applications, and software.",
    creator: "@21dvy_t",
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
  jobTitle: "Data Scientist",
  description:
    "Data Scientist and ML systems builder working across machine learning, data, AI applications, and software.",
  sameAs: [
    portfolioData.socials.github,
    portfolioData.socials.linkedin,
    portfolioData.socials.twitter,
    portfolioData.socials.leetcode,
    portfolioData.socials.dailysql,
    portfolioData.socials.stratascratch,
  ].filter(Boolean),
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
                  document.documentElement.classList.add('dark');
                } catch (e) {}
              })();
            `,
          }}
        />
      </head>
      <body className="min-h-full flex flex-col font-sans bg-[#000000] text-slate-100 selection:bg-[#1E2732] selection:text-[#E7E9EA] transition-colors duration-200">
        <PostHogProvider>
          <ThemeProvider>
            <GridBackground />
            <CustomCursor />
            <Navbar />
            <main className="flex-1 w-full relative z-10">{children}</main>
            <TwitterFollowAlert />
            <Footer />
          </ThemeProvider>
        </PostHogProvider>
      </body>
    </html>
  );
}
