import type { Metadata } from 'next';
import OrdersAnalyticsClient from './orders-client';

export const metadata: Metadata = {
  title: 'Orders Analytics | OEPlast Admin',
  description: 'Comprehensive order analytics including trends, status distribution, and detailed order insights',
};

export default function OrdersAnalyticsPage() {
  return <OrdersAnalyticsClient />;
}
