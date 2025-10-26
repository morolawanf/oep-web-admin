import type { Metadata } from 'next';
import { routes } from '@/config/routes';
import PageHeader from '@/app/shared/page-header';
import LogisticsConfigForm from '@/app/shared/logistics/config/logistics-form';

export const metadata: Metadata = {
  title: 'Create Logistics Configuration | OEPlast Admin',
  description: 'Add a new country with shipping pricing',
};

const pageHeader = {
  title: 'Create Logistics Configuration',
  breadcrumb: [
    {
  href: routes.eCommerce.logistics.home,
      name: 'Logistics',
    },
    {
      name: 'Create',
    },
  ],
};

export default function CreateLogisticsConfigPage() {
  return (
    <>
      <PageHeader title={pageHeader.title} breadcrumb={pageHeader.breadcrumb} />
      <LogisticsConfigForm />
    </>
  );
}
