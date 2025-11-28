import { routes } from '@/config/routes';
import { metaObject } from '@/config/site.config';
import { Text } from 'rizzui';
import PageHeaderWithNavigation from '@/app/shared/page-header-w-nav';

type Props = {
  params: Promise<{ id: string }>;
};

export async function generateMetadata({ params }: Props) {
  const id = (await params).id;
  return metaObject(`Edit Order #${id}`);
}

export default async function EditOrderPage({ params }: any) {
  const id = (await params).id;

  const pageHeader = {
    title: `Edit Order #${id}`,
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
        name: 'Edit',
      },
    ],
  };

  return (
    <>
      <PageHeaderWithNavigation title={pageHeader.title} breadcrumb={pageHeader.breadcrumb} href={routes.eCommerce.orders} buttonText="Cancel" />
      <div className="p-6">
        <div className="text-center text-gray-500">
          Order editing functionality is coming soon. Currently, you can update
          order status, tracking, and process refunds from the order details
          drawer.
        </div>
      </div>
    </>
  );
}
