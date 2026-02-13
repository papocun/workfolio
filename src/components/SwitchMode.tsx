'use client';

import React from 'react';
import { motion } from 'framer-motion';
import { useTheme } from '@/components/ThemeProvider';

export interface SwitchModeProps {
  width?: number;
  height?: number;
  darkColor?: string;
  lightColor?: string;
  knobDarkColor?: string;
  knobLightColor?: string;
  borderDarkColor?: string;
  borderLightColor?: string;
  className?: string;
  checked?: boolean;
  onToggle?: () => void;
}

export function SwitchMode({
  width = 46,
  height = 24,
  darkColor = '#16181C',
  lightColor = '#f1f5f9',
  knobDarkColor = '#1E2732',
  knobLightColor = '#ffffff',
  borderDarkColor = '#2F3336',
  borderLightColor = '#cbd5e1',
  className = '',
  checked,
  onToggle,
}: SwitchModeProps) {
  const { isDark, toggleTheme } = useTheme();

  const active = checked !== undefined ? checked : isDark;
  const handleToggle = () => {
    if (onToggle) {
      onToggle();
    } else {
      toggleTheme();
    }
  };

  const padding = Math.max(2, Math.round(height * 0.08));
  const knobSize = height - padding * 2;
  const travelDistance = width - knobSize - padding * 2;

  return (
    <button
      type="button"
      role="switch"
      aria-checked={active}
      aria-label="Toggle theme mode"
      onClick={handleToggle}
      className={`relative inline-flex items-center rounded-full transition-colors duration-200 ease-[cubic-bezier(0.4,0,0.2,1)] cursor-pointer select-none focus:outline-none focus-visible:ring-2 focus-visible:ring-slate-400 dark:focus-visible:ring-slate-500 ${className}`}
      style={{
        width: `${width}px`,
        height: `${height}px`,
        backgroundColor: active ? darkColor : lightColor,
        border: `1px solid ${active ? borderDarkColor : borderLightColor}`,
        padding: `${padding}px`,
      }}
    >
      {/* Background Icons/Glyphs inside Track */}
      <div className="absolute inset-0 flex items-center justify-between px-1.5 pointer-events-none text-slate-400 dark:text-slate-500">
        <svg
          xmlns="http://www.w3.org/2000/svg"
          width={Math.max(10, Math.round(height * 0.45))}
          height={Math.max(10, Math.round(height * 0.45))}
          fill="none"
          viewBox="0 0 24 24"
          stroke="currentColor"
          strokeWidth="2.2"
          className={`transition-opacity duration-200 ease-[cubic-bezier(0.4,0,0.2,1)] ${
            active ? 'opacity-30' : 'opacity-80 text-amber-500'
          }`}
        >
          <circle cx="12" cy="12" r="4" />
          <path d="M12 2v2M12 20v2M4.93 4.93l1.41 1.41M17.66 17.66l1.41 1.41M2 12h2M20 12h2M6.34 17.66l-1.41 1.41M19.07 4.93l-1.41 1.41" />
        </svg>
        <svg
          xmlns="http://www.w3.org/2000/svg"
          width={Math.max(9, Math.round(height * 0.4))}
          height={Math.max(9, Math.round(height * 0.4))}
          fill="currentColor"
          viewBox="0 0 256 256"
          className={`transition-opacity duration-200 ease-[cubic-bezier(0.4,0,0.2,1)] ${
            active ? 'opacity-90 text-[#1D9BF0]' : 'opacity-25'
          }`}
        >
          <path d="M233.54,142.23a8,8,0,0,0-8-2,88.08,88.08,0,0,1-109.8-109.8,8,8,0,0,0-10-10,104.84,104.84,0,0,0-52.91,37A104,104,0,0,0,136,224a103.09,103.09,0,0,0,62.52-20.88,104.84,104.84,0,0,0,37-52.91A8,8,0,0,0,233.54,142.23Z" />
        </svg>
      </div>

      {/* Animated Sliding Knob */}
      <motion.div
        layout
        transition={{
          type: 'spring',
          stiffness: 400,
          damping: 28,
        }}
        animate={{
          x: active ? travelDistance : 0,
          backgroundColor: active ? knobDarkColor : knobLightColor,
          borderColor: active ? borderDarkColor : borderLightColor,
        }}
        className="relative z-10 rounded-full shadow-sm flex items-center justify-center border"
        style={{
          width: `${knobSize}px`,
          height: `${knobSize}px`,
        }}
      >
        {active ? (
          <motion.div
            initial={{ rotate: -45, scale: 0.8 }}
            animate={{ rotate: 0, scale: 1 }}
            transition={{ duration: 0.2, ease: 'easeOut' }}
            className="text-[#1D9BF0]"
          >
            <svg
              xmlns="http://www.w3.org/2000/svg"
              width={Math.max(9, Math.round(knobSize * 0.55))}
              height={Math.max(9, Math.round(knobSize * 0.55))}
              fill="currentColor"
              viewBox="0 0 256 256"
            >
              <path d="M233.54,142.23a8,8,0,0,0-8-2,88.08,88.08,0,0,1-109.8-109.8,8,8,0,0,0-10-10,104.84,104.84,0,0,0-52.91,37A104,104,0,0,0,136,224a103.09,103.09,0,0,0,62.52-20.88,104.84,104.84,0,0,0,37-52.91A8,8,0,0,0,233.54,142.23Z" />
            </svg>
          </motion.div>
        ) : (
          <motion.div
            initial={{ rotate: 45, scale: 0.8 }}
            animate={{ rotate: 0, scale: 1 }}
            transition={{ duration: 0.2, ease: 'easeOut' }}
            className="text-amber-500"
          >
            <svg
              xmlns="http://www.w3.org/2000/svg"
              width={Math.max(9, Math.round(knobSize * 0.55))}
              height={Math.max(9, Math.round(knobSize * 0.55))}
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
              strokeWidth="2.2"
            >
              <circle cx="12" cy="12" r="3.5" />
              <path d="M12 2v2M12 20v2M4.93 4.93l1.41 1.41M17.66 17.66l1.41 1.41M2 12h2M20 12h2M6.34 17.66l-1.41 1.41M19.07 4.93l-1.41 1.41" />
            </svg>
          </motion.div>
        )}
      </motion.div>
    </button>
  );
}

export default SwitchMode;
