import PageHeader from '@/app/shared/page-header';
import { Button } from 'rizzui/button';
import { routes } from '@/config/routes';
import Link from 'next/link';
import { metaObject } from '@/config/site.config';
import CreateCoupon from '@/app/shared/ecommerce/coupon/create-coupon'; // To be implemented
import PageHeaderWithNavigation from '@/app/shared/page-header-w-nav';

export const metadata = {
  ...metaObject('Create a Coupon'),
};

const pageHeader = {
  title: 'Create A Coupon',
  breadcrumb: [
    {
      href: routes.eCommerce.dashboard,
      name: 'E-Commerce',
    },
    {
      href: routes.eCommerce.coupons,
      name: 'Coupons',
    },
    {
      name: 'Create',
    },
  ],
};

export default function CreateCouponPage() {
  return (
    <>
      <PageHeaderWithNavigation title={pageHeader.title} breadcrumb={pageHeader.breadcrumb} href={routes.eCommerce.coupons} buttonText="Cancel" />
      <CreateCoupon />
    </>
  );
}
