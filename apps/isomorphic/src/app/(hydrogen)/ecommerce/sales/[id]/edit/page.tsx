import { Metadata } from 'next';
import { routes } from '@/config/routes';
import { metaObject } from '@/config/site.config';
import EditSales from '@/app/shared/ecommerce/sales/edit-sales';
import PageHeaderWithNavigation from '@/app/shared/page-header-w-nav';

type Props = {
  params: Promise<{ id: string }>;
};

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const id = (await params).id;
  return metaObject(`Edit ${id}`);
}

const pageHeader = {
  title: 'Edit Sale',
  breadcrumb: [
    {
      href: routes.eCommerce.dashboard,
      name: 'E-Commerce',
    },
    {
      href: routes.eCommerce.flashSales,
      name: 'Sales',
    },
    {
      name: 'Edit',
    },
  ],
};

export default async function EditFlashSalePage({ params }: any) {
  const id = (await params).id;

  return (
    <>
      <PageHeaderWithNavigation title={pageHeader.title} breadcrumb={pageHeader.breadcrumb} href={routes.eCommerce.flashSales} buttonText="Cancel"/>
      <EditSales saleId={id} />
    </>
  );
}
