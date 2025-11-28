import { routes } from '@/config/routes';
import { metaObject } from '@/config/site.config';
import SalesPageClient from './SalesPageClient';

export const metadata = {
  ...metaObject('Sales'),
};

const pageHeader = {
  title: 'Sales',
  breadcrumb: [
    {
      href: routes.eCommerce.dashboard,
      name: 'E-Commerce',
    },
    {
      href: routes.eCommerce.flashSales,
      name: 'Sales',
    },
    {
      name: 'All',
    },
  ],
};

export default function FlashSalesPage() {
  return (
    <SalesPageClient
      title={pageHeader.title}
      breadcrumb={pageHeader.breadcrumb}
    />
  );
}
