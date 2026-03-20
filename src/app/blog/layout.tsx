import type { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'Blog',
  description:
    'Technical writing, research notes, and engineering lessons on applied machine learning, data pipelines, and AI systems by Divyanshu Tiwari.',
  alternates: {
    canonical: 'https://datafolio.me/blog/',
    types: {
      'text/markdown': 'https://datafolio.me/blog.md',
    },
  },
  openGraph: {
    title: 'Blog | Divyanshu Tiwari',
    description:
      'Technical writing, research notes, and engineering lessons on applied machine learning, data pipelines, and AI systems by Divyanshu Tiwari.',
    url: 'https://datafolio.me/blog/',
    siteName: 'Divyanshu Tiwari',
    locale: 'en_US',
    type: 'website',
  },
  twitter: {
    card: 'summary_large_image',
    title: 'Blog | Divyanshu Tiwari',
    description:
      'Technical writing, research notes, and engineering lessons on applied machine learning, data pipelines, and AI systems by Divyanshu Tiwari.',
    creator: '@21dvy_t',
  },
};

export default function BlogLayout({ children }: { children: React.ReactNode }) {
  return <>{children}</>;
}
