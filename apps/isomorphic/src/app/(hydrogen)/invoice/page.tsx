import { routes } from '@/config/routes';
import PageHeader from '@/app/shared/page-header';
import CreateFromOrderButton from '@/app/shared/invoice/create-from-order-button';
import CreateInvoice from '@/app/shared/invoice/create-invoice';
import { metaObject } from '@/config/site.config';

export const metadata = {
  ...metaObject('Create Invoice'),
};

const pageHeader = {
  title: 'Create Invoice',
  breadcrumb: [
    {
      href: routes.eCommerce.dashboard,
      name: 'Home',
    },
    {
      name: 'Create',
    },
  ],
};

export default function InvoiceCreatePage() {
  return (
    <>
      <PageHeader title={pageHeader.title} breadcrumb={pageHeader.breadcrumb}>
        <CreateFromOrderButton className="mt-4 @lg:mt-0" />
      </PageHeader>

      <CreateInvoice />
    </>
  );
}
