import { routes } from '@/config/routes';
import ReturnsView from '@/app/shared/ecommerce/returns/order-view';
import PageHeaderWithNavigation from '@/app/shared/page-header-w-nav';

export default async function ReturnsDetailsPage({ params }: any) {
  const id = (await params).id;
  const pageHeader = {
    title: `Returns #${id}`,
    breadcrumb: [
      {
        href: routes.eCommerce.dashboard,
        name: 'E-Commerce',
      },
      {
        href: routes.eCommerce.returns,
        name: 'Returnss',
      },
      {
        name: id,
      },
    ],
  };
  return (
    <>
      <PageHeaderWithNavigation title={pageHeader.title} breadcrumb={pageHeader.breadcrumb} href={routes.eCommerce.editReturns(id)} buttonText="Edit Returns" />
      <ReturnsView />
    </>
  );
}
