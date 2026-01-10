'use client';

import React from 'react';
import { WarningCircle, Info, X } from '@phosphor-icons/react';

export interface AlertProps extends React.HTMLAttributes<HTMLDivElement> {
  variant?: 'default' | 'warning' | 'info';
  onClose?: () => void;
  className?: string;
  children: React.ReactNode;
}

export function Alert({
  variant = 'default',
  onClose,
  className = '',
  children,
  ...props
}: AlertProps) {
  const variantStyles = {
    default:
      'bg-slate-50 dark:bg-[#0f1422] border-slate-200/90 dark:border-slate-800/90 text-slate-900 dark:text-slate-100',
    warning:
      'bg-amber-50/70 dark:bg-amber-950/30 border-amber-200/80 dark:border-amber-900/60 text-amber-900 dark:text-amber-200',
    info:
      'bg-slate-50 dark:bg-[#111728] border-slate-200/90 dark:border-slate-800 text-slate-800 dark:text-slate-200',
  };

  return (
    <div
      role="alert"
      className={`relative w-full rounded-xl border p-3.5 sm:p-4 text-[13px] sm:text-[13.5px] transition-all duration-200 shadow-xs flex items-start gap-3 ${variantStyles[variant]} ${className}`}
      {...props}
    >
      {children}
      {onClose && (
        <button
          type="button"
          onClick={onClose}
          aria-label="Dismiss alert"
          className="shrink-0 p-1 -mr-1 -mt-1 rounded-lg text-slate-400 hover:text-slate-700 dark:hover:text-slate-200 hover:bg-slate-200/50 dark:hover:bg-slate-800 transition-colors cursor-pointer"
        >
          <X size={14} weight="bold" />
        </button>
      )}
    </div>
  );
}

export interface AlertTitleProps extends React.HTMLAttributes<HTMLHeadingElement> {
  className?: string;
  children: React.ReactNode;
}

export function AlertTitle({ className = '', children, ...props }: AlertTitleProps) {
  return (
    <h5
      className={`font-semibold leading-snug tracking-tight text-[13.5px] sm:text-[14px] ${className}`}
      {...props}
    >
      {children}
    </h5>
  );
}

export interface AlertDescriptionProps extends React.HTMLAttributes<HTMLParagraphElement> {
  className?: string;
  children: React.ReactNode;
}

export function AlertDescription({
  className = '',
  children,
  ...props
}: AlertDescriptionProps) {
  return (
    <div
      className={`text-[12px] sm:text-[12.5px] text-slate-600 dark:text-slate-400 mt-0.5 leading-relaxed ${className}`}
      {...props}
    >
      {children}
    </div>
  );
}
