import type { Metadata } from 'next';
import UsersAnalyticsClient from './users-client';

export const metadata: Metadata = {
  title: 'Users Analytics | OEPlast Admin',
  description: 'Comprehensive users and customer analytics',
};

export default function UsersAnalyticsPage() {
  return <UsersAnalyticsClient />;
}
