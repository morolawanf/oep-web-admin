import PageHeader from '@/app/shared/page-header';
import { Button } from 'rizzui/button';
import { routes } from '@/config/routes';
import Link from 'next/link';
import { metaObject } from '@/config/site.config';
import CreateSales from '@/app/shared/ecommerce/sales/create-sales';
import PageHeaderWithNavigation from '@/app/shared/page-header-w-nav';

export const metadata = {
  ...metaObject('Create a Sale'),
};

const pageHeader = {
  title: 'Create A Sale',
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
      name: 'Create',
    },
  ],
};

export default function CreateFlashSalePage() {
  return (
    <>
      <PageHeaderWithNavigation title={pageHeader.title} breadcrumb={pageHeader.breadcrumb} href={routes.eCommerce.flashSales} buttonText="Cancel" />
      <CreateSales />
    </>
  );
}
