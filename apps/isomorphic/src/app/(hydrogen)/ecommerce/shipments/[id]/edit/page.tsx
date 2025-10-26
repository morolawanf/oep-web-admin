import { Metadata } from 'next';
import PageHeader from '@/app/shared/page-header';
import { routes } from '@/config/routes';
import EditShipmentForm from '@/app/shared/shipment/edit-shipment-form';

export const metadata: Metadata = {
  title: 'Edit Shipment | Admin Dashboard',
  description: 'Edit shipment details',
};

interface EditShipmentPageProps {
  params: {
    id: string;
  };
}

export default function EditShipmentPage({ params }: EditShipmentPageProps) {
  const pageHeader = {
    title: 'Edit Shipment',
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
  href: routes.eCommerce.shipment.shipmentDetails(params.id),
        name: 'Details',
      },
      {
        name: 'Edit',
      },
    ],
  };

  return (
    <>
      <PageHeader title={pageHeader.title} breadcrumb={pageHeader.breadcrumb} />
      <EditShipmentForm shipmentId={params.id} />
    </>
  );
}
