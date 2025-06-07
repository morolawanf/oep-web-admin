import { campaignsData, CampaignDataType } from '@/data/campaigns-data';
import { notFound } from 'next/navigation';
import OneCampaign from '@/app/shared/ecommerce/campaigns/one-campaign';
import { Button } from 'rizzui/button';
import { routes } from '@/config/routes';
import PageHeader from '@/app/shared/page-header';
import Link from 'next/link';

// Simulate fetch campaign by id
async function fetchCampaignById(id: string): Promise<CampaignDataType | null> {
  const campaign = campaignsData.find((c) => c._id === id);
  return campaign || null;
}

interface CampaignDetailsPageProps {
  params: Promise<{ id: string }>;
}

export default async function CampaignDetailsPage({
  params,
}: CampaignDetailsPageProps) {
  const { id } = await params;
  const campaign = await fetchCampaignById(id);

  if (!campaign) {
    notFound();
  }

  const pageHeader = {
    title: `Campaign -- ${campaign.title}`,
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
        name: campaign.title,
      },
    ],
  };

  return (
    <>
      <PageHeader title={pageHeader.title} breadcrumb={pageHeader.breadcrumb}>
        <Link
          href={routes.eCommerce.editCampaign(id)}
          className="mt-4 w-full @lg:mt-0 @lg:w-auto"
        >
          <Button as="span" className="w-full @lg:w-auto">
            Edit Campaign
          </Button>
        </Link>
      </PageHeader>
      <OneCampaign campaign={campaign} id={id} />
    </>
  );
}
