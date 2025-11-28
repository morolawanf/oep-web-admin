'use client';
import React from 'react';
import EditCampaign from '@/app/shared/ecommerce/campaign/edit-campaign';
import { routes } from '@/config/routes';
import PageHeaderWithNavigation from '@/app/shared/page-header-w-nav';

const EditCampaignClient = ({ id }: { id: string }) => {
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
      {
        href: routes.eCommerce.CampaignDetails(id),
        name: id,
      },
      {
        name: 'Edit',
      },
    ],
  };

  return (
    <>
      <PageHeaderWithNavigation title={pageHeader.title} breadcrumb={pageHeader.breadcrumb} href={routes.eCommerce.campaign} buttonText="Cancel" />
      <EditCampaign id={id} />
    </>
  );
};

export default EditCampaignClient;
