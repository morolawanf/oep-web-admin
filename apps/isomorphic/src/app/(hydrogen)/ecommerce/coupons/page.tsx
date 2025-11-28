import { routes } from '@/config/routes';
import { metaObject } from '@/config/site.config';
import CouponsClient from './CouponClient';

export const metadata = {
  ...metaObject('Coupons'),
};

const pageHeader = {
  title: 'Coupons',
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
      name: 'All',
    },
  ],
};

export default function CouponsPage() {
  return (
    <>
      <CouponsClient title={pageHeader.title} breadcrumb={pageHeader.breadcrumb} />
    </>
  );
}
