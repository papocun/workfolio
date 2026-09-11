'use client';

import React, { useState } from 'react';
import { trackEmailClicked, trackContactClicked } from '@/lib/posthog';
import { useSound } from '@/components/SoundProvider';
import { Copy, Check } from '@phosphor-icons/react';
import { motion, AnimatePresence } from 'framer-motion';

interface EmailContactLinkProps {
  email: string;
  className?: string;
}

export default function EmailContactLink({ email, className = '' }: EmailContactLinkProps) {
  const [copied, setCopied] = useState(false);
  const { playClickSound } = useSound();
  const gmailUrl = `https://mail.google.com/mail/?view=cm&fs=1&to=${encodeURIComponent(email)}`;

  const handleCopy = async (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    try {
      await navigator.clipboard.writeText(email);
      playClickSound();
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    } catch {
      // clipboard fallback
    }
  };

  return (
    <div className={`inline-flex items-center gap-1.5 ${className}`}>
      <a
        href={gmailUrl}
        target="_blank"
        rel="noopener noreferrer"
        onClick={() => {
          trackEmailClicked({
            email,
            location: 'homepage_hero',
          });
          trackContactClicked({
            channel: 'email',
            location: 'homepage_hero',
            url: gmailUrl,
          });
        }}
        className="group relative inline-flex items-center py-1 text-slate-600 dark:text-slate-300 hover:text-slate-900 dark:hover:text-white transition-colors duration-150 ease-[cubic-bezier(0.4,0,0.2,1)] break-all sm:break-normal"
      >
        <span>{email}</span>
        <span className="absolute bottom-0 left-0 h-[1.5px] w-full bg-slate-900 dark:bg-slate-100 origin-left scale-x-0 group-hover:scale-x-100 transition-transform duration-200 ease-out" />
      </a>

      {/* Tactile Copy Button with Microinteraction */}
      <motion.button
        type="button"
        onClick={handleCopy}
        aria-label={copied ? 'Email copied to clipboard' : 'Copy email to clipboard'}
        title={copied ? 'Copied!' : 'Copy email'}
        whileHover={{ scale: 1.08 }}
        whileTap={{ scale: 0.92 }}
        transition={{ type: 'spring', stiffness: 400, damping: 17 }}
        className="relative inline-flex items-center justify-center p-1 rounded-md text-slate-400 hover:text-slate-700 dark:hover:text-slate-200 hover:bg-slate-100 dark:hover:bg-slate-800/80 transition-colors duration-150 cursor-pointer focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-[#1D9BF0]"
      >
        <AnimatePresence mode="popLayout" initial={false}>
          {copied ? (
            <motion.span
              key="check"
              initial={{ scale: 0.5, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.5, opacity: 0 }}
              transition={{ duration: 0.15, ease: [0.16, 1, 0.3, 1] }}
              className="text-emerald-600 dark:text-emerald-400"
            >
              <Check size={14} weight="bold" />
            </motion.span>
          ) : (
            <motion.span
              key="copy"
              initial={{ scale: 0.8, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.8, opacity: 0 }}
              transition={{ duration: 0.15, ease: [0.16, 1, 0.3, 1] }}
            >
              <Copy size={14} weight="regular" />
            </motion.span>
          )}
        </AnimatePresence>
      </motion.button>
    </div>
  );
}

