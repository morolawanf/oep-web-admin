import type { Metadata } from 'next';
import Link from 'next/link';
import { routes } from '@/config/routes';
import { Button } from 'rizzui/button';
import PageHeader from '@/app/shared/page-header';
import LogisticsConfigTable from '@/app/shared/logistics/config/table';
import { PiPlusBold } from 'react-icons/pi';
import PageHeaderWithNavigation from '@/app/shared/page-header-w-nav';

export const metadata: Metadata = {
  title: 'Logistics Configuration | OEPlast Admin',
  description: 'Manage shipping locations and pricing',
};

const pageHeader = {
  title: 'Logistics Configuration',
  breadcrumb: [
    {
  href: routes.eCommerce.logistics.home,
      name: 'Logistics',
    },
    
    {
      name: 'All Countries',
    },
  ],
};

export default function LogisticsConfigPage() {
  return (
    <>
      <PageHeaderWithNavigation title={pageHeader.title} breadcrumb={pageHeader.breadcrumb}
          href={routes.eCommerce.logistics.createConfig}
          buttonText="Add Country"
      
      />
       
      <LogisticsConfigTable />
    </>
  );
}
