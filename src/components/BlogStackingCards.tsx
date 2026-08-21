'use client';

import React, { useRef } from 'react';
import Link from 'next/link';
import { motion, useScroll, useTransform, MotionValue } from 'framer-motion';

export interface BlogPostItem {
  id: string;
  slug: string;
  categoryTagline: string;
  bannerTitle: string;
  title: string;
  excerpt: string;
  date: string;
  readTime: string;
  category: string;
}

interface BlogStackingCardsProps {
  posts: BlogPostItem[];
}

interface StackingBlogCardProps {
  post: BlogPostItem;
  index: number;
  total: number;
  progress: MotionValue<number>;
  range: [number, number];
  targetScale: number;
}

function BlogStackCard({
  post,
  index,
  total,
  progress,
  range,
  targetScale,
}: StackingBlogCardProps) {
  const cardContainerRef = useRef<HTMLDivElement>(null);

  // Transform scale as scroll progresses
  const scale = useTransform(progress, range, [1, targetScale]);

  return (
    <div
      ref={cardContainerRef}
      className="sticky top-16 sm:top-20 flex items-center justify-center mb-8 sm:mb-10 last:mb-0"
    >
      <motion.article
        style={{
          scale,
          top: `calc(${index * 14}px)`,
        }}
        className="w-full max-w-[680px] rounded-xl border border-slate-200/90 dark:border-slate-800/90 bg-white dark:bg-[#0f1422] p-4 sm:p-5 shadow-sm dark:shadow-xl transition-colors duration-200 origin-top flex flex-col group"
      >
        {/* Compact Visual Banner Box */}
        <Link className="block mb-3" href={`/blog/${post.slug}`}>
          <div className="w-full rounded-lg border border-slate-200/80 dark:border-slate-800 bg-[#FBFBFA] dark:bg-[#151c2e] p-4 sm:p-5 relative overflow-hidden transition-all duration-200 hover:border-slate-300 dark:hover:border-slate-700">
            <span className="text-[10px] font-mono uppercase tracking-wider text-slate-400 dark:text-slate-500 mb-2 block font-semibold">
              {post.categoryTagline}
            </span>

            <div className="flex items-center justify-between gap-3">
              <h2 className="text-[16px] sm:text-[19px] font-bold text-slate-900 dark:text-slate-100 leading-[1.25] max-w-[460px]">
                {post.bannerTitle}
              </h2>

              {/* Minimalist Graphic Badge */}
              <div className="hidden sm:flex w-9 h-9 rounded-full border border-slate-200/90 dark:border-slate-700 items-center justify-center shrink-0 bg-white dark:bg-[#0f1422] shadow-xs">
                <div className="w-2 h-2 rounded-full bg-slate-900 dark:bg-slate-100" />
              </div>
            </div>
          </div>
        </Link>

        {/* Post Meta */}
        <div className="flex items-center justify-between font-mono text-[11px] text-slate-400 dark:text-slate-500 mb-1">
          <time>{post.date}</time>
          <span className="text-slate-500 dark:text-slate-400">{post.category}</span>
        </div>

        {/* Title */}
        <Link href={`/blog/${post.slug}`}>
          <h3 className="text-[15px] sm:text-[17px] font-bold text-slate-900 dark:text-slate-100 tracking-tight mb-1.5 group-hover:text-slate-700 dark:group-hover:text-slate-300 transition-colors">
            {post.title}
          </h3>
        </Link>

        {/* Excerpt */}
        <p className="text-[12.5px] sm:text-[13.5px] text-slate-600 dark:text-slate-400 leading-[1.5] mb-3">
          {post.excerpt}
        </p>

        {/* Footer / Read Time / Action */}
        <div className="flex items-center justify-between pt-2 border-t border-slate-100 dark:border-slate-800/80">
          <span className="text-slate-400 dark:text-slate-500 flex items-center gap-1.5 font-mono text-[11.5px]">
            <svg
              xmlns="http://www.w3.org/2000/svg"
              width="12"
              height="12"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
              strokeWidth="2"
              className="opacity-70"
              aria-hidden="true"
            >
              <circle cx="12" cy="12" r="10" />
              <polyline points="12 6 12 12 16 14" />
            </svg>
            {post.readTime}
          </span>

          <Link
            href={`/blog/${post.slug}`}
            className="group/link relative inline-flex items-center gap-1 font-mono text-[11.5px] text-slate-700 dark:text-slate-300 hover:text-slate-900 dark:hover:text-white transition-colors"
          >
            <span>read essay</span>
            <svg
              xmlns="http://www.w3.org/2000/svg"
              width="11"
              height="11"
              fill="currentColor"
              viewBox="0 0 256 256"
              className="translate-y-[0.5px]"
            >
              <path d="M221.66,133.66l-72,72a8,8,0,0,1-11.32-11.32L196.69,136H40a8,8,0,0,1,0-16H196.69L138.34,61.66a8,8,0,0,1,11.32-11.32l72,72A8,8,0,0,1,221.66,133.66Z" />
            </svg>
            <span className="absolute -bottom-0.5 left-0 h-[1px] w-full bg-slate-900 dark:bg-slate-100 origin-left scale-x-0 group-hover/link:scale-x-100 transition-transform duration-200 ease-out" />
          </Link>
        </div>
      </motion.article>
    </div>
  );
}

export default function BlogStackingCards({ posts }: BlogStackingCardsProps) {
  const containerRef = useRef<HTMLDivElement>(null);

  const { scrollYProgress } = useScroll({
    target: containerRef,
    offset: ['start start', 'end end'],
  });

  return (
    <div ref={containerRef} className="relative w-full pb-8">
      {posts.map((post, index) => {
        const targetScale = 1 - (posts.length - index) * 0.035;
        const startRange = index * (1 / posts.length);

        return (
          <BlogStackCard
            key={post.id}
            post={post}
            index={index}
            total={posts.length}
            progress={scrollYProgress}
            range={[startRange, 1]}
            targetScale={targetScale}
          />
        );
      })}
    </div>
  );
}
