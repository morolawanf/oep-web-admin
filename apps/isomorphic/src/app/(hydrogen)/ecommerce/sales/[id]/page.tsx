import { routes } from '@/config/routes';
import OneSaleView from '@/app/shared/ecommerce/sales/one-sale-view';
import PageHeaderWithNavigation from '@/app/shared/page-header-w-nav';
// import FlashSaleView from '@/app/shared/ecommerce/flash-sales/flash-sale-view'; // To be implemented

export default async function FlashSaleDetailsPage({ params }: any) {
  const id = (await params).id;
  const pageHeader = {
    title: `Sale #${id}`,
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
        name: id,
      },
    ],
  };
  return (
    <>
      <PageHeaderWithNavigation title={pageHeader.title} breadcrumb={pageHeader.breadcrumb} href={routes.eCommerce.editFlashSale(id)} buttonText='Edit sale'/>
      <OneSaleView id={id} />
    </>
  );
}
