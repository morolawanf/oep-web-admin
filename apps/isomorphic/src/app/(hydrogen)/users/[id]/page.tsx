import { routes } from '@/config/routes';
import PageHeader from '@/app/shared/page-header';
import UserDetailsClient from './user-details-client';
import { metaObject } from '@/config/site.config';

export const metadata = {
  ...metaObject('User Details'),
};

export default async function UserDetailsPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const pageHeader = {
    title: 'User Details',
    breadcrumb: [
      {
        href: routes.eCommerce.dashboard,
        name: 'Dashboard',
      },
      {
        href: routes.users.list,
        name: 'Users',
      },
      {
        name: 'Details',
      },
    ],
  };

  const userId = (await params).id;
  return (
    <>
      <PageHeader title={pageHeader.title} breadcrumb={pageHeader.breadcrumb} />
      <UserDetailsClient userId={userId} />
    </>
  );
}
