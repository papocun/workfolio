import type { Metadata } from "next";
import { Urbanist } from "next/font/google";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import GridBackground from "@/components/GridBackground";
import { ThemeProvider } from "@/components/ThemeProvider";
import CustomCursor from "@/components/CustomCursor";
import { PostHogProvider } from "@/components/PostHogProvider";
import DesktopPet from "@/components/DesktopPet";
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
  icons: {
    icon: "/favicon.png",
    shortcut: "/favicon.png",
    apple: "/favicon.png",
  },
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
            <Footer />
            <DesktopPet />
          </ThemeProvider>
        </PostHogProvider>
      </body>
    </html>
  );
}
