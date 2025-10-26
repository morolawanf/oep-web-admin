import { Metadata } from 'next';
import Link from 'next/link';
import { Button } from 'rizzui';
import { PiPlusBold } from 'react-icons/pi';
import PageHeader from '@/app/shared/page-header';
import { routes } from '@/config/routes';
import ShipmentsTable from '@/app/shared/shipment/shipments-table';
import PageHeaderWithNavigation from '@/app/shared/page-header-w-nav';

export const metadata: Metadata = {
  title: 'Shipments | Admin Dashboard',
  description: 'Manage all shipments',
};

const pageHeader = {
  title: 'Shipments',
  breadcrumb: [
    {
  href: routes.eCommerce.logistics.home,
      name: 'Logistics',
    },
  ],
};

export default function ShipmentsPage() {
  return (
    <>
      <PageHeaderWithNavigation title={pageHeader.title} breadcrumb={pageHeader.breadcrumb}
  href={routes.eCommerce.shipment.createShipment}
      />
       
      <ShipmentsTable />
    </>
  );
}
