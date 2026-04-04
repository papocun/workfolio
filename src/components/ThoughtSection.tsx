'use client';

import React, { useState, useEffect, useRef, useCallback } from 'react';
import { getAssetPath } from '@/lib/assetPath';
import type { ThoughtApiResponse, ThoughtQuote } from '@/types/thought';

interface ThoughtSectionProps {
  className?: string;
}

export default function ThoughtSection({ className = '' }: ThoughtSectionProps) {
  const [quotes, setQuotes] = useState<ThoughtQuote[]>([]);
  const [currentIndex, setCurrentIndex] = useState<number>(0);
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const [isTransitioning, setIsTransitioning] = useState<boolean>(false);
  const [isPrefersReducedMotion, setIsPrefersReducedMotion] = useState<boolean>(false);

  const quotesRef = useRef<ThoughtQuote[]>([]);
  const isFetchingRef = useRef<boolean>(false);

  // Check prefers-reduced-motion
  useEffect(() => {
    if (typeof window !== 'undefined' && window.matchMedia) {
      const mediaQuery = window.matchMedia('(prefers-reduced-motion: reduce)');
      setIsPrefersReducedMotion(mediaQuery.matches);
      const listener = (e: MediaQueryListEvent) => setIsPrefersReducedMotion(e.matches);
      mediaQuery.addEventListener('change', listener);
      return () => mediaQuery.removeEventListener('change', listener);
    }
  }, []);

  // Fetch quotes batch
  const fetchQuotes = useCallback(async () => {
    if (isFetchingRef.current) return;
    isFetchingRef.current = true;

    try {
      const endpoint = getAssetPath('/api/quotes');
      const res = await fetch(endpoint, { cache: 'no-cache' }).catch(() => null);

      if (res && res.ok) {
        const data: ThoughtApiResponse = await res.json();
        if (data.success && Array.isArray(data.quotes) && data.quotes.length > 0) {
          quotesRef.current = data.quotes;
          setQuotes(data.quotes);
          setIsLoading(false);
          isFetchingRef.current = false;
          return;
        }
      }
    } catch {
      // Graceful error handling: keep existing quotes if any
    }

    isFetchingRef.current = false;
    setIsLoading(false);
  }, []);

  // Initial load
  useEffect(() => {
    fetchQuotes();
  }, [fetchQuotes]);

  // Rotate quote every 10 seconds with smooth fade transition
  useEffect(() => {
    if (quotes.length <= 1) return;

    const interval = setInterval(() => {
      if (isPrefersReducedMotion) {
        setCurrentIndex((prev) => (prev + 1) % quotes.length);
        return;
      }

      // Step 1: Fade out current quote & author
      setIsTransitioning(true);

      // Step 2: Switch quote when opacity hits 0, then fade in
      setTimeout(() => {
        setCurrentIndex((prev) => {
          const next = (prev + 1) % quotes.length;
          // When nearing end of batch, trigger background refresh
          if (next >= quotes.length - 2) {
            fetchQuotes();
          }
          return next;
        });
        setIsTransitioning(false);
      }, 300);
    }, 10000);

    return () => clearInterval(interval);
  }, [quotes.length, isPrefersReducedMotion, fetchQuotes]);

  const currentQuote = quotes[currentIndex];

  return (
    <section
      className={`w-full mt-6 sm:mt-7 ${className}`}
      aria-label="Thought"
    >
      {/* Section Heading with Theme-Aware Typography */}
      <h2 className="text-[17px] sm:text-[18px] font-bold text-slate-900 dark:text-slate-100 tracking-tight mb-3.5 sm:mb-4">
        Thought
      </h2>

      {/* Thought Card Container */}
      <div className="relative overflow-hidden rounded-2xl border border-slate-200/80 dark:border-[#2F3336]/60 bg-white/70 dark:bg-[#16181C]/40 p-6 sm:p-8 min-h-[165px] sm:min-h-[185px] flex flex-col justify-between shadow-xs transition-colors duration-200">
        {/* Subtle Decorative Background Quotation Mark */}
        <div
          className="pointer-events-none absolute top-3 left-4 sm:top-4 sm:left-6 text-slate-200/70 dark:text-[#2F3336]/35 select-none"
          aria-hidden="true"
        >
          <svg
            className="w-12 h-12 sm:w-16 sm:h-16 fill-current"
            viewBox="0 0 24 24"
            aria-hidden="true"
          >
            <path d="M4.583 17.321C3.553 16.227 3 15 3 13.011c0-3.5 2.457-6.637 6.03-8.188l.893 1.378c-3.335 1.804-3.987 4.145-4.247 5.621.537-.278 1.24-.375 1.929-.311 1.804.167 3.226 1.648 3.226 3.489a3.5 3.5 0 01-3.5 3.5c-1.073 0-2.099-.49-2.748-1.179zm10 0C13.553 16.227 13 15 13 13.011c0-3.5 2.457-6.637 6.03-8.188l.893 1.378c-3.335 1.804-3.987 4.145-4.247 5.621.537-.278 1.24-.375 1.929-.311 1.804.167 3.226 1.648 3.226 3.489a3.5 3.5 0 01-3.5 3.5c-1.073 0-2.099-.49-2.748-1.179z" />
          </svg>
        </div>

        {/* Content Area */}
        <div className="relative z-10 my-auto flex flex-col justify-center text-center px-2 sm:px-6 py-2">
          {isLoading ? (
            /* Loading Skeleton */
            <div className="flex flex-col items-center justify-center space-y-3 py-4 animate-pulse">
              <div className="h-4 w-4/5 bg-slate-200 dark:bg-[#2F3336] rounded-md" />
              <div className="h-4 w-2/3 bg-slate-200/70 dark:bg-[#2F3336]/60 rounded-md" />
              <div className="h-3 w-32 bg-slate-200/50 dark:bg-[#2F3336]/40 rounded-md mt-2" />
            </div>
          ) : currentQuote ? (
            /* Quote and Author with Synchronized Smooth Fade Transition */
            <div
              className={`transition-opacity duration-300 ease-in-out ${
                isTransitioning ? 'opacity-0' : 'opacity-100'
              }`}
            >
              <blockquote className="text-[14px] sm:text-[15.5px] md:text-[16px] font-normal leading-[1.65] text-slate-800 dark:text-slate-200 tracking-normal">
                “{currentQuote.quote}”
              </blockquote>

              {/* Author Row: Small Horizontal Line + Author Name */}
              <div className="mt-4 sm:mt-5 flex items-center justify-center gap-2 text-slate-500 dark:text-[#71767B]">
                <span
                  className="w-5 sm:w-7 h-[1px] bg-slate-300/80 dark:bg-[#2F3336]"
                  aria-hidden="true"
                />
                <cite className="not-italic text-[11px] sm:text-[12px] font-semibold tracking-wider uppercase text-slate-600 dark:text-slate-400">
                  {currentQuote.author}
                </cite>
              </div>
            </div>
          ) : (
            /* Fallback if no quote available */
            <div className="text-[13px] text-slate-400 dark:text-[#71767B]">
              Thought of the day
            </div>
          )}
        </div>

        {/* Unobtrusive Attribution Link */}
        <div className="relative z-10 pt-2 text-right">
          <a
            href="https://zenquotes.io/"
            target="_blank"
            rel="noopener noreferrer"
            className="text-[9.5px] sm:text-[10px] text-slate-400/80 dark:text-[#71767B]/70 hover:text-slate-600 dark:hover:text-slate-400 transition-colors inline-block select-none"
          >
            Quotes provided by ZenQuotes
          </a>
        </div>
      </div>
    </section>
  );
}
