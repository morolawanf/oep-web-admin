import type { Metadata } from 'next';
import TransactionsAnalyticsClient from './transactions-client';

export const metadata: Metadata = {
  title: 'Transactions Analytics | OEPlast Admin',
  description: 'Comprehensive transactions analytics and insights',
};

export default function TransactionsAnalyticsPage() {
  return <TransactionsAnalyticsClient />;
}
