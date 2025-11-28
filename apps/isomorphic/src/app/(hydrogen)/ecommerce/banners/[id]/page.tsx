import { Button } from 'rizzui/button';
import { routes } from '@/config/routes';
import PageHeader from '@/app/shared/page-header';
import Link from 'next/link';
import BannerDetails from './Client';
import PageHeaderWithNavigation from '@/app/shared/page-header-w-nav';

export default async function BannerDetailsPage({ params }: any) {
  const id = (await params).id;
  const pageHeader = {
    title: `Banner -- ${id}`,
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
        name: id,
      },
    ],
  };
  return (
    <>
      <PageHeaderWithNavigation title={pageHeader.title} breadcrumb={pageHeader.breadcrumb} href={routes.eCommerce.banners} buttonText="Back to List" />
      <BannerDetails bannerId={id} />
    </>
  );
}
