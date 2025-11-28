import PageHeader from '@/app/shared/page-header';
import { Button } from 'rizzui/button';
import { routes } from '@/config/routes';
import Link from 'next/link';
import { metaObject } from '@/config/site.config';
import CreateCampaign from '@/app/shared/ecommerce/campaign/create-campaign';
import PageHeaderWithNavigation from '@/app/shared/page-header-w-nav';

export const metadata = {
  ...metaObject('Create a Campaign'),
};

const pageHeader = {
  title: 'Create A Campaign',
  breadcrumb: [
    {
      href: routes.eCommerce.dashboard,
      name: 'E-Commerce',
    },
    {
      href: routes.eCommerce.campaign,
      name: 'Campaigns',
    },
    {
      name: 'Create',
    },
  ],
};

export default function CreateCampaignPage() {
  return (
    <>
      <PageHeaderWithNavigation title={pageHeader.title} breadcrumb={pageHeader.breadcrumb} href={routes.eCommerce.campaign} buttonText="Cancel" />
      <CreateCampaign />
    </>
  );
}
