'use client';

import * as React from 'react';

export interface ButtonProps
  extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: 'default' | 'outline' | 'ghost' | 'secondary';
  size?: 'default' | 'sm' | 'lg' | 'icon';
}

export const Button = React.forwardRef<HTMLButtonElement, ButtonProps>(
  ({ className = '', variant = 'default', size = 'default', ...props }, ref) => {
    let variantStyles =
      'bg-slate-900 text-white hover:bg-slate-800 dark:bg-slate-100 dark:text-slate-900 dark:hover:bg-white';
    if (variant === 'outline') {
      variantStyles =
        'border border-slate-200 dark:border-[#2F3336] bg-transparent hover:bg-slate-100 dark:hover:bg-[#1E2732] text-slate-800 dark:text-slate-200';
    } else if (variant === 'ghost') {
      variantStyles =
        'hover:bg-slate-100 dark:hover:bg-[#1E2732] text-slate-700 dark:text-slate-300';
    } else if (variant === 'secondary') {
      variantStyles =
        'bg-slate-100 text-slate-900 hover:bg-slate-200 dark:bg-[#16181C] dark:text-slate-100 dark:hover:bg-[#1E2732]';
    }

    let sizeStyles = 'h-9 px-4 py-2 text-[13px]';
    if (size === 'sm') sizeStyles = 'h-8 px-2.5 text-[12px]';
    if (size === 'lg') sizeStyles = 'h-10 px-5 text-[14px]';
    if (size === 'icon') sizeStyles = 'h-8 w-8 p-0';

    return (
      <button
        ref={ref}
        className={`inline-flex items-center justify-center rounded-lg font-medium transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#1D9BF0] disabled:pointer-events-none disabled:opacity-50 cursor-pointer ${variantStyles} ${sizeStyles} ${className}`}
        {...props}
      />
    );
  }
);
Button.displayName = 'Button';
