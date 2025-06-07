import Link from 'next/link';
import { Metadata } from 'next';
import { routes } from '@/config/routes';
import { Button } from 'rizzui/button';
import { metaObject } from '@/config/site.config';
import PageHeader from '@/app/shared/page-header';
import EditCampaignWrapper from './edit-campaign-wrapper';
import { campaignsData } from '@/data/campaigns-data';

type Props = {
  params: Promise<{ id: string }>;
};

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const id = (await params).id;
  return metaObject(`Edit Campaign ${id}`);
}

const pageHeader = {
  title: 'Edit Campaign',
  breadcrumb: [
    {
      href: routes.eCommerce.dashboard,
      name: 'E-Commerce',
    },
    {
      href: routes.eCommerce.campaign,
      name: 'Campaigns',
    },
  ],
};

export default async function EditCampaignPage({ params }: any) {
  const id = (await params).id;
  const campaign = campaignsData.find((c) => c._id === id);

  return (
    <>
      <PageHeader
        title={pageHeader.title}
        breadcrumb={[
          ...pageHeader.breadcrumb,
          { name: id, href: '/' },
          { name: 'Edit' },
        ]}
      >
        <Link
          href={routes.eCommerce.campaign}
          className="mt-4 w-full @lg:mt-0 @lg:w-auto"
        >
          <Button as="span" className="w-full @lg:w-auto" variant="outline">
            Cancel
          </Button>
        </Link>
      </PageHeader>
      <EditCampaignWrapper campaign={campaign} />
    </>
  );
}
