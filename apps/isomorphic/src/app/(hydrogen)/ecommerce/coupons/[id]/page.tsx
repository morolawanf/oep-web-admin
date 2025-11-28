import { routes } from '@/config/routes';
import { metaObject } from '@/config/site.config';
import CouponDetails from '@/app/shared/ecommerce/coupon/coupon-details';
import type { Metadata } from 'next';
import PageHeaderWithNavigation from '@/app/shared/page-header-w-nav';

type Props = {
  params: Promise<{ id: string }>;
};

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const id = (await params).id;
  return metaObject(`Coupon Details - ${id}`);
}

const pageHeader = {
  title: 'Coupon Details',
  breadcrumb: [
    {
      href: routes.eCommerce.dashboard,
      name: 'E-Commerce',
    },
    {
      href: routes.eCommerce.coupons,
      name: 'Coupons',
    },
  ],
};

export default async function CouponDetailsPage({ params }: Props) {
  const id = (await params).id;

  return (
    <>
      <PageHeaderWithNavigation
        title={pageHeader.title}
        breadcrumb={[
          ...pageHeader.breadcrumb,
          {
            name: id,
          },
        ]}
        href={routes.eCommerce.coupons}
        buttonText="Back to List"
      />
      <CouponDetails id={id} />
    </>
  );
}
