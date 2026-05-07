import React from 'react';

interface PageTransitionProps {
  children: React.ReactNode;
}

export default function PageTransition({ children }: PageTransitionProps) {
  return <div className="w-full max-w-full min-w-0 flex-1 flex flex-col">{children}</div>;
}

