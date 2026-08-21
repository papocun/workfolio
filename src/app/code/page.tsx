import type { Metadata } from 'next';
import LockedPagePlaceholder from '@/components/LockedPagePlaceholder';

export const metadata: Metadata = {
  title: 'Code — Divyanshu Tiwari',
  description: 'Page under construction.',
};

export default function CodePage() {
  return (
    <LockedPagePlaceholder
      sectionLabel="the code"
      pageTitle="Code"
    />
  );
}
