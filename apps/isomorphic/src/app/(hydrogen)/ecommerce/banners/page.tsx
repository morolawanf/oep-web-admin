import { routes } from '@/config/routes';
import BannersTable from '@/app/shared/ecommerce/banners/banner-list/table';
import { metaObject } from '@/config/site.config';
import BannerPageHeader from './banner-page-header';

export const metadata = {
  ...metaObject('Banners'),
};

const pageHeader = {
  title: 'Banners',
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
      name: 'All',
    },
  ],
};

export default function BannersPage() {
  return (
    <>
      <BannerPageHeader
        title={pageHeader.title}
        breadcrumb={pageHeader.breadcrumb}
      />
      <BannersTable />
    </>
  );
}
