import { routes } from '@/config/routes';
import PageHeader from '@/app/shared/page-header';
import UsersTable from '@/app/shared/users/users-table';
import { metaObject } from '@/config/site.config';

export const metadata = {
  ...metaObject('Users Management'),
};

const pageHeader = {
  title: 'Users Management',
  breadcrumb: [
    {
      href: routes.eCommerce.dashboard,
      name: 'Dashboard',
    },
    {
      name: 'Users',
    },
  ],
};

export default function UsersPage() {
  return (
    <>
      <PageHeader title={pageHeader.title} breadcrumb={pageHeader.breadcrumb} />
      <UsersTable />
    </>
  );
}
