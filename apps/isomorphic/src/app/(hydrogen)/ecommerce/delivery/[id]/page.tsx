import { metaObject } from '@/config/site.config';
import { routes } from '@/config/routes';
import PageHeader from '@/app/shared/page-header';
import DeliveryDetailsClient from '@/app/shared/ecommerce/delivery/DeliveryDetailsClient';

export const metadata = {
  ...metaObject('Delivery Details'),
};

export default async function DeliveryDetailsPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;

  const pageHeader = {
    title: 'Delivery Details',
    breadcrumb: [
      { href: routes.eCommerce.dashboard, name: 'E-Commerce' },
      { href: routes.eCommerce.delivery.list, name: 'Delivery' },
      { name: id },
    ],
  };

  return (
    <>
      <PageHeader title={pageHeader.title} breadcrumb={pageHeader.breadcrumb} />
      <DeliveryDetailsClient id={id} />
    </>
  );
}
