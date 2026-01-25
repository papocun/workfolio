import type { Metadata } from 'next';
import LockedPagePlaceholder from '@/components/LockedPagePlaceholder';

export const metadata: Metadata = {
  title: 'Blog — Divyanshu Tiwari',
  description: 'Page under construction.',
};

export default function BlogPage() {
  return (
    <LockedPagePlaceholder
      sectionLabel="writing"
      pageTitle="Blog"
    />
  );
}
