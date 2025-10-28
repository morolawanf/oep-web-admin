import type { Metadata } from 'next';
import CouponsAnalyticsClient from './coupons-client';

export const metadata: Metadata = {
  title: 'Coupons Analytics | OEPlast Admin',
  description: 'Comprehensive coupon usage and performance analytics',
};

export default function CouponsAnalyticsPage() {
  return <CouponsAnalyticsClient />;
}
