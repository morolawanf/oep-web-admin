'use client';

import { useRouter } from 'next/navigation';
import { CampaignDataType } from '@/data/campaigns-data';
import { routes } from '@/config/routes';
import EditCampaign from '@/app/shared/ecommerce/campaigns/edit-campaign';

interface EditCampaignWrapperProps {
  campaign?: CampaignDataType;
}

export default function EditCampaignWrapper({
  campaign,
}: EditCampaignWrapperProps) {
  const router = useRouter();

  const handleSubmit = (data: any) => {
    console.log('Campaign updated:', data);
    // Handle form submission here
    // You can add API call logic here

    // Navigate back to campaigns list after successful update
    router.push(routes.eCommerce.campaign);
  };

  return <EditCampaign campaign={campaign} onSubmit={handleSubmit} />;
}
