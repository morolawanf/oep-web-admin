import { Button } from 'rizzui/button';
import { routes } from '@/config/routes';
import PageHeader from '@/app/shared/page-header';
import Link from 'next/link';
import OneOrderNav from '@/app/shared/account-settings/navigation';
import PageHeaderWithNavigation from '@/app/shared/page-header-w-nav';

export default async function OrderDetailsPage({
  params,
  children,
}: {
  params: Promise<any>;
  children: React.ReactNode;
}) {
  const id = (await params).id;
  const pageHeader = {
    title: `Order #${id}`,
    breadcrumb: [
      {
        href: routes.eCommerce.dashboard,
        name: 'E-Commerce',
      },
      {
        href: routes.eCommerce.orders,
        name: 'Orders',
      },
      {
        name: id,
      },
    ],
  };

  const menuItemsForMiniNav = [
    {
      label: 'Main Details',
      value: routes.eCommerce.editOrder(id),
    },
    {
      label: 'Delivery',
      value: routes.eCommerce.editOrder(id) + '/delivery',
    },
  ];

  return (
    <>
      <PageHeaderWithNavigation title={pageHeader.title} breadcrumb={pageHeader.breadcrumb} href={routes.eCommerce.editOrder(id)}
        buttonText="Edit Order" />
      <OneOrderNav menuItems={menuItemsForMiniNav} />
      {children}
    </>
  );
}
