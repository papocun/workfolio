import type { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'Blog',
  description:
    'Technical writing, research notes, and engineering lessons on applied machine learning and data systems by Divyanshu Tiwari.',
  alternates: {
    canonical: 'https://datafolio.me/blog/',
    types: {
      'text/markdown': 'https://datafolio.me/blog.md',
    },
  },
};

export default function BlogLayout({ children }: { children: React.ReactNode }) {
  return <>{children}</>;
}
