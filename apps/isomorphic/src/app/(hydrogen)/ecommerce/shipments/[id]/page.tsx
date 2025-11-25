import { Metadata } from 'next';
import PageHeader from '@/app/shared/page-header';
import { routes } from '@/config/routes';
import ShipmentDetails from '@/app/shared/shipment/shipment-details';

export const metadata: Metadata = {
  title: 'Shipment Details ',
  description: 'View shipment details',
};

interface ShipmentDetailsPageProps {
  params: {
    id: string;
  };
}

export default function ShipmentDetailsPage({
  params,
}: ShipmentDetailsPageProps) {
  const pageHeader = {
    title: 'Shipment Details',
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
        name: 'Details',
      },
    ],
  };

  return (
    <>
      <PageHeader title={pageHeader.title} breadcrumb={pageHeader.breadcrumb} />
      <ShipmentDetails shipmentId={params.id} />
    </>
  );
}
