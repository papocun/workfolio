import type { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'Resume Redirect',
  description: 'Redirecting to Divyanshu Tiwari\'s verified resume.',
  robots: {
    index: false,
    follow: true,
  },
};

export default function ResumeLayout({ children }: { children: React.ReactNode }) {
  return <>{children}</>;
}
