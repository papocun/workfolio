'use client';

import React, { useState } from 'react';
import Image from 'next/image';

export interface AvatarProps extends React.HTMLAttributes<HTMLDivElement> {
  className?: string;
  children: React.ReactNode;
}

export function Avatar({ className = '', children, ...props }: AvatarProps) {
  return (
    <div
      className={`relative flex h-7 w-7 sm:h-8 sm:w-8 shrink-0 overflow-hidden rounded-full border border-slate-200 dark:border-slate-700 bg-slate-100 dark:bg-slate-800 ${className}`}
      {...props}
    >
      {children}
    </div>
  );
}

export interface AvatarImageProps {
  src?: string;
  alt?: string;
  className?: string;
}

export function AvatarImage({ src, alt = '', className = '' }: AvatarImageProps) {
  const [hasError, setHasError] = useState(false);

  if (!src || hasError) return null;

  return (
    <img
      src={src}
      alt={alt}
      onError={() => setHasError(true)}
      className={`aspect-square h-full w-full object-cover ${className}`}
    />
  );
}

export interface AvatarFallbackProps extends React.HTMLAttributes<HTMLSpanElement> {
  className?: string;
  children: React.ReactNode;
}

export function AvatarFallback({
  className = '',
  children,
  ...props
}: AvatarFallbackProps) {
  return (
    <span
      className={`flex h-full w-full items-center justify-center font-mono text-[11px] font-semibold text-slate-700 dark:text-slate-300 select-none ${className}`}
      {...props}
    >
      {children}
    </span>
  );
}
