import { metaObject } from '@/config/site.config';
import SalesAnalytics from './sales-client';

export const metadata = {
  ...metaObject('Sales Analytics'),
};

export default function SalesAnalyticsPage() {
  return <SalesAnalytics />;
}
