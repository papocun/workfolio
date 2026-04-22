'use client';

import React from 'react';
import { trackEmailClicked, trackContactClicked } from '@/lib/posthog';

interface EmailContactLinkProps {
  email: string;
  className?: string;
}

export default function EmailContactLink({ email, className = '' }: EmailContactLinkProps) {
  const gmailUrl = `https://mail.google.com/mail/?view=cm&fs=1&to=${encodeURIComponent(email)}`;

  return (
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
      className={`group relative inline-flex items-center py-1 text-slate-600 dark:text-slate-300 hover:text-slate-900 dark:hover:text-white transition-colors duration-150 ease-[cubic-bezier(0.4,0,0.2,1)] break-all sm:break-normal ${className}`}
    >
      <span>{email}</span>
      <span className="absolute bottom-0 left-0 h-[1.5px] w-full bg-slate-900 dark:bg-slate-100 origin-left scale-x-0 group-hover:scale-x-100 transition-transform duration-200 ease-out" />
    </a>
  );
}
