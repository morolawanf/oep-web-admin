import type { Metadata } from 'next';
import ReviewsAnalyticsClient from './reviews-client';

export const metadata: Metadata = {
  title: 'Reviews Analytics | OEPlast Admin',
  description: 'Comprehensive reviews and ratings analytics',
};

export default function ReviewsAnalyticsPage() {
  return <ReviewsAnalyticsClient />;
}
