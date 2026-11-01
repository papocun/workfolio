'use client';

import Link from 'next/link';
import { motion, useScroll, useSpring, useReducedMotion } from 'framer-motion';
import { Moon, Sun, SpeakerHigh, SpeakerSlash } from '@phosphor-icons/react';
import { Avatar, AvatarImage, AvatarFallback } from '@/components/base-ui/avatar';
import { useTheme } from '@/components/ThemeProvider';
import { useSound } from '@/components/SoundProvider';
import { getAssetPath } from '@/lib/assetPath';
import { portfolioData } from '@/data/portfolioData';
import {
  trackContactClicked,
  trackGithubClicked,
} from '@/lib/posthog';

const linkCls =
  'block w-full px-2.5 py-2 text-center text-[13.5px] text-slate-500 dark:text-[#9CA3AF] hover:text-slate-900 dark:hover:text-white transition-colors duration-150 focus-visible:outline-none focus-visible:text-slate-900 dark:focus-visible:text-white';

const iconBtnCls =
  'inline-flex h-8 w-8 items-center justify-center rounded-full text-slate-500 dark:text-[#9CA3AF] hover:text-slate-900 dark:hover:text-white active:scale-[0.96] transition-[color,transform] duration-150 cursor-pointer focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#1D9BF0]';

function Divider() {
  return <span aria-hidden="true" className="my-2.5 block h-4 w-px bg-slate-300 dark:bg-[#2F3336]" />;
}


const RING = 48;
const STROKE = 2;
const R = (RING - STROKE) / 2;

/** Round page-progress indicator that runs around the profile picture. */
function ProgressAvatar() {
  const { scrollYProgress } = useScroll();
  const reduce = useReducedMotion();
  const smooth = useSpring(scrollYProgress, { stiffness: 140, damping: 24, mass: 0.4 });
  const { name } = portfolioData;

  return (
    <Link
      href="/"
      aria-label="Home"
      draggable={false}
      className="relative inline-flex rounded-full focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#1D9BF0]"
      style={{ width: RING, height: RING }}
    >
      <svg
        aria-hidden="true"
        width={RING}
        height={RING}
        viewBox={`0 0 ${RING} ${RING}`}
        className="absolute inset-0 -rotate-90"
      >
        <circle
          cx={RING / 2}
          cy={RING / 2}
          r={R}
          fill="none"
          strokeWidth={STROKE}
          className="stroke-slate-300 dark:stroke-[#2F3336]"
        />
        <motion.circle
          cx={RING / 2}
          cy={RING / 2}
          r={R}
          fill="none"
          strokeWidth={STROKE}
          strokeLinecap="round"
          className="stroke-[#1D9BF0]"
          style={{ pathLength: reduce ? scrollYProgress : smooth }}
        />
      </svg>
      <Avatar className="absolute inset-1 h-10! w-10! sm:h-10! sm:w-10!">
        <AvatarImage src={getAssetPath('/images/projects/NUmercaiq.gif')} alt={name} />
        <AvatarFallback className="text-[10px] font-mono font-semibold">
          {name.split(/\s+/).map((w) => w[0]).join('')}
        </AvatarFallback>
      </Avatar>
    </Link>
  );
}

/** Desktop-only vertical navigation rail. Mobile keeps the top Navbar. */
export default function SideRail() {
  const { isDark, toggleTheme, isTransitioning } = useTheme();
  const { isSoundOn, toggleSound } = useSound();
  const { socials, name } = portfolioData;

  return (
    <nav
      aria-label="Primary"
      className="hidden lg:flex fixed left-6 xl:left-10 top-20 z-40 w-[96px] flex-col items-center select-none"
    >
      <ProgressAvatar />

      <Divider />

      <ul className="flex w-full flex-col items-stretch">
        <li><Link href="/" className={linkCls}>Home</Link></li>
        <li>
          <a
            href={socials.linkedin}
            target="_blank"
            rel="noopener noreferrer"
            className={linkCls}
            onClick={() => trackContactClicked({ channel: 'linkedin', location: 'side_rail', url: socials.linkedin })}
          >
            LinkedIn
          </a>
        </li>
        <li>
          <a
            href={socials.github}
            target="_blank"
            rel="noopener noreferrer"
            className={linkCls}
            onClick={() => trackGithubClicked({ location: 'side_rail', url: socials.github })}
          >
            GitHub
          </a>
        </li>
        <li>
          <a
            href={socials.twitter}
            target="_blank"
            rel="noopener noreferrer"
            className={linkCls}
            onClick={() => trackContactClicked({ channel: 'twitter', location: 'side_rail', url: socials.twitter })}
          >
            X
          </a>
        </li>
      </ul>

      <Divider />

      <button
        type="button"
        onClick={toggleTheme}
        disabled={isTransitioning}
        aria-label="Toggle theme"
        className={iconBtnCls}
      >
        {isDark ? <Sun size={16} weight="regular" /> : <Moon size={16} weight="regular" />}
      </button>
      <button
        type="button"
        onClick={toggleSound}
        aria-label={isSoundOn ? 'Mute sound effects' : 'Enable sound effects'}
        aria-pressed={isSoundOn}
        className={`${iconBtnCls} mt-1 ${isSoundOn ? 'text-[#1D9BF0] hover:text-[#1a8cd8] dark:text-[#1D9BF0] dark:hover:text-[#1a8cd8]' : ''}`}
      >
        {isSoundOn ? <SpeakerHigh size={16} weight="regular" /> : <SpeakerSlash size={16} weight="regular" />}
      </button>
    </nav>
  );
}
