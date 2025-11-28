import { routes } from '@/config/routes';
import { metaObject } from '@/config/site.config';
import FlashSaleDetailsPage from './[id]/page';

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
    <FlashSaleDetailsPage title={pageHeader.title} breadcrumb={pageHeader.breadcrumb} />
  );
}
