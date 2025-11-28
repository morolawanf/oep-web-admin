import PageHeader from '@/app/shared/page-header';
import { Button } from 'rizzui/button';
import { routes } from '@/config/routes';
import Link from 'next/link';
import { metaObject } from '@/config/site.config';
import PageHeaderWithNavigation from '@/app/shared/page-header-w-nav';
// import CreateBanner from '@/app/shared/ecommerce/banners/create-banner'; // To be implemented

export const metadata = {
  ...metaObject('Create a Banner'),
};

const pageHeader = {
  title: 'Create A Banner',
  breadcrumb: [
    {
      href: routes.eCommerce.dashboard,
      name: 'E-Commerce',
    },
    {
      href: routes.eCommerce.banners,
      name: 'Banners',
    },
    {
      name: 'Create',
    },
  ],
};

export default function CreateBannerPage() {
  return (
    <>
      <PageHeaderWithNavigation title={pageHeader.title} breadcrumb={pageHeader.breadcrumb} href={routes.eCommerce.banners} buttonText="Cancel" />
      {/* <CreateBanner /> */}
      <div>Banner creation form goes here</div>
    </>
  );
}
