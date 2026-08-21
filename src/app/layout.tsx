import type { Metadata } from "next";
import { Urbanist } from "next/font/google";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import GridBackground from "@/components/GridBackground";
import { ThemeProvider } from "@/components/ThemeProvider";
import CustomCursor from "@/components/CustomCursor";
import "./globals.css";

const urbanist = Urbanist({
  variable: "--font-sans",
  subsets: ["latin"],
  weight: ["400", "500", "600", "700"],
  display: "swap",
});

export const metadata: Metadata = {
  title: "Divyanshu Tiwari — Data Scientist & Applied ML Systems Builder",
  description:
    "Data Scientist & Applied ML Engineer engineering and deploying production-grade predictive systems, fraud-scoring models, and real-time APIs.",
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html
      lang="en"
      suppressHydrationWarning
      className={`${urbanist.variable} h-full antialiased`}
    >
      <head>
        <script
          dangerouslySetInnerHTML={{
            __html: `
              (function() {
                try {
                  var stored = localStorage.getItem('workfolio-theme');
                  var isDark = stored === 'dark' || (!stored && window.matchMedia('(prefers-color-scheme: dark)').matches);
                  if (isDark) {
                    document.documentElement.classList.add('dark');
                  } else {
                    document.documentElement.classList.remove('dark');
                  }
                } catch (e) {}
              })();
            `,
          }}
        />
      </head>
      <body className="min-h-full flex flex-col font-sans bg-white dark:bg-[#090d16] text-slate-900 dark:text-slate-100 selection:bg-slate-900 dark:selection:bg-slate-100 selection:text-white dark:selection:text-slate-900 transition-colors duration-200">
        <ThemeProvider>
          <GridBackground />
          <CustomCursor />
          <Navbar />
          <main className="flex-1 w-full relative z-10">{children}</main>
          <Footer />
        </ThemeProvider>
      </body>
    </html>
  );
}
