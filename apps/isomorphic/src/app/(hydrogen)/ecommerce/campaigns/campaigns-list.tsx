'use client';

import Link from 'next/link';
import Image from 'next/image';
import { routes } from '@/config/routes';
import { Button, Badge, Text, Title } from 'rizzui';
import {
  PiPlusBold,
  PiEyeBold,
  PiPencilBold,
  PiTrashBold,
  PiTagBold,
  PiShoppingBagBold,
} from 'react-icons/pi';
import { campaignsData, CampaignDataType } from '@/data/campaigns-data';
import { useState } from 'react';
import cn from '@core/utils/class-names';

type FilterType = 'all' | 'active' | 'inactive';

export default function CampaignsList() {
  const [filter, setFilter] = useState<FilterType>('all');
  const [campaigns, setCampaigns] = useState<CampaignDataType[]>(campaignsData);

  const filteredCampaigns = campaigns.filter((campaign) => {
    if (!campaign.deleted) {
      if (filter === 'active') return campaign.isActive;
      if (filter === 'inactive') return !campaign.isActive;
      return true;
    }
    return false;
  });

  const handleDelete = (id: string) => {
    setCampaigns((prev) =>
      prev.map((campaign) =>
        campaign._id === id ? { ...campaign, deleted: true } : campaign
      )
    );
  };

  const handleToggleStatus = (id: string) => {
    setCampaigns((prev) =>
      prev.map((campaign) =>
        campaign._id === id
          ? { ...campaign, isActive: !campaign.isActive }
          : campaign
      )
    );
  };

  return (
    <div className="@container">
      {/* Header with Create Button */}
      <div className="mb-6 flex items-center justify-between">
        <div>
          <Title as="h2" className="text-xl font-semibold">
            Campaigns Management
          </Title>
          <Text className="mt-1 text-gray-600">
            Manage your marketing campaigns and promotions
          </Text>
        </div>
        <Link href={routes.eCommerce.createCampaign}>
          <Button className="w-full @lg:w-auto">
            <PiPlusBold className="me-1.5 h-[17px] w-[17px]" />
            Create Campaign
          </Button>
        </Link>
      </div>

      {/* Filter Buttons */}
      <div className="mb-6 flex gap-2">
        <Button
          variant={filter === 'all' ? 'solid' : 'outline'}
          onClick={() => setFilter('all')}
          className="rounded-lg"
        >
          All Campaigns ({campaigns.filter((c) => !c.deleted).length})
        </Button>
        <Button
          variant={filter === 'active' ? 'solid' : 'outline'}
          onClick={() => setFilter('active')}
          className="rounded-lg"
        >
          Active ({campaigns.filter((c) => !c.deleted && c.isActive).length})
        </Button>
        <Button
          variant={filter === 'inactive' ? 'solid' : 'outline'}
          onClick={() => setFilter('inactive')}
          className="rounded-lg"
        >
          Inactive ({campaigns.filter((c) => !c.deleted && !c.isActive).length})
        </Button>
      </div>

      {/* Campaigns Grid */}
      <div className="grid gap-6 @container @2xl:grid-cols-2 @5xl:grid-cols-3">
        {filteredCampaigns.map((campaign) => (
          <div
            key={campaign._id}
            className="group relative overflow-hidden rounded-lg border border-gray-200 bg-white p-6 transition-all duration-200 hover:border-gray-300 hover:shadow-md"
          >
            {/* Campaign Image */}
            <div className="mb-4 overflow-hidden rounded-lg">
              <Image
                src={campaign.image}
                alt={campaign.title}
                width={400}
                height={200}
                className="h-48 w-full object-cover transition-transform duration-200 group-hover:scale-105"
              />
            </div>

            {/* Campaign Info */}
            <div className="mb-4">
              <div className="mb-2 flex items-start justify-between">
                <Title as="h3" className="text-lg font-semibold">
                  {campaign.title}
                </Title>
                <Badge
                  color={campaign.isActive ? 'success' : 'secondary'}
                  className="shrink-0"
                >
                  {campaign.isActive ? 'Active' : 'Inactive'}
                </Badge>
              </div>

              <Text className="mb-3 line-clamp-2 text-gray-600">
                {campaign.description}
              </Text>

              {/* Campaign Stats */}
              <div className="mb-4 grid grid-cols-2 gap-4 rounded-lg bg-gray-50 p-3">
                <div className="flex items-center gap-2">
                  <PiShoppingBagBold className="h-4 w-4 text-blue-500" />
                  <div>
                    <Text className="text-xs text-gray-500">Products</Text>
                    <Text className="font-medium">
                      {campaign.children.products.length}
                    </Text>
                  </div>
                </div>
                <div className="flex items-center gap-2">
                  <PiTagBold className="h-4 w-4 text-green-500" />
                  <div>
                    <Text className="text-xs text-gray-500">Sales</Text>
                    <Text className="font-medium">
                      {campaign.children.sales.length}
                    </Text>
                  </div>
                </div>
              </div>

              {/* Created Date */}
              <Text className="text-xs text-gray-500">
                Created: {new Date(campaign.createdAt).toLocaleDateString()}
              </Text>
            </div>

            {/* Action Buttons */}
            <div className="flex gap-2">
              <Link
                href={routes.eCommerce.CampaignDetails(campaign._id)}
                className="flex-1"
              >
                <Button variant="outline" className="w-full" size="sm">
                  <PiEyeBold className="me-1 h-4 w-4" />
                  View
                </Button>
              </Link>

              <Link
                href={routes.eCommerce.editCampaign(campaign._id)}
                className="flex-1"
              >
                <Button variant="outline" className="w-full" size="sm">
                  <PiPencilBold className="me-1 h-4 w-4" />
                  Edit
                </Button>
              </Link>

              <Button
                variant="outline"
                size="sm"
                onClick={() => handleToggleStatus(campaign._id)}
                className={cn(
                  'shrink-0',
                  campaign.isActive
                    ? 'border-orange-200 text-orange-600 hover:bg-orange-50'
                    : 'border-green-200 text-green-600 hover:bg-green-50'
                )}
              >
                {campaign.isActive ? 'Deactivate' : 'Activate'}
              </Button>

              <Button
                variant="outline"
                size="sm"
                onClick={() => handleDelete(campaign._id)}
                className="shrink-0 border-red-200 text-red-600 hover:bg-red-50"
              >
                <PiTrashBold className="h-4 w-4" />
              </Button>
            </div>
          </div>
        ))}
      </div>

      {/* Empty State */}
      {filteredCampaigns.length === 0 && (
        <div className="flex min-h-[400px] flex-col items-center justify-center rounded-lg border-2 border-dashed border-gray-200 bg-gray-50">
          <PiTagBold className="mb-4 h-12 w-12 text-gray-400" />
          <Title as="h3" className="mb-2 text-lg font-semibold text-gray-600">
            No campaigns found
          </Title>
          <Text className="mb-4 text-gray-500">
            {filter === 'all'
              ? "You haven't created any campaigns yet."
              : `No ${filter} campaigns found.`}
          </Text>
          <Link href={routes.eCommerce.createCampaign}>
            <Button>
              <PiPlusBold className="me-1.5 h-4 w-4" />
              Create Your First Campaign
            </Button>
          </Link>
        </div>
      )}
    </div>
  );
}
