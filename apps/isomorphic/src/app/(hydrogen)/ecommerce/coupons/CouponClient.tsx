import Link from 'next/link';
import { routes } from '@/config/routes';
import { Button } from 'rizzui/button';
import PageHeader from '@/app/shared/page-header';
import CouponsTable from '@/app/shared/ecommerce/coupon/table';
import { PiPlusBold } from 'react-icons/pi';


export default function CouponsClient({ title, breadcrumb }: { title: string; breadcrumb: Array<{ href?: string; name: string }> }) {
  return (
    <>
      <PageHeader title={title} breadcrumb={breadcrumb}>
        <div className="mt-4 flex items-center gap-3 @lg:mt-0">
          {/* <ExportButton data={couponData} fileName="coupons_data" header="..." /> */}
          <Link
            href={routes.eCommerce.createCoupon}
            className="w-full @lg:w-auto"
          >
            <Button as="span" className="w-full @lg:w-auto">
              <PiPlusBold className="me-1.5 h-[17px] w-[17px]" />
              Create Coupon
            </Button>
          </Link>
        </div>
      </PageHeader>
      <CouponsTable />
    </>
  );
}
