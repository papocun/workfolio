'use client';

import * as React from 'react';

export interface InputProps
  extends React.InputHTMLAttributes<HTMLInputElement> {}

export const Input = React.forwardRef<HTMLInputElement, InputProps>(
  ({ className = '', type, ...props }, ref) => {
    if (type === 'range') {
      return (
        <input
          ref={ref}
          type="range"
          className={`w-full h-1.5 bg-slate-200 dark:bg-[#2F3336] rounded-lg appearance-none cursor-pointer accent-[#1D9BF0] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#1D9BF0] ${className}`}
          {...props}
        />
      );
    }

    return (
      <input
        ref={ref}
        type={type}
        className={`flex h-9 w-full rounded-md border border-slate-200 dark:border-[#2F3336] bg-transparent px-3 py-1 text-[13px] shadow-xs transition-colors file:border-0 file:bg-transparent file:text-sm file:font-medium placeholder:text-slate-400 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#1D9BF0] disabled:cursor-not-allowed disabled:opacity-50 ${className}`}
        {...props}
      />
    );
  }
);
Input.displayName = 'Input';
