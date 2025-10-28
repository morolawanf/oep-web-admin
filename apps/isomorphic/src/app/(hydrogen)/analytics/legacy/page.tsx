import type { Metadata } from 'next';
import LegacyAnalyticsClient from './legacy-client';

export const metadata: Metadata = {
  title: 'Legacy Analytics | OEPlast Admin',
  description: 'View historical analytics data with time-series charts and insights',
};

export default function LegacyAnalyticsPage() {
  return <LegacyAnalyticsClient />;
}
