import { Metadata } from 'next';
import PageHeader from '@/app/shared/page-header';
import { routes } from '@/config/routes';
import CreateShipmentForm from '@/app/shared/shipment/create-shipment-form';

export const metadata: Metadata = {
  title: 'Create Shipment | Admin Dashboard',
  description: 'Create a new shipment',
};

const pageHeader = {
  title: 'Create Shipment',
  breadcrumb: [
    {
  href: routes.eCommerce.logistics.home,
      name: 'Logistics',
    },
    {
  href: routes.eCommerce.shipment.shipmentList,
      name: 'Shipments',
    },
    {
      name: 'Create',
    },
  ],
};

export default function CreateShipmentPage() {
  return (
    <>
      <PageHeader title={pageHeader.title} breadcrumb={pageHeader.breadcrumb} />
      <CreateShipmentForm />
    </>
  );
}
