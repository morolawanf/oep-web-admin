import type { Metadata } from 'next';
import PageHeader from '@/app/shared/page-header';
import { routes } from '@/config/routes';
import ReturnsClient from './returns-client';

export const metadata: Metadata = {
  title: 'Returns & Refunds | OEPlast Admin',
  description: 'Manage customer returns and process refunds',
};

const pageHeader = {
  title: 'Returns & Refunds',
  breadcrumb: [
    {
      href: routes.eCommerce.dashboard,
      name: 'Home',
    },
    {
      name: 'Returns',
    },
  ],
};

export default function ReturnsPage() {
  return (
    <>
      <PageHeader title={pageHeader.title} breadcrumb={pageHeader.breadcrumb} />
      <ReturnsClient />
    </>
  );
}
