import { metaObject } from '@/config/site.config';
import { routes } from '@/config/routes';
import PageHeader from '@/app/shared/page-header';
import Link from 'next/link';
import { Button } from 'rizzui/button';
import { Text } from 'rizzui';

export const metadata = {
  ...metaObject('Create Order'),
};

const pageHeader = {
  title: 'Create Order',
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
      name: 'Create',
    },
  ],
};

export default function CreateOrderPage() {
  return (
    <>
      <PageHeader title={pageHeader.title} breadcrumb={pageHeader.breadcrumb}>
        <Link
          href={routes.eCommerce.orders}
          className="mt-4 w-full @lg:mt-0 @lg:w-auto"
        >
          <Button as="span" className="w-full @lg:w-auto" variant="outline">
            Cancel
          </Button>
        </Link>
      </PageHeader>
      <div className="p-6">
        <Text className="text-center text-gray-500">
          Manual order creation is coming soon. Orders are currently created
          through the checkout process.
        </Text>
      </div>
    </>
  );
}
