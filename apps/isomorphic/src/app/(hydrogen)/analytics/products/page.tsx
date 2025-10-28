import type { Metadata } from 'next';
import ProductsAnalyticsClient from './products-client';

export const metadata: Metadata = {
  title: 'Products Analytics | OEPlast Admin',
  description: 'Comprehensive products performance analytics',
};

export default function ProductsAnalyticsPage() {
  return <ProductsAnalyticsClient />;
}
