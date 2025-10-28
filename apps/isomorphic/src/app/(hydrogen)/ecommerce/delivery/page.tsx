import { metaObject } from '@/config/site.config';
import { routes } from '@/config/routes';
import PageHeader from '@/app/shared/page-header';
import DeliveryClient from '@/app/shared/ecommerce/delivery/DeliveryClient';

export const metadata = {
  ...metaObject('Delivery'),
};

export default function DeliveryPage() {
  const pageHeader = {
    title: 'Delivery',
    breadcrumb: [
      { href: routes.eCommerce.dashboard, name: 'E-Commerce' },
      { name: 'Delivery' },
    ],
  };

  return (
    <>
      <PageHeader title={pageHeader.title} breadcrumb={pageHeader.breadcrumb} />
      <DeliveryClient />
    </>
  );
}
