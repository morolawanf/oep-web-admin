import { Metadata } from 'next';
import { routes } from '@/config/routes';
import { metaObject } from '@/config/site.config';
import EditCoupon from '@/app/shared/ecommerce/coupon/edit-coupon';
import PageHeaderWithNavigation from '@/app/shared/page-header-w-nav';
// import CreateCoupon from '@/app/shared/ecommerce/coupons/create-coupon'; // To be implemented

type Props = {
  params: Promise<{ id: string }>;
};

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const id = (await params).id;
  return metaObject(`Edit ${id}`);
}

const pageHeader = {
  title: 'Edit Coupon',
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

export default async function EditCouponPage({ params }: any) {
  const id = (await params).id;
  return (
    <>
      <PageHeaderWithNavigation
        title={pageHeader.title}
        breadcrumb={[
          ...pageHeader.breadcrumb,
          { name: id, href: '.' },
          { name: 'Edit' },
        ]}
        href={routes.eCommerce.coupons}
        buttonText="Cancel"
      />

      <EditCoupon id={id} />
    </>
  );
}
